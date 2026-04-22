"use client"

import Link from "next/link"
import { Search, MessageCircle, ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsAppDemoDialog } from "@/components/whatsapp/whatsapp-demo-dialog"

export function CTASection() {
  return (
    <section id="free-audit" className="py-20 md:py-28 theme-transition">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] via-primary/[0.03] to-primary/[0.06] p-10 md:p-16 text-center overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.06),transparent_60%)]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Search className="w-4 h-4" />
              Free Inquiry Conversion Audit
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-6">
              Find Out How Many Inquiries<br className="hidden md:block" /> Your Clinic Is Losing
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              Find Out Exactly How Many Inquiries Your Clinic in Dubai or Doha Is Losing on WhatsApp &amp; Instagram
              — and how much revenue you’re leaving on the table with our Zero-Lead-Loss AI Closer.
            </p>

            <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-4">
              No obligation. No cost. Just a clear picture of what you&apos;re leaving on the table.
            </p>

            <p className="text-sm font-medium text-primary max-w-lg mx-auto mb-10">
              Or try a live WhatsApp flow with your own booking link &mdash; see how it converts leads in real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200"
              >
                <Link href="/contact">
                  <Search className="mr-2 h-5 w-5" />
                  Get Your Free Audit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <WhatsAppDemoDialog
                contextLabel="Aesthetic clinics CTA section"
                title="Open Live WhatsApp Flow"
                description="You are about to open our live WhatsApp assistant demo in a new tab."
                trigger={
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-8 rounded-xl font-semibold text-base border-border/60 hover:border-primary/30 transition-all duration-200"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Message Us on WhatsApp
                  </Button>
                }
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                No obligation
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                Works with your existing booking system
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                Data-secure conversations
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
