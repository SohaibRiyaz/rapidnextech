import Link from "next/link"
import { ArrowRight, Check, Mail, PhoneIncoming } from "lucide-react"
import { MeshGradient } from "@/components/mesh-gradient"
import { siteConfig } from "@/lib/site-config"
import { PhoneLink } from "./phone-link"
import { primaryCta, secondaryCta, textLink } from "./styles"

export function DentalHero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <MeshGradient />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.06]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="motion-safe:animate-fade-in-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <PhoneIncoming className="h-4 w-4" aria-hidden="true" />
              AI receptionist for US dental practices
            </p>

            <h1
              id="hero-title"
              className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl xl:text-6xl"
            >
              Your dental practice never loses another after-hours or weekend call to{" "}
              <span className="bg-clip-text text-transparent theme-gradient-text">voicemail or a competitor</span>.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              AI receptionist for dental practices that answers 24/7, captures new patients, handles emergencies, and
              sends every request to your front desk.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#try-it" className={primaryCta}>
                Talk to our AI receptionist
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#pilot" className={secondaryCta}>
                Start your {siteConfig.pilot.days}-day free pilot
              </a>
            </div>

            {siteConfig.demoPhone ? (
              <p className="mt-3 text-sm text-muted-foreground">
                or call the demo line{" "}
                <PhoneLink
                  kind="demo"
                  location="hero"
                  className="inline-flex min-h-[44px] items-center font-semibold text-foreground underline underline-offset-4 decoration-primary/60 hover:decoration-primary"
                />
              </p>
            ) : null}

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-foreground/80" aria-label="Pilot terms">
              {siteConfig.pilot.chips.map((chip) => (
                <li key={chip} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                  {chip}
                </li>
              ))}
            </ul>

            <Link href="/solutions/dental-clinics" className={`${textLink} mt-4 text-sm`}>
              How it works for dental practices <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <ExampleSummary />
        </div>
      </div>
    </section>
  )
}

/** Illustrative example of the front-desk email summary (clearly labeled, not real patient data). */
function ExampleSummary() {
  const rows: [string, string][] = [
    ["Caller", "New patient"],
    ["Reason for visit", "Toothache, lower left"],
    ["Pain level", "7 / 10"],
    ["Insurance", "PPO (on your accepted list)"],
    ["Preferred times", "Weekday mornings"],
  ]
  return (
    <figure className="relative mx-auto w-full max-w-md lg:max-w-none" aria-label="Example front-desk call summary">
      <div className="absolute -inset-4 rounded-[2rem] theme-glow blur-2xl opacity-60" aria-hidden="true" />
      <div className="relative rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-card-foreground">New call summary</p>
              <p className="text-xs text-muted-foreground">Saturday, 7:42 PM · after hours</p>
            </div>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Example</span>
        </div>
        <dl className="space-y-2.5 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-right font-medium text-card-foreground">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 rounded-xl bg-muted px-3 py-2.5 text-sm text-foreground">
          <span className="font-semibold">Next step:</span> caller was told the front desk will call to confirm a time.
        </p>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        Example summary. Your front desk gets one by email after every call.
      </figcaption>
    </figure>
  )
}
