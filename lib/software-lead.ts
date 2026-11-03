import { z } from "zod"

/**
 * Shared by the /software/start-a-project form (client) and /api/software-lead (server).
 * Kept separate from the dental pilot form (lib/pilot-request.ts).
 */

/** Industry options. Slugs match /software/industries/[slug] so ?industry=<slug> preselects. */
export const LEAD_INDUSTRIES = [
  { slug: "business-websites", label: "Business website" },
  { slug: "ecommerce-retail", label: "E-commerce & retail" },
  { slug: "enterprise-it", label: "Enterprise & IT services" },
  { slug: "nonprofits", label: "Non-profit / NGO" },
  { slug: "financial-services", label: "Financial services" },
  { slug: "hospitality", label: "Restaurants & hospitality" },
  { slug: "healthcare", label: "Healthcare" },
  { slug: "education", label: "Education & training" },
  { slug: "real-estate", label: "Real estate" },
  { slug: "other", label: "Other" },
] as const

export const PROJECT_TYPES = [
  "New website",
  "Website redesign",
  "E-commerce store",
  "Web application or portal",
  "Mobile app",
  "Automation or integrations",
  "AI features",
  "Ongoing support or dedicated developer",
  "Not sure yet",
] as const

export const BUDGET_RANGES = [
  "Under SAR 10,000",
  "SAR 10,000 – 25,000",
  "SAR 25,000 – 50,000",
  "SAR 50,000 – 100,000",
  "SAR 100,000+",
  "Not sure",
] as const

export const TIMELINES = ["As soon as possible", "Within 1–3 months", "Within 3–6 months", "Flexible / exploring"] as const

export const COUNTRIES = [
  "Saudi Arabia",
  "United Arab Emirates",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "United Kingdom",
  "United States",
  "Other",
] as const

const industrySlugs = LEAD_INDUSTRIES.map((i) => i.slug) as [string, ...string[]]

const trimmed = (max: number) => z.string().trim().max(max)
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .enum(values)
    .optional()
    .or(z.literal("").transform(() => undefined))

export const softwareLeadSchema = z.object({
  name: trimmed(120).min(2, "Please enter your name."),
  company: trimmed(160).min(2, "Please enter your company or organisation."),
  email: trimmed(200).email("Please enter a valid email address."),
  phone: trimmed(40)
    .regex(/^[+()\d\s.-]*$/, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  country: z.enum(COUNTRIES, { errorMap: () => ({ message: "Please choose your country." }) }),
  industry: z.enum(industrySlugs, { errorMap: () => ({ message: "Please choose your industry." }) }),
  projectType: z.enum(PROJECT_TYPES, { errorMap: () => ({ message: "Please choose a project type." }) }),
  budget: optionalEnum(BUDGET_RANGES),
  timeline: optionalEnum(TIMELINES),
  message: trimmed(3000).min(10, "Please tell us a little about the project (a sentence or two is fine)."),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm we can contact you." }) }),
})

export const softwareLeadMetaSchema = z.object({
  /** Honeypot: people leave it empty. Accepted here so the route can silently drop bots (fake success). */
  website: z.string().max(500).optional(),
  startedAt: z.number().optional(),
  pageUrl: trimmed(500).optional(),
  landingUrl: trimmed(500).optional(),
  utm: z.record(z.string().max(300)).optional(),
})

export const softwareLeadSubmissionSchema = softwareLeadSchema.merge(softwareLeadMetaSchema)

export type SoftwareLead = z.infer<typeof softwareLeadSchema>
export type SoftwareLeadSubmission = z.infer<typeof softwareLeadSubmissionSchema>
export type SoftwareLeadFieldErrors = Partial<Record<keyof SoftwareLead, string>>

export function industryLabel(slug: string) {
  return LEAD_INDUSTRIES.find((i) => i.slug === slug)?.label ?? slug
}

/* ------------------------------------------------------------------ */
/* Attribution (first-party, internal only: never shown to visitors)   */
/* ------------------------------------------------------------------ */

export const REF_COOKIE = "rnt_ref"
export const REF_COOKIE_MAX_AGE = 60 * 60 * 24 * 90 // 90 days

/** Referral codes: short slugs only, e.g. "kgulf". Anything else is ignored. */
export function sanitizeRef(value: string | null | undefined): string | null {
  if (!value) return null
  const v = value.trim().toLowerCase()
  return /^[a-z0-9][a-z0-9_-]{0,39}$/.test(v) ? v : null
}

/**
 * "Prepared for <Company>" personalisation (?for=). Display-only text: letters (any script),
 * digits, spaces and basic punctuation, max 60 chars. Returns null when nothing usable is left.
 */
// Built at runtime: the TS target (ES6) rejects Unicode property escapes in regex literals.
const DISALLOWED_FOR_CHARS = new RegExp("[^\\p{L}\\p{N} &.,'’()\\-]", "gu")

export function sanitizeFor(value: string | null | undefined): string | null {
  if (!value) return null
  const cleaned = value
    .normalize("NFKC")
    .replace(DISALLOWED_FOR_CHARS, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60)
    .trim()
  return cleaned.length >= 2 ? cleaned : null
}
