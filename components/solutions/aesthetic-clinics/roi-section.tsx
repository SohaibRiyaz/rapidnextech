import { Zap, Clock, UserCheck, CheckSquare } from "lucide-react"

const outcomes = [
  {
    icon: Zap,
    title: "Under 60 Seconds — Instant Replies",
    description:
      "Patients answered before they message another clinic. Speed wins the booking.",
  },
  {
    icon: Clock,
    title: "Works 24/7 — Never Closed",
    description:
      "Most inquiries come in the evening. Mornings start with new bookings, not missed messages.",
  },
  {
    icon: UserCheck,
    title: "Less Work for Staff",
    description:
      "Your front desk stops repeating itself and focuses on patients in the clinic.",
  },
  {
    icon: CheckSquare,
    title: "Every Lead Captured",
    description:
      "No message ignored. Every inquiry followed through to a booking request.",
  },
]

export function ROISection() {
  return (
    <section id="why-it-works" className="py-20 md:py-28 theme-transition">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Why It Works
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Built to Turn More{" "}
            <span className="theme-gradient-text bg-clip-text text-transparent">
              Inquiries Into Bookings
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every part of this system is built around one goal: making sure your clinic
            converts more patients, with less manual work.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {outcomes.map((outcome) => (
            <div
              key={outcome.title}
              className="flex gap-4 p-6 rounded-2xl border border-border bg-card/60 hover:border-border/80 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <outcome.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{outcome.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {outcome.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
