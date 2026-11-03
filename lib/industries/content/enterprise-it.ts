import type { IndustryContent } from "../types"

export const enterpriseIt: IndustryContent = {
  slug: "enterprise-it",
  published: true,
  index: true,

  name: "Enterprise & IT services",
  formLabel: "Enterprise & IT services",
  icon: "code",
  hubSummary:
    "Custom software, SaaS products, integrations, AI and automation, plus white-label development capacity for IT consultancies.",

  seo: {
    title: "Custom Software & White-Label Development | RapidNexTech",
    description:
      "Custom software, SaaS, APIs, dashboards, AI and automation for companies, plus white-label development capacity for IT consultancies.",
    serviceType: "Custom software development and white-label development",
  },

  hero: {
    eyebrow: "Enterprise & IT services",
    title: "Engineering capacity for the systems your business depends on",
    intro:
      "We design and build custom software, SaaS products, integrations and automation for companies, and work as a white-label development team for IT consultancies that need more engineers without hiring.",
    primaryCta: "Discuss my project",
    secondaryCta: { label: "What we build", href: "#what-we-build" },
    chips: ["NDA before details are shared", "Your repositories, your IP", "Fixed-scope or monthly team"],
  },

  // Placeholder price: to be confirmed with Dr. Nimr.
  startingFrom: { amount: 25000, currency: "SAR", note: "Larger systems are scoped and quoted in phases." },

  audience: {
    title: "Who we work with",
    items: [
      {
        icon: "building",
        title: "Companies with a process to digitise",
        description: "Operations, finance or sales teams held together by email, spreadsheets and tools that don't talk to each other.",
      },
      {
        icon: "sparkles",
        title: "Founders and product teams",
        description: "You have a SaaS or platform idea, or a first version that needs a proper engineering team to take it further.",
      },
      {
        icon: "users",
        title: "IT consultancies and agencies",
        description: "You win more development work than your team can deliver and need reliable engineers under your brand.",
      },
    ],
  },

  problems: {
    title: "The problems we're usually called in for",
    items: [
      {
        icon: "plug",
        title: "Systems that don't talk to each other",
        description: "CRM, ERP, accounting and in-house tools each hold part of the picture, and people move data between them by hand.",
      },
      {
        icon: "workflow",
        title: "Approvals and handoffs stuck in email",
        description: "Requests wait in inboxes, nobody can see where they are, and audits mean digging through threads.",
      },
      {
        icon: "chart",
        title: "Reporting takes days",
        description: "Every month someone exports, merges and formats spreadsheets before management can see the numbers.",
      },
      {
        icon: "users",
        title: "Not enough engineers for the pipeline",
        description: "Projects are sold or planned, but hiring takes months and the current team is already fully booked.",
      },
    ],
  },

  solutions: {
    title: "What we build",
    intro: "Delivered as a fixed-scope project, or by a dedicated team working inside your process.",
    items: [
      {
        icon: "code",
        title: "Custom business software",
        description: "Internal systems built around how your teams work: requests, approvals, job tracking, scheduling and records.",
        deliverables: ["Requirements and workflow mapping", "Role-based web application", "Documentation and handover"],
      },
      {
        icon: "sparkles",
        title: "SaaS products",
        description: "Multi-user products with accounts, subscriptions and admin tools, from first version to ongoing releases.",
        deliverables: ["Product scoping", "MVP build", "Release plan"],
      },
      {
        icon: "plug",
        title: "APIs and integrations",
        description: "APIs for your own products, and integrations between CRM, ERP, accounting, payment and messaging systems.",
        deliverables: ["API design and documentation", "Integration with retries and logging"],
      },
      {
        icon: "dashboard",
        title: "Dashboards and reporting",
        description: "Live dashboards that pull from your existing systems, so managers see current numbers without a monthly export.",
        deliverables: ["KPI definitions with your team", "Live dashboard", "Scheduled reports"],
      },
      {
        icon: "workflow",
        title: "AI and automation",
        description: "Automated workflows and AI features such as document extraction, support assistants and lead triage, with a person in the loop where it matters.",
        deliverables: ["Process review", "Automation build", "Monitoring and fallbacks"],
      },
      {
        icon: "users",
        title: "White-label development for IT firms",
        description: "Our engineers deliver under your brand, in your repositories and project tools, while you keep the client relationship.",
        deliverables: ["NDA and white-label terms", "Engineers in your tools and stand-ups", "Code reviews and handover notes"],
      },
    ],
  },

  scenarios: {
    title: "What this can look like",
    intro: "Illustrative examples of typical projects, not client results.",
    items: [
      {
        title: "Procurement approvals",
        before: "Purchase requests went by email, approvers lost track, and finance rebuilt the history for every audit.",
        after: "A request and approval system with clear stages, notifications and a full history of every decision.",
      },
      {
        title: "IT consultancy at capacity",
        before: "Two client projects were signed, but the in-house team could only start one of them this quarter.",
        after: "A white-label team delivered the second project in the consultancy's own repositories and stand-ups.",
      },
      {
        title: "Operations reporting",
        before: "Managers waited until the second week of each month for a spreadsheet report built by hand.",
        after: "A live dashboard fed from the CRM and accounting system, with a weekly summary emailed automatically.",
      },
    ],
  },

  proof: {
    title: "Systems we've built",
    intro: "Live products built by our team. Each case study links to the working system.",
    items: [
      {
        title: "SupportAI knowledge-base assistant",
        summary: "An AI support assistant that answers from a company's own documents, with an admin area to manage the knowledge base.",
        href: "/case-studies/support-ai-chatbot-platform",
      },
      {
        title: "FlowAutomate workflow automation",
        summary: "A platform for building automated business workflows with triggers, actions and run history.",
        href: "/case-studies/flow-automate-ai-automation",
      },
      {
        title: "LeadFlow CRM",
        summary: "A lead management system with pipelines, assignment and real-time dashboards for sales teams.",
        href: "/case-studies/leadflow-crm-case-study",
      },
    ],
  },

  testimonialId: 1,

  faqs: [
    {
      question: "How do you price custom software?",
      answer:
        "Cost depends on the number of user roles and workflows, the integrations involved, data migration, and how polished the first version needs to be. We usually recommend a short discovery phase, then a fixed price per phase, or a monthly rate for a dedicated team.",
    },
    {
      question: "How long does a typical project take?",
      answer:
        "A focused first version of an internal system or integration typically takes two to four months. Larger platforms are delivered in phases, each with a working release you can use, rather than one long build.",
    },
    {
      question: "How does white-label development work?",
      answer:
        "You keep the client relationship and your brand. Our engineers work in your repositories, ticketing and communication tools, follow your coding standards, and don't contact your client unless you ask us to. We sign an NDA and white-label terms before any client details are shared.",
    },
    {
      question: "Who owns the code and intellectual property?",
      answer:
        "You do. Code is written in repositories you control, and ownership of the work transfers to you under the agreement. For white-label work, it transfers to you so you can pass it to your client.",
    },
    {
      question: "Where is the software hosted?",
      answer:
        "Wherever suits your requirements: your own servers, your hosting provider, or a cloud platform you choose. We set up deployment, backups and monitoring as part of the handover.",
    },
    {
      question: "What support do you provide after launch?",
      answer:
        "We fix defects found after launch, and offer monthly support for maintenance, monitoring, security updates and new features. For white-label clients, support can run under your brand.",
    },
    {
      question: "How do you handle time zones and communication?",
      answer:
        "We work remotely with clients in the Gulf, the UK and the US. We agree call times that overlap with your working day, give written progress updates at each checkpoint, and keep all work visible in shared project tools.",
    },
    {
      question: "Can the software support Arabic?",
      answer:
        "Yes, on request. Interfaces can be built in Arabic or bilingual with right-to-left layouts, and handle Arabic text in search, reports and documents. Tell us at the start so it is part of the scope.",
    },
  ],

  finalCta: {
    title: "Tell us about the system, or the capacity, you need",
    body: "Describe the problem or the project in a few sentences. We'll reply with questions or a suggested approach, and sign an NDA first if you need one.",
    button: "Discuss my project",
  },

  relatedIndustries: ["financial-services", "ecommerce-retail", "business-websites"],

  sections: ["audience", "problems", "solutions", "scenarios", "proof", "testimonial", "process", "faq", "related"],
}
