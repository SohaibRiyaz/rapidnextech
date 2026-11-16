import {
  AlarmClock,
  ArrowRight,
  CalendarClock,
  CalendarPlus,
  ClipboardList,
  Clock,
  FileText,
  Languages,
  Moon,
  PhoneForwarded,
  PhoneMissed,
  Search,
  Send,
  ShieldCheck,
  Siren,
  Sun,
  UserPlus,
  Voicemail,
} from "lucide-react"
import { getDentalFaqs } from "@/components/dental/faq-data"
import { DENTAL_DESCRIPTION } from "@/lib/seo"
import { siteConfig } from "@/lib/site-config"
import type { CallHandlingItem, VerticalContent } from "./types"

/**
 * /dental: the US dental practice offer. This text was moved unchanged from the old dental homepage
 * components. Do not rewrite it without checking with the owner.
 */

const { copy, pricing, pilot } = siteConfig

function callHandlingItems(): CallHandlingItem[] {
  const items: CallHandlingItem[] = [
    {
      icon: UserPlus,
      title: "New-patient inquiries",
      text: "Captures name, phone, reason for visit, insurance and preferred days and times.",
    },
    {
      icon: Siren,
      title: "Dental emergencies",
      text: `Toothache, broken tooth, swelling or trauma. ${copy.emergencies}`,
    },
    {
      icon: ShieldCheck,
      title: "Insurance questions",
      text: "Answered from your practice's accepted-insurance list. Anything else is captured for front-desk follow-up.",
    },
    {
      icon: CalendarPlus,
      title: "Appointment requests",
      text: "Captured 24/7 and sent to your front desk to confirm. Callers are told when to expect a confirmation call.",
    },
    {
      icon: CalendarClock,
      title: "Recall & hygiene requests",
      text: "Cleaning and recall requests are captured with preferred times, ready for your team to schedule.",
    },
    {
      icon: AlarmClock,
      title: "After-hours & weekend coverage",
      text: "Evenings, weekends and holidays, answered every time instead of going to voicemail.",
    },
    {
      icon: PhoneMissed,
      title: "Missed calls during busy hours",
      text: "When nobody picks up after a few rings, the call is answered instead of lost.",
    },
    {
      icon: FileText,
      title: "Instant front-desk summaries",
      text: "Every call becomes a clear email summary for your front desk: who called, why, and how urgent it is.",
    },
  ]
  if (siteConfig.supportsSpanish) {
    items.push({ icon: Languages, title: "Spanish-speaking callers", text: copy.spanish })
  }
  return items
}

const featuresFromSiteConfig = Object.fromEntries(pricing.plans.map((p) => [p.id, p.features])) as unknown as VerticalContent["pricing"]["features"]

