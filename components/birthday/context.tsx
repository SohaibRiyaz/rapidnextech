"use client"

import { createContext, useContext, useEffect, useRef, useState, type RefObject } from "react"
import type { ParticleEngine } from "./particles"

export type BirthdayCtx = {
  /** Lazily loads the canvas effects engine. */
  getFx: () => Promise<ParticleEngine | null>
  reduced: boolean
  soundOn: boolean
  toast: (message: string) => void
}

export const BirthdayContext = createContext<BirthdayCtx>({
  getFx: async () => null,
  reduced: false,
  soundOn: true,
  toast: () => {},
})

export const useBirthday = () => useContext(BirthdayContext)

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener?.("change", on)
    return () => mq.removeEventListener?.("change", on)
  }, [])
  return reduced
}

/** true once the element has been at least `threshold` visible (fires once unless `repeat`). */
export function useInView<T extends Element>(threshold = 0.35, repeat = false): [RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!("IntersectionObserver" in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (!repeat) io.disconnect()
        } else if (repeat) setInView(false)
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, repeat])
  return [ref, inView]
}

export function vibrate(pattern: number | number[], reduced: boolean) {
  if (reduced) return
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* unsupported (iOS) */
  }
}
