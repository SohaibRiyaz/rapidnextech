"use client"

import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DietNutritionHero() {
  return (
    <section className="relative min-h-[calc(100dvh-4rem)] flex items-center justify-center overflow-hidden pt-16 md:pt-20 pb-8 md:pb-12 theme-transition">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] theme-glow blur-[120px] opacity-30 rounded-full pointer-events-none theme-transition" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.15)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.15)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-30" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/50 text-sm text-muted-foreground mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          For Diet &amp; Nutrition Businesses
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-4">
          Turn WhatsApp Inquiries into{" "}
          <span className="theme-gradient-text bg-clip-text text-transparent">
            Diet Plan Signups
          </span>{" "}
          Automatically
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
          Respond instantly to potential clients, qualify their goals, and guide them to book diet consultations or purchase meal plans.
        </p>

        <p className="text-sm text-muted-foreground mb-6">
          Works with your current booking tool or a booking page we build on your website.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="h-12 px-8 text-base font-semibold rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200">
            <Link href="/contact">
              Get Your Free Inquiry Audit
              <Search className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-semibold rounded-xl border-border hover:bg-muted/50 transition-all duration-200">
            <Link
              href="https://www.notion.so/How-Nutrition-Clients-Interact-on-WhatsApp-Demo-Flow-2d0bcba1badb8075a1a8fffb7d97a449?source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              View WhatsApp Demo Flow
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground max-w-lg mx-auto">
          See how it qualifies clients and books consults in real time.
        </p>

        <div className="mt-10 md:mt-12 relative max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 md:p-6 text-left">
              <div className="w-8 h-1.5 rounded-full bg-primary/60 mb-3" />
              <div className="w-full h-2 rounded bg-muted mb-2" />
              <div className="w-3/4 h-2 rounded bg-muted mb-4" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">&lt; 30s</div>
              <div className="text-xs text-muted-foreground mt-1">Avg. response time</div>
            </div>
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 md:p-6 text-left">
              <div className="w-8 h-1.5 rounded-full bg-primary/40 mb-3" />
              <div className="w-full h-2 rounded bg-muted mb-2" />
              <div className="w-2/3 h-2 rounded bg-muted mb-4" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">2x</div>
              <div className="text-xs text-muted-foreground mt-1">Consultation bookings</div>
            </div>
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 md:p-6 text-left">
              <div className="w-8 h-1.5 rounded-full bg-primary/50 mb-3" />
              <div className="w-full h-2 rounded bg-muted mb-2" />
              <div className="w-5/6 h-2 rounded bg-muted mb-4" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">+35%</div>
              <div className="text-xs text-muted-foreground mt-1">Recurring plan signups</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
