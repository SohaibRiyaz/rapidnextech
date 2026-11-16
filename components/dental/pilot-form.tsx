"use client"

import Link from "next/link"
import { Fragment, useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react"
import { AlertCircle, CalendarCheck, CheckCircle2, Loader2 } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import {
  ANSWER_WHEN,
  CALLS_PER_WEEK,
  HVAC_ANSWER_WHEN,
  HVAC_FIELD_SOFTWARE_OPTIONS,
  HVAC_PHONE_SYSTEMS,
  HVAC_TRUCKS,
  PHONE_SYSTEMS,
  PLAN_ID_TO_INTEREST,
  PLAN_INTEREST,
  PRACTICE_SOFTWARE,
  UTM_KEYS,
  hvacPilotRequestSchema,
  pilotRequestSchema,
} from "@/lib/pilot-request"
import { siteConfig, telHref } from "@/lib/site-config"
import { primaryCta } from "./styles"

import { SELECT_PLAN_EVENT } from "./events"

export type PilotVertical = "dental" | "hvac"

type TextField = {
  kind: "text"
  name: string
  label: string
  type: string
  autoComplete: string
  placeholder: string
  full?: boolean
}
type SelectField = { kind: "select"; name: string; label: string; options: readonly string[]; full?: boolean }
type FieldDef = TextField | SelectField

/**
 * Fields per vertical, in display order. The dental list is the original form, unchanged (it is also
 * used by /contact). Validation lives in lib/pilot-request.ts (pilotRequestSchema / hvacPilotRequestSchema).
 */
const FORMS: Record<PilotVertical, { fields: FieldDef[]; messagePlaceholder: string }> = {
  dental: {
    fields: [
      { kind: "text", name: "practiceName", label: "Practice name", type: "text", autoComplete: "organization", placeholder: "e.g. Bright Smile Family Dentistry", full: true },
      { kind: "text", name: "ownerName", label: "Owner / decision-maker name", type: "text", autoComplete: "name", placeholder: "e.g. Dr. Jane Smith" },
      { kind: "text", name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@yourpractice.com" },
      { kind: "text", name: "phone", label: "Phone", type: "tel", autoComplete: "tel", placeholder: "(555) 123-4567" },
      { kind: "text", name: "cityState", label: "Practice city / state", type: "text", autoComplete: "address-level2", placeholder: "e.g. Tampa, FL" },
      { kind: "select", name: "callsPerWeek", label: "Approx. after-hours calls per week", options: CALLS_PER_WEEK },
      { kind: "select", name: "phoneSystem", label: "Phone system", options: PHONE_SYSTEMS },
      { kind: "select", name: "practiceSoftware", label: "Practice management software", options: PRACTICE_SOFTWARE },
      { kind: "select", name: "answerWhen", label: "When should the AI answer?", options: ANSWER_WHEN },
      { kind: "select", name: "planInterest", label: "Plan interest", options: PLAN_INTEREST, full: true },
    ],
    messagePlaceholder: "Anything we should know: your hours, services, how you handle emergencies, or questions for us.",
  },
  hvac: {
    fields: [
      { kind: "text", name: "companyName", label: "Company name", type: "text", autoComplete: "organization", placeholder: "e.g. Sunrise Heating & Air", full: true },
      { kind: "text", name: "ownerName", label: "Owner / decision-maker name", type: "text", autoComplete: "name", placeholder: "e.g. Mike Johnson" },
      { kind: "text", name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@yourcompany.com" },
      { kind: "text", name: "phone", label: "Phone", type: "tel", autoComplete: "tel", placeholder: "(555) 123-4567" },
      { kind: "text", name: "cityState", label: "Service area city / state", type: "text", autoComplete: "address-level2", placeholder: "e.g. Tampa, FL" },
      { kind: "select", name: "trucks", label: "Number of trucks / techs", options: HVAC_TRUCKS },
      { kind: "select", name: "callsPerWeek", label: "Approx. missed calls per week", options: CALLS_PER_WEEK },
      { kind: "select", name: "phoneSystem", label: "Phone system", options: HVAC_PHONE_SYSTEMS },
      { kind: "select", name: "fieldSoftware", label: "Field service software", options: HVAC_FIELD_SOFTWARE_OPTIONS },
      { kind: "select", name: "answerWhen", label: "When should the AI answer?", options: HVAC_ANSWER_WHEN, full: true },
      { kind: "select", name: "planInterest", label: "Plan interest", options: PLAN_INTEREST, full: true },
    ],
    messagePlaceholder: "Anything we should know: your service area, hours, how you handle emergencies, or questions for us.",
  },
}

type Values = Record<string, string>
type FieldErrors = Record<string, string | undefined>

const UTM_STORAGE_KEY = "rnt-utm"

function readUtm(): Record<string, string> {
  const fromUrl: Record<string, string> = {}
  try {
    const params = new URLSearchParams(window.location.search)
    for (const key of UTM_KEYS) {
      const v = params.get(key)
      if (v) fromUrl[key] = v.slice(0, 300)
    }
    if (Object.keys(fromUrl).length) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl))
      return fromUrl
    }
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Record<string, string>) : {}
  } catch {
    return fromUrl
  }
}

