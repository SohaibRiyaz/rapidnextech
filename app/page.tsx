import type { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowRight, Bot, MessageSquareText, PhoneCall } from "lucide-react"
import { HeroSection } from "../components/hero-section"

export const metadata: Metadata = {
  title: "Custom Software & AI Automation for Growing Businesses",
  description:
    "RapidNexTech builds custom software, scalable SaaS platforms, and AI automation systems for growing businesses across the US, GCC, UK, and global markets.",
  alternates: { canonical: "https://rapidnextech.com" },
  openGraph: {
    title: "Custom Software & AI Automation for Growing Businesses | RapidNexTech",
    description:
      "Build production-ready software, SaaS platforms, and AI automation systems with RapidNexTech.",
    url: "https://rapidnextech.com",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RapidNexTech custom software and AI automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Software & AI Automation for Growing Businesses | RapidNexTech",
    description:
      "Build production-ready software, SaaS platforms, and AI automation systems with RapidNexTech.",
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

const solutionCards = [
  {
    title: "Aesthetic Clinic Automation",
    description:
      "AI receptionist and WhatsApp automation for Dubai and GCC clinics that need faster inquiry response, booking follow-up, and rebooking flows.",
    href: "/solutions/aesthetic-clinics",
    icon: MessageSquareText,
  },
  {
    title: "Home-Service Call Answering",
    description:
      "24/7 AI call answering for HVAC, plumbing, and electrical contractors in the US so urgent job calls do not hit voicemail.",
    href: "/solutions/never-miss-a-call",
    icon: PhoneCall,
  },
  {
    title: "Med Spa Voice Receptionist",
    description:
      "AI voice receptionist for US med spas that answers after-hours calls, captures lead details, and helps book consultations.",
    href: "/solutions/never-miss-a-medspa-call",
    icon: Bot,
  },
]

function AiAutomationSolutions() {
  return (
    <section className="theme-bg theme-transition py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-4">
            AI Automation Solutions
          </p>
          <h2 className="text-3xl md:text-5xl font-bold theme-text mb-5">
            Practical AI systems for the workflows that lose revenue fastest.
          </h2>
          <p className="text-lg text-muted-foreground">
            Alongside custom software and SaaS engineering, we build focused AI receptionist and automation systems for clinics, contractors, and service teams.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {solutionCards.map((solution) => {
            const Icon = solution.icon
            return (
              <Link
                key={solution.href}
                href={solution.href}
                className="group rounded-3xl border border-border/70 bg-background/70 p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold theme-text mb-3 group-hover:text-primary transition-colors">
                  {solution.title}
                </h3>
                <p className="text-sm leading-7 text-muted-foreground mb-6">
                  {solution.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  View solution <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Dynamic imports for below-the-fold sections:
// CompanyCarousel is decorative motion; FeaturedWorkSection fetches CMS/project cards;
// TestimonialsSection is social proof; ProjectCTA is the lower-page contact CTA.
const StatsSection = dynamic(() => import("../components/stats-section").then((mod) => mod.StatsSection), { loading: SectionLoader })
const CompanyCarousel = dynamic(() => import("../components/company-carousel").then((mod) => mod.CompanyCarousel), { loading: SectionLoader })
const ServicesBento = dynamic(() => import("../components/services-bento").then((mod) => mod.ServicesBento), { loading: SectionLoader })
const ScrollSection = dynamic(() => import("../components/scroll-section").then((mod) => mod.ScrollSection), { loading: SectionLoader })
const TestimonialsSection = dynamic(() => import("../components/testimonials-section").then((mod) => mod.TestimonialsSection), { loading: SectionLoader })
const ProcessSection = dynamic(() => import("../components/process-section").then((mod) => mod.ProcessSection), { loading: SectionLoader })
const FeaturedWorkSection = dynamic(() => import("../components/featured-work").then((mod) => mod.FeaturedWorkSection), { loading: SectionLoader })
const ProjectCTA = dynamic(() => import("../components/shared/ProjectCTA").then((mod) => mod.ProjectCTA), { loading: SectionLoader })

export default function Home() {
  return (
    <div className="bg-transparent theme-transition">
      <HeroSection />
      <AiAutomationSolutions />
      <CompanyCarousel />
      <StatsSection />
      <ServicesBento />
      <ScrollSection />
      <FeaturedWorkSection />
      <TestimonialsSection />
      <ProcessSection />
      <ProjectCTA />
    </div>
  )
}
