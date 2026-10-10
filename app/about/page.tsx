import type { Metadata } from "next"
import Script from "next/script"
import AboutClient from "@/components/about/AboutClient"
import { breadcrumbSchema, jsonLd } from "@/lib/seo"

export const metadata: Metadata = {
  title: "About RapidNexTech - AI Receptionist for Dental Practices",
  description:
    "RapidNexTech builds the AI receptionist for US dental practices: 24/7 answering for after-hours, weekend and overflow calls, with every request sent to the front desk. We also build custom software.",
  alternates: { canonical: "https://rapidnextech.com/about" },
  openGraph: {
    title: "About RapidNexTech - AI Receptionist for Dental Practices",
    description:
      "The team behind the AI receptionist for US dental practices. We also build custom software.",
    url: "https://rapidnextech.com/about",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About RapidNexTech, AI receptionist for dental practices" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About RapidNexTech - AI Receptionist for Dental Practices",
    description:
      "The team behind the AI receptionist for US dental practices. We also build custom software.",
    images: ["/og-image.png"],
  },
}

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About RapidNexTech",
    url: "https://rapidnextech.com/about",
    description:
      "RapidNexTech is a software engineering company that builds the AI receptionist for US dental practices, and also builds custom software.",
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
