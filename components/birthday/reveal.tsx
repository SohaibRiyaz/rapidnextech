"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { BirthdayContent } from "@/content/birthdays/types"
import { useBirthday, useInView } from "./context"
import s from "./birthday.module.css"

export function ordinal(n: number) {
  const v = n % 100
  if (v >= 11 && v <= 13) return `${n}th`
  return `${n}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th"}`
}

function NicknameTicker({ names }: { names: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % names.length), 1700)
    return () => clearInterval(id)
  }, [names.length])
  return (
    <div className="mt-4 flex h-9 items-center justify-center overflow-hidden" aria-live="off">
      <span className="mr-2 text-sm uppercase tracking-[0.25em] text-white/50">a.k.a.</span>
      <span key={i} className={`${s.tickerItem} font-[family-name:var(--bd-hand)] text-3xl text-[#ff8ac6]`}>
        {names[i]}
      </span>
    </div>
  )
}

export function Reveal({ data }: { data: BirthdayContent }) {
  const photoRef = useRef<HTMLDivElement>(null)
  const { reduced } = useBirthday()
  const words = data.displayName.toUpperCase().split(" ")
  const first = data.displayName.split(" ")[0]
  let letterIndex = 0
  const totalLetters = data.displayName.replace(/\s/g, "").length
  const afterSlam = 0.35 + totalLetters * 0.07 + 0.4

  // Parallax: transform only, driven by scroll on rAF.
  useEffect(() => {
    if (reduced) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = photoRef.current
        if (el) el.style.transform = `translate3d(0, ${Math.min(window.scrollY, 900) * 0.18}px, 0) scale(1.05)`
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <section aria-labelledby="bd-name" className="relative z-10 flex min-h-[100svh] flex-col items-center px-5 pb-10 pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.5rem))] text-center">
      <h1 id="bd-name" className="font-[family-name:var(--bd-display)] uppercase leading-[0.92]" aria-label={data.displayName}>
        {words.map((word, wi) => (
          <span key={wi} className="block text-[clamp(3.6rem,19vw,9rem)]" aria-hidden="true">
            {word.split("").map((ch) => {
              const delay = 0.35 + letterIndex++ * 0.07
              return (
                <span key={`${wi}-${letterIndex}`} className={`${s.slamLetter}`} style={{ animationDelay: `${delay}s` }}>
                  <span className={s.gold}>{ch}</span>
                </span>
              )
            })}
          </span>
        ))}
      </h1>

      <div className={s.fadeUp} style={{ animationDelay: `${afterSlam}s` }}>
        <NicknameTicker names={data.nicknames} />
      </div>

      <div className={`relative mt-6 w-full max-w-[22rem] ${s.fadeUp}`} style={{ animationDelay: `${afterSlam + 0.2}s` }}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/15 shadow-[0_30px_80px_-20px_rgba(255,46,147,0.55)]">
          <div ref={photoRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.05)" }}>
            <Image
              src={data.media.hero.src}
              alt={data.media.hero.alt}
              fill
              priority
              sizes="(max-width: 640px) 90vw, 352px"
              className="object-cover"
              style={{ objectPosition: data.media.hero.objectPosition }}
            />
          </div>
          <div className={s.spotlight} aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#07041a] to-transparent" aria-hidden="true" />
        </div>
      </div>

      <p
        className={`mt-8 font-[family-name:var(--bd-display)] text-[clamp(2.4rem,12vw,5rem)] uppercase leading-none ${s.fadeUp}`}
        style={{ animationDelay: `${afterSlam + 0.45}s` }}
      >
        Happy {data.showAge ? <span className={s.gold}>{ordinal(data.age)}</span> : "birthday"}, {first}!
      </p>
      <p className={`mt-6 text-sm uppercase tracking-[0.3em] text-white/50 ${s.fadeUp}`} style={{ animationDelay: `${afterSlam + 0.8}s` }}>
        Scroll down ↓
      </p>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Kinetic marquee bands: speed and skew follow scroll velocity        */
/* ------------------------------------------------------------------ */

export function KineticBands({ data }: { data: BirthdayContent }) {
  const [wrapRef, inView] = useInView<HTMLDivElement>(0, true)
  const aRef = useRef<HTMLDivElement>(null)
  const bRef = useRef<HTMLDivElement>(null)
  const { reduced } = useBirthday()
  const first = data.displayName.split(" ")[0].toUpperCase()
  const phrase = `HAPPY BIRTHDAY ${first} ✦ ${data.showAge ? `${data.age} ✦ ` : ""}`
  const text = phrase.repeat(6)

  useEffect(() => {
    if (!inView || reduced) return
    let raf = 0
    let offset = 0
    let lastY = window.scrollY
    let vel = 0
    const loop = () => {
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      vel += (dy - vel) * 0.15
      offset += 1.2 + Math.abs(vel) * 0.9
      const a = aRef.current
      const b = bRef.current
      const w = a ? a.scrollWidth / 2 : 1000
      const skew = Math.max(-14, Math.min(14, vel * 0.6))
      if (a) a.style.transform = `translate3d(${-(offset % w)}px,0,0) skewX(${-skew}deg)`
      if (b) b.style.transform = `translate3d(${-w + (offset % w)}px,0,0) skewX(${skew}deg)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced])

  const band = "whitespace-nowrap font-[family-name:var(--bd-display)] text-[clamp(2.6rem,12vw,5.5rem)] leading-none py-3 will-change-transform"

  return (
    <div ref={wrapRef} className="relative z-10 my-10 overflow-hidden py-10" aria-hidden="true">
      <div className="-rotate-[5deg] bg-gradient-to-r from-[#ff2e93] via-[#b66dff] to-[#2f6bff] shadow-[0_0_40px_rgba(255,46,147,0.45)]">
        <div ref={aRef} className={`${band} text-white`}>
          {text}
        </div>
      </div>
      <div className="mt-4 rotate-[4deg] border-y border-[#ffd86b]/40 bg-[#0b0626]">
        <div ref={bRef} className={`${band} ${s.gold}`}>
          {text}
        </div>
      </div>
    </div>
  )
}
