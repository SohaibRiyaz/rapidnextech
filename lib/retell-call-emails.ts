import { z } from "zod"
import { HVAC_RETELL_AGENT_ID } from "@/lib/hvac-config"
import { getSiteOrigin } from "@/lib/site-url"
import { WINDOWS_DEMO_PATH, WINDOWS_RETELL_AGENT_ID } from "@/lib/windows-config"

/**
 * Emails built from a Retell call (used by /api/retell-webhook). Pure functions: no sending, no logging.
 *
 * - Owner email (to LEAD_NOTIFY_EMAIL): one per agent kind. The dental email is the original one,
 *   unchanged, except for a "Visitor email (demo lead)" row when the visitor left an email.
 * - Visitor email: a copy of the same summary for a demo visitor who asked for it (metadata.visitor_email),
 *   without internal rows (call ID, Pakistan time).
 */

type CustomAnalysis = {
  [key: string]: unknown
  call_summary?: unknown
}

export type RetellCall = {
  call_id?: string
  call_type?: string
  agent_id?: string
  start_timestamp?: number
  end_timestamp?: number
  metadata?: Record<string, unknown> | null
  call_analysis?: {
    call_summary?: string
    custom_analysis_data?: CustomAnalysis
  }
}

export type AgentKind = "dental" | "hvac" | "windows" | "generic"
type Row = [string, string]
export type BuiltEmail = { subject: string; html: string; text: string }

/** Shown for any HVAC / windows field the caller didn't give. */
const NOT_GIVEN = "not given"
/** Rows that stay in the owner (internal) email only. */
const INTERNAL_ROWS = new Set(["Call ID", "Time (Pakistan)"])
const VISITOR_ROW = "Visitor email (demo lead)"

export function agentKind(agentId: string | undefined, dentalId = process.env.NEXT_PUBLIC_RETELL_AGENT_ID): AgentKind {
  if (HVAC_RETELL_AGENT_ID && agentId === HVAC_RETELL_AGENT_ID) return "hvac"
  if (WINDOWS_RETELL_AGENT_ID && agentId === WINDOWS_RETELL_AGENT_ID) return "windows"
  // Keeps the original behaviour: before routing existed, every call was treated as dental.
  if (!dentalId || !agentId || agentId === dentalId) return "dental"
  return "generic"
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function formatIn(date: Date, timeZone: string) {
  // Explicit parts: dateStyle/timeStyle can't be combined with timeZoneName (throws a TypeError).
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date)
}

/** Analysis values can be strings, booleans or numbers; empty and "unknown"-style values become "". */
export function text(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (typeof value === "boolean") return value ? "Yes" : "No"
  const v = String(value).replace(/\s+/g, " ").trim()
  return /^(n\/?a|none|null|unknown|not provided)$/i.test(v) ? "" : v.slice(0, 1000)
}

