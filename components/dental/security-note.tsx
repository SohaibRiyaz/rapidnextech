import { Lock } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

/** Approved security / data-handling statement (no HIPAA compliance claim). */
export function SecurityNote({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-3 rounded-xl border border-border bg-background p-4 text-sm ${className}`}>
      <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <p className="font-semibold text-foreground">Patient data</p>
        <p className="mt-1 leading-relaxed text-muted-foreground">{siteConfig.copy.security}</p>
      </div>
    </div>
  )
}
