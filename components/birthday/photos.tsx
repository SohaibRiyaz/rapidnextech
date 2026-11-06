"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react"
import { Volume2, VolumeX } from "lucide-react"
import type { BirthdayContent, BirthdayVideo, SquadPhoto } from "@/content/birthdays/types"
import { playShutter, playThud } from "./audio"
import { useBirthday, useInView } from "./context"
import s from "./birthday.module.css"

function SectionTitle({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return (
    <div className="mb-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#59d8ff]">{eyebrow}</p>
      <h2 id={id} className="mt-2 font-[family-name:var(--bd-display)] text-[clamp(2.2rem,10vw,4rem)] uppercase leading-[0.95]">
        {title}
      </h2>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Then vs Now slider                                                  */
/* ------------------------------------------------------------------ */

export function ThenNow({ data }: { data: BirthdayContent }) {
  const [pos, setPos] = useState(50)
  const boxRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const { then, now } = data.media

  function setFromClientX(x: number) {
    const r = boxRef.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)))
  }
  function onDown(e: PointerEvent<HTMLDivElement>) {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    setFromClientX(e.clientX)
  }
  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (dragging.current) setFromClientX(e.clientX)
  }
  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 20 : 5
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step))
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step))
    else if (e.key === "Home") setPos(0)
    else if (e.key === "End") setPos(100)
    else return
    e.preventDefault()
  }

  return (
    <section aria-labelledby="then-now-title" className="relative z-10 px-5 py-16">
      <SectionTitle eyebrow="Glow-up check" title="Then vs now" id="then-now-title" />
      <div
        ref={boxRef}
        className="relative mx-auto aspect-[4/5] w-full max-w-[24rem] select-none overflow-hidden rounded-[1.75rem] border border-white/15 shadow-[0_30px_80px_-25px_rgba(47,107,255,0.7)]"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        data-no-burst
      >
        <Image src={now.src} alt={`Now: ${now.alt}`} fill sizes="(max-width: 640px) 92vw, 384px" className="object-cover" style={{ objectPosition: now.objectPosition }} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={then.src} alt={`Then: ${then.alt}`} fill sizes="(max-width: 640px) 92vw, 384px" className="object-cover" style={{ objectPosition: then.objectPosition }} />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur">Then</span>
        <span className="absolute right-3 top-3 rounded-full bg-[#ffd86b] px-3 py-1 text-xs font-bold uppercase tracking-widest text-black">Now</span>
        <div className="pointer-events-none absolute inset-y-0 w-[3px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" style={{ left: `calc(${pos}% - 1.5px)` }} />
        <div
          role="slider"
          tabIndex={0}
          aria-label="Then and now comparison"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% then`}
          onKeyDown={onKey}
          className="absolute top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/50 text-lg font-bold backdrop-blur focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffd86b]"
          style={{ left: `${pos}%` }}
        >
          ⇆
        </div>
      </div>
      <p className="mt-4 text-center font-[family-name:var(--bd-hand)] text-2xl text-white/75">Drag to see the glow-up ✨</p>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Graduate polaroid                                                   */
/* ------------------------------------------------------------------ */

const STARS = [
  { l: "-4%", t: "8%", d: "0s" },
  { l: "92%", t: "4%", d: ".4s" },
  { l: "96%", t: "55%", d: ".8s" },
  { l: "-6%", t: "62%", d: "1.1s" },
  { l: "45%", t: "-5%", d: ".6s" },
  { l: "80%", t: "92%", d: "1.4s" },
]

export function Graduate({ data }: { data: BirthdayContent }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.45)
  const { getFx } = useBirthday()
  const g = data.media.graduate

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => {
      playThud()
      void getFx().then((fx) => {
        const r = ref.current?.getBoundingClientRect()
        if (fx && r) fx.sparkles(r.left + r.width * 0.7, r.top + r.height * 0.25, 30, 140)
      })
    }, 450)
    return () => clearTimeout(t)
  }, [inView, getFx, ref])

  return (
    <section aria-labelledby="grad-title" className="relative z-10 px-5 py-16">
      <SectionTitle eyebrow="Degree unlocked" title="The graduate" id="grad-title" />
      <div ref={ref} className="relative mx-auto w-full max-w-[20rem]">
        {STARS.map((st, i) => (
          <span key={i} className={`absolute z-20 text-2xl text-[#ffd86b] ${s.twinkle}`} style={{ left: st.l, top: st.t, animationDelay: st.d }} aria-hidden="true">
            ✦
          </span>
        ))}
        <figure className="rotate-[-3deg] rounded-sm bg-[#fbfaf5] p-3 pb-14 text-[#1d1a2e] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image src={g.src} alt={g.alt} fill sizes="(max-width: 640px) 80vw, 320px" className="object-cover" style={{ objectPosition: g.objectPosition }} />
          </div>
          <figcaption className="absolute inset-x-0 bottom-3 text-center font-[family-name:var(--bd-hand)] text-2xl">{g.caption} 🎓</figcaption>
        </figure>
        {inView ? (
          <div className={`absolute right-[-6%] top-[14%] z-10 rounded-lg border-4 border-[#ffd86b] px-3 py-1 font-[family-name:var(--bd-display)] text-3xl uppercase tracking-wide text-[#ffd86b] shadow-[0_0_25px_rgba(255,216,107,0.5)] ${s.stamp}`} style={{ animationDelay: ".45s", background: "rgba(7,4,26,0.55)" }}>
            Graduate 🎓
          </div>
        ) : null}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* OG Squad                                                            */
