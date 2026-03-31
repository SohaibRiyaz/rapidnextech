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
      "Staff manually responding to DMs and messages leads to inconsistent communication and overwhelmed front desks.",
  },
  {
    icon: Clock,
    title: "Slow Response Time",
    description:
      "Inquiries that go unanswered for hours lose to competitors who respond faster. Speed is the differentiator.",
  },
  {
    icon: ListX,
    title: "No Structured Follow-Ups",
    description:
      "Without automated sequences, interested leads fall through the cracks after the first interaction.",
  },
  {
    icon: BarChart3,
    title: "Zero Tracking",
    description:
      "No visibility into which channels drive bookings, which staff convert best, or where drop-off occurs.",
  },
  {
    icon: CalendarX,
    title: "Missed Rebooking",
    description:
      "Post-treatment rebooking is left to memory or manual effort, leaving the highest-LTV part of your business (repeat treatments) on the table.",
  },
]

export function ProblemSection() {
  return (
    <section id="problem" className="py-20 md:py-28 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left column */}
          <div className="lg:sticky lg:top-32">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              The Problem
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-6">
              Most Clinics Lose{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                30 &ndash; 40%
              </span>{" "}
              of Inquiries
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Aesthetic clinics in Dubai, Doha and the GCC invest heavily in Instagram ads and social media.
              Yet 30-40% of high-intent inquiries still go unanswered or unresolved because of manual replies
              and slow follow-ups. Every lost lead costs you AED 1,500–3,000+ in missed revenue — and your
              competitors who respond faster are taking those bookings.
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