const inputClass =
  "h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive"

type Status = "idle" | "submitting" | "success" | "error"

export function PilotForm({
  location,
  initialPlanId,
  vertical = "dental",
}: {
  location: string
  initialPlanId?: string
  /** Which form to show. Default "dental": the original form, also used on /contact. */
  vertical?: PilotVertical
}) {
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`
  const form = FORMS[vertical]
  const fieldOrder = [...form.fields.map((f) => f.name), "message", "consent"]

  const [values, setValues] = useState<Values>(() => ({
    ...Object.fromEntries(form.fields.map((f) => [f.name, ""])),
    message: "",
    planInterest: (initialPlanId && PLAN_ID_TO_INTEREST[initialPlanId]) || "",
  }))
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>("idle")
  const [serverError, setServerError] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const startedAt = useRef<number>(Date.now())
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)

  const selectPlan = useCallback((planId: string | null | undefined) => {
    const interest = planId ? PLAN_ID_TO_INTEREST[planId] : undefined
    if (interest) setValues((v) => ({ ...v, planInterest: interest }))
  }, [])

  // Preselect from ?plan= on load, and from pricing-card clicks on the same page.
  useEffect(() => {
    startedAt.current = Date.now()
    try {
      selectPlan(new URLSearchParams(window.location.search).get("plan"))
    } catch {
      /* ignore */
    }
    const onSelect = (e: Event) => selectPlan((e as CustomEvent<string>).detail)
    window.addEventListener(SELECT_PLAN_EVENT, onSelect)
    return () => window.removeEventListener(SELECT_PLAN_EVENT, onSelect)
  }, [selectPlan])

  useEffect(() => {
    if (status === "success") successRef.current?.focus()
  }, [status])

  const set = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const focusFirstError = (errs: FieldErrors) => {
    const first = fieldOrder.find((k) => errs[k])
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError("")

    const input = { ...values, consent }
    const parsed = (vertical === "hvac" ? hvacPilotRequestSchema : pilotRequestSchema).safeParse(input)
    if (!parsed.success) {
      const errs: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string
        if (key && !errs[key]) errs[key] = issue.message
      }
      setErrors(errs)
      focusFirstError(errs)
      return
    }

    setStatus("submitting")
    try {
      const res = await fetch("/api/pilot-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...input,
          // Dental submissions carry no vertical, exactly as before.
          ...(vertical === "hvac" ? { vertical } : {}),
          website: honeypot,
          startedAt: startedAt.current,
          pageUrl: window.location.href.split("#")[0],
          utm: readUtm(),
        }),
      })
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: FieldErrors }
      if (res.ok && json.ok) {
        trackEvent("pilot_form_submit", { status: "success", location, plan: values.planInterest || "none", vertical })
        setStatus("success")
        return
      }
      if (json.fieldErrors) {
        setErrors(json.fieldErrors)
        focusFirstError(json.fieldErrors)
      }
      trackEvent("pilot_form_submit", { status: "error", location, vertical })
      setServerError(json.error || "")
      setStatus("error")
    } catch {
      trackEvent("pilot_form_submit", { status: "error", location, vertical })
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-primary/30 bg-card p-6 text-card-foreground shadow-xl md:p-8" role="status">
        <CheckCircle2 className="mb-4 h-10 w-10 text-primary" aria-hidden="true" />
        <h3 ref={successRef} tabIndex={-1} className="text-2xl font-semibold focus:outline-none">
          Thanks, your pilot request is in.
        </h3>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          We&apos;ll email you {siteConfig.copy.pilotResponseTime} to book your 30-min onboarding call. A confirmation is on
          its way to your inbox.
        </p>
        {siteConfig.bookingUrl ? (
          <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className={`${primaryCta} mt-6`}>
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Pick a time for your 30-min onboarding call
          </a>
        ) : null}
      </div>
    )
  }

  const err = (name: string) =>
    errors[name] ? (
      <p id={id(`${name}-error`)} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
        <AlertCircle className="h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
        {errors[name]}
      </p>
    ) : null

  const a11y = (name: string) => ({
    id: id(name),
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? id(`${name}-error`) : undefined,
  })

  // Plain render helper (not a component) so inputs are never remounted while typing.
  const field = (name: string, label: string, required: boolean, children: ReactNode) => (
    <div>
      <label htmlFor={id(name)} className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
        {required ? (
          <span className="text-primary" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-muted-foreground"> (optional)</span>
        )}
      </label>
      {children}
      {err(name)}
    </div>
  )

  const select = (name: string, options: readonly string[], label: string) =>
    field(
      name,
      label,
      false,
      <select {...a11y(name)} value={values[name] ?? ""} onChange={(e) => set(name, e.target.value)} className={inputClass}>
        <option value="">Select one</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>,
    )

  const text = (name: string, label: string, type: string, autoComplete: string, placeholder: string) =>
    field(
      name,
      label,
      true,
      <input
        {...a11y(name)}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        aria-required="true"
        value={values[name] ?? ""}
        onChange={(e) => set(name, e.target.value)}
        className={inputClass}
      />,
    )

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      data-clarity-mask="true"
      aria-label="Free pilot signup"
      className="relative rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:p-6 md:p-8"
    >
      <h3 className="text-xl font-semibold">Start your {siteConfig.pilot.days}-day free pilot</h3>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Fields marked <span className="text-primary">*</span> are required. No credit card.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        {form.fields.map((def) => {
          const el =
            def.kind === "text"
              ? text(def.name, def.label, def.type, def.autoComplete, def.placeholder)
              : select(def.name, def.options, def.label)
          return def.full ? (
            <div key={def.name} className="sm:col-span-2">
              {el}
            </div>
          ) : (
            <Fragment key={def.name}>{el}</Fragment>
          )
        })}
        <div className="sm:col-span-2">
          {field(
            "message",
            "Message",
            false,
            <textarea
              {...a11y("message")}
              rows={4}
              maxLength={2000}
              placeholder={form.messagePlaceholder}
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
              className={`${inputClass} h-auto min-h-[112px] py-3`}
            />,
          )}
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Leave this field empty</label>
        <input
          id={id("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="mt-6">
        <div className="flex items-start gap-3">
          <input
            {...a11y("consent")}
            type="checkbox"
            required
            aria-required="true"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked)
              if (errors.consent) setErrors((er) => ({ ...er, consent: undefined }))
            }}
            className="mt-0.5 h-6 w-6 shrink-0 rounded border-input accent-[hsl(var(--primary))]"
          />
          <label htmlFor={id("consent")} className="text-sm leading-relaxed text-foreground">
            I agree to be contacted by RapidNexTech by email and phone about this pilot. See our{" "}
            <Link href="/privacy-policy" className="font-medium text-primary underline underline-offset-2">
              privacy policy
            </Link>
            .<span className="text-primary" aria-hidden="true"> *</span>
          </label>
        </div>
        {err("consent")}
      </div>

      {status === "error" ? (
        <div role="alert" className="mt-6 flex gap-3 rounded-xl border border-border bg-muted p-4 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <p>
            {serverError || "Something went wrong sending your request."} Please call us at{" "}
            <a href={telHref(siteConfig.publicPhone)} className="font-semibold underline underline-offset-2">
              {siteConfig.publicPhone.display}
            </a>{" "}
            or email{" "}
            <a href={`mailto:${siteConfig.email}`} className="font-semibold underline underline-offset-2">
              {siteConfig.email}
            </a>
            .
          </p>
        </div>
      ) : null}

      <button type="submit" disabled={status === "submitting"} className={`${primaryCta} mt-6 w-full disabled:opacity-70`}>
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          "Start my free pilot"
        )}
      </button>
      <p className="sr-only" aria-live="polite">
        {status === "submitting" ? "Sending your request" : ""}
      </p>
    </form>
  )
}
