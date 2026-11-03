import type { Metadata } from "next"
import { Check, Mail, Phone } from "lucide-react"
import { card } from "@/components/dental/styles"
import { ProjectForm } from "@/components/software/project-form"
import { START_PROJECT_PATH } from "@/lib/industries"
import { breadcrumbSchema, jsonLd } from "@/lib/seo"
import { siteConfig, telHref } from "@/lib/site-config"
import { absoluteSiteUrl } from "@/lib/site-url"

const TITLE = "Start a Software Project | RapidNexTech"
const DESCRIPTION =
  "Tell us about your website, e-commerce, app or automation project. We reply with questions or a suggested approach and a clear quote."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  // Canonical drops ?industry= and attribution params.
  alternates: { canonical: absoluteSiteUrl(START_PROJECT_PATH) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteSiteUrl(START_PROJECT_PATH),
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Start a project with RapidNexTech" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png"] },
}

const nextSteps = [
  "We read your details and reply by email, usually within one business day.",
  "A short call or email exchange to understand what you need.",
  "A written proposal with scope, timeline and price. No obligation.",
]

export default function StartProjectPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Software", path: "/software" },
            { name: "Start a project", path: START_PROJECT_PATH },
          ]),
        )}
      />

      <section aria-labelledby="start-title" className="pb-16 pt-28 md:pb-24 md:pt-36 short:pt-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Start a project</p>
            <h1 id="start-title" className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl short:text-4xl">
              Tell us what you want to build
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              A few details are enough to start. There&apos;s no cost or commitment to get a proposal.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_340px]">
            <ProjectForm />

            <aside className="flex flex-col gap-6" aria-label="What happens next and contact details">
              <div className={`${card} p-6`}>
                <h2 className="text-lg font-semibold text-card-foreground">What happens next</h2>
                <ol className="mt-4 space-y-3">
                  {nextSteps.map((step, i) => (
                    <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className={`${card} p-6`}>
                <h2 className="text-lg font-semibold text-card-foreground">Prefer email?</h2>
                <ul className="mt-3 space-y-1 text-sm">
                  <li>
                    <a href={`mailto:${siteConfig.email}`} className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-foreground hover:text-primary">
                      <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                      {siteConfig.email}
                    </a>
                  </li>
                  <li>
                    <a href={telHref(siteConfig.ukPhone)} className="inline-flex min-h-[44px] items-center gap-2 text-muted-foreground hover:text-primary">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      UK: {siteConfig.ukPhone.display}
                    </a>
                  </li>
                  <li>
                    <a href={telHref(siteConfig.publicPhone)} className="inline-flex min-h-[44px] items-center gap-2 text-muted-foreground hover:text-primary">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      US: {siteConfig.publicPhone.display}
                    </a>
                  </li>
                </ul>
              </div>

              <ul className="space-y-2 px-1 text-sm text-muted-foreground">
                {["You own the code and content we deliver", "Clear written quote before work starts", "NDA available on request"].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
