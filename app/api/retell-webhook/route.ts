import { NextResponse } from "next/server"
import { Resend } from "resend"
import { verify } from "retell-sdk"

/**
 * Retell agent webhook for the dental demo agent ("Maya").
 * - Verifies x-retell-signature against the RAW body with RETELL_API_KEY (the key with the webhook badge).
 * - call_started / call_ended: acknowledged only.
 * - call_analyzed: emails one summary to LEAD_NOTIFY_EMAIL via the existing Resend sender.
 * The email is sent before responding, because Vercel may stop work once the response is returned.
 * Retell waits 10s and retries up to 3 times on non-2xx, so this stays fast.
 */

export const dynamic = "force-dynamic"

const FROM = "RapidNexTech <notifications@rapidnextech.com>"

type CustomAnalysis = {
  call_summary?: unknown
  patient_name?: unknown
  callback_number?: unknown
  new_patient?: unknown
  reason?: unknown
  urgency?: unknown
  insurance?: unknown
  preferred_times?: unknown
}

type RetellCall = {
  call_id?: string
  call_type?: string
  agent_id?: string
  start_timestamp?: number
  end_timestamp?: number
  call_analysis?: {
    call_summary?: string
    custom_analysis_data?: CustomAnalysis
  }
}

type RetellWebhook = { event?: string; call?: RetellCall }

function logError(stage: string, error: unknown) {
  // Never log call contents (names, numbers, summaries).
  const e = error as { name?: string; statusCode?: number } | undefined
  console.error(`[retell-webhook] ${stage}`, { name: e?.name ?? "unknown", statusCode: e?.statusCode })
}

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

/** Analysis values can be strings, booleans or numbers; empty and "unknown"-style values become "". */
function text(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (typeof value === "boolean") return value ? "Yes" : "No"
  const v = String(value).replace(/\s+/g, " ").trim()
  return /^(n\/?a|none|null|unknown|not provided)$/i.test(v) ? "" : v.slice(0, 1000)
}

function formatDuration(call: RetellCall) {
  if (!call.start_timestamp || !call.end_timestamp) return "—"
  const seconds = Math.max(0, Math.round((call.end_timestamp - call.start_timestamp) / 1000))
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`
}

function buildEmail(call: RetellCall) {
  const data = call.call_analysis?.custom_analysis_data ?? {}
  const summary = text(call.call_analysis?.call_summary) || text(data.call_summary)
  const name = text(data.patient_name)
  const reason = text(data.reason)
  const urgency = text(data.urgency).toUpperCase() || "UNKNOWN"
  const when = new Date(call.end_timestamp || Date.now())

  const rows: [string, string][] = [
    ["Urgency", urgency],
    ["Patient name", name || "—"],
    ["Callback number", text(data.callback_number) || "—"],
    ["New patient", text(data.new_patient) || "—"],
    ["Reason", reason || "—"],
    ["Insurance", text(data.insurance) || "—"],
    ["Preferred times", text(data.preferred_times) || "—"],
    ["Call type", call.call_type === "web_call" ? "Web (browser demo)" : call.call_type === "phone_call" ? "Phone" : text(call.call_type) || "—"],
    ["Duration", formatDuration(call)],
    ["Call ID", text(call.call_id) || "—"],
    ["Time (New York)", formatIn(when, "America/New_York")],
    ["Time (Pakistan)", formatIn(when, "Asia/Karachi")],
  ]

  const subject = `[Demo call] ${urgency} – ${name || "Unknown"} – ${reason || "No reason given"}`.slice(0, 200)

  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#111827">
<h2 style="margin:0 0 12px">Demo call summary</h2>
<p style="max-width:640px;line-height:1.5;white-space:pre-wrap">${escapeHtml(summary || "No summary was generated for this call.")}</p>
<table cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse;max-width:640px;width:100%">
${rows
  .map(
    ([k, v], i) =>
      `<tr style="background:${i % 2 ? "#ffffff" : "#f3f4f6"}"><td style="font-weight:bold;vertical-align:top;width:35%">${escapeHtml(
        k,
      )}</td><td style="vertical-align:top">${escapeHtml(v)}</td></tr>`,
  )
  .join("\n")}
</table>
</body></html>`

  const textBody = ["Demo call summary", "", summary || "No summary was generated for this call.", "", ...rows.map(([k, v]) => `${k}: ${v}`)].join("\n")

  return { subject, html, text: textBody }
}

export async function POST(req: Request) {
  const apiKey = process.env.RETELL_API_KEY
  if (!apiKey) {
    logError("not configured", { name: "MissingRetellApiKey" })
    // 500 so Retell retries once the key is set, rather than silently dropping events.
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  // Signature is computed over the exact raw body: read it as text, never re-serialise.
  const rawBody = await req.text()
  const signature = req.headers.get("x-retell-signature")
  let valid = false
  try {
    valid = Boolean(signature) && (await verify(rawBody, apiKey, signature as string))
  } catch (error) {
    logError("signature check threw", error)
  }
  if (!valid) return NextResponse.json({ ok: false }, { status: 401 })

  let payload: RetellWebhook
  try {
    payload = JSON.parse(rawBody) as RetellWebhook
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  if (payload.event !== "call_analyzed" || !payload.call) {
    // call_started, call_ended and anything else: acknowledge only.
    return new NextResponse(null, { status: 204 })
  }

  const call = payload.call
  const data = call.call_analysis?.custom_analysis_data ?? {}
  if (!text(data.patient_name) && !text(data.callback_number) && !text(data.reason)) {
    // Test calls, hang-ups and silence: nothing worth emailing.
    return new NextResponse(null, { status: 204 })
  }

  /* ---------------------------------------------------------------- */
  /* EXTENSION POINT (idempotency): Retell can deliver the same event  */
  /* more than once. With no database, a retry may send a duplicate    */
  /* email. Once a store exists, skip here if `call_analyzed:<call_id>` */
  /* was already processed, and record it after the email is sent.      */
  /* ---------------------------------------------------------------- */

  const resendKey = process.env.RESEND_API_KEY
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL
  if (!resendKey || !notifyTo) {
    logError("email not configured", { name: !resendKey ? "MissingResendApiKey" : "MissingLeadNotifyEmail" })
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  try {
    const email = buildEmail(call)
    const sent = await new Resend(resendKey).emails.send({
      from: FROM,
      to: [notifyTo],
      subject: email.subject,
      html: email.html,
      text: email.text,
    })
    if (sent.error) {
      logError("email send failed", sent.error)
      return NextResponse.json({ ok: false }, { status: 502 })
    }
  } catch (error) {
    logError("email send threw", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
