import type { Metadata } from "next"
import { Bebas_Neue, Cormorant_Garamond, Syne } from "next/font/google"
import Link from "next/link"
import { HomeServiceVoiceLanding } from "@/components/solutions/home-service-voice-landing/HomeServiceVoiceLanding"
import { breadcrumbSchema, faqSchema, jsonLd, serviceSchema } from "@/lib/seo"

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-medspa-bebas",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-medspa-cormorant",
  display: "swap",
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-medspa-syne",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AI Call Answering for HVAC & Plumbing Contractors - 24/7",
  description:
    "Never miss a job call again. We answer every HVAC, plumbing, and electrical call in under 2 rings, 24/7, capture job details, and notify your team instantly. Free first month.",
  alternates: { canonical: "https://rapidnextech.com/solutions/never-miss-a-call" },
  openGraph: {
    title: "AI Call Answering for HVAC & Plumbing Contractors - 24/7 | RapidNexTech",
    description:
      "Never miss a job call again. We answer every HVAC, plumbing, and electrical call in under 2 rings, 24/7, capture job details, and notify your team instantly.",
    type: "website",
    url: "https://rapidnextech.com/solutions/never-miss-a-call",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech - 24/7 Call Answering for HVAC & Plumbing Contractors" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Call Answering for HVAC & Plumbing Contractors - 24/7 | RapidNexTech",
    description:
      "Never miss a job call again. We answer every HVAC, plumbing, and electrical call in under 2 rings, 24/7, capture job details, and notify your team instantly.",
    images: ["/og-image.png"],
  },
}

const pagePath = "/solutions/never-miss-a-call"
const contractorFaqs = [
  {
    question: "Does this replace my office staff?",
    answer:
      "No. It covers overflow, after-hours, lunch breaks, weekends, and busy periods so your team can focus on dispatch and operations while every caller still gets answered.",
  },
  {
    question: "Which trades does the AI call answering system support?",
    answer:
      "It is built for HVAC, plumbing, electrical, and similar home-service contractors. We configure service areas, job types, urgency rules, and routing around your company.",
  },
  {
    question: "How fast can we launch?",
    answer:
      "Most contractors can launch in about one week after we collect your call flow, service area, emergency rules, pricing guidance, and notification preferences.",
  },
  {
    question: "What happens with emergency calls?",
    answer:
      "You define what counts as urgent. Emergency calls are flagged immediately and sent to your team with the caller name, phone number, address, job type, and call summary.",
  },
  {
    question: "Do callers need to dial a new number?",
    answer:
      "No. We can work with your existing phone setup and route calls through the answering system without forcing customers to learn a new number.",
  },
]

function ContractorRelatedContent() {
  return (
    <section className="bg-[var(--medspa-bg-primary)] px-5 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[var(--medspa-border)] bg-[var(--medspa-bg-card)] p-8 md:p-10">
        <p className="medspa-syne text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--medspa-text-secondary)]">
          Contractor growth resources
        </p>
        <h2 className="medspa-bebas mt-3 text-3xl leading-tight tracking-wide text-[var(--medspa-text-primary)]">
          Build the call-answering system around your market.
        </h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Link href="/solutions/never-miss-a-call/texas" className="rounded-xl border border-[var(--medspa-border)] p-4 text-sm text-[var(--medspa-text-secondary)] hover:border-[var(--medspa-accent-gold)] hover:text-[var(--medspa-accent-gold)]">
            Texas HVAC call answering
          </Link>
          <Link href="/blog/hvac-answering-service-vs-ai" className="rounded-xl border border-[var(--medspa-border)] p-4 text-sm text-[var(--medspa-text-secondary)] hover:border-[var(--medspa-accent-gold)] hover:text-[var(--medspa-accent-gold)]">
            HVAC answering service vs AI
          </Link>
          <Link href="/blog/missed-hvac-call-cost" className="rounded-xl border border-[var(--medspa-border)] p-4 text-sm text-[var(--medspa-text-secondary)] hover:border-[var(--medspa-accent-gold)] hover:text-[var(--medspa-accent-gold)]">
            Cost of a missed HVAC call
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function NeverMissACallPage() {
  return (
    <div className={`${bebas.variable} ${cormorant.variable} ${syne.variable} medspa-voice-fonts`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Solutions", path: "/services#solutions" },
            { name: "AI Call Answering", path: pagePath },
          ]),
          serviceSchema({
            name: "AI Call Answering for HVAC & Plumbing Contractors",
            description: metadata.description as string,
            path: pagePath,
            areaServed: ["US", "Texas", "Florida", "California", "Georgia", "Arizona"],
            serviceType: "AI call answering for home-service contractors",
          }),
          faqSchema(contractorFaqs),
        ])}
      />
      <HomeServiceVoiceLanding />
      <ContractorRelatedContent />
    </div>
  )
}
