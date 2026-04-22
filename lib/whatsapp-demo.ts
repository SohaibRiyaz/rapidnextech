export const WHATSAPP_DEMO_PHONE_E164 = "12148964186"
export const WHATSAPP_DEMO_PHONE_DISPLAY = "+1 (214) 896-4186"

const BASE_DEMO_MESSAGE =
  "Hi RapidNexTech, I want to test the live WhatsApp assistant demo."

const START_INSTRUCTION =
  "Please start the demo flow. I understand I need to send this first message to begin."

export function buildWhatsAppDemoMessage(contextLabel?: string): string {
  if (!contextLabel) {
    return `${BASE_DEMO_MESSAGE}\n${START_INSTRUCTION}`
  }

  return `${BASE_DEMO_MESSAGE}\nContext: ${contextLabel}\n${START_INSTRUCTION}`
}

export function getWhatsAppDemoUrl(contextLabel?: string): string {
  const message = encodeURIComponent(buildWhatsAppDemoMessage(contextLabel))
  return `https://wa.me/${WHATSAPP_DEMO_PHONE_E164}?text=${message}`
}
