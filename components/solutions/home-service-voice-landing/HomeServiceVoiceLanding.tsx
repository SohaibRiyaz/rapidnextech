"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Pause, Play } from "lucide-react"

const MARQUEE_TEXT =
  "AC REPAIR CALLS ✦ EMERGENCY PLUMBING ✦ ELECTRICAL FAULTS ✦ AFTER-HOURS JOBS ✦ WEEKEND EMERGENCIES ✦ PRICING QUESTIONS ✦ BOOKING REQUESTS ✦ DISPATCH COORDINATION ✦ NEW CUSTOMER CALLS ✦ QUOTE REQUESTS ✦ "

const TAGS: { label: string; size: "sm" | "md" | "lg" }[] = [
  { label: "AC repair", size: "lg" },
  { label: "Furnace replacement", size: "lg" },
  { label: "Emergency plumbing", size: "lg" },
  { label: "Drain cleaning", size: "md" },
  { label: "Electrical panel issues", size: "md" },
  { label: "Outlet installation", size: "sm" },
  { label: "Water heater replacement", size: "md" },
  { label: "After-hours emergency", size: "lg" },
  { label: "Weekend availability", size: "md" },
  { label: "New customer intake", size: "md" },
  { label: "Repeat customer recognition", size: "sm" },
  { label: "Quote requests", size: "sm" },
  { label: "Service area confirmation", size: "md" },
  { label: "Dispatch routing", size: "sm" },
]

const WAVEFORM_HEIGHTS = [12, 28, 18, 36, 22, 40, 16, 32, 20, 38, 14, 30, 24, 34, 18, 26]

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, visible }
}

function useCountUp(target: number, enabled: boolean, duration = 2200) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!enabled) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      setV(Math.round(target * p))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, enabled, duration])
  return v
}

