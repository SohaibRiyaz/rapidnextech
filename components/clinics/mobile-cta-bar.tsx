"use client"

import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import { primaryCta } from "@/components/dental/styles"
import { trackEvent } from "@/lib/analytics"
import { PILOT_WHATSAPP_URL } from "@/lib/clinics-config"
import { cn } from "@/lib/utils"

/**
 * Phones only (< 768px): a slim bar fixed to the bottom of the screen with the main action.
 * Appears once the hero has scrolled away and hides again when the final call-to-action comes into
 * view (it has the same buttons), so it never covers the footer. Fixed + transform only: no layout shift.
 */
export function ClinicsMobileCtaBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hero = document.querySelector('section[aria-labelledby="clinics-title"]')
    const finalCta = document.querySelector('section[aria-labelledby="clinics-final-title"]')
    if (!hero || !finalCta) return
    let raf = 0
    const update = () => {
      raf = 0
      const pastHero = hero.getBoundingClientRect().bottom < 0
      const beforeFinal = finalCta.getBoundingClientRect().top > window.innerHeight
      setShow(pastHero && beforeFinal)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      aria-hidden={!show}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:hidden",
        "motion-safe:transition-transform motion-safe:duration-300",
        show ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
    >
      <a
        href={PILOT_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={show ? 0 : -1}
        onClick={() => trackEvent("clinics_sticky_cta_click")}
        className={`${primaryCta} w-full`}
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        Start free pilot on WhatsApp
        <span className="sr-only"> (opens WhatsApp in a new tab)</span>
      </a>
    </div>
  )
}
