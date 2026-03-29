"use client"

import { memo, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Edit, Eye, EyeOff, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import type { BlogPost } from "@/lib/supabase"

type Props = {
  post: BlogPost
  onEdit: (post: BlogPost) => void
  onTogglePublish: (id: number) => void
  onDelete: (id: number) => void
  cardBgClass: string
  index: number
}

function BlogCardImpl({ post, onEdit, onTogglePublish, onDelete, cardBgClass, index }: Props) {
  const delay = useMemo(() => index * 0.1, [index])
  const promptText = useMemo(() => {
    const prompts = post.image_prompts || []
    if (prompts.length === 0) return "No image prompt saved yet."
    return prompts.map((prompt, i) => `${i + 1}. ${prompt}`).join("\n\n")
  }, [post.image_prompts])
  return (
    <motion.div
      className={`${cardBgClass} backdrop-blur-md rounded-lg shadow-lg overflow-hidden theme-transition flex flex-col`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.images[0]?.url || "/placeholder.svg?height=200&width=300&query=Blog%20post"}
          alt={post.images[0]?.alt || post.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${post.is_published ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}`}
          >
            {post.is_published ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-wrap gap-1">
            {(post.tags || []).slice(0, 2).map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="px-2 py-1 bg-secondary/20 theme-text rounded text-xs theme-transition"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="View image prompt"
              title={promptText}
              className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-border/50 bg-secondary/20 text-xs theme-text hover:bg-secondary/30 transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs theme-text opacity-50 theme-transition">
              {post.date ? new Date(post.date).toLocaleDateString() : ""}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold theme-text mb-2 theme-transition line-clamp-2">{post.title}</h3>
        <p className="text-sm theme-text opacity-70 mb-4 line-clamp-3 theme-transition flex-grow">{post.excerpt}</p>

        <div className="flex items-center justify-between text-xs theme-text opacity-60 mb-4 theme-transition">
          <span className="truncate">{post.author}</span>
          <span className="truncate ml-2">{post.slug}</span>
        </div>

        <div className="flex gap-2 mt-auto">
          <Button size="sm" variant="outline" onClick={() => onEdit(post)} className="flex-1">
            <Edit className="w-3 h-3 mr-1" /> Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onTogglePublish(post.id)}
            className={post.is_published ? "text-yellow-600" : "text-green-600"}
          >
            {post.is_published ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(post.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export const BlogCard = memo(BlogCardImpl)
