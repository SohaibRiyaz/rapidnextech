import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CalendarCheck, MessageCircle, PhoneCall, ShieldCheck } from "lucide-react"
import { breadcrumbSchema, faqSchema, jsonLd, serviceSchema } from "@/lib/seo"

const pagePath = "/solutions/dental-clinics"

export const metadata: Metadata = {
  title: "AI Receptionist for Dental Practices - Never Miss a Patient Call",
  description:
    "RapidNexTech builds AI receptionist systems for dental clinics that answer patient calls, capture appointment requests, route emergencies, and reduce missed leads.",
  alternates: { canonical: "https://rapidnextech.com/solutions/dental-clinics" },
  openGraph: {
    title: "AI Receptionist for Dental Practices | RapidNexTech",
    description:
      "24/7 patient call handling, appointment request capture, and emergency routing for dental clinics.",
    url: "https://rapidnextech.com/solutions/dental-clinics",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI receptionist for dental practices" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Receptionist for Dental Practices | RapidNexTech",
    description:
      "24/7 patient call handling, appointment request capture, and emergency routing for dental clinics.",
    images: ["/og-image.png"],
  },
}

const dentalFaqs = [
  {
    question: "Can the AI receptionist handle new-patient calls?",
    answer:
      "Yes. It can collect name, phone, preferred appointment time, treatment interest, insurance notes, and urgency before routing the request to your team.",
  },
  {
    question: "Can it handle dental emergency calls?",
    answer:
      "Yes. You define emergency rules such as severe pain, swelling, trauma, or broken teeth, and urgent calls are flagged immediately for your team.",
  },
  {
    question: "Does it replace the front desk?",
    answer:
      "No. It supports your front desk by covering after-hours calls, overflow, lunch breaks, and busy periods so patients still get a fast response.",
  },
  {
    question: "Can it work with our existing booking system?",
    answer:
      "Yes. We can route patients to your existing booking link, capture requests for staff follow-up, or integrate with approved scheduling workflows.",
  },
]

const features = [
  {
    icon: PhoneCall,
    title: "24/7 patient call handling",
    text: "Answer new-patient, treatment, pricing, and emergency calls when your team is busy or closed.",
  },
  {
    icon: CalendarCheck,
    title: "Appointment request capture",
    text: "Collect patient details and appointment preferences so your staff can confirm bookings faster.",
  },
  {
    icon: ShieldCheck,
    title: "Emergency routing",
    text: "Flag urgent dental calls based on the escalation rules your clinic approves.",
  },
  {
    icon: MessageCircle,
    title: "Follow-up workflows",
    text: "Send call summaries and next steps into your preferred notification or CRM workflow.",
  },
]

export default function DentalClinicsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Solutions", path: "/services#solutions" },
            { name: "Dental Clinics", path: pagePath },
          ]),
          serviceSchema({
            name: "AI Receptionist for Dental Practices",
            description: metadata.description as string,
            path: pagePath,
            areaServed: ["US", "GCC", "UK", "Worldwide"],
            serviceType: "AI receptionist for dental clinics",
          }),
          faqSchema(dentalFaqs),
        ])}
      />

      <section className="px-6 py-20">
        <div className="container mx-auto grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary mb-5">
              Dental clinic AI receptionist
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight theme-text mb-6">
              AI receptionist for dental clinics that cannot afford missed patient calls.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-8 mb-8">
              Capture new-patient inquiries, dental emergency calls, hygiene booking requests, and treatment questions 24/7 without forcing your front desk to be always available.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact?topic=dental-ai-receptionist" className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 font-semibold text-white transition-transform hover:scale-[1.02]">
                Book a dental demo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/solutions/never-miss-a-medspa-call" className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3 font-semibold theme-text hover:border-primary hover:text-primary">
                Compare voice receptionist
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-card/70 p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-5">What the assistant captures</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li>Patient name and phone number</li>
              <li>Treatment or dental issue</li>
              <li>Urgency and pain level</li>
              <li>Preferred appointment time</li>
              <li>Insurance or payment notes</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-muted/30">
        <div className="container mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="rounded-3xl border border-border/70 bg-background p-6">
                <Icon className="mb-5 h-7 w-7 text-primary" />
                <h2 className="text-xl font-bold mb-3">{feature.title}</h2>
                <p className="text-sm leading-7 text-muted-foreground">{feature.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Dental AI receptionist FAQs
          </h2>
          <div className="space-y-4">
            {dentalFaqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-border/70 p-6">
                <h3 className="font-bold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground leading-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
