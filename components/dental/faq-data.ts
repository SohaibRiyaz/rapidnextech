import { formatUsd, siteConfig } from "@/lib/site-config"
import type { FaqItem } from "@/lib/seo"

// Single source for the dental FAQ: rendered on / and /solutions/dental-clinics, and emitted as FAQPage JSON-LD.
// Every answer is built from site-config facts. Keep it that way.

const { copy, pricing, pilot } = siteConfig
const phoneSystems = copy.phoneSystems.join(", ")
const pms = copy.practiceSoftware.join(", ")

function demoSentence() {
  const demo = siteConfig.demoPhone
  return demo
    ? `Talk to it in your browser on this page, or call the demo line at ${demo.display} and play the role of a patient.`
    : "Talk to it in your browser on this page and play the role of a patient."
}

export function getDentalFaqs(): FaqItem[] {
  const faqs: FaqItem[] = [
    {
      question: "Does it sound robotic?",
      answer: `The best way to judge is to hear it yourself. ${demoSentence()}`,
    },
    {
      question: "Do I keep my current phone number?",
      answer:
        "Yes. Your practice gets its own dedicated AI line, and you forward calls from your existing number to it. Patients keep dialing the same number, and caller ID passes through.",
    },
    {
      question: "How does call forwarding work with my phone system?",
      answer: `You forward calls from your existing number to your AI line on a schedule (after hours and weekends), when nobody answers after a few rings, or both. It works with common dental phone systems like ${phoneSystems}, and with standard landlines. We set it up together on a short screen-share and test it live.`,
    },
    {
      question: "Does it only answer after hours?",
      answer:
        "You choose: after hours and weekends, when nobody picks up, or both. The After-Hours plan covers evenings, weekends and holidays. Full Coverage adds daytime overflow, no-answer and lunch-break coverage.",
    },
    {
      question: "Does it work with my practice management software?",
      answer: `Yes. It works alongside ${pms} and any other practice management software, because appointment requests go to your front desk. Direct scheduling integration is coming soon.`,
    },
    {
      question: "Can it handle dental emergencies?",
      answer: `Yes. ${copy.emergencies} You set the emergency rules (for example toothache, broken tooth, swelling or trauma) during onboarding.`,
    },
    {
      question: "Will it answer insurance questions correctly?",
      answer:
        "It answers from your practice's own accepted-insurance list, which you give us at setup. Anything outside that list is captured for your front desk to follow up.",
    },
    {
      question: "Can it book appointments?",
      answer:
        "It captures appointment requests 24/7: name, phone, new or existing patient, reason for visit, urgency or pain level, insurance, and preferred days and times. It sends a summary to your front desk, your team confirms with the patient, and the AI tells callers when to expect a confirmation call.",
    },
    {
      question: "Is patient information secure? Is it HIPAA compliant?",
      answer: copy.security,
    },
    {
      question: `What happens after the ${pilot.days} days?`,
      answer:
        "Pick a plan, or just turn off call forwarding. We don't take a credit card for the pilot, so nothing is charged automatically.",
    },
    {
      question: "What if we go over our minutes?",
      answer: `Extra minutes are billed at ${formatUsd(pricing.overagePerMinute)} per minute, and we'll warn you before you reach your limit. During the free pilot, fair use is up to ${pilot.includedMinutes} call minutes.`,
    },
    {
      question: "How do I cancel?",
      answer:
        "Turn off call forwarding. Plans are month-to-month with no contract, so you can cancel anytime.",
    },
  ]
  if (siteConfig.supportsSpanish) {
    faqs.splice(1, 0, {
      question: "Does it speak Spanish?",
      answer: `Yes. ${copy.spanish}`,
    })
  }
  return faqs
}
