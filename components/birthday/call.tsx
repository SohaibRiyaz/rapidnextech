"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Phone, PhoneOff } from "lucide-react"
import type { BirthdayContent } from "@/content/birthdays/types"
import { startRingtone, unlockAudio } from "./audio"
import { vibrate } from "./context"
import s from "./birthday.module.css"

/* ------------------------------------------------------------------ */
/* Countdown gate                                                      */
/* ------------------------------------------------------------------ */

export function CountdownGate({ data, onUnlock }: { data: BirthdayContent; onUnlock: () => void }) {
  const target = new Date(data.unlockAt).getTime()
  const [left, setLeft] = useState(() => Math.max(0, target - Date.now()))

  useEffect(() => {
    const id = setInterval(() => {
      const ms = Math.max(0, target - Date.now())
      setLeft(ms)
      if (ms === 0) {
        clearInterval(id)
        onUnlock()
      }
    }, 250)
    return () => clearInterval(id)
  }, [target, onUnlock])

  const total = Math.floor(left / 1000)
  const parts = [
    { label: "Days", value: Math.floor(total / 86400) },
    { label: "Hours", value: Math.floor((total % 86400) / 3600) },
    { label: "Mins", value: Math.floor((total % 3600) / 60) },
    { label: "Secs", value: total % 60 },
  ].filter((p, i) => i > 0 || p.value > 0)
  const first = data.displayName.split(" ")[0]

  return (
    <section className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] text-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#ffd86b]/80">Top secret</p>
      <h1 className="font-[family-name:var(--bd-display)] text-[clamp(2.2rem,11vw,4.5rem)] uppercase leading-[1.02]">
        Something&apos;s loading
        <br />
        <span className={s.gold}>for {first}…</span>
      </h1>
      <div className="mt-10 flex gap-3" role="timer" aria-live="off">
        {parts.map((p) => (
          <div
            key={p.label}
            className="flex w-[4.6rem] flex-col items-center rounded-2xl border border-white/15 bg-white/[0.06] py-3 shadow-[0_0_30px_rgba(255,46,147,0.15)] backdrop-blur"
          >
            <span className="font-[family-name:var(--bd-display)] text-4xl tabular-nums text-white">
              {String(p.value).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/60">{p.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-xs font-[family-name:var(--bd-hand)] text-2xl text-white/80">
        Keep your phone close. Someone&apos;s about to call. 📞
      </p>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Incoming call                                                       */
/* ------------------------------------------------------------------ */

export function IncomingCall({
  data,
  reduced,
  onAccept,
  toast,
}: {
  data: BirthdayContent
  reduced: boolean
  onAccept: () => void
  toast: (m: string) => void
}) {
  const [shaking, setShaking] = useState(false)
  const stopRing = useRef<(() => void) | null>(null)
  const vibeTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // First tap anywhere (not Accept) unlocks audio and starts the ringtone + vibration.
  function wake() {
    unlockAudio()
    if (!stopRing.current && !reduced) {
      stopRing.current = startRingtone()
      vibrate([400, 200, 400], reduced)
      vibeTimer.current = setInterval(() => vibrate([400, 200, 400], reduced), 2200)
    }
  }

  function stopAll() {
    stopRing.current?.()
    stopRing.current = null
    if (vibeTimer.current) clearInterval(vibeTimer.current)
    try {
      navigator.vibrate?.(0)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    // Some Android browsers allow vibration before a tap; harmless where they don't.
    vibrate([300, 150, 300], reduced)
    return stopAll
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function decline() {
    wake()
    if (!reduced) {
      setShaking(false)
      requestAnimationFrame(() => setShaking(true))
    }
    vibrate(120, reduced)
    toast("Nice try. Accept karo 😄")
  }

  function accept() {
    unlockAudio()
    stopAll()
    onAccept()
  }

  const mm = String(Math.floor(elapsed / 60)).padStart(1, "0")
  const ss = String(elapsed % 60).padStart(2, "0")

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center overflow-hidden ${shaking ? s.screenShake : ""}`}
      onPointerDown={wake}
      onAnimationEnd={() => setShaking(false)}
      role="dialog"
      aria-label={`Incoming call from Everyone who loves you`}
    >
      {/* Blurred photo backdrop, like iOS contact posters */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={data.media.hero.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover blur-2xl brightness-[0.45] saturate-150"
          style={{ objectPosition: data.media.hero.objectPosition }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70" />
      </div>

      <div
        className={`flex h-full w-full max-w-md flex-col items-center px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(3.5rem,calc(env(safe-area-inset-top)+2rem))] ${reduced ? "" : s.phoneShake}`}
      >
        <p className="text-sm font-medium tracking-wide text-white/75">Birthday line · calling… {mm}:{ss}</p>
        <h1 className="mt-3 text-center text-[clamp(2rem,9vw,2.6rem)] font-semibold leading-tight text-white">
          Everyone who loves you
        </h1>

        <div className="relative mt-10 h-44 w-44 sm:h-52 sm:w-52">
          <span className={s.ring} aria-hidden="true" />
          <span className={`${s.ring} ${s.ringDelay}`} aria-hidden="true" />
          <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-[#ffd86b]/80 shadow-[0_0_60px_rgba(255,216,107,0.35)]">
            <Image
              src={data.media.hero.src}
              alt={data.media.hero.alt}
              fill
              priority
              sizes="208px"
              className="object-cover"
              style={{ objectPosition: data.media.hero.objectPosition }}
            />
          </div>
        </div>

        <p className="mt-8 text-center text-base text-white/70">🎂 Incoming: something special for {data.displayName.split(" ")[0]}</p>

        <div className="mt-auto flex w-full items-end justify-between px-4">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={decline}
              aria-label="Decline"
              className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#ff3b30] text-white shadow-lg active:scale-95"
            >
              <PhoneOff className="h-8 w-8" aria-hidden="true" />
            </button>
            <span className="text-sm text-white/85">Decline</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={accept}
              aria-label="Accept"
              className={`flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#34c759] text-white shadow-lg active:scale-95 ${reduced ? "" : s.acceptPulse}`}
            >
              <Phone className="h-8 w-8" aria-hidden="true" />
            </button>
            <span className="text-sm text-white/85">Accept</span>
          </div>
        </div>
      </div>
    </div>
  )
}
