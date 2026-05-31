import type { Metadata } from "next"
import Script from "next/script"
import { Suspense } from "react"
import ContactClient from "./ContactClient"
import { breadcrumbSchema, jsonLd, salesEmail, salesPhone, ukAddress, ukPhone } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Contact Us - Start Your Project",
  description:
    "Get in touch with RapidNexTech for custom software, SaaS, or AI automation projects. We respond within 24 hours. Email, WhatsApp, or call our team.",
  alternates: { canonical: "https://rapidnextech.com/contact" },
  openGraph: {
    title: "Contact RapidNexTech - Let's Build Together",
    description:
      "Ready to start your project? Reach out for a free consultation on custom software, SaaS, or AI automation.",
    url: "https://rapidnextech.com/contact",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact RapidNexTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact RapidNexTech - Let's Build Together",
    description:
      "Ready to start your project? Reach out for a free consultation on custom software, SaaS, or AI automation.",
    images: ["/og-image.png"],
  },
}

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact RapidNexTech",
    url: "https://rapidnextech.com/contact",
    description: "Get in touch with RapidNexTech for your next software project.",
    mainEntity: {
      "@type": "Organization",
      name: "RapidNexTech",
      email: salesEmail,
      address: {
        "@type": "PostalAddress",
        ...ukAddress,
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: salesPhone,
          email: salesEmail,
          contactType: "sales",
          areaServed: ["US", "GCC", "UK", "Worldwide"],
        },
        {
          "@type": "ContactPoint",
          telephone: ukPhone,
          email: salesEmail,
          contactType: "customer service",
          areaServed: ["UK", "Worldwide"],
        },
      ],
    },
    breadcrumb: breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
  }

  return (
    <>
      <Suspense fallback={null}>
        <ContactClient />
      </Suspense>
      <Script
        id="contact-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={jsonLd(contactSchema)}
      />
    </>
  )
}
