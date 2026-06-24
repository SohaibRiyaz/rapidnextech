"use client"

import { MessageCircle } from "lucide-react"
import { WhatsAppDemoDialog } from "@/components/whatsapp/whatsapp-demo-dialog"
import { Button } from "@/components/ui/button"

export function StickyDemoCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <div className="pointer-events-auto">
        <WhatsAppDemoDialog
          contextLabel="Lahore aesthetic clinics sticky mobile CTA"
          title="Try the Live WhatsApp Demo"
          description="Message the assistant like a patient — in Roman Urdu or English. See the full flow in under 2 minutes."
          helperText="Free, no commitment. 30 seconds to start."
          continueLabel="Open on WhatsApp →"
          showExternalIcon={false}
          trigger={
            <Button
              size="lg"
              className="w-full h-13 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all duration-200"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Try the Demo on WhatsApp — 30 seconds, free
            </Button>
          }
        />
      </div>
    </div>
  )
}
