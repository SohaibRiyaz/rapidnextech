import type { VerticalContent } from "@/content/verticals/types"
import { SectionHeading } from "./section-heading"
import { sectionAnchor, sectionY } from "./styles"

/** Landing template: "How it works". Copy comes from content/verticals/*. */
export function LandingHowItWorks({ content }: { content: VerticalContent }) {
  const { howItWorks } = content
  return (
    <section id="how-it-works" aria-labelledby="how-title" className={`${sectionY} ${sectionAnchor} bg-muted/40`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading id="how-title" eyebrow="How it works" title={howItWorks.title} />

        <ol className="grid gap-6 md:grid-cols-3">
          {howItWorks.steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">{title}</h3>
              <p className="leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-sm text-muted-foreground">{howItWorks.footnote}</p>
      </div>
    </section>
  )
}
