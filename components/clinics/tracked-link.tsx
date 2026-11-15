"use client"

import type { ReactNode } from "react"
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics"

type Props = {
  href: string
  event: AnalyticsEvent
  params?: Record<string, string>
  className?: string
  children: ReactNode
  /** Opens in a new tab (WhatsApp links). */
  external?: boolean
}

/** A plain link that records one analytics event on click. */
export function TrackedLink({ href, event, params, className, children, external = true }: Props) {
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => trackEvent(event, params)}
    >
      {children}
      {external ? <span className="sr-only"> (opens WhatsApp in a new tab)</span> : null}
    </a>
  )
}