function formatDuration(call: RetellCall) {
  if (!call.start_timestamp || !call.end_timestamp) return "—"
  const seconds = Math.max(0, Math.round((call.end_timestamp - call.start_timestamp) / 1000))
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`
}

function callRows(call: RetellCall): Row[] {
  const when = new Date(call.end_timestamp || Date.now())
  return [
    ["Call type", call.call_type === "web_call" ? "Web (browser demo)" : call.call_type === "phone_call" ? "Phone" : text(call.call_type) || "—"],
    ["Duration", formatDuration(call)],
    ["Call ID", text(call.call_id) || "—"],
    ["Time (New York)", formatIn(when, "America/New_York")],
    ["Time (Pakistan)", formatIn(when, "Asia/Karachi")],
  ]
}

function analysis(call: RetellCall) {
  const data = call.call_analysis?.custom_analysis_data ?? {}
  const summary = text(call.call_analysis?.call_summary) || text(data.call_summary)
  return { data, summary }
}

/** The visitor's email from the call metadata, if it's a valid address. Lower-cased, trimmed. */
const visitorEmailSchema = z.string().trim().toLowerCase().max(200).email()
export function visitorEmail(call: RetellCall): string | null {
  const parsed = visitorEmailSchema.safeParse(call.metadata?.visitor_email)
  return parsed.success ? parsed.data : null
}

/** True when there is nothing worth emailing (test calls, hang-ups, silence). */
export function isEmptyCall(call: RetellCall, kind: AgentKind): boolean {
  const { data, summary } = analysis(call)
  if (kind === "dental") return !text(data.patient_name) && !text(data.callback_number) && !text(data.reason)
  // HVAC, windows, generic: only a call with no summary and no captured field at all is skipped.
  return !summary && !Object.entries(data).some(([k, v]) => k !== "call_summary" && text(v))
}

/* ------------------------------------------------------------------ */
/* Per-agent content                                                   */
/* ------------------------------------------------------------------ */

type Parts = { heading: string; subject: string; summary: string; rows: Row[] }

/** Dental agent ("Maya"): the original demo-call email. */
function dentalParts(call: RetellCall): Parts {
  const { data, summary } = analysis(call)
  const name = text(data.patient_name)
  const reason = text(data.reason)
  const urgency = text(data.urgency).toUpperCase() || "UNKNOWN"
  return {
    heading: "Demo call summary",
    subject: `[Demo call] ${urgency} – ${name || "Unknown"} – ${reason || "No reason given"}`.slice(0, 200),
    summary,
    rows: [
      ["Urgency", urgency],
      ["Patient name", name || "—"],
      ["Callback number", text(data.callback_number) || "—"],
      ["New patient", text(data.new_patient) || "—"],
      ["Reason", reason || "—"],
      ["Insurance", text(data.insurance) || "—"],
      ["Preferred times", text(data.preferred_times) || "—"],
      ...callRows(call),
    ],
  }
}

/** HVAC agent ("Grace"): customer_name, callback_number, address, zip, system_type, issue, urgency, preferred_window, in_service_area. */
function hvacParts(call: RetellCall): Parts {
  const { data, summary } = analysis(call)
  const name = text(data.customer_name)
  const issue = text(data.issue)
  const urgency = text(data.urgency).toUpperCase() || "NOT GIVEN"
  return {
    heading: "HVAC call summary",
    subject: `[HVAC call] ${urgency} – ${name || "Name not given"} – ${issue || "Issue not given"}`.slice(0, 200),
    summary,
    rows: [
      ["Urgency", urgency],
      ["Customer name", name || NOT_GIVEN],
      ["Callback number", text(data.callback_number) || NOT_GIVEN],
      ["Address", text(data.address) || NOT_GIVEN],
      ["ZIP", text(data.zip) || NOT_GIVEN],
      ["In service area", text(data.in_service_area) || NOT_GIVEN],
      ["System type", text(data.system_type) || NOT_GIVEN],
      ["Issue", issue || NOT_GIVEN],
      ["Preferred window", text(data.preferred_window) || NOT_GIVEN],
      ...callRows(call),
    ],
  }
}

/**
 * Windows agent ("Emma"): customer_name, callback_number, address, zip, project_type, window_count, window_type,
 * timeline, preferred_visit_window, urgency, in_service_area.
 */
function windowsParts(call: RetellCall): Parts {
  const { data, summary } = analysis(call)
  const name = text(data.customer_name)
  const project = text(data.project_type)
  const urgency = text(data.urgency).toUpperCase() || "NOT GIVEN"
  return {
    heading: "Window & door call summary",
    subject: `[Windows call] ${urgency} – ${name || "Name not given"} – ${project || "Project not given"}`.slice(0, 200),
    summary,
    rows: [
      ["Urgency", urgency],
      ["Customer name", name || NOT_GIVEN],
      ["Callback number", text(data.callback_number) || NOT_GIVEN],
      ["Address", text(data.address) || NOT_GIVEN],
      ["ZIP", text(data.zip) || NOT_GIVEN],
      ["In service area", text(data.in_service_area) || NOT_GIVEN],
      ["Project type", project || NOT_GIVEN],
      ["Number of windows", text(data.window_count) || NOT_GIVEN],
      ["Window type", text(data.window_type) || NOT_GIVEN],
      ["Timeline", text(data.timeline) || NOT_GIVEN],
      ["Preferred visit window", text(data.preferred_visit_window) || NOT_GIVEN],
      ...callRows(call),
    ],
  }
}

/** Unknown agent: every non-empty analysis field, as-is. */
function genericParts(call: RetellCall): Parts {
  const { data, summary } = analysis(call)
  const fields: Row[] = Object.entries(data)
    .filter(([k]) => k !== "call_summary")
    .map(([k, v]) => [k.replace(/_/g, " "), text(v)] as Row)
    .filter(([, v]) => v)
    .slice(0, 40)
  return {
    heading: "Call summary",
    subject: `[Call] ${text(call.agent_id).slice(0, 40) || "Unknown agent"}`,
    summary,
    rows: [["Agent ID", text(call.agent_id) || "—"], ...fields, ...callRows(call)],
  }
}

function parts(call: RetellCall, kind: AgentKind): Parts {
  return kind === "hvac" ? hvacParts(call) : kind === "windows" ? windowsParts(call) : kind === "generic" ? genericParts(call) : dentalParts(call)
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

const NO_SUMMARY = "No summary was generated for this call."

function summaryBlockHtml(heading: string, summary: string, rows: Row[]) {
  return `<h2 style="margin:0 0 12px">${escapeHtml(heading)}</h2>
<p style="max-width:640px;line-height:1.5;white-space:pre-wrap">${escapeHtml(summary || NO_SUMMARY)}</p>
<table cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse;max-width:640px;width:100%">
${rows
  .map(
    ([k, v], i) =>
      `<tr style="background:${i % 2 ? "#ffffff" : "#f3f4f6"}"><td style="font-weight:bold;vertical-align:top;width:35%">${escapeHtml(
        k,
      )}</td><td style="vertical-align:top">${escapeHtml(v)}</td></tr>`,
  )
  .join("\n")}
</table>`
}

function summaryBlockText(heading: string, summary: string, rows: Row[]) {
  return [heading, "", summary || NO_SUMMARY, "", ...rows.map(([k, v]) => `${k}: ${v}`)]
}

/** Email to LEAD_NOTIFY_EMAIL. `visitor` adds the visitor's email as the first row (they're a lead). */
export function buildOwnerEmail(call: RetellCall, kind: AgentKind, visitor: string | null): BuiltEmail {
  const p = parts(call, kind)
  const rows: Row[] = visitor ? [[VISITOR_ROW, visitor], ...p.rows] : p.rows
  return {
    subject: p.subject,
    html: `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#111827">
${summaryBlockHtml(p.heading, p.summary, rows)}
</body></html>`,
    text: summaryBlockText(p.heading, p.summary, rows).join("\n"),
  }
}

const VISITOR_COPY: Record<Exclude<AgentKind, "generic">, { label: string; demoPath: string; pilotPath: string }> = {
  dental: { label: "Dental", demoPath: "/dental#try-it", pilotPath: "/dental#pilot" },
  hvac: { label: "HVAC", demoPath: "/#voice-demo", pilotPath: "/#pilot" },
  windows: { label: "Windows & Doors", demoPath: `${WINDOWS_DEMO_PATH}#voice-demo`, pilotPath: "/contact?vertical=windows" },
}

