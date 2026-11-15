import { Check, Info, PhoneCall, Sparkles } from "lucide-react"
import { SectionHeading } from "@/components/dental/section-heading"
import { card, primaryCta, secondaryCta, sectionAnchor, sectionY } from "@/components/dental/styles"
import {
  CALLING_ADDON,
  CONVERSATION_DEFINITION,
  EGYPT_NOTE,
  OVERAGE,
  PILOT,
  PLANS,
  SETUP_WAIVED_NOTE,
  WHATSAPP_CONTACT_URL,
  formatUsdPrice,
  whatsappWithText,
  type ClinicPlan,
} from "@/lib/clinics-config"
import { cn } from "@/lib/utils"
import { ConversationTip } from "./conversation-tip"
import { TrackedLink } from "./tracked-link"

function planMessage(plan: ClinicPlan) {
  return plan.id === "group"
    ? `Hi, I'd like to talk about the Clinic Group plan for our clinics`
    : `Hi, I'd like to start the free pilot on the ${plan.name} plan for my clinic`
}

function PlanCard({ plan }: { plan: ClinicPlan }) {
  const headingId = `clinic-plan-${plan.id}`
  const popular = Boolean(plan.badge)
  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6 text-card-foreground md:p-8",
        popular ? "border-2 border-primary shadow-2xl shadow-primary/15 lg:-my-4 lg:py-10" : "border-border shadow-sm",
      )}
    >
      {plan.badge ? (
        <p className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
          {plan.badge}
        </p>
      ) : null}

      <h3 id={headingId} className="text-xl font-bold">
        {plan.name}
      </h3>
      <p className="mt-4 flex items-baseline gap-1.5">
        {plan.priceFrom ? <span className="text-base font-medium text-muted-foreground">from</span> : null}
        <span className="text-4xl font-bold tracking-tight">{formatUsdPrice(plan.price)}</span>
        <span className="text-muted-foreground">/month</span>
      </p>
      <p className="mt-2 flex items-center text-sm text-muted-foreground">
        <span>
          Up to <span className="font-semibold text-foreground">{plan.conversations.toLocaleString("en-US")}</span>{" "}
          conversations/month
        </span>
        <ConversationTip />
      </p>

      <div className="mt-6 flex-1 border-t border-border pt-6">
        {plan.includesPrevious ? <p className="mb-3 text-sm font-semibold">{plan.includesPrevious}</p> : null}
        <ul className="space-y-3">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <TrackedLink
        href={whatsappWithText(planMessage(plan))}
        event="clinics_plan_click"
        params={{ plan: plan.id }}
        className={cn(popular ? primaryCta : secondaryCta, "mt-8 w-full")}
      >
        {plan.cta}
        <span className="sr-only"> ({plan.name} plan)</span>
      </TrackedLink>
    </article>
  )
}

export function ClinicsPricing() {
  return (
    <section id="pricing" aria-labelledby="clinics-pricing-title" className={`${sectionY} ${sectionAnchor} bg-muted/40`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          id="clinics-pricing-title"
          eyebrow="Pricing"
          title="Simple monthly plans in USD"
          intro="Every plan includes the WhatsApp AI receptionist. Add AI calling to any plan."
        />

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3 lg:items-stretch">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Calling add-on */}
        <article
          aria-labelledby="calling-addon-title"
          className={`${card} mx-auto mt-12 flex max-w-4xl flex-col gap-5 p-6 md:flex-row md:items-center md:p-8`}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PhoneCall className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h3 id="calling-addon-title" className="text-lg font-bold">
              {CALLING_ADDON.name}
            </h3>
            <p className="mt-1 leading-relaxed text-muted-foreground">
              Answers missed calls on a local number your clinic forwards to. {CALLING_ADDON.includedMinutes} call
              minutes included, then {formatUsdPrice(CALLING_ADDON.perMinuteAfter)}/min. {CALLING_ADDON.note}
            </p>
          </div>
          <p className="shrink-0 text-2xl font-bold">
            +{formatUsdPrice(CALLING_ADDON.price)}
            <span className="text-base font-normal text-muted-foreground">/month</span>
          </p>
        </article>

        {/* Terms for all plans */}
        <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-border bg-background p-5">
          <h3 className="mb-3 text-sm font-semibold">All plans</h3>
          <ul className="grid gap-3 text-sm text-foreground sm:grid-cols-2">
            {OVERAGE.terms.map((term) => (
              <li key={term} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {term}
              </li>
            ))}
          </ul>
          <p className="mt-4 flex gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              {CONVERSATION_DEFINITION} <span className="font-semibold text-foreground">{EGYPT_NOTE}</span>
            </span>
          </p>
        </div>

        {/* Pilot */}
        <div
          id="pilot"
          className="mx-auto mt-10 flex max-w-4xl scroll-mt-24 flex-col items-center gap-5 rounded-2xl border-2 border-primary/40 bg-primary/5 p-6 text-center md:flex-row md:p-8 md:text-left"
        >
          <Sparkles className="h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
          <div className="flex-1">
            <h3 className="text-xl font-bold">{PILOT.split(" · ")[0]}</h3>
            <p className="mt-1 text-muted-foreground">
              {PILOT.split(" · ").slice(1).join(" · ")}. We set it up with your clinic&apos;s details, then you decide.{" "}
              {SETUP_WAIVED_NOTE}.
            </p>
          </div>
          <TrackedLink
            href={WHATSAPP_CONTACT_URL}
            event="clinics_contact_click"
            params={{ location: "pilot" }}
            className={`${primaryCta} w-full shrink-0 md:w-auto`}
          >
            Start on WhatsApp
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}