function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`medspa-reveal ${visible ? "medspa-reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  )
}

function AudioDemoPlayer() {
  const [playing, setPlaying] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const total = 107 // 1:47

  const toggle = useCallback(() => {
    setPlaying((p) => {
      if (p) return false
      setSeconds(0)
      return true
    })
  }, [])

  useEffect(() => {
    if (!playing) return
    if (seconds >= total) {
      setPlaying(false)
      return
    }
    const id = window.setTimeout(() => setSeconds((s) => s + 1), 1000)
    return () => clearTimeout(id)
  }, [playing, seconds, total])

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const r = s % 60
    return `${m}:${r.toString().padStart(2, "0")}`
  }

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-[var(--medspa-accent-gold)] bg-[var(--medspa-bg-card)] p-8 md:p-10 medspa-card-trace">
      <p className="medspa-syne mb-8 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--medspa-text-secondary)]">
        Sample call — AC repair emergency — 10:47 PM
      </p>
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={toggle}
          className="medspa-cta-shimmer relative mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--medspa-accent-gold)] text-[var(--medspa-cta-text)] shadow-lg shadow-black/40 transition-transform hover:scale-105"
          aria-label={playing ? "Pause sample" : "Play sample"}
        >
          {playing ? <Pause className="h-9 w-9" strokeWidth={2} /> : <Play className="h-9 w-9 pl-1" strokeWidth={2} />}
        </button>
        <div className="mb-4 flex h-12 w-full max-w-xs items-end justify-center gap-[3px]">
          {WAVEFORM_HEIGHTS.map((h, i) => (
            <span
              key={i}
              className={`w-[5px] rounded-full bg-[var(--medspa-accent-gold)] transition-opacity duration-300 ${playing ? "animate-medspa-wave-pulse" : "opacity-[0.45]"}`}
              style={{
                height: `${h}px`,
                animationDelay: playing ? `${i * 0.04}s` : undefined,
              }}
            />
          ))}
        </div>
        <p className="medspa-syne mb-6 text-sm tabular-nums text-[var(--medspa-text-primary)]">
          {fmt(seconds)} / {fmt(total)}
        </p>
        <div className="text-left space-y-4">
          <p className="medspa-cormorant text-base italic leading-relaxed text-[var(--medspa-text-secondary)] md:text-lg">
            <span className="text-[var(--medspa-accent-gold)] not-italic font-semibold">AI:</span> &ldquo;Thank you for calling [Company Name] — I&apos;m your 24/7 virtual dispatcher. Are you calling about a repair or to schedule a service?&rdquo;
          </p>
          <p className="medspa-cormorant text-base italic leading-relaxed text-[var(--medspa-text-secondary)] md:text-lg">
            <span className="text-[var(--medspa-text-primary)] not-italic font-semibold">Customer:</span> &ldquo;Yeah my AC just stopped working, it&apos;s like 95 degrees in here.&rdquo;
          </p>
          <p className="medspa-cormorant text-base italic leading-relaxed text-[var(--medspa-text-secondary)] md:text-lg">
            <span className="text-[var(--medspa-accent-gold)] not-italic font-semibold">AI:</span> &ldquo;I&apos;m sorry to hear that — let&apos;s get someone out to you as soon as possible. Can I get your address and the best number to reach you?&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}

export function HomeServiceVoiceLanding() {
  const mathRef = useRef<HTMLDivElement | null>(null)
  const [mathTriggered, setMathTriggered] = useState(false)
  useEffect(() => {
    const el = mathRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMathTriggered(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const n40 = useCountUp(40, mathTriggered)
  const n68 = useCountUp(68, mathTriggered)
  const n1200 = useCountUp(1200, mathTriggered, 2600)

  const scrollToPricing = () => {
    document.getElementById("medspa-pricing")?.scrollIntoView({ behavior: "smooth" })
  }

  const headlineLines = useMemo(() => ["YOUR FRONT DESK", "JUST CALLED IN", "SICK. AGAIN."], [])

  return (
    <div
      role="main"
      className="medspa-voice-landing overflow-x-hidden bg-[var(--medspa-bg-primary)] text-[var(--medspa-text-primary)] antialiased"
    >
      {/* SECTION 1 — Opening */}
      <section
        className="medspa-hero-fold relative isolate box-border flex h-svh max-h-[100svh] flex-col overflow-hidden pt-[max(5rem,env(safe-area-inset-top,0px)+4.25rem)] pb-3 md:pt-[max(6.5rem,env(safe-area-inset-top,0px)+5.5rem)] md:pb-4"
        style={{ backgroundColor: "var(--medspa-bg-primary)" }}
      >
        <div className="pointer-events-none absolute inset-0 medspa-noise" />
        {/* Watermarks: sized to stay inside the fold; never clip "24/7" off-screen */}
        <div
          className="pointer-events-none absolute right-3 top-[max(5.5rem,env(safe-area-inset-top,0px)+4rem)] z-0 hidden select-none medspa-bebas text-[clamp(2.75rem,min(10vw,12svh),5.5rem)] leading-none text-[var(--medspa-text-muted)]/[0.1] md:block"
          aria-hidden
        >
          24/7
        </div>
        <div
          className="pointer-events-none absolute bottom-[max(7rem,env(safe-area-inset-bottom,0px)+5.25rem)] left-3 z-0 hidden select-none medspa-bebas text-[clamp(1.75rem,min(6vw,7svh),3.25rem)] leading-none text-[var(--medspa-accent-gold)]/[0.06] md:block"
          aria-hidden
        >
          CALLS
        </div>

        <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-6xl flex-1 flex-col px-5 md:px-10 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 max-w-xl shrink-0 leading-tight md:mb-7 lg:mb-9"
          >
            <p className="medspa-syne text-[9px] font-semibold uppercase tracking-[0.26em] text-[var(--medspa-text-secondary)] md:text-[10px]">
              AI Dispatcher & Call Answering for Home Service Contractors — US Market
            </p>
            <p className="medspa-syne mt-1 text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--medspa-text-muted)] md:mt-1.5 md:text-[10px]">
              Texas · Florida · California · Georgia · Arizona
            </p>
          </motion.div>

          <div className="flex min-h-0 flex-1 flex-col justify-center py-0.5 md:py-1">
            <div className="text-center">
              <div className="mx-auto flex w-full max-w-[min(100%,56rem)] flex-col items-center gap-y-1.5 py-2 md:max-w-[60rem] md:gap-y-2 md:py-3 lg:max-w-[64rem] lg:gap-y-2.5 lg:py-4">
                {headlineLines.map((line, li) => (
                  <div
                    key={li}
                    className="medspa-hero-line flex w-full items-center justify-center"
                    style={{
                      animation: `medspa-hero-line-in 0.58s cubic-bezier(0.22, 1, 0.36, 1) ${0.1 + li * 0.09}s forwards`,
                      opacity: 0,
                    }}
                  >
                    <span className="medspa-hero-line-text medspa-bebas text-center text-[var(--medspa-text-primary)]">
                      {line}
                    </span>
                  </div>
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.55 }}
                className="medspa-cormorant mx-auto mt-12 max-w-2xl text-base italic leading-snug text-[var(--medspa-text-secondary)] md:mt-14 md:text-[17px] md:leading-relaxed lg:mt-16"
              >
                We answer every call. We book every job. You run the crew.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.45 }}
                className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-12 md:gap-4 lg:mt-14"
              >
                <Link
                  href="/contact?topic=hvac-voice-demo"
                  className="medspa-cta-shimmer medspa-syne inline-flex min-h-[44px] min-w-[200px] items-center justify-center rounded-sm bg-[var(--medspa-cta-bg)] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--medspa-cta-text)] transition-transform hover:scale-[1.02] md:min-w-[220px] md:px-8 md:py-3 md:text-sm"
                >
                  Hear It Answer a Call →
                </Link>
                <button
                  type="button"
                  onClick={scrollToPricing}
                  className="medspa-syne inline-flex min-h-[44px] min-w-[160px] items-center justify-center rounded-sm border border-[var(--medspa-accent-gold)] bg-transparent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--medspa-accent-gold)] transition-colors hover:bg-[var(--medspa-accent-gold)] hover:text-[var(--medspa-cta-text)] md:min-w-[180px] md:px-8 md:py-3 md:text-sm"
                >
                  See Pricing
                </button>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.45 }}
            className="medspa-syne flex shrink-0 flex-col items-end gap-0.5 self-end pb-0.5 text-right text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--medspa-text-secondary)] md:gap-1 md:text-[9px] lg:text-[10px]"
          >
            <span>&lt; 2 Rings</span>
            <span>24·7·365</span>
            <span>$0 Missed Calls</span>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — Math */}
      <section
        ref={mathRef}
        className="relative z-10 bg-[var(--medspa-bg-secondary)] px-5 py-20 md:px-10 md:py-28 lg:px-16"
        style={{ clipPath: "polygon(0 4%, 100% 0, 100% 100%, 0 100%)" }}
      >
        <RevealSection>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 md:grid-cols-3 md:gap-8 lg:gap-12">
            <div className="text-center md:text-left">
              <p className="medspa-bebas text-[clamp(4rem,15vw,10rem)] leading-[1.06] text-[var(--medspa-accent-gold)]">
                {n40}%
              </p>
              <p className="medspa-syne mt-4 text-[14px] font-semibold uppercase tracking-[0.2em] text-[var(--medspa-text-secondary)]">
                Of service calls go unanswered
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="medspa-bebas text-[clamp(4rem,15vw,10rem)] leading-[1.06] text-[var(--medspa-accent-gold)]">
                {n68}%
              </p>
              <p className="medspa-syne mt-4 text-[14px] font-semibold uppercase tracking-[0.2em] text-[var(--medspa-text-secondary)]">
                Of missed callers don&apos;t leave a voicemail
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="medspa-bebas text-[clamp(4rem,15vw,10rem)] leading-[1.06] text-[var(--medspa-accent-gold)]">
                ${formatMoney(n1200)}
              </p>
              <p className="medspa-syne mt-4 text-[14px] font-semibold uppercase tracking-[0.2em] text-[var(--medspa-text-secondary)]">
                Average value of a missed job
              </p>
            </div>
          </div>
          <p className="medspa-cormorant mx-auto mt-16 max-w-3xl text-center text-xl italic text-[var(--medspa-text-primary)] md:text-[22px]">
            You already have the demand. You&apos;re just not answering it.
          </p>
        </RevealSection>
      </section>

      {/* SECTION 3 — Marquee (edge to edge) */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden bg-[var(--medspa-accent-gold)] py-0">
        <div className="flex min-h-[52px] items-center overflow-hidden py-2">
          <div className="flex w-max min-w-full shrink-0 animate-medspa-marquee whitespace-nowrap will-change-transform">
            <span className="medspa-bebas inline-block px-6 text-[20px] uppercase leading-normal tracking-wide text-[var(--medspa-cta-text)]">
              {MARQUEE_TEXT}
            </span>
            <span className="medspa-bebas inline-block px-6 text-[20px] uppercase leading-normal tracking-wide text-[var(--medspa-cta-text)]">
              {MARQUEE_TEXT}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4 — How it works */}
      <section className="bg-[var(--medspa-bg-primary)] px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <RevealSection className="mx-auto max-w-6xl">
          <h2 className="medspa-bebas text-center text-[clamp(2rem,5vw,3.25rem)] leading-[1.1] tracking-wide text-[var(--medspa-text-primary)]">
            From ring to booked. In under 3 minutes.
          </h2>
          <p className="medspa-cormorant mt-4 text-center text-lg italic text-[var(--medspa-text-secondary)] md:text-xl">
            No voicemail. No hold music. No missed revenue.
          </p>
          <div className="mt-14 hidden md:block">
            <div className="flex items-start justify-between gap-0">
              {[
                {
                  n: "01",
                  t: "Call comes in",
                  d: "Customer calls your company. Any time. Any day.",
                },
                {
                  n: "02",
                  t: "Answered in 2 rings",
                  d: "Your AI answers with your company name and a friendly, professional tone.",
                },
                {
                  n: "03",
                  t: "Job details captured",
                  d: "Service needed, address, urgency level, and customer contact — all collected automatically.",
                },
                {
                  n: "04",
                  t: "Job booked or routed",
                  d: "Either scheduled directly or an SMS with job details sent to your dispatcher instantly.",
                },
                {
                  n: "05",
                  t: "You get notified",
                  d: "Full call summary with customer name, address, job type, and urgency hits your phone in real time.",
                },
              ].map((step, i, arr) => (
                <div key={step.n} className="flex min-w-0 flex-1 items-start">
                  <div className="flex w-full flex-col items-center text-center">
                    <div className="relative z-[1] mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--medspa-accent-gold)] bg-[var(--medspa-bg-primary)] medspa-syne text-sm font-bold text-[var(--medspa-accent-gold)]">
                      {step.n}
                    </div>
                    <h3 className="medspa-bebas px-1 text-base uppercase leading-snug tracking-wide text-[var(--medspa-text-primary)] lg:text-lg">
                      {step.t}
                    </h3>
                    <p className="medspa-syne mt-3 px-1 text-xs leading-[1.65] text-[var(--medspa-text-secondary)] lg:text-sm lg:leading-[1.7]">
                      {step.d}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="relative flex h-10 shrink-0 flex-1 items-center px-1" aria-hidden>
                      <div className="h-px w-full bg-[var(--medspa-border)]" />
                      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--medspa-accent-gold)] ring-4 ring-[var(--medspa-bg-primary)]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 md:hidden">
            {[
              ["01", "Call comes in", "Customer calls your company. Any time. Any day."],
              ["02", "Answered in 2 rings", "Your AI answers with your company name and a friendly, professional tone."],
              ["03", "Job details captured", "Service needed, address, urgency level, and customer contact — all collected automatically."],
              ["04", "Job booked or routed", "Either scheduled directly or an SMS with job details sent to your dispatcher instantly."],
              ["05", "You get notified", "Full call summary with customer name, address, job type, and urgency hits your phone in real time."],
            ].map(([n, t, d]) => (
              <div
                key={n}
                className="min-w-[85vw] shrink-0 snap-center rounded-xl border border-[var(--medspa-border)] bg-[var(--medspa-bg-card)] p-6"
              >
                <span className="medspa-syne text-sm font-bold text-[var(--medspa-accent-gold)]">{n}</span>
                <h3 className="medspa-bebas mt-2 text-xl uppercase leading-snug tracking-wide">{t}</h3>
                <p className="medspa-syne mt-3 text-sm leading-[1.65] text-[var(--medspa-text-secondary)]">{d}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* SECTION 5 — Asymmetric grid + tags */}
      <section className="bg-[var(--medspa-bg-secondary)] px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <RevealSection className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <h2 className="medspa-bebas text-[clamp(2.5rem,6vw,4rem)] leading-[1.08] tracking-wide text-[var(--medspa-text-primary)]">
              It knows
              <br />
              your
              <br />
              trade.
            </h2>
            <p className="medspa-syne mt-8 max-w-md text-base leading-relaxed text-[var(--medspa-text-secondary)]">
              Before going live, we train the AI on your service area, job types, pricing ranges, and availability. It speaks your company&apos;s language from day one.
            </p>
          </div>
          <div className="flex flex-wrap content-start gap-3 lg:col-span-3">
            {TAGS.map((tag) => {
              const sizeCls =
                tag.size === "lg"
                  ? "min-h-[2.875rem] px-5 py-2.5 text-base"
                  : tag.size === "md"
                    ? "min-h-[2.5rem] px-4 py-2 text-sm"
                    : "min-h-[2.25rem] px-3 py-2 text-xs"
              return (
                <span
                  key={tag.label}
                  className={`medspa-syne inline-flex items-center justify-center rounded-full border border-[var(--medspa-accent-gold)] bg-transparent font-medium leading-normal text-[var(--medspa-accent-gold)] transition-all duration-300 hover:bg-[var(--medspa-accent-gold)] hover:text-[var(--medspa-cta-text)] ${sizeCls}`}
                >
                  {tag.label}
                </span>
              )
            })}
          </div>
        </RevealSection>
      </section>

      {/* SECTION 6 — Audio */}
      <section className="bg-[var(--medspa-bg-primary)] px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <RevealSection className="mx-auto max-w-3xl text-center">
          <h2 className="medspa-bebas text-[clamp(2rem,5vw,3rem)] leading-[1.1] tracking-wide">
            Hear it handle a real call.
          </h2>
          <p className="medspa-cormorant mx-auto mt-4 max-w-xl text-lg italic text-[var(--medspa-text-secondary)] md:text-xl">
            A customer calls about an AC breakdown at 10:47 PM on a Tuesday in July. Listen to how your AI dispatcher handles it.
          </p>
          <div className="mt-12">
            <AudioDemoPlayer />
          </div>
          <p className="medspa-syne mt-10 text-[14px] text-[var(--medspa-text-secondary)]">
            Sounds natural <span className="mx-2 text-[var(--medspa-accent-gold)]">✦</span> Handles objections{" "}
            <span className="mx-2 text-[var(--medspa-accent-gold)]">✦</span> Books the job
          </p>
          <Link
            href="/contact?topic=hvac-voice-demo"
            className="medspa-syne mt-8 inline-flex items-center justify-center rounded-sm border border-[var(--medspa-accent-gold)] px-8 py-3 text-sm font-semibold uppercase tracking-wider text-[var(--medspa-accent-gold)] transition-colors hover:bg-[var(--medspa-accent-gold)] hover:text-[var(--medspa-cta-text)]"
          >
            Get a Demo Built for Your Company →
          </Link>
        </RevealSection>
      </section>

      {/* SECTION 7 — ROI */}
      <RoiSection />

      {/* SECTION 8 — Pricing */}
      <section id="medspa-pricing" className="scroll-mt-24 bg-[var(--medspa-bg-primary)] px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <RevealSection className="mx-auto max-w-6xl">
          <h2 className="medspa-bebas text-center text-[clamp(2rem,5vw,3rem)] leading-[1.1] tracking-wide">
            Simple pricing. Serious ROI.
          </h2>
          <p className="medspa-cormorant mt-4 text-center text-lg italic text-[var(--medspa-text-secondary)] md:text-xl">
            Every plan includes setup, training, and a live demo before you pay.
          </p>
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$497 setup + $397/mo",
                sub: "Single location · Up to 300 calls/mo",
                feats: [
                  "24/7 call answering",
                  "Captures job type, address & customer details",
                  "SMS job summary to your dispatcher instantly",
                  "Handles your top 10 FAQs",
                  "1-week setup",
                ],
                popular: false,
              },
              {
                name: "Growth",
                price: "$997 setup + $597/mo",
                sub: "Single location · Up to 800 calls/mo",
                feats: [
                  "Everything in Starter, plus:",
                  "Direct calendar/scheduling integration",
                  "Custom voice and tone matching",
                  "CRM lead capture",
                  "After-hours emergency routing rules",
                  "Priority support",
                ],
                popular: true,
              },
              {
                name: "Pro",
                price: "$1,997 setup + $997/mo",
                sub: "Multi-location · Unlimited calls",
                feats: [
                  "Everything in Growth, plus:",
                  "Multi-location / multi-crew management",
                  "Outbound callback to missed calls",
                  "Full custom conversation design",
                  "Dedicated account manager",
                  "Monthly performance review",
                ],
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`medspa-card-trace relative flex flex-col rounded-2xl p-8 ${
                  plan.popular ? "border-[var(--medspa-accent-gold)] ring-1 ring-[var(--medspa-accent-gold)]" : ""
                }`}
              >
                {plan.popular && (
                  <span className="medspa-syne absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--medspa-accent-gold)] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--medspa-cta-text)]">
                    Most popular
                  </span>
                )}
                <h3 className="medspa-bebas text-2xl leading-snug tracking-wide text-[var(--medspa-text-primary)]">
                  {plan.name}
                </h3>
                <p className="medspa-syne mt-2 text-lg font-semibold text-[var(--medspa-accent-gold)]">{plan.price}</p>
                <p className="medspa-syne mt-1 text-sm text-[var(--medspa-text-secondary)]">{plan.sub}</p>
                <ul className="medspa-syne mt-6 flex flex-col gap-2.5 text-sm leading-[1.6] text-[var(--medspa-text-secondary)]">
                  {plan.feats.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-[var(--medspa-accent-gold)]">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </RevealSection>
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-12 w-screen">
          <div className="medspa-bebas bg-[var(--medspa-accent-gold)] py-5 text-center text-lg uppercase tracking-wide text-[var(--medspa-cta-text)] md:text-xl">
            Free first month — limited to next 10 contractors to sign up
          </div>
        </div>
      </section>

      {/* SECTION 9 — Objections */}
      <section className="bg-[var(--medspa-bg-secondary)] px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <RevealSection className="mx-auto max-w-5xl">
          <h2 className="medspa-bebas text-center text-[clamp(2rem,5vw,3rem)] leading-[1.1] tracking-wide">
            We&apos;ve heard every concern.
          </h2>
          <p className="medspa-cormorant mt-4 text-center text-lg italic text-[var(--medspa-text-secondary)] md:text-xl">
            Here&apos;s the truth.
          </p>
          <div className="mt-14 flex flex-col gap-0">
            {[
              {
                q: "Will customers know they're talking to AI?",
                a: "Some will, most won't. More importantly — they get answered immediately instead of hitting voicemail and calling your competitor. That's what wins the job.",
              },
              {
                q: "What if the AI can't answer a complex question?",
                a: "It only handles what you've approved. Anything outside its knowledge — it takes the customer's details and tells them your team will call back within minutes. No lost leads.",
              },
              {
                q: "We already have an office person who answers calls.",
                a: "Most of our clients do too. This handles overflow when they're busy, after-hours calls, weekend emergencies, and lunch breaks. Your office person focuses on running operations — not stuck on hold.",
              },
              {
                q: "How long does setup take?",
                a: "One week from contract to live. We do all the work. You approve the call flow before anything goes live.",
              },
              {
                q: "What if we don't like it?",
                a: "You hear it answer a test call before you pay a single dollar. If it's not right, you owe us nothing.",
              },
              {
                q: "How does it handle emergency calls?",
                a: "You define what counts as an emergency in setup. Those calls get flagged immediately — SMS alert to your phone with full details so you can call back within minutes. No emergency ever sits in a voicemail.",
              },
            ].map((row, i) => (
              <div
                key={row.q}
                className={`grid grid-cols-1 gap-6 border-t border-[var(--medspa-border)] py-10 md:grid-cols-2 md:gap-0 md:py-12 ${
                  i === 0 ? "border-t-0 pt-0 md:pt-0" : ""
                }`}
              >
                <div className="medspa-bebas pr-0 text-xl uppercase leading-snug tracking-wide text-[var(--medspa-accent-gold)] md:border-r md:border-[var(--medspa-accent-gold)] md:pr-10">
                  {row.q}
                </div>
                <div className="medspa-syne pl-0 text-base leading-[1.65] text-[var(--medspa-text-secondary)] md:pl-10">
                  → {row.a}
                </div>
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* SECTION 10 — Final CTA */}
      <section className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--medspa-accent-gold)] px-5 py-24 text-center md:px-10">
        <RevealSection className="max-w-3xl">
          <h2 className="medspa-bebas text-[clamp(2.5rem,8vw,5rem)] leading-[1.08] tracking-wide text-[var(--medspa-cta-text)]">
            Hear it answer
            <br />a call. Free.
            <br />
            No commitment.
          </h2>
          <p className="medspa-syne mx-auto mt-8 max-w-xl text-base leading-relaxed text-[var(--medspa-cta-text)]/90">
            We&apos;ll build a custom demo for your company. You hear it handle a real AC repair emergency call. You approve it. Then we talk price.
          </p>
          <Link
            href="/contact?topic=medspa-voice-demo"
            className="medspa-cta-shimmer medspa-syne mt-10 inline-flex items-center justify-center rounded-sm bg-[var(--medspa-bg-primary)] px-10 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-transform hover:scale-[1.02]"
          >
            Book your free demo call →
          </Link>
          <p className="medspa-syne mt-6 text-sm text-[var(--medspa-cta-text)]/70">
            10-minute call. No slides. No pitch deck. Just the AI doing its job.
          </p>
        </RevealSection>
      </section>
    </div>
  )
}

function RoiSection() {
  const [missed, setMissed] = useState(12)
  const [value, setValue] = useState(450)
  const monthly = Math.round(missed * 4.3 * value)
  const { ref, visible } = useReveal<HTMLElement>()

  return (
    <section className="bg-[var(--medspa-bg-card)] px-5 py-20 md:px-10 md:py-28 lg:px-16">
      <div ref={ref} className={`medspa-reveal mx-auto max-w-3xl text-center ${visible ? "medspa-reveal-visible" : ""}`}>
        <h2 className="medspa-bebas text-[clamp(2rem,5vw,3rem)] leading-[1.1] tracking-wide text-[var(--medspa-text-primary)]">
          What are missed calls actually costing you?
        </h2>
        <div className="medspa-syne mt-12 space-y-10 text-left md:mx-auto md:max-w-lg">
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-[var(--medspa-text-secondary)]">
              Calls missed per week
            </label>
            <input
              type="range"
              min={1}
              max={100}
              value={missed}
              onChange={(e) => setMissed(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--medspa-border)] accent-[var(--medspa-accent-gold)]"
            />
            <div className="mt-2 text-sm text-[var(--medspa-accent-gold)]">{missed}</div>
          </div>
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-[var(--medspa-text-secondary)]">
              Average job value ($)
            </label>
            <input
              type="number"
              min={1}
              value={value}
              onChange={(e) => setValue(Math.max(1, Number(e.target.value) || 0))}
              className="w-full rounded-md border border-[var(--medspa-border)] bg-[var(--medspa-bg-primary)] px-4 py-3 text-[var(--medspa-text-primary)] outline-none focus:border-[var(--medspa-accent-gold)]"
            />
          </div>
        </div>
        <p className="medspa-bebas mt-14 text-sm uppercase tracking-[0.3em] text-[var(--medspa-text-secondary)]">
          You&apos;re losing
        </p>
        <p className="medspa-bebas mt-2 text-[clamp(2.5rem,10vw,5rem)] leading-[1.06] text-[var(--medspa-accent-gold)]">
          ${formatMoney(monthly)} / month
        </p>
        <p className="medspa-syne mt-4 text-[var(--medspa-text-secondary)]">Our service starts at $397/month.</p>
        <Link
          href="/contact?topic=medspa-voice-demo"
          className="medspa-cta-shimmer medspa-syne mt-8 inline-flex items-center justify-center rounded-sm bg-[var(--medspa-cta-bg)] px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-[var(--medspa-cta-text)]"
        >
          Start recovering that revenue
        </Link>
      </div>
    </section>
  )
}
