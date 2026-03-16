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
    title: "Prospect sends a WhatsApp inquiry",
    description:
      "A prospect messages about a diet plan, pricing, or coaching. The system captures it instantly from WhatsApp or website chat.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "AI qualifies their goals",
    description:
      "The AI asks about weight goals, dietary preferences, restrictions, and timeline to determine fit.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Recommendation + booking link sent",
    description:
      "Based on their answers, the system recommends a consultation or plan and sends a booking or checkout link. If you do not have one, we build a booking page.",
  },
  {
    number: "04",
    icon: BellRing,
    title: "Confirmation + reminders",
    description:
      "Clients receive confirmations and reminders before their consultation to reduce no-shows and drop-offs.",
  },
  {
    number: "05",
    icon: RefreshCw,
    title: "Subscription renewal follow-ups",
    description:
      "Automated follow-ups encourage renewals, check-ins, and plan upgrades to keep recurring revenue flowing.",
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
            <span className="theme-gradient-text bg-clip-text text-transparent">Signup</span>{" "}
            in Minutes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A five-step workflow that converts diet inquiries into consultations and paid plans without manual chasing.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="relative flex gap-6 md:gap-8">
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-primary/30 bg-background flex items-center justify-center">
                    <step.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>

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

        <div className="mt-12 rounded-xl border border-border bg-muted/30 p-5 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Important:</span>{" "}
            We do not replace your booking tool or checkout. Clients book through your existing system or a booking page we create for you.
          </p>
        </div>

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
            Booking Link Sent
          </span>
          <span className="text-muted-foreground">&rarr;</span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">
            Client Books or Pays
          </span>
        </div>
      </div>
    </section>
  )
}
