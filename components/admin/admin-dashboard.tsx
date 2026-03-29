"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Search,
  Calendar,
  Users,
  ChevronDown,
  FileText,
  Briefcase,
  MessageSquare,
  MessageCircle,
  Star,
  FileEdit,
  Sparkles,
  Loader2,
  Copy,
  AlertTriangle,
} from "lucide-react"
import { useThemeContext } from "@/context/theme-context"
import { useSupabaseCMS } from "@/lib/supabase-cms"
import type { ProjectDetail, BlogPost, BlogComment, ClientReview, TrustedPartner } from "@/lib/supabase"
import { PartnerFormModal } from "@/components/admin/partners/partner-form-modal"
import { PartnerCard } from "@/components/admin/partners/partner-card"
import { slugify } from "@/lib/utils"
import { BlogCard } from "@/components/admin/blog/blog-card"
import { BlogFormModal } from "@/components/admin/blog/blog-form-modal"
import { TestimonialCard } from "@/components/admin/testimonials/testimonial-card"
import { TestimonialFormModal } from "@/components/admin/testimonials/testimonial-form-modal"
import { AdminControls } from "@/components/admin/shared/AdminControls"
import { ImageManager } from "@/components/admin/shared/ImageManager"
import { CATEGORIES, TECHNOLOGIES, BLOG_TAGS } from "@/lib/constants"
import { getThemeClasses } from "@/lib/theme-utils"
import { useAdminToast } from "@/hooks/use-admin-toast"
import { AdminToastContainer } from "@/components/admin/admin-toast"
import { generateBlogPost, type AIBlogConfig } from "@/lib/ai-blog-generator"

const AI_QUEUE_KEY = "wr-ai-blog-queue"
const AI_LOCK_KEY = "wr-ai-blog-queue-lock"
const AI_LOCK_TTL_MS = 15 * 60 * 1000
const AI_MAX_RETRIES = 3
const AI_RETRY_BASE_MS = 30 * 1000

type AIBlogJob = {
  id: string
  createdAt: number
  label: string
  payload: AIBlogConfig
  attempts: number
  nextRunAt?: number
  lastError?: string
  failedAt?: number
}