/* ------------------------------------------------------------------ */

const TILTS = [-3, 2.5, -2]

function SquadCard({ photo, index }: { photo: SquadPhoto; index: number }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.6)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (!inView) return
    setFlash(true)
    playShutter()
  }, [inView])

  const tilt = TILTS[index % TILTS.length]
  const style = { ["--tilt" as string]: `${tilt}deg`, ["--tilt-from" as string]: `${tilt * 4}deg` } as CSSProperties

  return (
    <div ref={ref} className="w-[84%] shrink-0 snap-center px-2 py-8 sm:w-[70%] md:w-auto md:shrink" data-squad-card>
      <div className={inView ? s.land : "opacity-0"} style={style}>
        <figure className="relative rounded-sm bg-[#fbfaf5] p-2.5 pb-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.75)]">
          {/* tape corners */}
          <span className="absolute -left-3 -top-2 z-10 h-6 w-16 -rotate-[30deg] bg-[#ffd86b]/70 shadow-sm" aria-hidden="true" />
          <span className="absolute -right-3 -top-2 z-10 h-6 w-16 rotate-[30deg] bg-[#ff8ac6]/70 shadow-sm" aria-hidden="true" />
          <div className="relative">
            <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 768px) 84vw, 33vw" className="block h-auto w-full" />
            <div className={`absolute z-10 flex flex-col items-center ${s.crown}`} style={{ left: `${photo.crown.x}%`, top: `${photo.crown.y}%` }}>
              <span className="mb-0.5 whitespace-nowrap rounded-full bg-[#ffd86b] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-black shadow">
                Birthday boy
              </span>
              <span className="text-3xl leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" role="img" aria-label="crown">
                👑
              </span>
            </div>
            {flash ? <span className={s.camFlash} onAnimationEnd={() => setFlash(false)} aria-hidden="true" /> : null}
          </div>
        </figure>
      </div>
    </div>
  )
}

