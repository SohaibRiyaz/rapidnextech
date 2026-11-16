import type { VerticalContent } from "@/content/verticals/types"
import { SectionHeading } from "./section-heading"
import { card, sectionY } from "./styles"

/** Landing template: "The problem". Copy comes from content/verticals/*. */
export function LandingProblem({ content }: { content: VerticalContent }) {
  const { problem } = content
  return (
    <section aria-labelledby="problem-title" className={`${sectionY} bg-muted/40`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading id="problem-title" eyebrow="The problem" title={problem.title} intro={problem.intro} />

        <div className="grid gap-5 md:grid-cols-3">
          {problem.windows.map(({ icon: Icon, title, text }) => (
            <div key={title} className={`${card} p-6`}>
              <Icon className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="What happens to a missed call">
          {problem.flow.map(({ icon: Icon, label }, i) => (
            <li key={label} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-foreground">
                <span className="sr-only">Step {i + 1}: </span>
                {label}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-2xl border border-primary/25 bg-primary/5 p-6 md:p-8">
          <h3 className="text-xl font-semibold text-foreground md:text-2xl">{problem.calloutTitle}</h3>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{problem.calloutText}</p>
        </div>
      </div>
    </section>
  )
}
