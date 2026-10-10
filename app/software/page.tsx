import type { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight, PhoneCall } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { siteConfig } from "@/lib/site-config"

// The former homepage (custom software / SaaS / automation), moved here unchanged apart from
// the vertical-solutions block, which now points only to the dental AI receptionist.

const SOFTWARE_CONTACT_HREF = `mailto:${siteConfig.email}?subject=${encodeURIComponent("Custom software project")}`

export const metadata: Metadata = {
  title: "Custom Software, SaaS & Automation Development",
  description:
    "RapidNexTech also builds custom software, scalable SaaS platforms, and workflow automation for growing businesses. See our services, process and case studies.",
  alternates: { canonical: "https://rapidnextech.com/software" },
  openGraph: {
    title: "Custom Software, SaaS & Automation Development | RapidNexTech",
    description:
      "Custom software, SaaS platforms, and workflow automation from the RapidNexTech engineering team.",
    url: "https://rapidnextech.com/software",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech custom software development" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Software, SaaS & Automation Development | RapidNexTech",
    description:
      "Custom software, SaaS platforms, and workflow automation from the RapidNexTech engineering team.",
    images: ["/og-image.png"],
  },
}

const SectionLoader = () => (
  <div className="min-h-[40vh] flex items-center justify-center">
    <div className="animate-pulse w-full max-w-4xl mx-auto px-4">
      <div className="h-8 bg-gray-200/20 rounded w-1/2 mb-4 mx-auto"></div>
      <div className="h-4 bg-gray-200/20 rounded w-3/4 mx-auto"></div>
    </div>
  </div>
)

function DentalProductCallout() {
  return (
    <section className="theme-bg theme-transition py-16 md:py-20">
      <div className="container mx-auto px-4">
        <Link
          href="/"
          className="group mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border border-border/70 bg-background/70 p-7 shadow-sm transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 sm:flex-row sm:items-center"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PhoneCall className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-2">Our product</p>
            <h2 className="text-xl md:text-2xl font-bold theme-text mb-2">AI receptionist for dental practices</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              24/7 call answering for US dental practices: new patients, dental emergencies, insurance questions and
              appointment requests, sent to your front desk.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </section>
  )
}

const StatsSection = dynamic(() => import("@/components/stats-section").then((mod) => mod.StatsSection), { loading: SectionLoader })
const CompanyCarousel = dynamic(() => import("@/components/company-carousel").then((mod) => mod.CompanyCarousel), { loading: SectionLoader })
const ServicesBento = dynamic(() => import("@/components/services-bento").then((mod) => mod.ServicesBento), { loading: SectionLoader })
const ScrollSection = dynamic(() => import("@/components/scroll-section").then((mod) => mod.ScrollSection), { loading: SectionLoader })
const TestimonialsSection = dynamic(() => import("@/components/testimonials-section").then((mod) => mod.TestimonialsSection), { loading: SectionLoader })
const ProcessSection = dynamic(() => import("@/components/process-section").then((mod) => mod.ProcessSection), { loading: SectionLoader })
const FeaturedWorkSection = dynamic(() => import("@/components/featured-work").then((mod) => mod.FeaturedWorkSection), { loading: SectionLoader })
const ProjectCTA = dynamic(() => import("@/components/shared/ProjectCTA").then((mod) => mod.ProjectCTA), { loading: SectionLoader })

export default function SoftwarePage() {
  return (
    <div className="bg-transparent theme-transition">
      <HeroSection primaryHref={SOFTWARE_CONTACT_HREF} />
      <CompanyCarousel />
      <StatsSection />
      <ServicesBento />
      <ScrollSection />
      <FeaturedWorkSection />
      <TestimonialsSection />
      <ProcessSection />
      <DentalProductCallout />
      <ProjectCTA href={SOFTWARE_CONTACT_HREF} />
    </div>
  )
}
