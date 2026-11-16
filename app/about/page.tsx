import type { Metadata } from "next"
import Script from "next/script"
import AboutClient from "@/components/about/AboutClient"
import { breadcrumbSchema, jsonLd } from "@/lib/seo"

const TITLE = "About RapidNexTech | AI Receptionists for HVAC & Dental"
const DESCRIPTION =
  "RapidNexTech builds AI receptionists for US HVAC companies and dental practices, WhatsApp + AI calling for clinics in the Gulf & Egypt, and custom software."
const SHORT_DESCRIPTION =
  "AI receptionists for US HVAC companies and dental practices, WhatsApp + AI calling for clinics in the Gulf & Egypt, and custom software."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "https://rapidnextech.com/about" },
  openGraph: {
    title: TITLE,
    description: SHORT_DESCRIPTION,
    url: "https://rapidnextech.com/about",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About RapidNexTech, AI receptionists for HVAC companies and dental practices" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHORT_DESCRIPTION,
    images: ["/og-image.png"],
  },
}

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About RapidNexTech",
    url: "https://rapidnextech.com/about",
    description: DESCRIPTION,
    breadcrumb: breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]),
  }

  return (
    <>
      <AboutClient />
      <Script
        id="about-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={jsonLd(aboutSchema)}
      />
    </>
  )
}
