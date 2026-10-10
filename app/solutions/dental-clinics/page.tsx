import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CalendarPlus, PhoneForwarded, ShieldCheck, Siren } from "lucide-react"
import { DentalCallHandling } from "@/components/dental/call-handling"
import { getDentalFaqs } from "@/components/dental/faq-data"
import { DentalFaq } from "@/components/dental/faq"
import { DentalFinalCta } from "@/components/dental/final-cta"
import { DentalHowItWorks } from "@/components/dental/how-it-works"
import { SecurityNote } from "@/components/dental/security-note"
import { DentalPricing } from "@/components/dental/pricing"
import { PhoneLink } from "@/components/dental/phone-link"
import { DentalTryItNow } from "@/components/dental/try-it-now"
import { card, primaryCta, secondaryCta, sectionY, textLink } from "@/components/dental/styles"
import { siteConfig } from "@/lib/site-config"
import { breadcrumbSchema, dentalReceptionistServiceSchema, faqSchema, jsonLd } from "@/lib/seo"

const pagePath = "/solutions/dental-clinics"
const DESCRIPTION =
  "How RapidNexTech's AI receptionist works for dental practices: call forwarding from your existing number, dental emergency rules, insurance questions, appointment requests sent to your front desk, pricing and the 14-day free pilot."

export const metadata: Metadata = {
  title: "How the AI Receptionist Works for Dental Practices",
  description: DESCRIPTION,
  alternates: { canonical: "https://rapidnextech.com/solutions/dental-clinics" },
  openGraph: {
    title: "How the AI Receptionist Works for Dental Practices | RapidNexTech",
    description: DESCRIPTION,
    url: "https://rapidnextech.com/solutions/dental-clinics",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI receptionist for dental practices: how it works" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How the AI Receptionist Works for Dental Practices | RapidNexTech",
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
}

const captured = [
  "Name and phone number",
  "New or existing patient",
  "Reason for visit",
  "Urgency or pain level",
  "Insurance",
  "Preferred days and times",
]

function DetailBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof PhoneForwarded
  title: string
  children: React.ReactNode
}) {
  return (
    <div className={`${card} p-6 md:p-8`}>
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mb-3 text-xl font-semibold text-card-foreground">{title}</h3>
      <div className="space-y-3 leading-relaxed text-muted-foreground">{children}</div>
    </div>
  )
}

export default function DentalClinicsPage() {
  const { copy } = siteConfig
  return (
    <div className="bg-transparent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "How it works for dental practices", path: pagePath },
          ]),
          dentalReceptionistServiceSchema(pagePath),
          faqSchema(getDentalFaqs()),
        ])}
      />

      <section aria-labelledby="dental-title" className="pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <Link href="/" className={`${textLink} mb-6 text-sm`}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> AI receptionist for dentists
          </Link>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">For US dental practices</p>
          <h1 id="dental-title" className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            How our AI receptionist works for your dental practice
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
            Your practice gets its own dedicated AI line. You forward calls to it after hours, on weekends, when
            nobody picks up, or all three. It answers new patients, dental emergencies, insurance questions and
            appointment requests, and sends every request to your front desk.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#live-demo" className={primaryCta}>
              Talk to our AI receptionist <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link href="/#pilot" className={secondaryCta}>
              Start your {siteConfig.pilot.days}-day free pilot
            </Link>
          </div>
          {siteConfig.demoPhone ? (
            <p className="mt-3 text-sm text-muted-foreground">
              or call the demo line{" "}
              <PhoneLink
                kind="demo"
                location="dental-clinics-hero"
                className="inline-flex min-h-[44px] items-center font-semibold text-foreground underline underline-offset-4"
              />
            </p>
          ) : null}
        </div>
      </section>

      <DentalHowItWorks />

      <section aria-labelledby="details-title" className={sectionY}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">The details</p>
            <h2 id="details-title" className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              What your front desk should know
            </h2>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <DetailBlock icon={PhoneForwarded} title="Call forwarding and your phone system">
              <p>
                Forward calls from your existing number to your AI line on a schedule (after hours and weekends), when
                nobody answers after a few rings, or both.
              </p>
              <p>
                Works with {copy.phoneSystems.join(", ")} and standard landlines. We set it up together on a short
                screen-share and test it live. {copy.goLive}
              </p>
              <p>Patients keep dialing the same number and caller ID passes through. To stop, turn off forwarding.</p>
            </DetailBlock>

            <DetailBlock icon={Siren} title="Dental emergencies">
              <p>{copy.emergencies}</p>
              <p>
                You decide what counts as an emergency (for example toothache, broken tooth, swelling or trauma) and
                where it goes, during your onboarding call.
              </p>
            </DetailBlock>

            <DetailBlock icon={CalendarPlus} title="Appointment requests and your practice software">
              <p>The AI captures appointment requests 24/7:</p>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {captured.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                It sends a summary to your front desk, your team confirms with the patient, and the AI tells callers
                when to expect a confirmation call. It works alongside {copy.practiceSoftware.join(", ")} and any
                other practice software. Direct scheduling integration is coming soon.
              </p>
            </DetailBlock>

            <DetailBlock icon={ShieldCheck} title="Insurance questions">
              <p>
                Answered from your practice&apos;s own accepted-insurance list, which you give us at setup. Anything
                else is captured for your front desk to follow up.
              </p>
              {siteConfig.supportsSpanish ? <p>{copy.spanish}</p> : null}
            </DetailBlock>
          </div>

          <SecurityNote className="mx-auto mt-6 max-w-6xl" />
        </div>
      </section>

      <DentalCallHandling />
      <DentalTryItNow />
      <DentalPricing crossPage />
      <DentalFaq showDeepLink={false} />
      <DentalFinalCta pilotHref="/#pilot" />
    </div>
  )
}