/** Copy of the summary for the demo visitor. null for agents without a public demo (generic). */
export function buildVisitorEmail(call: RetellCall, kind: AgentKind): BuiltEmail | null {
  if (kind === "generic") return null
  const copy = VISITOR_COPY[kind]
  const p = parts(call, kind)
  const rows = p.rows.filter(([k]) => !INTERNAL_ROWS.has(k))
  const origin = getSiteOrigin()
  const demoUrl = `${origin}${copy.demoPath}`
  const pilotUrl = `${origin}${copy.pilotPath}`
  const intro = "This is exactly what the business owner would receive after this call."
  const why = "You're receiving this because you asked for the summary of your demo call on rapidnextech.com. We won't add you to any list."

  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.5">
<div style="max-width:640px">
<p style="font-size:18px;font-weight:bold;color:#1d4ed8;margin:0 0 12px">RapidNexTech</p>
<p style="margin:0 0 20px">${escapeHtml(intro)}</p>
<div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px">
${summaryBlockHtml(p.heading, p.summary, rows)}
</div>
<p style="margin:24px 0 8px"><a href="${escapeHtml(demoUrl)}" style="color:#1d4ed8">Try the demo again</a> &nbsp;·&nbsp; <a href="${escapeHtml(
    pilotUrl,
  )}" style="color:#1d4ed8">Start a free pilot for your business</a></p>
<p style="color:#6b7280;font-size:12px;margin:16px 0 0">${escapeHtml(why)}</p>
</div></body></html>`

  const textBody = [
    "RapidNexTech",
    "",
    intro,
    "",
    ...summaryBlockText(p.heading, p.summary, rows),
    "",
    `Try the demo again: ${demoUrl}`,
    `Start a free pilot for your business: ${pilotUrl}`,
    "",
    why,
  ].join("\n")

  return { subject: `Your RapidNexTech demo call summary – ${copy.label}`, html, text: textBody }
}
