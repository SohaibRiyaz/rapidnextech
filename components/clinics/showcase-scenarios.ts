import { buildScenario, type ShowcaseScenario } from "@/components/demo/call-showcase-types"

/**
 * Example calls for /clinics. Everything here is fictional: the clinic ("Lumière Aesthetic Clinic,
 * Dubai"), the patients and the prices. Phone numbers are placeholders (+971 50 XXX XXXX).
 * The Arabic scenario is simple Gulf Arabic, to be checked by a native speaker.
 * audioUrl: set a recording URL to sync the timeline to audio (then give lines explicit timings).
 */

const speakerLabels = { caller: "Patient", agent: "AI receptionist" }
const to = "Clinic owner / designated contact"
const from = "AI Receptionist"
const PHONE = "+971 50 XXX XXXX"
/** Keeps the number left-to-right inside an Arabic sentence. */
const ltr = (s: string) => `⁦${s}⁩`

const priceQuestion = buildScenario({
  id: "price-question",
  tabLabel: "Price question",
  language: "en",
  audioUrl: null,
  speakerLabels,
  lines: [
    { speaker: "agent", text: "Thank you for calling Lumière Aesthetic Clinic. How can I help you today?" },
    { speaker: "caller", text: "Hi, how much is Botox with you?", fills: ["treatment"] },
    {
      speaker: "agent",
      text: "Botox at Lumière starts from AED 1,200 for one area. The exact price depends on the areas you'd like treated, and the doctor confirms it at your consultation.",
    },
    { speaker: "caller", text: "Okay. Do you have anything this week? Thursday evening would be best.", fills: ["time"] },
    { speaker: "agent", text: "I can send a booking request for Thursday evening. May I have your name, please?" },
    { speaker: "caller", text: "Sarah Mitchell.", fills: ["name"] },
    { speaker: "agent", text: "Thank you, Sarah. What's the best number for the team to call you back?" },
    { speaker: "caller", text: `It's ${PHONE}.`, fills: ["phone"] },
    {
      speaker: "agent",
      text: "Got it. I've sent your request for Botox on Thursday evening to our team, and they'll call you to confirm the time.",
      fills: ["language", "urgency"],
    },
  ],
  fields: [
    { key: "name", label: "Name", value: "Sarah M." },
    { key: "phone", label: "Callback number", value: PHONE },
    { key: "treatment", label: "Treatment", value: "Botox" },
    { key: "time", label: "Preferred time", value: "Thursday evening" },
    { key: "language", label: "Language", value: "English" },
    { key: "urgency", label: "Urgency", value: "Routine" },
  ],
  summary: {
    urgent: false,
    urgencyLabel: "Routine",
    to,
    from,
    subject: "Routine · Booking request: Botox · Sarah M.",
    text: "Sarah asked about the price of Botox and was given the range from your price list (from AED 1,200 per area, confirmed at consultation). She would like an appointment on Thursday evening. Please call her back to confirm a time.",
  },
})

