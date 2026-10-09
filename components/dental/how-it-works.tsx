import { ClipboardList, PhoneForwarded, Send } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { SectionHeading } from "./section-heading"
import { anchorOffset, sectionY } from "./styles"

const steps = [
  {
    icon: PhoneForwarded,
    title: "Keep your number",
    text: "We give your practice a dedicated AI line and set up call forwarding with you: after hours, on weekends, or when nobody picks up.",
  },
  {
    icon: ClipboardList,
    title: "We set it up with your practice",
    text: "Your hours, services, accepted-insurance list and emergency rules. We test it live together on a short screen-share.",
  },
  {
    icon: Send,
    title: "It answers every forwarded call",
    text: "Each new patient, emergency and appointment request goes to your front desk instantly, with a clear summary.",
  },
]

export function DentalHowItWorks() {
  const systems = siteConfig.copy.phoneSystems.join(", ")
  return (
    <section id="how-it-works" aria-labelledby="how-title" className={`${sectionY} ${anchorOffset} bg-muted/40`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading id="how-title" eyebrow="How it works" title="Three steps. Your patients keep dialing the same number." />

        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">{title}</h3>
              <p className="leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Works with {systems} and standard phone lines. Caller ID passes through. Turn it off anytime.
        </p>
      </div>
    </section>
  )
}
