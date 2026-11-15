"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ArrowRight, X } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

/**
 * Homepage strip for visitors in the Gulf or Egypt, pointing to /clinics.
 *
 * The homepage stays static: middleware.ts sets the `rnt_geo` cookie (a 2-letter country code) only for
 * AE, QA, SA, KW, BH, OM and EG, using Vercel's geo header. The strip is in the HTML for everyone but
 * hidden; an inline script right after it shows it before the first paint when the cookie is present
 * and the visitor hasn't dismissed it, so nothing moves once the page is visible.
 */

const ID = "geo-banner"
const COOKIE = "rnt_geo"
const DISMISS_KEY = "rnt_geo_banner_dismissed"
const HREF = "/clinics?utm_source=geo_banner"

/** Inline pre-paint check (mirrors readCountry below). Returns the country code or "". */
const decide = `function(){try{var m=document.cookie.match(/(?:^|; )${COOKIE}=([A-Z]{2})(?:;|$)/);if(!m)return"";try{if(localStorage.getItem("${DISMISS_KEY}"))return""}catch(e){}return m[1]}catch(e){return""}}`
const INLINE_SCRIPT = `(function(){var c=(${decide})();if(!c)return;var el=document.getElementById("${ID}");if(el){el.setAttribute("data-show","1");el.setAttribute("data-country",c)}})()`

/** Same logic as the inline script, for client-side navigation. */
function readCountry() {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([A-Z]{2})(?:;|$)`))
    if (!m) return ""
    try {
      if (localStorage.getItem(DISMISS_KEY)) return ""
    } catch {
      /* storage blocked: still show */
    }
    return m[1]
  } catch {
    return ""
  }
}

// Runs before paint on client-side navigation (where React doesn't execute inline scripts).
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

export function GeoBanner() {
  const ref = useRef<HTMLDivElement>(null)
  const [dismissed, setDismissed] = useState(false)

  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el || el.dataset.show === "1") return
    const country = readCountry()
    if (country) {
      el.dataset.show = "1"
      el.dataset.country = country
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (el?.dataset.show === "1") trackEvent("geo_banner_view", { country: el.dataset.country })
  }, [])

  if (dismissed) return null

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1")
    } catch {
      /* storage blocked: hide for this visit only */
    }
    setDismissed(true)
  }

  return (
    <>
      <div
        ref={ref}
        id={ID}
        data-show="0"
        suppressHydrationWarning
        role="region"
        aria-label="Clinics in the Gulf and Egypt"
        // In flow under the fixed header (h-20). The negative bottom margin keeps the hero's own
        // spacing below the strip unchanged.
        className="relative z-20 mt-20 -mb-20 hidden border-b border-primary/20 bg-primary text-primary-foreground data-[show='1']:block"
      >
        <div className="container mx-auto flex items-center gap-2 px-4 sm:px-6">
          <Link
            href={HREF}
            onClick={() => trackEvent("geo_banner_click", { country: ref.current?.dataset.country })}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-1.5 py-2 text-center text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground rounded sm:text-base"
          >
            <span>
              In the Gulf or Egypt? See our WhatsApp + AI calling for clinics{" "}
              <ArrowRight className="inline h-4 w-4 align-[-2px]" aria-hidden="true" />
            </span>
          </Link>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: INLINE_SCRIPT }} />
    </>
  )
}
