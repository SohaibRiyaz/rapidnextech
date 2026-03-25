export interface StripeIntentPayload {
  planName: string
  stripeUrl: string
  pageLabel?: string
  pageUrl?: string
}

export function sendStripeIntent(payload: StripeIntentPayload) {
  if (typeof window === "undefined") return

  const body = JSON.stringify({
    ...payload,
    pageUrl: payload.pageUrl || window.location.href,
  })

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" })
    navigator.sendBeacon("/api/stripe-intent", blob)
    return
  }

  fetch("/api/stripe-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Best-effort only; ignore failures to avoid blocking checkout.
  })
}
