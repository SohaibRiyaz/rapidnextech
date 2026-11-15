"use client"

import dynamic from "next/dynamic"
import { LazyMount } from "@/components/demo/lazy-mount"

// Space reserved while the player loads (tabs + controls + one panel on mobile; three panels from md).
const MIN_HEIGHT = "38rem"

const Inner = dynamic(() => import("./showcase-inner"), {
  ssr: false,
  loading: () => <div style={{ minHeight: MIN_HEIGHT }} aria-busy="true" />,
})

export function ClinicsShowcase() {
  return (
    <LazyMount minHeight={MIN_HEIGHT}>
      <Inner />
    </LazyMount>
  )
}
