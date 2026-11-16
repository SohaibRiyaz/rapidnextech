import type { PhoneNumber } from "@/lib/site-config"

/**
 * HVAC homepage ("/") demo settings. Blocks tied to a null value are hidden or in placeholder mode.
 * The HVAC page never uses the dental agent.
 */

/** Retell agent for the HVAC browser demo + HVAC call summaries in /api/retell-webhook. null = not set up yet. */
export const HVAC_RETELL_AGENT_ID: string | null = null
/** Published version of that agent (pinned, like the dental demo). */
export const HVAC_RETELL_AGENT_VERSION: number | null = null
/** Demo phone line for the HVAC agent. null hides the phone card. */
export const HVAC_DEMO_PHONE: PhoneNumber | null = null

/** True until both the agent id and version are set: the voice demo shows its UI but never calls Retell. */
export const HVAC_DEMO_PLACEHOLDER = !(HVAC_RETELL_AGENT_ID && HVAC_RETELL_AGENT_VERSION)

export const HVAC_DEMO_PLACEHOLDER_MESSAGE =
  "The live voice demo opens soon. Meanwhile, watch the example calls above or start your free pilot."

export const HVAC_FIELD_SOFTWARE = ["ServiceTitan", "Housecall Pro", "Jobber", "FieldEdge"] as const
