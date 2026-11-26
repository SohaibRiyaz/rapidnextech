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

/* ------------------------------------------------------------------ */
/* HVAC variant (homepage). Sent with vertical: "hvac". A submission   */
/* without a vertical is a dental one (above), exactly as before.      */
/* ------------------------------------------------------------------ */

export const HVAC_TRUCKS = ["1", "2–5", "6–10", "11–20", "20+"] as const
export const HVAC_PHONE_SYSTEMS = ["RingCentral", "Google Voice", "Grasshopper", "Nextiva", "Standard landline/cell", "Other", "Not sure"] as const
export const HVAC_FIELD_SOFTWARE_OPTIONS = ["ServiceTitan", "Housecall Pro", "Jobber", "FieldEdge", "None", "Other"] as const
export const HVAC_ANSWER_WHEN = ["After hours & weekends", "When nobody picks up", "Both", "Not sure"] as const

export const hvacPilotRequestSchema = z.object({
  companyName: trimmed("Company name", 120),
  ownerName: trimmed("Owner / decision-maker name", 120),
  email: z.string().trim().min(1, "Email is required").max(200).email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .max(40, "Phone is too long")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a valid phone number"),
  cityState: trimmed("Service area city / state", 120),
  trucks: optionalSelect(HVAC_TRUCKS),
  callsPerWeek: optionalSelect(CALLS_PER_WEEK),
  phoneSystem: optionalSelect(HVAC_PHONE_SYSTEMS),
  fieldSoftware: optionalSelect(HVAC_FIELD_SOFTWARE_OPTIONS),
  answerWhen: optionalSelect(HVAC_ANSWER_WHEN),
  planInterest: optionalSelect(PLAN_INTEREST),
  message: z.string().trim().max(2000, "Message is too long (2,000 characters max)").optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm you agree to be contacted" }) }),
})

export const hvacPilotSubmissionSchema = hvacPilotRequestSchema
  .merge(pilotMetaSchema)
  .extend({ vertical: z.literal("hvac") })

export type HvacPilotRequest = z.infer<typeof hvacPilotRequestSchema>
export type HvacPilotSubmission = z.infer<typeof hvacPilotSubmissionSchema>
export type HvacPilotFieldErrors = Partial<Record<keyof HvacPilotRequest, string>>

/* ------------------------------------------------------------------ */
/* Window & door company variant (/contact, and the windows demo).     */
/* Sent with vertical: "windows". No plan field: no windows pricing.   */
/* ------------------------------------------------------------------ */

export const WINDOWS_CREWS = ["1", "2–3", "4–6", "7–10", "10+"] as const
export const WINDOWS_PROJECT_FOCUS = ["Replacement windows", "Impact / hurricane windows", "Doors", "New construction", "A mix", "Other"] as const

export const windowsPilotRequestSchema = z.object({
  companyName: trimmed("Company name", 120),
  ownerName: trimmed("Owner / decision-maker name", 120),
  email: z.string().trim().min(1, "Email is required").max(200).email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .max(40, "Phone is too long")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a valid phone number"),
  cityState: trimmed("Service area city / state", 120),
  crews: optionalSelect(WINDOWS_CREWS),
  projectFocus: optionalSelect(WINDOWS_PROJECT_FOCUS),
  callsPerWeek: optionalSelect(CALLS_PER_WEEK),
  phoneSystem: optionalSelect(HVAC_PHONE_SYSTEMS),
  answerWhen: optionalSelect(HVAC_ANSWER_WHEN),
  message: z.string().trim().max(2000, "Message is too long (2,000 characters max)").optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm you agree to be contacted" }) }),
})

export const windowsPilotSubmissionSchema = windowsPilotRequestSchema
  .merge(pilotMetaSchema)
  .extend({ vertical: z.literal("windows") })

export type WindowsPilotSubmission = z.infer<typeof windowsPilotSubmissionSchema>

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const
