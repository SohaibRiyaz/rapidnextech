import { ArrowRight, Clock, Moon, PhoneMissed, Search, Sun, Voicemail } from "lucide-react"
import { SectionHeading } from "./section-heading"
import { card, sectionY } from "./styles"

const windows = [
  {
    icon: Moon,
    title: "After 5pm",
    text: "The front desk has gone home. A patient with a cracked tooth calls at 8pm and hears your voicemail greeting.",
  },
  {
    icon: Sun,
    title: "At lunch and in busy hours",
    text: "Your team is checking patients in and out. The phone rings out while a new patient is trying to book.",
  },
  {
    icon: Clock,
    title: "On weekends and holidays",
    text: "Swelling and toothaches don't wait for Monday. Neither do people choosing a new dentist.",
  },
]

const flow = [
  { icon: PhoneMissed, label: "The call isn't answered" },
  { icon: Voicemail, label: "It goes to voicemail" },
  { icon: Search, label: "The patient searches Google" },
  { icon: ArrowRight, label: "They book with the next dentist" },
]

export function DentalProblem() {
  return (
    <section aria-labelledby="problem-title" className={`${sectionY} bg-muted/40`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          id="problem-title"
          eyebrow="The problem"
          title="What happens to your calls after 5pm, at lunch, and on weekends?"
          intro="Most patients don't leave a message. They hang up and call the next practice on the list."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {windows.map(({ icon: Icon, title, text }) => (
            <div key={title} className={`${card} p-6`}>
              <Icon className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="What happens to a missed call">
          {flow.map(({ icon: Icon, label }, i) => (
            <li key={label} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-foreground">
                <span className="sr-only">Step {i + 1}: </span>
                {label}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-2xl border border-primary/25 bg-primary/5 p-6 md:p-8">
          <h3 className="text-xl font-semibold text-foreground md:text-2xl">
            New patients and emergencies are the calls you can least afford to miss.
          </h3>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            A new patient shopping for a dentist will call the next practice if nobody answers. A patient with a
            toothache, a broken tooth, swelling or trauma needs to hear from someone now. These callers are the most
            valuable to your practice, and the most likely to be lost to voicemail.
          </p>
        </div>
      </div>
    </section>
  )
}
