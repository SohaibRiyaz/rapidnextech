"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Sparkles, MessageCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

const BUYER_WA = "923314664279"

function formatPKR(amount: number) {
  return `PKR ${amount.toLocaleString("en-PK")}`
}

function buildWALink(tierName: string) {
  const msg =
    tierName === "Premium"
      ? `Hi, I run an aesthetic clinic in Lahore and I'm interested in the Premium package. I'd like to discuss setting it up for my clinic.`
      : `Hi, I run an aesthetic clinic in Lahore and I'm interested in the ${tierName} package. I'd like to see a demo and discuss getting started.`
  return `https://wa.me/${BUYER_WA}?text=${encodeURIComponent(msg)}`
}

/* ------------------------------------------------------------------ */
/* Tooltip feature item — same pattern as diet-nutrition pricing       */
/* ------------------------------------------------------------------ */

interface Feature {
  text: string
  tooltip?: string
}

function FeatureItem({ feature, highlight }: { feature: Feature; highlight: boolean }) {
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

/* ------------------------------------------------------------------ */
/* Tier data                                                            */
/* ------------------------------------------------------------------ */

const tiers: {
  name: string
  slug: string
  tagline: string
  setupFee: number
  monthlyFee: number
  highlight: boolean
  badge?: string
  cta: string
  features: Feature[]
}[] = [
  {
    name: "Standard",
    slug: "standard",
    tagline: "For most single-location clinics",
    setupFee: 25000,
    monthlyFee: 12000,
    highlight: false,
    cta: "Book a Free Demo",
    features: [
      { text: "WhatsApp booking assistant on your existing number" },
      { text: "Instant replies 24/7 in English & Roman Urdu" },
      { text: "Answers common questions (treatments, timings, general pricing)" },
      { text: "Collects patient details & sends booking requests to your team" },
      { text: "2 rounds of revisions during setup to match your clinic's tone" },
      { text: "Monthly check-in and fine-tuning" },
      {
        text: "Conversation dashboard (view-only)",
        tooltip: "See every patient conversation your assistant handles, in one place.",
      },
      {
        text: "Up to 1,000 patient conversations/month",
        tooltip:
          "A conversation = one patient chat thread. Replies within WhatsApp's 24-hour service window are free. Outbound template messages sent outside that window (e.g. next-day reminders) are billed at Meta's Pakistan rate — utility messages ~PKR 2.79 each. Most clinic chats stay in the free window.",
      },
    ],
  },
  {
    name: "Advanced",
    slug: "advanced",
    tagline: "For clinics with higher inquiry volume or multiple treatment categories",
    setupFee: 45000,
    monthlyFee: 22000,
    highlight: true,
    badge: "Recommended",
    cta: "Book a Free Demo",
    features: [
      { text: "Everything in Standard, plus:" },
      { text: "Separate conversation flows for different treatments (skin, laser, injectables)" },
      { text: "Appointment reminders via WhatsApp" },
      { text: "Follow-up messages for patients who inquired but didn't book" },
      { text: "Faster turnaround on changes and updates" },
      {
        text: "Live takeover dashboard",
        tooltip:
          "Jump into any conversation in real time and reply as staff, then hand it back to the assistant whenever you want.",
      },
      { text: "One-tap hand back to bot" },
      {
        text: "Up to 3,000 patient conversations/month",
        tooltip:
          "Triple the volume of Standard, for clinics with steady daily inquiries. Same billing model — in-window replies free, outbound templates at Meta's Pakistan utility rate (~PKR 2.79 each).",
      },
    ],
  },
  {
    name: "Premium",
    slug: "premium",
    tagline: "For multi-service clinics & growing brands that want hands-on management",
    setupFee: 60000,
    monthlyFee: 30000,
    highlight: false,
    cta: "Talk to Us",
    features: [
      { text: "Everything in Advanced, plus:" },
      {
        text: "Multi-user dashboard access",
        tooltip:
          "Multiple staff logins so your whole team can monitor and reply to patient chats live.",
      },
      { text: "Real-time conversation monitoring — your whole team sees patient chats live" },
      { text: "A dedicated point of contact for changes, updates, and support" },
      { text: "Multiple treatment flows built and maintained" },
      { text: "Monthly performance review — what's converting, where patients drop off" },
      { text: "Higher message volume handled" },
      { text: "Priority build time for new flows or seasonal campaigns" },
      {
        text: "High-volume / custom conversation limits",
        tooltip:
          "No fixed cap — limits matched to your clinic's actual volume. Built for multi-service clinics running reminders and campaigns at scale.",
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

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
            Simple,{" "}
            <span className="theme-gradient-text bg-clip-text text-transparent">Honest Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A one-time setup fee to build and launch your assistant, plus a flat monthly fee to run
            it. No hidden charges, no per-message billing, no long-term lock-in. Most clinics make
            back the cost from just a few recovered bookings a month.
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
              className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 overflow-visible ${
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
                {tier.features.map((feature, i) => (
                  <FeatureItem key={i} feature={feature} highlight={tier.highlight} />
                ))}
              </ul>

              {/* Primary CTA — WhatsApp to buyer number */}
              <Button
                asChild
                className={`w-full h-12 rounded-xl font-semibold text-base transition-all duration-200 ${
                  tier.highlight
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02]"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
                <a href={buildWALink(tier.name)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {tier.cta}
                </a>
              </Button>

              {/* Secondary CTA — contact form */}
              <Link
                href={`/contact?plan=${tier.slug}&type=aesthetic`}
                className="mt-3 block text-center text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                or fill a quick form →
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground max-w-xl mx-auto">
          Every package includes WhatsApp setup, staff handover, and a launch period where we
          fine-tune the assistant. Not sure which fits?{" "}
          <a
            href={`https://wa.me/${BUYER_WA}?text=${encodeURIComponent("Hi, I run an aesthetic clinic in Lahore and I'm not sure which package fits. Can we have a quick chat?")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline"
          >
            Message us and we&apos;ll recommend the right one.
          </a>
        </p>
      </div>
    </section>
  )
}
