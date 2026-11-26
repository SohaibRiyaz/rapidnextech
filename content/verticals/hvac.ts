import {
  AlarmClock,
  ArrowRight,
  CalendarClock,
  ClipboardList,
  DollarSign,
  FileText,
  Flame,
  HardHat,
  Languages,
  MapPin,
  Moon,
  PhoneForwarded,
  PhoneMissed,
  Search,
  Send,
  Siren,
  Truck,
  Voicemail,
  Wrench,
} from "lucide-react"
import { HVAC_DEMO_PHONE, HVAC_FIELD_SOFTWARE, HVAC_RETELL_AGENT_ID } from "@/lib/hvac-config"
import type { FaqItem } from "@/lib/seo"
import { formatUsd, siteConfig } from "@/lib/site-config"
import type { CallHandlingItem, VerticalContent } from "./types"

/**
 * "/": the US HVAC offer (lead offer). Only the approved HVAC facts are used here: no stats, clients,
 * ratings, speeds or integrations beyond what's listed. Prices and minutes come from siteConfig.pricing.
 */

const { copy, pricing, pilot } = siteConfig
const software = HVAC_FIELD_SOFTWARE.join(", ")

export const HVAC_SUMMARY_TIP =
  "During the free pilot, summaries come by email. Text-message summaries are switched on when you move to a paid plan."

export const HVAC_DESCRIPTION =
  "AI receptionist for US HVAC companies: answers missed and after-hours calls 24/7, routes emergencies to your on-call tech, and emails you the job details right after every call."

function callHandlingItems(): CallHandlingItem[] {
  const items: CallHandlingItem[] = [
    {
      icon: Siren,
      title: "Emergencies",
      text: "No heat, no AC in extreme weather, gas smells and water leaks: live-transferred to your on-call tech, following your rules.",
    },
    {
      icon: Flame,
      title: "Gas smells, safely",
      text: "It tells the caller to leave the building and call the gas company or 911 first, then captures the details for you.",
    },
    {
      icon: MapPin,
      title: "Service-area check",
      text: "Checks the caller's ZIP code or area against your service area.",
    },
    {
      icon: ClipboardList,
      title: "Job details",
      text: "Name, callback number, address, system type (AC, furnace, heat pump and more), the problem, urgency and preferred time window.",
    },
    {
      icon: DollarSign,
      title: "Price-range questions",
      text: "Answers your diagnostic or service-call fee and common price ranges from your own list. Anything else goes to you.",
    },
    {
      icon: CalendarClock,
      title: "Maintenance & tune-up requests",
      text: "Captured with a preferred time window, ready for you to schedule. It never confirms a time: you do.",
    },
    {
      icon: AlarmClock,
      title: "After-hours & weekend calls",
      text: "Evenings, weekends and holidays, answered every time instead of going to voicemail.",
    },
    {
      icon: PhoneMissed,
      title: "Calls you miss on a job",
      text: "When nobody picks up after a few rings, the call is answered instead of lost.",
    },
    {
      icon: FileText,
      title: "Instant job summaries",
      text: "Every call becomes a job summary by email right after it ends, and by text message too on all paid plans.",
      tip: { label: "About text-message summaries", text: HVAC_SUMMARY_TIP },
    },
  ]
  if (siteConfig.supportsSpanish) {
    items.push({ icon: Languages, title: "Spanish-speaking callers", text: copy.spanish })
  }
  return items
}

