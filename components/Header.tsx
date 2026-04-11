"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"
import { ThemeSwitcher } from "./theme-switcher"
import { Menu, X, Code2 } from "lucide-react"
import { useThemeContext } from "@/context/theme-context"
import { HeaderNav } from "./header-nav"
import { industrySolutions } from "@/lib/services-data"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const primaryNavigation = [
  { name: "About", href: "/about" },
  { name: "What We Do", href: "/services" },
  { name: "Case Studies", href: "/case-studies" },
]

const secondaryNavigation = [
  { name: "Blog", href: "/blog" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
]

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

  const linkClass = (isActive: boolean) =>
    `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary font-bold" : "text-foreground opacity-90"
    }`

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
      <nav className={`container mx-auto px-6 flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-16" : "h-20"}`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-10 md:h-12 md:w-12 transition-transform group-hover:scale-105">
            <Image
              src={!isMedspaVoiceLP && (color === "white" || (mode === "light" && color !== "black")) ? "/symbol-blue.png" : "/symbol-white.png"}
              alt="RapidNexTech Symbol"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="relative h-10 w-32 sm:w-40 md:h-12 md:w-48 transition-transform group-hover:scale-105 ml-1 mt-2">
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
        <div className="hidden md:flex items-center gap-2">
          <HeaderNav />
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden absolute top-20 left-0 right-0 ${effectiveDark ? (isMedspaVoiceLP ? "bg-[#0A0A0A]" : "bg-gray-950") : "bg-white"
              } border-t border-white/10 overflow-hidden`}
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6 h-full overflow-y-auto">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-2xl font-bold ${pathname === item.href ? "text-primary" : "text-foreground"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {industrySolutions.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="solutions" className="border-none">
                    <AccordionTrigger className="text-2xl font-bold text-foreground hover:text-primary py-0 [&[data-state=open]>svg]:rotate-180">
                      Solutions
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="flex flex-col gap-3">
                        {industrySolutions.map((solution) => (
                          <Link
                            key={solution.href}
                            href={solution.href}
                            className="rounded-xl border border-border/60 px-4 py-3 hover:border-primary/30 hover:bg-primary/5 transition-all"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="text-base font-semibold text-foreground">
                              {solution.title}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {solution.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-2xl font-bold ${pathname === item.href ? "text-primary" : "text-foreground"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
