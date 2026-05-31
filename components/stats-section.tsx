"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { useThemeContext } from "@/context/theme-context"

const stats = [
  { number: 4, suffix: "+", label: "Years of Hands-On Experience" },
  { number: 20, suffix: "+", label: "Software Projects Developed" },
  { number: 5, suffix: "+", label: "Countries Served Worldwide" },
]

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(value)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const { color } = useThemeContext()

  if (isInView && count !== value) {
    setTimeout(() => {
      setCount((prev) => {
        const nextCount = prev + Math.ceil((value - prev) / 10)
        return nextCount > value ? value : nextCount
      })
    }, 50)
  }

  return (
    <span
      ref={ref}
      className="text-7xl md:text-8xl font-bold bg-clip-text text-transparent theme-gradient-text theme-transition"
    >
      {count}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden theme-bg theme-transition">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[url('/grid.svg')] bg-center opacity-20" />
        <motion.div
          className="absolute inset-0 theme-glow blur-3xl theme-transition"
          animate={{
            x: ["0%", "100%", "0%"],
            y: ["0%", "50%", "0%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent theme-gradient-text theme-transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Impact at a Glance
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center space-y-4"
            >
              <Counter value={stat.number} suffix={stat.suffix} />
              <motion.p
                className="text-xl theme-text opacity-70 theme-transition"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
              >
                {stat.label}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
