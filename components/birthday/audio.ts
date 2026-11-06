/**
 * Every sound on the birthday page is synthesised with Web Audio: no audio files or recordings.
 * The AudioContext is only created/resumed from a user gesture (unlockAudio), so browsers allow it.
 */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let enabled = true
/** Sounds nobody tapped for (ringtone, boom, shutter, stamp, fireworks). Off for prefers-reduced-motion. */
let autoSounds = true
let keepAlive: HTMLAudioElement | null = null

export function setAutoSoundsEnabled(on: boolean) {
  autoSounds = on
}

/** A short silent WAV, looped through an <audio> element (see unlockAudio). */
function silentWavUrl() {
  const rate = 8000
  const samples = rate / 2
  const buf = new ArrayBuffer(44 + samples)
  const v = new DataView(buf)
  const str = (o: number, t: string) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)))
  str(0, "RIFF")
  v.setUint32(4, 36 + samples, true)
  str(8, "WAVE")
  str(12, "fmt ")
  v.setUint32(16, 16, true)
  v.setUint16(20, 1, true)
  v.setUint16(22, 1, true)
  v.setUint32(24, rate, true)
  v.setUint32(28, rate, true)
  v.setUint16(32, 1, true)
  v.setUint16(34, 8, true)
  str(36, "data")
  v.setUint32(40, samples, true)
  for (let i = 0; i < samples; i++) v.setUint8(44 + i, 128)
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }))
}

export function setSoundEnabled(on: boolean) {
  enabled = on
  if (master && ctx) master.gain.setTargetAtTime(on ? 0.9 : 0, ctx.currentTime, 0.02)
}

export function isSoundEnabled() {
  return enabled
}

/**
 * iOS (Safari 17+) audio session. "playback" lets sound play through the silent switch but blocks the
 * microphone; "play-and-record" is needed while the cake listens for a blow.
 */
export function setAudioSessionType(type: "playback" | "play-and-record") {
  try {
    const nav = navigator as Navigator & { audioSession?: { type: string } }
    if (nav.audioSession) nav.audioSession.type = type
  } catch {
    /* not supported */
  }
}

/**
 * Call from a click handler (iOS only unlocks audio on click/touchend, not touchstart). Safe to call repeatedly.
 * On iPhones, Web Audio is muted by the silent switch unless the page's audio session is "playback":
 * Safari 17+ exposes navigator.audioSession for that; older versions switch when an <audio> element plays,
 * so a silent looping one is started from the same tap.
 */
export function unlockAudio() {
  setAudioSessionType("playback")
  try {
    if (!keepAlive) {
      keepAlive = new Audio(silentWavUrl())
      keepAlive.loop = true
      keepAlive.setAttribute("playsinline", "")
    }
    if (keepAlive.paused) void keepAlive.play().catch(() => {})
  } catch {
    /* ignore */
  }
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AC) return
      ctx = new AC()
      master = ctx.createGain()
      master.gain.value = enabled ? 0.9 : 0
      master.connect(ctx.destination)
    }
    if (ctx.state !== "running") void ctx.resume().catch(() => {})
    // Classic iOS unlock: play one silent sample inside the gesture.
    const src = ctx.createBufferSource()
    src.buffer = ctx.createBuffer(1, 1, 22050)
    src.connect(ctx.destination)
    src.start(0)
  } catch {
    /* audio unavailable: the page works silently */
  }
}

export function getAudioContext() {
  return ctx
}

/**
 * Sounds are scheduled even while the context is still resuming (resume() is async, and the first
 * sounds after a tap used to be dropped); they play as soon as it is running.
 */
function ready(auto = false) {
  if (!ctx || !master || !enabled) return false
  if (auto && !autoSounds) return false
  if (ctx.state !== "running") void ctx.resume().catch(() => {})
  return ctx.state !== "closed"
}

