/**
 * One full-screen canvas for every particle effect: confetti cannons, tap bursts, sparkles and fireworks.
 * Loaded with a dynamic import after the call is accepted. The animation loop only runs while particles exist.
 */

type Kind = "rect" | "circle" | "emoji" | "spark" | "rocket"

type Particle = {
  kind: Kind
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  rot: number
  vr: number
  color: string
  gravity: number
  drag: number
  emoji?: string
  /** rockets explode into this colour set */
  burst?: string[]
}

const CONFETTI = ["#FFD86B", "#F5B83D", "#FF2E93", "#FF6FB5", "#2F6BFF", "#59D8FF", "#FFFFFF", "#B66DFF"]
const FIREWORK_SETS = [
  ["#FFD86B", "#FFF3C4", "#F5B83D"],
  ["#FF2E93", "#FF8AC6", "#FFFFFF"],
  ["#2F6BFF", "#59D8FF", "#FFFFFF"],
  ["#B66DFF", "#FF6FB5", "#FFD86B"],
]
const EMOJIS = ["🎉", "🎂", "🥳", "👑"]
const MAX_PARTICLES = 700

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

export class ParticleEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private ps: Particle[] = []
  private raf = 0
  private last = 0
  private dpr = 1
  private sprites = new Map<string, HTMLCanvasElement>()
  private onCrackle?: () => void

  constructor(private reduced: boolean, opts: { onCrackle?: () => void } = {}) {
    this.onCrackle = opts.onCrackle
    this.canvas = document.createElement("canvas")
    this.canvas.setAttribute("aria-hidden", "true")
    Object.assign(this.canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "70",
    })
    document.body.appendChild(this.canvas)
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
    this.resize()
    window.addEventListener("resize", this.resize)
  }

  private resize = () => {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.canvas.width = Math.floor(window.innerWidth * this.dpr)
    this.canvas.height = Math.floor(window.innerHeight * this.dpr)
  }

  private sprite(emoji: string) {
    let s = this.sprites.get(emoji)
    if (!s) {
      s = document.createElement("canvas")
      s.width = s.height = 64
      const c = s.getContext("2d") as CanvasRenderingContext2D
      c.font = "48px system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif"
      c.textAlign = "center"
      c.textBaseline = "middle"
      c.fillText(emoji, 32, 36)
      this.sprites.set(emoji, s)
    }
    return s
  }

  private add(p: Particle) {
    if (this.ps.length >= MAX_PARTICLES) this.ps.shift()
    this.ps.push(p)
    if (!this.raf) {
      this.last = performance.now()
      this.raf = requestAnimationFrame(this.tick)
    }
  }

  private scale(n: number) {
    return this.reduced ? Math.ceil(n / 4) : n
  }

  /** Confetti cannon from a bottom corner. */
  cannon(side: "left" | "right", count = 110) {
    const w = window.innerWidth
    const h = window.innerHeight
    const x = side === "left" ? 0 : w
    const dir = side === "left" ? 1 : -1
    for (let i = 0; i < this.scale(count); i++) {
      const angle = rand(55, 80) * (Math.PI / 180)
      const speed = rand(0.75, 1.25) * Math.min(h, 900) * 1.55
      this.add({
        kind: Math.random() < 0.7 ? "rect" : "circle",
        x,
        y: h + 10,
        vx: Math.cos(angle) * speed * dir * rand(0.35, 0.8),
        vy: -Math.sin(angle) * speed,
        life: 0,
        maxLife: rand(2.4, 3.6),
        size: rand(6, 11),
        rot: rand(0, Math.PI * 2),
        vr: rand(-10, 10),
        color: pick(CONFETTI),
        gravity: 900,
        drag: 1.4,
      })
    }
  }

  /** Small celebratory burst at a point (tap anywhere). */
  emojiBurst(x: number, y: number) {
    const n = this.reduced ? 3 : 7
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2)
      const s = rand(160, 380)
      this.add({
        kind: "emoji",
        emoji: pick(EMOJIS),
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 220,
        life: 0,
        maxLife: rand(0.9, 1.4),
        size: rand(22, 34),
        rot: rand(-0.4, 0.4),
        vr: rand(-3, 3),
        color: "",
        gravity: 700,
        drag: 1.2,
      })
    }
    this.confettiBurst(x, y, 16)
  }

  confettiBurst(x: number, y: number, count = 40, power = 420) {
    for (let i = 0; i < this.scale(count); i++) {
      const a = rand(0, Math.PI * 2)
      const s = rand(0.3, 1) * power
      this.add({
        kind: Math.random() < 0.75 ? "rect" : "circle",
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - power * 0.4,
        life: 0,
        maxLife: rand(1.2, 2.2),
        size: rand(5, 9),
        rot: rand(0, Math.PI * 2),
        vr: rand(-12, 12),
        color: pick(CONFETTI),
        gravity: 800,
        drag: 1.6,
      })
    }
  }

  /** Gold sparkles around a point. */
  sparkles(x: number, y: number, count = 24, radius = 120) {
    for (let i = 0; i < this.scale(count); i++) {
      const a = rand(0, Math.PI * 2)
      const r = rand(0.2, 1) * radius
      this.add({
        kind: "spark",
        x: x + Math.cos(a) * r * 0.3,
        y: y + Math.sin(a) * r * 0.3,
        vx: Math.cos(a) * r * 1.4,
        vy: Math.sin(a) * r * 1.4 - 40,
        life: 0,
        maxLife: rand(0.7, 1.3),
        size: rand(1.5, 3),
        rot: 0,
        vr: 0,
        color: pick(["#FFD86B", "#FFF3C4", "#F5B83D"]),
        gravity: 120,
        drag: 2.2,
      })
    }
  }

  /** Launch one firework rocket. Defaults to a random spot in the upper half. */
  firework(tx?: number, ty?: number) {
    const w = window.innerWidth
    const h = window.innerHeight
    const x = tx ?? rand(w * 0.15, w * 0.85)
    const y = ty ?? rand(h * 0.12, h * 0.45)
    const startY = h + 10
    const t = 0.9
    this.add({
      kind: "rocket",
      x: x + rand(-40, 40),
      y: startY,
      vx: 0,
      vy: -(startY - y) / t - 0.5 * 300 * t,
      life: 0,
      maxLife: t,
      size: 2.5,
      rot: 0,
      vr: 0,
      color: "#FFF3C4",
      gravity: 300,
      drag: 0,
      burst: pick(FIREWORK_SETS),
    })
  }

  private explode(p: Particle) {
    const colors = p.burst ?? FIREWORK_SETS[0]
    const n = this.scale(70)
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rand(-0.05, 0.05)
      const s = rand(160, 300)
      this.add({
        kind: "spark",
        x: p.x,
        y: p.y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 0,
        maxLife: rand(1.1, 1.7),
        size: rand(1.8, 3),
        rot: 0,
        vr: 0,
        color: pick(colors),
        gravity: 160,
        drag: 1.3,
      })
    }
    this.onCrackle?.()
  }

  private tick = (now: number) => {
    const dt = Math.min(0.033, (now - this.last) / 1000)
    this.last = now
    const { ctx } = this
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    const h = window.innerHeight

    const alive: Particle[] = []
    for (const p of this.ps) {
      p.life += dt
      p.vx -= p.vx * p.drag * dt
      p.vy -= p.vy * p.drag * dt
      p.vy += p.gravity * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.rot += p.vr * dt

      if (p.kind === "rocket" && p.life >= p.maxLife) {
        this.explode(p)
        continue
      }
      if (p.life >= p.maxLife || p.y > h + 60) continue
      alive.push(p)

      const fade = Math.min(1, (p.maxLife - p.life) / 0.5)
      ctx.globalAlpha = fade
      if (p.kind === "emoji" && p.emoji) {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.drawImage(this.sprite(p.emoji), -p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
      } else if (p.kind === "rect") {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx.restore()
      } else if (p.kind === "circle") {
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size / 2.5, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // spark / rocket: glowing dot with a short tail
        ctx.strokeStyle = p.color
        ctx.lineWidth = p.size
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03)
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1
    this.ps = alive

    if (this.ps.length) this.raf = requestAnimationFrame(this.tick)
    else {
      this.raf = 0
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener("resize", this.resize)
    this.canvas.remove()
    this.ps = []
  }
}

export function createParticleEngine(reduced: boolean, opts?: { onCrackle?: () => void }) {
  return new ParticleEngine(reduced, opts)
}
