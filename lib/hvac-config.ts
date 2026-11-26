import type { PhoneNumber } from "@/lib/site-config"

/**
 * HVAC homepage ("/") demo settings. Blocks tied to a null value are hidden or in placeholder mode.
 * The HVAC page never uses the dental agent.
 */

/** Retell agent for the HVAC browser demo ("Grace") + HVAC call summaries in /api/retell-webhook. */
export const HVAC_RETELL_AGENT_ID: string | null = "agent_f242ab9c63812687b78b6d9d3c"
/** Published version of that agent (pinned, like the dental demo). */
export const HVAC_RETELL_AGENT_VERSION: number | null = 1
/** The receptionist's name, as the agent introduces itself. */
export const HVAC_AGENT_NAME = "Grace"
/** Demo phone line for the HVAC agent. null hides the phone card. */
export const HVAC_DEMO_PHONE: PhoneNumber | null = null

/** True until both the agent id and version are set: the voice demo shows its UI but never calls Retell. */
export const HVAC_DEMO_PLACEHOLDER = !(HVAC_RETELL_AGENT_ID && HVAC_RETELL_AGENT_VERSION != null)

export const HVAC_DEMO_PLACEHOLDER_MESSAGE =
  "The live voice demo opens soon. Meanwhile, watch the example calls above or start your free pilot."

export const HVAC_FIELD_SOFTWARE = ["ServiceTitan", "Housecall Pro", "Jobber", "FieldEdge"] as const
