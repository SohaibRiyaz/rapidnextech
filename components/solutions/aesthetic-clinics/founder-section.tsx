import { MapPin } from "lucide-react"

export function FounderSection() {
  return (
    <section id="founder" className="py-20 md:py-28 theme-transition">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-border/70 bg-card/60 p-8 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary mb-3">
            Who Built This
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Built by Sohaib — Based in Lahore
          </h2>

          <div className="flex items-start gap-3 mb-6">
            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">Lahore, Pakistan</p>
          </div>

          <div className="space-y-4 text-foreground/80 leading-relaxed">
            <p>
              I&apos;m Sohaib, founder of RapidNexTech. I build WhatsApp booking assistants for clinics
              because I kept seeing how many patient inquiries get ignored after hours — and how much
              business that quietly costs.
            </p>
            <p>
              This isn&apos;t a resold foreign product. I built it, I set it up myself, and I&apos;m the
              person you&apos;ll actually talk to. No call centre, no account manager — just me making sure
              your clinic stops losing patients inside WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
