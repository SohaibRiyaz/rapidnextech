import type { LucideIcon } from "lucide-react"
import type { FaqItem } from "@/lib/seo"
import type { PlanId } from "@/lib/site-config"

/**
 * Content for one vertical of the US landing template (components/landing/vertical-landing.tsx).
 * Same section components for every vertical; only this content differs.
 * Prices, minutes and plan ids are NOT here: they live once in lib/site-config.ts (siteConfig.pricing).
 */

export type Vertical = "hvac" | "dental"

export type IconText = { icon: LucideIcon; title: string; text: string }

export type CallHandlingItem = IconText & { tip?: { label: string; text: string } }

export type VerticalContent = {
  vertical: Vertical
  /** Page path, used for canonical URL, JSON-LD and in-page links. */
  path: "/" | "/dental"

  seo: {
    title: string
    description: string
    ogAlt: string
    serviceName: string
    serviceType: string
    serviceDescription: string
    audience: string
  }

  hero: {
    badge: string
    titleStart: string
    titleHighlight: string
    titleEnd: string
    sub: string
    /** Primary CTA: scrolls to this element id. */
    primaryCta: { label: string; targetId: string; scroll?: boolean }
    /** Optional small link under the chips. */
    deepLink?: { label: string; href: string }
    example: {
      ariaLabel: string
      title: string
      meta: string
      rows: [string, string][]
      next: string
      caption: string
    }
  }

  problem: {
    title: string
    intro: string
    windows: IconText[]
    flow: { icon: LucideIcon; label: string }[]
    calloutTitle: string
    calloutText: string
  }

  calculator: {
    title: string
    missedHint: string
    valueLabel: string
    valueHint: string
    formula: string
    defaults: { missedPerWeek: string; bookRate: string; jobValue: string }
  }

  howItWorks: {
    title: string
    steps: IconText[]
    footnote: string
  }

  callHandling: {
    title: string
    items: CallHandlingItem[]
    footnote: string
  }

  pilot: {
    intro: string
    timeline: { when: string; title: string; text: string }[]
    terms: readonly string[]
    /** Show the patient-data note under the terms. */
    securityNote: boolean
  }

  pricing: {
    intro: string
    /** Plan feature lines, per plan id (numbers come from siteConfig). */
    features: Record<PlanId, readonly { text: string; comingSoon?: boolean }[]>
    /** Word used in "up to 3 …" under the price. */
    locationsNoun: string
    comingSoonTooltip: string
    foundingText: string
    allPlansTerms: readonly string[]
    footnote: string
  }

  behindThis: {
    /** "They are not … or AI receptionist customers." */
    notCustomersOf: string
  }

  faqTitle: string
  faqs: FaqItem[]
  /** Optional small link under the FAQ. */
  faqDeepLink?: { label: string; href: string }

  finalCta: {
    title: string
    text: string
    primaryLabel: string
    /** Element id the primary button scrolls to. */
    primaryTargetId: string
    footer: string
  }
}
