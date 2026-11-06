"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import type { BirthdayContent } from "@/content/birthdays/types"
import { playThud, unlockAudio } from "./audio"
import { useBirthday, useInView, vibrate } from "./context"
import s from "./birthday.module.css"

export function payTreatHref(data: BirthdayContent) {
  return `https://wa.me/${data.myWhatsApp}?text=${encodeURIComponent("Theek hai yaar, treat pakki! 🍕🎉")}`
}

/* ------------------------------------------------------------------ */
/* Treat invoice                                                       */
/* ------------------------------------------------------------------ */

const DODGE_LIMIT = 5

export function TreatInvoice({ data }: { data: BirthdayContent }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4)
  const zoneRef = useRef<HTMLDivElement>(null)
  const [tries, setTries] = useState(0)
  const [spot, setSpot] = useState({ x: 50, y: 50 })
  const [denied, setDenied] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const { reduced } = useBirthday()
  const invoiceNo = `#${data.unlockAt.slice(0, 10)}`

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => {
      playThud()
      vibrate(60, reduced)
    }, 600)
    return () => clearTimeout(t)
  }, [inView, reduced])

  function dodge() {
    if (denied) return
    const next = tries + 1
    setTries(next)
    if (next >= DODGE_LIMIT) {
      setDenied(true)
      setShakeKey((k) => k + 1)
      vibrate([80, 40, 80], reduced)
      return
    }
    // Jump to a random spot inside the zone, far enough from the current one.
    let x = 50
    let y = 50
    for (let i = 0; i < 6; i++) {
      x = 30 + Math.random() * 40
      y = 20 + Math.random() * 60
      if (Math.abs(x - spot.x) > 22 || Math.abs(y - spot.y) > 25) break
    }
    setSpot({ x, y })
  }

  function onPointerDown(e: PointerEvent<HTMLButtonElement>) {
    // Touch: jump away before the tap can land.
    if (e.pointerType !== "mouse") {
      e.preventDefault()
      dodge()
    }
  }

  return (
    <section aria-labelledby="invoice-title" className="relative z-10 px-5 py-16">
      <div ref={ref} className="relative mx-auto w-full max-w-md">
        <div className="relative overflow-hidden rounded-xl bg-[#fbfaf5] p-6 text-[#1d1a2e] shadow-[0_30px_70px_-20px_rgba(255,216,107,0.35)]">
          <div className="flex items-start justify-between gap-4 border-b-2 border-dashed border-[#1d1a2e]/20 pb-4">
            <div>
              <h2 id="invoice-title" className="font-[family-name:var(--bd-display)] text-3xl uppercase leading-none">Treat invoice</h2>
              <p className="mt-1 font-mono text-xs text-[#1d1a2e]/60">{invoiceNo}</p>
            </div>
            <span className="rounded bg-[#ff9f0a]/15 px-2 py-1 font-mono text-xs font-bold text-[#c25f00]">STATUS: PENDING</span>
          </div>

          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-[#1d1a2e]/55">Billed to</dt>
            <dd className="font-semibold">{data.displayName}</dd>
            <dt className="text-[#1d1a2e]/55">From</dt>
            <dd className="font-semibold">{data.fromLine}</dd>
            <dt className="text-[#1d1a2e]/55">Due</dt>
            <dd className="font-semibold">Immediately. Like, today.</dd>
          </dl>

          <table className="mt-5 w-full text-sm">
            <thead>
              <tr className="border-b border-[#1d1a2e]/15 text-left font-mono text-[0.7rem] uppercase text-[#1d1a2e]/55">
                <th className="py-2 font-normal">Item</th>
                <th className="py-2 text-right font-normal">Qty</th>
              </tr>
            </thead>
            <tbody>
              {data.treatItems.map((item, i) => (
                <tr key={item} className="border-b border-[#1d1a2e]/10">
                  <td className="py-2.5 pr-3">{item}</td>
                  <td className="py-2.5 text-right font-mono">{i === data.treatItems.length - 1 ? data.age : "∞"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5">
            <div className="flex justify-between font-mono text-xs text-[#1d1a2e]/60">
              <span>Payment progress</span>
              <span>0%</span>
            </div>
            <div className={`mt-1.5 h-3 overflow-hidden rounded-full bg-[#1d1a2e]/10 ${s.wobble}`}>
              <div className="h-full w-[2%] rounded-full bg-[#ff3b30]" />
            </div>
          </div>

          {inView ? (
            <div
              className={`pointer-events-none absolute right-4 top-[38%] rounded-md border-[5px] border-[#e5262a] px-4 py-1 font-[family-name:var(--bd-display)] text-4xl uppercase tracking-wider text-[#e5262a] opacity-90 mix-blend-multiply ${s.stamp}`}
              style={{ animationDelay: ".6s" }}
              aria-label="Overdue"
            >
              Overdue
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={payTreatHref(data)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[56px] items-center justify-center rounded-full bg-[#25d366] px-6 text-lg font-bold text-[#072b17] shadow-[0_10px_30px_rgba(37,211,102,0.4)] active:scale-[0.98]"
          >
            Pay treat 🍕
          </a>
          <div ref={zoneRef} key={shakeKey} className={`relative h-40 rounded-2xl border border-dashed border-white/15 ${denied && shakeKey ? s.shakeNo : ""}`} data-no-burst>
            {denied ? (
              <p className="absolute inset-0 flex items-center justify-center font-[family-name:var(--bd-display)] text-3xl uppercase text-[#ff453a]">
                Extension denied ❌
              </p>
            ) : (
              <button
                type="button"
                onPointerDown={onPointerDown}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") dodge()
                }}
                onClick={dodge}
                className="absolute min-h-[48px] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/30 bg-white/10 px-5 font-semibold transition-[left,top] duration-200 ease-out"
                style={{ left: `${spot.x}%`, top: `${spot.y}%`, touchAction: "none" }}
              >
                Ask for extension
              </button>
            )}
          </div>
          {!denied && tries > 0 ? (
            <p className="text-center text-sm text-white/60">Nice try ({tries}/{DODGE_LIMIT}) 😏</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Squad wishes (hidden when empty)                                    */
/* ------------------------------------------------------------------ */

export function SquadWishes({ data }: { data: BirthdayContent }) {
  if (!data.squadWishes.length) return null
  return (
    <section aria-labelledby="wishes-title" className="relative z-10 px-5 py-16">
      <h2 id="wishes-title" className="mb-8 text-center font-[family-name:var(--bd-display)] text-[clamp(2.2rem,10vw,4rem)] uppercase">
        From the squad
      </h2>
      <ul className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        {data.squadWishes.map((w, i) => (
          <li key={i} className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur">
            <p className="font-[family-name:var(--bd-hand)] text-2xl leading-snug">“{w.message}”</p>
            <p className="mt-3 text-sm font-semibold text-[#ffd86b]">— {w.name}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Finale                                                              */
/* ------------------------------------------------------------------ */

export function Finale({ data, onReplay }: { data: BirthdayContent; onReplay: () => void }) {
  const [ref, inView] = useInView<HTMLElement>(0.45, true)
  const { getFx, reduced, toast } = useBirthday()
  const first = data.displayName.split(" ")[0]

  useEffect(() => {
    if (!inView) return
    let stopped = false
    let n = 0
    const launch = async () => {
      const fx = await getFx()
      if (!fx || stopped) return
      fx.firework()
      if (!reduced) fx.firework()
      n++
      if (n < 14 && !stopped) setTimeout(launch, reduced ? 1400 : 700)
    }
    void launch()
    return () => {
      stopped = true
    }
  }, [inView, getFx, reduced])

  async function share() {
    unlockAudio()
    const url = `${window.location.origin}${window.location.pathname}`
    try {
      if (navigator.share) {
        await navigator.share({ title: data.share.title, text: data.share.description, url })
        return
      }
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return
    }
    try {
      await navigator.clipboard.writeText(url)
      toast("Link copied 🔗")
    } catch {
      toast(url)
    }
  }

  return (
    <section ref={ref} aria-labelledby="finale-title" className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 py-20 text-center">
      <h2 id="finale-title" className="font-[family-name:var(--bd-display)] text-[clamp(3rem,15vw,7rem)] uppercase leading-[0.92]">
        <span className={s.gold}>Happy Birthday,</span>
        <br />
        {first} 🎂
      </h2>
      <p className="mt-6 font-[family-name:var(--bd-hand)] text-3xl text-white/85">from {data.fromLine}</p>

      <div className="mt-12 flex w-full max-w-sm flex-col gap-3">
        <button
          type="button"
          onClick={onReplay}
          className="min-h-[56px] rounded-full bg-gradient-to-r from-[#ffd86b] to-[#e9a72c] px-6 text-lg font-bold text-[#1d1a2e] shadow-[0_10px_30px_rgba(255,216,107,0.35)] active:scale-[0.98]"
        >
          Replay the call 📞
        </button>
        <button type="button" onClick={share} className="min-h-[52px] rounded-full border border-white/25 bg-white/10 px-6 font-semibold backdrop-blur active:scale-[0.98]">
          Share 💌
        </button>
        <a
          href={payTreatHref(data)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[52px] items-center justify-center rounded-full bg-[#25d366] px-6 font-bold text-[#072b17] active:scale-[0.98]"
        >
          Pay treat 🍕
        </a>
      </div>

      <p className="mt-16 pb-[env(safe-area-inset-bottom)] text-xs text-white/45">Made with ❤️ by RapidNexTech</p>
    </section>
  )
}
