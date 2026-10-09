import { PhoneCall } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { DemoLauncher } from "./demo-launcher"
import { PhoneLink } from "./phone-link"
import { SampleCallPlayer } from "./sample-call-player"
import { SectionHeading } from "./section-heading"
import { anchorOffset, card, sectionY } from "./styles"

export function DentalTryItNow() {
  return (
    <section id="try-it" aria-labelledby="try-title" className={`${sectionY} ${anchorOffset} bg-muted/40`}>
      {/* "Talk to our AI receptionist" CTAs land here: heading just below the header, skipping the section's top padding. */}
      <div id="live-demo" className={`container mx-auto px-4 sm:px-6 ${anchorOffset}`}>
        <SectionHeading
          id="try-title"
          eyebrow="Try it now"
          title="Talk to our AI receptionist"
          intro="Call it like a patient would. Ask about new-patient appointments, a dental emergency, or whether you take your insurance."
        />

        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <DemoLauncher location="try-it" />
          </div>

          <div className="flex flex-col gap-6">
            {siteConfig.demoPhone ? (
              <div className={`${card} p-5`}>
                <div className="mb-3 flex items-center gap-3">
                  <PhoneCall className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="font-semibold text-card-foreground">Prefer the phone?</h3>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">Call the demo line from any phone:</p>
                <PhoneLink
                  kind="demo"
                  location="try-it"
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border-2 border-primary/70 px-4 text-lg font-semibold text-foreground transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            ) : null}
            <SampleCallPlayer />
            {siteConfig.supportsSpanish ? (
              <p className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
                {siteConfig.copy.spanish}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
