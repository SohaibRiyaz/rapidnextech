import { siteConfig } from "@/lib/site-config"

/**
 * Single source of truth for the /clinics page (Gulf & Egypt clinics offer).
 * Components only read from here. Blocks tied to a null value are hidden.
 */

/** Opens the WhatsApp demo (the AI receptionist replies on this number). */
export const WHATSAPP_DEMO_URL = "https://wa.me/18132142552"

/** Opens a chat with our team, with a pre-filled first message. */
export const WHATSAPP_CONTACT_URL =
  "https://wa.me/18132142552?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20the%20AI%20receptionist%20for%20my%20clinic"

/**
 * Phone number for the AI calling demo, e.g. "+971 4 123 4567". Every phone-demo element is hidden while null.
 * There is no UAE number yet, so this stays null.
 */
export const PHONE_DEMO_NUMBER = null as string | null

/** How the "What your team receives" panel of the example calls looks: an email or a WhatsApp message. */
export const SUMMARY_CHANNEL = "email" as "email" | "whatsapp"

/* ------------------------------------------------------------------------------------------------
 * "Talk to it yourself": the browser voice demo (Retell) on /clinics
 *
 * TEMP-DENTAL-AGENT
 * Until a dedicated clinics agent exists, /clinics reuses the DENTAL Retell agent (an English-only
 * dental receptionist called "Maya"). Every temporary value is tagged TEMP-DENTAL-AGENT, here and in
 * components/clinics/demo-section.tsx. Search the code for "TEMP-DENTAL-AGENT" to find them all.
 *
 * To switch to the dedicated clinics agent:
 *   1. CLINIC_RETELL_AGENT_ID      → the clinics agent id ("agent_…"), ideally from a new env var
 *   2. CLINIC_RETELL_AGENT_VERSION → that agent's published version number
 *   3. CLINIC_AGENT_NAME           → the clinics agent's name
 *   4. CLINIC_DEMO_INTRO, CLINIC_DEMO_NOTES → swap in the commented "dedicated agent" versions below
 *      (they bring back "Speaks English and Arabic" and "Example clinic: Lumière Aesthetic Clinic, Dubai")
 *   5. Remove every TEMP-DENTAL-AGENT comment, including this block.
 * The Retell public key, reCAPTCHA key and webhook are shared: keep the clinics agent in the same
 * Retell workspace and point its webhook at the same URL.
 * ---------------------------------------------------------------------------------------------- */

// TEMP-DENTAL-AGENT: the same agent + version as the dental demo (NEXT_PUBLIC_RETELL_AGENT_ID / _VERSION).
export const CLINIC_RETELL_AGENT_ID: string | null = siteConfig.retellDemo.agentId
export const CLINIC_RETELL_AGENT_VERSION: number | null = siteConfig.retellDemo.agentVersion

/**
 * true: the voice demo shows its full UI, but Start only shows CLINIC_DEMO_PLACEHOLDER_MESSAGE
 * (no Retell, no microphone, no network call). false: a real browser call to the agent above.
 */
export const CLINIC_DEMO_PLACEHOLDER = false as boolean
export const CLINIC_DEMO_PLACEHOLDER_MESSAGE =
  "The live voice demo opens soon. Meanwhile, watch the example calls above or try the WhatsApp demo."

// TEMP-DENTAL-AGENT: the dental agent is called Maya. Change to the clinics agent's name.
export const CLINIC_AGENT_NAME = "Maya"

// TEMP-DENTAL-AGENT: describes the dental agent. Swap in the dedicated version below when switching.
export const CLINIC_DEMO_INTRO = "Play the role of a patient calling a dental clinic. No signup."
// Dedicated clinics agent:
// export const CLINIC_DEMO_INTRO = "Play the role of a patient asking about a treatment, a price or an appointment. No signup."

export const CLINIC_DEMO_MIC_NOTE = "Your browser will ask for microphone permission. Use headphones for best results."

