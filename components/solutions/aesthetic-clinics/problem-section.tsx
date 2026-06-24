import { MessageCircle, Moon, Users } from "lucide-react"

const problems = [
  {
    icon: MessageCircle,
    title: '"Price kya hai?" — 50 times a day',
    description:
      "Your staff answer the same questions on repeat — treatments, timings, rates — instead of attending to patients sitting in your clinic.",
  },
  {
    icon: Moon,
    title: "11 PM inquiries go cold by 9 AM",
    description:
      "Most aesthetic patients message late, after scrolling Instagram. No one replies. By morning, they've messaged three other clinics.",
  },
  {
    icon: Users,
    title: "Your front desk is one person, not three",
    description:
      "Walk-ins, phone calls, WhatsApp, Instagram DMs — all at once. One person can't catch everything. Messages slip, bookings slip with them.",
  },
]

export function ProblemSection() {
  return (
    <section id="problem" className="py-20 md:py-28 theme-transition">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            The Problem
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            Lahore Clinics Lose Patients{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Inside WhatsApp
            </span>{" "}
            Every Day
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You pay for Instagram ads to make patients message you. Then those messages sit
            unanswered — and warm patients quietly book elsewhere.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="group flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-border/80 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <problem.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2 leading-snug">
                  {problem.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
