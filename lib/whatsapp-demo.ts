export const WHATSAPP_DEMO_PHONE_E164 = "12148964186"
export const WHATSAPP_DEMO_PHONE_DISPLAY = "+1 (214) 896-4186"

const BASE_DEMO_MESSAGE =
  "Hi, I want to see how patient inquiries are handled from first message to booking."

export function buildWhatsAppDemoMessage(_contextLabel?: string): string {
  return BASE_DEMO_MESSAGE
}

export function getWhatsAppDemoUrl(contextLabel?: string): string {
  const message = encodeURIComponent(buildWhatsAppDemoMessage(contextLabel))
  return `https://wa.me/${WHATSAPP_DEMO_PHONE_E164}?text=${message}`
}
