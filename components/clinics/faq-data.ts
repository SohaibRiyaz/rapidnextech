import {
  COEXISTENCE_ENABLED,
  CONVERSATION_DEFINITION,
  OVERAGE,
  SETUP_FEE_USD,
  formatUsdPrice,
} from "@/lib/clinics-config"
import type { FaqItem } from "@/lib/seo"

// Single source for the /clinics FAQ: rendered on the page and emitted as FAQPage JSON-LD.
// Every answer comes from the product facts in lib/clinics-config.ts. Keep it that way.

export function getClinicsFaqs(): FaqItem[] {
  return [
    {
      question: "Does it understand Arabic and voice notes?",
      answer:
        "Yes. It understands text and voice notes in English and Arabic, and replies in the patient's language. The Arabic is fine-tuned with your team during setup so it sounds right for your clinic and your patients.",
    },
    {
      question: "Do we keep our WhatsApp number?",
      answer: COEXISTENCE_ENABLED
        ? "Yes. It runs on your clinic's existing WhatsApp Business number, so patients message the number they already know. Your staff can keep using the WhatsApp Business app on their phones and reply from there whenever they want."
        : "Yes. It runs on your clinic's existing WhatsApp Business number, so patients message the number they already know.",
    },
    {
      question: "Can our team take over a conversation?",
      answer: COEXISTENCE_ENABLED
        ? "Yes. Your staff can take over any conversation from the dashboard, or straight from the WhatsApp Business app on their phone, and hand it back to the AI with one tap."
        : "Yes. Your staff can take over any conversation from the dashboard and hand it back to the AI with one tap.",
    },
    {
      question: "What counts as a conversation?",
      answer: `${CONVERSATION_DEFINITION} Each plan includes a monthly number of conversations; extra conversations are ${formatUsdPrice(OVERAGE.perConversation)} each.`,
    },
    {
      question: "Who pays WhatsApp's fees?",
      answer:
        "WhatsApp charges its own fees for marketing and follow-up template messages. We bill those at cost, with no mark-up. Replies to patients who message you are covered by your plan.",
    },
    {
      question: "How is patient data handled?",
      answer:
        "The AI only collects what is needed to handle the enquiry, such as the patient's name, the treatment they are interested in and their preferred timing. It does not ask for medical records and does not give diagnoses over WhatsApp. Medical questions are passed to your team.",
    },
    {
      question: "What happens if the AI can't answer?",
      answer:
        "It tells the patient a team member will follow up and passes the conversation to your staff. Urgent or sensitive cases are escalated to a person straight away, following the rules you set.",
    },
    {
      question: "How long does setup take?",
      answer: `We configure it with your treatments, prices, hours and rules, then test and refine it with your team before it goes live. Setup is $${SETUP_FEE_USD} per location, waived for our first 3 clinics, and the 7-day pilot is free.`,
    },
    {
      question: "How do we cancel?",
      answer:
        "Plans are month-to-month with no contract. You can cancel anytime by messaging us on WhatsApp. The 7-day pilot needs no card, so there is nothing to cancel if you decide not to continue.",
    },
  ]
}
