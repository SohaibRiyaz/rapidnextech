import { Globe, Phone, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const offers = [
  {
    icon: Globe,
    title: "Property Viewing Booking Page",
    tag: "Optional Add-On",
    description:
      "If you do not use a formal booking platform, we can build a lightweight viewing booking page on your website. It connects to your calendar and works seamlessly with the WhatsApp automation.",
    benefits: [
      "Hosted on your domain - you own it",
      "Buyer qualification baked in",
      "Connects to agent calendars",
      "Instant WhatsApp confirmation",
    ],
    pricing: "One-time fee - pricing depends on complexity",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    icon: Phone,
    title: "AI Call Agent / AI Receptionist",
    tag: "Upsell",
    description:
      "Handle inbound phone calls with an AI receptionist that answers 24/7. Captures buyer intent, routes to the right agent, and sends a WhatsApp viewing link automatically.",
    benefits: [
      "24/7 phone answering - no missed calls",
      "Natural-sounding AI voice agent",
      "Captures budget, location, and timeline",
      "Sends viewing link after the call",
    ],
    pricing: "Available as an add-on to any plan",
    accent: "from-violet-500 to-purple-500",
  },
]

export function OptionalOffersSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30 theme-transition">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Optional Add-Ons
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Go Further, If You Want To
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These are completely optional. The core system works perfectly on its own.
            But if you want a custom booking page or never miss a phone inquiry again, we can help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.title}
              className="flex flex-col p-6 md:p-8 rounded-2xl border border-border bg-card/60 hover:border-border/80 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${offer.accent} flex items-center justify-center`}
                >
                  <offer.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {offer.title}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {offer.tag}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {offer.description}
              </p>

              <ul className="space-y-2 mb-6 flex-grow">
                {offer.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2 text-sm text-foreground/80"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <p className="text-xs font-medium text-muted-foreground mb-4">
                {offer.pricing}
              </p>

              <Button
                asChild
                variant="outline"
                className="w-full rounded-xl border-border/60 hover:border-primary/30 transition-all"
              >
                <Link href="/contact">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
