"use client"

import { CallShowcase } from "@/components/demo/call-showcase"
import { trackEvent } from "@/lib/analytics"
import { hvacScenarios } from "./hvac-showcase-scenarios"

/** Loaded on demand by HvacShowcase (scenarios + player stay out of the homepage's first load). */
export default function HvacShowcaseInner() {
  return (
    <CallShowcase
      scenarios={hvacScenarios}
      label="Example call · fictional company"
      summaryChannel="email"
      onPlay={(scenario) => trackEvent("hvac_showcase_play", { scenario })}
      onComplete={(scenario) => trackEvent("hvac_showcase_complete", { scenario })}
    />
  )
}
