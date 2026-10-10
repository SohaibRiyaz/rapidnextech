import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getDentalFaqs } from "./faq-data"
import { SectionHeading } from "./section-heading"
import { anchorOffset, sectionY, textLink } from "./styles"

export function DentalFaq({ showDeepLink = true }: { showDeepLink?: boolean }) {
  const faqs = getDentalFaqs()
  return (
    <section id="faq" aria-labelledby="faq-title" className={`${sectionY} ${anchorOffset}`}>
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions dental practices ask us" />

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${i}`}
              className="rounded-xl border border-border bg-card px-5 data-[state=open]:border-primary/40"
            >
              <AccordionTrigger className="min-h-[56px] text-left text-base font-semibold text-card-foreground hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {showDeepLink ? (
          <p className="mt-8 text-center">
            <Link href="/solutions/dental-clinics" className={textLink}>
              More detail: how the AI receptionist works for dental practices
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  )
}
