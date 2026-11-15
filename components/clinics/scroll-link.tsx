"use client"

import type { MouseEvent, ReactNode } from "react"
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics"

/**
 * In-page link ("Watch it handle a call ↓"). A plain #anchor without JavaScript; with it, it scrolls
 * smoothly (instantly with reduced motion) and, once the scroll settles, re-aligns if anything above
 * the target changed height on the way (e.g. the lazy-loaded example-call player), so the target
 * always lands just under the fixed header. The target's scroll-margin-top sets that offset.
 */
export function ScrollLink({
  targetId,
  event,
  params,
  className,
  children,
}: {
  targetId: string
  event?: AnalyticsEvent
  params?: Record<string, string>
  className?: string
  children: ReactNode
}) {
  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (event) trackEvent(event, params)
    const el = document.getElementById(targetId)
    if (!el) return
    e.preventDefault()
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const go = () => el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
    go()
    try {
      history.replaceState(null, "", `#${targetId}`)
    } catch {
      /* ignore */
    }

    // Wait until the page stops moving, then correct the landing spot (at most twice).
    let last = Number.NaN
    let still = 0
    let frames = 0
    let corrections = 0
    const check = () => {
      const top = el.getBoundingClientRect().top
      still = Math.abs(top - last) < 0.5 ? still + 1 : 0
      last = top
      if (still >= 8) {
        const wanted = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
        if (Math.abs(top - wanted) > 4 && corrections < 2) {
          corrections++
          still = 0
          go()
        } else {
          // Move keyboard / screen-reader focus to the target without scrolling again.
          if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1")
          el.focus({ preventScroll: true })
          return
        }
      }
      if (++frames < 600) requestAnimationFrame(check)
    }
    requestAnimationFrame(check)
  }

  return (
    <a href={`#${targetId}`} onClick={onClick} className={className}>
      {children}
    </a>
  )
}
