"use client"

import Link from "next/link"
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { primaryCta } from "@/components/dental/styles"
import { trackEvent } from "@/lib/analytics"
import { siteConfig } from "@/lib/site-config"
import {
  BUDGET_RANGES,
  COUNTRIES,
  LEAD_INDUSTRIES,
  PROJECT_TYPES,
  TIMELINES,
  softwareLeadSchema,
  type SoftwareLead,
  type SoftwareLeadFieldErrors,
} from "@/lib/software-lead"
import { ATTRIBUTION_KEYS } from "./attribution"

type Values = {
  name: string
  company: string
  email: string
  phone: string
  country: string
  industry: string
  projectType: string
  budget: string
  timeline: string
  message: string
  consent: boolean
}

const EMPTY: Values = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  industry: "",
  projectType: "",
  budget: "",
  timeline: "",
  message: "",
  consent: false,
}

const FIELD_ORDER: (keyof SoftwareLead)[] = [
  "name",
  "company",
  "email",
  "phone",
  "country",
  "industry",
  "projectType",
  "budget",
  "timeline",
  "message",
  "consent",
]

const inputClass =
  "h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive"

type Status = "idle" | "submitting" | "success" | "error"

function readSession(key: string) {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

export function ProjectForm() {
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`

  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<SoftwareLeadFieldErrors>({})
  const [status, setStatus] = useState<Status>("idle")
  const [serverError, setServerError] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const startedAt = useRef<number>(Date.now())
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)

  // Preselect the industry from ?industry=<slug>; prefill Company from a personalised (?for=) link.
  useEffect(() => {
    startedAt.current = Date.now()
    let industry = ""
    try {
      const slug = new URLSearchParams(window.location.search).get("industry")
      if (slug && LEAD_INDUSTRIES.some((i) => i.slug === slug)) industry = slug
    } catch {
      /* ignore */
    }
    const company = readSession(ATTRIBUTION_KEYS.forCompany) ?? ""
    setValues((v) => ({ ...v, industry: v.industry || industry, company: v.company || company }))
  }, [])

  useEffect(() => {
    if (status === "success") successRef.current?.focus()
  }, [status])

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key as keyof SoftwareLeadFieldErrors]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const focusFirstError = (errs: SoftwareLeadFieldErrors) => {
    const first = FIELD_ORDER.find((k) => errs[k])
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError("")

    const parsed = softwareLeadSchema.safeParse(values)
    if (!parsed.success) {
      const errs: SoftwareLeadFieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof SoftwareLeadFieldErrors
        if (key && !errs[key]) errs[key] = issue.message
      }
      setErrors(errs)
      focusFirstError(errs)
      return
    }

    let utm: Record<string, string> = {}
    try {
      utm = JSON.parse(readSession(ATTRIBUTION_KEYS.utm) || "{}") as Record<string, string>
    } catch {
      /* ignore */
    }

    setStatus("submitting")
    try {
      const res = await fetch("/api/software-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypot,
          startedAt: startedAt.current,
          pageUrl: `${window.location.origin}${window.location.pathname}`,
          landingUrl: readSession(ATTRIBUTION_KEYS.landing) || undefined,
          utm,
        }),
      })
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: SoftwareLeadFieldErrors }
      if (res.ok && json.ok) {
        trackEvent("software_lead_submit", { status: "success", industry: values.industry, project_type: values.projectType })
        // Meta Pixel is not installed today; this fires only if it is added later.
        if (typeof window.fbq === "function") window.fbq("track", "Lead")
        setStatus("success")
        return
      }
      if (json.fieldErrors) {
        setErrors(json.fieldErrors)
        focusFirstError(json.fieldErrors)
      }
      trackEvent("software_lead_submit", { status: "error", industry: values.industry })
      setServerError(json.error || "")
      setStatus("error")
    } catch {
      trackEvent("software_lead_submit", { status: "error", industry: values.industry })
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-primary/30 bg-card p-6 text-card-foreground shadow-xl md:p-8" role="status">
        <CheckCircle2 className="mb-4 h-10 w-10 text-primary" aria-hidden="true" />
        <h2 ref={successRef} tabIndex={-1} className="text-2xl font-semibold focus:outline-none">
          Thank you. Your project details are with us.
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          We&apos;ll reply by email within 1 business day with questions or a suggested next step. A
          confirmation is on its way to your inbox.
        </p>
      </div>
    )
  }

  const err = (name: keyof SoftwareLeadFieldErrors) =>
    errors[name] ? (
      <p id={id(`${name}-error`)} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
        <AlertCircle className="h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
        {errors[name]}
      </p>
    ) : null

  const a11y = (name: keyof SoftwareLeadFieldErrors) => ({
    id: id(name),
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? id(`${name}-error`) : undefined,
  })

  // Plain render helper (not a component) so inputs never remount while typing.
  const field = (name: keyof SoftwareLeadFieldErrors, label: string, required: boolean, children: ReactNode) => (
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

  const select = (
    name: "country" | "industry" | "projectType" | "budget" | "timeline",
    label: string,
    required: boolean,
    options: readonly { value: string; label: string }[],
  ) =>
    field(
      name,
      label,
      required,
      <select
        {...a11y(name)}
        required={required}
        aria-required={required || undefined}
        value={values[name]}
        onChange={(e) => set(name, e.target.value)}
        className={inputClass}
      >
        <option value="">Select one</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>,
    )

  const text = (
    name: "name" | "company" | "email" | "phone",
    label: string,
    type: string,
    autoComplete: string,
    placeholder: string,
    required: boolean,
  ) =>
    field(
      name,
      label,
      required,
      <input
        {...a11y(name)}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        aria-required={required || undefined}
        value={values[name]}
        onChange={(e) => set(name, e.target.value)}
        className={inputClass}
      />,
    )

  const asOptions = (list: readonly string[]) => list.map((v) => ({ value: v, label: v }))

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      data-clarity-mask="true"
      aria-label="Start a project"
      className="relative rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:p-6 md:p-8"
    >
      <h2 className="text-xl font-semibold">Tell us about your project</h2>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">
        Fields marked <span className="text-primary">*</span> are required. It takes about two minutes.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        {text("name", "Your name", "text", "name", "e.g. Ahmed Al-Harbi", true)}
        {text("company", "Company or organisation", "text", "organization", "e.g. Al Noor Trading", true)}
        {text("email", "Work email", "email", "email", "you@company.com", true)}
        {text("phone", "Phone or WhatsApp", "tel", "tel", "+966 5X XXX XXXX", false)}
        {select("country", "Country", true, asOptions(COUNTRIES))}
        {select("industry", "Industry", true, LEAD_INDUSTRIES.map((i) => ({ value: i.slug, label: i.label })))}
        {select("projectType", "What do you need?", true, asOptions(PROJECT_TYPES))}
        {select("budget", "Budget range", false, asOptions(BUDGET_RANGES))}
        <div className="sm:col-span-2">{select("timeline", "Timeline", false, asOptions(TIMELINES))}</div>
        <div className="sm:col-span-2">
          {field(
            "message",
            "Project details",
            true,
            <textarea
              {...a11y("message")}
              rows={5}
              maxLength={3000}
              required
              aria-required="true"
              placeholder="What do you want to build or improve? Who will use it? Anything you already have, such as a website, hosting or existing systems?"
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
              className={`${inputClass} h-auto min-h-[132px] py-3`}
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
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            className="mt-0.5 h-6 w-6 shrink-0 rounded border-input accent-[hsl(var(--primary))]"
          />
          <label htmlFor={id("consent")} className="text-sm leading-relaxed text-foreground">
            I agree to be contacted by RapidNexTech by email or phone about this enquiry. See our{" "}
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
            {serverError || "Something went wrong sending your details."} Please email us at{" "}
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
          "Send project details"
        )}
      </button>
      <p className="sr-only" aria-live="polite">
        {status === "submitting" ? "Sending your details" : ""}
      </p>
    </form>
  )
}
