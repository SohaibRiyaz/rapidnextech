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
    title: "Slow Reply Loops",
    description:
      "Agents manually responding across portals, WhatsApp, and website chat leads to delays and missed opportunities.",
  },
  {
    icon: Clock,
    title: "Cold Leads Fast",
    description:
      "Property inquiries go cold within hours. If you do not reply instantly, buyers move on to the next listing.",
  },
  {
    icon: ListX,
    title: "Unqualified Buyers",
    description:
      "Time is wasted on leads with the wrong budget, location, or timeline because there is no qualification step.",
  },
  {
    icon: CalendarX,
    title: "Missed Follow-Ups",
    description:
      "Prospects who inquire but do not book a viewing are rarely nurtured back into a site visit.",
  },
  {
    icon: BarChart3,
    title: "No Channel Visibility",
    description:
      "Teams cannot see which channels or listings convert best, so ad spend and agent time are misallocated.",
  },
]

export function ProblemSection() {
  return (
    <section className="py-20 md:py-28 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left column */}
          <div className="lg:sticky lg:top-32">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              The Problem
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-6">
              Most Agencies Lose{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                30 - 40%
              </span>{" "}
              of Property Inquiries
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Portals, ads, and WhatsApp bring high-intent buyers. But without
              instant replies and structured qualification, the best leads
              disappear before a viewing is even scheduled.
            </p>
          </div>

          {/* Right column - problem cards */}
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
