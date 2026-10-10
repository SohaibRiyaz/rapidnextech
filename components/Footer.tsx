"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin, Mail, Facebook, Instagram, ArrowRight, Phone } from "lucide-react"
import { useThemeContext } from "@/context/theme-context"
import { servicesData } from "@/lib/services-data"
import { siteConfig, telHref } from "@/lib/site-config"
import { trackEvent } from "@/lib/analytics"

const linkClass =
  "theme-text opacity-80 hover:opacity-100 hover:text-primary transition-colors text-sm inline-flex min-h-[32px] items-center"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { mode, color } = useThemeContext()

  return (
    <footer className="theme-bg border-t border-primary/10 py-12 theme-transition relative overflow-hidden">

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 lg:col-span-3">
            <Link href="/" className="flex items-center gap-2 mb-6 group" aria-label="RapidNexTech home">
              <div className="relative h-8 w-8 transition-transform group-hover:scale-105">
                <Image
                  src={color === "white" || (mode === "light" && color !== "black") ? "/symbol-blue.png" : "/symbol-white.png"}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative h-8 w-40 transition-transform group-hover:scale-105 ml-1 mt-1">
                <Image
                  src={color === "white" || (mode === "light" && color !== "black") ? "/header-logo-blue.png" : "/header-logo-white.png"}
                  alt="RapidNexTech"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="theme-text opacity-80 text-sm leading-relaxed mb-6">
              AI receptionist for US dental practices. Every after-hours, weekend and overflow call answered, and every
              request sent to your front desk.
            </p>
            <div className="flex gap-2">
              {[
                { href: "https://github.com/RapidNexTech", label: "GitHub", Icon: Github },
                { href: "https://twitter.com/RapidNexTech", label: "Twitter", Icon: Twitter },
                { href: "https://linkedin.com/company/RapidNexTech", label: "LinkedIn", Icon: Linkedin },
                { href: "https://facebook.com/RapidNexTech", label: "Facebook", Icon: Facebook },
                { href: "https://instagram.com/RapidNexTech", label: "Instagram", Icon: Instagram },
              ].map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-lg theme-text opacity-80 hover:opacity-100 hover:text-primary transition-colors"
                >
                  <Icon size={20} aria-hidden="true" />
                  <span className="sr-only">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* AI receptionist + company */}
          <div className="lg:col-span-3">
            <h3 className="font-bold theme-text mb-4">AI Receptionist</h3>
            <ul className="space-y-2">
              <li><Link href="/" className={linkClass}>AI Receptionist for Dentists</Link></li>
              <li><Link href="/solutions/dental-clinics" className={linkClass}>How it works for dental practices</Link></li>
              <li><Link href="/#pricing" className={linkClass}>Pricing</Link></li>
              <li><Link href="/#pilot" className={linkClass}>14-day free pilot</Link></li>
            </ul>

            <h3 className="font-bold theme-text mb-4 mt-8">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className={linkClass}>About Us</Link></li>
              <li><Link href="/careers" className={linkClass}>Careers</Link></li>
              <li><Link href="/contact" className={linkClass}>Contact</Link></li>
            </ul>
          </div>

          {/* Software */}
          <div className="lg:col-span-3">
            <Link href="/software" className="group flex items-center gap-2 mb-4">
              <h3 className="font-bold theme-text group-hover:text-primary transition-colors">Software</h3>
              <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" aria-hidden="true" />
            </Link>
            <ul className="space-y-1">
              {Object.entries(servicesData).map(([slug, service]) => (
                <li key={slug}>
                  <Link href={`/services/${slug}`} className={linkClass}>
                    {service.title}
                  </Link>
                </li>
              ))}
              <li><Link href="/case-studies" className={linkClass}>Case Studies</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-bold theme-text mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={telHref(siteConfig.publicPhone)}
                  onClick={() => trackEvent("tel_click_public", { location: "footer" })}
                  className={`${linkClass} gap-2 whitespace-nowrap`}
                >
                  <Phone size={16} aria-hidden="true" />
                  US: {siteConfig.publicPhone.display}
                </a>
              </li>
              <li>
                <a href={telHref(siteConfig.ukPhone)} className={`${linkClass} gap-2 whitespace-nowrap`}>
                  <Phone size={16} aria-hidden="true" />
                  UK: {siteConfig.ukPhone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className={`${linkClass} gap-2 whitespace-nowrap`}>
                  <Mail size={16} aria-hidden="true" />
                  {siteConfig.email}
                </a>
              </li>
              <li className="theme-text opacity-80 text-sm leading-relaxed pt-1">
                38 Scotia Road, Stoke-on-Trent, ST6 4EP, UK
              </li>
              <li><Link href="/blog" className={linkClass}>Blog</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="theme-text opacity-70 text-sm">
            © {currentYear} RapidNexTech. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className={linkClass}>
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className={linkClass}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
