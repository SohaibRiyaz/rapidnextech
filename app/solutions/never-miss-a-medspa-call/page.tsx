import type { Metadata } from "next"
import { Bebas_Neue, Cormorant_Garamond, Syne } from "next/font/google"
import { MedSpaVoiceLanding } from "@/components/solutions/medspa-voice-landing/MedSpaVoiceLanding"

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
  title: "AI Voice Receptionist for Med Spas — Never Miss a Call",
  description:
    "Every call answered in under 2 rings, 24/7. Consultations booked automatically for US med spas in Texas, Florida, California, Georgia, and Arizona. From $397/month after a free demo.",
  alternates: { canonical: "https://rapidnextech.com/solutions/never-miss-a-medspa-call" },
  openGraph: {
    title: "AI Voice Receptionist for Med Spas | RapidNexTech",
    description:
      "Stop losing revenue to missed calls. AI answers in 2 rings, books consultations, works nights and weekends.",
    type: "website",
    url: "https://rapidnextech.com/solutions/never-miss-a-medspa-call",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech — AI Voice Receptionist for Med Spas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Voice Receptionist for Med Spas | RapidNexTech",
    description:
      "Stop losing revenue to missed calls. AI answers in 2 rings, books consultations, works nights and weekends.",
    images: ["/og-image.png"],
  },
}

export default function NeverMissAMedspaCallPage() {
  return (
    <div className={`${bebas.variable} ${cormorant.variable} ${syne.variable} medspa-voice-fonts`}>
      <MedSpaVoiceLanding />
    </div>
  )
}
