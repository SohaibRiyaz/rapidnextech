import type { Metadata } from "next"
import { GeoBanner } from "@/components/geo-banner"
import { LandingComparison } from "@/components/landing/comparison"
import { HvacDemoSection } from "@/components/landing/hvac-demo-section"
import { VerticalLanding } from "@/components/landing/vertical-landing"
import { hvacContent } from "@/content/verticals/hvac"

// "/" = the US HVAC offer. The dental offer moved to /dental (app/dental/page.tsx).
const { seo } = hvacContent

export const metadata: Metadata = {
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: "https://rapidnextech.com" },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: "https://rapidnextech.com",
    siteName: "RapidNexTech",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: seo.ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: ["/og-image.png"],
  },
}

export default function Home() {
  return (
    <>
      {/* Gulf / Egypt visitors: strip linking to /clinics (see components/geo-banner.tsx + middleware.ts). */}
      <GeoBanner />
      <VerticalLanding content={hvacContent} demo={<HvacDemoSection />} beforePricing={<LandingComparison />} />
    </>
  )
}
