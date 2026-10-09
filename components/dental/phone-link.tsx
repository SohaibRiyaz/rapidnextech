"use client"

import type { ReactNode } from "react"
import { trackEvent } from "@/lib/analytics"
import { siteConfig, telHref } from "@/lib/site-config"

type PhoneLinkProps = {
  /** "public" = office line, "demo" = AI demo line. Tracked as separate events. */
  kind: "public" | "demo"
  /** Where on the page the link lives, sent with the event (no personal data). */
  location: string
  className?: string
  children?: ReactNode
}

/**
 * tel: link that reads its number from site-config and records a tel-click event.
 * Renders nothing for the demo kind while no demo number is configured, so no broken tel: links ship.
 */
export function PhoneLink({ kind, location, className, children }: PhoneLinkProps) {
  const phone = kind === "demo" ? siteConfig.demoPhone : siteConfig.publicPhone
  if (!phone) return null

  return (
    <a
      href={telHref(phone)}
      className={className}
      onClick={() => trackEvent(kind === "demo" ? "tel_click_demo" : "tel_click_public", { location })}
    >
      {children ?? phone.display}
    </a>
  )
}
