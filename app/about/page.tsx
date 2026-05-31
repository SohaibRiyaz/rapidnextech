import type { Metadata } from "next"
import Script from "next/script"
import AboutClient from "@/components/about/AboutClient"
import { breadcrumbSchema, jsonLd } from "@/lib/seo"

export const metadata: Metadata = {
  title: "About RapidNexTech - AI Automation & Software Engineering Team",
  description:
    "RapidNexTech is a remote-first software engineering team specializing in custom SaaS, AI automation, and scalable web and mobile apps for businesses in the GCC, US, and UK.",
  alternates: { canonical: "https://rapidnextech.com/about" },
  openGraph: {
    title: "About RapidNexTech - AI Automation & Software Engineering Team",
    description:
      "A remote-first team building custom software, SaaS platforms, and AI-powered automation for businesses in the GCC, US, UK, and global markets.",
    url: "https://rapidnextech.com/about",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About RapidNexTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About RapidNexTech - AI Automation & Software Engineering Team",
    description:
      "A remote-first team building custom software, SaaS platforms, and AI-powered automation for businesses in the GCC, US, UK, and global markets.",
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
      "RapidNexTech is a remote-first software engineering company specializing in custom SaaS, AI automation, web applications, and mobile apps.",
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
