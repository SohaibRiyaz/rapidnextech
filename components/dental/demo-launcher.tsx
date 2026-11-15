"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Loader2, Mic, MicOff, PhoneOff, Play, RotateCcw } from "lucide-react"
import type { WebCallSession } from "retell-client-js-sdk"
import { trackEvent } from "@/lib/analytics"
import { siteConfig } from "@/lib/site-config"
import { primaryCta, secondaryCta } from "./styles"

/**
 * Browser voice demo: a Retell web call to the dental agent ("Maya"), started from the visitor's click.
 * The SDK is loaded only on click, so it adds nothing to the page's first load.
 * Flow per Retell's web-call docs: public key (domain allow-listed) + agent id, optional reCAPTCHA token.
 */

type Status = "idle" | "connecting" | "live" | "ended" | "error"
type ErrorType = "mic_denied" | "mic_missing" | "recaptcha" | "connect"

const { publicKey, agentId, agentVersion, recaptchaSiteKey } = siteConfig.retellDemo
const configured = Boolean(publicKey && agentId && agentVersion)

const errorCopy: Record<ErrorType, string> = {
  mic_denied:
    "Your browser blocked the microphone. Allow microphone access for this site (usually the icon in the address bar), then try again.",
  mic_missing: "We couldn't find a microphone. Connect one, or try on your phone, then start again.",
  recaptcha: "We couldn't verify your browser. Please refresh the page and try again.",
  connect: "The demo couldn't connect. Please check your connection and try again in a moment.",
}

const cardClass =
  "flex aspect-[4/5] w-full flex-col items-center justify-center gap-5 rounded-3xl short:aspect-auto short:h-[clamp(300px,calc(100vh-340px),480px)] short:gap-4 border border-border bg-card p-6 text-center shadow-xl sm:aspect-[16/11] lg:aspect-[16/9]"

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

/** Loads reCAPTCHA v3 on first use and returns a fresh token (Retell wants a new one per call). */
async function getRecaptchaToken(siteKey: string): Promise<string> {
  if (!window.grecaptcha) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script")
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("recaptcha_load_failed"))
      document.head.appendChild(script)
    })
  }
  const grecaptcha = window.grecaptcha
  if (!grecaptcha) throw new Error("recaptcha_unavailable")
  await new Promise<void>((resolve) => grecaptcha.ready(resolve))
  return grecaptcha.execute(siteKey, { action: "demo_call" })
}

/** Asks for the mic up front so a denied permission gets a clear message before any call is created. */
async function checkMicrophone(): Promise<ErrorType | null> {
  if (!navigator.mediaDevices?.getUserMedia) return "mic_missing"
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach((t) => t.stop())
    return null
  } catch (err) {
    const name = (err as { name?: string })?.name
    if (name === "NotFoundError" || name === "OverconstrainedError") return "mic_missing"
    return "mic_denied"
  }
}

