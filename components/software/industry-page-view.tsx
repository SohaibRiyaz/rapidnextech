"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"
import { REF_COOKIE, sanitizeRef } from "@/lib/software-lead"

/** Fires industry_page_view once per page load with the slug and, if present, the referral code. */
export function IndustryPageView({ slug }: { slug: string }) {
  useEffect(() => {
    let ref: string | null = null
    try {
      ref = sanitizeRef(new URLSearchParams(window.location.search).get("ref"))
      if (!ref) {
        const match = document.cookie.match(new RegExp(`(?:^|; )${REF_COOKIE}=([^;]*)`))
        ref = sanitizeRef(match?.[1])
      }
    } catch {
      /* cookies blocked */
    }
    trackEvent("industry_page_view", { slug, ref: ref ?? undefined })
  }, [slug])

  return null
}
