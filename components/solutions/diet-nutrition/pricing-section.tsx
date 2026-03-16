"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Sparkles, Clock, Zap, Star, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePricingCurrency } from "@/hooks/use-pricing-currency"

interface Feature {
  text: string
  tooltip?: string
}

function FeatureItem({
  feature,
  highlight,
}: {
  feature: Feature
  highlight: boolean
}) {
  const [showTip, setShowTip] = useState(false)

  return (
    <li className={`flex items-start gap-2.5 ${showTip ? "relative z-[60]" : ""}`}>
      <Check
        className={`w-4 h-4 mt-0.5 shrink-0 ${
          highlight ? "text-primary" : "text-muted-foreground"
        }`}
      />
      <span className="text-sm text-foreground/80 leading-relaxed">
        {feature.text}
        {feature.tooltip && (
          <span
            className="relative inline-flex align-middle cursor-pointer ml-1"
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
            onClick={() => setShowTip((v) => !v)}
          >
            <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
            {showTip && (
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 rounded-lg bg-popover border border-border px-3 py-2 text-xs text-popover-foreground shadow-2xl z-[100] leading-relaxed pointer-events-none">
                {feature.tooltip}
              </span>
            )}
          </span>
        )}
      </span>
    </li>
  )
}

export function PricingSection() {
  const { format } = usePricingCurrency()
  const overageStandard = format(0.1)
  const overageHigh = format(0.05)
  const tiers: {
    name: string
    tagline: string
    setupFee: number
    discountedSetupFee: number
    monthlyFee: number
    highlight: boolean
    badge?: string
    features: Feature[]
    cta: string
  }[] = [
    {
      name: "Starter",
      tagline: "For solo coaches ready to stop losing inquiry leads",
      setupFee: 599,
      discountedSetupFee: 299,
      monthlyFee: 149,
      highlight: false,
      features: [
        {
          text: "7 core WhatsApp nutrition conversation flows",
          tooltip:
            "Price inquiry, plan recommendation, first-time qualification, availability, business info, after-hours, and follow-up for unconverted leads.",
        },
        {
          text: "Instagram inquiries redirected to WhatsApp",
          tooltip:
            "Instagram automation is limited. We redirect DMs into WhatsApp where full 24/7 automation runs seamlessly.",
        },
        { text: "Instant inquiry response (24/7) via WhatsApp" },
        { text: "Diet plan FAQs and pricing answers" },
        { text: "Consultation or plan booking link redirect" },
        { text: "Consultation confirmation reminders" },
        {
          text: "Follow-up for unconverted leads",
          tooltip:
            "Prospect asked about a plan but did not book? Automation sends a next-day reminder with a booking or checkout link.",
        },
        {
          text: "Up to 300 messages/mo",
          tooltip:
            `Covers outbound template messages (confirmations, reminders, follow-ups). Service replies within the 24-hr customer window are free. Extra messages billed at ${overageStandard} each.`,
        },
        { text: "Email support" },
      ],
      cta: "Get Started",
    },
    {
      name: "Growth",
      tagline: "For nutrition brands scaling consultations and retention",
      setupFee: 1399,
      discountedSetupFee: 699,
      monthlyFee: 349,
      highlight: true,
      badge: "Most Popular",
      features: [
        { text: "Everything in Starter, plus:" },
        {
          text: "Coach routing by goal or program",
          tooltip:
            "Leads are routed to the right coach flow based on goals or program type.",
        },
        {
          text: "Smart lead scoring and prioritisation",
          tooltip:
            "AI ranks incoming inquiries by intent signals so your team focuses on the highest-fit prospects first.",
        },
        {
          text: "No-show follow-up sequences",
          tooltip:
            "Targets booked consultations that were missed and encourages rescheduling.",
        },
        {
          text: "Plan renewal and adherence nudges",
          tooltip:
            "Automated reminders keep clients on plan and support repeat billing.",
        },
        {
          text: "Pre-consultation intake collection",
          tooltip:
            "Collects goals, dietary restrictions, and health context before the consult.",
        },
        {
          text: "Up to 1,500 messages/mo",
          tooltip:
            `Covers outbound template messages (confirmations, reminders, campaigns). Service replies within the 24-hr customer window are free. Extra messages billed at ${overageHigh} each.`,
        },
        {
          text: "Conversion analytics dashboard",
          tooltip:
            "Track inquiries to bookings and see which channels and offers convert best.",
        },
        { text: "Priority WhatsApp and email support" },
      ],
      cta: "Scale Your Brand",
    },
    {
      name: "Pro",
      tagline: "For multi-coach teams and nutrition groups",
      setupFee: 2799,
      discountedSetupFee: 1399,
      monthlyFee: 699,
      highlight: false,
      features: [
        { text: "Everything in Growth, plus:" },
        { text: "Multi-coach management" },
        { text: "Advanced AI nutrition flows" },
        { text: "Facebook Messenger + website chat" },
        { text: "Campaign broadcast system" },
        {
          text: "Unlimited messages",
          tooltip:
            "No caps on outbound template messages or service replies, ideal for high-volume brands.",
        },
        { text: "Custom integrations (CRM, payments, LMS)" },
        { text: "Dedicated account manager" },
        { text: "Monthly performance reviews" },
      ],
      cta: "Talk to Us",
    },
  ]
  return (
    <section className="py-20 md:py-28 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Pricing &amp; Packages
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Simple, <span className="theme-gradient-text bg-clip-text text-transparent">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One-time setup + monthly platform fee. No hidden costs.
            Works with your calendar or booking page.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="relative rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/[0.06] via-primary/[0.03] to-primary/[0.06] p-5 md:p-6 text-center overflow-hidden">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-wider rounded-b-lg">
                <Sparkles className="w-3.5 h-3.5" /> Launch Offer
              </span>
            </div>
            <div className="pt-4">
              <p className="text-lg md:text-xl font-bold text-foreground mb-1">
                <span className="text-primary">50% Off Setup Fee</span> - Until April 30
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                Lock in half-price setup for any plan when you sign up before{" "}
                <span className="font-semibold text-foreground">April 30, 2026</span>
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Limited slots available
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-primary" /> Go live in under 2 weeks
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold text-primary">
                Bonus: Free live flow simulation + 30-min inquiry audit included
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 overflow-visible ${
                tier.highlight
                  ? "border-primary/40 bg-card shadow-xl shadow-primary/5 scale-[1.02] md:scale-105 z-10"
                  : "border-border bg-card/60 hover:border-border/80 hover:shadow-lg"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-primary/20">
                    <Star className="w-3 h-3 fill-current" /> {tier.badge}
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
                  <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                    <span className="text-lg font-medium text-muted-foreground line-through">
                      {format(tier.setupFee)}
                    </span>
                    <span className="text-2xl font-bold text-emerald-500">
                      {format(tier.discountedSetupFee)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-md">50% off</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Monthly
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-foreground">
                      {format(tier.monthlyFee)}
                    </span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, i) => (
                  <FeatureItem key={i} feature={feature} highlight={tier.highlight} />
                ))}
              </ul>

              <Button
                asChild
                className={`w-full h-12 rounded-xl font-semibold text-base transition-all duration-200 ${
                  tier.highlight
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 hover:scale-[1.02]"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
                <Link href="/contact">
                  {tier.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            All plans include WhatsApp Business API setup, staff training, and an
            onboarding period. Works with Calendly, Google Calendar, Stripe/Shopify
            checkout, and custom booking pages.{" "}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              Need a custom plan?
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
