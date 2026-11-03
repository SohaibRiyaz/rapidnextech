import { NextResponse, type NextRequest } from "next/server"
import { Resend } from "resend"
import {
  REF_COOKIE,
  industryLabel,
  sanitizeRef,
  softwareLeadSubmissionSchema,
  type SoftwareLeadFieldErrors,
  type SoftwareLeadSubmission,
} from "@/lib/software-lead"
import { siteConfig } from "@/lib/site-config"

// Same verified sender and env vars as /api/pilot-request. Subjects are prefixed "[Software lead]"
// so these never get mixed up with dental pilot requests in the shared inbox.
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
  // Explicit parts: dateStyle/timeStyle can't be combined with timeZoneName (throws a TypeError).
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date)
}

const fallbackError = "We couldn't send your details right now."

function logError(stage: string, error: unknown) {
  // Never log submission contents (names, emails, phones, messages).
  const e = error as { name?: string; statusCode?: number } | undefined
  console.error(`[software-lead] ${stage}`, { name: e?.name ?? "unknown", statusCode: e?.statusCode })
}

function buildNotification(data: SoftwareLeadSubmission, submittedAt: Date, referredBy: string | null) {
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Company", data.company],
    ["Email", data.email],
    ["Phone / WhatsApp", data.phone || "—"],
    ["Country", data.country],
    ["Industry", industryLabel(data.industry)],
    ["Project type", data.projectType],
    ["Budget", data.budget ?? "—"],
    ["Timeline", data.timeline ?? "—"],
    ["Project details", data.message],
    ["Consent", data.consent ? "Yes" : "No"],
    ["Referred by", referredBy ?? "—"],
    ["Submitted (Riyadh)", formatIn(submittedAt, "Asia/Riyadh")],
    ["Submitted (UK)", formatIn(submittedAt, "Europe/London")],
    ["Submitted (Pakistan)", formatIn(submittedAt, "Asia/Karachi")],
    ["Form page", data.pageUrl || "—"],
    ["Landing page", data.landingUrl || "—"],
  ]
  for (const [key, value] of Object.entries(data.utm || {})) {
    if (value) rows.push([key, value])
  }

  const subject = `[Software lead] ${data.company} (${data.country}): ${data.projectType}`.replace(/\s+/g, " ")

  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#111827">
<h2 style="margin:0 0 12px">New software project enquiry</h2>
<table cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse;max-width:640px;width:100%">
${rows
  .map(
    ([k, v], i) =>
      `<tr style="background:${i % 2 ? "#ffffff" : "#f3f4f6"}"><td style="font-weight:bold;vertical-align:top;width:35%">${escapeHtml(
        k,
      )}</td><td style="vertical-align:top;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
  )
  .join("\n")}
</table>
<p style="color:#6b7280;font-size:12px">Reply to this email to respond directly to the prospect.</p>
</body></html>`

  const text = [
    "New software project enquiry",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Reply to this email to respond directly to the prospect.",
  ].join("\n")

  return { subject, html, text }
}

function buildConfirmation(data: SoftwareLeadSubmission) {
  const subject = "We received your project details | RapidNexTech"
  const summary = `${data.projectType} · ${industryLabel(data.industry)}`
  const text = [
    `Hello ${data.name},`,
    "",
    `Thank you for contacting RapidNexTech about ${data.company}. We've received your project details (${summary}).`,
    "",
    "We'll reply by email, usually within one business day, with questions or a suggested next step.",
    "",
    "If you'd like to add anything, simply reply to this email.",
    "",
    "RapidNexTech · The speed you need, the technology you trust.",
    siteConfig.url,
  ].join("\n")
  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.6">
<div style="max-width:560px">
<p style="font-size:18px;font-weight:bold;color:#1d4ed8;margin:0 0 16px">RapidNexTech</p>
<p>Hello ${escapeHtml(data.name)},</p>
<p>Thank you for contacting RapidNexTech about <strong>${escapeHtml(data.company)}</strong>. We've received your project details (${escapeHtml(summary)}).</p>
<p>We'll reply by email, usually within one business day, with questions or a suggested next step.</p>
<p>If you'd like to add anything, simply reply to this email.</p>
<p style="color:#6b7280;font-size:13px;margin-top:24px">RapidNexTech · The speed you need, the technology you trust.<br><a href="${siteConfig.url}" style="color:#6b7280">${siteConfig.url.replace("https://", "")}</a></p>
</div></body></html>`
  return { subject, html, text }
}

/* ------------------------------------------------------------------ */
/* Handler                                                             */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  try {
    if (rateLimited(clientIp(req))) {
      return NextResponse.json({ ok: false, error: "Too many requests. Please try again in a few minutes." }, { status: 429 })
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 })
    }

    const parsed = softwareLeadSubmissionSchema.safeParse(body)
    if (!parsed.success) {
      const fieldErrors: SoftwareLeadFieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof SoftwareLeadFieldErrors
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

    // Internal attribution only (set from ?ref= on the software pages; never shown to visitors).
    const referredBy = sanitizeRef(req.cookies.get(REF_COOKIE)?.value)

    /* -------------------------------------------------------------- */
    /* EXTENSION POINT: persist the lead (e.g. a Supabase table) here  */
    /* before sending emails. Not implemented: email delivery only.    */
    /* -------------------------------------------------------------- */

    const apiKey = process.env.RESEND_API_KEY
    const notifyTo = process.env.LEAD_NOTIFY_EMAIL
    if (!apiKey || !notifyTo) {
      logError("email not configured", { name: !apiKey ? "MissingResendApiKey" : "MissingLeadNotifyEmail" })
      return NextResponse.json({ ok: false, error: fallbackError }, { status: 503 })
    }

    const resend = new Resend(apiKey)
    const notification = buildNotification(data, new Date(), referredBy)
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

    // Confirmation to the prospect: only after the notification succeeded. A failure here
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
