import {
  Zap,
  TrendingUp,
  BellOff,
  Repeat,
} from "lucide-react"

const outcomes = [
  {
    icon: Zap,
    metric: "< 60 seconds",
    title: "Faster Response Time",
    description:
      "Automated WhatsApp responses engage buyers within seconds, preventing leads from going cold.",
  },
  {
    icon: TrendingUp,
    metric: "2-3x",
    title: "More Qualified Viewings",
    description:
      "Structured qualification and instant booking links convert more inquiries into scheduled site visits.",
  },
  {
    icon: BellOff,
    metric: "Less wasted time",
    title: "Fewer Unqualified Leads",
    description:
      "Agents focus on serious buyers only, reducing time lost on low-intent conversations.",
  },
  {
    icon: Repeat,
    metric: "Systematic",
    title: "Consistent Follow-Up",
    description:
      "Automated nurture sequences keep your listings top of mind and recover missed opportunities.",
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
            Built to Increase{" "}
            <span className="theme-gradient-text bg-clip-text text-transparent">Viewing Conversion</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every component is designed around measurable outcomes that impact
            viewing volume and agent productivity.
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
