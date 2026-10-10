import { Check } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { PilotForm } from "./pilot-form"
import { SecurityNote } from "./security-note"
import { SectionHeading } from "./section-heading"
import { sectionAnchor, sectionY } from "./styles"

export const pilotTimeline = [
  { when: "Day 0", title: "30-min onboarding call", text: "We learn your hours, services, insurance list and emergency rules." },
  {
    when: "Day 1",
    title: "Your AI line goes live",
    text: `We set up your AI line, test it, and turn on forwarding with you. ${siteConfig.copy.goLive}`,
  },
  {
    when: "Days 2–14",
    title: "Every call, summarized",
    text: "An email summary after every call, plus a weekly recap: calls answered, new patients captured, emergencies handled.",
  },
  { when: "Day 14", title: "You decide", text: "Pick a plan, or just turn forwarding off. No card was taken, so nothing is charged." },
]

export function PilotTimeline() {
  return (
    <ol className="relative space-y-6 border-l-2 border-primary/30 pl-6" aria-label="Pilot timeline">
      {pilotTimeline.map((step) => (
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

export function DentalPilotSection() {
  return (
    <section id="pilot" aria-labelledby="pilot-title" className={`${sectionY} ${sectionAnchor}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          id="pilot-title"
          eyebrow="Free pilot"
          title={`Your ${siteConfig.pilot.days}-day free pilot`}
          intro="We do the setup. You keep your number. If it isn't worth it, turn forwarding off."
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="space-y-8">
            <PilotTimeline />

            <div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">Pilot terms</h3>
              <ul className="space-y-2">
                {siteConfig.pilot.terms.map((term) => (
                  <li key={term} className="flex gap-2 text-sm leading-relaxed text-foreground/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {term}
                  </li>
                ))}
              </ul>
            </div>

            <SecurityNote />
          </div>

          <PilotForm location="homepage-pilot" />
        </div>
      </div>
    </section>
  )
}
