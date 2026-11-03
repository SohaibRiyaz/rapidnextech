import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { INDUSTRIES_HUB_PATH, industryPath, publishedIndustries } from "@/lib/industries"
import { industryIcons } from "@/lib/industries/icons"

/** "Industries we build for" block on /software. Renders nothing until an industry page is published. */
export function IndustriesCallout() {
  if (!publishedIndustries.length) return null

  return (
    <section aria-labelledby="industries-callout-title" className="theme-bg theme-transition py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Industries we build for</p>
              <h2 id="industries-callout-title" className="text-2xl font-bold theme-text md:text-3xl">
                See what we build for your industry
              </h2>
            </div>
            <Link
              href={INDUSTRIES_HUB_PATH}
              className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              All industries <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publishedIndustries.map((industry) => {
              const Icon = industryIcons[industry.icon]
              return (
                <li key={industry.slug}>
                  <Link
                    href={industryPath(industry.slug)}
                    className="group flex h-full items-start gap-4 rounded-2xl border border-border/70 bg-background/70 p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-lg"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-semibold theme-text group-hover:text-primary">{industry.name}</span>
                      <span className="mt-1 block text-sm leading-6 text-muted-foreground">{industry.hubSummary}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
