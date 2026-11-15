"use client"

import dynamic from "next/dynamic"
import { LazyMount } from "@/components/demo/lazy-mount"

// Space reserved while the player loads = its measured height at each breakpoint (tabs wrap
// differently), so content below never moves, including during "scroll to" jumps from the CTAs.
const RESERVED = "min-h-[719px] sm:min-h-[677px] md:min-h-[622px] lg:min-h-[649px]"

const Inner = dynamic(() => import("./showcase-inner"), { ssr: false })

export function ClinicsShowcase() {
  return (
    <LazyMount className={RESERVED}>
      <Inner />
    </LazyMount>
  )
}
