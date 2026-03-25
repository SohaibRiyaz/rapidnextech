import { NextResponse } from "next/server"
import { Resend } from "resend"

type StripeIntentPayload = {
  planName?: string
  stripeUrl?: string
  pageLabel?: string
  pageUrl?: string
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is missing")
      return NextResponse.json({ error: "Mail service unconfigured" }, { status: 500 })
    }

    const raw = await req.text()
    let payload: StripeIntentPayload = {}
    try {
      payload = raw ? (JSON.parse(raw) as StripeIntentPayload) : {}
    } catch {
      payload = {}
    }

    const planName = payload.planName ? escapeHtml(payload.planName) : "Unknown plan"
    const stripeUrl = payload.stripeUrl ? escapeHtml(payload.stripeUrl) : "Not provided"
    const pageLabel = payload.pageLabel ? escapeHtml(payload.pageLabel) : "Unknown page"
    const pageUrl = payload.pageUrl ? escapeHtml(payload.pageUrl) : "Not provided"
    const userAgent = escapeHtml(req.headers.get("user-agent") || "Unknown")
    const timestamp = new Date().toISOString()

    const data = await resend.emails.send({
      from: "RapidNexTech <notifications@rapidnextech.com>",
      to: ["sohaib@rapidnextech.com", "sohaibriaz201@gmail.com"],
      subject: `Checkout Click: ${planName}`,
      html: `
        <h2>Stripe Checkout Click (Intent Only)</h2>
        <p>This is a click to checkout, not a confirmed payment.</p>
        <p><strong>Plan:</strong> ${planName}</p>
        <p><strong>Page:</strong> ${pageLabel}</p>
        <p><strong>Page URL:</strong> ${pageUrl}</p>
        <p><strong>Stripe URL:</strong> ${stripeUrl}</p>
        <p><strong>Time (UTC):</strong> ${timestamp}</p>
        <p><strong>User Agent:</strong> ${userAgent}</p>
      `,
    })

    if (data.error) {
      console.error("Resend API Error:", data.error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Stripe intent API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
