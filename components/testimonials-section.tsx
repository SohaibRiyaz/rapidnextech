"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import { useThemeContext } from "@/context/theme-context"
import { softwareClientTestimonials as testimonials } from "@/lib/software-testimonials"

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" },
}

export function TestimonialsSection() {
  const { mode } = useThemeContext()

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-16 md:mb-20" {...fadeUp}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-6">
            <Quote className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-primary">
              Client Testimonials
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight theme-text leading-tight">
            What Our{" "}
            <span className="theme-gradient-text text-transparent bg-clip-text">
              Clients Say
            </span>
          </h2>
          <p className="mt-4 text-lg theme-text opacity-60 max-w-xl mx-auto">
            Real feedback from the people we have worked with.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
              className={`
                relative p-8 rounded-2xl border backdrop-blur-sm flex flex-col
                ${
                  mode === "dark"
                    ? "bg-gray-900/40 border-white/10"
                    : "bg-white/60 border-border"
                }
              `}
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-6 bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20">
                <Quote size={16} fill="currentColor" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5 pt-2">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-base leading-relaxed theme-text opacity-80 mb-6 flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50 mt-auto">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ${
                    mode === "dark"
                      ? "bg-white/10 text-white"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {t.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold theme-text">{t.name}</p>
                  <p className="text-xs theme-text opacity-50">{t.position}, {t.company}</p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                  {t.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
