import { PhoneCall } from "lucide-react"
import { DemoLauncher } from "@/components/dental/demo-launcher"
import { SectionHeading } from "@/components/dental/section-heading"
import { card, sectionAnchor, sectionY } from "@/components/dental/styles"
import {
  HVAC_DEMO_PHONE,
  HVAC_DEMO_PLACEHOLDER,
  HVAC_DEMO_PLACEHOLDER_MESSAGE,
  HVAC_RETELL_AGENT_ID,
  HVAC_RETELL_AGENT_VERSION,
} from "@/lib/hvac-config"
import { siteConfig, telHref } from "@/lib/site-config"
import { HvacShowcase } from "./hvac-showcase"

const MIC_NOTE = "Your browser will ask for microphone permission. Use headphones for best results."
const TRANSFER_NOTE = "Live transfer works on the phone line only."

/**
 * HVAC homepage demo:
 *   "Watch a real call": CallShowcase with ./hvac-showcase-scenarios (always visible)
 *   "Talk to it yourself": the shared Retell browser demo. While HVAC_RETELL_AGENT_ID is null it runs in
 *   placeholder mode (no Retell call, no mic). The phone card shows only when HVAC_DEMO_PHONE is set.
 */
export function HvacDemoSection() {
  return (
    <section id="live-demo" aria-labelledby="demo-title" className={`${sectionY} ${sectionAnchor} bg-muted/40`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          id="demo-title"
          eyebrow="Live demo"
          title="Hear how it handles an HVAC call"
          intro="Watch example calls from start to finish: an emergency, a tune-up request and a gas smell."
        />

        <h3 id="watch-call" className="mb-6 scroll-mt-24 text-center text-2xl font-bold tracking-tight text-foreground focus:outline-none">
          Watch a real call
        </h3>
        <HvacShowcase />

        <div id="voice-demo" className="mx-auto mt-16 max-w-3xl scroll-mt-24 focus:outline-none">
          <h3 className="mb-6 text-center text-2xl font-bold tracking-tight text-foreground">Talk to it yourself</h3>
          <DemoLauncher
            location="hvac-demo"
            analyticsParams={{ vertical: "hvac" }}
            agentId={HVAC_RETELL_AGENT_ID}
            agentVersion={HVAC_RETELL_AGENT_VERSION}
            agentName="our AI receptionist"
            intro="Play the role of a homeowner with no AC, or one asking about a tune-up. No signup."
            notes={HVAC_DEMO_PLACEHOLDER ? [] : [TRANSFER_NOTE, MIC_NOTE]}
            ended={{
              text: `That's how your customers would be greeted, day or night. Try it on your own calls for ${siteConfig.pilot.days} days, free.`,
              ctaLabel: `Start the ${siteConfig.pilot.days}-day pilot`,
              ctaHref: "#pilot",
            }}
            placeholder={
              HVAC_DEMO_PLACEHOLDER
                ? { message: HVAC_DEMO_PLACEHOLDER_MESSAGE, ctaLabel: "Start your free pilot", ctaHref: "#pilot", external: false }
                : null
            }
          />

          {HVAC_DEMO_PHONE ? (
            <div className={`${card} mt-6 p-5`}>
              <div className="mb-3 flex items-center gap-3">
                <PhoneCall className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="font-semibold text-card-foreground">Prefer the phone?</h3>
              </div>
              <p className="mb-3 text-sm text-muted-foreground">Call the demo line from any phone. {TRANSFER_NOTE}</p>
              <a
                href={telHref(HVAC_DEMO_PHONE)}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border-2 border-primary/70 px-4 text-lg font-semibold text-foreground transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {HVAC_DEMO_PHONE.display}
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
