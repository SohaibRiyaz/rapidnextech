import type { Metadata } from "next"
import { DentalBehindThis } from "@/components/dental/behind-this"
import { DentalCallHandling } from "@/components/dental/call-handling"
import { getDentalFaqs } from "@/components/dental/faq-data"
import { DentalFaq } from "@/components/dental/faq"
import { DentalFinalCta } from "@/components/dental/final-cta"
import { DentalHero } from "@/components/dental/hero"
import { DentalHowItWorks } from "@/components/dental/how-it-works"
import { DentalPilotSection } from "@/components/dental/pilot-section"
import { DentalPricing } from "@/components/dental/pricing"
import { DentalProblem } from "@/components/dental/problem"
import { RevenueCalculator } from "@/components/dental/revenue-calculator"
import { DentalTryItNow } from "@/components/dental/try-it-now"
import { dentalReceptionistServiceSchema, faqSchema, jsonLd } from "@/lib/seo"

const TITLE = "24/7 AI Receptionist for Dental Practices"
const DESCRIPTION =
  "AI receptionist for US dental practices. Answers after-hours, weekend and overflow calls, captures new patients and emergencies. 14-day free pilot, no card."

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | RapidNexTech` },
  description: DESCRIPTION,
  alternates: { canonical: "https://rapidnextech.com" },
  openGraph: {
    title: `${TITLE} | RapidNexTech`,
    description: DESCRIPTION,
    url: "https://rapidnextech.com",
    siteName: "RapidNexTech",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RapidNexTech AI receptionist for dental practices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | RapidNexTech`,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
}

export default function Home() {
  // Organization + WebSite JSON-LD come from the root layout.
  const structuredData = [dentalReceptionistServiceSchema("/"), faqSchema(getDentalFaqs())]

  return (
    <div className="bg-transparent">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      <DentalHero />
      <DentalProblem />
      <RevenueCalculator />
      <DentalHowItWorks />
      <DentalCallHandling />
      <DentalTryItNow />
      <DentalPilotSection />
      <DentalPricing />
      <DentalBehindThis />
      <DentalFaq />
      <DentalFinalCta />
    </div>
  )
}
