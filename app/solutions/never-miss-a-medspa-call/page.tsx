import type { Metadata } from "next"
import { Bebas_Neue, Cormorant_Garamond, Syne } from "next/font/google"
import Link from "next/link"
import { MedSpaVoiceLanding } from "@/components/solutions/medspa-voice-landing/MedSpaVoiceLanding"
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
  title: "AI Voice Receptionist for Med Spas - Never Miss a Call",
  description:
    "Every call answered in under 2 rings, 24/7. Consultations booked automatically for US med spas in Texas, Florida, California, Georgia, and Arizona. From $397/month after a free demo.",
  alternates: { canonical: "https://rapidnextech.com/solutions/never-miss-a-medspa-call" },
  openGraph: {
    title: "AI Voice Receptionist for Med Spas | RapidNexTech",
    description:
      "Stop losing revenue to missed calls. AI answers in 2 rings, books consultations, works nights and weekends.",
    type: "website",
    url: "https://rapidnextech.com/solutions/never-miss-a-medspa-call",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech - AI Voice Receptionist for Med Spas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Voice Receptionist for Med Spas | RapidNexTech",
    description:
      "Stop losing revenue to missed calls. AI answers in 2 rings, books consultations, works nights and weekends.",
    images: ["/og-image.png"],
  },
}

const pagePath = "/solutions/never-miss-a-medspa-call"
const medSpaFaqs = [
  {
    question: "Can the AI receptionist book consultations for med spas?",
    answer:
      "Yes. It answers common questions, captures lead details, and can route qualified callers to your booking link or scheduling workflow based on the process you approve.",
  },
  {
    question: "Does it answer after-hours and weekend calls?",
    answer:
      "Yes. The system answers 24/7 so Botox, filler, laser, and consultation inquiries are captured even when your front desk is closed.",
  },
  {
    question: "Can it handle treatment pricing questions?",
    answer:
      "Yes. We configure approved pricing ranges, package guidance, membership notes, and escalation rules so callers get useful answers without the AI overpromising.",
  },
  {
    question: "Will it sound like our brand?",
    answer:
      "Yes. Voice, tone, greeting, business information, service menu, and handoff rules are configured around your med spa before launch.",
  },
  {
    question: "How does the demo process work?",
    answer:
      "We build a test version for your med spa so you can hear it answer realistic patient calls before approving the final workflow.",
  },
]

function MedSpaRelatedContent() {
  return (
    <section className="bg-[var(--medspa-bg-primary)] px-5 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[var(--medspa-border)] bg-[var(--medspa-bg-card)] p-8 md:p-10">
        <p className="medspa-syne text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--medspa-text-secondary)]">
          Med spa automation resources
        </p>
        <h2 className="medspa-bebas mt-3 text-3xl leading-tight tracking-wide text-[var(--medspa-text-primary)]">
          Capture more consult calls before they call another clinic.
        </h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Link href="/solutions/aesthetic-clinics" className="rounded-xl border border-[var(--medspa-border)] p-4 text-sm text-[var(--medspa-text-secondary)] hover:border-[var(--medspa-accent-gold)] hover:text-[var(--medspa-accent-gold)]">
            WhatsApp and DM automation for aesthetic clinics
          </Link>
          <Link href="/blog/ai-receptionist-medical-spa" className="rounded-xl border border-[var(--medspa-border)] p-4 text-sm text-[var(--medspa-text-secondary)] hover:border-[var(--medspa-accent-gold)] hover:text-[var(--medspa-accent-gold)]">
            AI receptionist for medical spas
          </Link>
          <Link href="/blog/reduce-no-shows-aesthetic-clinic" className="rounded-xl border border-[var(--medspa-border)] p-4 text-sm text-[var(--medspa-text-secondary)] hover:border-[var(--medspa-accent-gold)] hover:text-[var(--medspa-accent-gold)]">
            Reduce no-shows at aesthetic clinics
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function NeverMissAMedspaCallPage() {
  return (
    <div className={`${bebas.variable} ${cormorant.variable} ${syne.variable} medspa-voice-fonts`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Solutions", path: "/services#solutions" },
            { name: "Med Spa Voice Receptionist", path: pagePath },
          ]),
          serviceSchema({
            name: "AI Voice Receptionist for Med Spas",
            description: metadata.description as string,
            path: pagePath,
            areaServed: ["US", "Texas", "Florida", "California", "Georgia", "Arizona"],
            serviceType: "AI voice receptionist for med spas",
          }),
          faqSchema(medSpaFaqs),
        ])}
      />
      <MedSpaVoiceLanding />
      <MedSpaRelatedContent />
    </div>
  )
}
