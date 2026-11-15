import { ArrowDown, Check, MessageCircle, Mic } from "lucide-react"
import { MeshGradient } from "@/components/mesh-gradient"
import { primaryCta, secondaryCta, textLink } from "@/components/dental/styles"
import { PILOT, SETUP_WAIVED_NOTE, WHATSAPP_CONTACT_URL } from "@/lib/clinics-config"
import { ScrollLink } from "./scroll-link"
import { TrackedLink } from "./tracked-link"

export function ClinicsHero() {
  return (
    <section aria-labelledby="clinics-title" className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20 short:pt-24 short:pb-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <MeshGradient />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.06]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="motion-safe:animate-fade-in-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary short:mb-3">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              For clinics in the UAE, Qatar, Saudi Arabia &amp; Egypt
            </p>

            <h1
              id="clinics-title"
              // Below 400px the web font needs 4 lines but the fallback font only 3: reserve 4 lines so the page
              // doesn't jump when the font loads.
              className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground [@media(max-width:399px)]:min-h-[4.4em] sm:text-5xl lg:text-[clamp(2.25rem,min(calc(10vh-1.25rem),3.6vw),3.75rem)]"
            >
              Never lose a patient enquiry on{" "}
              <span className="bg-clip-text text-transparent theme-gradient-text">WhatsApp or the phone</span> again
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl short:mt-3">
              AI receptionist for clinics in the Gulf and Egypt: replies on WhatsApp, voice notes included, and answers
              calls 24/7 in English and Arabic.
            </p>

            {/* In-page first (cold LinkedIn traffic): see it work, see the price, then WhatsApp. */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap short:mt-4">
              <ScrollLink targetId="watch-call" event="clinics_hero_demo_click" className={primaryCta}>
                Watch it handle a call
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </ScrollLink>
              <ScrollLink targetId="pricing" event="clinics_hero_pricing_click" className={secondaryCta}>
                See pricing
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </ScrollLink>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Prefer to chat?{" "}
              <TrackedLink
                href={WHATSAPP_CONTACT_URL}
                event="clinics_contact_click"
                params={{ location: "hero" }}
                className={`${textLink} min-h-[48px]`}
              >
                Message us on WhatsApp
              </TrackedLink>
            </p>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-foreground/80 short:mt-2" aria-label="Pilot terms">
              {[...PILOT.split(" · "), SETUP_WAIVED_NOTE].map((chip) => (
                <li key={chip} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          <ExampleChat />
        </div>
      </div>
    </section>
  )
}

/** Illustrative WhatsApp exchange (clearly labelled as an example, not a real patient). */
function ExampleChat() {
  const bubble = "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm"
  return (
    <figure className="relative mx-auto w-full max-w-md lg:max-w-none" aria-label="Example WhatsApp conversation with the AI receptionist">
      <div className="absolute -inset-4 rounded-[2rem] theme-glow opacity-60 blur-2xl" aria-hidden="true" />
      <div className="relative rounded-2xl border border-border bg-card p-4 shadow-2xl sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-card-foreground">Your clinic · WhatsApp</p>
              <p className="text-xs text-muted-foreground">Replies instantly, 24/7</p>
            </div>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Example</span>
        </div>

        <div className="space-y-3">
          <p className={`${bubble} bg-muted text-foreground`} lang="ar" dir="rtl">
            مرحبا، كم سعر جلسة الليزر؟
          </p>
          <p className={`${bubble} ml-auto bg-primary/10 text-foreground`} lang="ar" dir="rtl">
            أهلاً وسهلاً! يعتمد السعر على المنطقة المراد علاجها. هل تفضّل موعد استشارة هذا الأسبوع؟
          </p>
          <p className={`${bubble} flex items-center gap-2 bg-muted text-foreground`}>
            <Mic className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              Voice note · 0:09 <span className="text-muted-foreground">(&ldquo;Thursday evening works&rdquo;)</span>
            </span>
          </p>
          <p className={`${bubble} ml-auto bg-primary/10 text-foreground`}>
            Thank you! I&apos;ve sent your request for Thursday evening to our team. They&apos;ll confirm the time with
            you here.
          </p>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Example conversation. Replies come from your clinic&apos;s own information.
      </figcaption>
    </figure>
  )
}
