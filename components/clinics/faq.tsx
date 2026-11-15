import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SectionHeading } from "@/components/dental/section-heading"
import { sectionAnchor, sectionY } from "@/components/dental/styles"
import { getClinicsFaqs } from "./faq-data"

export function ClinicsFaq() {
  const faqs = getClinicsFaqs()
  return (
    <section id="faq" aria-labelledby="clinics-faq-title" className={`${sectionY} ${sectionAnchor}`}>
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading id="clinics-faq-title" eyebrow="FAQ" title="Questions clinics ask us" />
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${i}`}
              className="rounded-xl border border-border bg-card px-5 data-[state=open]:border-primary/40"
            >
              <AccordionTrigger className="min-h-[56px] rounded-lg text-left text-base font-semibold text-card-foreground hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
