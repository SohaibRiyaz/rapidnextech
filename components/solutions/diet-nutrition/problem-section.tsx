import {
  Clock,
  MessageSquareOff,
  ListX,
  BarChart3,
  CalendarX,
} from "lucide-react"

const problems = [
  {
    icon: MessageSquareOff,
    title: "Manual Replies",
    description:
      "Diet inquiries are handled manually across WhatsApp, Instagram, and website chat, creating delays and inconsistent messaging.",
  },
  {
    icon: Clock,
    title: "Slow Response",
    description:
      "Prospects compare multiple providers. If replies are slow, they move on before booking a consultation.",
  },
  {
    icon: ListX,
    title: "No Goal Qualification",
    description:
      "Without a structured intake, teams spend time on unqualified leads who are not a fit for your plans.",
  },
  {
    icon: CalendarX,
    title: "Missed Follow-Ups",
    description:
      "Interested prospects who do not book immediately rarely get nudged back into a consultation or plan signup.",
  },
  {
    icon: BarChart3,
    title: "No Conversion Visibility",
    description:
      "You cannot see which channels drive bookings or which messages convert, making growth guesswork.",
  },
]

export function ProblemSection() {
  return (
    <section className="py-20 md:py-28 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-32">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              The Problem
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-6">
              Most Brands Lose{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                30 - 40%
              </span>{" "}
              of Diet Inquiries
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Prospects ask about pricing, plans, and coaching. Without instant replies and structured qualification, the best leads drop off before they ever book a consultation.
            </p>
          </div>

          <div className="space-y-4">
            {problems.map((problem) => (
              <div
                key={problem.title}
                className="group flex gap-4 p-5 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-border/80 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <problem.icon className="w-5 h-5 text-primary group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {problem.description}
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
