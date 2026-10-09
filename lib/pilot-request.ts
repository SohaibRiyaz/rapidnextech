import { z } from "zod"

// Shared by the pilot form (client) and /api/pilot-request (server).

export const CALLS_PER_WEEK = ["<10", "10–25", "25–50", "50+", "Not sure"] as const
export const PHONE_SYSTEMS = ["Weave", "RingCentral", "Mango Voice", "Vonage", "Standard landline", "Other", "Not sure"] as const
export const PRACTICE_SOFTWARE = ["Dentrix", "Eaglesoft", "Open Dental", "Curve", "Denticon", "Other", "Not sure"] as const
export const ANSWER_WHEN = ["After hours & weekends", "When nobody picks up", "Both", "Not sure yet"] as const
export const PLAN_INTEREST = ["After-Hours", "Full Coverage", "Multi-Location", "Not sure"] as const

/** Maps site-config plan ids (used in URLs / pricing CTAs) to the form's plan-interest option. */
export const PLAN_ID_TO_INTEREST: Record<string, (typeof PLAN_INTEREST)[number]> = {
  "after-hours": "After-Hours",
  "full-coverage": "Full Coverage",
  "multi-location": "Multi-Location",
}

const optionalSelect = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal("")]).optional().transform((v) => (v ? v : undefined))

const trimmed = (label: string, max: number) =>
  z
    .string({ required_error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} is too long`)

export const pilotRequestSchema = z.object({
  practiceName: trimmed("Practice name", 120),
  ownerName: trimmed("Owner / decision-maker name", 120),
  email: z.string().trim().min(1, "Email is required").max(200).email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .max(40, "Phone is too long")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a valid phone number"),
  cityState: trimmed("City / state", 120),
  callsPerWeek: optionalSelect(CALLS_PER_WEEK),
  phoneSystem: optionalSelect(PHONE_SYSTEMS),
  practiceSoftware: optionalSelect(PRACTICE_SOFTWARE),
  answerWhen: optionalSelect(ANSWER_WHEN),
  planInterest: optionalSelect(PLAN_INTEREST),
  message: z.string().trim().max(2000, "Message is too long (2,000 characters max)").optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm you agree to be contacted" }) }),
})

/** Non-field metadata sent alongside the form. Never shown to the user. */
export const pilotMetaSchema = z.object({
  website: z.string().optional().default(""), // honeypot: must stay empty
  startedAt: z.number().int().optional(),
  pageUrl: z.string().max(2000).optional().default(""),
  utm: z.record(z.string().max(300)).optional().default({}),
})

export const pilotSubmissionSchema = pilotRequestSchema.merge(pilotMetaSchema)

export type PilotRequest = z.infer<typeof pilotRequestSchema>
export type PilotSubmission = z.infer<typeof pilotSubmissionSchema>
export type PilotFieldErrors = Partial<Record<keyof PilotRequest, string>>

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const
