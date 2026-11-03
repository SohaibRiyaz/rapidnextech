"use client"

import { useEffect, useState } from "react"
import { sanitizeFor } from "@/lib/software-lead"

/**
 * "Prepared for <Company>" from ?for=. Rendered in the browser only, so the static HTML (what
 * search engines index) never contains the name. React escapes the text; sanitizeFor limits it
 * to letters, digits and basic punctuation, max 60 chars.
 */
export function PreparedFor() {
  const [company, setCompany] = useState<string | null>(null)

  useEffect(() => {
    try {
      const value = sanitizeFor(new URLSearchParams(window.location.search).get("for"))
      setCompany(value)
      // Belt and braces with the X-Robots-Tag header from middleware.ts.
      if (value) {
        let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
        if (!meta) {
          meta = document.createElement("meta")
          meta.name = "robots"
          document.head.appendChild(meta)
        }
        meta.content = "noindex, follow"
      }
    } catch {
      /* ignore */
    }
  }, [])

  if (!company) return null

  return (
    <p className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
      <span className="truncate">
        Prepared for <span className="font-semibold text-foreground">{company}</span>
      </span>
    </p>
  )
}
