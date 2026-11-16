import { Check } from "lucide-react"
import type { VerticalContent } from "@/content/verticals/types"
import { siteConfig } from "@/lib/site-config"
import { PilotForm } from "./pilot-form"
import { SecurityNote } from "./security-note"
import { SectionHeading } from "./section-heading"
import { sectionAnchor, sectionY } from "./styles"

export function PilotTimeline({ timeline }: { timeline: VerticalContent["pilot"]["timeline"] }) {
  return (
    <ol className="relative space-y-6 border-l-2 border-primary/30 pl-6" aria-label="Pilot timeline">
      {timeline.map((step) => (
        <li key={step.when} className="relative">
          <span
            className="absolute -left-[33px] top-1 h-4 w-4 rounded-full border-4 border-background bg-primary"
            aria-hidden="true"
          />
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">{step.when}</p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">{step.title}</h3>
          <p className="mt-1 leading-relaxed text-muted-foreground">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}

/** Landing template: free pilot timeline, terms and form. Copy comes from content/verticals/*. */
export function LandingPilotSection({ content }: { content: VerticalContent }) {
  const { pilot } = content
  return (
    <section id="pilot" aria-labelledby="pilot-title" className={`${sectionY} ${sectionAnchor}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          id="pilot-title"
          eyebrow="Free pilot"
          title={`Your ${siteConfig.pilot.days}-day free pilot`}
          intro={pilot.intro}
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="space-y-8">
            <PilotTimeline timeline={pilot.timeline} />

            <div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">Pilot terms</h3>
              <ul className="space-y-2">
                {pilot.terms.map((term) => (
                  <li key={term} className="flex gap-2 text-sm leading-relaxed text-foreground/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {term}
                  </li>
                ))}
              </ul>
            </div>

            {pilot.securityNote ? <SecurityNote /> : null}
          </div>

          <PilotForm location={content.vertical === "dental" ? "dental-pilot" : "homepage-pilot"} vertical={content.vertical} />
        </div>
      </div>
    </section>
  )
}
