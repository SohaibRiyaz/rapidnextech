"use client"

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { Check, ClipboardList, Languages, Mail, MessageCircle, Pause, PhoneCall, Play, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { lineEnd, type ShowcaseScenario } from "./call-showcase-types"

/**
 * "Watch a real call": an example call played back as three synchronised panels
 * (the call → what the AI captured → what the team receives), driven by one timeline.
 *
 * Reusable: everything page-specific comes in through props (scenarios, label, analytics callbacks),
 * so other pages (e.g. the HVAC homepage) can use it with their own scenario files.
 *
 * - Nothing plays until Play is pressed. With an `audioUrl`, the timeline follows the audio's currentTime.
 * - prefers-reduced-motion: the finished call is shown straight away, without typing or auto-advance.
 * - Below 768px the panels become a swipeable stepper that follows the timeline until the visitor swipes.
 */

export type CallShowcaseProps = {
  scenarios: ShowcaseScenario[]
  /** Small label above the player, e.g. "Example call · fictional clinic". */
  label?: string
  /** Style of the third panel. */
  summaryChannel?: "email" | "whatsapp"
  panelTitles?: [string, string, string]
  /** Called when a scenario starts playing from the beginning. */
  onPlay?: (scenarioId: string) => void
  /** Called when a scenario reaches its end. */
  onComplete?: (scenarioId: string) => void
}

const DEFAULT_TITLES: [string, string, string] = ["The call", "What the AI captured", "What your team receives"]
const STEP_LABELS = ["Call", "Captured", "Received"]

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return reduced
}

