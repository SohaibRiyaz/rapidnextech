"use client"

import type React from "react"
import { ExternalLink, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getWhatsAppDemoUrl, WHATSAPP_DEMO_PHONE_DISPLAY } from "@/lib/whatsapp-demo"

interface WhatsAppDemoDialogProps {
  trigger: React.ReactElement
  contextLabel?: string
  title?: string
  description?: string
  continueLabel?: string
  helperText?: string
  showExternalIcon?: boolean
  autoOpen?: boolean
}

export function WhatsAppDemoDialog({
  trigger,
  contextLabel,
  title = "Open Live WhatsApp Demo",
  description = "You are about to open our live WhatsApp demo assistant in a new tab.",
  continueLabel = "Continue to WhatsApp",
  helperText = "A first message is pre-filled for you. Send it to start the live demo flow instantly.",
  showExternalIcon = true,
  autoOpen = false,
}: WhatsAppDemoDialogProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (autoOpen) {
      setOpen(true)
    }
  }, [autoOpen])

  const handleContinue = () => {
    const targetUrl = getWhatsAppDemoUrl(contextLabel)
    window.open(targetUrl, "_blank", "noopener,noreferrer")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MessageCircle className="h-4 w-4 text-primary" />
            WhatsApp demo number: {WHATSAPP_DEMO_PHONE_DISPLAY}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{helperText}</p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleContinue}>
            {continueLabel}
            {showExternalIcon ? <ExternalLink className="ml-2 h-4 w-4" /> : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
