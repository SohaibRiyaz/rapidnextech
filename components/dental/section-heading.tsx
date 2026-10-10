import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  id?: string
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  align?: "center" | "left"
  className?: string
}

export function SectionHeading({ id, eyebrow, title, intro, align = "center", className }: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" ? "mx-auto text-center" : "", "max-w-3xl mb-10 md:mb-14 short:mb-8", className)}>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">{eyebrow}</p>
      <h2 id={id} className="text-3xl md:text-4xl lg:text-5xl short:text-4xl font-bold tracking-tight text-foreground leading-tight">
        {title}
      </h2>
      {intro ? <div className="mt-4 text-lg leading-relaxed text-muted-foreground short:mt-3">{intro}</div> : null}
    </div>
  )
}
