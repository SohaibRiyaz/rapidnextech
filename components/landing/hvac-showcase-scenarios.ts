import { buildScenario, type ShowcaseScenario } from "@/components/demo/call-showcase-types"

/**
 * Example calls for the HVAC homepage. Everything here is fictional: the company ("Gulf Coast Comfort
 * Heating & Air, Tampa FL"), the callers, prices and addresses. Phone numbers use the reserved
 * fictional 555-01XX range.
 */

const speakerLabels = { caller: "Caller", agent: "AI receptionist" }
const to = "Owner / on-call manager"
const from = "AI Receptionist"
const GREETING = "Thanks for calling Gulf Coast Comfort Heating & Air. How can I help you?"

const noAc = buildScenario({
  id: "no-ac-emergency",
  tabLabel: "No AC at 9pm in July",
  language: "en",
  audioUrl: null,
  speakerLabels,
  lines: [
    { speaker: "agent", text: GREETING },
    {
      speaker: "caller",
      text: "Hi, our AC just stopped working and it's 88 degrees in the house. We have a baby at home.",
      fills: ["issue"],
    },
    { speaker: "agent", text: "I'm sorry, let's get you help. What's the ZIP code there?" },
    { speaker: "caller", text: "33611.", fills: ["area"] },
    { speaker: "agent", text: "Thanks, you're in our service area. Is it central AC, a heat pump, or something else?" },
    { speaker: "caller", text: "Central AC. The fan runs, but it's blowing warm air.", fills: ["system"] },
    { speaker: "agent", text: "Got it. Can I get your name and the best callback number?" },
    { speaker: "caller", text: "Dana Lopez, (813) 555-0147.", fills: ["name", "phone"] },
    {
      speaker: "agent",
      text: "Thank you, Dana. With no AC and a baby at home in this heat, I'm treating this as an emergency and connecting you to our on-call tech now.",
      fills: ["urgency"],
    },
  ],
  fields: [
    { key: "name", label: "Name", value: "Dana L." },
    { key: "phone", label: "Callback number", value: "(813) 555-0147" },
    { key: "area", label: "Service area", value: "33611 · in area" },
    { key: "system", label: "System", value: "Central AC" },
    { key: "issue", label: "Issue", value: "No cooling, warm air" },
    { key: "urgency", label: "Urgency", value: "EMERGENCY" },
  ],
  summary: {
    urgent: true,
    urgencyLabel: "EMERGENCY",
    to,
    from,
    subject: "EMERGENCY · No AC, baby at home · Dana L.",
    text: "Dana called at 9:04 PM: central AC blowing warm air, 88°F inside, with a baby at home. ZIP 33611 is in your service area. Flagged as an emergency and transferred live to the on-call tech.",
  },
})

const tuneUp = buildScenario({
  id: "tune-up-routine",
  tabLabel: "Tune-up request",
  language: "en",
  audioUrl: null,
  speakerLabels,
  lines: [
    { speaker: "agent", text: GREETING },
    {
      speaker: "caller",
      text: "Hi, what do you charge to come out and look at a system? I'd also like an AC tune-up before summer.",
      fills: ["request"],
    },
    {
      speaker: "agent",
      text: "Our diagnostic fee is $89, and an AC tune-up is $129. Would you like me to request a maintenance visit?",
    },
    { speaker: "caller", text: "Yes, please. Weekday mornings work best, sometime next week.", fills: ["window"] },
    { speaker: "agent", text: "Sure. What's your ZIP code?" },
    { speaker: "caller", text: "33629.", fills: ["area"] },
    { speaker: "agent", text: "You're in our service area. What kind of system do you have?" },
    { speaker: "caller", text: "A heat pump, about eight years old.", fills: ["system"] },
    { speaker: "agent", text: "And your name and the best number to reach you?" },
    { speaker: "caller", text: "Mark Chen, (813) 555-0182.", fills: ["name", "phone"] },
    {
      speaker: "agent",
      text: "Thanks, Mark. I've sent your request for a weekday-morning tune-up next week to the team. They'll call you to confirm a time.",
    },
  ],
  fields: [
    { key: "name", label: "Name", value: "Mark C." },
    { key: "phone", label: "Callback number", value: "(813) 555-0182" },
    { key: "area", label: "Service area", value: "33629 · in area" },
    { key: "system", label: "System", value: "Heat pump, ~8 yrs" },
    { key: "request", label: "Request", value: "AC tune-up" },
    { key: "window", label: "Preferred window", value: "Weekday mornings" },
  ],
  summary: {
    urgent: false,
    urgencyLabel: "Routine",
    to,
    from,
    subject: "Routine · Tune-up request · Mark C.",
    text: "Mark asked about your diagnostic fee and was given $89 (diagnostic) and $129 (AC tune-up) from your price list. He'd like a tune-up on a weekday morning next week for a heat pump about 8 years old. Please call him to confirm a time.",
  },
})

const gasSmell = buildScenario({
  id: "gas-smell-safety",
  tabLabel: "Gas smell",
  language: "en",
  audioUrl: null,
  speakerLabels,
  lines: [
    { speaker: "agent", text: GREETING },
    { speaker: "caller", text: "Hi, I think I smell gas near the furnace. It's pretty strong.", fills: ["issue"] },
    {
      speaker: "agent",
      text: "Thank you for calling. For your safety, please leave the house now, and once you're outside, call the gas company or 911 first.",
      fills: ["safety"],
    },
    { speaker: "caller", text: "Okay, I'm walking out now." },
    { speaker: "agent", text: "Good. Once you're safe, we'll follow up. What's your name and a good callback number?" },
    { speaker: "caller", text: "Priya Shah, (813) 555-0199.", fills: ["name", "phone"] },
    { speaker: "agent", text: "Thank you, Priya. And the address?" },
    { speaker: "caller", text: "1XX Oak Street, 33606.", fills: ["address"] },
    {
      speaker: "agent",
      text: "Thanks. I'm flagging this as urgent for our on-call tech right now. Please call the gas company or 911 first if you haven't yet.",
      fills: ["urgency"],
    },
  ],
  fields: [
    { key: "name", label: "Name", value: "Priya S." },
    { key: "phone", label: "Callback number", value: "(813) 555-0199" },
    { key: "address", label: "Address", value: "1XX Oak St, 33606" },
    { key: "issue", label: "Issue", value: "Strong gas smell, furnace" },
    { key: "safety", label: "Safety step", value: "Told to leave, call gas co./911" },
    { key: "urgency", label: "Urgency", value: "URGENT – SAFETY" },
  ],
  summary: {
    urgent: true,
    urgencyLabel: "URGENT – SAFETY",
    to,
    from,
    subject: "URGENT – SAFETY · Gas smell near furnace · Priya S.",
    text: "Priya reported a strong gas smell near the furnace. She was told to leave the house and call the gas company or 911 first, and was walking out during the call. Flagged urgent for the on-call tech; please follow up once it's safe.",
  },
})

export const hvacScenarios: ShowcaseScenario[] = [noAc, tuneUp, gasSmell]
