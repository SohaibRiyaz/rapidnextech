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
    title: "Goal Qualification Logic",
    description:
      "Automation for nutrition inquiries: weight goals, dietary preferences, restrictions, budget range, timeline, and commitment level. Keeps your coaches focused on serious prospects.",
    tags: ["Goal Clarity", "Dietary Fit", "Lead Recovery", "Timeline"],
  },
  {
    icon: Link2,
    title: "Consultation + Checkout Integration",
    description:
      "Works with Calendly, Google Calendar, Acuity, or your payment checkout. If you do not have a booking system, we build a lightweight booking or plan checkout page on your website.",
    tags: ["Calendly", "Google Calendar", "Stripe", "Custom Page"],
  },
  {
    icon: LayoutDashboard,
    title: "Conversation Dashboard",
    description:
      "View every lead across WhatsApp, website chat, and social DMs in one place. Monitor AI responses, see which inquiries converted, and jump into any conversation when needed.",
    tags: ["Real-Time", "Multi-Channel", "Team Handover"],
  },
  {
    icon: Megaphone,
    title: "Retention & Renewal Campaigns",
    description:
      "Send automated check-ins, plan renewals, and upgrade offers to segmented client lists. Built-in compliance and opt-out handling.",
    tags: ["Segmentation", "Renewals", "Compliance"],
  },
  {
    icon: BarChart3,
    title: "Conversion Analytics",
    description:
      "End-to-end visibility from inquiry to consultation or plan purchase. Track response times, conversion rates, and revenue impact with clear reporting.",
    tags: ["Funnel Metrics", "Channel Breakdown", "Revenue Tracking"],
  },
]

export function FeatureDeepDiveSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Under the Hood
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Engineered for{" "}
            <span className="theme-gradient-text bg-clip-text text-transparent">Nutrition Client Conversion</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every component is purpose-built for diet plan and nutrition inquiry workflows.
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
