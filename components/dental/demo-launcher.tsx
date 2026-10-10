"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Mic, Play } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import { siteConfig } from "@/lib/site-config"
import { primaryCta } from "./styles"

// The existing embed (same component, persona, iframe allow-list, origin check and transcript toggle
// as /solutions/never-miss-a-call). Loaded only after the visitor starts the demo.
const VoiceDemoEmbed = dynamic(
  () => import("@/components/solutions/shared/voice-demo-embed").then((m) => m.VoiceDemoEmbed),
  { ssr: false, loading: () => <div className="aspect-[4/5] w-full rounded-3xl bg-muted sm:aspect-[16/11] lg:aspect-[16/9]" /> },
)

export function DemoLauncher({ location }: { location: string }) {
  const [started, setStarted] = useState(false)

  if (started) {
    return (
      <VoiceDemoEmbed
        pageKey={siteConfig.voiceDemoPageKey}
        title="Talk to it in your browser"
        description="Ask what a new patient, a patient with a toothache, or someone with an insurance question would ask."
        targetId="live-demo-embed"
      />
    )
  }

  return (
    <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-5 rounded-3xl short:aspect-auto short:h-[clamp(300px,calc(100vh-340px),480px)] short:gap-4 border border-border bg-card p-6 text-center shadow-xl sm:aspect-[16/11] lg:aspect-[16/9]">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Mic className="h-8 w-8" aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-2xl font-semibold text-card-foreground">Talk to it in your browser</h3>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Play the role of a new patient or a patient with a toothache. No signup.
        </p>
      </div>
      <button
        type="button"
        className={primaryCta}
        onClick={() => {
          trackEvent("demo_start", { location })
          setStarted(true)
        }}
      >
        <Play className="h-4 w-4" aria-hidden="true" />
        Start the browser demo
      </button>
      <p className="text-xs text-muted-foreground">Your browser will ask for microphone permission. Use headphones for best results.</p>
    </div>
  )
}
