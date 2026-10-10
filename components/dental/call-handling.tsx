import {
  AlarmClock,
  CalendarClock,
  CalendarPlus,
  FileText,
  Languages,
  PhoneMissed,
  ShieldCheck,
  Siren,
  UserPlus,
  type LucideIcon,
} from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { SectionHeading } from "./section-heading"
import { card, sectionY } from "./styles"

type Item = { icon: LucideIcon; title: string; text: string }

export function getCallHandlingItems(): Item[] {
  const items: Item[] = [
    {
      icon: UserPlus,
      title: "New-patient inquiries",
      text: "Captures name, phone, reason for visit, insurance and preferred days and times.",
    },
    {
      icon: Siren,
      title: "Dental emergencies",
      text: `Toothache, broken tooth, swelling or trauma. ${siteConfig.copy.emergencies}`,
    },
    {
      icon: ShieldCheck,
      title: "Insurance questions",
      text: "Answered from your practice's accepted-insurance list. Anything else is captured for front-desk follow-up.",
    },
    {
      icon: CalendarPlus,
      title: "Appointment requests",
      text: "Captured 24/7 and sent to your front desk to confirm. Callers are told when to expect a confirmation call.",
    },
    {
      icon: CalendarClock,
      title: "Recall & hygiene requests",
      text: "Cleaning and recall requests are captured with preferred times, ready for your team to schedule.",
    },
    {
      icon: AlarmClock,
      title: "After-hours & weekend coverage",
      text: "Evenings, weekends and holidays, answered every time instead of going to voicemail.",
    },
    {
      icon: PhoneMissed,
      title: "Missed calls during busy hours",
      text: "When nobody picks up after a few rings, the call is answered instead of lost.",
    },
    {
      icon: FileText,
      title: "Instant front-desk summaries",
      text: "Every call becomes a clear email summary for your front desk: who called, why, and how urgent it is.",
    },
  ]
  if (siteConfig.supportsSpanish) {
    items.push({ icon: Languages, title: "Spanish-speaking callers", text: siteConfig.copy.spanish })
  }
  return items
}

export function DentalCallHandling() {
  const items = getCallHandlingItems()
  const pms = siteConfig.copy.practiceSoftware.join(", ")
  return (
    <section aria-labelledby="handles-title" className={sectionY}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          id="handles-title"
          eyebrow="What it handles"
          title="Built for the calls a dental front desk gets every day"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, text }) => (
            <li key={title} className={`${card} flex gap-4 p-5`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-card-foreground">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-8 max-w-3xl text-center text-muted-foreground">
          Works alongside {pms} and any other practice software. Requests go straight to your front desk.
          Direct scheduling integration is coming soon.
        </p>
      </div>
    </section>
  )
}
