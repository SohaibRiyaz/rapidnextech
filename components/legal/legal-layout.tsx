import Link from "next/link"
import type { ReactNode } from "react"

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  intro?: string
  children: ReactNode
}

export function LegalLayout({ title, lastUpdated, intro, children }: LegalLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-muted-foreground">
            Last Updated: <span className="font-semibold">{lastUpdated}</span>
          </p>
          {intro && (
            <p className="text-foreground/80 leading-relaxed mt-4">
              {intro}
            </p>
          )}
        </header>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          {children}
        </article>

        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:underline font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
