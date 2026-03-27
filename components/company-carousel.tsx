"use client"

import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { useThemeContext } from "@/context/theme-context"
import { PartnersCMS } from "@/lib/supabase-cms"
import type { TrustedPartner } from "@/lib/supabase"

export function CompanyCarousel() {
  const [companies, setCompanies] = useState<{ name: string; logo: string }[]>([])
  const { color, mode } = useThemeContext()

  useEffect(() => {
    let mounted = true
    PartnersCMS.getPublishedPartners()
      .then((rows: TrustedPartner[]) => {
        if (!mounted) return
        const mapped = rows
          .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
          .map((p) => ({ name: p.company_name, logo: p.company_logo }))
        setCompanies(
          mapped.length
            ? mapped
            : [
              { name: "TechStart", logo: "/placeholder.svg?height=40&width=160&text=TechStart" },
              { name: "InnovateHub", logo: "/placeholder.svg?height=40&width=160&text=InnovateHub" },
            ],
        )
      })
      .catch(() => {
        if (!mounted) return
        setCompanies([
          { name: "TechStart", logo: "/placeholder.svg?height=40&width=160&text=TechStart" },
          { name: "InnovateHub", logo: "/placeholder.svg?height=40&width=160&text=InnovateHub" },
        ])
      })
    return () => {
      mounted = false
    }
  }, [])

  // Always ensure enough items to animate smoothly, then duplicate for seamless loop
  const baseList = useMemo(() => {
    if (companies.length === 0) return []
    const minItems = 12
    const times = Math.max(1, Math.ceil(minItems / companies.length))
    return Array.from({ length: times }).flatMap(() => companies)
  }, [companies])

  const marqueeList = useMemo(() => {
    if (baseList.length === 0) return []
    return [...baseList, ...baseList]
  }, [baseList])

  return (
    <section className="py-20 theme-bg theme-transition relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />

      <div className="container mx-auto px-4 relative">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-base md:text-lg font-medium theme-text opacity-80 theme-transition">
            Trusted by founders and teams across fintech, hosting, e-commerce, and SaaS.          </h2>
        </motion.div>

        {/* Continuous marquee */}
        <div className="relative overflow-hidden">
          <div className="flex items-center gap-10 md:gap-16 min-w-max w-max animate-marquee will-change-transform">
            {marqueeList.map((c, i) => (
              <div
                key={`${c.name}-${i}`}
                className={`${mode === "dark" || color === "black"
                  ? "grayscale hover:grayscale-0"
                  : "opacity-70 hover:opacity-100"
                  } transition-all duration-300`}
              >
                <img
                  src={c.logo || "/placeholder.svg"}
                  alt={c.name}
                  className="h-10 md:h-12 w-auto max-w-[180px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
