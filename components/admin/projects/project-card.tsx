"use client"

import { memo, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye, EyeOff, Calendar, Users } from "lucide-react"
import type { ProjectDetail } from "@/lib/supabase"
import { getThemeClasses } from "@/lib/theme-utils"
import { useThemeContext } from "@/context/theme-context"

type Props = {
  project: ProjectDetail
  onEdit: (project: ProjectDetail) => void
  onTogglePublish: (id: number) => void
  onDelete: (id: number) => void
  cardBgClass: string
  index: number
}

function CardImpl({ project, onEdit, onTogglePublish, onDelete, cardBgClass, index }: Props) {
  const delay = useMemo(() => index * 0.1, [index])
  return (
    <div
      className={`${cardBgClass} backdrop-blur-md rounded-lg shadow-lg overflow-hidden theme-transition`}
      style={{
        animation: `fadeInUp 300ms ease forwards`,
        animationDelay: `${delay}s`,
        opacity: 0,
        transform: "translateY(20px)",
      }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.images[0]?.url || "/placeholder.svg?height=200&width=300&text=No+Image"}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              project.is_published ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
            }`}
          >
            {project.is_published ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-1 bg-secondary/20 theme-text rounded text-xs theme-transition">
            {project.category}
          </span>
          <span className="text-xs theme-text opacity-50 theme-transition">{project.updated_at}</span>
        </div>

        <h3 className="text-lg font-semibold theme-text mb-2 theme-transition">{project.title}</h3>

        <p className="text-sm theme-text opacity-70 mb-4 line-clamp-2 theme-transition">{project.description}</p>

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

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(project)} className="flex-1">
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onTogglePublish(project.id)}
            className={project.is_published ? "text-yellow-600" : "text-green-600"}
          >
            {project.is_published ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(project.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const ProjectCard = memo(CardImpl)
