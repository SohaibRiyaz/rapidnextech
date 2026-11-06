"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react"
import type { BirthdayContent } from "@/content/birthdays/types"
import { playBoom, playConnect, playCrackle, playPop, setSoundEnabled, unlockAudio } from "./audio"
import { CountdownGate, IncomingCall } from "./call"
import { BirthdayContext, useReducedMotion, vibrate, type BirthdayCtx } from "./context"
import type { ParticleEngine } from "./particles"
import { KineticBands, Reveal } from "./reveal"
import { displayFont, handFont } from "./fonts"
import s from "./birthday.module.css"

// Everything after the reveal is split out, so the call screen loads fast on phones.
const Cake = dynamic(() => import("./cake").then((m) => m.Cake))
const ThenNow = dynamic(() => import("./photos").then((m) => m.ThenNow))
const Graduate = dynamic(() => import("./photos").then((m) => m.Graduate))
const OgSquad = dynamic(() => import("./photos").then((m) => m.OgSquad))
const Memories = dynamic(() => import("./photos").then((m) => m.Memories))
const TreatInvoice = dynamic(() => import("./finale").then((m) => m.TreatInvoice))
const SquadWishes = dynamic(() => import("./finale").then((m) => m.SquadWishes))
const Finale = dynamic(() => import("./finale").then((m) => m.Finale))

type Stage = "loading" | "gate" | "call" | "show"

export function BirthdayExperience({ data }: { data: BirthdayContent }) {
  const reduced = useReducedMotion()
  const [stage, setStage] = useState<Stage>("loading")
  const [soundOn, setSoundOn] = useState(true)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [flashKey, setFlashKey] = useState(0)
  const fxRef = useRef<ParticleEngine | null>(null)
  const fxLoading = useRef<Promise<ParticleEngine | null> | null>(null)
  const lastBurst = useRef(0)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  // Gate: before unlockAt show the countdown, unless ?preview=1.
  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get("preview") === "1"
    const locked = Date.now() < new Date(data.unlockAt).getTime()
    setStage(locked && !preview ? "gate" : "call")
  }, [data.unlockAt])

  // Reduced motion: no automatic sounds until the visitor turns sound on.
  useEffect(() => {
    if (reduced) {
      setSoundOn(false)
      setSoundEnabled(false)
    }
  }, [reduced])

  useEffect(() => () => fxRef.current?.destroy(), [])

  const getFx = useCallback(async () => {
    if (fxRef.current) return fxRef.current
    if (!fxLoading.current) {
      fxLoading.current = import("./particles")
        .then((m) => {
          fxRef.current = m.createParticleEngine(reduced, { onCrackle: playCrackle })
          return fxRef.current
        })
        .catch(() => null)
    }
    return fxLoading.current
  }, [reduced])

  const toast = useCallback((message: string) => {
    setToastMsg(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(null), 2600)
  }, [])

  const ctx = useMemo<BirthdayCtx>(() => ({ getFx, reduced, soundOn, toast }), [getFx, reduced, soundOn, toast])

  function accept() {
    setStage("show")
    window.scrollTo(0, 0)
    setFlashKey((k) => k + 1)
    playConnect()
    setTimeout(playBoom, 120)
    vibrate([40, 30, 120], reduced)
    void getFx().then((fx) => {
      if (!fx) return
      setTimeout(() => {
        fx.cannon("left")
        fx.cannon("right")
      }, 250)
      setTimeout(() => {
        fx.cannon("left", 60)
        fx.cannon("right", 60)
      }, 1300)
    })
  }

  function replay() {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
    setTimeout(() => setStage("call"), reduced ? 0 : 400)
  }

  function toggleSound() {
    unlockAudio()
    const next = !soundOn
    setSoundOn(next)
    setSoundEnabled(next)
  }

  // Tap anywhere that isn't a control: emoji + confetti burst (rate-limited).
  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (stage !== "show") return
    const target = e.target as HTMLElement
    if (target.closest("button, a, input, video, [role=slider], [data-no-burst]")) return
    const now = performance.now()
    if (now - lastBurst.current < 220) return
    lastBurst.current = now
    const { clientX, clientY } = e
    playPop()
    void getFx().then((fx) => fx?.emojiBurst(clientX, clientY))
  }

  return (
    <BirthdayContext.Provider value={ctx}>
      <div className={`${s.root} ${displayFont.variable} ${handFont.variable} font-sans`} onPointerDown={onPointerDown}>
        <div className={s.sky} aria-hidden="true" />
        <div className={s.stars} aria-hidden="true" />
        <div className={s.grain} aria-hidden="true" />

        {stage !== "loading" ? (
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
            className="fixed right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] z-[90] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-xl backdrop-blur active:scale-95"
          >
            <span aria-hidden="true">{soundOn ? "🔊" : "🔇"}</span>
          </button>
        ) : null}

        {stage === "loading" ? <div className="min-h-[100svh]" aria-busy="true" /> : null}
        {stage === "gate" ? <CountdownGate data={data} onUnlock={() => setStage("call")} /> : null}
        {stage === "call" ? <IncomingCall data={data} reduced={reduced} onAccept={accept} toast={toast} /> : null}

        {stage === "show" ? (
          <main className="relative">
            {flashKey && !reduced ? <div key={flashKey} className={s.flash} aria-hidden="true" /> : null}
            <Reveal data={data} />
            <KineticBands data={data} />
            <Cake data={data} />
            <ThenNow data={data} />
            <Graduate data={data} />
            <OgSquad data={data} />
            <Memories data={data} />
            <TreatInvoice data={data} />
            <SquadWishes data={data} />
            <Finale data={data} onReplay={replay} />
          </main>
        ) : null}

        <div
          className={`pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[95] flex justify-center px-4 transition-all duration-300 ${
            toastMsg ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          role="status"
          aria-live="polite"
        >
          {toastMsg ? (
            <span className="max-w-full break-words rounded-full bg-white px-5 py-3 text-center text-base font-semibold text-[#1d1a2e] shadow-2xl">{toastMsg}</span>
          ) : null}
        </div>
      </div>
    </BirthdayContext.Provider>
  )
}
