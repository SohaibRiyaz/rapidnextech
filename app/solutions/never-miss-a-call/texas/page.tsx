import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock, MapPin, PhoneCall, Zap } from "lucide-react"
import { breadcrumbSchema, faqSchema, jsonLd, serviceSchema } from "@/lib/seo"

const pagePath = "/solutions/never-miss-a-call/texas"

export const metadata: Metadata = {
  title: "AI Call Answering for HVAC Contractors in Texas - 24/7",
  description:
    "Never miss an HVAC job call in Texas. RapidNexTech's AI receptionist answers calls 24/7, captures job details, flags emergencies, and notifies your team instantly.",
  alternates: { canonical: "https://rapidnextech.com/solutions/never-miss-a-call/texas" },
  openGraph: {
    title: "AI Call Answering for HVAC Contractors in Texas | RapidNexTech",
    description:
      "24/7 AI call answering for Texas HVAC, plumbing, and electrical contractors.",
    url: "https://rapidnextech.com/solutions/never-miss-a-call/texas",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI call answering for Texas HVAC contractors" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Call Answering for HVAC Contractors in Texas | RapidNexTech",
    description:
      "24/7 AI call answering for Texas HVAC, plumbing, and electrical contractors.",
    images: ["/og-image.png"],
  },
}

const texasFaqs = [
  {
    question: "Is this only for HVAC contractors in Texas?",
    answer:
      "The page is focused on Texas HVAC contractors, but the system also supports plumbing, electrical, and other home-service companies that need 24/7 call answering.",
  },
  {
    question: "Can it route emergency AC calls differently?",
    answer:
      "Yes. You define emergency rules for no-cooling calls, elderly customers, commercial accounts, or after-hours requests, and urgent calls are flagged immediately.",
  },
  {
    question: "Does this work with my existing phone number?",
    answer:
      "Yes. We can work with your existing number and call-routing setup so customers do not need to learn a new number.",
  },
  {
    question: "How quickly can a Texas contractor launch?",
    answer:
      "Most contractors can launch in about one week after service areas, job types, emergency rules, and notification channels are approved.",
  },
]

const features = [
  {
    icon: PhoneCall,
    title: "Every call answered",
    text: "Answer AC repair, replacement, maintenance, and emergency calls without sending buyers to voicemail.",
  },
  {
    icon: Clock,
    title: "24/7 coverage",
    text: "Capture after-hours and weekend demand during Texas heat waves, busy seasons, and staff shortages.",
  },
  {
    icon: MapPin,
    title: "Texas service areas",
    text: "Configure cities, zip codes, dispatch areas, emergency rules, and crew routing around your operation.",
  },
  {
    icon: Zap,
    title: "Instant job summaries",
    text: "Send caller name, phone, address, job type, urgency, and notes to your team immediately.",
  },
]

export default function TexasCallAnsweringPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Solutions", path: "/services#solutions" },
            { name: "AI Call Answering", path: "/solutions/never-miss-a-call" },
            { name: "Texas", path: pagePath },
          ]),
          serviceSchema({
            name: "AI Call Answering for HVAC Contractors in Texas",
            description: metadata.description as string,
            path: pagePath,
            areaServed: ["Texas", "Dallas", "Houston", "Austin", "San Antonio", "Fort Worth"],
            serviceType: "AI call answering for Texas HVAC contractors",
          }),
          faqSchema(texasFaqs),
        ])}
      />

      <section className="px-6 py-20">
        <div className="container mx-auto grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary mb-5">
              Texas HVAC call answering
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight theme-text mb-6">
              Never miss an HVAC job call in Texas.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-8 mb-8">
              RapidNexTech builds AI call answering systems for Texas HVAC contractors that answer in under two rings, qualify the job, flag emergencies, and notify your team instantly.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact?topic=texas-hvac-call-answering" className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 font-semibold text-white transition-transform hover:scale-[1.02]">
                Book a Texas demo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/solutions/never-miss-a-call" className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3 font-semibold theme-text hover:border-primary hover:text-primary">
                View main call-answering page
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-card/70 p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-5">Built for Texas call patterns</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li>AC repair spikes during heat waves</li>
              <li>Emergency no-cooling calls after hours</li>
              <li>High-value replacement estimates</li>
              <li>Busy dispatchers during peak season</li>
              <li>Service-area routing across metro regions</li>
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
            Texas HVAC call-answering FAQs
          </h2>
          <div className="space-y-4">
            {texasFaqs.map((faq) => (
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
