import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Code2, Mail, Phone, PhoneCall } from "lucide-react"
import { PhoneLink } from "@/components/dental/phone-link"
import { PilotForm } from "@/components/dental/pilot-form"
import { SecurityNote } from "@/components/dental/security-note"
import { card, textLink } from "@/components/dental/styles"
import { siteConfig } from "@/lib/site-config"
import { breadcrumbSchema, jsonLd, salesEmail, salesPhoneE164, ukAddress } from "@/lib/seo"

// The previous aesthetic-clinic contact UI (./ContactClient.tsx) and /api/contact are kept in
// the codebase but no longer rendered here.

const DESCRIPTION =
  "Start a 14-day free pilot of RapidNexTech's AI receptionist for your dental practice, or call +1 (813) 214-2552. No credit card, no contract, keep your number."

export const metadata: Metadata = {
  title: { absolute: "Contact RapidNexTech | Free Dental AI Receptionist Pilot" },
  description: DESCRIPTION,
  alternates: { canonical: "https://rapidnextech.com/contact" },
  openGraph: {
    title: "Contact RapidNexTech | Free Dental AI Receptionist Pilot",
    description: DESCRIPTION,
    url: "https://rapidnextech.com/contact",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact RapidNexTech, AI receptionist for dental practices" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact RapidNexTech | Free Dental AI Receptionist Pilot",
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
}

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact RapidNexTech",
    url: "https://rapidnextech.com/contact",
    description: DESCRIPTION,
    mainEntity: {
      "@type": "Organization",
      name: "RapidNexTech",
      email: salesEmail,
      telephone: salesPhoneE164,
      address: { "@type": "PostalAddress", ...ukAddress },
    },
    breadcrumb: breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
  }

  return (
    <div className="bg-transparent">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(contactSchema)} />

      <section aria-labelledby="contact-title" className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Contact</p>
            <h1 id="contact-title" className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Start your free pilot, or just talk to us
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Tell us about your dental practice and we&apos;ll email you {siteConfig.copy.pilotResponseTime} to book a
              30-min onboarding call. {siteConfig.pilot.chips.join(" · ")}.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <PilotForm location="contact" />

            <div className="space-y-6">
              <div className={`${card} p-6`}>
                <h2 className="mb-4 text-lg font-semibold text-card-foreground">Talk to a person</h2>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <PhoneLink
                      kind="public"
                      location="contact"
                      className="inline-flex min-h-[44px] items-center font-semibold text-foreground hover:text-primary"
                    />
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="inline-flex min-h-[44px] items-center font-semibold text-foreground hover:text-primary"
                    >
                      {siteConfig.email}
                    </a>
                  </li>
                </ul>
              </div>

              {siteConfig.demoPhone ? (
                <div className={`${card} p-6`}>
                  <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-card-foreground">
                    <PhoneCall className="h-5 w-5 text-primary" aria-hidden="true" />
                    Hear the AI receptionist
                  </h2>
                  <p className="mb-2 text-sm text-muted-foreground">Call the demo line and play the role of a patient:</p>
                  <PhoneLink
                    kind="demo"
                    location="contact"
                    className="inline-flex min-h-[44px] items-center text-lg font-semibold text-foreground underline underline-offset-4 decoration-primary/60"
                  />
                  <p className="mt-2 text-sm">
                    <Link href="/#live-demo" className={textLink}>
                      Or talk to it in your browser <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </p>
                </div>
              ) : null}

              <SecurityNote />

              <div className="rounded-xl border border-dashed border-border p-5">
                <h2 className="flex items-center gap-2 font-semibold text-foreground">
                  <Code2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  Need custom software instead?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We also build custom software, SaaS platforms and automation.
                </p>
                <Link href="/software" className={`${textLink} text-sm`}>
                  See our software services <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