const bookingArabic = buildScenario({
  id: "booking-arabic",
  tabLabel: "Booking in Arabic",
  language: "ar",
  audioUrl: null,
  speakerLabels,
  typingCps: 30,
  lines: [
    {
      speaker: "agent",
      text: "مرحبا، معك موظفة الاستقبال في عيادة لوميير للتجميل. كيف أقدر أساعدك؟",
      translation: "Hello, this is the receptionist at Lumière Aesthetic Clinic. How can I help you?",
    },
    {
      speaker: "caller",
      text: "هلا، أبي أحجز جلسة تنظيف بشرة.",
      translation: "Hi, I'd like to book a facial cleansing session.",
      fills: ["treatment", "language"],
    },
    { speaker: "agent", text: "أكيد. أي يوم يناسبك؟", translation: "Of course. Which day suits you?" },
    { speaker: "caller", text: "يوم السبت الصبح إذا ممكن.", translation: "Saturday morning, if possible.", fills: ["time"] },
    { speaker: "agent", text: "تمام. ممكن اسمك الكريم؟", translation: "Great. May I have your name, please?" },
    { speaker: "caller", text: "مريم أحمد.", translation: "Maryam Ahmed.", fills: ["name"] },
    {
      speaker: "agent",
      text: "تشرفنا يا مريم. ممكن رقمك عشان الفريق يتواصل معك؟",
      translation: "Nice to meet you, Maryam. Could I have your number so the team can contact you?",
    },
    { speaker: "caller", text: `رقمي ${ltr(PHONE)}.`, translation: `My number is ${PHONE}.`, fills: ["phone"] },
    {
      speaker: "agent",
      text: "شكراً يا مريم. أرسلت طلبك لجلسة تنظيف البشرة يوم السبت الصبح للفريق، وبيتواصلون معك لتأكيد الموعد.",
      translation:
        "Thank you, Maryam. I've sent your request for a facial cleansing session on Saturday morning to the team, and they'll contact you to confirm the appointment.",
      fills: ["urgency"],
    },
  ],
  fields: [
    { key: "name", label: "Name", value: "Maryam A." },
    { key: "phone", label: "Callback number", value: PHONE },
    { key: "treatment", label: "Treatment", value: "Facial cleansing" },
    { key: "time", label: "Preferred time", value: "Saturday morning" },
    { key: "language", label: "Language", value: "Arabic" },
    { key: "urgency", label: "Urgency", value: "Routine" },
  ],
  summary: {
    urgent: false,
    urgencyLabel: "Routine",
    to,
    from,
    subject: "Routine · Booking request: Facial cleansing · Maryam A.",
    text: "Maryam called in Arabic to book a facial cleansing session and would prefer Saturday morning. She was told the team will contact her to confirm. Please call her back, in Arabic, to confirm a time.",
  },
})

const urgentSwelling = buildScenario({
  id: "urgent-swelling",
  tabLabel: "Urgent: swelling after filler",
  language: "en",
  audioUrl: null,
  speakerLabels,
  lines: [
    { speaker: "agent", text: "Thank you for calling Lumière Aesthetic Clinic. How can I help you today?" },
    {
      speaker: "caller",
      text: "Hi, I had lip filler two days ago and now there's a lot of swelling and it's quite painful.",
      fills: ["treatment"],
    },
    {
      speaker: "agent",
      text: "I'm sorry to hear that, and thank you for calling. I can't give medical advice, but I'm flagging this as urgent for our medical team right now.",
      fills: ["urgency"],
    },
    { speaker: "agent", text: "May I have your full name and the best number to reach you?" },
    { speaker: "caller", text: `Layla Hassan. My number is ${PHONE}.`, fills: ["name", "phone", "language"] },
    {
      speaker: "agent",
      text: "Thank you, Layla. I've sent this to our team as urgent, and a member of staff will call you back as soon as possible.",
      fills: ["time"],
    },
    {
      speaker: "agent",
      text: "If it gets worse or you have any trouble breathing, please call 998 for an ambulance straight away.",
    },
    { speaker: "caller", text: "Okay, thank you." },
  ],
  fields: [
    { key: "name", label: "Name", value: "Layla H." },
    { key: "phone", label: "Callback number", value: PHONE },
    { key: "treatment", label: "Treatment", value: "Lip filler, 2 days ago" },
    { key: "time", label: "Preferred time", value: "As soon as possible" },
    { key: "language", label: "Language", value: "English" },
    { key: "urgency", label: "Urgency", value: "URGENT" },
  ],
  summary: {
    urgent: true,
    urgencyLabel: "URGENT",
    to,
    from,
    subject: "URGENT · Swelling and pain after lip filler · Layla H.",
    text: "Layla reports significant swelling and pain two days after lip filler at the clinic. No medical advice was given; she was told a member of staff will call back as soon as possible, and to call 998 if it gets worse. Please call her back now.",
  },
})

export const clinicScenarios: ShowcaseScenario[] = [priceQuestion, bookingArabic, urgentSwelling]