export default function AdminDashboard() {
  const { mode, color } = useThemeContext()
  const theme = getThemeClasses(mode, color)
  const cms = useSupabaseCMS()
  const toast = useAdminToast()

  // State management
  const [activeTab, setActiveTab] = useState<"projects" | "blog" | "comments" | "testimonials" | "partners" | "drafts">("projects")
  const [projects, setProjects] = useState<ProjectDetail[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [comments, setComments] = useState<BlogComment[]>([])
  const [testimonials, setTestimonials] = useState<ClientReview[]>([])
  const [partners, setPartners] = useState<TrustedPartner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Form states
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false)
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false)
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false)
  const [isPartnerFormOpen, setIsPartnerFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectDetail | null>(null)
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<ClientReview | null>(null)
  const [editingPartner, setEditingPartner] = useState<TrustedPartner | null>(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")

  // Dropdown states
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)

  // Upload UX states
  const [techSearchTerm, setTechSearchTerm] = useState("")
  const [customTechInput, setCustomTechInput] = useState("")

  // AI Blog Generation states
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [aiTopic, setAiTopic] = useState("")
  const [aiPrimaryKeyword, setAiPrimaryKeyword] = useState("")
  const [aiSecondaryKeywords, setAiSecondaryKeywords] = useState("")
  const [aiServiceUrl, setAiServiceUrl] = useState("")
  const [aiInternalLinks, setAiInternalLinks] = useState<{ anchor: string; url: string }[]>([
    { anchor: "", url: "" },
    { anchor: "", url: "" },
  ])
  const [aiQueue, setAiQueue] = useState<AIBlogJob[]>([])
  const [aiActiveJobLabel, setAiActiveJobLabel] = useState<string | null>(null)
  const [aiActiveJobId, setAiActiveJobId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState("")
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([])
  const aiProcessingJobIdRef = useRef<string | null>(null)
  const aiLockIdRef = useRef<string | null>(null)
  const aiQueueTimerRef = useRef<number | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    confirmText?: string
    variant?: "danger" | "warning" | "primary"
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
  })

  // Project form data
  const [projectFormData, setProjectFormData] = useState<Partial<ProjectDetail>>({
    title: "",
    category: "",
    technology: [],
    description: "",
    long_description: "",
    challenge: "",
    solution: "",
    results: [""],
    features: [""],
    images: [{ id: 1, url: "", alt: "", caption: "" }],
    duration: "",
    team_size: 1,
    client_type: "",
    live_url: "",
    github_url: "",
    is_published: false,
    testimonial: {
      quote: "",
      author: "",
      position: "",
      company: "",
    },
    is_featured: false,
  })

  // Blog form data
  const [blogFormData, setBlogFormData] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    images: [],
    tags: [],
    author: "RapidNexTech Team",
    date: new Date().toISOString().split("T")[0],
    is_published: false,
    seo_title: "",
    seo_description: "",
  })

  // Testimonial form data
  const [testimonialFormData, setTestimonialFormData] = useState<Partial<ClientReview>>({
    client_name: "",
    client_position: "",
    client_company: "",
    client_image: "",
    review_text: "",
    rating: 5,
    project_category: "",
    testimonial_type: "identified",
    is_featured: false,
    is_published: false,
  })

  // Partners form data
  const [partnerFormData, setPartnerFormData] = useState<Partial<TrustedPartner>>({
    company_name: "",
    company_logo: "",
    company_website: "",
    partnership_type: "",
    description: "",
    is_featured: false,
    is_published: false,
    display_order: 0,
  })

  // Draft Preservation Logic
  const saveProjectDraft = useCallback((data: Partial<ProjectDetail>, id: number | null) => {
    localStorage.setItem("wr-project-draft", JSON.stringify({ data, id, timestamp: Date.now() }))
  }, [])

  const saveBlogDraft = useCallback((data: Partial<BlogPost>, id: number | null) => {
    localStorage.setItem("wr-blog-draft", JSON.stringify({ data, id, timestamp: Date.now() }))
  }, [])

  const clearProjectDraft = useCallback(() => {
    localStorage.removeItem("wr-project-draft")
  }, [])

  const clearBlogDraft = useCallback(() => {
    localStorage.removeItem("wr-blog-draft")
  }, [])

  // Auto-save effects
  useEffect(() => {
    if (isProjectFormOpen && projectFormData.title) {
      saveProjectDraft(projectFormData, editingProject?.id || null)
    }
  }, [projectFormData, isProjectFormOpen, editingProject])

  useEffect(() => {
    if (isBlogFormOpen && blogFormData.title) {
      saveBlogDraft(blogFormData, editingBlogPost?.id || null)
    }
  }, [blogFormData, isBlogFormOpen, editingBlogPost])

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [projectsData, blogData, commentsData, testimonialsData, partnersData] = await Promise.all([
        cms.getAllProjects(),
        cms.getAllBlogPosts(),
        cms.getAllComments(),
        cms.getAllReviews(),
        cms.getAllPartners(),
      ])
      setProjects(projectsData)
      setBlogPosts(blogData)
      setComments(commentsData)
      setTestimonials(testimonialsData)
      setPartners(partnersData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Theme utility is now used via theme variable

  // Filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "All" || project.category === filterCategory
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Published" && project.is_published) ||
      (filterStatus === "Draft" && !project.is_published)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const filteredBlogPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Published" && post.is_published) ||
      (filterStatus === "Draft" && !post.is_published)

    return matchesSearch && matchesStatus
  })

  const filteredComments = comments.filter((c) => {
    const haystack = `${c.post_slug} ${c.name} ${c.email} ${c.content}`.toLowerCase()
    const matchesSearch = haystack.includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Approved" && c.is_approved) ||
      (filterStatus === "Pending" && !c.is_approved)
    return matchesSearch && matchesStatus
  })

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      (testimonial.client_name && testimonial.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (testimonial.client_company && testimonial.client_company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      testimonial.review_text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Published" && testimonial.is_published) ||
      (filterStatus === "Draft" && !testimonial.is_published)

    return matchesSearch && matchesStatus
  })

  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.partnership_type || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Published" && p.is_published) ||
      (filterStatus === "Draft" && !p.is_published)
    return matchesSearch && matchesStatus
  })

  // Project handlers
  const resetProjectForm = useCallback(() => {
    setProjectFormData({
      title: "",
      category: "",
      technology: [],
      description: "",
      long_description: "",
      challenge: "",
      solution: "",
      results: [""],
      features: [""],
      images: [{ id: 1, url: "", alt: "", caption: "" }],
      duration: "",
      team_size: 1,
      client_type: "",
      live_url: "",
      github_url: "",
      is_published: false,
      testimonial: {
        quote: "",
        author: "",
        position: "",
        company: "",
      },
    })
    setEditingProject(null)
    setIsProjectFormOpen(false)
    setTechSearchTerm("")
    clearProjectDraft()
  }, [clearProjectDraft])

  const handleEditProject = (project: ProjectDetail) => {
    setProjectFormData(project)
    setEditingProject(project)
    setIsProjectFormOpen(true)
  }

  const handleAddProjectClick = () => {
    setIsProjectFormOpen(true)
  }

  const handleResumeProjectDraft = () => {
    const saved = localStorage.getItem("wr-project-draft")
    if (saved) {
      try {
        const { data, id } = JSON.parse(saved)
        setProjectFormData(data)
        if (id) {
          const original = projects.find(p => p.id === id)
          if (original) setEditingProject(original)
        }
        setIsProjectFormOpen(true)
      } catch (e) { console.error(e) }
    }
  }

  const handleSaveProject = async () => {
    if (!projectFormData.title || !projectFormData.category || !projectFormData.description) {
      toast.warning("Missing Information", "Please fill in all required fields")
      return
    }
    try {
      const slug = projectFormData.slug || slugify(projectFormData.title)

      // Sanitize payload: remove read-only fields
      const { id, created_at, updated_at, ...cleanData } = projectFormData as any;
      const payload = { ...cleanData, slug };

      if (editingProject) {
        const updated = await cms.updateProject(editingProject.id, payload)
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
        toast.success("Project Updated", "Project has been successfully updated")
      } else {
        const created = await cms.addProject(payload as any)
        setProjects((prev) => [...prev, created])
        toast.success("Project Created", "New project has been added successfully")
      }
      resetProjectForm()
    } catch (error: any) {
      console.error("Error saving project:", error)
      toast.error("Save Failed", error.message || "Error saving project. Please try again.")
    }
  }

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    try {
      await cms.deleteProject(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      toast.success("Project Deleted", "Project has been successfully removed")
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("Delete Failed", "Error deleting project. Please try again.")
    }
  }

  const handleToggleProjectPublish = async (id: number) => {
    try {
      const updated = await cms.togglePublishStatus(id)
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      toast.success(
        updated.is_published ? "Project Published" : "Project Unpublished",
        `Project is now ${updated.is_published ? "live" : "hidden from public"}`
      )
    } catch (error) {
      console.error("Error toggling project publish status:", error)
      toast.error("Update Failed", "Error updating project status. Please try again.")
    }
  }

  // Blog handlers
  const resetBlogForm = useCallback(() => {
    setBlogFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      images: [],
      tags: [],
      author: "RapidNexTech Team",
      date: new Date().toISOString().split("T")[0],
      is_published: false,
      seo_title: "",
      seo_description: "",
    })
    setEditingBlogPost(null)
    setIsBlogFormOpen(false)
    clearBlogDraft()
  }, [clearBlogDraft])

  const handleEditBlogPost = async (post: BlogPost) => {
    try {
      const full = await cms.getBlogPostById(post.id)
      if (full) {
        setBlogFormData(full)
        setEditingBlogPost(full)
        setIsBlogFormOpen(true)
      }
    } catch (e) {
      console.error("Failed to load blog post for edit", e)
      toast.error("Could not load post", "Please try again.")
    }
  }

  const handleAddBlogClick = () => {
    setIsBlogFormOpen(true)
  }

  const readAiQueue = useCallback((): AIBlogJob[] => {
    if (typeof window === "undefined") return []
    try {
      const raw = localStorage.getItem(AI_QUEUE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      if (!Array.isArray(parsed)) return []
      return parsed
        .map((job: Partial<AIBlogJob>) => {
          if (!job?.payload) return null
          const failedAt = Number.isFinite(job.failedAt) ? job.failedAt : undefined
          return {
            id: job.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            createdAt: job.createdAt || Date.now(),
            label: job.label || "AI Blog Job",
            payload: job.payload,
            attempts: Number.isFinite(job.attempts) ? job.attempts : 0,
            nextRunAt: Number.isFinite(job.nextRunAt)
              ? job.nextRunAt
              : failedAt
                ? undefined
                : Date.now(),
            lastError: typeof job.lastError === "string" ? job.lastError : undefined,
            failedAt,
          } as AIBlogJob
        })
        .filter(Boolean) as AIBlogJob[]
    } catch (error) {
      console.warn("Failed to parse AI blog queue", error)
      return []
    }
  }, [])

  const writeAiQueue = useCallback((queue: AIBlogJob[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(AI_QUEUE_KEY, JSON.stringify(queue))
    setAiQueue(queue)
  }, [])

  const readAiLock = useCallback((): { id: string; expiresAt: number } | null => {
    if (typeof window === "undefined") return null
    try {
      const raw = localStorage.getItem(AI_LOCK_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (!parsed?.id || !parsed?.expiresAt) return null
      return parsed
    } catch (error) {
      console.warn("Failed to parse AI blog lock", error)
      return null
    }
  }, [])

  const writeAiLock = useCallback((lock: { id: string; expiresAt: number }) => {
    if (typeof window === "undefined") return
    localStorage.setItem(AI_LOCK_KEY, JSON.stringify(lock))
  }, [])

  const acquireAiLock = useCallback(() => {
    const now = Date.now()
    const current = readAiLock()
    if (current && current.expiresAt > now) return null
    const id = aiLockIdRef.current ||
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${now}-${Math.random().toString(16).slice(2)}`)
    aiLockIdRef.current = id
    writeAiLock({ id, expiresAt: now + AI_LOCK_TTL_MS })
    return id
  }, [readAiLock, writeAiLock])

  const refreshAiLock = useCallback(() => {
    if (!aiLockIdRef.current) return
    writeAiLock({ id: aiLockIdRef.current, expiresAt: Date.now() + AI_LOCK_TTL_MS })
  }, [writeAiLock])

  const releaseAiLock = useCallback(() => {
    if (typeof window === "undefined") return
    const current = readAiLock()
    if (current && current.id === aiLockIdRef.current) {
      localStorage.removeItem(AI_LOCK_KEY)
    }
    aiLockIdRef.current = null
  }, [readAiLock])

  const buildAIBlogSignature = useCallback((payload: AIBlogConfig) => {
    const topic = (payload.topic || "").trim().toLowerCase()
    const primary = payload.primaryKeyword.trim().toLowerCase()
    const service = payload.serviceUrl.trim().toLowerCase()
    return `${topic}|${primary}|${service}`
  }, [])

  const enqueueAIBlogJob = useCallback((payload: AIBlogConfig, label: string) => {
    const queue = readAiQueue()
    const signature = buildAIBlogSignature(payload)
    const existing = queue.find((job) => job.payload && buildAIBlogSignature(job.payload) === signature)
    if (existing) {
      toast.warning("Already queued", `"${label}" is already in the queue.`)
      return existing
    }
    const job: AIBlogJob = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: Date.now(),
      label,
      payload,
      attempts: 0,
      nextRunAt: Date.now(),
    }
    const next = [...queue, job]
    writeAiQueue(next)
    toast.success("Added to queue", `Position ${next.length} in the queue.`)
    return job
  }, [buildAIBlogSignature, readAiQueue, writeAiQueue, toast])

  const removeAIBlogJob = useCallback((jobId: string) => {
    const queue = readAiQueue()
    const next = queue.filter((job) => job.id !== jobId)
    writeAiQueue(next)
    return next
  }, [readAiQueue, writeAiQueue])

  const updateAIBlogJob = useCallback((jobId: string, updater: (job: AIBlogJob) => AIBlogJob) => {
    const queue = readAiQueue()
    const next = queue.map((job) => (job.id === jobId ? updater(job) : job))
    writeAiQueue(next)
    return next
  }, [readAiQueue, writeAiQueue])

  const runAIBlogJob = useCallback(async (job: AIBlogJob) => {
    setAiActiveJobLabel(job.label)
    setGenerationStatus("AI is writing your blog post...")

    const generated = await generateBlogPost(job.payload, (status) => {
      setGenerationStatus(status)
      refreshAiLock()
    })

    setGenerationStatus("Saving to database...")
    refreshAiLock()

    const payload = {
      title: generated.title,
      slug: generated.slug,
      excerpt: generated.excerpt,
      content: generated.content,
      tags: generated.tags,
      author: "RapidNexTech Team",
      date: new Date().toISOString().split("T")[0],
      is_published: true,
      seo_title: generated.seo_title,
      seo_description: generated.seo_description,
      images: [],
      image_prompts: generated.image_prompts,
      faqs: generated.faqs || [],
      cta: generated.cta || null,
    }

    const created = await cms.addBlogPost(payload as any)
    setBlogPosts((prev) => [created, ...prev])

    setGeneratedPrompts(generated.image_prompts || [])
    setGenerationStatus("")
    toast.success("AI Blog Created!", `"${generated.title}" has been created.`)
  }, [cms, refreshAiLock, toast])

  const processAIBlogQueue = useCallback(async () => {
    if (aiProcessingJobIdRef.current) return
    if (!acquireAiLock()) return

    const scheduleNext = (delayMs: number) => {
      if (typeof window === "undefined") return
      if (aiQueueTimerRef.current) {
        window.clearTimeout(aiQueueTimerRef.current)
      }
      aiQueueTimerRef.current = window.setTimeout(() => {
        aiQueueTimerRef.current = null
        processAIBlogQueue()
      }, Math.max(0, delayMs))
    }

    const queue = readAiQueue()
    if (queue.length === 0) {
      releaseAiLock()
      return
    }

    const now = Date.now()
    const runnableIndex = queue.findIndex(
      (job) => !job.failedAt && (!job.nextRunAt || job.nextRunAt <= now)
    )

    if (runnableIndex === -1) {
      const nextRunAt = queue
        .filter((job) => !job.failedAt && job.nextRunAt && job.nextRunAt > now)
        .map((job) => job.nextRunAt as number)
        .sort((a, b) => a - b)[0]
      releaseAiLock()
      if (nextRunAt) scheduleNext(nextRunAt - now)
      return
    }

    const job = queue[runnableIndex]
    aiProcessingJobIdRef.current = job.id
    setIsGenerating(true)
    setAiActiveJobLabel(job.label)
    setAiActiveJobId(job.id)
    let completed = false

    try {
      await runAIBlogJob(job)
      completed = true
    } catch (error: any) {
      console.error("AI Generation Error:", error)
      const message = error?.message || "Something went wrong. Please try again."
      const classification = classifyAIBlogError(message)
      const now = Date.now()

      if (classification.type === "credits_depleted") {
        updateAIBlogJob(job.id, (current) => ({
          ...current,
          lastError: message,
          nextRunAt: undefined,
          failedAt: now,
        }))
        toast.error("Generation Failed", "Inference credits are depleted. Top up to resume.")
      } else if (classification.type === "rate_limit") {
        const delayMs = Math.max(classification.retryAfterMs || 5000, 5000)
        updateAIBlogJob(job.id, (current) => ({
          ...current,
          lastError: message,
          nextRunAt: now + delayMs,
        }))
        toast.warning("Rate limit hit", `Retrying in ${Math.round(delayMs / 1000)}s.`)
      } else {
        const attempts = (job.attempts || 0) + 1
        if (attempts <= AI_MAX_RETRIES) {
          const backoffMs = AI_RETRY_BASE_MS * Math.pow(2, attempts - 1)
          updateAIBlogJob(job.id, (current) => ({
            ...current,
            attempts,
            nextRunAt: now + backoffMs,
            lastError: message,
          }))
          toast.warning(
            "Generation Failed",
            `Attempt ${attempts}/${AI_MAX_RETRIES} failed. Retrying in ${Math.round(backoffMs / 1000)}s.`
          )
        } else {
          updateAIBlogJob(job.id, (current) => ({
            ...current,
            attempts,
            nextRunAt: undefined,
            lastError: message,
            failedAt: now,
          }))
          toast.error(
            "Generation Failed",
            `Failed after ${AI_MAX_RETRIES} attempts. The job remains in the queue for manual retry.`
          )
        }
      }
    } finally {
      aiProcessingJobIdRef.current = null
      setIsGenerating(false)
      setGenerationStatus("")
      setAiActiveJobLabel(null)
      setAiActiveJobId(null)
      if (completed) {
        removeAIBlogJob(job.id)
      }
      releaseAiLock()
      const remaining = readAiQueue()
      if (remaining.length > 0) {
        const nowTick = Date.now()
        const hasRunnable = remaining.some(
          (item) => !item.failedAt && (!item.nextRunAt || item.nextRunAt <= nowTick)
        )
        if (hasRunnable) {
          scheduleNext(150)
        } else {
          const nextRunAt = remaining
            .filter((item) => !item.failedAt && item.nextRunAt && item.nextRunAt > nowTick)
            .map((item) => item.nextRunAt as number)
            .sort((a, b) => a - b)[0]
          if (nextRunAt) scheduleNext(nextRunAt - nowTick)
        }
      }
    }
  }, [
    acquireAiLock,
    readAiQueue,
    releaseAiLock,
    removeAIBlogJob,
    runAIBlogJob,
    toast,
    updateAIBlogJob,
  ])

  const retryFailedAIBlogJobs = useCallback(() => {
    const queue = readAiQueue()
    const now = Date.now()
    const failedCount = queue.filter((job) => job.failedAt).length
    if (failedCount === 0) return
    const next = queue.map((job) =>
      job.failedAt
        ? { ...job, failedAt: undefined, attempts: 0, nextRunAt: now, lastError: undefined }
        : job
    )
    writeAiQueue(next)
    toast.success("Retry scheduled", `${failedCount} failed job(s) re-queued.`)
    processAIBlogQueue()
  }, [processAIBlogQueue, readAiQueue, toast, writeAiQueue])

  const retrySingleAIBlogJob = useCallback((jobId: string) => {
    const queue = readAiQueue()
    const target = queue.find((job) => job.id === jobId)
    if (!target) return
    const next = queue.map((job) =>
      job.id === jobId
        ? { ...job, failedAt: undefined, attempts: 0, nextRunAt: Date.now(), lastError: undefined }
        : job
    )
    writeAiQueue(next)
    toast.success("Retry scheduled", `"${target.label}" was re-queued.`)
    processAIBlogQueue()
  }, [processAIBlogQueue, readAiQueue, toast, writeAiQueue])

  useEffect(() => {
    if (typeof window === "undefined") return
    setAiQueue(readAiQueue())

    const handleStorage = (event: StorageEvent) => {
      if (event.key === AI_QUEUE_KEY || event.key === AI_LOCK_KEY) {
        setAiQueue(readAiQueue())
        processAIBlogQueue()
      }
    }

    window.addEventListener("storage", handleStorage)
    processAIBlogQueue()
    return () => {
      window.removeEventListener("storage", handleStorage)
      if (aiQueueTimerRef.current) {
        window.clearTimeout(aiQueueTimerRef.current)
        aiQueueTimerRef.current = null
      }
    }
  }, [processAIBlogQueue, readAiQueue])

  // AI Blog Generation handler
  const handleGenerateAIBlog = async () => {
    try {
      if (!aiPrimaryKeyword.trim() || !aiServiceUrl.trim()) {
        toast.warning("Missing Information", "Primary keyword and service URL are required.")
        return
      }

      const payload: AIBlogConfig = {
        topic: aiTopic || undefined,
        primaryKeyword: aiPrimaryKeyword,
        secondaryKeywords: aiSecondaryKeywords.split(",").map((k) => k.trim()).filter(Boolean),
        serviceUrl: aiServiceUrl,
        internalLinks: aiInternalLinks,
      }
      const label = (aiTopic || aiPrimaryKeyword).trim()
      enqueueAIBlogJob(payload, label)
      processAIBlogQueue()
      setAiTopic("")
      setAiPrimaryKeyword("")
      setAiSecondaryKeywords("")
      setAiServiceUrl("")
      setAiInternalLinks([{ anchor: "", url: "" }, { anchor: "", url: "" }])
    } catch (error: any) {
      console.error("AI Queue Error:", error)
      toast.error("Queue Failed", error?.message || "Unable to queue this blog. Please try again.")
    }
  }

  const classifyAIBlogError = (message: string) => {
    const lowered = message.toLowerCase()
    const retryMatch = lowered.match(/try again in\s+([0-9.]+)s/)
    const retryAfterMs = retryMatch ? Math.ceil(parseFloat(retryMatch[1]) * 1000) : null

    if (lowered.includes("rate limit") || lowered.includes("rate_limit")) {
      return { type: "rate_limit", retryAfterMs }
    }
    if (lowered.includes("depleted your monthly included credits") || lowered.includes("purchase pre-paid credits")) {
      return { type: "credits_depleted", retryAfterMs: null }
    }
    if (lowered.includes("failed to fetch") || lowered.includes("network")) {
      return { type: "network", retryAfterMs: null }
    }
    return { type: "unknown", retryAfterMs: null }
  }

  const formatQueueDelay = (ms: number) => {
    if (ms <= 0) return "now"
    const seconds = Math.ceil(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.ceil(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.ceil(minutes / 60)
    return `${hours}h`
  }

  const handleResumeBlogDraft = () => {
    const saved = localStorage.getItem("wr-blog-draft")
    if (saved) {
      try {
        const { data, id } = JSON.parse(saved)
        setBlogFormData(data)
        if (id) {
          const original = blogPosts.find(b => b.id === id)
          if (original) setEditingBlogPost(original)
        }
        setIsBlogFormOpen(true)
      } catch (e) { console.error(e) }
    }
  }

  const handleSaveBlogPost = async () => {
    if (!blogFormData.title || !blogFormData.excerpt || !blogFormData.content) {
      toast.warning("Missing Information", "Please fill in all required fields")
      return
    }
    try {
      const slug = blogFormData.slug || slugify(blogFormData.title || "")

      // Sanitize payload: remove read-only fields
      const { id, created_at, updated_at, ...cleanData } = blogFormData as any;
      const payload = { ...cleanData, slug };

      if (editingBlogPost) {
        const updated = await cms.updateBlogPost(editingBlogPost.id, payload)
        setBlogPosts((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
        toast.success("Blog Updated", "Blog post has been successfully updated")
      } else {
        const created = await cms.addBlogPost(payload as any)
        setBlogPosts((prev) => [created, ...prev])
        toast.success("Blog Created", "New blog post has been published successfully")
      }
      resetBlogForm()
    } catch (error: any) {
      console.error("Error saving blog post:", error)
      toast.error("Save Failed", error.message || "Error saving blog post. Please try again.")
    }
  }

  const handleDeleteBlogPost = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Blog Post",
      message: "Are you sure you want to delete this blog post? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await cms.deleteBlogPost(id)
          setBlogPosts((prev) => prev.filter((b) => b.id !== id))
          toast.success("Blog Deleted", "Blog post has been successfully removed")
        } catch (error) {
          console.error("Error deleting blog post:", error)
          toast.error("Delete Failed", "Error deleting blog post. Please try again.")
        }
      }
    })
  }

  const handleToggleBlogPublish = async (id: number) => {
    try {
      const updated = await cms.toggleBlogPublishStatus(id)
      setBlogPosts((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
      toast.success(
        updated.is_published ? "Blog Published" : "Blog Unpublished",
        `Blog post is now ${updated.is_published ? "live" : "hidden from public"}`
      )
    } catch (error) {
      console.error("Error toggling blog publish status:", error)
      toast.error("Update Failed", "Error updating blog status. Please try again.")
    }
  }

  // Testimonial handlers
  const resetTestimonialForm = () => {
    setTestimonialFormData({
      client_name: "",
      client_position: "",
      client_company: "",
      client_image: "",
      review_text: "",
      rating: 5,
      project_category: "",
      testimonial_type: "identified",
      is_featured: false,
      is_published: false,
    })
    setEditingTestimonial(null)
    setIsTestimonialFormOpen(false)
  }

  const handleEditTestimonial = (testimonial: ClientReview) => {
    setTestimonialFormData(testimonial)
    setEditingTestimonial(testimonial)
    setIsTestimonialFormOpen(true)
  }

  const handleSaveTestimonial = async () => {
    if (!testimonialFormData.review_text) {
      toast.warning("Missing Information", "Please fill in the review text")
      return
    }

    if (testimonialFormData.testimonial_type === "identified") {
      if (!testimonialFormData.client_name || !testimonialFormData.client_company) {
        toast.warning("Missing Information", "Please fill in client name and company for identified testimonials")
        return
      }
    }

    try {
      // Sanitize payload: remove read-only fields
      const { id, created_at, updated_at, ...payload } = testimonialFormData as any;

      if (editingTestimonial) {
        const updated = await cms.updateReview(editingTestimonial.id, payload)
        setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
        toast.success("Testimonial Updated", "Testimonial has been successfully updated")
      } else {
        const created = await cms.addReview(payload as any)
        setTestimonials((prev) => [created, ...prev])
        toast.success("Testimonial Created", "New testimonial has been added successfully")
      }
      setIsTestimonialFormOpen(false)
      setEditingTestimonial(null)
    } catch (error: any) {
      console.error("Error saving testimonial:", error)
      toast.error("Save Failed", error.message || "Error saving testimonial. Please try again.")
    }
  }

  const handleDeleteTestimonial = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Testimonial",
      message: "Are you sure you want to delete this testimonial? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await cms.deleteReview(id)
          setTestimonials((prev) => prev.filter((t) => t.id !== id))
          toast.success("Testimonial Deleted", "Testimonial has been successfully removed")
        } catch (error) {
          console.error("Error deleting testimonial:", error)
          toast.error("Delete Failed", "Error deleting testimonial. Please try again.")
        }
      }
    })
  }

  const handleToggleTestimonialPublish = async (id: number) => {
    try {
      const updated = await cms.toggleReviewPublishStatus(id)
      setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      toast.success(
        updated.is_published ? "Testimonial Published" : "Testimonial Unpublished",
        `Testimonial is now ${updated.is_published ? "live" : "hidden from public"}`
      )
    } catch (error) {
      console.error("Error toggling testimonial publish status:", error)
      toast.error("Update Failed", "Error updating testimonial status. Please try again.")
    }
  }

  const handleToggleTestimonialFeatured = async (id: number) => {
    try {
      const updated = await cms.toggleReviewFeaturedStatus(id)
      setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      toast.success(
        updated.is_featured ? "Testimonial Featured" : "Testimonial Unfeatured",
        `Testimonial is now ${updated.is_featured ? "featured" : "not featured"}`
      )
    } catch (error) {
      console.error("Error toggling testimonial featured status:", error)
      toast.error("Update Failed", "Error updating testimonial featured status. Please try again.")
    }
  }

  // Array helpers
  const addArrayItem = (field: "results" | "features") => {
    setProjectFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }))
  }

  const updateArrayItem = (field: "results" | "features", index: number, value: string) => {
    setProjectFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).map((item, i) => (i === index ? value : item)),
    }))
  }

  const removeArrayItem = (field: "results" | "features", index: number) => {
    setProjectFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen theme-bg theme-transition flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="theme-text theme-transition">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  // Use centralized constants

  return (
    <div className="min-h-screen theme-bg theme-transition relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <motion.div
          className="absolute inset-0 theme-glow blur-3xl theme-transition"
          animate={{ x: ["0%", "100%", "0%"], y: ["0%", "50%", "0%"] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent theme-gradient-text theme-transition mb-4">
            Content Management System
          </h1>
          <p className="theme-text opacity-80 theme-transition">
            Manage your portfolio projects, blog posts, and client testimonials - add, edit, delete, and control
            visibility
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all whitespace-nowrap ${activeTab === "projects"
                ? "bg-primary text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Projects</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{projects.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("blog")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all whitespace-nowrap ${activeTab === "blog"
                ? "bg-primary text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              <FileText className="w-4 h-4" />
              <span>Blog</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{blogPosts.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all whitespace-nowrap ${activeTab === "comments"
                ? "bg-primary text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Comments</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {comments.filter((c) => !c.is_approved).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("testimonials")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all whitespace-nowrap ${activeTab === "testimonials"
                ? "bg-primary text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Testimonials</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{testimonials.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("partners")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all whitespace-nowrap ${activeTab === "partners"
                ? "bg-primary text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              <Users className="w-4 h-4" />
              <span>Partners</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{partners.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("drafts")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all whitespace-nowrap ${activeTab === "drafts"
                ? "bg-primary text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>Drafts</span>
            </button>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.cardBg} backdrop-blur-md rounded-lg p-6 mb-8 shadow-lg theme-transition`}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 theme-text opacity-50" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 theme-text bg-transparent border-gray-300 dark:border-gray-600"
                />
              </div>

              {/* Category Filter (Projects only) */}
              {activeTab === "projects" && (
                <div className="relative dropdown-container">
                  <button
                    onClick={() => {
                      setCategoryDropdownOpen(!categoryDropdownOpen)
                      setStatusDropdownOpen(false)
                    }}
                    className={`flex items-center justify-between w-full md:w-48 px-3 py-2 rounded-md border ${mode === "dark" || color === "black"
                      ? "border-gray-600 bg-gray-800/50"
                      : "border-gray-300 bg-white/50"
                      } theme-text theme-transition hover:bg-opacity-80`}
                  >
                    <span>{filterCategory}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {categoryDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute top-full left-0 right-0 mt-1 ${theme.dropdownBg} backdrop-blur-md rounded-md shadow-lg border z-[100] max-h-60 overflow-y-auto`}
                      >
                        {["All", ...CATEGORIES, ...projects
                          .map(p => p.category)
                          .filter(c => c && !CATEGORIES.includes(c as any))
                          .filter((c, i, arr) => arr.indexOf(c) === i)
                        ].map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setFilterCategory(category)
                              setCategoryDropdownOpen(false)
                            }}
                            className={`w-full text-left px-3 py-2 theme-text hover:bg-primary/20 transition-colors ${filterCategory === category ? "bg-primary/10" : ""}`}
                          >
                            {category}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Status Filter */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => {
                    setStatusDropdownOpen(!statusDropdownOpen)
                    setCategoryDropdownOpen(false)
                  }}
                  className={`flex items-center justify-between w-full md:w-48 px-3 py-2 rounded-md border ${mode === "dark" || color === "black"
                    ? "border-gray-600 bg-gray-800/50"
                    : "border-gray-300 bg-white/50"
                    } theme-text theme-transition hover:bg-opacity-80`}
                >
                  <span>{filterStatus}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {statusDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute top-full left-0 right-0 mt-1 ${theme.dropdownBg} backdrop-blur-md rounded-md shadow-lg border z-[100]`}
                    >
                      {(activeTab === "comments"
                        ? ["All", "Pending", "Approved"]
                        : activeTab === "drafts"
                          ? ["All"]
                          : ["All", "Published", "Draft"]
                      ).map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setFilterStatus(status)
                            setStatusDropdownOpen(false)
                          }}
                          className={`w-full text-left px-3 py-2 theme-text hover:bg-primary/20 transition-colors ${filterStatus === status ? "bg-primary/10" : ""}`}
                        >
                          {status}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Add Button */}
            {activeTab !== "drafts" && activeTab !== "comments" && (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (activeTab === "projects") handleAddProjectClick()
                    else if (activeTab === "blog") handleAddBlogClick()
                    else if (activeTab === "testimonials") setIsTestimonialFormOpen(true)
                    else if (activeTab === "partners") setIsPartnerFormOpen(true)
                  }}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add{" "}
                  {activeTab === "projects"
                    ? "Project"
                    : activeTab === "blog"
                      ? "Blog Post"
                      : activeTab === "partners"
                        ? "Partner"
                        : "Testimonial"}
                </Button>
                {activeTab === "blog" && (
                  <Button
                    onClick={() => {
                      setGeneratedPrompts([])
                      setAiTopic("")
                      setIsAIModalOpen(true)
                    }}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate AI Blog
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <button
              onClick={() => setFilterStatus("All")}
              className="text-center group hover:scale-105 transition-transform"
            >
              <div className="text-2xl font-bold text-primary group-hover:text-primary/80">
                {activeTab === "projects"
                  ? projects.length
                  : activeTab === "blog"
                    ? blogPosts.length
                    : activeTab === "comments"
                      ? comments.length
                      : activeTab === "testimonials"
                        ? testimonials.length
                        : activeTab === "partners"
                          ? partners.length
                          : (typeof window !== "undefined" ? (localStorage.getItem("wr-project-draft") ? 1 : 0) + (localStorage.getItem("wr-blog-draft") ? 1 : 0) : 0)}
              </div>
              <div className="text-sm theme-text opacity-70 theme-transition group-hover:opacity-100">
                Total{" "}
                {activeTab === "projects"
                  ? "Projects"
                  : activeTab === "blog"
                    ? "Posts"
                    : activeTab === "comments"
                      ? "Comments"
                      : activeTab === "testimonials"
                        ? "Testimonials"
                        : activeTab === "partners"
                          ? "Partners"
                          : "Drafts"}
              </div>
            </button>
            <button
              onClick={() => setFilterStatus(activeTab === "comments" ? "Approved" : "Published")}
              className="text-center group hover:scale-105 transition-transform"
            >
              <div className="text-2xl font-bold text-green-500 group-hover:text-green-400">
                {activeTab === "projects"
                  ? projects.filter((p) => p.is_published).length
                  : activeTab === "blog"
                    ? blogPosts.filter((p) => p.is_published).length
                    : activeTab === "comments"
                      ? comments.filter((c) => c.is_approved).length
                      : activeTab === "testimonials"
                        ? testimonials.filter((p) => p.is_published).length
                        : partners.filter((p) => p.is_published).length}
              </div>
              <div className="text-sm theme-text opacity-70 theme-transition group-hover:opacity-100">
                {activeTab === "comments" ? "Approved" : "Published"}
              </div>
            </button>
            <button
              onClick={() => setFilterStatus(activeTab === "comments" ? "Pending" : "Draft")}
              className="text-center group hover:scale-105 transition-transform"
            >
              <div className="text-2xl font-bold text-yellow-500 group-hover:text-yellow-400">
                {activeTab === "projects"
                  ? projects.filter((p) => !p.is_published).length
                  : activeTab === "blog"
                    ? blogPosts.filter((p) => !p.is_published).length
                    : activeTab === "comments"
                      ? comments.filter((c) => !c.is_approved).length
                      : activeTab === "testimonials"
                        ? testimonials.filter((p) => !p.is_published).length
                        : partners.filter((p) => !p.is_published).length}
              </div>
              <div className="text-sm theme-text opacity-70 theme-transition group-hover:opacity-100">
                {activeTab === "comments" ? "Pending" : "Drafts"}
              </div>
            </button>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {activeTab === "projects"
                  ? filteredProjects.length
                  : activeTab === "blog"
                    ? filteredBlogPosts.length
                    : activeTab === "comments"
                      ? filteredComments.length
                      : activeTab === "testimonials"
                        ? filteredTestimonials.length
                        : activeTab === "partners"
                          ? filteredPartners.length
                          : (typeof window !== "undefined" ? (localStorage.getItem("wr-project-draft") ? 1 : 0) + (localStorage.getItem("wr-blog-draft") ? 1 : 0) : 0)}
              </div>
              <div className="text-sm theme-text opacity-70 theme-transition">Filtered</div>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Drafts Grid */}
          {activeTab === "drafts" && (
            <>
              {(() => {
                const saved = typeof window !== "undefined" ? localStorage.getItem("wr-project-draft") : null
                if (!saved) return null
                try {
                  const { data, timestamp } = JSON.parse(saved)
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${theme.cardBg} backdrop-blur-md rounded-lg p-6 border-l-4 border-yellow-500 shadow-lg theme-transition flex flex-col items-center text-center`}
                    >
                      <div className="p-3 bg-yellow-500/10 rounded-full mb-4">
                        <Briefcase className="w-8 h-8 text-yellow-500" />
                      </div>
                      <h3 className="text-xl font-bold theme-text mb-2 line-clamp-1">{data.title || "Untitled Project"}</h3>
                      <p className="text-sm theme-text opacity-60 mb-6">
                        Unsaved project changes from {new Date(timestamp).toLocaleTimeString()}
                      </p>
                      <div className="flex gap-3 w-full mt-auto">
                        <Button onClick={handleResumeProjectDraft} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                          Resume
                        </Button>
                        <Button variant="outline" onClick={clearProjectDraft} className="flex-1 text-red-500 hover:text-red-600">
                          Discard
                        </Button>
                      </div>
                    </motion.div>
                  )
                } catch (e) { return null }
              })()}

              {(() => {
                const saved = typeof window !== "undefined" ? localStorage.getItem("wr-blog-draft") : null
                if (!saved) return null
                try {
                  const { data, timestamp } = JSON.parse(saved)
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${theme.cardBg} backdrop-blur-md rounded-lg p-6 border-l-4 border-orange-500 shadow-lg theme-transition flex flex-col items-center text-center`}
                    >
                      <div className="p-3 bg-orange-500/10 rounded-full mb-4">
                        <FileText className="w-8 h-8 text-orange-500" />
                      </div>
                      <h3 className="text-xl font-bold theme-text mb-2 line-clamp-1">{data.title || "Untitled Post"}</h3>
                      <p className="text-sm theme-text opacity-60 mb-6">
                        Unsaved blog changes from {new Date(timestamp).toLocaleTimeString()}
                      </p>
                      <div className="flex gap-3 w-full mt-auto">
                        <Button onClick={handleResumeBlogDraft} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                          Resume
                        </Button>
                        <Button variant="outline" onClick={clearBlogDraft} className="flex-1 text-red-500 hover:text-red-600">
                          Discard
                        </Button>
                      </div>
                    </motion.div>
                  )
                } catch (e) { return null }
              })()}

              {typeof window !== "undefined" && !localStorage.getItem("wr-project-draft") && !localStorage.getItem("wr-blog-draft") && (
                <div className="col-span-full py-20 text-center">
                  <div className="text-7xl mb-6">✨</div>
                  <h3 className="text-2xl font-bold theme-text mb-3 text-primary">No Unsaved Work</h3>
                  <p className="theme-text opacity-70 max-w-md mx-auto">Your changes are automatically saved as drafts while you edit projects or blog posts.</p>
                </div>
              )}
            </>
          )}

          {/* Projects Grid (unchanged UI, handlers above now optimistic) */}
          {activeTab === "projects" &&
            filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${theme.cardBg} backdrop-blur-md rounded-lg shadow-lg overflow-hidden theme-transition flex flex-col`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      project.images[0]?.url ||
                      "/placeholder.svg?height=200&width=300&query=No%20image%20available" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${project.is_published ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
                        }`}
                    >
                      {project.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-secondary/20 theme-text rounded text-xs theme-transition">
                      {project.category}
                    </span>
                    <span className="text-xs theme-text opacity-50 theme-transition">
                      {new Date(project.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold theme-text mb-2 theme-transition line-clamp-1">{project.title}</h3>

                  <p className="text-sm theme-text opacity-70 mb-4 line-clamp-3 theme-transition flex-grow">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between text-xs theme-text opacity-60 mb-4 theme-transition">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {project.duration}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {project.team_size}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Button size="sm" variant="outline" onClick={() => handleEditProject(project)} className="flex-1">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleProjectPublish(project.id)}
                      className={project.is_published ? "text-yellow-600" : "text-green-600"}
                    >
                      {project.is_published ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        const updated = await cms.toggleProjectFeaturedStatus(project.id)
                        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
                      }}
                      className={project.is_featured ? "text-blue-600" : "text-gray-600"}
                    >
                      <Star className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: "Delete Project",
                          message: "Are you sure you want to delete this project? This action cannot be undone.",
                          confirmText: "Delete",
                          variant: "danger",
                          onConfirm: async () => {
                            try {
                              await cms.deleteProject(project.id)
                              setProjects((prev) => prev.filter((p) => p.id !== project.id))
                              toast.success("Project Deleted", "Project has been successfully removed")
                            } catch (error) {
                              console.error("Error deleting project:", error)
                              toast.error("Delete Failed", "Error deleting project. Please try again.")
                            }
                          }
                        })
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

          {/* Blog Posts Grid (modularized) */}
          {activeTab === "blog" &&
            filteredBlogPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                onEdit={(p) => handleEditBlogPost(p)}
                onTogglePublish={handleToggleBlogPublish}
                onDelete={handleDeleteBlogPost}
                cardBgClass={theme.cardBg}
                index={index}
              />
            ))}

          {/* Comments Grid */}
          {activeTab === "comments" &&
            filteredComments.map((c, index) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`${theme.cardBg} backdrop-blur-md rounded-lg shadow-lg overflow-hidden theme-transition flex flex-col border ${c.is_approved ? "border-green-500/20" : "border-yellow-500/30"}`}
              >
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold theme-text truncate">{c.name}</span>
                        <span className="text-xs theme-text opacity-60 truncate">{c.email}</span>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${c.is_approved ? "bg-green-500/15 text-green-600" : "bg-yellow-500/15 text-yellow-600"}`}>
                          {c.is_approved ? "APPROVED" : "PENDING"}
                        </span>
                      </div>
                      <div className="text-xs theme-text opacity-60 mt-1">
                        Post: <span className="font-mono">{c.post_slug}</span> • {new Date(c.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!c.is_approved && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={async () => {
                            const updated = await cms.approveComment(c.id)
                            setComments((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
                            toast.success("Approved", "Comment is now public.")
                          }}
                        >
                          Approve
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: "Delete Comment",
                            message: "Are you sure you want to delete this comment? This action cannot be undone.",
                            confirmText: "Delete",
                            variant: "danger",
                            onConfirm: async () => {
                              await cms.deleteComment(c.id)
                              setComments((prev) => prev.filter((x) => x.id !== c.id))
                              toast.success("Deleted", "Comment removed.")
                            }
                          })
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm theme-text opacity-80 whitespace-pre-wrap">
                    {c.content}
                  </div>
                </div>
              </motion.div>
            ))}

          {/* Testimonials Grid (modularized) */}
          {activeTab === "testimonials" &&
            filteredTestimonials.map((t, index) => (
              <TestimonialCard
                key={t.id}
                testimonial={t}
                onEdit={(item) => {
                  setEditingTestimonial(item)
                  setTestimonialFormData(item)
                  setIsTestimonialFormOpen(true)
                }}
                onTogglePublish={handleToggleTestimonialPublish}
                onToggleFeatured={handleToggleTestimonialFeatured}
                onDelete={handleDeleteTestimonial}
                cardBgClass={theme.cardBg}
                index={index}
              />
            ))}

          {/* Partners Grid */}
          {activeTab === "partners" &&
            filteredPartners.map((p, index) => (
              <PartnerCard
                key={p.id}
                partner={p}
                onEdit={(item) => {
                  setEditingPartner(item)
                  setPartnerFormData(item)
                  setIsPartnerFormOpen(true)
                }}
                onTogglePublish={async (id) => {
                  const updated = await cms.togglePartnerPublishStatus(id)
                  setPartners((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
                }}
                onToggleFeatured={async (id) => {
                  const updated = await cms.togglePartnerFeaturedStatus(id)
                  setPartners((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
                }}
                onDelete={(id) => {
                  setConfirmModal({
                    isOpen: true,
                    title: "Delete Partner",
                    message: "Are you sure you want to delete this partner? This action cannot be undone.",
                    confirmText: "Delete",
                    variant: "danger",
                    onConfirm: async () => {
                      await cms.deletePartner(id)
                      setPartners((prev) => prev.filter((x) => x.id !== id))
                      toast.success("Deleted", "Partner removed.")
                    }
                  })
                }}
                cardBgClass={theme.cardBg}
                index={index}
              />
            ))}
        </motion.div>

        {/* Empty State */}
        {((activeTab === "projects" && filteredProjects.length === 0) ||
          (activeTab === "blog" && filteredBlogPosts.length === 0) ||
          (activeTab === "comments" && filteredComments.length === 0) ||
          (activeTab === "testimonials" && filteredTestimonials.length === 0) ||
          (activeTab === "partners" && filteredPartners.length === 0)) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="text-6xl mb-4">
                {activeTab === "projects" ? "📁" : activeTab === "blog" ? "📝" : activeTab === "comments" ? "💬" : "⭐"}
              </div>
              <h3 className="text-xl font-semibold theme-text mb-2 theme-transition">
                No{" "}
                {activeTab === "projects"
                  ? "projects"
                  : activeTab === "blog"
                    ? "blog posts"
                    : activeTab === "comments"
                      ? "comments"
                      : activeTab === "testimonials"
                        ? "testimonials"
                        : "partners"}{" "}
                found
              </h3>
              <p className="theme-text opacity-70 theme-transition">
                {searchTerm || filterCategory !== "All" || filterStatus !== "All"
                  ? "Try adjusting your filters"
                  : activeTab === "comments"
                    ? "New comments will appear here for moderation."
                    : `Create your first ${activeTab === "projects" ? "project" : activeTab === "blog" ? "blog post" : activeTab === "testimonials" ? "testimonial" : "partner"} to get started`}
              </p>
            </motion.div>
          )}
      </div>

      {/* Project Form Modal */}
      <AnimatePresence>
        {isProjectFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => resetProjectForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${theme.cardBg} backdrop-blur-md rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto theme-transition`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold theme-text theme-transition">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
                <Button variant="ghost" onClick={resetProjectForm}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2 theme-transition">Title *</label>
                    <Input
                      value={projectFormData.title || ""}
                      onChange={(e) => setProjectFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Project title"
                      className="theme-text bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2 theme-transition">Slug (URL)</label>
                    <Input
                      value={projectFormData.slug || ""}
                      onChange={(e) => setProjectFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="project-url-slug"
                      className="theme-text bg-transparent"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Leave empty to auto-generate from title</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2 theme-transition">Category *</label>
                    <select
                      value={CATEGORIES.includes(projectFormData.category as any) ? projectFormData.category : "__custom__"}
                      onChange={(e) => {
                        if (e.target.value === "__custom__") {
                          setProjectFormData((prev) => ({ ...prev, category: "" }))
                        } else {
                          setProjectFormData((prev) => ({ ...prev, category: e.target.value }))
                        }
                      }}
                      className={`w-full px-3 py-2 rounded-md border ${mode === "dark" || color === "black"
                        ? "border-gray-600 bg-gray-800/50"
                        : "border-gray-300 bg-white/50"
                        } theme-text theme-transition`}
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                      <option value="__custom__">✏️ Custom category...</option>
                    </select>
                    {(!CATEGORIES.includes(projectFormData.category as any) || projectFormData.category === "") && (
                      <Input
                        value={projectFormData.category === "__custom__" ? "" : projectFormData.category || ""}
                        onChange={(e) => setProjectFormData((prev) => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g. AI & Automation / Customer Experience"
                        className="mt-2 theme-text bg-transparent"
                      />
                    )}
                  </div>
                </div>

                {/* Technology Stack with Search */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium theme-text theme-transition">Technology Stack</label>
                    <div className="relative w-48">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 theme-text opacity-40" />
                      <Input
                        value={techSearchTerm}
                        onChange={(e) => setTechSearchTerm(e.target.value)}
                        placeholder="Search tech..."
                        className="pl-8 py-1 h-8 text-xs bg-transparent border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  {/* Custom tech input */}
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={customTechInput}
                      onChange={(e) => setCustomTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && customTechInput.trim()) {
                          e.preventDefault()
                          const val = customTechInput.trim()
                          if (!projectFormData.technology?.includes(val)) {
                            setProjectFormData((prev) => ({ ...prev, technology: [...(prev.technology || []), val] }))
                          }
                          setCustomTechInput("")
                        }
                      }}
                      placeholder="Add custom tech (e.g. n8n, Make.com)..."
                      className="h-8 text-xs bg-transparent theme-text"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="bg-transparent h-8 text-xs whitespace-nowrap"
                      disabled={!customTechInput.trim()}
                      onClick={() => {
                        const val = customTechInput.trim()
                        if (val && !projectFormData.technology?.includes(val)) {
                          setProjectFormData((prev) => ({ ...prev, technology: [...(prev.technology || []), val] }))
                        }
                        setCustomTechInput("")
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                  {/* Selected custom techs (not in TECHNOLOGIES list) */}
                  {projectFormData.technology?.filter(t => !TECHNOLOGIES.includes(t as any)).length ? (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {projectFormData.technology.filter(t => !TECHNOLOGIES.includes(t as any)).map((tech) => (
                        <span key={tech} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                          {tech}
                          <button
                            type="button"
                            onClick={() => setProjectFormData((prev) => ({
                              ...prev,
                              technology: (prev.technology || []).filter(t => t !== tech)
                            }))}
                            className="hover:text-red-500 transition-colors ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md bg-black/5 dark:bg-white/5">
                    {TECHNOLOGIES.filter((tech) =>
                      tech.toLowerCase().includes(techSearchTerm.toLowerCase()) ||
                      projectFormData.technology?.includes(tech)
                    ).map((tech) => (
                      <label key={tech} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={projectFormData.technology?.includes(tech) || false}
                          onChange={(e) => {
                            const currentTech = projectFormData.technology || []
                            if (e.target.checked) {
                              setProjectFormData((prev) => ({ ...prev, technology: [...currentTech, tech] }))
                            } else {
                              setProjectFormData((prev) => ({
                                ...prev,
                                technology: currentTech.filter((t) => t !== tech),
                              }))
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm theme-text theme-transition">{tech}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium theme-text mb-2 theme-transition">
                    Short Description *
                  </label>
                  <Textarea
                    value={projectFormData.description || ""}
                    onChange={(e) => setProjectFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief project description"
                    className="theme-text bg-transparent"
                    rows={3}
                  />
                </div>

                {/* Long Description */}
                <div>
                  <label className="block text-sm font-medium theme-text mb-2 theme-transition">Long Description</label>
                  <Textarea
                    value={projectFormData.long_description || ""}
                    onChange={(e) => setProjectFormData((prev) => ({ ...prev, long_description: e.target.value }))}
                    placeholder="Detailed project description"
                    className="theme-text bg-transparent"
                    rows={5}
                  />
                </div>

                {/* Client Context & Results (NEW) */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <h3 className="text-lg font-semibold theme-text">Client Context & Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium theme-text mb-2 theme-transition">
                        Client Description
                      </label>
                      <Textarea
                        value={projectFormData.client_description || ""}
                        onChange={(e) => setProjectFormData((prev) => ({ ...prev, client_description: e.target.value }))}
                        placeholder="Who is the client? e.g. 'Mid-sized SaaS in hospitality...'"
                        className="theme-text bg-transparent"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium theme-text mb-2 theme-transition">
                        Business Outcome (Hero Subheadline)
                      </label>
                      <Textarea
                        value={projectFormData.business_outcome || ""}
                        onChange={(e) => setProjectFormData((prev) => ({ ...prev, business_outcome: e.target.value }))}
                        placeholder="e.g. 'Helping XYZ scale 10x...'"
                        className="theme-text bg-transparent"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Before Items */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium theme-text theme-transition">Pain Points (Before)</label>
                      <div className="space-y-2">
                        {(projectFormData.before_items || []).map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => {
                                const newItems = [...(projectFormData.before_items || [])]
                                newItems[index] = e.target.value
                                setProjectFormData((prev) => ({ ...prev, before_items: newItems }))
                              }}
                              placeholder="e.g. Manual process..."
                              className="theme-text bg-transparent"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newItems = (projectFormData.before_items || []).filter((_, i) => i !== index)
                                setProjectFormData((prev) => ({ ...prev, before_items: newItems }))
                              }}
                              className="shrink-0 hover:bg-red-500/10 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProjectFormData((prev) => ({
                              ...prev,
                              before_items: [...(prev.before_items || []), ""]
                            }))
                          }}
                          className="w-full border-dashed"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                    </div>

                    {/* After Items */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium theme-text theme-transition">Solutions (After)</label>
                      <div className="space-y-2">
                        {(projectFormData.after_items || []).map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => {
                                const newItems = [...(projectFormData.after_items || [])]
                                newItems[index] = e.target.value
                                setProjectFormData((prev) => ({ ...prev, after_items: newItems }))
                              }}
                              placeholder="e.g. Automated workflow..."
                              className="theme-text bg-transparent"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newItems = (projectFormData.after_items || []).filter((_, i) => i !== index)
                                setProjectFormData((prev) => ({ ...prev, after_items: newItems }))
                              }}
                              className="shrink-0 hover:bg-red-500/10 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProjectFormData((prev) => ({
                              ...prev,
                              after_items: [...(prev.after_items || []), ""]
                            }))
                          }}
                          className="w-full border-dashed"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2 theme-transition">Challenge</label>
                    <Textarea
                      value={projectFormData.challenge || ""}
                      onChange={(e) => setProjectFormData((prev) => ({ ...prev, challenge: e.target.value }))}
                      placeholder="What challenges did you face?"
                      className="theme-text bg-transparent"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2 theme-transition">Solution</label>
                    <Textarea
                      value={projectFormData.solution || ""}
                      onChange={(e) => setProjectFormData((prev) => ({ ...prev, solution: e.target.value }))}
                      placeholder="How did you solve them?"
                      className="theme-text bg-transparent"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Results & Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Results */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium theme-text theme-transition">Results / Outcomes</label>
                    <div className="space-y-2">
                      {(projectFormData.results || []).map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => {
                              const newItems = [...(projectFormData.results || [])]
                              newItems[index] = e.target.value
                              setProjectFormData((prev) => ({ ...prev, results: newItems }))
                            }}
                            placeholder="e.g. 50% increase in conversions"
                            className="theme-text bg-transparent"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newItems = (projectFormData.results || []).filter((_, i) => i !== index)
                              setProjectFormData((prev) => ({ ...prev, results: newItems }))
                            }}
                            className="shrink-0 hover:bg-red-500/10 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProjectFormData((prev) => ({
                            ...prev,
                            results: [...(prev.results || []), ""]
                          }))
                        }}
                        className="w-full border-dashed"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Result
                      </Button>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium theme-text theme-transition">Key Features</label>
                    <div className="space-y-2">
                      {(projectFormData.features || []).map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => {
                              const newItems = [...(projectFormData.features || [])]
                              newItems[index] = e.target.value
                              setProjectFormData((prev) => ({ ...prev, features: newItems }))
                            }}
                            placeholder="e.g. Real-time analytics dashboard"
                            className="theme-text bg-transparent"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newItems = (projectFormData.features || []).filter((_, i) => i !== index)
                              setProjectFormData((prev) => ({ ...prev, features: newItems }))
                            }}
                            className="shrink-0 hover:bg-red-500/10 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProjectFormData((prev) => ({
                            ...prev,
                            features: [...(prev.features || []), ""]
                          }))
                        }}
                        className="w-full border-dashed"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2 theme-transition">Duration</label>
                    <Input
                      value={projectFormData.duration || ""}
                      onChange={(e) => setProjectFormData((prev) => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 3 months"
                      className="theme-text bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2 theme-transition">Team Size</label>
                    <Input
                      type="number"
                      value={projectFormData.team_size || 1}
                      onChange={(e) => setProjectFormData((prev) => ({ ...prev, team_size: Number(e.target.value) }))}
                      min={1}
                      className="theme-text bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2 theme-transition">Client Type</label>
                    <Input
                      value={projectFormData.client_type || ""}
                      onChange={(e) => setProjectFormData((prev) => ({ ...prev, client_type: e.target.value }))}
                      placeholder="e.g., Startup, Enterprise"
                      className="theme-text bg-transparent"
                    />
                  </div>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2 theme-transition">Live URL</label>
                    <Input
                      value={projectFormData.live_url || ""}
                      onChange={(e) => setProjectFormData((prev) => ({ ...prev, live_url: e.target.value }))}
                      placeholder="https://example.com"
                      className="theme-text bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2 theme-transition">GitHub URL</label>
                    <Input
                      value={projectFormData.github_url || ""}
                      onChange={(e) => setProjectFormData((prev) => ({ ...prev, github_url: e.target.value }))}
                      placeholder="https://github.com/..."
                      className="theme-text bg-transparent"
                    />
                  </div>
                </div>

                {/* Images with Upload Support */}
                <ImageManager
                  images={projectFormData.images || []}
                  onImagesChange={(images) => setProjectFormData((prev) => ({ ...prev, images }))}
                  bucketName="project-images"
                />

                {/* Publish & Featured Status */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isProjectPublished"
                      checked={projectFormData.is_published || false}
                      onChange={(e) => setProjectFormData((prev) => ({ ...prev, is_published: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium theme-text theme-transition">Publish immediately</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isProjectFeatured"
                      checked={projectFormData.is_featured || false}
                      onChange={(e) => setProjectFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium theme-text theme-transition flex items-center">
                      <Star className="w-3 h-3 mr-1" /> Featured Project
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
                <Button onClick={handleSaveProject} className="bg-primary hover:bg-primary/90 text-white flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {editingProject ? "Update Project" : "Create Project"}
                </Button>
                <Button variant="outline" onClick={resetProjectForm} className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog Form Modal (modularized) */}
      <BlogFormModal
        isOpen={isBlogFormOpen}
        onClose={() => {
          setIsBlogFormOpen(false)
          setEditingBlogPost(null)
        }}
        onSave={handleSaveBlogPost}
        editingPost={editingBlogPost}
        formData={blogFormData}
        setFormData={(updater) => setBlogFormData((prev) => updater(prev))}
        blogTags={[...BLOG_TAGS]}
        slugify={slugify}
      />

      {/* Testimonial Form Modal (modularized) */}
      <TestimonialFormModal
        isOpen={isTestimonialFormOpen}
        onClose={() => {
          setIsTestimonialFormOpen(false)
          setEditingTestimonial(null)
        }}
        onSave={handleSaveTestimonial}
        editingTestimonial={editingTestimonial}
        categories={[...CATEGORIES]}
        formData={testimonialFormData}
        setFormData={(updater) => setTestimonialFormData((prev) => updater(prev))}
      />

      {/* Toast Notifications */}
      <AdminToastContainer toasts={toast.toasts} onClose={toast.removeToast} />

      {/* Partner Form Modal */}
      <PartnerFormModal
        isOpen={isPartnerFormOpen}
        onClose={() => {
          setIsPartnerFormOpen(false)
          setEditingPartner(null)
        }}
        onSave={async () => {
          try {
            if (!partnerFormData.company_name || !partnerFormData.company_logo) {
              toast.warning("Missing Information", "Name and logo are required")
              return
            }
            // Sanitize payload: remove read-only fields
            const { id, created_at, updated_at, ...payload } = partnerFormData as any;

            if (editingPartner) {
              const updated = await cms.updatePartner(editingPartner.id, payload)
              setPartners((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
              toast.success("Partner Updated", "Partner has been successfully updated")
            } else {
              const created = await cms.addPartner(payload as any)
              setPartners((prev) => [created, ...prev])
              toast.success("Partner Added", "New partner has been added successfully")
            }
            setIsPartnerFormOpen(false)
            setEditingPartner(null)
          } catch (e: any) {
            console.error(e)
            toast.error("Save Failed", e.message || "Error saving partner. Please try again.")
          }
        }}
        editingPartner={editingPartner}
        formData={partnerFormData}
        setFormData={(updater) => setPartnerFormData((prev) => updater(prev))}
      />
      {/* AI Blog Generation Modal */}
      <AnimatePresence>
        {isAIModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsAIModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${theme.cardBg} backdrop-blur-md rounded-xl p-6 md:p-8 w-full max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl border border-violet-500/20`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold theme-text theme-transition">
                    Generate AI Blog Post
                  </h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsAIModalOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {(aiQueue.length > 0 || isGenerating) && (
                <div className="mb-4 rounded-lg border border-border/50 bg-secondary/10 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs theme-text">
                    <span className="font-medium">Queue: {aiQueue.length} total</span>
                    <span className="opacity-70">
                      Pending: {Math.max(aiQueue.filter((job) => !job.failedAt).length - (aiActiveJobLabel ? 1 : 0), 0)}
                    </span>
                  </div>
                  {aiActiveJobLabel && (
                    <p className="mt-2 text-xs theme-text opacity-80">
                      Processing: <span className="font-medium">{aiActiveJobLabel}</span>
                    </p>
                  )}
                  {aiQueue.some((job) => job.failedAt) && (
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <p className="text-[11px] theme-text opacity-70">
                        Some jobs failed after max retries.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={retryFailedAIBlogJobs}
                      >
                        Retry Failed Jobs
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {aiQueue.length > 0 && (
                <div className="mb-6 rounded-lg border border-border/50 bg-secondary/5 p-4">
                  <div className="flex items-center justify-between text-xs theme-text">
                    <span className="font-semibold">Queue Details</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={processAIBlogQueue}
                    >
                      Resume Queue
                    </Button>
                  </div>
                  <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-2 text-xs theme-text">
                    {aiQueue.map((job, idx) => {
                      const isActive = aiActiveJobId === job.id
                      const isFailed = Boolean(job.failedAt)
                      const now = Date.now()
                      const isScheduled = !isFailed && job.nextRunAt && job.nextRunAt > now
                      const status = isActive
                        ? "Processing"
                        : isFailed
                          ? "Failed"
                          : isScheduled
                            ? `Retry in ${formatQueueDelay(job.nextRunAt! - now)}`
                            : "Pending"
                      return (
                        <div
                          key={job.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/30 bg-background/40 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium">{idx + 1}. {job.label}</p>
                            <p className="text-[10px] opacity-60">
                              {status}{job.attempts ? ` · attempts ${job.attempts}/${AI_MAX_RETRIES}` : ""}
                              {job.lastError ? ` · ${job.lastError}` : ""}
                            </p>
                          </div>
                          {isFailed && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-[10px]"
                              onClick={() => retrySingleAIBlogJob(job.id)}
                            >
                              Retry
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {generatedPrompts.length > 0 ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                    <p className="text-sm theme-text font-medium text-green-600 dark:text-green-400">Blog Created Successfully! 🎉</p>
                    <p className="text-xs theme-text opacity-70 mt-1">Image prompt saved for later.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold theme-text border-none">Image Prompt (for reference):</label>
                    <div className="p-4 rounded-lg bg-secondary/20 theme-text text-sm theme-transition relative border border-border/50 max-h-40 overflow-y-auto">
                      <p className="italic leading-relaxed">"{generatedPrompts[0]}"</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPrompts[0] || "")
                        toast.success("Copied!", "Prompt copied to clipboard.")
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Prompt
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 theme-text"
                      onClick={() => {
                        setIsAIModalOpen(false)
                        setGeneratedPrompts([])
                        setAiTopic("")
                        setAiPrimaryKeyword("")
                        setAiSecondaryKeywords("")
                        setAiServiceUrl("")
                        setAiInternalLinks([{ anchor: "", url: "" }, { anchor: "", url: "" }])
                      }}
                    >
                      Done
                    </Button>
                  </div>

                </div>
              ) : isGenerating ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 animate-pulse flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white animate-spin" style={{ animationDuration: "3s" }} />
                    </div>
                  </div>
                  <p className="text-lg font-medium theme-text theme-transition text-center">
                    {generationStatus}
                  </p>
                  <p className="text-xs opacity-50 theme-text text-center">
                    This can take a minute or two. Keep at least one admin tab open while the queue runs.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium theme-text mb-2 theme-transition">
                      Topic / Keyword <span className="opacity-50">(optional)</span>
                    </label>
                    <Input
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="e.g., How AI is Transforming Mobile App Development"
                      className="theme-text bg-transparent"
                    />
                    <p className="text-xs opacity-50 theme-text mt-2">
                      Leave empty and the AI will pick a trending software development topic.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium theme-text mb-2 theme-transition">
                      Primary Keyword <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={aiPrimaryKeyword}
                      onChange={(e) => setAiPrimaryKeyword(e.target.value)}
                      placeholder="e.g., whatsapp automation for aesthetic clinics uk"
                      className="theme-text bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium theme-text mb-2 theme-transition">
                      Secondary Keywords <span className="opacity-50">(comma-separated)</span>
                    </label>
                    <Input
                      value={aiSecondaryKeywords}
                      onChange={(e) => setAiSecondaryKeywords(e.target.value)}
                      placeholder="e.g., clinic appointment automation, whatsapp booking bot"
                      className="theme-text bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium theme-text mb-2 theme-transition">
                      Service URL <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={aiServiceUrl}
                      onChange={(e) => setAiServiceUrl(e.target.value)}
                      placeholder="/solutions/aesthetic-clinics"
                      className="theme-text bg-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium theme-text theme-transition">
                      Internal Links (2–3)
                    </label>
                    <div className="space-y-2">
                      {aiInternalLinks.map((link, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2">
                          <Input
                            value={link.anchor}
                            onChange={(e) => {
                              const updated = [...aiInternalLinks]
                              updated[index] = { ...updated[index], anchor: e.target.value }
                              setAiInternalLinks(updated)
                            }}
                            placeholder="Anchor text"
                            className="theme-text bg-transparent md:col-span-3"
                          />
                          <Input
                            value={link.url}
                            onChange={(e) => {
                              const updated = [...aiInternalLinks]
                              updated[index] = { ...updated[index], url: e.target.value }
                              setAiInternalLinks(updated)
                            }}
                            placeholder="/solutions/whatsapp-automation"
                            className="theme-text bg-transparent md:col-span-2"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => setAiInternalLinks((prev) => [...prev, { anchor: "", url: "" }])}
                        disabled={aiInternalLinks.length >= 3}
                      >
                        Add Link
                      </Button>
                      {aiInternalLinks.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => setAiInternalLinks((prev) => prev.slice(0, -1))}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <p className="text-xs theme-text opacity-70">
                      <strong>What happens:</strong> Each request is added to a queue. The AI writes the post with SEO metadata,
                      internal links, FAQs, and generates a single image prompt. Posts are saved and published in order.
                    </p>
                  </div>

                  <Button
                    onClick={handleGenerateAIBlog}
                    disabled={!aiPrimaryKeyword || !aiServiceUrl}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white h-12 text-base shadow-lg shadow-violet-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Add to Queue
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modal */}
      <AnimatePresence mode="wait">
        {confirmModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`${theme.cardBg} backdrop-blur-md rounded-xl p-8 w-full max-w-md shadow-2xl border border-border/20 theme-transition`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-4 rounded-full mb-6 ${confirmModal.variant === "danger" ? "bg-red-500/10 text-red-500" :
                  confirmModal.variant === "warning" ? "bg-yellow-500/10 text-yellow-500" :
                    "bg-primary/10 text-primary"
                  }`}>
                  <AlertTriangle className="w-10 h-10" />
                </div>

                <h3 className="text-2xl font-bold theme-text mb-2">{confirmModal.title}</h3>
                <p className="theme-text opacity-70 mb-8 leading-relaxed">
                  {confirmModal.message}
                </p>

                <div className="flex gap-4 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 theme-text theme-transition py-6 text-base font-semibold"
                    onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                  >
                    Cancel
                  </Button>
                  <Button
                    className={`flex-1 py-6 text-base font-semibold ${confirmModal.variant === "danger" ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20" :
                      confirmModal.variant === "warning" ? "bg-yellow-600 hover:bg-yellow-700 shadow-lg shadow-yellow-600/20" :
                        "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                      } text-white`}
                    onClick={() => {
                      confirmModal.onConfirm()
                      setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                    }}
                  >
                    {confirmModal.confirmText || "Confirm"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}








