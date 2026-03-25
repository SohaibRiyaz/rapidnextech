import type { Metadata } from "next"
import PortfolioClient from "./PortfolioClient"
import Script from "next/script"
import { PortfolioCMS } from "@/lib/supabase-cms"
import { slugify } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Case Studies — Real Projects, Real Results",
  description:
    "See how RapidNexTech delivers custom software, SaaS platforms, and AI automation. Real-world projects with measurable impact.",
  alternates: { canonical: "https://rapidnextech.com/case-studies" },
  openGraph: {
    title: "Case Studies — Real Projects, Real Results | RapidNexTech",
    description:
      "Real-world software projects built with Next.js, React Native, and AI automation. See how we deliver performance and innovation.",
    url: "https://rapidnextech.com/case-studies",
    siteName: "RapidNexTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech Case Studies" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies — Real Projects, Real Results | RapidNexTech",
    description:
      "Real-world software projects built with Next.js, React Native, and AI automation. See how we deliver performance and innovation.",
    images: ["/og-image.png"],
  },
}

export default async function Portfolio() {
  const projects = await PortfolioCMS.getPublishedProjects()

  // ItemList Schema for better SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        url: `https://rapidnextech.com/case-studies/${slugify(project.slug || project.title)}`,
        image: project.images[0]?.url,
        description: project.description,
        about: project.category
      }
    }))
  }

  return (
    <>
      <PortfolioClient initialProjects={projects} />
      <Script id="case-studies-collection" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