export const dentalContent: VerticalContent = {
  vertical: "dental",
  path: "/dental",

  seo: {
    title: "24/7 AI Receptionist for Dental Practices",
    description:
      "AI receptionist for US dental practices. Answers after-hours, weekend and overflow calls, captures new patients and emergencies. 14-day free pilot, no card.",
    ogAlt: "RapidNexTech AI receptionist for dental practices",
    serviceName: "AI Receptionist for Dental Practices",
    serviceType: "AI receptionist / after-hours call answering for dental practices",
    serviceDescription: DENTAL_DESCRIPTION,
    audience: "Dental practices",
  },

  hero: {
    badge: "AI receptionist for US dental practices",
    titleStart: "Your dental practice never loses another after-hours or weekend call to ",
    titleHighlight: "voicemail or a competitor",
    titleEnd: ".",
    sub: "AI receptionist for dental practices that answers 24/7, captures new patients, handles emergencies, and sends every request to your front desk.",
    primaryCta: { label: "Talk to our AI receptionist", targetId: "live-demo" },
    // Was a link to /solutions/dental-clinics, whose content now lives on this page.
    deepLink: { label: "How it works for dental practices", href: "#details" },
    example: {
      ariaLabel: "Example front-desk call summary",
      title: "New call summary",
      meta: "Saturday, 7:42 PM · after hours",
      rows: [
        ["Caller", "New patient"],
        ["Reason for visit", "Toothache, lower left"],
        ["Pain level", "7 / 10"],
        ["Insurance", "PPO (on your accepted list)"],
        ["Preferred times", "Weekday mornings"],
      ],
      next: "caller was told the front desk will call to confirm a time.",
      caption: "Example summary. Your front desk gets one by email after every call.",
    },
  },

  problem: {
    title: "What happens to your calls after 5pm, at lunch, and on weekends?",
    intro: "Most patients don't leave a message. They hang up and call the next practice on the list.",
    windows: [
      {
        icon: Moon,
        title: "After 5pm",
        text: "The front desk has gone home. A patient with a cracked tooth calls at 8pm and hears your voicemail greeting.",
      },
      {
        icon: Sun,
        title: "At lunch and in busy hours",
        text: "Your team is checking patients in and out. The phone rings out while a new patient is trying to book.",
      },
      {
        icon: Clock,
        title: "On weekends and holidays",
        text: "Swelling and toothaches don't wait for Monday. Neither do people choosing a new dentist.",
      },
    ],
    flow: [
      { icon: PhoneMissed, label: "The call isn't answered" },
      { icon: Voicemail, label: "It goes to voicemail" },
      { icon: Search, label: "The patient searches Google" },
      { icon: ArrowRight, label: "They book with the next dentist" },
    ],
    calloutTitle: "New patients and emergencies are the calls you can least afford to miss.",
    calloutText:
      "A new patient shopping for a dentist will call the next practice if nobody answers. A patient with a toothache, a broken tooth, swelling or trauma needs to hear from someone now. These callers are the most valuable to your practice, and the most likely to be lost to voicemail.",
  },

  calculator: {
    title: "What are unanswered calls costing your practice?",
    missedHint: "After hours, weekends and calls nobody picked up. Example value, change it.",
    valueLabel: "Average new-patient value",
    valueHint: "What a new patient is worth to your practice. Example value, change it.",
    formula: "Estimate only: missed calls × 52 weeks × booking rate × patient value.",
    defaults: { missedPerWeek: "8", bookRate: "25", jobValue: "400" },
  },

  howItWorks: {
    title: "Three steps. Your patients keep dialing the same number.",
    steps: [
      {
        icon: PhoneForwarded,
        title: "Keep your number",
        text: "We give your practice a dedicated AI line and set up call forwarding with you: after hours, on weekends, or when nobody picks up.",
      },
      {
        icon: ClipboardList,
        title: "We set it up with your practice",
        text: "Your hours, services, accepted-insurance list and emergency rules. We test it live together on a short screen-share.",
      },
      {
        icon: Send,
        title: "It answers every forwarded call",
        text: "Each new patient, emergency and appointment request goes to your front desk instantly, with a clear summary.",
      },
    ],
    footnote: `Works with ${copy.phoneSystems.join(", ")} and standard phone lines. Caller ID passes through. Turn it off anytime.`,
  },

  callHandling: {
    title: "Built for the calls a dental front desk gets every day",
    items: callHandlingItems(),
    footnote: `Works alongside ${copy.practiceSoftware.join(", ")} and any other practice software. Requests go straight to your front desk. Direct scheduling integration is coming soon.`,
  },

  pilot: {
    intro: "We do the setup. You keep your number. If it isn't worth it, turn forwarding off.",
    timeline: [
      { when: "Day 0", title: "30-min onboarding call", text: "We learn your hours, services, insurance list and emergency rules." },
      {
        when: "Day 1",
        title: "Your AI line goes live",
        text: `We set up your AI line, test it, and turn on forwarding with you. ${copy.goLive}`,
      },
      {
        when: "Days 2–14",
        title: "Every call, summarized",
        text: "An email summary after every call, plus a weekly recap: calls answered, new patients captured, emergencies handled.",
      },
      { when: "Day 14", title: "You decide", text: "Pick a plan, or just turn forwarding off. No card was taken, so nothing is charged." },
    ],
    terms: pilot.terms,
    securityNote: true,
  },

  pricing: {
    intro: `Month-to-month. Average dental call is about ${pricing.avgCallMinutes} minutes.`,
    features: featuresFromSiteConfig,
    locationsNoun: "locations",
    comingSoonTooltip: copy.smsComingSoonTooltip,
    foundingText: pricing.founding.text,
    allPlansTerms: pricing.allPlansTerms,
    footnote: `Minutes are the actual limit; call counts are approximate. Average dental call is about ${pricing.avgCallMinutes} minutes. Features marked “coming soon” aren't available yet.`,
  },

  behindThis: { notCustomersOf: "dental practices" },

  faqTitle: "Questions dental practices ask us",
  faqs: getDentalFaqs(),
  // Was a link to /solutions/dental-clinics, whose content now lives on this page.
  faqDeepLink: { label: "More detail: how the AI receptionist works for dental practices", href: "#details" },

  finalCta: {
    title: "Stop sending after-hours patients to voicemail.",
    text: `Hear it answer a call, then try it on your own phone line for ${pilot.days} days.`,
    primaryLabel: "Talk to our AI receptionist",
    primaryTargetId: "live-demo",
    footer: `Free for ${pilot.days} days · No credit card · Keep your number · Cancel anytime by turning off forwarding`,
  },
}
