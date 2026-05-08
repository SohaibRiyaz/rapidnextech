"use client"

import { CheckCircle2, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { TRUSTED_VOICE_DEMO_ORIGIN, getVoiceDemoEmbedUrl, type VoiceDemoPageKey } from "@/lib/voice-demo"

interface VoiceDemoEmbedProps {
  pageKey: VoiceDemoPageKey
  title: string
  description: string
  targetId?: string
}

type BookingStatus = "idle" | "received"

export function VoiceDemoEmbed({ pageKey, title, description, targetId }: VoiceDemoEmbedProps) {
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>("idle")
  const [showTranscript, setShowTranscript] = useState(false)
  const [transcriptEntries, setTranscriptEntries] = useState<
    Array<{ id: string; speaker: string; text: string; ts: number; interim?: boolean }>
  >([])

  const pushTranscript = (speaker: string, text: string, ts?: number, interim?: boolean) => {
    const now = ts ?? Date.now()

    setTranscriptEntries((prev) => {
      if (prev.length === 0) {
        return [{ id: String(now), speaker, text, ts: now, interim }]
      }

      const last = prev[prev.length - 1]

      // Group consecutive fragments from same speaker within 5s
      if (last.speaker === speaker && now - last.ts < 5000 && last.interim) {
        // replace last (it was interim)
        const updated = prev.slice(0, -1)
        updated.push({ ...last, text: (last.text + " " + text).trim(), ts: now, interim })
        return updated
      }

      if (last.speaker === speaker && now - last.ts < 5000 && !last.interim) {
        // merge short final fragments
        const updated = prev.slice(0, -1)
        updated.push({ ...last, text: (last.text + " " + text).trim(), ts: now, interim })
        return updated
      }

      return [...prev, { id: String(now), speaker, text: text.trim(), ts: now, interim }]
    })
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== TRUSTED_VOICE_DEMO_ORIGIN) {
        return
      }

      let payload: unknown = event.data
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload)
        } catch {
          return
        }
      }


      if (!payload || typeof payload !== "object") {
        return
      }

      const messageType = (payload as { type?: unknown }).type
      if (messageType !== "booking") {
        // continue to allow other message types like transcript
      }
      if (messageType === "booking") {
        console.info("[RapidNexTech demo] booking event received", payload)
        setBookingStatus("received")
        return
      }

      // transcript / utterance messages (flexible shapes)
      if (messageType === "transcript" || messageType === "utterance" || messageType === "message") {
        const p = payload as any
        const rawText = p.text ?? p.msg ?? p.message ?? null
        if (!rawText || typeof rawText !== "string") return

        const speakerRaw = (p.speaker ?? p.who ?? p.side ?? "ai") as string
        const speaker = /user|me|caller|customer/i.test(speakerRaw) ? "You" : "AI"
        const ts = p.ts ? Number(p.ts) : Date.now()
        const interim = p.final === false || p.interim === true
        pushTranscript(speaker, rawText, ts, interim)
        return
      }
      setBookingStatus("received")
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  const embedUrl = getVoiceDemoEmbedUrl(pageKey)

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">Live voice demo</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-full border border-border bg-background/80 px-3 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur-sm sm:self-auto">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Trusted embed from try.rapidnextech.com</span>
        </div>
      </div>

      <div
        id={targetId}
        className="mt-6 scroll-mt-28 overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
      >
        <div className="aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-[16/9]">
          <iframe
            src={embedUrl}
            title={title}
            allow="microphone; autoplay"
            loading="lazy"
            className="h-full w-full border-0 bg-black"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Allow microphone access to speak with the demo.</span>
        {bookingStatus === "received" ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Booking event received from the trusted demo.
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowTranscript((s) => !s)}
          className="rounded-md bg-muted/60 px-3 py-1 text-xs font-medium"
        >
          {showTranscript ? "Hide transcript" : "Show transcript"}
        </button>
        <button
          type="button"
          onClick={() => setTranscriptEntries([])}
          className="rounded-md border border-border bg-background/60 px-3 py-1 text-xs font-medium"
        >
          Clear
        </button>
      </div>

      {showTranscript ? (
        <div className="mt-3 max-h-48 w-full overflow-auto rounded-lg border border-border bg-[var(--card)] p-3 text-sm">
          {transcriptEntries.length === 0 ? (
            <div className="text-xs text-muted-foreground">No transcript yet.</div>
          ) : (
            transcriptEntries.map((e) => (
              <div key={e.id} className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] font-semibold text-muted-foreground">{e.speaker}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(e.ts).toLocaleTimeString()}</span>
                </div>
                <div className={`mt-1 text-sm ${e.interim ? "opacity-70 italic" : ""}`}>{e.text}</div>
              </div>
            ))
          )}
        </div>
      ) : null}
    </section>
  )
}