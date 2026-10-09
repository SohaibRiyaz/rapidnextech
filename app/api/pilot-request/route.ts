import { NextResponse } from "next/server"
import { Resend } from "resend"
import { pilotSubmissionSchema, type PilotFieldErrors, type PilotSubmission } from "@/lib/pilot-request"
import { siteConfig } from "@/lib/site-config"

// Same sender as the existing /api/contact and /api/stripe-intent routes (verified domain).
const FROM = "RapidNexTech <notifications@rapidnextech.com>"
const DEFAULT_CONFIRMATION_REPLY_TO = "contact@rapidnextech.com"
const MIN_FILL_MS = 3000

/* ------------------------------------------------------------------ */
/* Best-effort per-IP rate limit (in-memory, per server instance)      */
/* ------------------------------------------------------------------ */
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000
const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key)
    }
  }
  return recent.length > RATE_LIMIT
}

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function formatIn(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    dateStyle: "medium",
    timeStyle: "short",
    timeZoneName: "short",
  }).format(date)
}

const fallbackError = `We couldn't send your request right now. Please call us at ${siteConfig.publicPhone.display} or email ${siteConfig.email}.`

function logError(stage: string, error: unknown) {
  // Never log submission contents (names, emails, phones, messages).
  const e = error as { name?: string; statusCode?: number } | undefined
  console.error(`[pilot-request] ${stage}`, { name: e?.name ?? "unknown", statusCode: e?.statusCode })
}

function buildNotification(data: PilotSubmission, submittedAt: Date) {
  const rows: [string, string][] = [
    ["Practice name", data.practiceName],
    ["Owner / decision-maker", data.ownerName],
    ["Email", data.email],
    ["Phone", data.phone],
    ["City / state", data.cityState],
    ["After-hours calls per week", data.callsPerWeek ?? "—"],
    ["Phone system", data.phoneSystem ?? "—"],
    ["Practice management software", data.practiceSoftware ?? "—"],
    ["When should the AI answer?", data.answerWhen ?? "—"],
    ["Plan interest", data.planInterest ?? "—"],
    ["Message", data.message || "—"],
    ["Consent", data.consent ? "Yes" : "No"],
    ["Submitted (US Eastern)", formatIn(submittedAt, "America/New_York")],
    ["Submitted (Pakistan)", formatIn(submittedAt, "Asia/Karachi")],
    ["Page URL", data.pageUrl || "—"],
  ]
  for (const [key, value] of Object.entries(data.utm || {})) {
    if (value) rows.push([key, value])
  }

  const subject = `New dental pilot request: ${data.practiceName} (${data.cityState})`

  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#111827">
<h2 style="margin:0 0 12px">New dental pilot request</h2>
<table cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse;max-width:640px;width:100%">
${rows
  .map(
    ([k, v], i) =>
      `<tr style="background:${i % 2 ? "#ffffff" : "#f3f4f6"}"><td style="font-weight:bold;vertical-align:top;width:40%">${escapeHtml(
        k,
      )}</td><td style="vertical-align:top;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
  )
  .join("\n")}
</table>
<p style="color:#6b7280;font-size:12px">Reply to this email to respond directly to the practice.</p>
</body></html>`

  const text = ["New dental pilot request", "", ...rows.map(([k, v]) => `${k}: ${v}`), "", "Reply to this email to respond directly to the practice."].join("\n")

  return { subject, html, text }
}

function buildConfirmation(data: PilotSubmission) {
  const phone = siteConfig.publicPhone.display
  const subject = `We received your pilot request for ${data.practiceName}`
  const text = [
    `Thanks, ${data.ownerName}.`,
    "",
    `We received your pilot request for ${data.practiceName}. We'll email you ${siteConfig.copy.pilotResponseTime} to schedule your 30-min onboarding call.`,
    "",
    `Questions? Reply to this email or call ${phone}.`,
    "",
    "RapidNexTech · AI receptionist for dental practices",
  ].join("\n")
  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.6">
<div style="max-width:560px">
<p style="font-size:18px;font-weight:bold;color:#1d4ed8;margin:0 0 16px">RapidNexTech</p>
<p>Thanks, ${escapeHtml(data.ownerName)}.</p>
<p>We received your pilot request for <strong>${escapeHtml(data.practiceName)}</strong>. We'll email you ${escapeHtml(
    siteConfig.copy.pilotResponseTime,
  )} to schedule your 30-min onboarding call.</p>
<p>Questions? Reply to this email or call <a href="tel:${siteConfig.publicPhone.e164}">${escapeHtml(phone)}</a>.</p>
<p style="color:#6b7280;font-size:13px;margin-top:24px">RapidNexTech · AI receptionist for dental practices</p>
</div></body></html>`
  return { subject, html, text }
}

/* ------------------------------------------------------------------ */
/* Handler                                                             */
/* ------------------------------------------------------------------ */
export async function POST(req: Request) {
  try {
    if (rateLimited(clientIp(req))) {
      return NextResponse.json(
        { ok: false, error: `Too many requests. Please try again in a few minutes, or call ${siteConfig.publicPhone.display}.` },
        { status: 429 },
      )
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 })
    }

    const parsed = pilotSubmissionSchema.safeParse(body)
    if (!parsed.success) {
      const fieldErrors: PilotFieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof PilotFieldErrors
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
      }
      return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 400 })
    }
    const data = parsed.data

    // Spam checks: honeypot filled, or submitted faster than a human could. Pretend success.
    const tooFast = typeof data.startedAt === "number" && Date.now() - data.startedAt < MIN_FILL_MS
    if (data.website || tooFast) {
      return NextResponse.json({ ok: true })
    }

    /* -------------------------------------------------------------- */
    /* EXTENSION POINT: persist the request to Supabase here.          */
    /* e.g. insert `data` (minus honeypot/startedAt) into a            */
    /* `pilot_requests` table before sending emails. Not implemented   */
    /* yet: submissions are delivered by email only.                   */
    /* -------------------------------------------------------------- */

    const apiKey = process.env.RESEND_API_KEY
    const notifyTo = process.env.LEAD_NOTIFY_EMAIL
    if (!apiKey || !notifyTo) {
      logError("email not configured", { name: !apiKey ? "MissingResendApiKey" : "MissingLeadNotifyEmail" })
      return NextResponse.json({ ok: false, error: fallbackError }, { status: 503 })
    }

    const resend = new Resend(apiKey)
    const submittedAt = new Date()

    const notification = buildNotification(data, submittedAt)
    const sent = await resend.emails.send({
      from: FROM,
      to: [notifyTo],
      replyTo: data.email,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    })
    if (sent.error) {
      logError("notification send failed", sent.error)
      return NextResponse.json({ ok: false, error: fallbackError }, { status: 502 })
    }

    // Confirmation to the practice: only after the notification succeeded. A failure here
    // doesn't fail the request, because the lead has already been delivered.
    try {
      const confirmation = buildConfirmation(data)
      const confirmed = await resend.emails.send({
        from: FROM,
        to: [data.email],
        replyTo: process.env.CONFIRMATION_REPLY_TO || DEFAULT_CONFIRMATION_REPLY_TO,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
      })
      if (confirmed.error) logError("confirmation send failed", confirmed.error)
    } catch (error) {
      logError("confirmation send threw", error)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    logError("unexpected error", error)
    return NextResponse.json({ ok: false, error: fallbackError }, { status: 500 })
  }
}
