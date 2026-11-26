import { NextResponse } from "next/server"
import { Resend } from "resend"
import { verify } from "retell-sdk"
import {
  agentKind,
  buildOwnerEmail,
  buildVisitorEmail,
  isEmptyCall,
  visitorEmail,
  type BuiltEmail,
  type RetellCall,
} from "@/lib/retell-call-emails"

/**
 * Retell agent webhook. Routes by agent_id (email content: lib/retell-call-emails.ts):
 * - HVAC agent ("Grace", HVAC_RETELL_AGENT_ID): HVAC job summary.
 * - Windows agent ("Emma", WINDOWS_RETELL_AGENT_ID): window & door job summary.
 * - Dental agent ("Maya", NEXT_PUBLIC_RETELL_AGENT_ID), or no dental id configured: the original dental
 *   summary, unchanged. (/clinics currently reuses the dental agent, so its calls land here too.)
 * - Any other agent: a generic summary of whatever the call analysis contains.
 * - Verifies x-retell-signature against the RAW body with RETELL_API_KEY (the key with the webhook badge).
 * - call_started / call_ended / anything else: acknowledged only.
 * - call_analyzed: emails one summary to LEAD_NOTIFY_EMAIL via the existing Resend sender. If the demo
 *   visitor left an email (metadata.visitor_email, dental / HVAC / windows only), they get a copy too.
 *   Nothing is stored: the visitor's email only travels in the call metadata and the two emails.
 * - Idempotency: each email carries a Resend idempotency key derived from the call id, so a Retell retry
 *   never sends a second copy (Resend keeps keys for 24h). A call without an id gets no visitor email.
 * Emails are sent before responding, because Vercel may stop work once the response is returned.
 * Retell waits 10s and retries up to 3 times on non-2xx, so this stays fast.
 */

export const dynamic = "force-dynamic"

const FROM = "RapidNexTech <notifications@rapidnextech.com>"

type RetellWebhook = { event?: string; call?: RetellCall }

function logError(stage: string, error: unknown) {
  // Never log call contents (names, numbers, emails, summaries).
  const e = error as { name?: string; statusCode?: number | null } | undefined
  console.error(`[retell-webhook] ${stage}`, { name: e?.name ?? "unknown", statusCode: e?.statusCode })
}

type SendResult = "sent" | "retry" | "failed"

/** Sends one email. An idempotency conflict means this exact email was already sent (or is being sent). */
async function send(resend: Resend, to: string, email: BuiltEmail, idempotencyKey: string | undefined, stage: string): Promise<SendResult> {
  try {
    const res = await resend.emails.send(
      { from: FROM, to: [to], subject: email.subject, html: email.html, text: email.text },
      idempotencyKey ? { idempotencyKey } : undefined,
    )
    if (!res.error) return "sent"
    if (res.error.name === "invalid_idempotent_request" || res.error.name === "concurrent_idempotent_requests") return "sent"
    logError(`${stage} send failed`, res.error)
    const code = res.error.statusCode ?? 500
    return code >= 500 || code === 429 ? "retry" : "failed"
  } catch (error) {
    logError(`${stage} send threw`, error)
    return "retry"
  }
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
  const kind = agentKind(call.agent_id)
  // Test calls, hang-ups and silence: nothing worth emailing.
  if (isEmptyCall(call, kind)) {
    return new NextResponse(null, { status: 204 })
  }

  const resendKey = process.env.RESEND_API_KEY
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL
  if (!resendKey || !notifyTo) {
    logError("email not configured", { name: !resendKey ? "MissingResendApiKey" : "MissingLeadNotifyEmail" })
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  const resend = new Resend(resendKey)
  const callId = typeof call.call_id === "string" && call.call_id ? call.call_id.slice(0, 200) : undefined
  const visitor = kind === "generic" ? null : visitorEmail(call)

  let owner: SendResult
  try {
    owner = await send(resend, notifyTo, buildOwnerEmail(call, kind, visitor), callId && `retell-owner/${callId}`, "owner email")
  } catch (error) {
    logError("owner email build threw", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
  if (owner !== "sent") return NextResponse.json({ ok: false }, { status: 502 })

  // Visitor copy: only with a call id (the idempotency key is what guarantees one email per call).
  if (visitor && callId) {
    const email = buildVisitorEmail(call, kind)
    if (email) {
      const result = await send(resend, visitor, email, `retell-visitor/${callId}`, "visitor email")
      // Transient failure: let Retell retry. The owner email above won't be sent twice (same key).
      if (result === "retry") return NextResponse.json({ ok: false }, { status: 502 })
    }
  }

  return new NextResponse(null, { status: 204 })
}
