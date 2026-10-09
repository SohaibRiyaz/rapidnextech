import { absoluteSiteUrl, getSiteOrigin } from "@/lib/site-url"
import { approxCalls, siteConfig } from "@/lib/site-config"

export const siteName = "RapidNexTech"
export const salesPhone = siteConfig.publicPhone.display
/** E.164 form for JSON-LD telephone fields. */
export const salesPhoneE164 = siteConfig.publicPhone.e164
export const ukPhone = siteConfig.ukPhone.display
export const salesEmail = siteConfig.email
export const ukAddress = {
  streetAddress: "38 Scotia Road",
  addressLocality: "Stoke-on-Trent",
  postalCode: "ST6 4EP",
  addressCountry: "GB",
}

export const DENTAL_DESCRIPTION =
  "AI receptionist for US dental practices: answers after-hours, weekend and overflow calls 24/7, captures new patients, handles dental emergencies, and sends every request to your front desk."

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
    description: DENTAL_DESCRIPTION,
    telephone: salesPhoneE164,
    email: salesEmail,
    address: {
      "@type": "PostalAddress",
      ...ukAddress,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: salesPhoneE164,
        email: salesEmail,
        contactType: "sales",
        availableLanguage: ["English"],
        areaServed: ["US"],
      },
      {
        "@type": "ContactPoint",
        telephone: siteConfig.ukPhone.e164,
        email: salesEmail,
        contactType: "customer service",
        availableLanguage: ["English"],
        areaServed: ["UK"],
      },
    ],
    sameAs: [
      "https://github.com/RapidNexTech",
      "https://linkedin.com/company/RapidNexTech",
      "https://twitter.com/RapidNexTech",
    ],
    serviceType: ["AI Receptionist for Dental Practices", "Custom Software Development"],
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
    description: "AI receptionist for US dental practices, from RapidNexTech.",
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

/** One Offer per pricing plan in site-config (monthly, USD). */
export function planOffers(path = "/#pricing") {
  return siteConfig.pricing.plans.map((plan) => ({
    "@type": "Offer",
    name: `${plan.name} plan`,
    description: `${plan.includedMinutes.toLocaleString("en-US")} minutes included per month (~${approxCalls(
      plan.includedMinutes,
    ).toLocaleString("en-US")} calls). Month-to-month, cancel anytime.`,
    url: absoluteSiteUrl(path),
    price: plan.price,
    priceCurrency: siteConfig.pricing.currency,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      ...(plan.priceFrom ? { minPrice: plan.price } : { price: plan.price }),
      priceCurrency: siteConfig.pricing.currency,
      unitText: "month",
    },
    availability: "https://schema.org/InStock",
  }))
}

/** Service schema for the dental AI receptionist, with the three plans as offers. */
export function dentalReceptionistServiceSchema(path = "/") {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Receptionist for Dental Practices",
    serviceType: "AI receptionist / after-hours call answering for dental practices",
    description: DENTAL_DESCRIPTION,
    url: absoluteSiteUrl(path),
    provider: { "@id": `${getSiteOrigin()}/#organization` },
    areaServed: { "@type": "Country", name: "United States" },
    audience: { "@type": "BusinessAudience", audienceType: "Dental practices" },
    availableLanguage: siteConfig.supportsSpanish ? ["English", "Spanish"] : ["English"],
    offers: planOffers(),
  }
}

export function jsonLd(value: unknown) {
  return {
    __html: JSON.stringify(value),
  }
}
