/**
 * Vendor-neutral custom-event helper.
 *
 * Every event is pushed to `window.dataLayer` (GTM-compatible) and, when GA4 is loaded
 * (NEXT_PUBLIC_GA4_ID set, see app/layout.tsx), forwarded to `gtag("event", ...)`.
 * Page views are recorded separately by Vercel Analytics. Vercel custom events need a
 * paid plan, so custom events are intentionally not sent there.
 *
 * Never pass personal data (names, emails, phone numbers, message text) as params.
 */

export type AnalyticsEvent =
  | "tel_click_public"
  | "tel_click_demo"
  | "demo_start"
  | "pricing_cta_click"
  | "pilot_form_submit"

type EventParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(event: AnalyticsEvent, params: EventParams = {}) {
  if (typeof window === "undefined") return
  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...params })
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params)
    }
  } catch {
    // Analytics must never break the page.
  }
}
