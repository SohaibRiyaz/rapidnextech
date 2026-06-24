import { CheckCircle2 } from "lucide-react"

const segments = [
  {
    title: "Skin & Laser Clinics",
    badge: "Best Fit",
    description:
      "If patients compare clinics fast and book whoever replies first, this pays for itself within a week.",
    economics: "PKR 15,000–40,000 per consultation",
  },
  {
    title: "Aesthetic & Injectable Clinics",
    badge: null,
    description:
      "One filler or PRP consultation is worth PKR 15,000–40,000. Losing even one to a slow reply hurts.",
    economics: "High-ticket, repeat treatments",
  },
  {
    title: "Cosmetic & Derma Clinics",
    badge: null,
    description:
      "Patients ask detailed questions before committing. The assistant handles all of it and sends you only the serious ones.",
    economics: "Longer patient journey, higher commitment",
  },
]

export function WhoItsForSection() {
  return (
    <section id="who-its-for" className="py-20 md:py-28 bg-muted/30 theme-transition">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left column */}
          <div className="lg:sticky lg:top-32">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Who This Is For
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-6">
              Built for Lahore Clinics{" "}
              <span className="theme-gradient-text bg-clip-text text-transparent">
                Where Every Patient Matters
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              The highest ROI comes from clinics where patients compare and book fast — and where a
              missed inquiry means a missed consultation.
            </p>
            <div className="rounded-xl border border-border/60 bg-card/50 p-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Honest note:</span> Not for
              clinics already fully booked with a waitlist. If you&apos;re not losing inquiries,
              you don&apos;t need this yet.
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {segments.map((segment) => (
              <div
                key={segment.title}
                className="flex gap-4 p-5 rounded-xl border border-border bg-card/50 hover:bg-card transition-all duration-200"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{segment.title}</h3>
                    {segment.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {segment.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-1">
                    {segment.description}
                  </p>
                  <p className="text-xs font-medium text-foreground/60">{segment.economics}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
