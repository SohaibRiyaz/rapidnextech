import type { Metadata } from "next"
import { RealEstateHero } from "@/components/solutions/real-estate/hero-section"
import { ProblemSection } from "@/components/solutions/real-estate/problem-section"
import { SolutionSection } from "@/components/solutions/real-estate/solution-section"
import { HowItWorksSection } from "@/components/solutions/real-estate/how-it-works-section"
import { FeatureDeepDiveSection } from "@/components/solutions/real-estate/feature-deep-dive-section"
import { WhoItsForSection } from "@/components/solutions/real-estate/who-its-for-section"
import { ROISection } from "@/components/solutions/real-estate/roi-section"
import { PricingSection } from "@/components/solutions/real-estate/pricing-section"
import { OptionalOffersSection } from "@/components/solutions/real-estate/optional-offers-section"
import { CTASection } from "@/components/solutions/real-estate/cta-section"
import { FAQSection } from "@/components/solutions/real-estate/faq-section"

export const metadata: Metadata = {
  title: "Property Inquiry Conversion & Viewing Booking Automation for Real Estate",
  description:
    "Respond instantly to WhatsApp and website property inquiries, qualify buyers, and guide them to book site visits automatically. Works with your CRM or a booking page we create.",
  alternates: { canonical: "https://rapidnextech.com/solutions/real-estate" },
  openGraph: {
    title: "Property Inquiry Conversion for Real Estate | RapidNexTech",
    description:
      "Automate property inquiry responses, qualify buyers, and fill viewing calendars with an AI-driven WhatsApp flow.",
    type: "website",
    url: "https://rapidnextech.com/solutions/real-estate",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech — Real Estate Inquiry Automation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Inquiry Conversion for Real Estate | RapidNexTech",
    description:
      "Automate property inquiry responses, qualify buyers, and fill viewing calendars with an AI-driven WhatsApp flow.",
    images: ["/og-image.png"],
  },
}

export default function RealEstatePage() {
  return (
    <main className="bg-background text-foreground theme-transition">
      <RealEstateHero />
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
