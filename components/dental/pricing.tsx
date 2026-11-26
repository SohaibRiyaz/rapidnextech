"use client"

import { Check, Sparkles } from "lucide-react"
import type { Vertical, VerticalContent } from "@/content/verticals/types"
import { trackEvent } from "@/lib/analytics"
import { approxCalls, formatUsd, siteConfig, type Plan } from "@/lib/site-config"
import { cn } from "@/lib/utils"
import { SELECT_PLAN_EVENT } from "./events"
import { InfoTip } from "./info-tip"
import { SectionHeading } from "./section-heading"
import { sectionAnchor, primaryCta, secondaryCta, sectionY } from "./styles"

type Copy = VerticalContent["pricing"]

function PlanCard({ plan, crossPage, copy, vertical }: { plan: Plan; crossPage: boolean; copy: Copy; vertical: Vertical }) {
  const href = crossPage ? `/?plan=${plan.id}#pilot` : "#pilot"
  const headingId = `plan-${plan.id}`
  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6 text-card-foreground md:p-8",
        plan.popular ? "border-2 border-primary shadow-2xl shadow-primary/15 lg:-my-4 lg:py-10" : "border-border shadow-sm",
      )}
    >
      {plan.popular ? (
        <p className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
          Most popular
        </p>
      ) : null}

      <h3 id={headingId} className="text-xl font-bold">
        {plan.name}
      </h3>
      <p className="mt-4 flex items-baseline gap-1.5">
        {plan.priceFrom ? <span className="text-base font-medium text-muted-foreground">from</span> : null}
        <span className="text-4xl font-bold tracking-tight">{formatUsd(plan.price)}</span>
        <span className="text-muted-foreground">/month</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{plan.includedMinutes.toLocaleString("en-US")} minutes</span>{" "}
        included (~{approxCalls(plan.includedMinutes).toLocaleString("en-US")} calls)
        {plan.locations > 1 ? ` · up to ${plan.locations} ${copy.locationsNoun}` : ""}
      </p>

      <ul className="mt-6 flex-1 space-y-3 border-t border-border pt-6">
        {copy.features[plan.id].map((f) => {
          const comingSoon = "comingSoon" in f && f.comingSoon
          return (
            <li key={f.text} className="flex items-start gap-2.5 text-sm leading-relaxed">
              <Check
                className={cn("mt-0.5 h-4 w-4 shrink-0", comingSoon ? "text-muted-foreground" : "text-primary")}
                aria-hidden="true"
              />
              <span className={comingSoon ? "text-muted-foreground" : ""}>
                {f.text}
                {comingSoon ? (
                  <>
                    {" "}
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs font-semibold text-foreground">
                      Coming soon
                    </span>
                    {copy.comingSoonTooltip ? <InfoTip label={`About ${f.text}`} text={copy.comingSoonTooltip} /> : null}
                  </>
                ) : null}
              </span>
            </li>
          )
        })}
      </ul>

      <a
        href={href}
        className={cn(plan.popular ? primaryCta : secondaryCta, "mt-8 w-full")}
        onClick={() => {
          trackEvent("pricing_cta_click", { plan: plan.id, vertical })
          if (!crossPage) window.dispatchEvent(new CustomEvent(SELECT_PLAN_EVENT, { detail: plan.id }))
        }}
      >
        {plan.cta}
        <span className="sr-only"> ({plan.name} plan)</span>
      </a>
    </article>
  )
}

/**
 * Landing template: pricing. Prices, minutes and plans come only from siteConfig.pricing (shared by
 * every vertical); the wording (features, terms, notes) comes from content/verticals/*.
 */
export function LandingPricing({ copy, vertical, crossPage = false }: { copy: Copy; vertical: Vertical; crossPage?: boolean }) {
  const { pricing } = siteConfig
  const founding = pricing.founding
  return (
    <section id="pricing" aria-labelledby="pricing-title" className={`${sectionY} ${sectionAnchor} bg-muted/40`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          id="pricing-title"
          eyebrow="Pricing"
          title="Simple monthly plans. Start with a free pilot."
          intro={copy.intro}
        />

        {founding.enabled && founding.spotsRemaining > 0 ? (
          <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-3 rounded-2xl border-2 border-primary/40 bg-primary/5 p-5 text-center sm:flex-row sm:text-left">
            <Sparkles className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
            <p className="flex-1 text-foreground">
              <span className="font-semibold">{vertical === "dental" ? "Founding Practice offer:" : "Founding offer:"}</span> {copy.foundingText}
            </p>
            <p className="shrink-0 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
              {founding.spotsRemaining} {founding.spotsRemaining === 1 ? "spot" : "spots"} remaining
            </p>
          </div>
        ) : null}

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3 lg:items-stretch">
          {pricing.plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} crossPage={crossPage} copy={copy} vertical={vertical} />
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-border bg-background p-5">
          <h3 className="sr-only">Terms for all plans</h3>
          <ul className="grid gap-3 text-sm text-foreground sm:grid-cols-2">
            {copy.allPlansTerms.map((term) => (
              <li key={term} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {term}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">{copy.footnote}</p>
        </div>
      </div>
    </section>
  )
}
