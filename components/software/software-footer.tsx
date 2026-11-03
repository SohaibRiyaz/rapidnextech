"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone } from "lucide-react"
import { useThemeContext } from "@/context/theme-context"
import { HostingPartnerLine } from "@/components/hosting-partner-line"
import { INDUSTRIES_HUB_PATH, START_PROJECT_PATH, industryPath, publishedIndustries } from "@/lib/industries"
import { siteConfig, telHref } from "@/lib/site-config"

const linkClass =
  "theme-text opacity-80 hover:opacity-100 hover:text-primary transition-colors text-sm inline-flex min-h-[32px] items-center"

/** Footer for the custom-software sales pages. The main site footer is unchanged elsewhere. */
export function SoftwareFooter() {
  const year = new Date().getFullYear()
  const { mode, color } = useThemeContext()
  const blueLogo = color === "white" || (mode === "light" && color !== "black")

  return (
    <footer className="theme-bg theme-transition border-t border-primary/10 py-12">
      <div className="container mx-auto px-6">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Link href="/software" className="group mb-6 flex items-center gap-2" aria-label="RapidNexTech custom software">
              <div className="relative h-8 w-8">
                <Image src={blueLogo ? "/symbol-blue.png" : "/symbol-white.png"} alt="" fill className="object-contain" />
              </div>
              <div className="relative ms-1 mt-1 h-8 w-40">
                <Image
                  src={blueLogo ? "/header-logo-blue.png" : "/header-logo-white.png"}
                  alt="RapidNexTech"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="mb-2 text-sm font-semibold theme-text">The speed you need, the technology you trust.</p>
            <p className="text-sm leading-relaxed theme-text opacity-80">
              Websites, e-commerce, business systems and automation for growing companies, built and supported by our own
              team.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h2 className="mb-4 font-bold theme-text">Industries</h2>
            <ul className="space-y-2">
              {publishedIndustries.map((industry) => (
                <li key={industry.slug}>
                  <Link href={industryPath(industry.slug)} className={linkClass}>
                    {industry.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={INDUSTRIES_HUB_PATH} className={linkClass}>
                  All industries
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="mb-4 font-bold theme-text">Explore</h2>
            <ul className="space-y-2">
              <li><Link href="/software" className={linkClass}>Software overview</Link></li>
              <li><Link href="/services" className={linkClass}>Services</Link></li>
              <li><Link href="/case-studies" className={linkClass}>Case studies</Link></li>
              <li><Link href={START_PROJECT_PATH} className={linkClass}>Start a project</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="mb-4 font-bold theme-text">Contact</h2>
            <ul className="space-y-2">
              <li>
                <a href={`mailto:${siteConfig.email}`} className={`${linkClass} gap-2`}>
                  <Mail size={16} aria-hidden="true" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a href={telHref(siteConfig.ukPhone)} className={`${linkClass} gap-2 whitespace-nowrap`}>
                  <Phone size={16} aria-hidden="true" />
                  UK: {siteConfig.ukPhone.display}
                </a>
              </li>
              <li>
                <a href={telHref(siteConfig.publicPhone)} className={`${linkClass} gap-2 whitespace-nowrap`}>
                  <Phone size={16} aria-hidden="true" />
                  US: {siteConfig.publicPhone.display}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-primary/10 pt-8 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-6">
            <p className="text-sm theme-text opacity-70">© {year} RapidNexTech. All rights reserved.</p>
            <HostingPartnerLine />
          </div>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className={linkClass}>Privacy Policy</Link>
            <Link href="/terms-of-service" className={linkClass}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
