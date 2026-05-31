"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const aestheticClinicFaqs = [
  {
    question: "Does this replace my booking system or calendar?",
    answer:
      "No \u2014 and it\u2019s designed not to. We sit on top of your existing booking platform as a conversion and engagement layer. When a potential patient is ready to book, we redirect them straight to your booking page or calendar. Your scheduling, payments, and patient records stay exactly where they are.",
  },
  {
    question: "How does the Instagram and Facebook DM automation work?",
    answer:
      "When someone sends your clinic a DM on Instagram or Facebook, our AI responds instantly with helpful, on-brand answers \u2014 treatment pricing, pre-care information, clinic hours, and more. If they\u2019re ready to book, the conversation naturally guides them to your booking link. You can review every conversation, and your team can jump in at any point.",
  },
  {
    question: "What happens to my current WhatsApp setup?",
    answer:
      "We set up WhatsApp Business API alongside your current number (or migrate it, depending on your preference). This enables automated responses, appointment confirmations, rebooking reminders, and broadcast campaigns \u2014 features that standard WhatsApp Business can\u2019t do. Your staff can still send personal messages as needed.",
  },
  {
    question: "Is patient data secure and compliant for GCC clinics?",
    answer:
      "Yes. We apply strict access controls and encryption for conversations, and we never share patient information with third parties. Consent is collected before any automated messaging begins, and data handling can be aligned to your clinic\u2019s internal policies.",
  },
  {
    question: "How does the rebooking automation know when to message patients?",
    answer:
      "Each treatment type has a clinically appropriate follow-up window (e.g., Botox at 3\u20134 months, lip filler at 6\u20139 months, laser hair removal at 4\u20136 weeks). After a patient\u2019s appointment, we schedule a friendly reminder when their next session is due \u2014 with a direct link to rebook through your existing system.",
  },
  {
    question: "Can I see what the AI is saying to my patients?",
    answer:
      "Absolutely. You get a full conversation dashboard showing every interaction across Instagram, WhatsApp, Facebook, and your website. You can review AI responses, see conversion metrics, and adjust the tone or content of automated replies at any time. Nothing goes out without your approval of the conversation flows.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most clinics go live within 5\u201310 business days. Setup includes connecting your social channels, configuring your treatment menu and pricing, building your conversation flows, and training your team. We handle all the technical work \u2014 your staff just needs about 30 minutes for a walkthrough.",
  },
  {
    question: "What if a patient asks something the AI can\u2019t handle?",
    answer:
      "The AI is designed to handle common inquiries (pricing, availability, pre/post-care, directions). For clinical questions, complex requests, or complaints, the conversation is smoothly handed over to your team with full context. You\u2019ll get an instant notification so nothing falls through the cracks.",
  },
  {
    question: "Do I need to change anything about how my clinic currently operates?",
    answer:
      "No. We integrate around your current workflow. Your booking system, calendar, payment processing, and patient records all stay the same. The only change is that inquiries get answered faster, confirmations go out automatically, and patients get timely rebooking reminders.",
  },
  {
    question: "What channels does this cover?",
    answer:
      "Depending on your plan: Instagram DMs, Facebook Messenger, WhatsApp Business, and a website chat widget. All conversations feed into one unified dashboard so your team has a single view of every patient interaction, regardless of where it started.",
  },
]

export function FAQSection() {
  return (
    <section id="faqs" className="py-20 md:py-28 theme-transition">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            FAQs
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
            Common Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about adding a patient conversion layer to your clinic.
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-3">
          {aestheticClinicFaqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border/60 rounded-xl px-6 data-[state=open]:border-primary/30 data-[state=open]:bg-primary/[0.02] transition-colors"
            >
              <AccordionTrigger className="text-left text-[15px] font-semibold text-foreground hover:text-primary py-5 [&[data-state=open]>svg]:rotate-180">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
