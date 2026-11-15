import {
  Activity,
  ArrowDown,
  ArrowRight,
  Baby,
  BellRing,
  CalendarCheck,
  Check,
  ClipboardList,
  Clock,
  FlaskConical,
  Hand,
  Languages,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  MessagesSquare,
  Mic,
  PhoneCall,
  PhoneMissed,
  Rocket,
  ScanFace,
  Siren,
  Smile,
  Sparkles,
  Stethoscope,
  Undo2,
  type LucideIcon,
} from "lucide-react"
import { SectionHeading } from "@/components/dental/section-heading"
import { card, primaryCta, secondaryCta, sectionAnchor, sectionY } from "@/components/dental/styles"
import {
  CALLING_ADDON,
  COEXISTENCE_ENABLED,
  LANGUAGES_NOTE,
  PHONE_DEMO_NUMBER,
  PILOT,
  SETUP_WAIVED_NOTE,
  WHATSAPP_CONTACT_URL,
  WHATSAPP_DEMO_PREFILLED_URL,
  WHATSAPP_DEMO_URL,
} from "@/lib/clinics-config"
import { ScrollLink } from "./scroll-link"
import { TrackedLink } from "./tracked-link"

const container = "container mx-auto px-4 sm:px-6"

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  )
}

function CheckList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 leading-relaxed">
          <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/* 2. The problem ------------------------------------------------------------------------------ */