// TEMP-DENTAL-AGENT: the first two notes describe the shared dental agent. Swap in the dedicated
// version below when switching.
export const CLINIC_DEMO_NOTES = [
  "Example receptionist: a dental clinic (English demo)",
  "Your clinic's version is set up with your own treatments and prices, in English and Arabic.",
  CLINIC_DEMO_MIC_NOTE,
]
// Dedicated clinics agent:
// export const CLINIC_DEMO_NOTES = [
//   "Speaks English and Arabic",
//   "Example clinic: Lumière Aesthetic Clinic, Dubai",
//   CLINIC_DEMO_MIC_NOTE,
// ]

/** Staff can reply from the WhatsApp Business app on their phone. When false, every mention of it is removed. */
export const COEXISTENCE_ENABLED = true as boolean

export const PILOT = "7-day free pilot · no card · no contract"
export const SETUP_FEE_USD = 399
export const SETUP_WAIVED_NOTE = "Setup fee waived for our first 3 clinics"

export type ClinicPlan = {
  id: "starter" | "growth" | "group"
  name: string
  price: number
  priceFrom?: boolean
  badge?: string
  cta: string
  /** Line shown above the feature list, e.g. "Everything in Starter, plus:". */
  includesPrevious?: string
  features: string[]
  conversations: number
}

export const PLANS: ClinicPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 149,
    cta: "Start the free pilot",
    features: [
      "1 WhatsApp number",
      "English + Arabic, text and voice notes",
      "Dashboard with live takeover and hand-back",
      "Booking requests sent to your team",
      "Escalation to staff",
    ],
    conversations: 500,
  },
  {
    id: "growth",
    name: "Growth",
    price: 299,
    badge: "Most popular",
    cta: "Start the free pilot",
    includesPrevious: "Everything in Starter, plus:",
    features: [
      "Separate flows per treatment or department",
      "Appointment reminders (up to 300/month)",
      "Follow-ups for enquiries that went quiet",
      "Monthly fine-tuning",
    ],
    conversations: 1500,
  },
  {
    id: "group",
    name: "Clinic Group",
    price: 599,
    priceFrom: true,
    cta: "Talk to us",
    includesPrevious: "Everything in Growth, plus:",
    features: [
      "Up to 3 WhatsApp numbers or branches",
      "Multi-user dashboard",
      "Monthly performance review",
      "Priority changes",
    ],
    conversations: 4000,
  },
]

export const CALLING_ADDON = {
  name: "AI calling add-on",
  price: 199,
  includedMinutes: 500,
  perMinuteAfter: 0.3,
  note: "Local number setup included.",
}

export const OVERAGE = {
  perConversation: 0.15,
  terms: [
    "Extra conversations: $0.15 each",
    "WhatsApp's own fees for marketing and follow-up templates are billed at cost",
    `Setup: $${SETUP_FEE_USD} per location (waived for our first 3 clinics)`,
    "Month-to-month, cancel anytime",
  ],
}

export const CONVERSATION_DEFINITION = "A conversation is one patient's chat thread within a day."

export const EGYPT_NOTE = "Clinics in Egypt: local pricing available, message us."

export const LANGUAGES_NOTE = "English and Arabic, fine-tuned with your team during setup."

/** WhatsApp chat with our team, pre-filled with a message (used for plan and pilot buttons). */
export function whatsappWithText(text: string) {
  return `${WHATSAPP_DEMO_URL}?text=${encodeURIComponent(text)}`
}

/** WhatsApp demo with a first message already typed (used on the "Two products" card). */
export const WHATSAPP_DEMO_PREFILL = "Hi! I'd like to try your AI receptionist demo."
export const WHATSAPP_DEMO_PREFILLED_URL = whatsappWithText(WHATSAPP_DEMO_PREFILL)

export function formatUsdPrice(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: value % 1 ? 2 : 0 })}`
}
