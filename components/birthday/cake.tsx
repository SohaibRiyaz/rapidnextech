"use client"

import { useEffect, useRef, useState } from "react"
import type { BirthdayContent } from "@/content/birthdays/types"
import { getAudioContext, playHappyBirthday, playWhoosh, unlockAudio } from "./audio"
import { useBirthday, useInView, vibrate } from "./context"
import s from "./birthday.module.css"

type MicState = "off" | "starting" | "listening" | "blocked"

const SPRINKLES = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 37) % 96 + 2,
  top: (i * 53) % 70 + 10,
  rot: (i * 47) % 180,
  color: ["#ff2e93", "#ffd86b", "#59d8ff", "#ffffff", "#b66dff"][i % 5],
}))

function Candle({ digit, lit, onBlow }: { digit: string; lit: boolean; onBlow: () => void }) {
  return (
    <button
      type="button"
      onClick={onBlow}
      disabled={!lit}
      aria-label={lit ? `Blow out candle ${digit}` : `Candle ${digit} is out`}
      className="relative flex flex-col items-center disabled:cursor-default"
    >
      <span className="relative mb-1 block h-4 w-[3px] rounded bg-[#3a2a1a]">
        {lit ? <span className={s.flame} /> : <span className={`${s.flame} ${s.flameOut}`} />}
        {!lit
          ? [0, 1, 2].map((i) => (
              <span
                key={i}
                className={s.smoke}
                style={{ animationDelay: `${i * 0.25}s`, ["--drift" as string]: `${(i - 1) * 16}px` }}
              />
            ))
          : null}
      </span>
      <span
        className="block font-[family-name:var(--bd-display)] text-[clamp(5.5rem,26vw,8.5rem)] leading-[0.85]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #fff 0 10px, #ff8ac6 10px 20px), linear-gradient(#fff,#fff)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextStroke: "2px rgba(255,46,147,0.85)",
          filter: lit ? "drop-shadow(0 0 18px rgba(255,190,70,0.55))" : "none",
        }}
      >
        {digit}
      </span>
    </button>
  )
}

