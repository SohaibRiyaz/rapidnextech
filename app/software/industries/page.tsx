import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { card, primaryCta } from "@/components/dental/styles"
import { IndustryFinalCta, ProcessSection, formatSar } from "@/components/software/industry-sections"
import { INDUSTRIES_HUB_PATH, START_PROJECT_PATH, industryPath, publishedIndustries } from "@/lib/industries"
import { industryIcons } from "@/lib/industries/icons"
import { breadcrumbSchema, jsonLd } from "@/lib/seo"
import { absoluteSiteUrl } from "@/lib/site-url"

const TITLE = "Software for Your Industry | RapidNexTech"
const DESCRIPTION =
  "Websites, e-commerce, business systems and automation, planned around how your industry works. See what we build and start a project."

const hasPages = publishedIndustries.length > 0

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteSiteUrl(INDUSTRIES_HUB_PATH) },
  // Not indexed until at least one industry page is live.
  robots: hasPages ? { index: true, follow: true } : { index: false, follow: true, googleBot: { index: false, follow: true } },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteSiteUrl(INDUSTRIES_HUB_PATH),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech industries" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png"] },
}

export default function IndustriesHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Software", path: "/software" },
            { name: "Industries", path: INDUSTRIES_HUB_PATH },
          ]),
        )}
      />

      <section aria-labelledby="hub-title" className="relative overflow-hidden pb-12 pt-28 md:pb-16 md:pt-36 short:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-transparent to-transparent" aria-hidden="true" />
        <div className="container relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Industries we build for</p>
          <h1 id="hub-title" className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl short:text-5xl">
            Software shaped around how your business works
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            From a first professional website to the systems that run your operations. Choose your industry to see what we
            typically build, or tell us about your project directly.
          </p>
        </div>
      </section>

      <section aria-label="Industries" className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          {hasPages ? (
            <ul className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {publishedIndustries.map((industry) => {
                const Icon = industryIcons[industry.icon]
                return (
                  <li key={industry.slug}>
                    <Link
                      href={industryPath(industry.slug)}
                      className={`${card} group flex h-full flex-col p-6 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                    >
                      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h2 className="text-xl font-semibold text-card-foreground">{industry.name}</h2>
                      <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">{industry.hubSummary}</p>
                      {industry.startingFrom ? (
                        <p className="mt-4 text-sm text-muted-foreground">
                          From <span className="font-semibold text-foreground">{formatSar(industry.startingFrom.amount)}</span>
                        </p>
                      ) : null}
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                        See what we build
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-lg text-muted-foreground">Industry guides are coming soon. Tell us about your project in the meantime.</p>
              <Link href={START_PROJECT_PATH} className={`${primaryCta} mt-6`}>
                Start a project <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <ProcessSection />

      <IndustryFinalCta
        title="Not sure where your project fits?"
        body="Describe what you need in a few sentences. We'll reply with questions or a suggested approach, and a clear quote."
        button="Start a project"
        href={START_PROJECT_PATH}
      />
    </>
  )
}
