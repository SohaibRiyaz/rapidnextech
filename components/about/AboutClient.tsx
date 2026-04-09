"use client"

import { motion, useInView } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useThemeContext } from "@/context/theme-context"
import {
  Cpu, Workflow, Shield, Layers, Zap, MessageSquare,
  BarChart3, CheckCircle2, Rocket, Globe, ArrowRight, Code2
} from "lucide-react"
import { useRef, useState } from "react"
import { WorldMap } from "@/components/world-map"

function SectionHeading({ title, subtitle, align = "center" }: { title: string; subtitle?: string, align?: "center" | "left" }) {
  return (
    <div className={`${align === "center" ? "text-center mx-auto" : "text-left"} max-w-3xl mb-16 relative`}>
      <h2 className="text-3xl md:text-5xl font-bold theme-text theme-transition tracking-tight mb-6 relative inline-block">
        {title}
        {align === "left" && <div className="absolute -bottom-2 left-0 w-20 h-1.5 bg-primary rounded-full" />}
      </h2>
      {subtitle && (
        <p className="theme-text opacity-70 theme-transition text-lg md:text-xl font-light leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}

function AccentMesh() {
  const { color, mode } = useThemeContext()
  const map: Record<string, { light: string; dark: string }> = {
    blue: { light: "from-blue-500/20 to-cyan-400/20", dark: "from-blue-600/20 to-cyan-500/10" },
    green: { light: "from-emerald-500/20 to-teal-400/20", dark: "from-emerald-500/10 to-teal-400/10" },
    purple: { light: "from-purple-500/20 to-pink-400/20", dark: "from-purple-500/10 to-pink-400/10" },
    red: { light: "from-red-500/20 to-orange-400/20", dark: "from-red-500/10 to-orange-400/10" },
    orange: { light: "from-orange-500/20 to-yellow-400/20", dark: "from-orange-500/10 to-yellow-400/10" },
    white: { light: "from-gray-300/30 to-gray-100/30", dark: "from-white/10 to-gray-500/10" },
    black: { light: "from-gray-800/10 to-black/10", dark: "from-black/40 to-gray-800/20" },
  }
  const g = map[color] || map.blue
  const grad = mode === "dark" || color === "black" ? g.dark : g.light
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${grad} blur-3xl`} />
  )
}

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  if (isInView && count !== value) {
    setTimeout(() => {
      setCount((prev) => {
        const nextCount = prev + Math.ceil((value - prev) / 10)
        return nextCount > value ? value : nextCount
      })
    }, 50)
  }

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-black bg-clip-text text-transparent theme-gradient-text theme-transition tracking-tighter">
      {count}{suffix}
    </span>
  )
}

export default function AboutClient() {
  const { mode, color } = useThemeContext()
  const surface = mode === "dark" || color === "black" ? "bg-gray-900/60 border-white/10" : "bg-white/70 border-gray-200"
  const glass = "backdrop-blur-xl"
  const chip = mode === "dark" || color === "black" ? "bg-white/5" : "bg-black/5"

  return (
    <main className="min-h-screen theme-bg theme-transition relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.15]" />
        <AccentMesh />
      </div>

      <div className="relative z-10">
        {/* Modern Hero Section */}
        <section className="container mx-auto px-6 pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="max-w-5xl mx-auto text-center">

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
            >
              <span className="bg-clip-text text-transparent theme-gradient-text">The Speed You Need,</span> <br className="hidden md:block" />
              <span className="theme-text opacity-90">The Technology You Trust.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl theme-text opacity-70 max-w-3xl mx-auto mb-8 font-light leading-relaxed"
            >
              We help founders and enterprises turn ambitious ideas into reliable, scalable software—without the usual risks or delays.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/contact">
                <Button className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-primary/25 transition-all w-full sm:w-auto">
                  Start Your Project
                </Button>
              </Link>
              <Link href="/case-studies">
                <Button variant="outline" className={`h-14 px-8 text-lg rounded-full border-2 bg-transparent hover:bg-transparent ${mode === 'dark' ? 'border-white/20 text-white hover:border-white' : 'border-black/10 text-black hover:border-black'} transition-all w-full sm:w-auto`}>
                  View Our Work
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Minimalist Stats Bar - Full Width Distinction */}
        <section className={`border-y ${mode === "dark" || color === "black" ? "border-white/10 bg-white/5" : "border-black/5 bg-black/5"} backdrop-blur-md`}>
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { value: 20, suffix: "+", label: "Projects Delivered" },
                { value: 98, suffix: "%", label: "Client Retention" },
                { value: 5, suffix: "+", label: "Global Markets" },
                { value: 24, suffix: "/7", label: "Support Coverage" } // Changed from Lighthouse to Support for variety
              ].map((stat, i) => (
                <div key={stat.label} className="text-center group cursor-default">
                  <Counter value={stat.value} suffix={stat.suffix} />
                  <p className="mt-2 theme-text opacity-60 text-sm md:text-base font-medium tracking-wide uppercase group-hover:text-primary transition-colors">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Introduction - Clean Typography */}
        <section className="container mx-auto px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading
                title="Who We Are"
                align="left"
              />
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6 text-lg theme-text opacity-80 leading-relaxed"
              >
                <p>
                  RapidNexTech was founded to accelerate digital transformation for startups and enterprises. We don't just write code; we architect solutions that drive business growth.
                </p>
                <p>
                  In an industry filled with over-promising and under-delivering, we stand apart by prioritizing <strong className="text-primary">transparency, speed, and engineering excellence</strong>. Whether you're building an MVP or scaling a complex platform, we are the technical partner you can rely on.
                </p>
              </motion.div>
            </div>

            {/* Abstract Visual - Digital Architecture Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`relative aspect-square rounded-3xl overflow-hidden border ${surface} group`}
            >
              <Image
                src="/digital-architecture-abstract.png"
                alt="Digital Architecture - Scalable Software Solutions"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </motion.div>
          </div>
        </section>

        {/* Meet the Team - Professional Profile Cards (Moved Up) */}
        <section className="container mx-auto px-6 pb-20">
          <SectionHeading title="Meet Our Leadership" subtitle="Engineers at heart, building for the future." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Muhammad Sohaib Riaz", role: "Founder & CEO", bio: "Visionary leader focused on scalable architecture and business impact.", image: "/muhammad-sohaib-riaz.jpg" },
              { name: "Sohail Riaz", role: "Chief Technology Advisor", bio: "Expert in distributed systems and enterprise-grade security.", image: "/sohail-riaz.jpeg" },
              { name: "Jehanzaib Javed", role: "Lead Full Stack Engineer", bio: "Master of efficient, clean code and high-performance UI.", image: "/jehanzaib-javed.JPG" },
              { name: "Muhammad Abdul Rehman", role: "Business Development Manager", bio: "Strategist focused on growth, partnerships, and global client relations.", image: "/muhammad-abdul-rehman.jpeg" },
              { name: "Bilal Ahmad", role: "Chief Marketing Officer", bio: "Leads growth strategy, demand generation, and brand positioning to drive long-term revenue.", image: "/bilal_ahmad_sales_guy.jpeg" }
            ].map((member, i, arr) => (
              <motion.div
                key={member.name}
                whileHover={{ y: -5 }}
                className={`group rounded-2xl overflow-hidden ${surface} shadow-lg flex items-start p-4 md:p-5 gap-6 ${
                  i === arr.length - 1 ? "md:col-span-2 md:max-w-[520px] md:mx-auto" : ""
                }`}
              >
                <div className="relative h-28 w-28 md:h-36 md:w-36 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-inner">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 112px, 144px"
                  />
                </div>
                <div className="flex-1 text-left pt-1 md:pt-2">
                  <h3 className="text-lg md:text-xl font-bold theme-text mb-0.5 leading-tight">{member.name}</h3>
                  <p className="text-primary font-semibold tracking-wide text-[10px] md:text-xs uppercase mb-2">{member.role}</p>
                  <p className="theme-text opacity-70 leading-relaxed text-[11px] md:text-xs line-clamp-2 md:line-clamp-3">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mission & Vision - Split Cards (Different from previous identical cards) */}
        <section className="container mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className={`p-10 rounded-3xl ${mode === "dark" || color === "black" ? "bg-gradient-to-br from-indigo-900/40 to-blue-900/40" : "bg-gradient-to-br from-indigo-50 to-blue-50"} border border-indigo-500/10 relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
              <Rocket className="w-12 h-12 text-indigo-500 mb-6" />
              <h3 className="text-2xl font-bold theme-text mb-4">Our Mission</h3>
              <p className="theme-text opacity-80 text-lg leading-relaxed">
                Empower businesses to scale faster through technology that is fast, reliable,
                and built with engineering excellence.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className={`p-10 rounded-3xl ${mode === "dark" || color === "black" ? "bg-gradient-to-br from-emerald-900/40 to-teal-900/40" : "bg-gradient-to-br from-emerald-50 to-teal-50"} border border-emerald-500/10 relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
              <Globe className="w-12 h-12 text-emerald-500 mb-6" />
              <h3 className="text-2xl font-bold theme-text mb-4">Our Vision</h3>
              <p className="theme-text opacity-80 text-lg leading-relaxed">
                To set the global benchmark for software development—recognized for innovation,
                clean code, and trust-driven partnerships.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Bento Grid Services - True Bento Layout */}
        <section className="container mx-auto px-6 py-24">
          <SectionHeading
            title="What We Do"
            subtitle="Comprehensive digital solutions tailored for growth."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
            {/* Item 1: Large Feature */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className={`md:col-span-2 rounded-3xl ${surface} ${glass} p-8 md:p-10 relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-start h-full justify-between">
                <div className={`p-4 rounded-2xl bg-blue-500/10 text-blue-500 mb-6`}>
                  <Cpu className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold theme-text mb-3">Web & Mobile Apps</h3>
                  <p className="theme-text opacity-70 text-lg max-w-md">High-performance, cross-platform applications built with React, Next.js, and React Native. Fast, responsive, and engaging.</p>
                </div>
              </div>
            </motion.div>

            {/* Item 2: Tall Feature */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className={`rounded-3xl ${surface} ${glass} p-8 md:p-10 relative overflow-hidden md:row-span-2 group`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col h-full">
                <div className={`p-4 rounded-2xl bg-purple-500/10 text-purple-500 mb-6 self-start`}>
                  <Layers className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold theme-text mb-3">SaaS Platforms</h3>
                <p className="theme-text opacity-70 mb-auto">Scalable multi-tenant architectures designed for recurring revenue and rapid user onboarding.</p>
                <div className="mt-8 relative h-40 w-full rounded-xl bg-purple-500/5 border border-purple-500/10 overflow-hidden">
                  {/* Decorative mini UI */}
                  <div className="absolute top-4 left-4 right-4 h-2 bg-purple-500/20 rounded-full" />
                  <div className="absolute top-10 left-4 w-1/2 h-2 bg-purple-500/20 rounded-full" />
                  <div className="absolute top-16 left-4 right-4 bottom-4 bg-white/5 rounded-lg border border-white/5" />
                </div>
              </div>
            </motion.div>

            {/* Item 3: Standard */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`rounded-3xl ${surface} ${glass} p-8 relative overflow-hidden group`}
            >
              <div className="absolute right-0 top-0 p-32 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150" />
              <div className={`p-3 rounded-xl bg-yellow-500/10 text-yellow-500 w-fit mb-4`}>
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold theme-text mb-2">AI Integrations</h3>
              <p className="theme-text opacity-70">Smart automation pipelines to boost efficiency.</p>
            </motion.div>

            {/* Item 4: Standard */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`rounded-3xl ${surface} ${glass} p-8 relative overflow-hidden group`}
            >
              <div className="absolute right-0 top-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150" />
              <div className={`p-3 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit mb-4`}>
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold theme-text mb-2">Enterprise Security</h3>
              <p className="theme-text opacity-70">Audits and architecture to future-proof your tech.</p>
            </motion.div>

            {/* Item 5: Wide Bottom */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className={`md:col-span-2 rounded-3xl ${surface} ${glass} p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 group`}
            >
              <div className="flex-1">
                <div className={`p-4 rounded-2xl bg-pink-500/10 text-pink-500 mb-6 w-fit`}>
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold theme-text mb-3">UI/UX Design</h3>
                <p className="theme-text opacity-70 text-lg">Intuitive, user-centric designs that drive conversions. We craft interfaces that look stunning and work seamlessly.</p>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex gap-4">
                  <div className="w-16 h-24 rounded-lg bg-pink-500/10 border border-pink-500/20 transform -rotate-6" />
                  <div className="w-16 h-24 rounded-lg bg-pink-500/20 border border-pink-500/30 transform rotate-3 scale-110 z-10" />
                  <div className="w-16 h-24 rounded-lg bg-pink-500/10 border border-pink-500/20 transform rotate-12" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Global Reach Map - Darker/Clean Style */}
        <WorldMap />

        {/* Process Timeline - Stepped Visual */}
        <section className="container mx-auto px-6 py-24">
          <SectionHeading title="How We Work" subtitle="A transparent, streamlined path to delivery." />

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className={`absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent hidden md:block`} />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { title: "Discover", desc: "Understanding goals & users", icon: MessageSquare, step: "01" },
                { title: "Plan", desc: "Roadmap & architecture", icon: BarChart3, step: "02" },
                { title: "Build", desc: "Agile development loops", icon: Cpu, step: "03" },
                { title: "Launch", desc: "Deploy, monitor & scale", icon: Rocket, step: "04" }
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Step Circle */}
                  <div className={`w-24 h-24 mb-6 rounded-full ${surface} ${glass} border-2 group-hover:border-primary transition-colors flex items-center justify-center relative z-10 shadow-lg`}>
                    <div className={`w-20 h-20 rounded-full ${chip} flex items-center justify-center`}>
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-3 -right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                      {item.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold theme-text mb-2">{item.title}</h3>
                  <p className="theme-text opacity-70 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>



        {/* Final CTA - Floating Glass Design */}
        <section className="container mx-auto px-6 pb-24">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-secondary rounded-[3rem] blur-xl opacity-30 animate-pulse`} />
            <div className={`relative rounded-[3rem] ${mode === "dark" || color === "black" ? "bg-gray-900" : "bg-white"} border border-white/20 p-8 md:p-20 text-center overflow-hidden`}>
              {/* Background accent */}
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold theme-text mb-6">
                  Ready to Build Something Extraordinary?
                </h2>
                <p className="text-xl theme-text opacity-80 mb-10">
                  Partner with a team that values speed, quality, and your long-term success.
                </p>
                <Link href="/contact">
                  <Button className="h-16 px-10 rounded-full text-xl bg-primary hover:bg-primary/90 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                    Start Your Project <ArrowRight className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
