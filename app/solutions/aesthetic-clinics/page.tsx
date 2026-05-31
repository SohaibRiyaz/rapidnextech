import type { Metadata } from "next"
import { AestheticHero } from "@/components/solutions/aesthetic-clinics/hero-section"
import { ProblemSection } from "@/components/solutions/aesthetic-clinics/problem-section"
import { SolutionSection } from "@/components/solutions/aesthetic-clinics/solution-section"
import { HowItWorksSection } from "@/components/solutions/aesthetic-clinics/how-it-works-section"
import { FeatureDeepDiveSection } from "@/components/solutions/aesthetic-clinics/feature-deep-dive-section"
import { WhoItsForSection } from "@/components/solutions/aesthetic-clinics/who-its-for-section"
import { ROISection } from "@/components/solutions/aesthetic-clinics/roi-section"
import { PricingSection } from "@/components/solutions/aesthetic-clinics/pricing-section"
import { CTASection } from "@/components/solutions/aesthetic-clinics/cta-section"
import { aestheticClinicFaqs, FAQSection } from "@/components/solutions/aesthetic-clinics/faq-section"
import { OptionalOffersSection } from "@/components/solutions/aesthetic-clinics/optional-offers-section"
import Link from "next/link"
import { breadcrumbSchema, faqSchema, jsonLd, serviceSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "AI Receptionist & WhatsApp Automation for Aesthetic Clinics in Dubai & GCC",
  description:
    "Stop losing clinic inquiries. RapidNexTech builds AI receptionist and WhatsApp automation systems for aesthetic clinics in Dubai, Doha, Riyadh, and the GCC.",
  alternates: { canonical: "https://rapidnextech.com/solutions/aesthetic-clinics" },
  openGraph: {
    title: "AI Receptionist & WhatsApp Automation for Aesthetic Clinics in Dubai & GCC | RapidNexTech",
    description:
      "Turn Instagram DMs, WhatsApp messages, and website inquiries into booked appointments automatically for GCC aesthetic clinics.",
    type: "website",
    url: "https://rapidnextech.com/solutions/aesthetic-clinics",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech — AI Patient Inquiry Conversion for Aesthetic Clinics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Receptionist & WhatsApp Automation for Aesthetic Clinics in Dubai & GCC | RapidNexTech",
    description:
      "Turn Instagram DMs, WhatsApp messages, and website inquiries into booked appointments automatically for GCC aesthetic clinics.",
    images: ["/og-image.png"],
  },
}

const pagePath = "/solutions/aesthetic-clinics"
const pageTitle = "AI Receptionist & WhatsApp Automation for Aesthetic Clinics in Dubai & GCC"

function RelatedClinicContent() {
  const links = [
    {
      href: "/blog/revamp-aesthetic-clinic-whatsapp-management",
      label: "Revamp aesthetic clinic WhatsApp management",
    },
    {
      href: "/blog/stop-patient-inquiry-drop-off-clinic-fix-revenue-leaks",
      label: "Stop patient inquiry drop-off and revenue leaks",
    },
    {
      href: "/blog/streamline-clinic-bookings-with-whatsapp",
      label: "Streamline clinic bookings with WhatsApp",
    },
  ]

  return (
    <section className="py-16 theme-transition">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-3xl border border-border/70 bg-card/60 p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary mb-3">
            Clinic automation resources
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Learn how clinics convert more leads before adding automation.
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-border/60 p-4 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface AestheticClinicsPageProps {
  searchParams?: {
    [key: string]: string | string[] | undefined
  }
}

const isTruthyQueryValue = (value: string | string[] | undefined) => {
  if (value === undefined) {
    return false
  }

  const firstValue = Array.isArray(value) ? value[0] : value

  if (firstValue === "") {
    return true
  }

  const normalized = firstValue.toLowerCase()
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on"
}

export default function AestheticClinicsPage({ searchParams }: AestheticClinicsPageProps) {
  const shouldAutoOpenDemoPopup =
    isTruthyQueryValue(searchParams?.["open-popup-automatically"]) ||
    isTruthyQueryValue(searchParams?.openPopup) ||
    isTruthyQueryValue(searchParams?.demo)

  return (
    <main className="bg-background text-foreground theme-transition">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Solutions", path: "/services#solutions" },
            { name: "Aesthetic Clinics", path: pagePath },
          ]),
          serviceSchema({
            name: pageTitle,
            description: metadata.description as string,
            path: pagePath,
            areaServed: ["Dubai", "Doha", "Riyadh", "GCC"],
            serviceType: "AI receptionist and WhatsApp automation",
          }),
          faqSchema(aestheticClinicFaqs),
        ])}
      />
      <AestheticHero autoOpenDemoPopup={shouldAutoOpenDemoPopup} />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <FeatureDeepDiveSection />
      <WhoItsForSection />
      <ROISection />
      <PricingSection />
      <OptionalOffersSection />
      <CTASection />
      <RelatedClinicContent />
      <FAQSection />
    </main>
  )
}
