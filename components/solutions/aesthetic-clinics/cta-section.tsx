"use client"

import { MessageCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsAppDemoDialog } from "@/components/whatsapp/whatsapp-demo-dialog"

export function CTASection() {
  return (
    <section id="demo" className="py-20 md:py-28 bg-muted/30 theme-transition">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] via-primary/[0.03] to-primary/[0.06] p-10 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.06),transparent_60%)]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <MessageCircle className="w-4 h-4" />
              See It Yourself
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-6">
              See It Handle a Real Patient —{" "}
              <span className="theme-gradient-text bg-clip-text text-transparent">
                Before You Pay Anything
              </span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-3">
              The demo is live right now. Message it on WhatsApp, pretend you&apos;re a patient, and
              see the whole flow — reply, questions, booking — in under 2 minutes.
            </p>

            <p className="text-base font-medium text-foreground max-w-xl mx-auto mb-10">
              If you like it, we can have it running on your clinic&apos;s number within 3 days.
            </p>

            <WhatsAppDemoDialog
              contextLabel="Lahore aesthetic clinics CTA section"
              title="Try the Live WhatsApp Demo"
              description="Message the assistant like a patient — in Roman Urdu or English. See the full flow in under 2 minutes."
              helperText="Free, no commitment. Works on your phone right now."
              continueLabel="Open on WhatsApp →"
              showExternalIcon={false}
              trigger={
                <Button
                  size="lg"
                  className="h-14 px-10 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Try the Live WhatsApp Demo
                </Button>
              }
            />

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                Built in Lahore
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                No obligation
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                Works on your existing WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
