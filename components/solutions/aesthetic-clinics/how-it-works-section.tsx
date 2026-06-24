import { MessageSquare, BrainCircuit, CalendarCheck } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Patient messages your WhatsApp",
    description:
      "A patient messages your existing clinic WhatsApp — in Roman Urdu, English, or a mix. The assistant picks it up instantly, any time of day.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Assistant replies, answers & qualifies",
    description:
      "Within seconds it responds naturally, handles their questions about treatments, timings and pricing, and figures out what they need. No staff effort required.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Booking request lands with your team",
    description:
      "When the patient is ready, it collects their name and number and sends a confirmed booking request directly to your team. You confirm the timing — you stay in control.",
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
            From Message to{" "}
            <span className="theme-gradient-text bg-clip-text text-transparent">
              Booked Consultation
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three steps. Zero manual effort on your end.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Connector line between steps */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+2.5rem)] right-[calc(-50%+2.5rem)] h-px bg-border z-0" />
              )}

              {/* Step circle */}
              <div className="relative z-10 w-20 h-20 rounded-full border-2 border-primary/30 bg-background flex items-center justify-center mb-5">
                <step.icon className="w-7 h-7 text-primary" />
              </div>

              <span className="text-xs font-mono font-bold text-muted-foreground mb-2">
                Step {step.number}
              </span>
              <h3 className="text-base font-semibold text-foreground mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-muted/30 p-5 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Important:</span>{" "}
            It doesn&apos;t replace your booking system or calendar. It sits on top — your schedule,
            doctors, and workflow stay exactly as they are.
          </p>
        </div>
      </div>
    </section>
  )
}
