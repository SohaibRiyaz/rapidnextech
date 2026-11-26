import type { Metadata } from "next"
import { ArrowRight, Mail } from "lucide-react"
import { WindowsShowcase } from "@/components/demo-pages/windows-showcase"
import { DemoLauncher } from "@/components/dental/demo-launcher"
import { SectionHeading } from "@/components/dental/section-heading"
import { card, primaryCta, sectionY } from "@/components/dental/styles"
import { siteConfig } from "@/lib/site-config"
import {
  WINDOWS_AGENT_NAME,
  WINDOWS_COMPANY,
  WINDOWS_REGION,
  WINDOWS_RETELL_AGENT_ID,
  WINDOWS_RETELL_AGENT_VERSION,
} from "@/lib/windows-config"

/**
 * Private demo page shared with partners: not in the header, footer or sitemap, and noindex.
 * Fictional company: Clearview Windows & Doors (Central Florida). Receptionist: Emma (Retell windows agent).
 */

const TITLE = "AI Receptionist Demo for Window & Door Companies | RapidNexTech"
const DESCRIPTION = "Hear how an AI receptionist answers a window installation company's calls, and see the summary the owner receives."
const PILOT_HREF = "/contact?vertical=windows"

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech AI receptionist demo for window & door companies" }],
  },
}

const SAMPLE_ROWS: [string, string][] = [
  ["Urgency", "ROUTINE"],
  ["Customer name", "Mark Davis"],
  ["Callback number", "(407) 555-0123"],
  ["Address", "1XX Lake Dr"],
  ["ZIP", "32806"],
  ["In service area", "Yes"],
  ["Project type", "Window replacement"],
  ["Number of windows", "8"],
  ["Window type", "Impact"],
  ["Timeline", "1–2 months"],
  ["Preferred visit window", "Weekday afternoons"],
]

export default function WindowInstallerDemoPage() {
  return (
    <div className="bg-background">
      <section aria-labelledby="windows-demo-title" className="bg-muted/40 pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Live demo · window &amp; door companies</p>
            <h1 id="windows-demo-title" className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Hear how an AI receptionist answers a window installation company&apos;s calls.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Meet {WINDOWS_AGENT_NAME}, the AI receptionist for {WINDOWS_COMPANY}, a fictional window and door company in{" "}
              {WINDOWS_REGION}. Talk to her in your browser, then watch example calls below.
            </p>
          </div>

          <div id="voice-demo" className="mx-auto max-w-3xl scroll-mt-24 focus:outline-none">
            <DemoLauncher
              location="windows-demo"
              analyticsParams={{ vertical: "windows" }}
              agentId={WINDOWS_RETELL_AGENT_ID}
              agentVersion={WINDOWS_RETELL_AGENT_VERSION}
              agentName={WINDOWS_AGENT_NAME}
              intro="Play the role of a homeowner who wants new windows, or one with a broken window. No signup."
              notes={["Your browser will ask for microphone permission. Use headphones for best results."]}
              ended={{
                text: "That's how your customers would be greeted, day or night. Want it answering your company's calls?",
                ctaLabel: "Start a free pilot",
                ctaHref: PILOT_HREF,
              }}
              emailSummary
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="windows-examples-title" className={sectionY}>
        <div className="container mx-auto px-4 sm:px-6">
          <SectionHeading
            id="windows-examples-title"
            eyebrow="Example calls"
            title="Watch three calls from start to finish"
            intro="A quote for 8 windows, a broken window at night, and a caller who just asks “how much?”"
          />
          <WindowsShowcase />
        </div>
      </section>

      <section aria-labelledby="windows-summary-title" className={`${sectionY} bg-muted/40`}>
        <div className="container mx-auto px-4 sm:px-6">
          <SectionHeading
            id="windows-summary-title"
            eyebrow="After every call"
            title="What the owner receives"
            intro="Right after the call, the owner gets the job details by email. Sample from the first example call:"
          />
          <div className={`${card} mx-auto max-w-2xl overflow-hidden`}>
            <div className="space-y-1 border-b border-border bg-muted/50 px-5 py-4 text-sm">
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                [Windows call] ROUTINE – Mark Davis – Window replacement
              </p>
              <p className="text-muted-foreground">To: Owner · From: AI Receptionist</p>
            </div>
            <div className="px-5 py-5">
              <p className="leading-relaxed text-foreground">
                Mark wants a quote to replace 8 old single-pane windows with impact windows within 1–2 months. ZIP 32806 is in
                your service area. He prefers a measurement visit on a weekday afternoon. Please call him to confirm a time.
              </p>
              <dl className="mt-5 grid grid-cols-1 gap-x-6 text-sm sm:grid-cols-2">
                {SAMPLE_ROWS.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-border/60 py-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-muted-foreground">Fictional example.</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="windows-cta-title" className={sectionY}>
        <div className="container mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 id="windows-cta-title" className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Want this answering your company&apos;s calls?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Start a {siteConfig.pilot.days}-day free pilot. No credit card, no contract, and you keep your number.
          </p>
          <a href={PILOT_HREF} className={`${primaryCta} mt-8`}>
            Start a free pilot
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  )
}
