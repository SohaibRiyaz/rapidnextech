"use client"

import { useEffect } from "react"
import { REF_COOKIE, REF_COOKIE_MAX_AGE, sanitizeFor, sanitizeRef } from "@/lib/software-lead"
import { UTM_KEYS } from "@/lib/pilot-request"

/** sessionStorage keys read by the start-a-project form. */
export const ATTRIBUTION_KEYS = {
  landing: "rnt-sw-landing",
  utm: "rnt-sw-utm",
  forCompany: "rnt-sw-for",
} as const

/**
 * Mounted only on the /software sales routes. Records, for internal lead attribution:
 * - ?ref=<code>  -> first-party cookie for 90 days (read server-side when a lead is submitted)
 * - first landing URL and UTM params -> sessionStorage
 * - ?for=<Company> -> sessionStorage, to prefill the Company field
 * Nothing here is displayed, and nothing is sent anywhere until the visitor submits the form.
 */
export function SoftwareAttribution() {
  useEffect(() => {
    try {
      const url = new URL(window.location.href)
      const params = url.searchParams

      const ref = sanitizeRef(params.get("ref"))
      if (ref) {
        const secure = window.location.protocol === "https:" ? "; Secure" : ""
        document.cookie = `${REF_COOKIE}=${ref}; Max-Age=${REF_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`
      }

      if (!sessionStorage.getItem(ATTRIBUTION_KEYS.landing)) {
        // Strip ?for= (a company name) before storing the landing URL.
        params.delete("for")
        sessionStorage.setItem(ATTRIBUTION_KEYS.landing, `${url.origin}${url.pathname}${params.toString() ? `?${params}` : ""}`.slice(0, 500))
      }

      const utm: Record<string, string> = {}
      for (const key of UTM_KEYS) {
        const v = new URLSearchParams(window.location.search).get(key)
        if (v) utm[key] = v.slice(0, 300)
      }
      if (Object.keys(utm).length) sessionStorage.setItem(ATTRIBUTION_KEYS.utm, JSON.stringify(utm))

      const forCompany = sanitizeFor(new URLSearchParams(window.location.search).get("for"))
      if (forCompany) sessionStorage.setItem(ATTRIBUTION_KEYS.forCompany, forCompany)
    } catch {
      /* storage or cookies blocked: attribution is best-effort */
    }
  }, [])

  return null
}