export function Cake({ data }: { data: BirthdayContent }) {
  const digits = data.showAge ? String(data.age).split("") : ["🕯", "🕯"]
  const [lit, setLit] = useState<boolean[]>(digits.map(() => true))
  const [mic, setMic] = useState<MicState>("off")
  const [level, setLevel] = useState(0)
  const [done, setDone] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef(0)
  const cakeRef = useRef<HTMLDivElement>(null)
  const [sectionRef] = useInView<HTMLElement>(0.2)
  const { getFx, reduced } = useBirthday()

  function stopMic() {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }
  useEffect(() => stopMic, [])

  const litRef = useRef(lit)
  litRef.current = lit

  function blow(index: number) {
    if (!litRef.current[index]) return
    const next = litRef.current.map((v, j) => (j === index ? false : v))
    litRef.current = next
    setLit(next)
    playWhoosh()
    vibrate(80, reduced)
  }

  function blowNext() {
    const i = litRef.current.indexOf(true)
    if (i !== -1) blow(i)
  }

  // All candles out: melody, fireworks, wish locked in.
  useEffect(() => {
    if (done || lit.some(Boolean)) return
    setDone(true)
    stopMic()
    setMic((m) => (m === "listening" ? "off" : m))
    vibrate([60, 60, 200], reduced)
    playHappyBirthday()
    void getFx().then((fx) => {
      if (!fx) return
      const r = cakeRef.current?.getBoundingClientRect()
      const cx = r ? r.left + r.width / 2 : window.innerWidth / 2
      const cy = r ? r.top + r.height * 0.3 : window.innerHeight / 3
      fx.confettiBurst(cx, cy, 60, 520)
      for (let i = 0; i < 6; i++) setTimeout(() => fx.firework(), i * 380)
    })
  }, [lit, done, getFx, reduced])

  async function startMic() {
    unlockAudio()
    setMic("starting")
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported")
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      streamRef.current = stream
      const ctx = getAudioContext()
      if (!ctx) throw new Error("no audio context")
      const src = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      src.connect(analyser)
      const buf = new Uint8Array(analyser.frequencyBinCount)
      setMic("listening")
      let strongFrames = 0
      let cooldown = 0
      const loop = () => {
        analyser.getByteFrequencyData(buf)
        // Blowing is loud, broadband, low-frequency noise: average the lower part of the spectrum.
        let sum = 0
        const bins = Math.floor(buf.length * 0.25)
        for (let i = 1; i < bins; i++) sum += buf[i]
        const avg = sum / bins / 255
        setLevel(avg)
        if (cooldown > 0) cooldown--
        else if (avg > 0.42) {
          strongFrames++
          if (strongFrames > 8) {
            strongFrames = 0
            cooldown = 30
            blowNext()
          }
        } else strongFrames = Math.max(0, strongFrames - 1)
        rafRef.current = requestAnimationFrame(loop)
      }
      rafRef.current = requestAnimationFrame(loop)
    } catch {
      // Common in WhatsApp / Instagram in-app browsers: switch to tapping.
      stopMic()
      setMic("blocked")
    }
  }

  function relight() {
    setDone(false)
    setLit(digits.map(() => true))
  }

  return (
    <section ref={sectionRef} aria-labelledby="cake-title" className="relative z-10 px-5 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff8ac6]">The cake</p>
      <h2 id="cake-title" className="mt-2 font-[family-name:var(--bd-display)] text-[clamp(2.2rem,10vw,4rem)] uppercase leading-none">
        Make a wish…
      </h2>
      <p className="mx-auto mt-3 max-w-xs text-white/75">…then blow into your mic 🎤 (or tap to blow)</p>

      <div ref={cakeRef} className="relative mx-auto mt-10 w-full max-w-[22rem]">
        {/* candles */}
        <div className="relative z-10 flex items-end justify-center gap-3">
          {digits.map((d, i) => (
            <Candle
              key={i}
              digit={d}
              lit={lit[i]}
              onBlow={() => {
                unlockAudio()
                blow(i)
              }}
            />
          ))}
        </div>
        {/* cake */}
        <div className="relative -mt-2">
          <div className="relative mx-auto h-24 w-[78%] rounded-t-[1.4rem] bg-gradient-to-b from-[#ffd1e6] to-[#ff8ac6] shadow-inner">
            <div className="absolute inset-x-0 top-0 h-6 rounded-t-[1.4rem] bg-white" />
            {[8, 22, 38, 55, 70, 86].map((l, i) => (
              <div key={l} className="absolute top-4 w-4 rounded-b-full bg-white" style={{ left: `${l}%`, height: `${16 + (i % 3) * 9}px` }} />
            ))}
            {SPRINKLES.slice(0, 11).map((sp, i) => (
              <span key={i} className="absolute h-1 w-3 rounded-full" style={{ left: `${sp.left}%`, top: `${sp.top + 20}%`, background: sp.color, transform: `rotate(${sp.rot}deg)` }} />
            ))}
          </div>
          <div className="relative mx-auto h-28 w-[94%] rounded-t-[1.2rem] bg-gradient-to-b from-[#6b3df5] to-[#3a1d9e]">
            <div className="absolute inset-x-0 top-0 h-5 rounded-t-[1.2rem] bg-[#ffd86b]" />
            {[5, 18, 31, 47, 60, 76, 90].map((l, i) => (
              <div key={l} className="absolute top-3 w-5 rounded-b-full bg-[#ffd86b]" style={{ left: `${l}%`, height: `${14 + (i % 3) * 10}px` }} />
            ))}
            {SPRINKLES.slice(11).map((sp, i) => (
              <span key={i} className="absolute h-1 w-3 rounded-full" style={{ left: `${sp.left}%`, top: `${sp.top + 15}%`, background: sp.color, transform: `rotate(${sp.rot}deg)` }} />
            ))}
          </div>
          <div className="mx-auto h-4 w-full rounded-full bg-gradient-to-b from-[#f2f2f7] to-[#b9b9c8] shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-sm flex-col gap-3" aria-live="polite">
        {done ? (
          <>
            <p className={`font-[family-name:var(--bd-display)] text-4xl uppercase ${s.wishPop}`}>
              <span className={s.gold}>Wish locked in</span> ✨
            </p>
            <button type="button" onClick={relight} className="mx-auto min-h-[48px] rounded-full px-5 text-sm text-white/70 underline underline-offset-4">
              Relight the candles 🕯️
            </button>
          </>
        ) : (
          <>
            {mic !== "blocked" && mic !== "listening" ? (
              <button
                type="button"
                onClick={startMic}
                disabled={mic === "starting"}
                className="min-h-[52px] rounded-full border border-white/25 bg-white/10 px-6 font-semibold backdrop-blur active:scale-[0.98]"
              >
                {mic === "starting" ? "Asking for your mic…" : "Use mic 🎤"}
              </button>
            ) : null}
            {mic === "listening" ? (
              <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4">
                <p className="text-sm text-white/80">Listening… blow like it&apos;s your last candle 💨</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full origin-left rounded-full bg-gradient-to-r from-[#ffd86b] to-[#ff2e93]" style={{ transform: `scaleX(${Math.min(1, level * 2)})` }} />
                </div>
              </div>
            ) : null}
            {mic === "blocked" ? (
              <p className="text-sm text-white/70">Mic&apos;s blocked in this app, no stress. Tap to blow instead 👇</p>
            ) : null}
            <button
              type="button"
              onClick={() => {
                unlockAudio()
                blowNext()
              }}
              className={`min-h-[56px] rounded-full bg-gradient-to-r from-[#ff2e93] to-[#b66dff] px-6 text-lg font-bold shadow-[0_10px_30px_rgba(255,46,147,0.45)] active:scale-[0.98] ${mic === "blocked" ? s.acceptPulse : ""}`}
            >
              Tap to blow 💨
            </button>
          </>
        )}
      </div>
    </section>
  )
}
