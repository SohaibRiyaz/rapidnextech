import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { PhoneLink } from "./phone-link"
import { primaryCta, secondaryCta, sectionY } from "./styles"

export function DentalFinalCta({ pilotHref = "#pilot" }: { pilotHref?: string }) {
  return (
    <section aria-labelledby="final-cta-title" className={sectionY}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary/25 bg-card p-8 text-center shadow-xl md:p-14">
          <div className="pointer-events-none absolute inset-0 theme-glow opacity-40 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <h2 id="final-cta-title" className="text-3xl font-bold tracking-tight text-card-foreground md:text-5xl">
              Stop sending after-hours patients to voicemail.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Hear it answer a call, then try it on your own phone line for {siteConfig.pilot.days} days.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="#live-demo" className={primaryCta}>
                Talk to our AI receptionist <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={pilotHref} className={secondaryCta}>
                Start your {siteConfig.pilot.days}-day free pilot
              </a>
            </div>
            {siteConfig.demoPhone ? (
              <p className="mt-3 text-sm text-muted-foreground">
                or call the demo line{" "}
                <PhoneLink
                  kind="demo"
                  location="final-cta"
                  className="inline-flex min-h-[44px] items-center font-semibold text-foreground underline underline-offset-4"
                />
              </p>
            ) : null}
            <p className="mt-6 text-sm font-medium text-foreground/80">
              Free for {siteConfig.pilot.days} days · No credit card · Keep your number · Cancel anytime by turning off
              forwarding
            </p>
          </div>
        </div>

        <p className="mt-10 text-center">
          <Link
            href="/software"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Need custom software instead? <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  )
}
