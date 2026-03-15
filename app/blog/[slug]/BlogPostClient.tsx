"use client"

import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowLeft, Clock, Calendar, User, Share2, MessageCircle, BookOpen, TrendingUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import type { BlogPost } from "@/lib/supabase-cms"
import { SocialShare } from "@/components/blog/social-share"
import { RelatedPosts } from "@/components/blog/related-posts"
import { useThemeContext } from "@/context/theme-context"
import { useState, useEffect, useMemo, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
// Use raw image URLs so images always display (Supabase transform URLs may 404 if Image Transforms not enabled)
function blogImageUrl(url: string | undefined): string {
  return url || "/placeholder.svg"
}

const IMAGE_MARKER_REGEX = /\[Image:(\d+)(:(left|right))?\]/g

function normalizeImageMarkersInContent(content: string): string {
  return content.replace(IMAGE_MARKER_REGEX, (_match, index, pos) => {
    const suffix = pos || ""
    return `\n\n[Image:${index}${suffix}]\n\n`
  })
}

const CommentSection = dynamic(
  () => import("@/components/blog/comment-section").then((m) => m.CommentSection),
  { ssr: false }
)

const TableOfContents = dynamic(
  () => import("@/components/blog/table-of-contents").then((m) => m.TableOfContents),
  { ssr: false }
)

// Interactive FAQ Component
function FAQItem({ faq, index, isDark }: { faq: { question: string, answer: string }, index: number, isDark: boolean }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`group rounded-[2rem] border theme-transition overflow-hidden ${isOpen
                ? "bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/30 shadow-xl shadow-primary/5"
                : "bg-gradient-to-br from-muted/50 to-muted/20 border-border/50 hover:border-primary/20 backdrop-blur-sm"
                }`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-8 flex items-center justify-between gap-4 transition-all"
            >
                <div className="flex items-start gap-3 flex-1">
                    <span className="text-primary font-black mt-1">Q.</span>
                    <h3 className="text-xl font-bold theme-text leading-tight group-hover:text-primary transition-colors pr-4">
                        {faq.question}
                    </h3>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${isOpen ? "bg-primary border-primary text-white" : "border-border theme-text opacity-40 group-hover:opacity-100"
                        }`}
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-8 pb-8 flex items-start gap-3">
                            <span className="text-purple-500 font-bold mt-1">A.</span>
                            <div className={`text-lg leading-relaxed ${isDark ? "text-blue-100/80" : "text-muted-foreground"}`}>
                                {faq.answer}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// Separate component for reading progress to isolate scroll-triggered renders
function ReadingProgress({ readingTime, contentRef }: { readingTime: number, contentRef: React.RefObject<HTMLElement | null> }) {
    const { scrollYProgress } = useScroll({
        target: contentRef,
        // Start at 0% when the article starts at top of viewport,
        // so the progress bar reflects actual reading progress.
        offset: ["start start", "end end"]
    })
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    const [scrollPercent, setScrollPercent] = useState(0)

    useEffect(() => {
        return scrollYProgress.on("change", (latest) => {
            setScrollPercent(Math.round(latest * 100))
        })
    }, [scrollYProgress])

    const remainingTime = Math.ceil(readingTime * (1 - scrollPercent / 100))

    return (
        <>
            {/* Progress Bar */}
            <motion.div
                className="h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 origin-left shadow-lg shadow-primary/50 fixed top-0 left-0 right-0 z-50 pointer-events-none"
                style={{ scaleX }}
            />

            {/* Floating Progress Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: scrollPercent > 0 ? 1 : 0, y: scrollPercent > 0 ? 0 : 20 }}
                className="fixed bottom-10 right-6 md:right-10 bg-background/90 backdrop-blur-xl border border-border/50 rounded-full px-5 py-3 shadow-2xl hidden md:flex items-center gap-4 pointer-events-auto z-40"
            >
                <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-primary">{scrollPercent}%</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2 text-sm theme-text">
                    <Clock className="w-4 h-4" />
                    <span>{remainingTime}min left</span>
                </div>
            </motion.div>
        </>
    )
}

interface BlogPostClientProps {
    post: BlogPost
    relatedPosts: BlogPost[]
    fullUrl: string
}

export default function BlogPostClient({ post, relatedPosts, fullUrl }: BlogPostClientProps) {
    const { mode, color } = useThemeContext()
    const isDark = mode === "dark" || color === "black"
    const { scrollYProgress } = useScroll()
    const contentRef = useRef<HTMLDivElement>(null)
    const normalizedContent = useMemo(() => normalizeImageMarkersInContent(post.content || ""), [post.content])

    // Enhanced reading statistics (calc once)
    const wordCount = useMemo(
        () => (post.content || "").replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length,
        [post.content]
    )
    const readingTime = Math.ceil(wordCount / 200)

    // Parallax effects for hero (Framermotion handles these without parent re-renders)
    const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100])
    const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1])

    // Memoize Markdown components to prevent remounts/flickers during state changes
    const markdownComponents = useMemo(() => ({
        // Custom image component to handle [Image:X], [Image:X:left], [Image:X:right]
        p: ({ children }: any) => {
            if (typeof children === "string" && /^\[Image:\d+(:(left|right))?\]$/.test(children)) {
                const match = children.match(/\[Image:(\d+)(:(left|right))?\]/)
                if (!match) return <p>{children}</p>

                const index = parseInt(match[1])
                const position = match[3]
                const img = post.images?.[index]

                if (img) {
                    if (!position) {
                        return (
                            <motion.figure
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="my-12 clear-both"
                            >
                                <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-muted/5">
                                    <Image
                                        src={blogImageUrl(img.url)}
                                        alt={img.alt || post.title}
                                        width={1200}
                                        height={675}
                                        className="w-full h-auto max-h-[70vh] object-contain"
                                        loading="lazy"
                                    />
                                </div>
                                {img.caption && (
                                    <figcaption className="mt-4 text-center text-sm text-muted-foreground italic">
                                        {img.caption}
                                    </figcaption>
                                )}
                            </motion.figure>
                        )
                    }

                    if (position === "right") {
                        return (
                            <motion.figure
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="float-right ml-6 mb-4 my-2 max-w-xs md:max-w-sm"
                            >
                                <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-border/50 bg-muted/5">
                                    <Image
                                        src={blogImageUrl(img.url)}
                                        alt={img.alt || post.title}
                                        width={600}
                                        height={450}
                                        className="w-full h-auto object-contain"
                                        loading="lazy"
                                    />
                                </div>
                                {img.caption && (
                                    <figcaption className="mt-2 text-xs text-muted-foreground italic">
                                        {img.caption}
                                    </figcaption>
                                )}
                            </motion.figure>
                        )
                    }

                    return (
                        <motion.figure
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="block mr-auto mb-6 my-4 max-w-xs md:max-w-sm clear-both"
                        >
                            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-border/50 bg-muted/5">
                                <Image
                                    src={blogImageUrl(img.url)}
                                    alt={img.alt || post.title}
                                    width={600}
                                    height={450}
                                    className="w-full h-auto object-contain"
                                    loading="lazy"
                                />
                            </div>
                            {img.caption && (
                                <figcaption className="mt-2 text-xs text-muted-foreground italic text-left">
                                    {img.caption}
                                </figcaption>
                            )}
                        </motion.figure>
                    )
                }
                return null
            }
            return <p>{children}</p>
        },
        h2: ({ children }: any) => <h2 className="">{children}</h2>,
        h3: ({ children }: any) => <h3 className="">{children}</h3>,
        img: ({ src, alt }: any) => (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full my-12 rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-muted/5 clear-both"
            >
                <Image
                    src={blogImageUrl(src)}
                    alt={alt || post.title}
                    width={1200}
                    height={675}
                    className="w-full h-auto max-h-[70vh] object-contain"
                    loading="lazy"
                />
            </motion.div>
        ),
    }), [post.images, post.title])

    const nextPost = relatedPosts[0]

    return (
        <div className="min-h-screen theme-bg theme-text theme-transition selection:bg-primary/20 relative">

            {/* Grid Background Pattern with Theme Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                <div className="absolute inset-0 theme-glow blur-3xl theme-transition" />
            </div>

            {/* Optimized Progress Bar Component (Replaced the Top track with NextTopLoader, kept logic) */}

            {/* Floating Header Actions (Back) */}
            <div className="fixed top-24 left-6 z-40 hidden md:flex items-center gap-4">
                <Link href="/blog">
                    <Button variant="outline" size="icon" className="rounded-full theme-bg/50 backdrop-blur-md border-border/50 hover:theme-bg shadow-lg">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
            </div>

            {/* Optimized Progress Bar Component (Replaced the Top track with NextTopLoader, kept logic) */}
            <ReadingProgress readingTime={readingTime} contentRef={contentRef} />

            {/* Hero Section */}
            <header className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
                <motion.div
                    className="absolute inset-0"
                    style={{ scale: heroScale, y: heroY }}
                >
                    <Image
                        src={blogImageUrl(post.images?.[0]?.url)}
                        alt={post.images?.[0]?.alt || post.title}
                        fill
                        priority
                        className="object-cover"
                    />
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10" />

                <div className="relative z-10 container max-w-5xl mx-auto px-6 text-center pt-20 pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-6"
                    >
                        <div className="flex flex-wrap justify-center gap-2">
                            {post.tags.slice(0, 4).map((tag, index) => (
                                <motion.span
                                    key={tag}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                    className="px-3 py-1.5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-[10px] font-semibold text-white uppercase tracking-wider hover:bg-white/20 transition-all duration-300"
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white drop-shadow-2xl max-w-4xl mx-auto"
                        >
                            {post.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="flex flex-wrap items-center justify-center gap-4 text-white/90 text-xs font-medium"
                        >
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{formatDate(post.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{readingTime} min read</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5"
                >
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-5 h-8 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1 h-1 bg-white rounded-full"
                        />
                    </motion.div>
                    <span className="text-white/60 text-[10px] font-medium uppercase tracking-widest">Scroll</span>
                </motion.div>
            </header>

            <main className="container max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 relative z-20">
                <div className="relative">
                    <div className="absolute -left-8 top-0 bottom-1/2 w-1 bg-gradient-to-b from-primary via-purple-500 to-transparent rounded-full hidden lg:block" />

                    <div ref={contentRef}>
                        <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
                        prose-headings:font-black prose-headings:tracking-tight prose-headings:scroll-mt-24
                        prose-h2:text-4xl prose-h2:md:text-5xl prose-h2:mb-8 prose-h2:mt-16
                        prose-h3:text-3xl prose-h3:md:text-4xl prose-h3:mb-6 prose-h3:mt-12
                        prose-h3:text-3xl prose-h3:md:text-4xl prose-h3:mb-6 prose-h3:mt-12
                        ${isDark ? 'prose-p:text-blue-100/80 prose-li:text-blue-100/80' : 'prose-p:text-muted-foreground prose-li:text-muted-foreground'} prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
                        prose-p:first-of-type:text-xl prose-p:first-of-type:leading-relaxed
                        prose-p:first-of-type:text-xl prose-p:first-of-type:leading-relaxed
                        prose-p:first-of-type:first-letter:text-7xl prose-p:first-of-type:first-letter:font-bold
                        prose-p:first-of-type:first-letter:text-primary prose-p:first-of-type:first-letter:float-left
                        prose-p:first-of-type:first-letter:mr-3 prose-p:first-of-type:first-letter:mt-1
                        prose-a:text-primary prose-a:font-semibold prose-a:no-underline prose-a:border-b-2 prose-a:border-primary/30 hover:prose-a:border-primary hover:prose-a:bg-primary/5 prose-a:transition-all
                        prose-img:rounded-3xl prose-img:shadow-2xl prose-img:w-full prose-img:my-12 prose-img:border prose-img:border-border/50
                        prose-blockquote:border-l-4 prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-xl prose-blockquote:font-medium prose-blockquote:my-12
                        prose-code:text-primary prose-code:bg-primary/10 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-mono prose-code:text-sm
                        prose-pre:bg-gray-900 prose-pre:border prose-pre:border-border prose-pre:rounded-2xl prose-pre:p-6 prose-pre:my-8
                        prose-pre:bg-gray-900 prose-pre:border prose-pre:border-border prose-pre:rounded-2xl prose-pre:p-6 prose-pre:my-8
                        prose-ul:my-8 prose-li:my-2
                        prose-strong:text-foreground prose-strong:font-bold
                        prose-em:text-muted-foreground prose-em:italic
                    ">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={markdownComponents}
                            >
                                {normalizedContent}
                            </ReactMarkdown>

                            <div className="clear-both" />
                        </article>
                    </div>

                        {post.faqs && post.faqs.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-32 space-y-12"
                        >
                            <div className="text-center space-y-4">
                                <h2 className="text-4xl font-black theme-text tracking-tight">Frequently Asked Questions</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">Common questions about this topic and how we approach it at RapidNexTech.</p>
                            </div>
                            <div className="grid gap-4 max-w-4xl mx-auto">
                                {post.faqs.map((faq, i) => (
                                    <FAQItem key={i} faq={faq} index={i} isDark={isDark} />
                                ))}
                            </div>
                        </motion.section>
                    )}

                    <motion.section
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mt-32 p-12 rounded-[3rem] bg-gradient-to-br from-primary via-purple-600 to-pink-600 text-white relative overflow-hidden shadow-2xl shadow-primary/20"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

                        <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-black leading-tight">
                                {post.cta?.title || "Ready to scale your startup with custom software?"}
                            </h2>
                            <p className="text-white/80 text-lg md:text-xl">
                                {post.cta?.description || "Book a free strategy session with RapidNexTech and let's turn your idea into a production-ready product."}
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Link href={post.cta?.buttonLink || "/contact"}>
                                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 py-6 text-lg font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
                                        {post.cta?.buttonText || "Schedule Free Strategy Session"}
                                    </Button>
                                </Link>
                                <Link href="/services">
                                    <Button variant="ghost" size="lg" className="border border-white/40 text-white hover:bg-white/20 hover:text-white rounded-full px-8 py-6 text-lg font-bold backdrop-blur-md transition-all">
                                        View Our Services
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.section>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-32 pt-12 border-t border-border/50"
                >
                    <div className="flex flex-col gap-12">
                        {/* Tags Section */}
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="font-bold text-lg theme-text flex items-center gap-2 whitespace-nowrap">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Topics:
                            </span>
                            <div className="flex flex-wrap gap-3">
                                {post.tags.map((tag, index) => (
                                    <motion.div
                                        key={tag}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        transition={{
                                            opacity: { duration: 0.4, delay: index * 0.05 },
                                            scale: { duration: 0.4, delay: index * 0.05 },
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 10
                                        }}
                                    >
                                        <Link
                                            href={`/blog?tag=${tag}`}
                                            className="group relative block px-5 py-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 hover:border-primary/40 backdrop-blur-sm transition-all duration-200"
                                        >
                                            <span className="relative z-10 font-semibold text-sm bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                                                #{tag}
                                            </span>
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 backdrop-blur-sm">
                            <div>
                                <h3 className="text-2xl font-bold theme-text mb-2">Enjoyed this article?</h3>
                                <p className="text-muted-foreground">Share it with your network and help others discover it too!</p>
                            </div>
                        <SocialShare
                            title={post.title}
                            url={fullUrl}
                            description={post.excerpt}
                            hashtags={post.tags}
                        />
                        </div>
                    </div>
                </motion.div>
            </main >

            <TableOfContents content={post.content} />

            {
                nextPost && (
                    <section className="relative border-t border-border mt-32 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />

                        <div className="container max-w-6xl mx-auto px-6 py-24 relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <p className="text-center text-muted-foreground uppercase tracking-widest text-sm font-bold mb-12 flex items-center justify-center gap-3">
                                    <span className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
                                    Continue Reading
                                    <span className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
                                </p>

                                <Link href={`/blog/${nextPost.slug || ''}`} className="group block">
                                    <div className="grid md:grid-cols-2 gap-12 items-center">
                                        <motion.div
                                            className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <img
                                                src={blogImageUrl(nextPost.images?.[0]?.url)}
                                                alt={nextPost.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                loading="eager"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                            <div className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                                Next →
                                            </div>
                                        </motion.div>

                                        <div className="space-y-6">
                                            {nextPost.tags?.slice(0, 2).map((tag) => (
                                                <span key={tag} className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-semibold mr-2">
                                                    {tag}
                                                </span>
                                            ))}

                                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black theme-text leading-tight group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-500 transition-all duration-300">
                                                {nextPost.title}
                                            </h2>

                                            {nextPost.excerpt && (
                                                <p className="text-lg text-muted-foreground line-clamp-3">
                                                    {nextPost.excerpt}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 pt-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{Math.ceil(((nextPost.content || nextPost.excerpt || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length) / 200)} min</span>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-primary text-white font-bold group-hover:gap-5 transition-all duration-300 shadow-lg shadow-primary/20">
                                                    Read Article
                                                    <ArrowLeft className="w-5 h-5 rotate-180" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        </div>
                    </section>
                )
            }

            <div className="theme-bg py-24 relative z-10">
                <div className="container max-w-6xl mx-auto px-6 space-y-24">
                    <RelatedPosts
                        currentPostId={post.id}
                        posts={relatedPosts}
                    />
                    <div className="max-w-3xl mx-auto">
                        <CommentSection
                            postSlug={post.slug || ''}
                            postTitle={post.title}
                        />
                    </div>
                </div>
            </div>
        </div >
    )
}
