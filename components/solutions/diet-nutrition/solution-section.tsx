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
    title: "WhatsApp Consultation Automation",
    description:
      "Respond instantly to diet inquiries from WhatsApp, Instagram, and website chat. Every lead is captured and handled consistently.",
    outcome: "Every inquiry gets a response in under 60 seconds.",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    icon: MessageCircle,
    title: "Goal Qualification Engine",
    description:
      "Automated questions capture goals, dietary preferences, restrictions, and timelines so your team speaks only with qualified prospects.",
    outcome: "Higher-quality leads and faster conversions.",
    accent: "from-emerald-500 to-green-500",
  },
  {
    icon: Bot,
    title: "Consultation Booking Flow",
    description:
      "Qualified prospects receive a booking link to schedule a consultation or purchase a plan. If you do not have a booking tool, we build a simple booking page.",
    outcome: "More consultations booked with less manual effort.",
    accent: "from-violet-500 to-purple-500",
  },
  {
    icon: Bell,
    title: "Subscription Reminder System",
    description:
      "Automated reminders for plan renewals, check-ins, and progress follow-ups keep clients engaged and reduce churn.",
    outcome: "More recurring revenue and longer client retention.",
    accent: "from-orange-500 to-amber-500",
  },
]

export function SolutionSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            The Solution
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            AI Diet Inquiry{" "}
            <span className="theme-gradient-text bg-clip-text text-transparent">Conversion</span>
            <br className="hidden md:block" /> &amp; Retention System
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-3">
            Four integrated systems working together to capture, qualify, and convert diet inquiries automatically.
          </p>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            We do not replace your booking tool or checkout. We sit on top of it.
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
