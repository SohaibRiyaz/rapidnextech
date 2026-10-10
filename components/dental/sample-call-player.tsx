"use client"

import { Headphones } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { card } from "./styles"

/**
 * "Hear a sample call" block. Renders nothing until siteConfig.sampleCallUrl is set.
 * preload="none" so no audio is downloaded until the visitor presses play.
 */
export function SampleCallPlayer() {
  const src = siteConfig.sampleCallUrl
  if (!src) return null

  return (
    <div className={`${card} p-5`}>
      <div className="mb-3 flex items-center gap-3">
        <Headphones className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="font-semibold text-card-foreground">Hear a sample call</h3>
      </div>
      <audio controls preload="none" className="w-full" src={src}>
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}
