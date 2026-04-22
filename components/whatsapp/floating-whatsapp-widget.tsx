"use client"

import { MessageCircle, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { WhatsAppDemoDialog } from "@/components/whatsapp/whatsapp-demo-dialog"

const WIDGET_HINT_DISMISSED_KEY = "wr-whatsapp-widget-hint-dismissed"

export function FloatingWhatsAppWidget() {
  const [isClient, setIsClient] = useState(false)
  const [hintDismissed, setHintDismissed] = useState(true)

  useEffect(() => {
    setIsClient(true)
    const dismissed = window.localStorage.getItem(WIDGET_HINT_DISMISSED_KEY) === "1"
    setHintDismissed(dismissed)
  }, [])

  const dismissHint = () => {
    setHintDismissed(true)
    window.localStorage.setItem(WIDGET_HINT_DISMISSED_KEY, "1")
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-2">
      {!hintDismissed && (
        <div className="relative max-w-[250px] rounded-xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur">
          <button
            type="button"
            onClick={dismissHint}
            className="absolute right-2 top-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Dismiss WhatsApp helper text"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="pr-5 text-xs font-semibold text-foreground">
            See the live WhatsApp demo in one click
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Tap the button, then send the first pre-filled message to start the demo flow.
          </p>
        </div>
      )}

      <WhatsAppDemoDialog
        contextLabel="Website floating widget"
        trigger={
          <Button
            type="button"
            size="icon"
            className="relative h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1fae56] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Open live WhatsApp demo"
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-[#25D366]/35 animate-ping"
            />
            <MessageCircle className="relative z-10 h-6 w-6" />
          </Button>
        }
      />
    </div>
  )
}
