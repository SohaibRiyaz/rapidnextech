import { CheckCircle2 } from "lucide-react"

const segments = [
  {
    title: "Botox & Injectables Clinics",
    badge: "Best Fit",
    description:
      "Treatments repeat every 3\u20134 months. Average appointment value AED 1,500\u20133,000. Automated rebooking reminders alone recover thousands in annual revenue per patient.",
    economics: "AED 1,500\u20133,000 per appointment",
  },
  {
    title: "Laser Hair Removal Clinics",
    badge: null,
    description:
      "Multi-session packages (AED 3,000\u20138,000 per course) require 4\u20136 visits. Automated reminders protect completion rates and revenue.",
    economics: "AED 3,000\u20138,000 per course",
  },
  {
    title: "Premium Skin Clinics",
    badge: null,
    description:
      "High Instagram inquiry volume + high-ticket treatments (AED 800\u20134,500+ per session). AI handles complex suitability questions perfectly.",
    economics: "AED 800\u20134,500+ per session",
  },
  {
    title: "Multi-Treatment Aesthetic Centres",
    badge: null,
    description:
      "Clinics offering injectables, laser, and skin treatments across multiple practitioners. Full patient lifecycle automation = compounding revenue.",
    economics: "Multi-practitioner clinics across GCC",
  },
]

export function WhoItsForSection() {
  return (
    <section className="py-20 md:py-28 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left column */}
          <div className="lg:sticky lg:top-32">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Who This Is For
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-6">
              Built for GCC Aesthetic Clinics Where{" "}
              <span className="theme-gradient-text bg-clip-text text-transparent">
                Treatments Repeat
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              The highest ROI comes from clinics with recurring treatments.
              Every rebooking reminder we send is revenue you would have
              otherwise lost.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We sit on top of your existing booking system and calendar. No process change required.
            </p>
          </div>

          <div className="space-y-4">
            {segments.map((segment) => (
              <div
                key={segment.title}
                className="flex gap-4 p-5 rounded-xl border border-border bg-card/50 hover:bg-card transition-all duration-200"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">
                      {segment.title}
                    </h3>
                    {segment.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {segment.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    {segment.description}
                  </p>
                  <p className="text-xs font-medium text-foreground/70">
                    {segment.economics}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
