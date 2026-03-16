"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Does this replace our CRM or calendar?",
    answer:
      "No. We sit on top of your existing CRM or calendar. When a buyer is qualified, we send them to your existing viewing booking flow (or to a booking page we create). Your pipeline and records stay exactly where they are.",
  },
  {
    question: "What if we do not have a booking system?",
    answer:
      "We can build a lightweight viewing booking page on your website. It connects to agent calendars and sends automatic WhatsApp confirmations, so you still get a structured scheduling flow without changing your stack.",
  },
  {
    question: "Which channels are supported?",
    answer:
      "WhatsApp, website chat, and inquiry forms. We can also route portal inquiries into WhatsApp where automation works best. Everything feeds into one conversation dashboard.",
  },
  {
    question: "How does qualification work?",
    answer:
      "The AI asks budget, location, property type, timeline, and financing questions. Only qualified buyers are sent a viewing link, so agents stop wasting time on low-intent inquiries.",
  },
  {
    question: "Can agents take over the conversation?",
    answer:
      "Yes. Your team can step in at any time with full context. The system is designed to automate the first stage and hand over when needed.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most agencies go live in 7–14 business days. We connect channels, configure qualification flows, set up booking links, and train your team.",
  },
  {
    question: "Is this GDPR compliant?",
    answer:
      "Yes. We follow UK GDPR standards, use secure storage, and only collect data needed for qualification and booking. Consent is collected where required.",
  },
  {
    question: "Does this work for rentals as well as sales?",
    answer:
      "Yes. We can configure separate flows for sales and lettings, with different qualification questions and routing rules for each team.",
  },
  {
    question: "What happens to leads who do not book right away?",
    answer:
      "They enter a nurture sequence with follow-ups, availability reminders, and relevant listings. This recovers leads that would otherwise go cold.",
  },
]

export function FAQSection() {
  return (
    <section className="py-20 md:py-28 theme-transition">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            FAQs
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
            Common Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about automating property inquiry conversion.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, i) => (
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
