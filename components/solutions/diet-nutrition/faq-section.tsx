"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Do I need a booking system already?",
    answer:
      "No. If you already use Calendly, Google Calendar, Acuity, or a similar tool, we integrate with it. If not, we can build a lightweight booking or plan checkout page on your website and plug it into the WhatsApp flow.",
  },
  {
    question: "Can this handle meal plan subscriptions and renewals?",
    answer:
      "Yes. We can direct clients to your Stripe or Shopify checkout and automate renewal reminders, check-in messages, and upgrade offers to improve retention.",
  },
  {
    question: "How does the qualification flow work?",
    answer:
      "The AI asks about goals (weight loss, muscle gain, health goals), dietary preferences, restrictions, timeline, and budget. It uses those answers to route prospects to the right plan or consultation.",
  },
  {
    question: "Does this replace my current tools?",
    answer:
      "No. We sit on top of your existing workflow and add an automated conversion layer. Your scheduling, payments, and client records stay where they are.",
  },
  {
    question: "Is this GDPR compliant?",
    answer:
      "Yes. All client data is processed and stored in compliance with UK GDPR and the Data Protection Act 2018. Consent is collected before automated messaging begins.",
  },
  {
    question: "Can my team jump into conversations?",
    answer:
      "Absolutely. You get a shared conversation dashboard where staff can take over any chat, see full context, and respond manually at any time.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most businesses go live within 5-10 business days. We connect your channels, build your plan flows, and train your team in a short walkthrough.",
  },
  {
    question: "What channels are supported?",
    answer:
      "Depending on your plan: WhatsApp Business, Instagram DMs, Facebook Messenger, and website chat. All inquiries flow into one dashboard.",
  },
  {
    question: "What if a client asks something complex?",
    answer:
      "The AI handles common questions. For complex nutrition or clinical questions, the chat is routed to your team with full context so nothing is lost.",
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
            Everything you need to know about adding a nutrition conversion layer to your business.
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
