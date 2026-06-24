"use client"

import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsAppDemoDialog } from "@/components/whatsapp/whatsapp-demo-dialog"

function formatPKR(amount: number) {
  return `PKR ${amount.toLocaleString("en-PK")}`
}

const tiers = [
  {
    name: "Standard",
    tagline: "For most single-location clinics",
    setupFee: 25000,
    monthlyFee: 12000,
    highlight: false,
    badge: undefined as string | undefined,
    features: [
      "WhatsApp booking assistant on your existing number",
      "Instant replies 24/7 in English & Roman Urdu",
      "Answers common questions (treatments, timings, general pricing)",
      "Collects patient details & sends booking requests to your team",
      "2 rounds of revisions during setup to match your clinic's tone",
      "Monthly check-in and fine-tuning",
    ],
  },
  {
    name: "Advanced",
    tagline: "For clinics with higher inquiry volume or multiple treatment categories",
    setupFee: 45000,
    monthlyFee: 22000,
    highlight: true,
    badge: "Recommended",
    features: [
      "Everything in Standard, plus:",
      "Separate conversation flows for different treatments (skin, laser, injectables)",
      "Appointment reminders via WhatsApp",
      "Follow-up messages for patients who inquired but didn't book",
      "Faster turnaround on changes and updates",
    ],
  },
  {
    name: "Premium",
    tagline: "For multi-service clinics & growing brands that want hands-on management",
    setupFee: 60000,
    monthlyFee: 30000,
    highlight: false,
    badge: undefined,
    features: [
      "Everything in Advanced, plus:",
      "A dedicated point of contact for changes, updates, and support",
      "Multiple treatment flows built and maintained",
      "Monthly performance review — what's converting, where patients drop off",
      "Higher message volume handled",
      "Priority build time for new flows or seasonal campaigns",
    ],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-muted/30 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Simple, Local Pricing{" "}
            <span className="theme-gradient-text bg-clip-text text-transparent">in PKR</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A one-time setup fee to build and launch your assistant, plus a monthly fee to run it.
            Priced for Pakistani clinics — no foreign currency, no surprises. Works on your existing
            WhatsApp number.
          </p>
        </div>

        {/* Early adopter offer */}
        <div className="relative max-w-2xl mx-auto mb-14">
          <div className="relative rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/[0.06] via-primary/[0.03] to-primary/[0.06] p-5 md:p-6 text-center overflow-hidden">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-wider rounded-b-lg">
                <Sparkles className="w-3.5 h-3.5" /> Early Adopter Offer
              </span>
            </div>
            <div className="pt-4">
              <p className="text-lg md:text-xl font-bold text-foreground mb-2">
                First 3 Lahore clinics:{" "}
                <span className="text-primary">50% off setup</span>
                {" "}— PKR 12,500 instead of 25,000
              </p>
              <p className="text-sm text-muted-foreground">
                We want our first clients as references. In exchange for the discount, we&apos;ll ask
                permission to use your clinic as an example. No obligation beyond that.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                tier.highlight
                  ? "border-primary/40 bg-card shadow-xl shadow-primary/5 scale-[1.02] md:scale-105 z-10"
                  : "border-border bg-card/60 hover:border-border/80 hover:shadow-lg"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-primary/20">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-1">{tier.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tier.tagline}</p>
              </div>

              <div className="mb-6 pb-6 border-b border-border/50">
                <div className="mb-3">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Setup (one-time)
                  </span>
                  <div className="mt-1 text-2xl font-bold text-foreground">
                    {formatPKR(tier.setupFee)}
                  </div>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Monthly
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-foreground">
                      {formatPKR(tier.monthlyFee)}
                    </span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        tier.highlight ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-sm text-foreground/80 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <WhatsAppDemoDialog
                contextLabel={`Aesthetic clinics pricing — ${tier.name} tier`}
                title="Book a Free Demo"
                description="Message us on WhatsApp and we'll walk you through the right package for your clinic."
                continueLabel="Open WhatsApp →"
                showExternalIcon={false}
                trigger={
                  <Button
                    className={`w-full h-12 rounded-xl font-semibold text-base transition-all duration-200 ${
                      tier.highlight
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02]"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    {tier.name === "Premium" ? "Talk to Us" : "Book a Free Demo"}
                  </Button>
                }
              />
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground max-w-xl mx-auto">
          Every package includes WhatsApp setup, staff handover, and a launch period where we
          fine-tune the assistant. Not sure which fits?{" "}
          <span className="text-primary font-medium">Book a free demo</span> and we&apos;ll recommend
          the right one.
        </p>
      </div>
    </section>
  )
}
