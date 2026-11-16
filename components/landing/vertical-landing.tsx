import type { ReactNode } from "react"
import { LandingBehindThis } from "@/components/dental/behind-this"
import { LandingCallHandling } from "@/components/dental/call-handling"
import { LandingFaq } from "@/components/dental/faq"
import { LandingFinalCta } from "@/components/dental/final-cta"
import { LandingHero } from "@/components/dental/hero"
import { LandingHowItWorks } from "@/components/dental/how-it-works"
import { LandingPilotSection } from "@/components/dental/pilot-section"
import { LandingPricing } from "@/components/dental/pricing"
import { LandingProblem } from "@/components/dental/problem"
import { RevenueCalculator } from "@/components/dental/revenue-calculator"
import type { VerticalContent } from "@/content/verticals/types"
import { faqSchema, jsonLd, landingServiceSchema } from "@/lib/seo"

/**
 * US vertical landing template ("/" = HVAC, "/dental" = dental). The section components live in
 * components/dental/ (historical folder name) and take all their copy from content/verticals/*.
 * Order: hero, problem, calculator, how it works, [afterHowItWorks], what it handles, demo, pilot,
 * [beforePricing], pricing, who's behind this, FAQ, final CTA.
 */
export function VerticalLanding({
  content,
  demo,
  afterHowItWorks,
  beforePricing,
}: {
  content: VerticalContent
  demo: ReactNode
  afterHowItWorks?: ReactNode
  beforePricing?: ReactNode
}) {
  // Organization + WebSite JSON-LD come from the root layout.
  const structuredData = [landingServiceSchema(content), faqSchema(content.faqs)]
  return (
    <div className="bg-transparent">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      <LandingHero content={content} />
      <LandingProblem content={content} />
      <RevenueCalculator copy={content.calculator} />
      <LandingHowItWorks content={content} />
      {afterHowItWorks}
      <LandingCallHandling content={content} />
      {demo}
      <LandingPilotSection content={content} />
      {beforePricing}
      <LandingPricing copy={content.pricing} vertical={content.vertical} />
      <LandingBehindThis notCustomersOf={content.behindThis.notCustomersOf} />
      <LandingFaq faqs={content.faqs} title={content.faqTitle} deepLink={content.faqDeepLink} />
      <LandingFinalCta content={content} />
    </div>
  )
}
