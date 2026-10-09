"use client"

import { useId, useState } from "react"
import { Calculator } from "lucide-react"
import { formatUsd, siteConfig } from "@/lib/site-config"
import { SectionHeading } from "./section-heading"
import { card, sectionY } from "./styles"

// Starting values are placeholders for the visitor to replace, not industry data.
const DEFAULTS = { missedPerWeek: "8", bookRate: "25", patientValue: "400" }
const WEEKS_PER_YEAR = 52

type FieldProps = {
  label: string
  hint: string
  value: string
  onChange: (v: string) => void
  min: number
  max: number
  step: number
  prefix?: string
  suffix?: string
}

function NumberField({ label, hint, value, onChange, min, max, step, prefix, suffix }: FieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
        {prefix ? <span className="pl-4 text-muted-foreground" aria-hidden="true">{prefix}</span> : null}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-describedby={hintId}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full min-w-0 rounded-xl bg-transparent px-3 text-base text-foreground focus:outline-none"
        />
        {suffix ? <span className="pr-4 text-muted-foreground" aria-hidden="true">{suffix}</span> : null}
      </div>
      <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">
        {hint}
      </p>
    </div>
  )
}

function clamp(raw: string, min: number, max: number) {
  const n = Number.parseFloat(raw)
  if (!Number.isFinite(n)) return 0
  return Math.min(max, Math.max(min, n))
}

export function RevenueCalculator() {
  const [missedPerWeek, setMissedPerWeek] = useState(DEFAULTS.missedPerWeek)
  const [bookRate, setBookRate] = useState(DEFAULTS.bookRate)
  const [patientValue, setPatientValue] = useState(DEFAULTS.patientValue)

  const yearly =
    clamp(missedPerWeek, 0, 1000) * WEEKS_PER_YEAR * (clamp(bookRate, 0, 100) / 100) * clamp(patientValue, 0, 100000)
  const monthly = yearly / 12
  const afterHours = siteConfig.pricing.plans.find((p) => p.id === "after-hours")

  return (
    <section id="calculator" aria-labelledby="calculator-title" className={sectionY}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          id="calculator-title"
          eyebrow="Missed-revenue calculator"
          title="What are unanswered calls costing your practice?"
          intro="Plug in your own numbers. The starting values are editable examples, not industry data."
        />

        <div className={`${card} mx-auto grid max-w-5xl gap-8 p-6 md:grid-cols-2 md:p-10`}>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()} aria-label="Calculator inputs">
            <NumberField
              label="Missed calls per week"
              hint="After hours, weekends and calls nobody picked up. Example value, change it."
              value={missedPerWeek}
              onChange={setMissedPerWeek}
              min={0}
              max={1000}
              step={1}
            />
            <NumberField
              label="% of those callers who would have booked"
              hint="Your estimate. Example value, change it."
              value={bookRate}
              onChange={setBookRate}
              min={0}
              max={100}
              step={1}
              suffix="%"
            />
            <NumberField
              label="Average new-patient value"
              hint="What a new patient is worth to your practice. Example value, change it."
              value={patientValue}
              onChange={setPatientValue}
              min={0}
              max={100000}
              step={50}
              prefix="$"
            />
          </form>

          <div className="flex flex-col justify-center rounded-2xl bg-muted/60 p-6 md:p-8">
            <Calculator className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Estimated revenue lost</p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                {formatUsd(Math.round(monthly))}
                <span className="text-lg font-medium text-muted-foreground"> / month</span>
              </p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {formatUsd(Math.round(yearly))}
                <span className="text-base font-medium text-muted-foreground"> / year</span>
              </p>
            </div>
            {afterHours ? (
              <p className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
                For comparison: <span className="font-semibold text-foreground">{afterHours.name} plan: {formatUsd(afterHours.price)}/mo</span>
              </p>
            ) : null}
            <p className="mt-2 text-xs text-muted-foreground">
              Estimate only: missed calls × 52 weeks × booking rate × patient value.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
