import type { VerticalContent } from "@/content/verticals/types"
import { InfoTip } from "./info-tip"
import { SectionHeading } from "./section-heading"
import { card, sectionY } from "./styles"

/** Landing template: "What it handles". Copy comes from content/verticals/*. */
export function LandingCallHandling({ content }: { content: VerticalContent }) {
  const { callHandling } = content
  return (
    <section aria-labelledby="handles-title" className={sectionY}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading id="handles-title" eyebrow="What it handles" title={callHandling.title} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {callHandling.items.map(({ icon: Icon, title, text, tip }) => (
            <li key={title} className={`${card} flex gap-4 p-5`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="flex items-center font-semibold text-card-foreground">
                  {title}
                  {tip ? <InfoTip label={tip.label} text={tip.text} /> : null}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-8 max-w-3xl text-center text-muted-foreground">{callHandling.footnote}</p>
      </div>
    </section>
  )
}