export function ClinicsProblem() {
  const points = [
    {
      icon: Clock,
      title: "Patients expect a reply in minutes",
      text: "An enquiry that waits until the morning, or until after Friday, can go to whichever clinic replied first.",
    },
    {
      icon: Mic,
      title: "Voice notes and two languages",
      text: "Patients send voice notes, switch between Arabic and English, and ask the same price and location questions every day.",
    },
    {
      icon: PhoneMissed,
      title: "Missed calls are missed patients",
      text: "When the front desk is busy, closed or on a weekend, calls go unanswered, and the caller may simply try another clinic.",
    },
  ]
  return (
    <section aria-labelledby="problem-title" className={sectionY}>
      <div className={container}>
        <SectionHeading
          id="problem-title"
          eyebrow="The problem"
          title="Your front desk can't answer every WhatsApp and every call"
          intro="Busy reception hours, after-hours messages and weekend calls all compete for the same small team."
        />
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {points.map((p) => (
            <div key={p.title} className={`${card} p-6`}>
              <IconBadge icon={p.icon} />
              <h3 className="mb-2 text-lg font-semibold">{p.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* 3. Built for -------------------------------------------------------------------------------- */

export function ClinicsBuiltFor() {
  const types: { icon: LucideIcon; title: string; text: string }[] = [
    { icon: Sparkles, title: "Aesthetic & cosmetic", text: "Injectables, laser, skin and body treatments, consultations." },
    { icon: Smile, title: "Dental", text: "Check-ups, whitening, implants, aligners and urgent tooth pain." },
    { icon: ScanFace, title: "Dermatology", text: "Skin concerns, procedures and follow-up appointments." },
    { icon: Activity, title: "Physiotherapy", text: "Assessments, sessions and treatment packages." },
    { icon: Baby, title: "Fertility & IVF", text: "First consultations, handled with care and quick hand-off to your team." },
    { icon: Stethoscope, title: "Medical centres", text: "Multi-specialty centres with separate departments and doctors." },
  ]
  return (
    <section aria-labelledby="built-for-title" className={`${sectionY} bg-muted/40`}>
      <div className={container}>
        <SectionHeading
          id="built-for-title"
          eyebrow="Built for"
          title="Private clinics in the Gulf and Egypt"
          intro="For owners, medical directors and practice managers who want every enquiry answered."
        />
        <ul className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((t) => (
            <li key={t.title} className={`${card} flex gap-4 p-5`}>
              <IconBadge icon={t.icon} />
              <div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* 4. Two products ----------------------------------------------------------------------------- */

export function ClinicsProducts() {
  const whatsapp = [
    "Replies instantly, 24/7, on your WhatsApp Business number",
    "Answers treatment, price-range, location and hours questions from your clinic's own information",
    "Understands text and voice notes, in English and Arabic",
    "Qualifies the enquiry (treatment, timing, budget) and captures booking requests for your team",
    "Follows up with enquiries that went quiet",
    "Escalates urgent or sensitive cases to a person",
  ]
  const calling = [
    "Answers missed calls: busy lines, after hours, Fridays and weekends",
    "Runs on a local number your clinic forwards to; you keep your existing number",
    "Answers common questions and captures booking requests",
    "Sends your team a summary after every call",
  ]
  return (
    <section id="products" aria-labelledby="products-title" className={`${sectionY} ${sectionAnchor}`}>
      <div className={container}>
        <SectionHeading
          id="products-title"
          eyebrow="Two products"
          title="One receptionist for WhatsApp and your phone"
          intro={LANGUAGES_NOTE}
        />
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <article aria-labelledby="product-whatsapp" className={`${card} flex flex-col border-2 border-primary/40 p-6 md:p-8`}>
            <div className="flex items-start justify-between gap-3">
              <IconBadge icon={MessageCircle} />
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                In every plan
              </span>
            </div>
            <h3 id="product-whatsapp" className="mb-4 text-2xl font-bold">
              WhatsApp AI receptionist
            </h3>
            <CheckList items={whatsapp} className="flex-1 text-foreground" />
            <TrackedLink
              href={WHATSAPP_DEMO_PREFILLED_URL}
              event="clinics_whatsapp_demo_click"
              params={{ location: "products" }}
              className={`${primaryCta} mt-6 w-full sm:w-auto sm:self-start`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Try the WhatsApp demo
            </TrackedLink>
          </article>

          <article aria-labelledby="product-calling" className={`${card} flex flex-col p-6 md:p-8`}>
            <div className="flex items-start justify-between gap-3">
              <IconBadge icon={PhoneCall} />
              <span className="rounded-full border border-border px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground">
                Add-on · +${CALLING_ADDON.price}/mo
              </span>
            </div>
            <h3 id="product-calling" className="mb-4 text-2xl font-bold">
              AI calling receptionist
            </h3>
            <CheckList items={calling} className="flex-1 text-foreground" />
            <ScrollLink
              targetId="voice-demo"
              event="clinics_products_calling_demo_click"
              className={`${secondaryCta} mt-6 w-full sm:w-auto sm:self-start`}
            >
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              Try the AI calling demo
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </ScrollLink>
          </article>
        </div>
      </div>
    </section>
  )
}

/* 5. You stay in control ---------------------------------------------------------------------- */

export function ClinicsControl() {
  const items: { icon: LucideIcon; title: string; text: string }[] = [
    {
      icon: Hand,
      title: "Take over any conversation",
      text: COEXISTENCE_ENABLED
        ? "Your staff can step into any chat from the dashboard, or straight from the WhatsApp Business app on their phone."
        : "Your staff can step into any chat from the dashboard.",
    },
    { icon: Undo2, title: "Hand it back in one tap", text: "When your team is done, the AI picks the conversation up again." },
    { icon: Siren, title: "Urgent cases go to a person", text: "Urgent or sensitive enquiries are escalated to your staff, following your rules." },
    { icon: LayoutDashboard, title: "See every conversation", text: "One dashboard with every chat and booking request, so nothing falls through the cracks." },
  ]
  return (
    <section aria-labelledby="control-title" className={`${sectionY} bg-muted/40`}>
      <div className={container}>
        <SectionHeading
          id="control-title"
          eyebrow="You stay in control"
          title="Your team decides. The AI does the repetitive part."
        />
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <div key={i.title} className={`${card} p-6`}>
              <IconBadge icon={i.icon} />
              <h3 className="mb-2 font-semibold">{i.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{i.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* 6. How it works ----------------------------------------------------------------------------- */

export function ClinicsHowItWorks() {
  const steps: { icon: LucideIcon; title: string; text: string }[] = [
    {
      icon: ClipboardList,
      title: "We set it up with your clinic's details",
      text: "Your treatments, prices, hours, location and rules, including what counts as urgent and who it goes to.",
    },
    {
      icon: FlaskConical,
      title: "We test and refine it with your team",
      text: "Your staff try it in English and Arabic, and we fine-tune the replies until they sound like your clinic.",
    },
    {
      icon: Rocket,
      title: "Go live on your WhatsApp number",
      text: "Patients message the number they already use. With the calling add-on, you forward missed calls to your local AI line.",
    },
  ]
  return (
    <section id="how-it-works" aria-labelledby="how-title" className={`${sectionY} ${sectionAnchor}`}>
      <div className={container}>
        <SectionHeading id="how-title" eyebrow="How it works" title="Live in three steps" />
        <ol className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className={`${card} relative p-6 md:p-8`}>
              <span className="absolute right-5 top-5 text-4xl font-bold text-primary/20" aria-hidden="true">
                {i + 1}
              </span>
              <IconBadge icon={s.icon} />
              <h3 className="mb-2 text-lg font-semibold">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h3>
              <p className="leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* 7. What it handles -------------------------------------------------------------------------- */

export function ClinicsHandles() {
  const items: { icon: LucideIcon; text: string }[] = [
    { icon: MessagesSquare, text: "Treatment and procedure questions" },
    { icon: ClipboardList, text: "Price ranges from your own price list" },
    { icon: MapPin, text: "Location and directions" },
    { icon: Clock, text: "Opening hours, Fridays and holidays" },
    { icon: Mic, text: "Voice notes in Arabic and English" },
    { icon: Languages, text: "Patients switching between Arabic and English" },
    { icon: CalendarCheck, text: "Booking requests sent to your team" },
    { icon: BellRing, text: "Follow-ups for enquiries that went quiet" },
    { icon: Siren, text: "Urgent or sensitive cases escalated to staff" },
    { icon: PhoneMissed, text: "Missed calls, with the calling add-on" },
  ]
  return (
    <section aria-labelledby="handles-title" className={`${sectionY} bg-muted/40`}>
      <div className={container}>
        <SectionHeading id="handles-title" eyebrow="What it handles" title="The questions your reception answers all day" />
        <ul className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2">
          {items.map(({ icon: Icon, text }) => (
            <li key={text} className="flex min-h-[56px] items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
              <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-card-foreground">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* 11. Final CTA ------------------------------------------------------------------------------- */

export function ClinicsFinalCta() {
  return (
    <section aria-labelledby="clinics-final-title" className={sectionY}>
      <div className={container}>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary/25 bg-card p-8 text-center shadow-xl md:p-14">
          <div className="pointer-events-none absolute inset-0 theme-glow opacity-40 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <h2 id="clinics-final-title" className="text-3xl font-bold tracking-tight text-card-foreground md:text-5xl">
              Answer every patient, even when your team can&apos;t.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Try the demo on WhatsApp now, then run it on your own clinic&apos;s number for 7 days, free.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <TrackedLink
                href={WHATSAPP_DEMO_URL}
                event="clinics_whatsapp_demo_click"
                params={{ location: "final_cta" }}
                className={primaryCta}
              >
                Try the WhatsApp demo <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </TrackedLink>
              <TrackedLink
                href={WHATSAPP_CONTACT_URL}
                event="clinics_contact_click"
                params={{ location: "final_cta" }}
                className={secondaryCta}
              >
                Talk to us on WhatsApp
              </TrackedLink>
            </div>
            {PHONE_DEMO_NUMBER ? (
              <p className="mt-3 text-sm text-muted-foreground">
                or call the demo line{" "}
                <TrackedLink
                  href={`tel:${PHONE_DEMO_NUMBER.replace(/[^\d+]/g, "")}`}
                  event="clinics_phone_demo_click"
                  params={{ location: "final_cta" }}
                  external={false}
                  className="inline-flex min-h-[48px] items-center font-semibold text-foreground underline underline-offset-4"
                >
                  {PHONE_DEMO_NUMBER}
                </TrackedLink>
              </p>
            ) : null}
            <p className="mt-6 text-sm font-medium text-foreground/80">
              {PILOT} · {SETUP_WAIVED_NOTE}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