function faqs(): FaqItem[] {
  const hear = HVAC_RETELL_AGENT_ID
    ? HVAC_DEMO_PHONE
      ? `Talk to it in your browser on this page, or call the demo line at ${HVAC_DEMO_PHONE.display}, and play the role of a homeowner.`
      : "Talk to it in your browser on this page and play the role of a homeowner."
    : "Watch the example calls on this page, then hear it answer your own calls during the free pilot."
  const list: FaqItem[] = [
    { question: "Does it sound robotic?", answer: `The best way to judge is to hear it yourself. ${hear}` },
    {
      question: "Do I keep my number?",
      answer:
        "Yes. Your company gets its own dedicated AI line, and you forward calls from your existing number to it. Customers keep dialing the number they already have.",
    },
    {
      question: "Does it only answer when I can't?",
      answer:
        "You choose: after hours and weekends, when nobody picks up, or all three. The After-Hours plan covers evenings, weekends and holidays. Full Coverage adds daytime overflow and no-answer coverage, for the calls you miss while you're on a job.",
    },
    {
      question: "How does it handle emergencies and gas smells?",
      answer:
        "No heat, no AC in extreme weather, gas smells and water leaks are live-transferred to your on-call tech, following the rules you set. For a gas smell, it first tells the caller to leave the building and call the gas company or 911, then captures the details.",
    },
    {
      question: "Does it work with ServiceTitan, Housecall Pro or Jobber?",
      answer: `It works alongside ${software} or no software at all: the job details are emailed to you right after each call. It doesn't book into your software or confirm a time; you do. Direct integration is coming soon.`,
    },
    {
      question: "Can it quote prices?",
      answer:
        "It answers your diagnostic or service-call fee and common price-range questions from your own price list. Anything else, like a full quote, goes to you.",
    },
    {
      question: `What happens after ${pilot.days} days?`,
      answer:
        "Pick a plan, or just turn off call forwarding. We don't take a credit card for the pilot, so nothing is charged automatically.",
    },
    {
      question: "What if we go over our minutes?",
      answer: `Extra minutes are billed at ${formatUsd(pricing.overagePerMinute)} per minute, and we'll let you know before you go over your minutes. During the free pilot, fair use is up to ${pilot.includedMinutes} call minutes.`,
    },
    {
      question: "How do I cancel?",
      answer: "Turn off call forwarding. Plans are month-to-month with no contract, so you can cancel anytime.",
    },
  ]
  if (siteConfig.supportsSpanish) list.splice(1, 0, { question: "Does it speak Spanish?", answer: `Yes. ${copy.spanish}` })
  return list
}

