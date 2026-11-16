import type { ReactNode } from "react"
import { CalendarPlus, PhoneForwarded, ShieldCheck, Siren, type LucideIcon } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { SecurityNote } from "./security-note"
import { card, sectionAnchor, sectionY } from "./styles"

/**
 * /dental only: "The details". Moved unchanged from the old /solutions/dental-clinics page (now a
 * redirect to /dental), so that page's unique content lives on the single dental page.
 */

const captured = [
  "Name and phone number",
  "New or existing patient",
  "Reason for visit",
  "Urgency or pain level",
  "Insurance",
  "Preferred days and times",
]

function DetailBlock({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className={`${card} p-6 md:p-8`}>
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mb-3 text-xl font-semibold text-card-foreground">{title}</h3>
      <div className="space-y-3 leading-relaxed text-muted-foreground">{children}</div>
    </div>
  )
}

export function DentalDetails() {
  const { copy } = siteConfig
  return (
    <section id="details" aria-labelledby="details-title" className={`${sectionY} ${sectionAnchor}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">The details</p>
          <h2 id="details-title" className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            What your front desk should know
          </h2>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <DetailBlock icon={PhoneForwarded} title="Call forwarding and your phone system">
            <p>
              Forward calls from your existing number to your AI line on a schedule (after hours and weekends), when
              nobody answers after a few rings, or both.
            </p>
            <p>
              Works with {copy.phoneSystems.join(", ")} and standard landlines. We set it up together on a short
              screen-share and test it live. {copy.goLive}
            </p>
            <p>Patients keep dialing the same number and caller ID passes through. To stop, turn off forwarding.</p>
          </DetailBlock>

          <DetailBlock icon={Siren} title="Dental emergencies">
            <p>{copy.emergencies}</p>
            <p>
              You decide what counts as an emergency (for example toothache, broken tooth, swelling or trauma) and
              where it goes, during your onboarding call.
            </p>
          </DetailBlock>

          <DetailBlock icon={CalendarPlus} title="Appointment requests and your practice software">
            <p>The AI captures appointment requests 24/7:</p>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {captured.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              It sends a summary to your front desk, your team confirms with the patient, and the AI tells callers
              when to expect a confirmation call. It works alongside {copy.practiceSoftware.join(", ")} and any
              other practice software. Direct scheduling integration is coming soon.
            </p>
          </DetailBlock>

          <DetailBlock icon={ShieldCheck} title="Insurance questions">
            <p>
              Answered from your practice&apos;s own accepted-insurance list, which you give us at setup. Anything
              else is captured for your front desk to follow up.
            </p>
            {siteConfig.supportsSpanish ? <p>{copy.spanish}</p> : null}
          </DetailBlock>
        </div>

        <SecurityNote className="mx-auto mt-6 max-w-6xl" />
      </div>
    </section>
  )
}