export function DemoLauncher({ location }: { location: string }) {
  const [status, setStatus] = useState<Status>("idle")
  const [errorType, setErrorType] = useState<ErrorType | null>(null)
  const [muted, setMuted] = useState(false)
  const [agentTalking, setAgentTalking] = useState(false)
  const [pilotHref, setPilotHref] = useState("#pilot")
  const callRef = useRef<WebCallSession | null>(null)
  const liveAtRef = useRef<number | null>(null)
  const endedRef = useRef(false)

  useEffect(() => {
    // The section is also used on /solutions/dental-clinics, which has no #pilot form of its own.
    if (!document.getElementById("pilot")) setPilotHref("/#pilot")
    return () => {
      // Leaving the page mid-call: hang up so the call (and its minutes) stop.
      callRef.current?.end().catch(() => {})
    }
  }, [])

  function fail(type: ErrorType) {
    trackEvent("demo_error", { location, type })
    setErrorType(type)
    setStatus("error")
    setAgentTalking(false)
    callRef.current = null
  }

  function handleEnded() {
    if (endedRef.current) return
    endedRef.current = true
    setAgentTalking(false)
    callRef.current = null
    // A call that never went live ended because it failed to connect.
    if (liveAtRef.current === null) return fail("connect")
    trackEvent("demo_end", { location, duration: Math.round((Date.now() - liveAtRef.current) / 1000) })
    setStatus("ended")
  }

  async function start() {
    if (!configured || status === "connecting" || status === "live") return
    trackEvent("demo_start", { location })
    setStatus("connecting")
    setErrorType(null)
    setMuted(false)
    setAgentTalking(false)
    liveAtRef.current = null
    endedRef.current = false

    const micProblem = await checkMicrophone()
    if (micProblem) return fail(micProblem)

    let recaptchaToken: string | undefined
    if (recaptchaSiteKey) {
      try {
        recaptchaToken = await getRecaptchaToken(recaptchaSiteKey)
      } catch {
        return fail("recaptcha")
      }
    }

    try {
      const { RetellClient } = await import("retell-client-js-sdk")
      const client = new RetellClient({ key: publicKey as string })
      const call = client.createWebCall({
        agent_id: agentId as string,
        agent_version: agentVersion as number,
        metadata: { source: "website_demo", location },
        recaptchaToken,
        hooks: {
          onStatus: (s) => {
            if (s === "live" && liveAtRef.current === null) {
              liveAtRef.current = Date.now()
              setStatus("live")
              trackEvent("demo_live", { location })
              call.startAudioPlayback().catch(() => {})
            }
          },
          onAgentStartTalking: () => setAgentTalking(true),
          onAgentStopTalking: () => setAgentTalking(false),
          onEnd: handleEnded,
          onError: (err) => {
            if (endedRef.current) return
            endedRef.current = true
            call.end().catch(() => {})
            const msg = `${err?.name ?? ""} ${err?.message ?? ""}`
            fail(/NotAllowed|Permission|denied/i.test(msg) ? "mic_denied" : /recaptcha/i.test(msg) ? "recaptcha" : "connect")
          },
        },
      })
      callRef.current = call
    } catch {
      fail("connect")
    }
  }

  function toggleMute() {
    const call = callRef.current
    if (!call) return
    if (muted) call.unmute()
    else call.mute()
    setMuted(!muted)
  }

  async function hangUp() {
    await callRef.current?.end().catch(() => {})
    handleEnded() // no-op if the SDK's end event already fired
  }

  const notes = (
    <div className="space-y-1 text-xs text-muted-foreground">
      <p>Live transfer to the dentist works on the phone line only.</p>
      <p>Your browser will ask for microphone permission. Use headphones for best results.</p>
    </div>
  )

  if (!configured) {
    return (
      <div className={cardClass}>
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <MicOff className="h-8 w-8" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-2xl font-semibold text-card-foreground">Talk to it in your browser</h3>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">Demo temporarily unavailable. Please check back soon.</p>
        </div>
        <button type="button" className={`${primaryCta} cursor-not-allowed opacity-50`} disabled>
          <Play className="h-4 w-4" aria-hidden="true" />
          Start the browser demo
        </button>
      </div>
    )
  }

  if (status === "live") {
    return (
      <div className={cardClass}>
        <span
          className={`relative flex h-20 w-20 items-center justify-center rounded-full text-primary transition-colors ${
            agentTalking ? "bg-primary/20" : "bg-primary/10"
          }`}
        >
          {agentTalking ? (
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/20 motion-reduce:animate-none" aria-hidden="true" />
          ) : null}
          <Mic className="relative h-9 w-9" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-2xl font-semibold text-card-foreground">You&apos;re talking to Maya</h3>
          <p className="mt-2 text-muted-foreground" aria-live="polite">
            {agentTalking ? "Maya is speaking…" : muted ? "You're muted." : "Listening. Go ahead and speak."}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" className={secondaryCta} onClick={toggleMute} aria-pressed={muted}>
            {muted ? <Mic className="h-4 w-4" aria-hidden="true" /> : <MicOff className="h-4 w-4" aria-hidden="true" />}
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            type="button"
            onClick={hangUp}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-red-600 px-6 font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <PhoneOff className="h-4 w-4" aria-hidden="true" />
            End call
          </button>
        </div>
        {notes}
      </div>
    )
  }

  if (status === "ended") {
    return (
      <div className={cardClass}>
        <div>
          <h3 className="text-2xl font-semibold text-card-foreground">Thanks for trying Maya</h3>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            That&apos;s how your patients would be greeted, day or night. Try it on your own practice&apos;s calls for{" "}
            {siteConfig.pilot.days} days, free.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={pilotHref} className={primaryCta}>
            Start the {siteConfig.pilot.days}-day pilot
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <button type="button" className={secondaryCta} onClick={start}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Talk again
          </button>
        </div>
      </div>
    )
  }

  const connecting = status === "connecting"
  return (
    <div className={cardClass}>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Mic className="h-8 w-8" aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-2xl font-semibold text-card-foreground">Talk to it in your browser</h3>
        {status === "error" && errorType ? (
          <p className="mx-auto mt-2 max-w-md text-destructive" role="alert">
            {errorCopy[errorType]}
          </p>
        ) : (
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Play the role of a new patient or a patient with a toothache. No signup.
          </p>
        )}
      </div>
      <button type="button" className={primaryCta} onClick={start} disabled={connecting} aria-busy={connecting}>
        {connecting ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Play className="h-4 w-4" aria-hidden="true" />
        )}
        {connecting ? "Connecting…" : status === "error" ? "Try again" : "Start the browser demo"}
      </button>
      {notes}
    </div>
  )
}
