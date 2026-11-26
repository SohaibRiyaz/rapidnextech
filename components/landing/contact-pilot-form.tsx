"use client"

import { useEffect, useState } from "react"
import { PilotForm, type PilotVertical } from "@/components/dental/pilot-form"
import { cn } from "@/lib/utils"

const OPTIONS: { value: PilotVertical; label: string }[] = [
  { value: "hvac", label: "HVAC company" },
  { value: "dental", label: "Dental practice" },
  { value: "windows", label: "Window & door company" },
]

/**
 * /contact: the visitor picks which pilot they want. HVAC (the main US offer) is selected by default;
 * links can preselect with ?vertical=dental, ?vertical=hvac or ?vertical=windows (the windows demo page
 * links here). The HVAC and dental forms and emails are the ones used on "/" and /dental.
 */
export function ContactPilotForm() {
  const [vertical, setVertical] = useState<PilotVertical>("hvac")

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("vertical")
      if (q === "dental" || q === "hvac" || q === "windows") setVertical(q)
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <div>
      <fieldset className="mb-4">
        <legend className="mb-2 text-sm font-semibold text-foreground">Your business</legend>
        <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-border bg-muted/40 p-1.5">
          {OPTIONS.map((o) => (
            <label key={o.value} className="relative">
              <input
                type="radio"
                name="contact-vertical"
                value={o.value}
                checked={vertical === o.value}
                onChange={() => setVertical(o.value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex h-full min-h-[48px] cursor-pointer items-center justify-center rounded-xl px-2 py-1.5 text-center text-sm leading-tight font-semibold transition-colors",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
                  vertical === o.value ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground hover:bg-background",
                )}
              >
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {/* key: a fresh form per vertical, so fields and errors never mix. */}
      <PilotForm key={vertical} location="contact" vertical={vertical} />
    </div>
  )
}
