import type { IndustryContent } from "../types"

export const nonprofits: IndustryContent = {
  slug: "nonprofits",
  published: true,
  index: true,

  name: "Non-profits & charities",
  formLabel: "Non-profit / NGO",
  icon: "heart",
  hubSummary:
    "Websites, online donations, volunteer and member management, case tracking and reports for donors and boards.",

  seo: {
    title: "Websites & Software for Non-profits | RapidNexTech",
    description:
      "Websites, donation pages, volunteer and member management, case tracking and donor reports for charities, foundations and NGOs.",
    serviceType: "Website and software development for non-profit organisations",
  },

  hero: {
    eyebrow: "Non-profits & charities",
    title: "Spend less time on admin and more on your mission",
    intro:
      "We build websites, donation pages and the simple systems behind them, for volunteers, members, cases and reports, so a small team can run a bigger programme.",
    primaryCta: "Plan my project",
    secondaryCta: { label: "What we build", href: "#what-we-build" },
    chips: ["Built to fit a non-profit budget", "Start small, add more later", "You own the system and the data"],
  },

  // Placeholder price: to be confirmed with Dr. Nimr.
  startingFrom: { amount: 4000, currency: "SAR", note: "Final price depends on pages, features and integrations." },

  audience: {
    title: "Who this is for",
    items: [
      {
        icon: "heart",
        title: "Charities and foundations",
        description: "Organisations that raise funds from individuals and need to show donors where the money goes.",
      },
      {
        icon: "users",
        title: "Associations and member bodies",
        description: "Groups that manage members, renewals, events and communications with a small staff.",
      },
      {
        icon: "clipboard",
        title: "Programme and service NGOs",
        description: "Teams that support beneficiaries and need to track cases, services and outcomes properly.",
      },
    ],
  },

  problems: {
    title: "What holds small teams back",
    items: [
      {
        icon: "card",
        title: "Giving online is awkward",
        description: "Supporters are sent bank details or a generic payment link, and many give up before donating.",
      },
      {
        icon: "users",
        title: "Volunteers and members live in spreadsheets",
        description: "Sign-ups, availability and renewals are spread across forms, sheets and phones, and people fall through the gaps.",
      },
      {
        icon: "lock",
        title: "Beneficiary records are scattered",
        description: "Case notes sit in personal files and inboxes, which is hard to manage and harder to keep confidential.",
      },
      {
        icon: "chart",
        title: "Reports for donors take weeks",
        description: "Every funder update and board meeting means collecting numbers from several people by hand.",
      },
    ],
  },

  solutions: {
    title: "What we build for non-profits",
    intro: "Each piece can be built on its own. Many organisations start with the website and donations, and add the rest later.",
    items: [
      {
        icon: "globe",
        title: "Organisation website",
        description: "A clear website that explains your mission, programmes and impact, and that staff can update without a developer.",
        deliverables: ["Website design and build", "Editable news and programme pages"],
      },
      {
        icon: "card",
        title: "Donation pages and payment integration",
        description: "One-off and monthly giving through your chosen payment gateway, with automatic receipts and campaign tracking.",
        deliverables: ["Donation forms", "Recurring giving", "Automatic receipts"],
      },
      {
        icon: "users",
        title: "Volunteer and member management",
        description: "Online sign-up, profiles, availability, renewals and messaging, all in one place instead of several spreadsheets.",
        deliverables: ["Sign-up and profiles", "Renewal reminders", "Group messaging"],
      },
      {
        icon: "calendar",
        title: "Event and campaign pages",
        description: "Pages for appeals, fundraisers and events, with registration, ticketing or pledges and a progress tracker.",
        deliverables: ["Campaign page template", "Registration and attendee lists"],
      },
      {
        icon: "lock",
        title: "Beneficiary and case tracking",
        description: "A secure system for case records, services delivered and follow-ups, where each staff member sees only what they need.",
        deliverables: ["Case records and notes", "Role-based access", "Activity history"],
      },
      {
        icon: "chart",
        title: "Dashboards for donors and boards",
        description: "Live figures on funds raised, people supported and programme activity, ready to share with funders and trustees.",
        deliverables: ["Impact dashboard", "Exportable funder reports"],
      },
    ],
  },

  scenarios: {
    title: "What this can look like",
    intro: "Illustrative examples of typical projects, not client results.",
    items: [
      {
        title: "Community food charity",
        before: "Donations by bank transfer only, and volunteer shifts organised in a group chat.",
        after: "A website with monthly giving and a volunteer rota where people choose their own shifts.",
      },
      {
        title: "Education foundation",
        before: "Scholarship cases tracked in personal spreadsheets, and the annual donor report took a month to compile.",
        after: "A case tracking system with access by role, and a dashboard that produces the donor report in minutes.",
      },
    ],
  },

  testimonialId: 1,

  faqs: [
    {
      question: "We have a small budget. Where should we start?",
      answer:
        "Usually with the website and online donations, because they bring in support straight away. Volunteer management, case tracking and dashboards can follow in later phases, each quoted separately so you can plan around funding.",
    },
    {
      question: "What affects the cost?",
      answer:
        "The number of pages, which features you need (donations, member accounts, case records), the payment gateway, and whether data has to be moved from existing spreadsheets. You get a fixed quote in writing before work starts.",
    },
    {
      question: "How long does it take?",
      answer:
        "A website with donation pages typically takes four to six weeks. Systems for members, volunteers or cases take longer and are planned in phases, so your team can start using the first part early.",
    },
    {
      question: "How do you keep beneficiary information confidential?",
      answer:
        "We build in access by role, so staff see only the records they need, plus secure logins, encrypted connections and activity history. Your organisation decides its own data protection policies and we build the system to support them.",
    },
    {
      question: "Which payment providers can you use for donations?",
      answer:
        "We integrate with the payment gateway your organisation already uses or chooses, for cards and Apple Pay. Donations go directly to your organisation's merchant account.",
    },
    {
      question: "Who owns the website and the data?",
      answer:
        "Your organisation does: the website, code, domain and all donor, member and beneficiary data. You receive full admin access and documentation at handover.",
    },
    {
      question: "Can our volunteers or staff update the website?",
      answer:
        "Yes. News, programme pages, campaigns and events are edited from a simple admin panel, and we include a recorded training session at handover.",
    },
    {
      question: "Can the website be in Arabic?",
      answer:
        "Yes, on request. We can build Arabic or bilingual English and Arabic pages with a right-to-left layout, including donation forms and receipts. Tell us at the start so it is part of the plan.",
    },
  ],

  finalCta: {
    title: "Tell us about your organisation",
    body: "Share your mission, your team size and where admin slows you down. We'll reply with questions or a phased plan, and a clear quote.",
    button: "Plan my project",
  },

  relatedIndustries: ["business-websites", "enterprise-it"],

  sections: ["audience", "problems", "solutions", "scenarios", "testimonial", "process", "faq", "related"],
}