export const hvacContent: VerticalContent = {
  vertical: "hvac",
  path: "/",

  seo: {
    title: "AI Receptionist & After-Hours Answering for HVAC Companies | RapidNexTech",
    description:
      "AI receptionist for HVAC companies: answers missed and after-hours calls 24/7, routes emergencies to your on-call tech, emails you every job. 14-day free pilot.",
    ogAlt: "RapidNexTech AI receptionist for HVAC companies",
    serviceName: "AI Receptionist for HVAC Companies",
    serviceType: "AI receptionist / after-hours call answering for HVAC companies",
    serviceDescription: HVAC_DESCRIPTION,
    audience: "HVAC companies",
  },

  hero: {
    badge: "AI receptionist for US HVAC companies",
    titleStart: "Never lose an HVAC call again, even at ",
    titleHighlight: "2am in July or on a Sunday in January",
    titleEnd: ".",
    sub: "AI receptionist that answers every missed and after-hours call, routes emergencies to your on-call tech, and sends you the job details instantly.",
    primaryCta: { label: "Watch a real call", targetId: "watch-call", scroll: true },
    example: {
      ariaLabel: "Example job summary email",
      title: "New job summary",
      meta: "Saturday, 9:12 PM · after hours",
      rows: [
        ["Issue", "AC not cooling"],
        ["System", "Central AC"],
        ["ZIP", "In your service area"],
        ["Urgency", "Emergency"],
        ["Preferred window", "Tonight"],
      ],
      next: "transferred to your on-call tech; the caller was told you'll confirm the visit.",
      caption: "Example summary. You get one by email right after every call.",
    },
  },

  problem: {
    title: "You're on a job. The phone rings. Then what?",
    intro: "The call goes to voicemail, and the homeowner calls the next HVAC company on Google.",
    windows: [
      {
        icon: HardHat,
        title: "On a roof or under a house",
        text: "Your hands are full and the phone is in the truck. A homeowner with no AC hears your voicemail greeting.",
      },
      {
        icon: Truck,
        title: "Driving between jobs",
        text: "You can't pick up on the road. By the time you call back, they've already booked someone else.",
      },
      {
        icon: Moon,
        title: "After hours and on weekends",
        text: "AC fails at 2am in July. Furnaces quit on a Sunday in January. Homeowners won't wait for Monday.",
      },
    ],
    flow: [
      { icon: PhoneMissed, label: "The call isn't answered" },
      { icon: Voicemail, label: "It goes to voicemail" },
      { icon: Search, label: "The homeowner searches Google" },
      { icon: ArrowRight, label: "They call the next HVAC company" },
    ],
    calloutTitle: "Emergency calls are the jobs you can least afford to miss.",
    calloutText:
      "No heat, no AC, a gas smell or a water leak: these callers need someone now. They're your highest-value calls, and the most likely to be lost to voicemail.",
  },

  calculator: {
    title: "What are missed calls costing your business?",
    missedHint: "After hours, weekends and calls you missed on a job. Example value, change it.",
    valueLabel: "Average job value",
    valueHint: "What an average job is worth to you. Example value, change it.",
    formula: "Estimate only: missed calls × 52 weeks × booking rate × job value.",
    defaults: { missedPerWeek: "10", bookRate: "30", jobValue: "350" },
  },

  howItWorks: {
    title: "Three steps. Your customers keep dialing the same number.",
    steps: [
      {
        icon: PhoneForwarded,
        title: "Keep your number",
        text: "We give your company a dedicated AI line and set up call forwarding with you: after hours, on weekends, when nobody picks up, or all three.",
      },
      {
        icon: Wrench,
        title: "We set it up with your company",
        text: "Your service area, prices, emergency rules and on-call number. We test it live together on a short screen-share.",
      },
      {
        icon: Send,
        title: "It answers, routes and emails",
        text: "Emergencies go to your on-call tech. Every call becomes a job summary in your inbox, right after it ends.",
      },
    ],
    footnote: `${copy.goLive} Turn it off anytime by turning off forwarding.`,
  },

  callHandling: {
    title: "Built for the calls an HVAC company gets every day",
    items: callHandlingItems(),
    footnote: `Works alongside ${software} or no software at all: the job details go straight to you. Direct integration is coming soon.`,
  },

  pilot: {
    intro: "We do the setup. You keep your number. If it isn't worth it, turn forwarding off.",
    timeline: [
      {
        when: "Day 0",
        title: "30-min onboarding call",
        text: "We learn your service area, prices, emergency rules and on-call number.",
      },
      {
        when: "Day 1",
        title: "Your AI line goes live",
        text: `We set up your AI line, test it, and turn on forwarding with you. ${copy.goLive}`,
      },
      {
        when: `Days 2–${pilot.days}`,
        title: "Every call, summarized",
        text: "An email with the job details right after every call, and emergencies routed to your on-call tech.",
      },
      {
        when: `Day ${pilot.days}`,
        title: "You decide",
        text: "Pick a plan, or just turn forwarding off. No card was taken, so nothing is charged.",
      },
    ],
    terms: [
      `${pilot.days} days free`,
      "No credit card",
      "No contract",
      "We do the full setup",
      "Keep your existing number",
      "Cancel anytime by turning off forwarding",
      "Job summaries by email during the pilot, right after every call",
      `Fair use during the pilot: up to ${pilot.includedMinutes} call minutes`,
      "Companies that start with the pilot pay $0 setup",
    ],
    securityNote: false,
  },

  pricing: {
    intro: `Month-to-month. Average call is about ${pricing.avgCallMinutes} minutes.`,
    features: {
      "after-hours": [
        { text: "Evenings, weekends and holidays" },
        { text: "Instant job summaries by email and text message" },
        { text: "Emergency routing to your on-call tech" },
        { text: "Service-area check and price-range answers from your list" },
      ],
      "full-coverage": [
        { text: "Everything in After-Hours" },
        { text: "Daytime overflow / no-answer coverage" },
        { text: "Calls you miss while on a job" },
        { text: "Text-message job summaries" },
        { text: "Priority support" },
      ],
      "multi-location": [
        { text: "Up to 3 branches or crews" },
        { text: "Everything in Full Coverage" },
        { text: "Per-branch service areas and on-call routing" },
        { text: "Monthly review call" },
        { text: "Text-message job summaries" },
      ],
    },
    locationsNoun: "branches",
    foundingText: "First 5 HVAC companies: price locked for 12 months + setup waived, in exchange for a testimonial.",
    allPlansTerms: [
      "Month-to-month, cancel anytime",
      `Overage ${formatUsd(pricing.overagePerMinute)}/minute`,
      `Setup fee ${formatUsd(pricing.setupFee)}, waived for companies that start with the free pilot`,
      `Annual billing: ${pricing.annualFreeMonths} months free`,
    ],
    footnote: `Minutes are the actual limit; call counts are approximate. Average call is about ${pricing.avgCallMinutes} minutes. We'll let you know before you go over your minutes.`,
  },

  behindThis: { notCustomersOf: "HVAC companies" },

  faqTitle: "Questions HVAC owners ask us",
  faqs: faqs(),

  finalCta: {
    title: "Stop sending HVAC calls to voicemail.",
    text: `Watch it handle a call, then try it on your own phone line for ${pilot.days} days.`,
    primaryLabel: "Watch a real call",
    primaryTargetId: "watch-call",
    footer: `Free for ${pilot.days} days · No credit card · Keep your number · Cancel anytime by turning off forwarding`,
  },
}
