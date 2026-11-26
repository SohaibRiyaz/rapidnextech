import { Check, Minus } from "lucide-react"
import { SectionHeading } from "@/components/dental/section-heading"
import { sectionY } from "@/components/dental/styles"

/** HVAC homepage: "AI receptionist vs. traditional answering service". No competitor names, no numbers. */
const ROWS: { topic: string; ai: string; service: string }[] = [
  { topic: "Answering", ai: "Picks up instantly, every time", service: "Callers can wait on hold" },
  {
    topic: "Setup",
    ai: "Set up with your prices, service area and emergency rules",
    service: "A generic script",
  },
  {
    topic: "Billing",
    ai: "Flat monthly plans with minutes included",
    service: "Per-minute billing that spikes in summer",
  },
  { topic: "What you get", ai: "The full job details, by email and text message", service: "A message to call back" },
]

export function LandingComparison() {
  return (
    <section aria-labelledby="compare-title" className={sectionY}>
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading id="compare-title" eyebrow="Compare" title="AI receptionist vs. traditional answering service" />

        {/* Phones: one card per row. From md: a 3-column table. */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
          <div className="hidden grid-cols-[0.8fr_1.2fr_1.2fr] border-b border-border bg-muted/50 text-sm font-semibold md:grid" aria-hidden="true">
            <div className="px-5 py-3 text-muted-foreground">&nbsp;</div>
            <div className="px-5 py-3 text-primary">AI receptionist</div>
            <div className="px-5 py-3 text-muted-foreground">Traditional answering service</div>
          </div>
          <dl>
            {ROWS.map((r, i) => (
              <div
                key={r.topic}
                className={`grid gap-3 px-5 py-4 md:grid-cols-[0.8fr_1.2fr_1.2fr] md:gap-0 md:px-0 md:py-0 ${i ? "border-t border-border" : ""}`}
              >
                <dt className="text-sm font-semibold text-foreground md:px-5 md:py-4">{r.topic}</dt>
                <dd className="flex items-start gap-2 text-sm md:px-5 md:py-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>
                    <span className="font-semibold md:sr-only">AI receptionist: </span>
                    {r.ai}
                  </span>
                </dd>
                <dd className="flex items-start gap-2 text-sm text-muted-foreground md:px-5 md:py-4">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    <span className="font-semibold md:sr-only">Answering service: </span>
                    {r.service}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
