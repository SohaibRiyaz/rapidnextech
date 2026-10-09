/**
 * Single source of truth for contact details, feature flags, pricing and pilot terms.
 * Every phone number, price and term shown on the site reads from here.
 * Optional content is `null` until real material exists — components hide the block while it is null.
 */

export type PhoneNumber = {
  /** Human-readable, e.g. "+1 (813) 214-2552" */
  display: string
  /** E.164 for tel: links, e.g. "+18132142552" */
  e164: string
}

export const siteConfig = {
  name: "RapidNexTech",
  url: "https://rapidnextech.com",
  email: "contact@rapidnextech.com",

  /** Public US contact number: header, footer, contact page, JSON-LD. */
  publicPhone: { display: "+1 (813) 214-2552", e164: "+18132142552" } as PhoneNumber,

  /** Demo line: callers talk to the dental AI receptionist. Set to null to hide every demo-call CTA. */
  demoPhone: { display: "+1 (469) 786-3061", e164: "+14697863061" } as PhoneNumber | null,

  ukPhone: { display: "+44 7311 133668", e164: "+447311133668" } as PhoneNumber,

  /** Feature flags */
  supportsSpanish: true,
  whatsappBadgeEnabled: false,

  /** Optional media / links: blocks are hidden while these are null. */
  sampleCallUrl: null as string | null,
  bookingUrl: null as string | null,
  videoTestimonialUrl: null as string | null,

  /** Browser voice demo (existing try.rapidnextech.com embed persona). */
  voiceDemoPageKey: "dental" as const,

  /** Exact, approved copy blocks. Do not paraphrase elsewhere: import these. */
  copy: {
    emergencies:
      "Dental emergencies follow your rules: live-transferred to your on-call dentist, or flagged instantly as urgent.",
    spanish: "Answers in English and Spanish.",
    goLive: "Live within 24 hours of your onboarding call.",
    security:
      "We're built to minimize patient data. We don't store call recordings, summaries go only to your practice's designated email, the AI never asks for Social Security numbers or medical history, and all data is encrypted in transit. Full HIPAA compliance with signed BAAs is in progress. Ask us about our data handling on your onboarding call.",
    smsComingSoonTooltip:
      "Instant SMS summaries to your front desk, being added to paid plans. Email summaries are included today.",
    pilotResponseTime: "within 1 business day",
    phoneSystems: ["Weave", "RingCentral", "Mango Voice", "Vonage"],
    practiceSoftware: ["Dentrix", "Eaglesoft", "Open Dental"],
  },

  pilot: {
    days: 14,
    includedMinutes: 300,
    setupFeeWithPilot: 0,
    /** Short chips shown under the hero CTAs and in the final CTA. */
    chips: ["14 days free", "No credit card", "No contract", "Keep your number"],
    terms: [
      "14 days free",
      "No credit card",
      "No contract",
      "We do the full setup",
      "Keep your existing number",
      "Cancel anytime by turning off forwarding",
      "Call summaries by email during the pilot: an instant summary after every call, plus a weekly recap (calls answered, new patients captured, emergencies handled)",
      "Fair use during the pilot: up to 300 call minutes",
      "Practices that start with the pilot pay $0 setup",
    ],
  },

  pricing: {
    currency: "USD",
    avgCallMinutes: 3,
    overagePerMinute: 0.39,
    setupFee: 497,
    annualFreeMonths: 2,
    founding: {
      enabled: true,
      spotsRemaining: 5,
      text: "First 5 practices: price locked for 12 months + setup waived, in exchange for a testimonial.",
    },
    allPlansTerms: [
      "Month-to-month, cancel anytime",
      "Overage $0.39/minute",
      "Setup fee $497, waived for practices that start with the free pilot",
      "Annual billing: 2 months free",
    ],
    plans: [
      {
        id: "after-hours",
        name: "After-Hours",
        price: 297,
        priceFrom: false,
        includedMinutes: 750,
        locations: 1,
        popular: false,
        cta: "Start free pilot",
        ctaKind: "pilot",
        features: [
          { text: "Evenings, weekends and holidays" },
          { text: "Email call summaries" },
          { text: "Emergency handling per your practice rules" },
          { text: "Insurance FAQ from your practice's list" },
          { text: "Weekly recap" },
        ],
      },
      {
        id: "full-coverage",
        name: "Full Coverage",
        price: 497,
        priceFrom: false,
        includedMinutes: 1500,
        locations: 1,
        popular: true,
        cta: "Start free pilot",
        ctaKind: "pilot",
        features: [
          { text: "Everything in After-Hours" },
          { text: "Daytime overflow / no-answer coverage" },
          { text: "Lunch-break coverage" },
          { text: "SMS summaries to the front desk", comingSoon: true },
          { text: "Priority support" },
        ],
      },
      {
        id: "multi-location",
        name: "Multi-Location",
        price: 897,
        priceFrom: true,
        includedMinutes: 3000,
        locations: 3,
        popular: false,
        cta: "Talk to us",
        ctaKind: "contact",
        features: [
          { text: "Up to 3 locations" },
          { text: "Everything in Full Coverage" },
          { text: "Per-location setup and routing" },
          { text: "Monthly review call" },
          { text: "SMS summaries to the front desk", comingSoon: true },
        ],
      },
    ],
  },
} as const

export type Plan = (typeof siteConfig.pricing.plans)[number]
export type PlanId = Plan["id"]

export const PLAN_IDS = siteConfig.pricing.plans.map((p) => p.id) as PlanId[]

export function approxCalls(minutes: number) {
  return Math.round(minutes / siteConfig.pricing.avgCallMinutes)
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}

export function telHref(phone: PhoneNumber) {
  return `tel:${phone.e164}`
}
