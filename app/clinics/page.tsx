import type { Metadata } from "next"
import { getClinicsFaqs } from "@/components/clinics/faq-data"
import { ClinicsFaq } from "@/components/clinics/faq"
import { ClinicsHero } from "@/components/clinics/hero"
import { ClinicsPageView } from "@/components/clinics/page-view"
import { ClinicsPricing } from "@/components/clinics/pricing"
import {
  ClinicsBuiltFor,
  ClinicsControl,
  ClinicsDemo,
  ClinicsFinalCta,
  ClinicsHandles,
  ClinicsHowItWorks,
  ClinicsProblem,
  ClinicsProducts,
} from "@/components/clinics/sections"
import { CALLING_ADDON, PLANS } from "@/lib/clinics-config"
import { breadcrumbSchema, faqSchema, jsonLd } from "@/lib/seo"
import { absoluteSiteUrl, getSiteOrigin } from "@/lib/site-url"

const PATH = "/clinics"
const TITLE = "AI Receptionist for Clinics in Dubai, UAE, Qatar & Saudi | WhatsApp + Calls"
const DESCRIPTION =
  "AI receptionist for clinics in the UAE, Qatar, Saudi Arabia & Egypt. Replies on WhatsApp, voice notes too, and answers calls 24/7 in English and Arabic."
const OG_ALT = "RapidNexTech AI receptionist for clinics: WhatsApp replies and AI calls in English and Arabic"

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteSiteUrl(PATH) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteSiteUrl(PATH),
    siteName: "RapidNexTech",
    type: "website",
    locale: "en_US",
    images: [{ url: "/clinics/og", width: 1200, height: 630, alt: OG_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/clinics/og", alt: OG_ALT }],
  },
}

function clinicsServiceSchema() {
  const url = absoluteSiteUrl(PATH)
  const monthly = (price: number, min = false) => ({
    "@type": "UnitPriceSpecification",
    ...(min ? { minPrice: price } : { price }),
    priceCurrency: "USD",
    unitText: "month",
  })
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Receptionist for Clinics (WhatsApp + AI calling)",
    serviceType: "AI receptionist for WhatsApp and phone calls",
    description: DESCRIPTION,
    url,
    provider: { "@id": `${getSiteOrigin()}/#organization` },
    areaServed: ["United Arab Emirates", "Qatar", "Saudi Arabia", "Egypt"].map((name) => ({ "@type": "Country", name })),
    audience: {
      "@type": "BusinessAudience",
      audienceType:
        "Private clinics: aesthetic & cosmetic, dental, dermatology, physiotherapy, fertility & IVF, medical centres",
    },
    availableLanguage: ["English", "Arabic"],
    offers: [
      ...PLANS.map((plan) => ({
        "@type": "Offer",
        name: `${plan.name} plan`,
        description: `Up to ${plan.conversations.toLocaleString("en-US")} WhatsApp conversations per month. Month-to-month, cancel anytime.`,
        url: `${url}#pricing`,
        price: plan.price,
        priceCurrency: "USD",
        priceSpecification: monthly(plan.price, plan.priceFrom),
        availability: "https://schema.org/InStock",
      })),
      {
        "@type": "Offer",
        name: CALLING_ADDON.name,
        description: `${CALLING_ADDON.includedMinutes} call minutes included, then $${CALLING_ADDON.perMinuteAfter.toFixed(2)}/min. ${CALLING_ADDON.note}`,
        url: `${url}#pricing`,
        price: CALLING_ADDON.price,
        priceCurrency: "USD",
        priceSpecification: monthly(CALLING_ADDON.price),
        availability: "https://schema.org/InStock",
      },
    ],
  }
}

export default function ClinicsPage() {
  return (
    <div className="bg-transparent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI receptionist for clinics", path: PATH },
          ]),
          clinicsServiceSchema(),
          faqSchema(getClinicsFaqs()),
        ])}
      />
      <ClinicsPageView />
      <ClinicsHero />
      <ClinicsProblem />
      <ClinicsBuiltFor />
      <ClinicsProducts />
      <ClinicsControl />
      <ClinicsHowItWorks />
      <ClinicsHandles />
      <ClinicsDemo />
      <ClinicsPricing />
      <ClinicsFaq />
      <ClinicsFinalCta />
    </div>
  )
}
