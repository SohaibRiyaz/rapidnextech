"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Search, X, CheckCircle2, MessageSquare, Workflow, HelpCircle, ChevronRight, Layout, Zap, Eye, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useThemeContext } from "@/context/theme-context"
import type { ProjectDetail } from "@/lib/supabase"
import Image from "next/image"
import { slugify } from "@/lib/utils"
import Link from "next/link"
import { ProjectCTA } from "@/components/shared/ProjectCTA"

const defaultCategories = ["All", "Web Development", "App Development", "UI/UX Design", "E-commerce", "Enterprise Software"]

interface PortfolioClientProps {
  initialProjects?: ProjectDetail[]
}

const getProjectSlug = (project: ProjectDetail) => slugify(project.slug || project.title)

export default function PortfolioClient({ initialProjects = [] }: PortfolioClientProps) {
  const { mode, getGradient } = useThemeContext()
  const [projects, setProjects] = useState<ProjectDetail[]>(initialProjects)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [quickViewProject, setQuickViewProject] = useState<ProjectDetail | null>(null)

  useEffect(() => {
    async function loadProjects() {
      try {
        const { PortfolioCMS } = await import("@/lib/supabase-cms")
        const data = await PortfolioCMS.getPublishedProjects()
        setProjects(data)
      } catch (error) {
        console.error("Failed to load projects", error)
      }
    }
    loadProjects()
  }, [])

  // Build categories list dynamically from projects
  const categories = useMemo(() => {
    const custom = projects
      .map(p => p.category)
      .filter(c => c && !defaultCategories.includes(c))
      .filter((c, i, arr) => arr.indexOf(c) === i)
    return [...defaultCategories, ...custom]
  }, [projects])

  // Sorting: Featured first, then Newest Updated
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1
      if (!a.is_featured && b.is_featured) return 1
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })
  }, [projects])

  // Filter Logic
  const filteredProjects = useMemo(() => {
    let result = sortedProjects
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory)
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.technology.some(t => t.toLowerCase().includes(lower))
      )
    }
    return result
  }, [selectedCategory, searchTerm, sortedProjects])

  // Top featured project for hero spotlight
  const heroProject = useMemo(() => sortedProjects.find(p => p.is_featured) || null, [sortedProjects])

  // Parallax
  const { scrollY } = useScroll()
  const yText = useTransform(scrollY, [0, 500], [0, 60])

  return (
    <div className="min-h-screen theme-bg theme-text theme-transition overflow-x-hidden selection:bg-primary/20">

      {/* Noise Texture */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">

        {/* ─── Hero ─── */}
        <section className="pt-32 pb-16">
          <motion.div style={{ y: yText }} className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase mb-6">
              Case <span className="text-primary">Studies</span>
            </h1>
            <p className="text-lg md:text-2xl font-light text-foreground/60 leading-relaxed max-w-2xl">
              Production-ready systems built to remove operational drag and scale with your business.
            </p>
          </motion.div>
        </section>

        {/* ─── Featured Hero Spotlight ─── */}
        {heroProject && selectedCategory === "All" && !searchTerm && (
          <section className="pb-16">
            <Link href={`/case-studies/${getProjectSlug(heroProject)}`} className="group block">
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden border border-border/30 bg-muted/5">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image */}
                  <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[400px]">
                    <Image
                      src={heroProject.images[0]?.url || "/placeholder.svg"}
                      alt={heroProject.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Featured
                      </span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3">{heroProject.category}</span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors">
                      {heroProject.title}
                    </h2>
                    <p className="text-foreground/60 text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
                      {heroProject.description}
                    </p>
                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {heroProject.technology?.slice(0, 5).map((tech, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-foreground/70">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {/* Meta */}
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                      {heroProject.duration && (
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {heroProject.duration}</span>
                      )}
                      {heroProject.team_size && (
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {heroProject.team_size} engineers</span>
                      )}
                      <span className="flex items-center gap-1.5 text-primary font-semibold ml-auto">
                        View case study <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ─── Filter Bar ─── */}
        <div className="sticky top-0 z-40 py-5 theme-bg/90 backdrop-blur-xl border-b border-border/10 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 border rounded-full transition-all duration-300 whitespace-nowrap text-sm ${selectedCategory === cat
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-foreground/50 border-border/20 hover:border-foreground/40 hover:text-foreground"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-mono whitespace-nowrap hidden sm:block">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              </span>
              <div className="relative w-full md:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9 rounded-full bg-muted/30 border-transparent focus:bg-background focus:border-border/30 transition-all text-sm"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Project Grid ─── */}
        <section className="py-16">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onQuickView={() => setQuickViewProject(project)}
                />
              ))}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center opacity-60">
              <h3 className="text-2xl font-bold mb-2">No projects found.</h3>
              <p className="mb-6 text-sm">Adjust your filters to see more work.</p>
              <Button onClick={() => { setSearchTerm(""); setSelectedCategory("All") }} variant="outline" size="sm">Clear Filters</Button>
            </div>
          )}
        </section>

        {/* ─── Process & FAQ ─── */}
        <section className="py-16 border-t border-border/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Process */}
            <div>
              <h2 className="text-2xl font-bold mb-6">How We Deliver</h2>
              <div className="space-y-5">
                {[
                  { title: "Direct Collaboration", text: "You speak directly with engineers. No account managers, no layers.", icon: MessageSquare },
                  { title: "Production-First", text: "RLS policies, proper indexing, and SEO schema from Day 1.", icon: Zap },
                  { title: "Strategic Automation", text: "We automate the operational drag behind the UI.", icon: Workflow }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-0.5">{item.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Common Questions</h2>
              <div className="space-y-3">
                {[
                  { q: "How long does a typical project take?", a: "Most MVP-level systems are delivered in 6-12 weeks, while smaller automation tasks can take 2-4 weeks." },
                  { q: "What is your tech stack focus?", a: "We specialize in the T3 Stack (Next.js, TypeScript, Supabase) and React Native for mobile, ensuring 100% interoperability." },
                  { q: "Do you offer post-launch support?", a: "Yes. Every project includes a 30-day stability guarantee and optional monthly maintenance for scaling." }
                ].map((item, i) => (
                  <details key={i} className="group border border-border/10 rounded-xl overflow-hidden hover:bg-muted/30 transition-colors">
                    <summary className="flex items-center justify-between p-4 cursor-pointer list-none text-sm font-semibold">
                      <span className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-primary shrink-0" /> {item.q}</span>
                      <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <div className="py-16">
          <ProjectCTA title="Want Results Like These?" description="Let's build a system that works as hard as you do." />
        </div>

      </div>

      {/* Quick View Drawer */}
      <AnimatePresence>
        {quickViewProject && (
          <QuickViewDrawer
            project={quickViewProject}
            onClose={() => setQuickViewProject(null)}
            getGradient={getGradient}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Simplified Project Card ─── */
function ProjectCard({ project, index, onQuickView }: {
  project: ProjectDetail,
  index: number,
  onQuickView: () => void,
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: "easeOut" }}
      className="group flex flex-col"
    >
      {/* Image */}
      <Link href={`/case-studies/${getProjectSlug(project)}`} className="block mb-4">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border/30 bg-muted/5 group-hover:shadow-xl transition-all duration-500">
          <Image
            src={project.images[0]?.url || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={index < 6}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-400 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => { e.preventDefault(); onQuickView(); }}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
            >
              <Eye className="w-5 h-5 text-black" />
            </button>
          </div>
          {/* Category badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg text-[10px] font-semibold text-white uppercase tracking-wide">
              {project.category}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-bold tracking-tight leading-snug mb-2 group-hover:text-primary transition-colors">
          <Link href={`/case-studies/${getProjectSlug(project)}`}>
            {project.title}
          </Link>
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
          {project.description}
        </p>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
          {project.technology?.slice(0, 4).map((tech, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-muted/50 text-[11px] font-medium text-foreground/60">
              {tech}
            </span>
          ))}
          {(project.technology?.length || 0) > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-muted/50 text-[11px] font-medium text-foreground/40">
              +{project.technology.length - 4}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/10">
          <span className="text-xs text-muted-foreground">{project.duration}</span>
          <Link
            href={`/case-studies/${getProjectSlug(project)}`}
            className="text-xs font-semibold text-foreground/50 group-hover:text-primary transition-colors flex items-center gap-1"
          >
            View study <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

/* ─── Quick View Drawer (preserved) ─── */
function QuickViewDrawer({ project, onClose, getGradient }: { project: ProjectDetail, onClose: () => void, getGradient: any }) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-xl h-full theme-bg shadow-2xl overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 rounded-full bg-border/20 theme-text hover:bg-border/40 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-64 w-full">
          <Image src={project.images[0]?.url || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">{project.category}</span>
            <h2 className="text-3xl font-black tracking-tight leading-tight">{project.title}</h2>
            <p className="text-muted-foreground text-sm">{project.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-6 border-y border-border/10">
            <div className="text-center">
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Duration</span>
              <span className="font-mono text-sm">{project.duration || 'N/A'}</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Team</span>
              <span className="font-mono text-sm">{project.team_size} Experts</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Scale</span>
              <span className="font-mono text-sm">{project.client_type || 'Custom'}</span>
            </div>
          </div>

          <div className="space-y-6">
            {project.challenge && (
              <div>
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3">
                  <Zap className="w-4 h-4 text-primary" /> The Challenge
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4">
                  {project.challenge}
                </p>
              </div>
            )}

            {project.features && project.features.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3">
                  <Layout className="w-4 h-4 text-primary" /> What We Built
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.features.map((f, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-muted/50 text-xs">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {project.results && project.results.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Outcomes
                </h4>
                <div className="space-y-2">
                  {project.results.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-3">
            <Link href={`/case-studies/${getProjectSlug(project)}`} className="flex-grow">
              <Button className="w-full h-12 rounded-xl bg-primary text-white font-bold">Read Full Case Study</Button>
            </Link>
            <Link href="/contact" className="flex-grow">
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold">Book Strategy Call</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
