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
    title: "Patient sends an inquiry",
    description:
      "A potential patient messages your clinic via Instagram DM, WhatsApp, Facebook Messenger, or your website chat. The system picks it up instantly.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "AI Sales Rep responds and qualifies with predictive scoring",
    description:
      "Within seconds, your AI Sales Rep gives on-brand answers and uses predictive lead scoring (trained on your past successful bookings) to identify hot leads and route them straight to your booking page.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Patient is guided to your booking page",
    description:
      "Once qualified, the AI sends a direct link to book through your existing booking system or calendar. We never manage your schedule.",
  },
  {
    number: "04",
    icon: BellRing,
    title: "Confirmation & reminder sent automatically",
    description:
      "After booking, the patient receives a WhatsApp confirmation and pre-appointment reminders at configured intervals, reducing no-shows without any staff effort.",
  },
  {
    number: "05",
    icon: RefreshCw,
    title: "Post-treatment follow-up & rebooking",
    description:
      "After their appointment, patients automatically receive follow-up messages and rebooking reminders when their next treatment is due \u2014 based on treatment-specific timelines.",
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
            <span className="theme-gradient-text bg-clip-text text-transparent">Appointment</span>{" "}
            in Minutes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A five-step automated workflow that converts interest into confirmed
            bookings &mdash; with zero manual effort.
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
            Patients book directly on your existing platform. We only send them the link — we never manage, override,
            or compete with your current booking/HR system.
          </p>
        </div>

        {/* Visual flow diagram */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium border border-blue-500/20">
            Inquiry
          </span>
          <span className="text-muted-foreground">&rarr;</span>
          <span className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium border border-violet-500/20">
            AI Conversation
          </span>
          <span className="text-muted-foreground">&rarr;</span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20">
            Booking Link Sent
          </span>
          <span className="text-muted-foreground">&rarr;</span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">
            Patient Books on Your Platform
          </span>
        </div>
      </div>
    </section>
  )
}
