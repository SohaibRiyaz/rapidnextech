import { ArrowRight } from "lucide-react"
import { DemoLauncher } from "@/components/dental/demo-launcher"
import { SectionHeading } from "@/components/dental/section-heading"
import { sectionAnchor, sectionY, textLink } from "@/components/dental/styles"
import {
  CLINIC_AGENT_NAME,
  CLINIC_DEMO_INTRO,
  CLINIC_DEMO_NOTES,
  CLINIC_DEMO_PLACEHOLDER,
  CLINIC_DEMO_PLACEHOLDER_MESSAGE,
  CLINIC_RETELL_AGENT_ID,
  CLINIC_RETELL_AGENT_VERSION,
  WHATSAPP_CONTACT_URL,
  WHATSAPP_DEMO_URL,
} from "@/lib/clinics-config"
import { ClinicsShowcase } from "./showcase"
import { TrackedLink } from "./tracked-link"

/**
 * Live demo section of /clinics:
 *   A) "Watch a real call": example calls (components/demo/call-showcase, scenarios in ./showcase-scenarios)
 *   B) "Talk to it yourself": the shared Retell browser demo (components/dental/demo-launcher)
 * The phone demo is not shown (PHONE_DEMO_NUMBER is null).
 */
export function ClinicsDemoSection() {
  return (
    <section id="demo" aria-labelledby="demo-title" className={`${sectionY} ${sectionAnchor}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          id="demo-title"
          eyebrow="Live demo"
          title="See how it handles a patient call"
          intro="Watch an example call from start to finish, then talk to it yourself."
        />

        {/* A) Watch a real call */}
        {/* Landing spot for the hero's "Watch it handle a call" (just under the fixed header). */}
        <h3 id="watch-call" className="mb-6 scroll-mt-24 text-center text-2xl font-bold tracking-tight text-foreground focus:outline-none">
          Watch a real call
        </h3>
        <ClinicsShowcase />

        {/* B) Talk to it yourself */}
        {/* Landing spot for "Try the AI calling demo" on the Two products card. */}
        <div id="voice-demo" className="mx-auto mt-16 max-w-3xl scroll-mt-24 focus:outline-none">
          <h3 className="mb-6 text-center text-2xl font-bold tracking-tight text-foreground">Talk to it yourself</h3>
          <DemoLauncher
            location="clinics-demo"
            clickEvent="clinics_voice_demo_click"
            // TEMP-DENTAL-AGENT: these all come from lib/clinics-config.ts and currently point at the
            // dental agent. Switch the values there; nothing here needs to change.
            agentId={CLINIC_RETELL_AGENT_ID}
            agentVersion={CLINIC_RETELL_AGENT_VERSION}
            agentName={CLINIC_AGENT_NAME}
            intro={CLINIC_DEMO_INTRO}
            notes={CLINIC_DEMO_NOTES}
            ended={{
              text: "That's how your patients would be greeted, day or night. We set your clinic's version up with your own treatments and prices.",
              ctaLabel: "Talk to us on WhatsApp",
              ctaHref: WHATSAPP_CONTACT_URL,
              external: true,
            }}
            placeholder={
              CLINIC_DEMO_PLACEHOLDER
                ? { message: CLINIC_DEMO_PLACEHOLDER_MESSAGE, ctaLabel: "Try the WhatsApp demo", ctaHref: WHATSAPP_DEMO_URL }
                : null
            }
          />
          <p className="mt-6 text-center">
            <TrackedLink
              href={WHATSAPP_DEMO_URL}
              event="clinics_whatsapp_demo_click"
              params={{ location: "demo" }}
              className={textLink}
            >
              Prefer WhatsApp? Try the WhatsApp demo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </TrackedLink>
          </p>
        </div>
      </div>
    </section>
  )
}
