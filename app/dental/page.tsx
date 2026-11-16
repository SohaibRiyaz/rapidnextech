import type { Metadata } from "next"
import { DentalDetails } from "@/components/dental/details"
import { DentalTryItNow } from "@/components/dental/try-it-now"
import { VerticalLanding } from "@/components/landing/vertical-landing"
import { dentalContent } from "@/content/verticals/dental"
import { breadcrumbSchema, jsonLd } from "@/lib/seo"

// /dental = the US dental practice offer (the former homepage, plus the details from the old
// /solutions/dental-clinics page, which now redirects here).
const { seo } = dentalContent
const TITLE = `${seo.title} | RapidNexTech`
const URL = "https://rapidnextech.com/dental"

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: seo.description,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: seo.description,
    url: URL,
    siteName: "RapidNexTech",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: seo.ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: seo.description,
    images: ["/og-image.png"],
  },
}

export default function DentalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "AI receptionist for dental practices", path: "/dental" },
          ]),
        )}
      />
      <VerticalLanding content={dentalContent} demo={<DentalTryItNow />} afterHowItWorks={<DentalDetails />} />
    </>
  )
}
