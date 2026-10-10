import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { absolute: "Custom Software Development Services | RapidNexTech" },
  description:
    "Custom web and mobile apps, AI automation, SaaS platforms and cloud infrastructure, built by RapidNexTech, the team behind the dental AI receptionist.",
  alternates: { canonical: "https://rapidnextech.com/services" },
  openGraph: {
    title: "Custom Software Development Services | RapidNexTech",
    description:
      "Custom web and mobile apps, AI automation, SaaS platforms and cloud infrastructure, built by RapidNexTech, the team behind the dental AI receptionist.",
    url: "https://rapidnextech.com/services",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech custom software development services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Software Development Services | RapidNexTech",
    description:
      "Custom web and mobile apps, AI automation, SaaS platforms and cloud infrastructure, built by RapidNexTech, the team behind the dental AI receptionist.",
    images: ["/og-image.png"],
  },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
