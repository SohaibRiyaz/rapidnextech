"use client"

import { CallShowcase } from "@/components/demo/call-showcase"
import { trackEvent } from "@/lib/analytics"
import { windowsScenarios } from "./windows-showcase-scenarios"

/** Loaded on demand by WindowsShowcase. */
export default function WindowsShowcaseInner() {
  return (
    <CallShowcase
      scenarios={windowsScenarios}
      label="Example call · fictional company"
      summaryChannel="email"
      onPlay={(scenario) => trackEvent("windows_showcase_play", { scenario, vertical: "windows" })}
      onComplete={(scenario) => trackEvent("windows_showcase_complete", { scenario, vertical: "windows" })}
    />
  )
}
