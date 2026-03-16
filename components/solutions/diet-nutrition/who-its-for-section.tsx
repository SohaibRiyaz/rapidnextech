import { CheckCircle2 } from "lucide-react"

const segments = [
  {
    title: "Online Diet Coaching Businesses",
    badge: "Best Fit",
    description:
      "High volume of DMs and WhatsApp questions. Automated qualification and booking keeps coaches focused on paying clients instead of manual back-and-forth.",
    economics: "GBP 120-300/mo average client value",
  },
  {
    title: "Meal Plan Subscription Brands",
    badge: null,
    description:
      "Subscription plans depend on quick answers, fast checkout, and renewal nudges. Automation handles the entire inquiry to signup flow.",
    economics: "GBP 40-120/mo recurring revenue",
  },
  {
    title: "Nutrition Clinics & Dietitians",
    badge: null,
    description:
      "Consultation-based clinics need pre-qualification and intake data. Automation reduces no-shows and keeps calendars full.",
    economics: "GBP 60-150 per consultation",
  },
  {
    title: "Fitness Transformation Programs",
    badge: null,
    description:
      "12-week or 90-day programs need consistent follow-up and re-engagement. Automation improves conversion and retention.",
    economics: "GBP 500-1,500 per program",
  },
]

export function WhoItsForSection() {
  return (
    <section className="py-20 md:py-28 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Who This Is For
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-6">
              Built for Brands Where {" "}
              <span className="theme-gradient-text bg-clip-text text-transparent">
                Consistency Drives Results
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              The highest ROI comes from businesses that rely on repeat check-ins and
              recurring plans. Every reminder and follow-up protects your revenue.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Already using Calendly or Google Calendar? Great. If not, we can build a
              lightweight booking or plan checkout page on your website.
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
