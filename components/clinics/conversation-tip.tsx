"use client"

import { Info } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CONVERSATION_DEFINITION } from "@/lib/clinics-config"

/** Tap/click (not hover) popover explaining what a "conversation" is. 48px tap target. */
export function ConversationTip() {
  return (
    <Popover>
      <PopoverTrigger
        type="button"
        aria-label="What counts as a conversation?"
        className="-my-3 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Info className="h-4 w-4" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent side="top" collisionPadding={16} className="w-64 text-sm leading-relaxed">
        {CONVERSATION_DEFINITION} If the same patient messages again the next day, that is a new conversation.
      </PopoverContent>
    </Popover>
  )
}
