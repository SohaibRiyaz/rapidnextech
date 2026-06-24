import type { Metadata } from "next"
import { AestheticHero } from "@/components/solutions/aesthetic-clinics/hero-section"
import { ProblemSection } from "@/components/solutions/aesthetic-clinics/problem-section"
import { SolutionSection } from "@/components/solutions/aesthetic-clinics/solution-section"
import { HowItWorksSection } from "@/components/solutions/aesthetic-clinics/how-it-works-section"
import { WhoItsForSection } from "@/components/solutions/aesthetic-clinics/who-its-for-section"
import { ROISection } from "@/components/solutions/aesthetic-clinics/roi-section"
import { PricingSection } from "@/components/solutions/aesthetic-clinics/pricing-section"
import { FounderSection } from "@/components/solutions/aesthetic-clinics/founder-section"
import { CTASection } from "@/components/solutions/aesthetic-clinics/cta-section"
import { FAQSection } from "@/components/solutions/aesthetic-clinics/faq-section"
import { StickyDemoCTA } from "@/components/solutions/aesthetic-clinics/sticky-demo-cta"
import { breadcrumbSchema, jsonLd } from "@/lib/seo"
import { aestheticClinicFaqs } from "@/components/solutions/aesthetic-clinics/faq-data"

export const metadata: Metadata = {
  title: "WhatsApp Booking Assistant for Lahore Clinics | RapidNexTech",
  description:
    "WhatsApp booking assistant for aesthetic & skin clinics in Lahore. Replies instantly, books consultations 24/7. Try the live demo on WhatsApp in 30 seconds.",
  alternates: { canonical: "https://rapidnextech.com/solutions/aesthetic-clinics" },
  openGraph: {
    title: "WhatsApp Booking Assistant for Lahore Aesthetic Clinics | RapidNexTech",
    description:
      "Stop losing clinic inquiries after hours. RapidNexTech builds WhatsApp booking assistants for aesthetic, skin and laser clinics in Lahore — replies in English & Roman Urdu, 24/7.",
    type: "website",
    url: "https://rapidnextech.com/solutions/aesthetic-clinics",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WhatsApp booking assistant for Lahore aesthetic clinic — RapidNexTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatsApp Booking Assistant for Lahore Aesthetic Clinics | RapidNexTech",
    description:
      "Stop losing clinic inquiries after hours. WhatsApp booking assistant for Lahore aesthetic, skin and laser clinics.",
    images: ["/og-image.png"],
  },
  keywords: [
    "whatsapp booking assistant lahore",
    "whatsapp automation for clinics lahore",
    "aesthetic clinic whatsapp booking pakistan",
    "whatsapp appointment booking system for clinics",
    "automated whatsapp receptionist pakistan",
    "clinic instagram lead automation lahore",
    "skin clinic booking automation lahore",
  ],
}

const pagePath = "/solutions/aesthetic-clinics"

function lahoreServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "WhatsApp Booking Assistant for Aesthetic Clinics",
    provider: {
      "@type": "LocalBusiness",
      name: "RapidNexTech",
      url: "https://rapidnextech.com",
      areaServed: { "@type": "City", name: "Lahore" },
    },
    serviceType: "WhatsApp automation and appointment booking for clinics",
    areaServed: "Lahore, Pakistan",
    description:
      "WhatsApp booking assistant for aesthetic, skin and laser clinics in Lahore. Replies instantly in English and Roman Urdu, qualifies patients, and books consultations 24/7.",
    url: `https://rapidnextech.com${pagePath}`,
  }
}

function faqSchemaLahore(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

interface AestheticClinicsPageProps {
  searchParams?: {
    [key: string]: string | string[] | undefined
  }
}

const isTruthyQueryValue = (value: string | string[] | undefined) => {
  if (value === undefined) return false
  const firstValue = Array.isArray(value) ? value[0] : value
  if (firstValue === "") return true
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
            { name: "WhatsApp Booking Assistant — Lahore Clinics", path: pagePath },
          ]),
          lahoreServiceSchema(),
          faqSchemaLahore(aestheticClinicFaqs),
        ])}
      />
      <AestheticHero autoOpenDemoPopup={shouldAutoOpenDemoPopup} />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <WhoItsForSection />
      <ROISection />
      <PricingSection />
      <FounderSection />
      <CTASection />
      <FAQSection />
      <StickyDemoCTA />
    </main>
  )
}
