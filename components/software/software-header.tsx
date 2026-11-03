"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useThemeContext } from "@/context/theme-context"
import { INDUSTRIES_HUB_PATH, startProjectHref } from "@/lib/industries/paths"

/**
 * Header for the custom-software sales pages (/software/industries/*, /software/start-a-project).
 * Prospects arriving from an outreach email see software navigation only: no dental pilot CTA
 * and no dental phone line. The main site header is unchanged everywhere else.
 */
const nav = [
  { name: "Industries", href: INDUSTRIES_HUB_PATH },
  { name: "Services", href: "/services" },
  { name: "Case studies", href: "/case-studies" },
  { name: "Software overview", href: "/software" },
]

const ctaClass =
  "inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function SoftwareHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { mode, color } = useThemeContext()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setIsOpen(false), [pathname])

  const isDark = mode === "dark" || color === "black"
  const blueLogo = color === "white" || (mode === "light" && color !== "black")

  // On an industry page, the header CTA preselects that industry in the form.
  const industrySlug = pathname?.startsWith(`${INDUSTRIES_HUB_PATH}/`) ? pathname.split("/")[3] : undefined
  const ctaHref = startProjectHref(industrySlug)

  const headerBg = isScrolled || isOpen
    ? isDark
      ? "bg-gray-950/95 backdrop-blur-md shadow-md border-b border-white/10"
      : "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
    : isDark
      ? "bg-gray-950/70 backdrop-blur-sm"
      : "bg-transparent"

  const linkClass = (href: string) =>
    `inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      pathname === href ? "text-primary" : "text-foreground"
    }`

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${headerBg}`}>
      <nav
        aria-label="Main"
        className={`container mx-auto flex items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 ${isScrolled ? "h-16" : "h-20"}`}
      >
        <Link href="/software" className="group flex shrink-0 items-center gap-2" aria-label="RapidNexTech custom software">
          <div className="relative h-10 w-10 transition-transform group-hover:scale-105 md:h-12 md:w-12">
            <Image src={blueLogo ? "/symbol-blue.png" : "/symbol-white.png"} alt="" fill className="object-contain" priority />
          </div>
          <div className="relative ms-1 mt-2 h-10 w-28 transition-transform group-hover:scale-105 sm:w-40 md:h-12 md:w-44">
            <Image
              src={blueLogo ? "/header-logo-blue.png" : "/header-logo-white.png"}
              alt="RapidNexTech"
              fill
              className="object-contain object-left"
              priority
              quality={100}
            />
          </div>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass(item.href)}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeSwitcher />
          <Link href={ctaHref} className={ctaClass}>
            Start a project
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeSwitcher />
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-primary/10"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="software-mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isOpen ? (
        <div
          id="software-mobile-menu"
          className={`border-t border-border lg:hidden ${isDark ? "bg-gray-950" : "bg-white"}`}
        >
          <div className="container mx-auto flex flex-col gap-1 px-6 pb-8 pt-4">
            <Link href={ctaHref} className={`${ctaClass} mb-3 min-h-[48px] w-full text-base`}>
              Start a project
            </Link>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-[48px] items-center text-lg font-semibold ${pathname === item.href ? "text-primary" : "text-foreground"}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
