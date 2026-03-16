"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin, Mail, Facebook, Instagram, ArrowRight } from "lucide-react"
import { useThemeContext } from "@/context/theme-context"
import { servicesData } from "@/lib/services-data"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { mode, color } = useThemeContext()

  return (
    <footer className="theme-bg border-t border-primary/10 py-12 theme-transition relative overflow-hidden">

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 lg:col-span-3">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="relative h-8 w-8 transition-transform group-hover:scale-105">
                <Image
                  src={color === "white" || (mode === "light" && color !== "black") ? "/symbol-blue.png" : "/symbol-white.png"}
                  alt="RapidNexTech Symbol"
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
            <p className="theme-text opacity-70 text-sm leading-relaxed mb-6">
              Building the future of digital experiences with high-performance code and cutting-edge design.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com/RapidNexTech" target="_blank" className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://twitter.com/RapidNexTech" target="_blank" className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://linkedin.com/company/RapidNexTech" target="_blank" className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="https://facebook.com/RapidNexTech" target="_blank" className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://instagram.com/RapidNexTech" target="_blank" className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold theme-text mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>

            <h3 className="font-bold theme-text mb-4 mt-8">Solutions</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/solutions/aesthetic-clinics" className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors text-sm">
                  Aesthetic Clinics
                </Link>
              </li>
              <li>
                <Link href="/solutions/real-estate" className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors text-sm">
                  Real Estate Agencies
                </Link>
              </li>
              <li>
                <Link href="/solutions/diet-nutrition" className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors text-sm">
                  Diet &amp; Nutrition
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <Link href="/services" className="group flex items-center gap-2 mb-6">
              <h3 className="font-bold theme-text group-hover:text-primary transition-colors">Services</h3>
              <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </Link>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {Object.entries(servicesData).map(([slug, service]) => (
                <Link key={slug} href={`/services/${slug}`} className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors text-sm block">
                  {service.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-bold theme-text mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/blog" className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors text-sm">
                  Case Studies
                </Link>
              </li>
              <li>
                <a href="mailto:contact@rapidnextech.com" className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors text-sm flex items-center gap-2 whitespace-nowrap">
                  <Mail size={16} />
                  contact@rapidnextech.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+447311133668"
                  className="theme-text opacity-70 hover:opacity-100 hover:text-primary transition-colors text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  +44 7311 133668
                </a>
              </li>
              <li className="theme-text opacity-70 text-sm leading-relaxed">
                38 Scotia Road, ST6 4EP, UK
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="theme-text opacity-50 text-sm">
            © {currentYear} RapidNexTech. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="theme-text opacity-50 hover:opacity-100 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="theme-text opacity-50 hover:opacity-100 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
