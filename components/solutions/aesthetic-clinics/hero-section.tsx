"use client"

import { Button } from "@/components/ui/button"
import { WhatsAppDemoDialog } from "@/components/whatsapp/whatsapp-demo-dialog"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

interface AestheticHeroProps {
  autoOpenDemoPopup?: boolean
}

export function AestheticHero({ autoOpenDemoPopup = false }: AestheticHeroProps) {
  return (
    <section className="relative min-h-[calc(100dvh-4rem)] flex items-center justify-center overflow-hidden pt-16 md:pt-20 pb-8 md:pb-12 theme-transition">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] theme-glow blur-[120px] opacity-25 rounded-full pointer-events-none theme-transition" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.15)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.15)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-30" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/50 text-sm text-muted-foreground mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          For Aesthetic, Skin &amp; Laser Clinics in Lahore
        </div>

        {/* H1 — keyword-loaded for SEO */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-5">
          WhatsApp Booking Assistant{" "}
          <span className="theme-gradient-text bg-clip-text text-transparent">
            for Lahore Aesthetic Clinics
          </span>
        </h1>

        {/* Hook */}
        <p className="text-xl md:text-2xl font-semibold text-foreground max-w-3xl mx-auto mb-4 leading-snug">
          A patient messaged your clinic at 11&nbsp;PM. By morning, they&apos;d booked with another clinic.
        </p>

        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          We set up a WhatsApp assistant that replies to every patient instantly — day or night — answers
          their questions in English or Roman Urdu, and books consultations automatically.
          The clinic that replies first usually gets the patient.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
          <WhatsAppDemoDialog
            autoOpen={autoOpenDemoPopup}
            contextLabel="Lahore aesthetic clinics hero section"
            title="Try the Live WhatsApp Demo"
            description="Message the assistant like a patient — in Roman Urdu or English. See the full flow in under 2 minutes."
            helperText="Free, no commitment. Message it like a real patient and see how it handles the whole inquiry."
            continueLabel="Open on WhatsApp →"
            showExternalIcon={false}
            trigger={
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200"
              >
                Try the Live Demo on WhatsApp
              </Button>
            }
          />
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base font-semibold rounded-xl border-border hover:bg-muted/50 transition-all duration-200"
          >
            <Link href="#how-it-works">
              See How It Works
              <ChevronDown className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mb-10">
          Message it like a patient — see the whole flow in under 2 minutes. Free, no commitment.
        </p>

        {/* Stat strip */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto">
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">&lt; 60s</div>
            <div className="text-xs text-muted-foreground">Reply time, any hour</div>
          </div>
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">24/7</div>
            <div className="text-xs text-muted-foreground">Including Friday &amp; Sunday evenings</div>
          </div>
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">Your&nbsp;#</div>
            <div className="text-xs text-muted-foreground">Works on your existing WhatsApp</div>
          </div>
        </div>
      </div>
    </section>
  )
}
