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
import { FAQSection } from "@/components/solutions/aesthetic-clinics/faq-section"
import { OptionalOffersSection } from "@/components/solutions/aesthetic-clinics/optional-offers-section"

export const metadata: Metadata = {
  title: "AI Patient Inquiry Conversion & Retention System for Aesthetic Clinics",
  description:
    "Turn Instagram DMs, WhatsApp messages, and website inquiries into booked appointments automatically. Reduce no-shows and automate rebooking. Works with Treatwell, Zenoti, Pabau, and Fresha.",
  alternates: { canonical: "https://rapidnextech.com/solutions/aesthetic-clinics" },
  openGraph: {
    title: "AI Patient Inquiry Conversion & Retention System for Aesthetic Clinics | RapidNexTech",
    description:
      "Turn Instagram DMs, WhatsApp messages, and website inquiries into booked appointments automatically. Reduce no-shows and automate rebooking. Works with Treatwell, Zenoti, Pabau, and Fresha.",
    type: "website",
    url: "https://rapidnextech.com/solutions/aesthetic-clinics",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech — AI Patient Inquiry Conversion for Aesthetic Clinics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Patient Inquiry Conversion & Retention System for Aesthetic Clinics | RapidNexTech",
    description:
      "Turn Instagram DMs, WhatsApp messages, and website inquiries into booked appointments automatically. Reduce no-shows and automate rebooking. Works with Treatwell, Zenoti, Pabau, and Fresha.",
    images: ["/og-image.png"],
  },
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
      <FAQSection />
    </main>
  )
}
