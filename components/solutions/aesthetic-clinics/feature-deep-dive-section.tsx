import {
  Cloud,
  Brain,
  Link2,
  LayoutDashboard,
  Megaphone,
  BarChart3,
} from "lucide-react"

const features = [
  {
    icon: Cloud,
    title: "WhatsApp Cloud API Integration",
    description:
      "Direct integration with the official WhatsApp Cloud API for reliable, scalable messaging. Supports rich media, templates, and interactive messages. No third-party middleware.",
    tags: ["Official API", "Template Messages", "Rich Media"],
  },
  {
    icon: Brain,
    title: "AI Conversation Engine",
    description:
      "AI-led conversations for the most common patient interactions: price inquiries, treatment suitability, first-time qualification, availability, after-hours responses, and lead recovery.",
    tags: ["Price Inquiry", "Qualification", "After-Hours", "Lead Recovery"],
  },
  {
    icon: Link2,
    title: "Booking Platform Integration",
    description:
      "Works alongside your existing calendar and booking system. We send patients directly to your booking page \u2014 no migration, no disruption.",
    tags: ["Calendar Sync", "Booking Links", "No Migration"],
  },
  {
    icon: LayoutDashboard,
    title: "Conversation Dashboard",
    description:
      "View every patient interaction across all channels in one place. Monitor AI responses, see which inquiries converted, and let your team jump into any conversation when needed.",
    tags: ["Real-Time", "Multi-Channel", "Team Handover"],
  },
  {
    icon: Megaphone,
    title: "Campaign Broadcast System",
    description:
      "Send targeted broadcast campaigns to segmented patient lists. Promote seasonal offers, new treatments, or rebooking reminders at scale with compliance built in.",
    tags: ["Segmentation", "Automated Sends", "Consent Controls"],
  },
  {
    icon: BarChart3,
    title: "Conversion Analytics",
    description:
      "End-to-end visibility from inquiry to appointment. Track response times, conversion rates, channel performance, and revenue impact with clear, actionable reporting.",
    tags: [
      "Funnel Metrics",
      "Channel Breakdown",
      "Revenue Tracking + Predictive Lead Scoring (see exactly which inquiries turned into real AED revenue and which leads are most likely to book).",
    ],
  },
]

export function FeatureDeepDiveSection() {
  return (
    <section id="under-the-hood" className="py-20 md:py-28 bg-muted/30 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Under the Hood
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Engineered for{" "}
            <span className="theme-gradient-text bg-clip-text text-transparent">Patient Conversion</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every component is purpose-built for healthcare inquiry workflows.
            Here is what powers the system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm hover:border-border/80 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {feature.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
