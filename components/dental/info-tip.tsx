"use client"

import { Info } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

/** Accessible info tip: opens on click/tap or Enter/Space, closes on Escape or outside click. */
export function InfoTip({ label, text }: { label: string; text: string }) {
  return (
    <Popover>
      <PopoverTrigger
        type="button"
        aria-label={label}
        className="inline-flex h-11 w-11 -my-3 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Info className="h-4 w-4" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent side="top" className="w-64 text-sm leading-relaxed">
        {text}
      </PopoverContent>
    </Popover>
  )
}
