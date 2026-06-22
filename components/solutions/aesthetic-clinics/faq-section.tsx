"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { aestheticClinicFaqs } from "./faq-data"

export { aestheticClinicFaqs }

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
