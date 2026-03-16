import {
  MessageSquare,
  BrainCircuit,
  CalendarCheck,
  BellRing,
  RefreshCw,
} from "lucide-react"

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Buyer sends a property inquiry",
    description:
      "A buyer messages you via WhatsApp, website chat, or a property listing inquiry. The system captures it instantly.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "AI qualifies the buyer",
    description:
      "The AI asks budget, location, property type, and timeline questions so you know if the lead is real.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Qualified buyers get a viewing link",
    description:
      "Qualified buyers receive a link to schedule a viewing with the right agent. If you do not have a booking tool, we create a booking page on your website.",
  },
  {
    number: "04",
    icon: BellRing,
    title: "Agent is notified instantly",
    description:
      "When a viewing is booked, the assigned agent is notified with the full lead profile and answers.",
  },
  {
    number: "05",
    icon: RefreshCw,
    title: "Automated follow-ups for undecided buyers",
    description:
      "If a buyer does not book, the system follows up with availability, similar listings, and reminders.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 theme-transition">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            From Inquiry to{" "}
            <span className="theme-gradient-text bg-clip-text text-transparent">Site Visit</span>{" "}
            in Minutes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A five-step automated workflow that turns property interest into
            confirmed viewings without manual chasing.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="relative flex gap-6 md:gap-8">
                {/* Step indicator */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-primary/30 bg-background flex items-center justify-center">
                    <step.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="pb-2 pt-1 md:pt-3">
                  <span className="text-xs font-mono font-semibold text-muted-foreground">
                    Step {step.number}
                  </span>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mt-1 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clarification banner */}
        <div className="mt-12 rounded-xl border border-border bg-muted/30 p-5 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Important:</span>{" "}
            We do not replace your CRM or calendar. Buyers book through your
            existing system or a booking page we create for you.
          </p>
        </div>

        {/* Visual flow diagram */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium border border-blue-500/20">
            Inquiry
          </span>
          <span className="text-muted-foreground">&rarr;</span>
          <span className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium border border-violet-500/20">
            Qualification
          </span>
          <span className="text-muted-foreground">&rarr;</span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20">
            Viewing Link Sent
          </span>
          <span className="text-muted-foreground">&rarr;</span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">
            Buyer Books a Visit
          </span>
        </div>
      </div>
    </section>
  )
}
