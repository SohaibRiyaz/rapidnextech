import { buildScenario, type ShowcaseScenario } from "@/components/demo/call-showcase-types"
import { WINDOWS_AGENT_NAME, WINDOWS_COMPANY } from "@/lib/windows-config"

/**
 * Example calls for /demo/window-installer. Everything here is fictional: the company
 * ("Clearview Windows & Doors", Central Florida), the callers and the addresses. Phone numbers use the
 * reserved fictional 555-01XX range. No prices are quoted: quotes are free after a measurement visit.
 */

const speakerLabels = { caller: "Caller", agent: `${WINDOWS_AGENT_NAME} · AI receptionist` }
const to = "Owner"
const from = "AI Receptionist"
const GREETING = `Thanks for calling ${WINDOWS_COMPANY}, this is ${WINDOWS_AGENT_NAME}. How can I help you?`

const quote = buildScenario({
  id: "quote-8-windows",
  tabLabel: "Quote for 8 windows",
  language: "en",
  audioUrl: null,
  speakerLabels,
  lines: [
    { speaker: "agent", text: GREETING },
    {
      speaker: "caller",
      text: "Hi, I'd like a quote to replace eight windows in my house. They're old single-pane ones.",
      fills: ["project", "count"],
    },
    { speaker: "agent", text: "Happy to help. Are you thinking standard replacement windows or impact windows?" },
    { speaker: "caller", text: "Impact windows, if they're not crazy expensive.", fills: ["type"] },
    { speaker: "agent", text: "Got it. What's the ZIP code for the home?" },
    { speaker: "caller", text: "32806.", fills: ["area"] },
    { speaker: "agent", text: "Thanks, that's in our service area. When are you hoping to get the work done?" },
    { speaker: "caller", text: "In the next month or two, before storm season.", fills: ["timeline"] },
    { speaker: "agent", text: "And what's your name, and the best number to reach you?" },
    { speaker: "caller", text: "Mark Davis, (407) 555-0123.", fills: ["name", "phone"] },
    { speaker: "agent", text: "Thanks, Mark. When would a measurement visit work best for you?" },
    { speaker: "caller", text: "Weekday afternoons are easiest.", fills: ["visit"] },
    {
      speaker: "agent",
      text: "Perfect. I've sent your request to the team. They'll call you to confirm a time for the measurement visit.",
    },
  ],
  fields: [
    { key: "name", label: "Name", value: "Mark D." },
    { key: "phone", label: "Callback number", value: "(407) 555-0123" },
    { key: "area", label: "Service area", value: "32806 · in area" },
    { key: "project", label: "Project", value: "Window replacement" },
    { key: "count", label: "Windows", value: "8" },
    { key: "type", label: "Window type", value: "Impact" },
    { key: "timeline", label: "Timeline", value: "1–2 months" },
    { key: "visit", label: "Visit window", value: "Weekday afternoons" },
  ],
  summary: {
    urgent: false,
    urgencyLabel: "Routine",
    to,
    from,
    subject: "Routine · Quote for 8 impact windows · Mark D.",
    text: "Mark wants a quote to replace 8 old single-pane windows with impact windows within 1–2 months. ZIP 32806 is in your service area. He prefers a measurement visit on a weekday afternoon. Please call him to confirm a time.",
  },
})

const broken = buildScenario({
  id: "broken-window-night",
  tabLabel: "Broken window at night",
  language: "en",
  audioUrl: null,
  speakerLabels,
  lines: [
    { speaker: "agent", text: GREETING },
    {
      speaker: "caller",
      text: "Hi, a branch just came through our back sliding door. The glass is shattered and it's 10 at night.",
      fills: ["issue"],
    },
    { speaker: "agent", text: "I'm sorry, that sounds stressful. Is everyone okay, and is anyone near the broken glass?" },
    { speaker: "caller", text: "We're fine, we've moved away from it. But the door is wide open." },
    {
      speaker: "agent",
      text: "Good, please stay clear of the glass. I'm marking this as urgent for the owner right now. What's your name and callback number?",
      fills: ["urgency"],
    },
    { speaker: "caller", text: "Jen Alvarez, (407) 555-0168.", fills: ["name", "phone"] },
    { speaker: "agent", text: "Thank you, Jen. And the address?" },
    { speaker: "caller", text: "2XX Pine Avenue, 32789.", fills: ["address"] },
    {
      speaker: "agent",
      text: "Thanks. I've sent this to the owner as urgent with your details, so they can call you back as soon as possible.",
    },
  ],
  fields: [
    { key: "name", label: "Name", value: "Jen A." },
    { key: "phone", label: "Callback number", value: "(407) 555-0168" },
    { key: "address", label: "Address", value: "2XX Pine Ave, 32789" },
    { key: "issue", label: "Issue", value: "Shattered sliding door glass" },
    { key: "urgency", label: "Urgency", value: "URGENT" },
  ],
  summary: {
    urgent: true,
    urgencyLabel: "URGENT",
    to,
    from,
    subject: "URGENT · Shattered sliding door at night · Jen A.",
    text: "Jen called at 10:02 PM: a branch shattered the glass in her back sliding door and the opening is exposed. Everyone is safe and away from the glass. Flagged urgent; please call her back as soon as possible.",
  },
})

const price = buildScenario({
  id: "how-much",
  tabLabel: "“How much?”",
  language: "en",
  audioUrl: null,
  speakerLabels,
  lines: [
    { speaker: "agent", text: GREETING },
    { speaker: "caller", text: "Hi, how much do you charge for a new front door?", fills: ["project"] },
    {
      speaker: "agent",
      text: "Every home is a little different, so we give a free, exact quote after a quick measurement visit. Would you like me to request one?",
      fills: ["quote"],
    },
    { speaker: "caller", text: "Sure, as long as it's free." },
    { speaker: "agent", text: "It is. What's the ZIP code for the home?" },
    { speaker: "caller", text: "34741.", fills: ["area"] },
    { speaker: "agent", text: "That's in our area. Your name and the best number to reach you?" },
    { speaker: "caller", text: "Tom Reed, (407) 555-0191.", fills: ["name", "phone"] },
    { speaker: "agent", text: "Thanks, Tom. When's a good time for the visit?" },
    { speaker: "caller", text: "Saturday mornings.", fills: ["visit"] },
    { speaker: "agent", text: "Got it. The team will call you to confirm a Saturday-morning measurement visit." },
  ],
  fields: [
    { key: "name", label: "Name", value: "Tom R." },
    { key: "phone", label: "Callback number", value: "(407) 555-0191" },
    { key: "area", label: "Service area", value: "34741 · in area" },
    { key: "project", label: "Project", value: "New front door" },
    { key: "quote", label: "Quote", value: "Free, after measurement" },
    { key: "visit", label: "Visit window", value: "Saturday mornings" },
  ],
  summary: {
    urgent: false,
    urgencyLabel: "Routine",
    to,
    from,
    subject: "Routine · Price question, front door · Tom R.",
    text: "Tom asked about the price of a new front door. He was told quotes are free and exact after a measurement visit, and asked for one. ZIP 34741 is in your service area. He prefers Saturday mornings; please call him to confirm.",
  },
})

export const windowsScenarios: ShowcaseScenario[] = [quote, broken, price]
