"use client"

import dynamic from "next/dynamic"
import { LazyMount } from "@/components/demo/lazy-mount"

// Space reserved while the player loads = its measured height per breakpoint, so nothing below moves.
const RESERVED = "min-h-[719px] sm:min-h-[677px] md:min-h-[622px] lg:min-h-[649px]"

const Inner = dynamic(() => import("./windows-showcase-inner"), { ssr: false })

export function WindowsShowcase() {
  return (
    <LazyMount className={RESERVED}>
      <Inner />
    </LazyMount>
  )
}
