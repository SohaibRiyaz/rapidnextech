import Link from "next/link"
import { ArrowRight, Check, Mail } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SectionHeading } from "@/components/dental/section-heading"
import { card, primaryCta, secondaryCta, sectionAnchor, sectionY, textLink } from "@/components/dental/styles"
import { industryIcons } from "@/lib/industries/icons"
import type { FaqEntry, IconItem, IndustryContent, ProofItem, ScenarioItem, SolutionItem } from "@/lib/industries/types"
import { siteConfig } from "@/lib/site-config"
import { PreparedFor } from "./prepared-for"

export function formatSar(amount: number) {
  return `SAR ${amount.toLocaleString("en-US")}`
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export function IndustryHero({ industry, ctaHref }: { industry: IndustryContent; ctaHref: string }) {
  const { hero, startingFrom } = industry
  return (
    <section aria-labelledby="industry-title" className="relative overflow-hidden pb-16 pt-28 md:pb-20 md:pt-36 short:pb-12 short:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-transparent to-transparent" aria-hidden="true" />
      <div className="container relative mx-auto max-w-4xl px-4 sm:px-6">
        <PreparedFor />
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">{hero.eyebrow}</p>
        <h1 id="industry-title" className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl short:text-5xl">
          {hero.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">{hero.intro}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href={ctaHref} className={primaryCta}>
            {hero.primaryCta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {hero.secondaryCta ? (
            <a href={hero.secondaryCta.href} className={secondaryCta}>
              {hero.secondaryCta.label}
            </a>
          ) : null}
        </div>

        {startingFrom ? (
          <p className="mt-5 text-sm text-muted-foreground">
            Projects typically start from{" "}
            <span className="font-semibold text-foreground">{formatSar(startingFrom.amount)}</span>
            {startingFrom.note ? <span>. {startingFrom.note}</span> : null}
          </p>
        ) : null}

        {hero.chips?.length ? (
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-foreground/80" aria-label="Highlights">
            {hero.chips.map((chip) => (
              <li key={chip} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                {chip}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Body sections                                                       */
/* ------------------------------------------------------------------ */

function IconCard({ item, tone = "primary" }: { item: IconItem; tone?: "primary" | "muted" }) {
  const Icon = industryIcons[item.icon]
  return (
    <div className={`${card} h-full p-6`}>
      <span
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${tone === "primary" ? "bg-primary/10 text-primary" : "bg-muted text-foreground"}`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-semibold text-card-foreground">{item.title}</h3>
      <p className="mt-2 leading-relaxed text-muted-foreground">{item.description}</p>
    </div>
  )
}

export function IconGridSection({
  id,
  eyebrow,
  title,
  intro,
  items,
  tone,
  muted,
}: {
  id: string
  eyebrow: string
  title: string
  intro?: string
  items: IconItem[]
  tone?: "primary" | "muted"
  muted?: boolean
}) {
  const cols = items.length === 4 ? "lg:grid-cols-4 sm:grid-cols-2" : "lg:grid-cols-3 sm:grid-cols-2"
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${sectionY} ${sectionAnchor} ${muted ? "bg-muted/40" : ""}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow} title={title} intro={intro} />
        <ul className={`mx-auto grid max-w-6xl gap-5 ${cols}`}>
          {items.map((item) => (
            <li key={item.title}>
              <IconCard item={item} tone={tone} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function SolutionsSection({ title, intro, items }: { title: string; intro?: string; items: SolutionItem[] }) {
  return (
    <section id="solutions" aria-labelledby="solutions-title" className={`${sectionY} ${sectionAnchor}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading id="solutions-title" eyebrow="What we build" title={title} intro={intro} />
        <ul className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = industryIcons[item.icon]
            return (
              <li key={item.title} className={`${card} flex flex-col p-6`}>
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold text-card-foreground">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{item.description}</p>
                {item.deliverables?.length ? (
                  <ul className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm" aria-label={`${item.title}: what you receive`}>
                    {item.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-foreground/90">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export function ScenariosSection({ title, intro, items }: { title: string; intro?: string; items: ScenarioItem[] }) {
  return (
    <section id="examples" aria-labelledby="examples-title" className={`${sectionY} ${sectionAnchor} bg-muted/40`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading id="examples-title" eyebrow="Examples" title={title} intro={intro} />
        <ul className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          {items.map((s) => (
            <li key={s.title} className={`${card} p-6`}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-card-foreground">{s.title}</h3>
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Example</span>
              </div>
              <dl className="space-y-3 text-sm leading-relaxed">
                <div>
                  <dt className="font-semibold text-foreground">Before</dt>
                  <dd className="text-muted-foreground">{s.before}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">After</dt>
                  <dd className="text-muted-foreground">{s.after}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function ProofSection({ title, intro, items }: { title: string; intro?: string; items: ProofItem[] }) {
  return (
    <section id="work" aria-labelledby="work-title" className={`${sectionY} ${sectionAnchor}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading id="work-title" eyebrow="Our work" title={title} intro={intro} />
        <ul className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <li key={p.href} className={`${card} flex flex-col p-6`}>
              <h3 className="text-lg font-semibold text-card-foreground">{p.title}</h3>
              <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">{p.summary}</p>
              <Link href={p.href} className={`${textLink} mt-4 text-sm`}>
                Read the case study <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Shared across every industry: how an engagement runs and the ways to work with us. */
export function ProcessSection() {
  const steps = [
    { title: "Free discovery call", body: "A short call or email exchange to understand your goals, users and constraints." },
    { title: "Written proposal", body: "Scope, timeline and a fixed price (or a monthly rate) in writing before any work starts." },
    { title: "Build with regular demos", body: "You see working progress at agreed checkpoints and give feedback as we go." },
    { title: "Launch and handover", body: "We deploy, test with you, and hand over access, documentation and training." },
    { title: "Support when you need it", body: "Optional care plans for updates, fixes and new features after launch." },
  ]
  const models = [
    { title: "Fixed-scope project", body: "A defined result for an agreed price. Best for websites, stores and first versions." },
    { title: "Monthly support", body: "A set number of hours each month for updates, improvements and fixes." },
    { title: "Dedicated developer", body: "A developer working as part of your team on a longer roadmap." },
  ]
  return (
    <section id="process" aria-labelledby="process-title" className={`${sectionY} ${sectionAnchor} bg-muted/40`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading id="process-title" eyebrow="How we work" title="Clear steps, no surprises" />
        <ol className="mx-auto grid max-w-6xl gap-5 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title} className={`${card} p-5`}>
              <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="font-semibold text-card-foreground">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>

        <h3 className="mx-auto mb-5 mt-14 max-w-6xl text-xl font-semibold text-foreground">Ways to work with us</h3>
        <ul className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {models.map((m) => (
            <li key={m.title} className={`${card} p-5`}>
              <h4 className="font-semibold text-card-foreground">{m.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-6 max-w-6xl text-sm text-muted-foreground">
          You own the code, content and domain we deliver. No lock-in.
        </p>
      </div>
    </section>
  )
}

export function IndustryFaqSection({ faqs, title }: { faqs: FaqEntry[]; title: string }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className={`${sectionY} ${sectionAnchor}`}>
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading id="faq-title" eyebrow="FAQ" title={title} />
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${i}`}
              className="rounded-xl border border-border bg-card px-5 data-[state=open]:border-primary/40"
            >
              <AccordionTrigger className="min-h-[56px] rounded-lg text-start text-base font-semibold text-card-foreground hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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

export function IndustryFinalCta({
  title,
  body,
  button,
  href,
}: {
  title: string
  body: string
  button: string
  href: string
}) {
  return (
    <section aria-labelledby="final-cta-title" className={sectionY}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-card p-8 text-center shadow-xl md:p-12">
          <h2 id="final-cta-title" className="text-3xl font-bold tracking-tight text-card-foreground md:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{body}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={href} className={primaryCta}>
              {button}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href={`mailto:${siteConfig.email}`} className={secondaryCta}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              {siteConfig.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
