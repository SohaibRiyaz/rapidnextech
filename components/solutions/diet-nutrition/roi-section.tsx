import {
  Zap,
  TrendingUp,
  BellOff,
  Repeat,
} from "lucide-react"

const outcomes = [
  {
    icon: Zap,
    metric: "< 30 seconds",
    title: "Faster Response Time",
    description:
      "Automated WhatsApp responses engage prospects within seconds, preventing drop-offs and lost inquiries.",
  },
  {
    icon: TrendingUp,
    metric: "Up to 2x",
    title: "Higher Booking Rate",
    description:
      "Structured qualification plus instant scheduling converts more inquiries into paid consultations or plan signups.",
  },
  {
    icon: BellOff,
    metric: "20-30% fewer",
    title: "Lower No-Shows",
    description:
      "Automated reminders and confirmation nudges reduce missed consultations and improve attendance.",
  },
  {
    icon: Repeat,
    metric: "35%+ lift",
    title: "Recurring Plan Revenue",
    description:
      "Renewal and check-in campaigns keep clients on subscription plans and boost retention without manual follow-up.",
  },
]

export function ROISection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Return on Investment
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Built to Increase {" "}
            <span className="theme-gradient-text bg-clip-text text-transparent">Plan Signups</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every component of this system is designed around a measurable outcome.
            Here is what changes when you automate your nutrition workflow.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {outcomes.map((outcome) => (
            <div
              key={outcome.title}
              className="group p-6 rounded-xl border border-border bg-card/60 text-center hover:border-border/80 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <outcome.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold theme-gradient-text bg-clip-text text-transparent mb-1">
                {outcome.metric}
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                {outcome.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {outcome.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
