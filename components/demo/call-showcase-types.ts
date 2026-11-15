/**
 * Scenario format for <CallShowcase>. Every time is in seconds from the start of the call.
 * Write scenarios with `buildScenario` (timings computed from text length) or with explicit `at`
 * values (e.g. to match a recording in `audioUrl`).
 */

export type ShowcaseSpeaker = "caller" | "agent"

export type ShowcaseLine = {
  /** When the line starts appearing. */
  at: number
  speaker: ShowcaseSpeaker
  text: string
  /** Language of `text`. "ar" lines are rendered right-to-left. Default: the scenario's language. */
  lang?: "en" | "ar"
  /** Optional English translation, shown by the "Show English" toggle. */
  translation?: string
}

export type ShowcaseField = {
  key: string
  label: string
  value: string
  /** When the value fills in (the moment it's mentioned). */
  at: number
}

export type ShowcaseSummary = {
  /** When the summary appears (after the last line). */
  at: number
  urgent: boolean
  /** e.g. "URGENT" or "Routine". Shown as a badge and at the start of the subject. */
  urgencyLabel: string
  to: string
  from: string
  subject: string
  /** 2–3 sentences. */
  text: string
}

export type ShowcaseScenario = {
  id: string
  /** Tab label, e.g. "Price question". */
  tabLabel: string
  language: "en" | "ar"
  /** Recording of the call. When set, the timeline follows the audio; otherwise it runs on a timer. */
  audioUrl: string | null
  speakerLabels: Record<ShowcaseSpeaker, string>
  /** Typing speed for the transcript, characters per second. */
  typingCps: number
  lines: ShowcaseLine[]
  /** Shown in this order on the "captured" card, empty until their `at`. */
  fields: ShowcaseField[]
  summary: ShowcaseSummary
  /** Total length; the timeline ends here. */
  duration: number
}

/* -------------------------------------------------------------------------------------------- */
/* Helper: build a scenario with timings computed from the text                                 */
/* -------------------------------------------------------------------------------------------- */

type DraftLine = Omit<ShowcaseLine, "at"> & {
  /** Fields whose value is mentioned in this line: they fill in when the line has finished typing. */
  fills?: string[]
}

type DraftScenario = Omit<ShowcaseScenario, "lines" | "fields" | "summary" | "duration" | "typingCps"> & {
  typingCps?: number
  /** Pause after each line, in seconds (reading time). */
  pause?: number
  lines: DraftLine[]
  fields: Omit<ShowcaseField, "at">[]
  summary: Omit<ShowcaseSummary, "at">
}

export function buildScenario(draft: DraftScenario): ShowcaseScenario {
  const cps = draft.typingCps ?? 40
  const pause = draft.pause ?? 1.1
  const filledAt: Record<string, number> = {}
  let t = 0.4
  const lines: ShowcaseLine[] = draft.lines.map(({ fills, ...line }) => {
    const at = t
    const typed = at + line.text.length / cps
    fills?.forEach((key) => (filledAt[key] = typed))
    t = typed + pause
    return { ...line, at }
  })
  const summaryAt = t + 1.4
  return {
    id: draft.id,
    tabLabel: draft.tabLabel,
    language: draft.language,
    audioUrl: draft.audioUrl,
    speakerLabels: draft.speakerLabels,
    typingCps: cps,
    lines,
    fields: draft.fields.map((f) => ({ ...f, at: filledAt[f.key] ?? summaryAt })),
    summary: { ...draft.summary, at: summaryAt },
    duration: summaryAt + 1.5,
  }
}

/** Seconds at which a line has finished typing. */
export function lineEnd(line: ShowcaseLine, cps: number) {
  return line.at + line.text.length / cps
}