export function OgSquad({ data }: { data: BirthdayContent }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const photos = data.media.squad

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-squad-card]"))
      const mid = track.scrollLeft + track.clientWidth / 2
      let best = 0
      cards.forEach((c, i) => {
        if (Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid) < Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - mid)) best = i
      })
      setActive(best)
    }
    track.addEventListener("scroll", onScroll, { passive: true })
    return () => track.removeEventListener("scroll", onScroll)
  }, [])

  function goTo(i: number) {
    const track = trackRef.current
    const card = track?.querySelectorAll<HTMLElement>("[data-squad-card]")[i]
    if (!track || !card) return
    // Scroll only the carousel (scrollIntoView would also move the page).
    track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior: "smooth" })
  }

  return (
    <section aria-labelledby="squad-title" className="relative z-10 py-16">
      <div className="px-5">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-[#ff8ac6]">Energy peak</p>
        <h2 id="squad-title" className="mt-2 text-center font-[family-name:var(--bd-display)] text-[clamp(2.4rem,11vw,4.5rem)] uppercase leading-[0.95]">
          The OG Squad<span className="block text-[0.55em] text-white/80">since day one</span>
        </h2>
      </div>
      <div
        ref={trackRef}
        className="relative mt-4 flex snap-x snap-mandatory items-center overflow-x-auto px-[8%] [scrollbar-width:none] md:mx-auto md:grid md:max-w-6xl md:grid-cols-3 md:gap-6 md:overflow-visible md:px-6 [&::-webkit-scrollbar]:hidden"
        aria-label="OG squad photos"
      >
        {photos.map((p, i) => (
          <SquadCard key={p.src} photo={p} index={i} />
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1 md:hidden">
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show photo ${i + 1}`}
            aria-current={active === i}
            className="flex h-12 w-12 items-center justify-center"
          >
            <span className={`block h-2.5 rounded-full transition-all ${active === i ? "w-7 bg-[#ffd86b]" : "w-2.5 bg-white/35"}`} />
          </button>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Memories: polaroid wall + video cards                               */
/* ------------------------------------------------------------------ */

function VideoCard({ video }: { video: BirthdayVideo }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.6, true)
  const vRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const { reduced } = useBirthday()

  useEffect(() => {
    const v = vRef.current
    if (!v) return
    if (inView) {
      if (!loaded) setLoaded(true)
      if (!reduced || !muted) void v.play().catch(() => {})
    } else v.pause()
  }, [inView, loaded, reduced, muted])

  function toggleSound() {
    const v = vRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (v.paused) void v.play().catch(() => {})
  }

  const small = video.size === "small"
  return (
    <div ref={ref} className={`mx-auto w-full ${small ? "max-w-[13rem]" : "max-w-[17rem]"}`}>
      <div className="rounded-[2.2rem] border-[6px] border-[#1c1a2b] bg-black p-1 shadow-[0_25px_60px_-15px_rgba(182,109,255,0.6)] ring-1 ring-white/20">
        <button
          type="button"
          onClick={toggleSound}
          className="relative block w-full overflow-hidden rounded-[1.7rem]"
          style={{ aspectRatio: `${video.width} / ${video.height}` }}
          aria-label={muted ? `Play ${video.title} with sound` : `Mute ${video.title}`}
        >
          <video
            ref={vRef}
            src={loaded ? video.src : undefined}
            poster={video.poster}
            muted={muted}
            playsInline
            loop
            preload="none"
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur">
            {muted ? <VolumeX className="h-5 w-5" aria-hidden="true" /> : <Volume2 className="h-5 w-5" aria-hidden="true" />}
          </span>
          {muted ? <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[0.7rem] font-semibold">Tap for sound 🔊</span> : null}
        </button>
      </div>
      <p className="mt-3 text-center font-[family-name:var(--bd-hand)] text-2xl">{video.title}</p>
    </div>
  )
}

function Polaroid({ photo, index }: { photo: BirthdayContent["media"]["gallery"][number]; index: number }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3)
  const tilt = index % 2 ? 4 : -5
  const style = { ["--tilt" as string]: `${tilt}deg`, ["--from-x" as string]: index % 2 ? "140px" : "-140px", animationDelay: `${index * 0.12}s` } as CSSProperties
  return (
    <div ref={ref} className={inView ? s.flyIn : "opacity-0"} style={style}>
      <figure className="relative rounded-sm bg-[#fbfaf5] p-2.5 pb-12 text-[#1d1a2e] shadow-[0_25px_50px_-15px_rgba(0,0,0,0.75)]">
        <div className="relative aspect-square overflow-hidden">
          <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 45vw, 260px" className="object-cover" style={{ objectPosition: photo.objectPosition }} />
        </div>
        <figcaption className="absolute inset-x-2 bottom-2 text-center font-[family-name:var(--bd-hand)] text-xl leading-tight">{photo.caption}</figcaption>
      </figure>
    </div>
  )
}

export function Memories({ data }: { data: BirthdayContent }) {
  const [throwback, ...rest] = data.media.videos
  return (
    <section aria-labelledby="memories-title" className="relative z-10 px-5 py-16">
      <SectionTitle eyebrow="Rewind" title="Memories" id="memories-title" />
      <div className="mx-auto grid max-w-md grid-cols-2 gap-5">
        {data.media.gallery.map((g, i) => (
          <div key={g.src} className="relative">
            <Polaroid photo={g} index={i} />
          </div>
        ))}
      </div>
      <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-12 md:flex-row md:items-start md:justify-center">
        {throwback ? <VideoCard video={throwback} /> : null}
        {rest.map((v) => (
          <VideoCard key={v.src} video={v} />
        ))}
      </div>
    </section>
  )
}