export function CallShowcase({
  scenarios,
  label,
  summaryChannel = "email",
  panelTitles = DEFAULT_TITLES,
  onPlay,
  onComplete,
}: CallShowcaseProps) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [showEnglish, setShowEnglish] = useState(false)
  const [step, setStep] = useState(0)
  const [userSteered, setUserSteered] = useState(false)

  const scenario = scenarios[active]
  const tRef = useRef(0)
  const completedRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const callbacks = useRef({ onPlay, onComplete })
  callbacks.current = { onPlay, onComplete }

  // Reduced motion: always the finished state.
  const time = reduced ? scenario.duration : t
  const started = reduced || t > 0 || playing
  const finished = time >= scenario.duration
  const lastLine = scenario.lines[scenario.lines.length - 1]
  const callOver = time >= lineEnd(lastLine, scenario.typingCps) + 0.4
  const summaryShown = time >= scenario.summary.at
  const autoStep = summaryShown ? 2 : callOver ? 1 : 0
  const hasTranslations = scenario.lines.some((l) => l.translation)

  // One timeline: the audio's currentTime when there is audio, otherwise a timer.
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const audio = audioRef.current
      let next =
        scenario.audioUrl && audio
          ? audio.ended
            ? scenario.duration
            : audio.currentTime
          : tRef.current + (now - last) / 1000
      last = now
      if (next >= scenario.duration) {
        next = scenario.duration
        tRef.current = next
        setT(next)
        setPlaying(false)
        audio?.pause()
        if (!completedRef.current) {
          completedRef.current = true
          callbacks.current.onComplete?.(scenario.id)
        }
        return
      }
      tRef.current = next
      setT(next)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, scenario])

  // Keep the newest transcript line in view (scrolls the panel only, never the page).
  const visibleCount = scenario.lines.filter((l) => time >= l.at).length
  useEffect(() => {
    const el = transcriptRef.current
    if (el && !reduced) el.scrollTop = el.scrollHeight
  }, [visibleCount, t, reduced])

  // Mobile stepper follows the timeline until the visitor swipes or taps a step.
  useEffect(() => {
    if (userSteered || reduced) return
    goToStep(autoStep, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStep, userSteered, reduced])

  function goToStep(index: number, byUser: boolean) {
    if (byUser) setUserSteered(true)
    setStep(index)
    const track = trackRef.current
    const panel = track?.children[index] as HTMLElement | undefined
    if (!track || !panel || track.scrollWidth <= track.clientWidth) return // desktop grid: nothing to scroll
    track.scrollTo({ left: panel.offsetLeft - track.offsetLeft, behavior: reduced ? "auto" : "smooth" })
  }

  function onTrackScroll() {
    const track = trackRef.current
    if (!track || track.scrollWidth <= track.clientWidth) return
    const panels = Array.from(track.children) as HTMLElement[]
    const x = track.scrollLeft
    let nearest = 0
    panels.forEach((p, i) => {
      if (Math.abs(p.offsetLeft - track.offsetLeft - x) < Math.abs(panels[nearest].offsetLeft - track.offsetLeft - x)) nearest = i
    })
    setStep(nearest)
  }

  function reset() {
    audioRef.current?.pause()
    if (audioRef.current) audioRef.current.currentTime = 0
    tRef.current = 0
    completedRef.current = false
    setT(0)
    setPlaying(false)
    setUserSteered(false)
  }

  function play() {
    if (finished) reset()
    if (tRef.current === 0 || finished) callbacks.current.onPlay?.(scenario.id)
    setPlaying(true)
    void audioRef.current?.play().catch(() => {})
  }

  function pause() {
    setPlaying(false)
    audioRef.current?.pause()
  }

  function selectTab(index: number) {
    if (index === active) return
    reset()
    setActive(index)
    setShowEnglish(false)
    setStep(0)
    const track = trackRef.current
    if (track) track.scrollTo({ left: 0 })
  }

  function onTabKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const n = scenarios.length
    const next =
      e.key === "ArrowRight" ? (active + 1) % n : e.key === "ArrowLeft" ? (active - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1
    if (next < 0) return
    e.preventDefault()
    selectTab(next)
    tabRefs.current[next]?.focus()
  }

  const tabId = (i: number) => `showcase-tab-${scenarios[i].id}`
  const panelId = `showcase-panel-${scenario.id}`
  const filledCount = scenario.fields.filter((f) => time >= f.at).length

  return (
    <div className="mx-auto max-w-6xl">
      {label ? (
        <p className="mb-4 text-center">
          <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
            {label}
          </span>
        </p>
      ) : null}

      {/* Scenario tabs */}
      <div role="tablist" aria-label="Example calls" onKeyDown={onTabKeyDown} className="mb-5 flex flex-wrap justify-center gap-2">
        {scenarios.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            id={tabId(i)}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={panelId}
            tabIndex={i === active ? 0 : -1}
            onClick={() => selectTab(i)}
            className={cn(
              "min-h-[48px] rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              i === active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-card-foreground hover:border-primary/60",
            )}
          >
            {s.tabLabel}
          </button>
        ))}
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={tabId(active)}>
        {/* Controls */}
        <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
          {reduced ? (
            <p className="text-sm text-muted-foreground">Showing the whole example call.</p>
          ) : (
            <>
              <button
                type="button"
                onClick={playing ? pause : play}
                className="inline-flex min-h-[48px] min-w-[8.5rem] items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : finished ? <RotateCcw className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
                {playing ? "Pause" : finished ? "Replay" : t > 0 ? "Resume" : "Play"}
              </button>
              {started && !finished ? (
                <button
                  type="button"
                  onClick={() => {
                    reset()
                    callbacks.current.onPlay?.(scenario.id)
                    setPlaying(true)
                    void audioRef.current?.play().catch(() => {})
                  }}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-primary/70 bg-background/60 px-4 font-semibold text-foreground transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Replay
                </button>
              ) : null}
              <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted sm:w-48" aria-hidden="true">
                <div className="h-full origin-left rounded-full bg-primary" style={{ transform: `scaleX(${Math.min(1, time / scenario.duration)})` }} />
              </div>
            </>
          )}
        </div>
        {scenario.audioUrl ? <audio ref={audioRef} src={scenario.audioUrl} preload="none" /> : null}
        <p className="sr-only" aria-live="polite">
          {finished && !reduced ? "Example call finished. The summary has been sent to the team." : ""}
        </p>

        {/* Panels: swipeable track on mobile, 3 columns from md */}
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          onTouchMove={() => setUserSteered(true)}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-5 md:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {/* 1. The call */}
          <Panel
            index={1}
            icon={<PhoneCall className="h-4 w-4" aria-hidden="true" />}
            title={panelTitles[0]}
            action={
              hasTranslations ? (
                <button
                  type="button"
                  onClick={() => setShowEnglish((v) => !v)}
                  aria-pressed={showEnglish}
                  className="-my-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Languages className="h-4 w-4" aria-hidden="true" />
                  {showEnglish ? "Hide English" : "Show English"}
                </button>
              ) : null
            }
          >
            <div ref={transcriptRef} className="h-full space-y-3 overflow-y-auto p-4">
              {!started ? (
                <p className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                  Press Play to watch the call.
                </p>
              ) : (
                scenario.lines
                  .filter((l) => time >= l.at)
                  .map((line, i) => {
                    const lang = line.lang ?? scenario.language
                    const end = lineEnd(line, scenario.typingCps)
                    const typing = !reduced && time < end
                    const shown = typing ? line.text.slice(0, Math.max(1, Math.floor((time - line.at) * scenario.typingCps))) : line.text
                    const agent = line.speaker === "agent"
                    return (
                      <div key={i} className={cn("flex flex-col", agent ? "items-start" : "items-end")}>
                        <span className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                          {scenario.speakerLabels[line.speaker]}
                        </span>
                        <div
                          className={cn(
                            "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                            agent ? "rounded-tl-sm bg-primary/10 text-foreground" : "rounded-tr-sm bg-muted text-foreground",
                          )}
                        >
                          <p lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
                            <span aria-hidden={typing}>{shown}</span>
                            {typing ? <span className="sr-only">{line.text}</span> : null}
                          </p>
                          {showEnglish && line.translation && !typing ? (
                            <p lang="en" dir="ltr" className="mt-1.5 border-t border-border/60 pt-1.5 text-xs text-muted-foreground">
                              {line.translation}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    )
                  })
              )}
            </div>
          </Panel>

          {/* 2. What the AI captured */}
          <Panel
            index={2}
            icon={<ClipboardList className="h-4 w-4" aria-hidden="true" />}
            title={panelTitles[1]}
            action={
              <span className="text-xs font-medium text-muted-foreground">
                {filledCount}/{scenario.fields.length}
              </span>
            }
          >
            <dl className="h-full space-y-2 overflow-y-auto p-4">
              {scenario.fields.map((f) => {
                const filled = time >= f.at
                const fresh = filled && !reduced && time - f.at < 1.4
                return (
                  <div
                    key={f.key}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-xl border px-3 py-2.5 transition-colors duration-500",
                      fresh ? "border-primary/60 bg-primary/10" : "border-border bg-background",
                    )}
                  >
                    <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                    <dd className={cn("flex items-center gap-1.5 text-right text-sm font-semibold", filled ? "text-foreground" : "text-muted-foreground")}>
                      {filled ? (
                        <>
                          {f.value}
                          <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        </>
                      ) : (
                        <span aria-label="Not captured yet">—</span>
                      )}
                    </dd>
                  </div>
                )
              })}
            </dl>
          </Panel>

          {/* 3. What the team receives */}
          <Panel
            index={3}
            icon={summaryChannel === "whatsapp" ? <MessageCircle className="h-4 w-4" aria-hidden="true" /> : <Mail className="h-4 w-4" aria-hidden="true" />}
            title={panelTitles[2]}
          >
            <div className="h-full overflow-y-auto p-4">
              {summaryShown ? (
                summaryChannel === "whatsapp" ? (
                  <WhatsAppSummary scenario={scenario} />
                ) : (
                  <EmailSummary scenario={scenario} />
                )
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    {summaryChannel === "whatsapp" ? <MessageCircle className="h-5 w-5" aria-hidden="true" /> : <Mail className="h-5 w-5" aria-hidden="true" />}
                  </span>
                  <p>
                    {summaryChannel === "whatsapp" ? "A WhatsApp message" : "An email"} goes to your team when the call ends.
                  </p>
                </div>
              )}
            </div>
          </Panel>
        </div>

        {/* Mobile stepper */}
        <div className="mt-3 flex justify-center gap-1 md:hidden" aria-label="Panels">
          {STEP_LABELS.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => goToStep(i, true)}
              aria-current={step === i ? "step" : undefined}
              aria-label={`Show panel ${i + 1}: ${panelTitles[i]}`}
              className="flex min-h-[48px] flex-1 flex-col items-center justify-center gap-1.5 rounded-lg px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className={cn("h-2 rounded-full transition-all", step === i ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40")} aria-hidden="true" />
              <span className={cn("text-xs font-medium", step === i ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Panel({ index, icon, title, action, children }: { index: number; icon: ReactNode; title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section
      aria-label={title}
      className="flex w-full shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm md:w-auto"
    >
      <header className="flex min-h-[52px] items-center justify-between gap-2 border-b border-border px-4 py-2">
        <h4 className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary" aria-hidden="true">
            {index}
          </span>
          <span className="text-primary" aria-hidden="true">
            {icon}
          </span>
          {title}
        </h4>
        {action}
      </header>
      {/* Fixed height: nothing on the page moves while the call plays. */}
      <div className="h-[22rem] sm:h-[24rem] lg:h-[26rem]">{children}</div>
    </section>
  )
}

function UrgencyBadge({ scenario }: { scenario: ShowcaseScenario }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide",
        scenario.summary.urgent ? "bg-red-600 text-white" : "bg-muted text-foreground",
      )}
    >
      {scenario.summary.urgencyLabel}
    </span>
  )
}

