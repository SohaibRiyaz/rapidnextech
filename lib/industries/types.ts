/**
 * Content model for /software/industries/[slug].
 *
 * Every industry page is one typed content file rendered by a shared template. The template is
 * section-driven: each page brings its own audience, problems, solutions, scenarios and FAQ (and
 * may reorder them), so pages never read as the same page with the industry name swapped.
 *
 * Copy lives here, not in components, so a future Arabic (RTL) version only needs translated
 * content files: components use logical (start/end) spacing.
 */

import type { IconKey } from "./icons"

export type IconItem = {
  icon: IconKey
  title: string
  description: string
}

export type SolutionItem = IconItem & {
  /** Concrete things the client receives. Keep short: 2-4 items. */
  deliverables?: string[]
}

export type ScenarioItem = {
  /** Short label, e.g. "3-branch service company". Rendered under an "Example" badge. */
  title: string
  before: string
  after: string
}

export type ProofItem = {
  title: string
  summary: string
  /** Case study path, e.g. "/case-studies/<slug>". Only link projects that are live. */
  href: string
}

export type FaqEntry = { question: string; answer: string }

/** Sections an industry page can render, in the order listed in `sections`. */
export type IndustrySectionKey = "audience" | "problems" | "solutions" | "scenarios" | "proof" | "process" | "faq"

export type IndustryContent = {
  slug: string
  /** false: not routed (404), not in the hub, form or sitemap. */
  published: boolean
  /** false: page renders but is noindex and left out of the sitemap. */
  index: boolean

  /** Display name, e.g. "Business websites". */
  name: string
  /** Label in the start-a-project industry dropdown. */
  formLabel: string
  icon: IconKey
  /** One or two sentences for the hub card. */
  hubSummary: string

  seo: { title: string; description: string; serviceType: string }

  hero: {
    eyebrow: string
    title: string
    intro: string
    /** Label of the primary CTA (links to the inquiry form with this industry preselected). */
    primaryCta: string
    /** Optional in-page anchor, e.g. { label: "What we build", href: "#solutions" }. */
    secondaryCta?: { label: string; href: string }
    /** Short reassurance chips under the CTAs. */
    chips?: string[]
  }

  /** Optional "Projects typically start from" line. Hidden when null. */
  startingFrom: { amount: number; currency: "SAR"; note?: string } | null

  audience?: { title: string; intro?: string; items: IconItem[] }
  problems: { title: string; intro?: string; items: IconItem[] }
  solutions: { title: string; intro?: string; items: SolutionItem[] }
  scenarios?: { title: string; intro?: string; items: ScenarioItem[] }
  proof?: { title: string; intro?: string; items: ProofItem[] }
  faqs: FaqEntry[]

  finalCta: { title: string; body: string; button: string }

  /** Render order of the body sections. The hero and final CTA always bracket the page. */
  sections: IndustrySectionKey[]
}
