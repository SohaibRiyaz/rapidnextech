import { Zap, Languages, Filter, CalendarCheck } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Instant Replies, 24/7",
    description:
      "Every message answered in under 60 seconds — day, night, weekend. No patient left waiting, no lead gone cold.",
    accent: "from-emerald-500 to-green-500",
  },
  {
    icon: Languages,
    title: "Replies in Roman Urdu or English",
    description:
      "Patients message in Roman Urdu, English, or a mix — the assistant replies the same way, naturally. Most patients don't realise they aren't chatting with a real coordinator.",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    icon: Filter,
    title: "Answers & Qualifies Automatically",
    description:
      "Handles everyday questions — treatments, timings, general pricing — and figures out what the patient needs, so only serious, ready-to-book patients reach your team.",
    accent: "from-violet-500 to-purple-500",
  },
  {
    icon: CalendarCheck,
    title: "Books Consultations For You",
    description:
      "When a patient's ready, it collects their details and sends a confirmed booking request to your team. No back-and-forth, no missed leads.",
    accent: "from-orange-500 to-amber-500",
  },
]

export function SolutionSection() {
  return (
    <section id="solution" className="py-20 md:py-28 bg-muted/30 theme-transition">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            The Solution
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            A WhatsApp Receptionist{" "}
            <span className="theme-gradient-text bg-clip-text text-transparent">
              That Never Misses a Message
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We set up a smart booking assistant on your clinic&apos;s existing WhatsApp. It replies to
            every patient instantly, answers questions, understands what treatment they want, and books
            a consultation — around the clock. Your team only steps in when a real booking is ready.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex gap-4 p-6 rounded-2xl border border-border bg-card/60 hover:border-border/80 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.accent} flex items-center justify-center flex-shrink-0`}
              >
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
