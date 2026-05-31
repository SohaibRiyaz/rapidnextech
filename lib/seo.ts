import { absoluteSiteUrl, getSiteOrigin } from "@/lib/site-url"

export const siteName = "RapidNexTech"
export const salesPhone = "+1 214 896 4186"
export const ukPhone = "+44 7311 133668"
export const salesEmail = "contact@rapidnextech.com"
export const ukAddress = {
  streetAddress: "38 Scotia Road",
  addressLocality: "Stoke-on-Trent",
  postalCode: "ST6 4EP",
  addressCountry: "GB",
}

export type FaqItem = {
  question: string
  answer: string
}

export type BreadcrumbItem = {
  name: string
  path: string
}

export function organizationSchema() {
  const siteOrigin = getSiteOrigin()

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteOrigin}/#organization`,
    name: siteName,
    url: siteOrigin,
    logo: {
      "@type": "ImageObject",
      url: absoluteSiteUrl("/logo-main.png"),
      width: 512,
      height: 512,
    },
    description:
      "Custom software, SaaS development, and AI automation for growing businesses in the US, GCC, UK, and global markets.",
    foundingDate: "2020",
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
        availableLanguage: ["English"],
        areaServed: ["US", "GCC", "UK", "Worldwide"],
      },
      {
        "@type": "ContactPoint",
        telephone: ukPhone,
        email: salesEmail,
        contactType: "customer service",
        availableLanguage: ["English"],
        areaServed: ["UK", "Worldwide"],
      },
    ],
    sameAs: [
      "https://github.com/RapidNexTech",
      "https://linkedin.com/company/RapidNexTech",
      "https://twitter.com/RapidNexTech",
    ],
    serviceType: [
      "Custom Software Development",
      "SaaS Development",
      "AI Automation",
      "AI Receptionist Systems",
      "Web Application Development",
      "Mobile App Development",
    ],
  }
}

export function websiteSchema() {
  const siteOrigin = getSiteOrigin()

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteOrigin}/#website`,
    url: siteOrigin,
    name: siteName,
    description: "Custom software, SaaS development, and AI automation from RapidNexTech.",
    publisher: {
      "@id": `${siteOrigin}/#organization`,
    },
    inLanguage: "en-US",
  }
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteSiteUrl(item.path),
    })),
  }
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export function serviceSchema({
  name,
  description,
  path,
  areaServed = ["US", "GCC", "UK", "Worldwide"],
  serviceType,
}: {
  name: string
  description: string
  path: string
  areaServed?: string[]
  serviceType?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: serviceType || name,
    description,
    url: absoluteSiteUrl(path),
    provider: {
      "@id": `${getSiteOrigin()}/#organization`,
    },
    areaServed,
  }
}

export function jsonLd(value: unknown) {
  return {
    __html: JSON.stringify(value),
  }
}
