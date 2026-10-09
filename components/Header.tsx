"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { ThemeSwitcher } from "./theme-switcher"
import { Menu, X } from "lucide-react"
import { useThemeContext } from "@/context/theme-context"
import { HeaderNav } from "./header-nav"
import { serviceCategories, servicesData } from "@/lib/services-data"
import { siteConfig, telHref } from "@/lib/site-config"
import { trackEvent } from "@/lib/analytics"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const primaryNavigation = [
  { name: "AI Receptionist for Dentists", href: "/" },
  { name: "Pricing", href: "/#pricing" },
]

const secondaryNavigation = [
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

const pilotButtonClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { mode, color } = useThemeContext()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isDark = mode === "dark" || color === "black"
  const isMedspaVoiceLP = pathname === "/solutions/never-miss-a-medspa-call" || pathname === "/solutions/never-miss-a-call"
  const effectiveDark = isDark || isMedspaVoiceLP

  const headerBgClass = isMedspaVoiceLP
    ? isScrolled
      ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#222222] shadow-md"
      : "bg-transparent"
    : isScrolled
      ? isDark
        ? "bg-gray-950/95 backdrop-blur-md shadow-md border-b border-white/10"
        : "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
      : isDark
        ? "bg-gray-950/70 backdrop-blur-sm"
        : "bg-transparent"

  const mobileLinkClass = (href: string) =>
    `flex min-h-[44px] items-center text-xl font-bold ${pathname === href ? "text-primary" : "text-foreground"}`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}
      style={effectiveDark ? {
        "--foreground": "210 40% 98%",
        "--muted-foreground": "215 20.2% 65.1%",
        "--background": "0 0% 5%",
        "--border": "0 0% 12%",
        "--popover": "0 0% 5%",
        "--popover-foreground": "210 40% 98%"
      } as React.CSSProperties : undefined}
    >
      <nav
        aria-label="Main"
        className={`container mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-300 ${isScrolled ? "h-16" : "h-20"}`}
      >
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 group" aria-label="RapidNexTech home">
          <div className="relative h-10 w-10 md:h-12 md:w-12 transition-transform group-hover:scale-105">
            <Image
              src={!isMedspaVoiceLP && (color === "white" || (mode === "light" && color !== "black")) ? "/symbol-blue.png" : "/symbol-white.png"}
              alt=""
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="relative h-10 w-28 sm:w-40 md:h-12 md:w-44 xl:w-48 transition-transform group-hover:scale-105 ml-1 mt-2">
            <Image
              src={!isMedspaVoiceLP && (color === "white" || (mode === "light" && color !== "black")) ? "/header-logo-blue.png" : "/header-logo-white.png"}
              alt="RapidNexTech"
              fill
              className="object-contain object-left"
              priority
              quality={100}
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center">
          <HeaderNav />
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={telHref(siteConfig.publicPhone)}
            onClick={() => trackEvent("tel_click_public", { location: "header" })}
            className="hidden xl:inline-flex min-h-[44px] items-center whitespace-nowrap rounded-lg px-2 text-sm font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {siteConfig.publicPhone.display}
          </a>
          <ThemeSwitcher />
          <Link href="/#pilot" className={pilotButtonClass}>
            Free Pilot
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-11 w-11 items-center justify-center text-foreground hover:bg-primary/10 rounded-lg transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden absolute top-full left-0 right-0 ${effectiveDark ? (isMedspaVoiceLP ? "bg-[#0A0A0A]" : "bg-gray-950") : "bg-white"
              } border-t border-border overflow-hidden`}
          >
            <div className="container mx-auto px-6 pt-6 pb-40 flex flex-col gap-4 h-full overflow-y-auto">
              <Link href="/#pilot" className={`${pilotButtonClass} min-h-[48px] w-full text-base`} onClick={() => setIsOpen(false)}>
                Start your free pilot
              </Link>

              {primaryNavigation.map((item) => (
                <Link key={item.name} href={item.href} className={mobileLinkClass(item.href)} onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
              ))}

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="software" className="border-none">
                  <AccordionTrigger className="min-h-[44px] py-0 text-xl font-bold text-foreground hover:text-primary hover:no-underline [&[data-state=open]>svg]:rotate-180">
                    Software
                  </AccordionTrigger>
                  <AccordionContent className="pt-3">
                    <div className="flex flex-col gap-1">
                      {[
                        { href: "/software", title: "Custom software overview" },
                        { href: "/services", title: "All services" },
                        ...serviceCategories.flatMap((c) =>
                          c.services.map((slug) => ({ href: `/services/${slug}`, title: servicesData[slug]?.title ?? slug })),
                        ),
                        { href: "/case-studies", title: "Case studies" },
                      ].map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex min-h-[44px] items-center rounded-lg px-3 text-base text-foreground hover:bg-primary/5 hover:text-primary"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.title}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {secondaryNavigation.map((item) => (
                <Link key={item.name} href={item.href} className={mobileLinkClass(item.href)} onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
              ))}

              <a
                href={telHref(siteConfig.publicPhone)}
                className="mt-2 flex min-h-[44px] items-center text-base font-semibold text-muted-foreground hover:text-primary"
                onClick={() => trackEvent("tel_click_public", { location: "mobile-menu" })}
              >
                Call {siteConfig.publicPhone.display}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
