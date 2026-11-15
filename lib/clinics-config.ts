/**
 * Single source of truth for the /clinics page (Gulf & Egypt clinics offer).
 * Components only read from here. Blocks tied to a null value are hidden.
 */

/** Opens the WhatsApp demo (the AI receptionist replies on this number). */
export const WHATSAPP_DEMO_URL = "https://wa.me/18132142552"

/** Opens a chat with our team, with a pre-filled first message. */
export const WHATSAPP_CONTACT_URL =
  "https://wa.me/18132142552?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20the%20AI%20receptionist%20for%20my%20clinic"

/** Phone number for the AI calling demo, e.g. "+971 4 123 4567". Every phone-demo element is hidden while null. */
export const PHONE_DEMO_NUMBER = null as string | null

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

export function formatUsdPrice(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: value % 1 ? 2 : 0 })}`
}
