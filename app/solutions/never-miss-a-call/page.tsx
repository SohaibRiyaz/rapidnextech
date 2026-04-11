import type { Metadata } from "next"
import { Bebas_Neue, Cormorant_Garamond, Syne } from "next/font/google"
import { HomeServiceVoiceLanding } from "@/components/solutions/home-service-voice-landing/HomeServiceVoiceLanding"

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
  title: "AI Call Answering for HVAC & Plumbing Contractors | RapidNexTech",
  description:
    "Never miss a job call again. Our AI dispatcher answers every HVAC, plumbing, and electrical call 24/7 — captures job details, books the service, and notifies your team instantly. Free first month.",
  alternates: { canonical: "https://rapidnextech.com/solutions/never-miss-a-call" },
  openGraph: {
    title: "AI Call Answering for HVAC & Plumbing Contractors | RapidNexTech",
    description:
      "Never miss a job call again. Our AI dispatcher answers every HVAC, plumbing, and electrical call 24/7 — captures job details, books the service, and notifies your team instantly.",
    type: "website",
    url: "https://rapidnextech.com/solutions/never-miss-a-call",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech — AI Call Answering for HVAC & Plumbing Contractors" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Call Answering for HVAC & Plumbing Contractors | RapidNexTech",
    description:
      "Never miss a job call again. Our AI dispatcher answers every HVAC, plumbing, and electrical call 24/7 — captures job details, books the service, and notifies your team instantly.",
    images: ["/og-image.png"],
  },
}

export default function NeverMissACallPage() {
  return (
    <div className={`${bebas.variable} ${cormorant.variable} ${syne.variable} medspa-voice-fonts`}>
      <HomeServiceVoiceLanding />
    </div>
  )
}
