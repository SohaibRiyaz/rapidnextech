import type { Metadata } from "next"
import { DietNutritionHero } from "@/components/solutions/diet-nutrition/hero-section"
import { ProblemSection } from "@/components/solutions/diet-nutrition/problem-section"
import { SolutionSection } from "@/components/solutions/diet-nutrition/solution-section"
import { HowItWorksSection } from "@/components/solutions/diet-nutrition/how-it-works-section"
import { FeatureDeepDiveSection } from "@/components/solutions/diet-nutrition/feature-deep-dive-section"
import { WhoItsForSection } from "@/components/solutions/diet-nutrition/who-its-for-section"
import { ROISection } from "@/components/solutions/diet-nutrition/roi-section"
import { PricingSection } from "@/components/solutions/diet-nutrition/pricing-section"
import { OptionalOffersSection } from "@/components/solutions/diet-nutrition/optional-offers-section"
import { CTASection } from "@/components/solutions/diet-nutrition/cta-section"
import { FAQSection } from "@/components/solutions/diet-nutrition/faq-section"

export const metadata: Metadata = {
  title: "WhatsApp Automation for Diet & Nutrition Businesses",
  description:
    "Respond instantly to diet inquiries, qualify goals, and guide clients to book consultations or purchase meal plans automatically. Works with your calendar or a booking page we create.",
  alternates: { canonical: "https://rapidnextech.com/solutions/diet-nutrition" },
  openGraph: {
    title: "Diet Plan Inquiry Automation | RapidNexTech",
    description:
      "Automate nutrition inquiries, qualify prospects, and increase consultation bookings with an AI-driven WhatsApp flow.",
    type: "website",
    url: "https://rapidnextech.com/solutions/diet-nutrition",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech - Diet & Nutrition Automation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diet Plan Inquiry Automation | RapidNexTech",
    description:
      "Automate nutrition inquiries, qualify prospects, and increase consultation bookings with an AI-driven WhatsApp flow.",
    images: ["/og-image.png"],
  },
}

export default function DietNutritionPage() {
  return (
    <main className="bg-background text-foreground theme-transition">
      <DietNutritionHero />
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