function note(freq: number, start: number, dur: number, opts: { type?: OscillatorType; gain?: number; attack?: number } = {}) {
  if (!ctx || !master) return
  const { type = "sine", gain = 0.2, attack = 0.01 } = opts
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(0, start)
  g.gain.linearRampToValueAtTime(gain, start + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  osc.connect(g).connect(master)
  osc.start(start)
  osc.stop(start + dur + 0.05)
}

function noise(start: number, dur: number, opts: { gain?: number; freq?: number; q?: number; type?: BiquadFilterType } = {}) {
  if (!ctx || !master) return
  const { gain = 0.3, freq = 2000, q = 1, type = "bandpass" } = opts
  const len = Math.max(1, Math.floor(ctx.sampleRate * dur))
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = ctx.createBufferSource()
  src.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = type
  filter.frequency.value = freq
  filter.Q.value = q
  const g = ctx.createGain()
  g.gain.value = gain
  src.connect(filter).connect(g).connect(master)
  src.start(start)
}

/** Marimba-style ringtone arpeggio, repeated until the returned stop() is called. */
export function startRingtone(): () => void {
  let stopped = false
  let timer: ReturnType<typeof setTimeout> | undefined
  const phrase = [1318.5, 987.8, 1318.5, 1568, 1318.5, 987.8] // E6 B5 E6 G6 E6 B5
  const ring = () => {
    if (stopped) return
    if (ready(true) && ctx) {
      const t = ctx.currentTime + 0.02
      phrase.forEach((f, i) => {
        note(f, t + i * 0.13, 0.32, { type: "triangle", gain: 0.12 })
        note(f / 2, t + i * 0.13, 0.25, { type: "sine", gain: 0.05 })
      })
    }
    timer = setTimeout(ring, 2200)
  }
  ring()
  return () => {
    stopped = true
    if (timer) clearTimeout(timer)
  }
}

/** Short "call connected" chirp. */
export function playConnect() {
  if (!ready() || !ctx) return
  const t = ctx.currentTime
  note(880, t, 0.12, { type: "sine", gain: 0.15 })
  note(1320, t + 0.1, 0.18, { type: "sine", gain: 0.15 })
}

/** Deep cinematic bass boom for the reveal. */
export function playBoom() {
  if (!ready(true) || !ctx || !master) return
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = "sine"
  osc.frequency.setValueAtTime(130, t)
  osc.frequency.exponentialRampToValueAtTime(38, t + 0.9)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.9, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4)
  osc.connect(g).connect(master)
  osc.start(t)
  osc.stop(t + 1.5)
  noise(t, 0.35, { gain: 0.35, freq: 180, type: "lowpass" })
}

/** Camera shutter click. */
export function playShutter() {
  if (!ready(true) || !ctx) return
  const t = ctx.currentTime
  noise(t, 0.05, { gain: 0.45, freq: 3500, q: 0.8 })
  noise(t + 0.07, 0.06, { gain: 0.35, freq: 2500, q: 0.8 })
}

/** Rubber-stamp thud. */
export function playThud() {
  if (!ready(true) || !ctx || !master) return
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.frequency.setValueAtTime(120, t)
  osc.frequency.exponentialRampToValueAtTime(45, t + 0.18)
  g.gain.setValueAtTime(0.7, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25)
  osc.connect(g).connect(master)
  osc.start(t)
  osc.stop(t + 0.3)
  noise(t, 0.08, { gain: 0.3, freq: 400, type: "lowpass" })
}

/** Tiny pop for tap bursts. */
export function playPop() {
  if (!ready() || !ctx) return
  const t = ctx.currentTime
  note(600 + Math.random() * 500, t, 0.08, { type: "sine", gain: 0.06, attack: 0.002 })
}

/** Breath / whoosh when a candle goes out. */
export function playWhoosh() {
  if (!ready() || !ctx) return
  noise(ctx.currentTime, 0.45, { gain: 0.25, freq: 900, q: 0.5 })
}

/** Firework crackle. */
export function playCrackle() {
  if (!ready(true) || !ctx) return
  const t = ctx.currentTime
  noise(t, 0.25, { gain: 0.2, freq: 140, type: "lowpass" })
  for (let i = 0; i < 6; i++) noise(t + 0.1 + Math.random() * 0.4, 0.02, { gain: 0.15, freq: 4000 })
}

/**
 * "Happy Birthday to You" (public-domain melody), in G major, 3/4.
 * Returns the total duration in seconds.
 */
export function playHappyBirthday(): number {
  if (!ready() || !ctx) return 0
  const N: Record<string, number> = {
    G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
  }
  const beat = 0.42
  const tune: [string, number][] = [
    ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
    ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
    ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
    ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 3],
  ]
  let t = ctx.currentTime + 0.1
  for (const [name, beats] of tune) {
    const d = beats * beat
    note(N[name], t, d * 0.95, { type: "triangle", gain: 0.16, attack: 0.02 })
    note(N[name] * 2, t, d * 0.6, { type: "sine", gain: 0.04, attack: 0.02 })
    t += d
  }
  return t - ctx.currentTime
}
