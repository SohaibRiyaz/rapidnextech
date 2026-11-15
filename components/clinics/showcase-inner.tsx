"use client"

import { CallShowcase } from "@/components/demo/call-showcase"
import { trackEvent } from "@/lib/analytics"
import { SUMMARY_CHANNEL } from "@/lib/clinics-config"
import { clinicScenarios } from "./showcase-scenarios"

/** Loaded on demand by ClinicsShowcase (scenarios + player stay out of the page's first load). */
export default function ClinicsShowcaseInner() {
  return (
    <CallShowcase
      scenarios={clinicScenarios}
      label="Example call · fictional clinic"
      summaryChannel={SUMMARY_CHANNEL}
      onPlay={(scenario) => trackEvent("clinics_showcase_play", { scenario })}
      onComplete={(scenario) => trackEvent("clinics_showcase_complete", { scenario })}
    />
  )
}
