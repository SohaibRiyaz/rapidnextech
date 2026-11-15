"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/**
 * Renders `children` only once the placeholder is about to scroll into view, so below-the-fold
 * widgets (and their code, when `children` is a next/dynamic component) don't load with the page.
 * The placeholder keeps `minHeight`, so nothing below it jumps when the content arrives.
 */
export function LazyMount({ children, minHeight, rootMargin = "400px" }: { children: ReactNode; minHeight: string; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return (
    <div ref={ref} style={{ minHeight }}>
      {visible ? children : null}
    </div>
  )
}