function EmailSummary({ scenario }: { scenario: ShowcaseScenario }) {
  const { summary } = scenario
  return (
    <article
      aria-label="Example email summary"
      className={cn(
        "rounded-xl border bg-background text-sm shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-300",
        summary.urgent ? "border-red-600/60" : "border-border",
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
        <span className="flex items-center gap-2 font-semibold">
          <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
          New email
        </span>
        <UrgencyBadge scenario={scenario} />
      </div>
      <dl className="space-y-1 border-b border-border px-3 py-2.5 text-xs">
        <div className="flex gap-2">
          <dt className="w-14 shrink-0 text-muted-foreground">To</dt>
          <dd>{summary.to}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-14 shrink-0 text-muted-foreground">From</dt>
          <dd>{summary.from}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-14 shrink-0 text-muted-foreground">Subject</dt>
          <dd className="font-semibold">{summary.subject}</dd>
        </div>
      </dl>
      <div className="space-y-3 px-3 py-3">
        <dl className="space-y-1 text-xs">
          {scenario.fields.map((f) => (
            <div key={f.key} className="flex gap-2">
              <dt className="w-28 shrink-0 text-muted-foreground">{f.label}</dt>
              <dd className={cn("font-medium", f.key === "urgency" && summary.urgent ? "text-red-600 dark:text-red-400" : "")}>{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="leading-relaxed text-foreground">{summary.text}</p>
      </div>
    </article>
  )
}

function WhatsAppSummary({ scenario }: { scenario: ShowcaseScenario }) {
  const { summary } = scenario
  return (
    <article
      aria-label="Example WhatsApp summary"
      className="ml-auto max-w-[95%] rounded-2xl rounded-tr-sm bg-emerald-500/10 p-3 text-sm text-foreground shadow-sm motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-300"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-semibold">{summary.from}</span>
        <UrgencyBadge scenario={scenario} />
      </div>
      <p className="mb-2 font-semibold">{summary.subject}</p>
      <ul className="mb-2 space-y-0.5 text-xs">
        {scenario.fields.map((f) => (
          <li key={f.key}>
            <span className="text-muted-foreground">{f.label}:</span> <span className="font-medium">{f.value}</span>
          </li>
        ))}
      </ul>
      <p className="leading-relaxed">{summary.text}</p>
    </article>
  )
}
