"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

/** Records clinics_page_view once, with the utm_source (e.g. linkedin, geo_banner) when present. */
export function ClinicsPageView() {
  useEffect(() => {
    let utmSource = "direct"
    try {
      utmSource = new URLSearchParams(window.location.search).get("utm_source")?.slice(0, 50) || "direct"
    } catch {
      /* ignore */
    }
    trackEvent("clinics_page_view", { utm_source: utmSource })
  }, [])
  return null
}
