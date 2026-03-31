import {
  Globe,
  MessageCircle,
  Bot,
  Bell,
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

const solutions = [
  {
    icon: Globe,
    title: "Multi-Channel Inquiry Automation",
    description:
      "Respond instantly to inquiries from Instagram, WhatsApp, or your website \u2014 from one system. No missed messages, no manual routing.",
    outcome: "Every inquiry on Instagram, WhatsApp, or website gets an instant response in under 60 seconds.",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Conversation Engine",
    description:
      "AI-led WhatsApp conversations that qualify leads, answer treatment questions, and guide patients to your booking page \u2014 with zero manual work.",
    outcome: "AI qualifies leads, answers treatment questions, and guides patients straight to your booking page \u2014 zero manual work.",
    accent: "from-emerald-500 to-green-500",
  },
  {
    icon: Bot,
    title: "AI Receptionist Layer",
    description:
      "Your AI Sales Rep that mirrors your clinic tone and handles pricing, suitability, availability, and lead recovery \u2014 24/7.",
    outcome: "Your intelligent AI Sales Rep that handles price inquiries, treatment suitability, availability, and lead recovery using your exact clinic tone and branding.",
    accent: "from-violet-500 to-purple-500",
  },
  {
    icon: Bell,
    title: "Reminder & Rebooking System",
    description:
      "Automated confirmations, no-show follow-ups, and treatment-cycle reminders that keep patients returning on schedule.",
    outcome: "Automated confirmations + treatment-cycle rebooking reminders that protect your recurring revenue and cut no-shows.",
    accent: "from-orange-500 to-amber-500",
  },
]

export function SolutionSection() {
  return (
    <section id="solution" className="py-20 md:py-28 bg-muted/30 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            The Solution
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Zero-Lead-Loss AI Closer{" "}
            <span className="theme-gradient-text bg-clip-text text-transparent">for Aesthetic Clinics</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-3">
            Your 24/7 AI Sales Rep and revenue engine that recovers every lost inquiry &mdash; automatically.
            We never replace your booking system. We sit on top and turn inquiries into revenue.
          </p>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            This is the unfair advantage over basic bots like Wati, Wazzy, or HalaFlow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {solutions.map((solution) => (
            <Card
              key={solution.title}
              className="group border-border bg-card/60 backdrop-blur-sm hover:border-border/80 hover:shadow-lg transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${solution.accent} flex items-center justify-center`}
                  >
                    <solution.icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">{solution.title}</CardTitle>
                </div>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  {solution.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap mt-0.5">
                    Outcome
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    {solution.outcome}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
