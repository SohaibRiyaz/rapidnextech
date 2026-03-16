import { CheckCircle2 } from "lucide-react"

const segments = [
  {
    title: "Residential Real Estate Agencies",
    badge: "Best Fit",
    description:
      "High inquiry volume from portals and ads. Automated qualification keeps agents focused on serious buyers and renters.",
    economics: "Higher viewing conversion with less agent time",
  },
  {
    title: "Property Developers",
    badge: null,
    description:
      "New build launches generate spikes in inquiries. Automation handles volume and routes serious buyers to viewings.",
    economics: "More showings per development phase",
  },
  {
    title: "Luxury Real Estate Firms",
    badge: null,
    description:
      "High-value buyers expect instant responses and personalized follow-up. Automation ensures premium service at scale.",
    economics: "Protect high-value leads from going cold",
  },
  {
    title: "High-Volume Sales Teams",
    badge: null,
    description:
      "Teams handling multiple listings and channels need structured qualification and follow-ups to maintain pipeline quality.",
    economics: "Cleaner pipeline and predictable viewing flow",
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
              Built for Agencies That{" "}
              <span className="theme-gradient-text bg-clip-text text-transparent">
                Handle High Inquiry Volume
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              If you receive dozens of property inquiries each week, this
              system converts them into scheduled viewings without adding
              extra admin workload.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Already using a CRM or calendar? Great. We wrap around your
              existing workflow and add the automated conversation layer.
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
