"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useSupabaseCMS } from "@/lib/supabase-cms"
import type { ProjectDetail } from "@/lib/supabase"
import { ArrowRight, ChevronRight, Briefcase, ExternalLink } from "lucide-react"
import Image from "next/image"
import { slugify } from "@/lib/utils"

export function FeaturedWorkSection() {
  const cms = useSupabaseCMS()
  const [projects, setProjects] = useState<ProjectDetail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    cms
      .getFeaturedProjects()
      .then((rows) => {
        if (!mounted) return
        setProjects((rows || []).slice(0, 5)) // Showing up to 5 featured projects
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  if (loading || projects.length === 0) return null

  return (
    <section className="bg-transparent py-24 relative" id="featured-work">

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Header Section - Sticky on Mobile for Parallax Effect */}
        <div className="sticky top-0 z-0 md:static mb-12 md:mb-24 flex items-end justify-between py-6 md:py-0 bg-background/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none transition-all">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-primary">Featured Work</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black theme-text tracking-tighter leading-none">
              The <span className="theme-gradient-text text-transparent bg-clip-text">Portfolio</span>
            </h2>
            <p className="text-lg theme-text opacity-70 font-medium leading-relaxed">
              Immersive journey through our latest production-grade breakthroughs.
            </p>
          </div>

          <Link href="/case-studies" className="hidden md:flex group items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-xs transition-all hover:gap-5">
            Explore All <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Mobile: keep the current stacking cards experience */}
        <div className="md:hidden flex flex-col items-center w-full pb-12">
          {projects.map((project, i) => (
            <Card
              key={project.id}
              project={project}
              index={i}
              total={projects.length}
            />
          ))}
        </div>

        {/* Desktop: new clean alternating layout (no sticky/scroll transforms) */}
        <div className="hidden md:block">
          <div className="space-y-16 lg:space-y-24">
            {projects.map((project, i) => (
              <DesktopRow key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom CTA — View All Case Studies */}
        <div className="mt-16 md:mt-24 flex flex-col items-center gap-4 text-center">
          <p className="text-lg theme-text opacity-60 font-medium">
            Want to see more of our work?
          </p>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            View All Case Studies
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}

function DesktopRow({ project, index }: { project: ProjectDetail; index: number }) {
  const reverse = index % 2 === 1
  const image = project.images?.[0]?.url || "/placeholder.svg"
  const description = project.description || project.long_description || ""
  const projectSlug = slugify(project.slug || project.title)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative"
    >
      <div className="grid grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className={`col-span-7 ${reverse ? "order-2" : "order-1"}`}>
          <Link href={`/case-studies/${projectSlug}`} className="group block">
            <div className="relative w-full aspect-[16/10] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-muted/10">
              <Image
                src={image}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 58vw, 640px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />
            </div>
          </Link>
        </div>

        <div className={`col-span-5 ${reverse ? "order-1" : "order-2"}`}>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                {project.category}
              </span>
              <span className="text-xs theme-text/50 font-semibold uppercase tracking-widest">
                Featured #{index + 1}
              </span>
            </div>

            <h3 className="text-3xl lg:text-4xl font-black theme-text tracking-tight leading-tight">
              {project.title}
            </h3>

            {description && (
              <p className="text-lg theme-text/70 leading-relaxed line-clamp-4">
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {project.technology?.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] font-bold theme-text/70 px-3 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-wider"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Link
                href={`/case-studies/${projectSlug}`}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
              >
                View Case Study <ArrowRight className="w-4 h-4" />
              </Link>

              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 bg-white/5 theme-text font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  Live <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Card({ project, index, total }: { project: ProjectDetail, index: number, total: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [topOffset, setTopOffset] = useState(280)
  const [isDesktop, setIsDesktop] = useState(false)
  const projectSlug = slugify(project.slug || project.title)

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768
      setIsDesktop(desktop)
      setTopOffset(desktop ? 100 : 280)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start']
  })

  // Only apply scale transform on mobile to prevent desktop distortion
  // On desktop, we keep scale at exactly 1 (no animation)
  const mobileScale = useTransform(scrollYProgress, [0, 1], [0.95, 1])

  return (
    <motion.div
      ref={containerRef}
      className="w-full sticky mb-12 md:mb-24 last:mb-0 will-change-[top]"
      style={{
        top: topOffset,
        zIndex: index + 1,
        // Only apply scale on mobile; desktop gets a static transform
        transform: isDesktop ? 'none' : undefined,
        scale: isDesktop ? undefined : mobileScale,
      }}
    >
      <Link href={`/case-studies/${projectSlug}`} className="block group max-w-6xl mx-auto">
        <div className="relative w-full aspect-[4/5] md:aspect-[2.4/1] bg-muted/10 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl backdrop-blur-sm md:transition-shadow md:duration-500 hover:shadow-primary/20">

          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={project.images?.[0]?.url || "/placeholder.svg"}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">

            {/* Top Row: Index & CTA (Swapped) */}
            <div className="flex justify-between items-start">
              <span className="text-6xl md:text-8xl font-black text-white/10 select-none">
                0{index + 1}
              </span>

              {/* CTA Moved to Top Right (Always Visible) */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-all">
                <span className="text-[10px] font-black text-white uppercase tracking-widest hidden md:inline-block">View Case Study</span>
                <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 -rotate-45 group-hover:rotate-0 transition-transform" />
                </div>
              </div>
            </div>

            {/* Bottom Row: Title & Stack & Category */}
            <div className="space-y-6">
              <h3 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-4xl group-hover:translate-x-2 transition-transform duration-500">
                {project.title}
              </h3>

              <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/10">
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.technology?.slice(0, 4).map((tech) => (
                    <span key={tech} className="text-xs font-bold text-white/80 px-3 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-wider">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Category Moved to Bottom Right */}
                <span className="px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-[10px] font-black text-white uppercase tracking-widest">
                  {project.category}
                </span>
              </div>
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  )
}
