import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  IconGridSection,
  IndustryFaqSection,
  IndustryFinalCta,
  IndustryHero,
  ProcessSection,
  ProofSection,
  ScenariosSection,
  SolutionsSection,
} from "@/components/software/industry-sections"
import { INDUSTRIES_HUB_PATH, getPublishedIndustry, industryPath, publishedIndustries, startProjectHref } from "@/lib/industries"
import type { IndustryContent, IndustrySectionKey } from "@/lib/industries/types"
import { breadcrumbSchema, faqSchema, jsonLd, serviceSchema } from "@/lib/seo"
import { absoluteSiteUrl } from "@/lib/site-url"

// Only published industries are routed; anything else is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return publishedIndustries.map((i) => ({ slug: i.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const industry = getPublishedIndustry(params.slug)
  if (!industry) return {}
  // Canonical is always the clean path, so ?for= / ?ref= / UTM variants consolidate to it.
  const url = absoluteSiteUrl(industryPath(industry.slug))
  return {
    title: { absolute: industry.seo.title },
    description: industry.seo.description,
    alternates: { canonical: url },
    robots: industry.index
      ? { index: true, follow: true }
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
    openGraph: {
      title: industry.seo.title,
      description: industry.seo.description,
      url,
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `RapidNexTech: ${industry.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: industry.seo.title,
      description: industry.seo.description,
      images: ["/og-image.png"],
    },
  }
}

function renderSection(key: IndustrySectionKey, industry: IndustryContent) {
  switch (key) {
    case "audience":
      return industry.audience ? (
        <IconGridSection key={key} id="who-its-for" eyebrow="Who it's for" {...industry.audience} />
      ) : null
    case "problems":
      return <IconGridSection key={key} id="challenges" eyebrow="The challenge" tone="muted" muted {...industry.problems} />
    case "solutions":
      return <SolutionsSection key={key} {...industry.solutions} />
    case "scenarios":
      return industry.scenarios ? <ScenariosSection key={key} {...industry.scenarios} /> : null
    case "proof":
      return industry.proof?.items.length ? <ProofSection key={key} {...industry.proof} /> : null
    case "process":
      return <ProcessSection key={key} />
    case "faq":
      return <IndustryFaqSection key={key} faqs={industry.faqs} title={`${industry.name}: common questions`} />
  }
}

export default function IndustryPage({ params }: { params: { slug: string } }) {
  const industry = getPublishedIndustry(params.slug)
  if (!industry) notFound()

  const path = industryPath(industry.slug)
  const ctaHref = startProjectHref(industry.slug)

  const schemas = [
    serviceSchema({ name: industry.name, description: industry.seo.description, path, serviceType: industry.seo.serviceType }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Software", path: "/software" },
      { name: "Industries", path: INDUSTRIES_HUB_PATH },
      { name: industry.name, path },
    ]),
    faqSchema(industry.faqs),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schemas)} />
      <IndustryHero industry={industry} ctaHref={ctaHref} />
      {industry.sections.map((key) => renderSection(key, industry))}
      <IndustryFinalCta {...industry.finalCta} href={ctaHref} />
    </>
  )
}
