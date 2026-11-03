import type { IndustryContent } from "../types"

export const financialServices: IndustryContent = {
  slug: "financial-services",
  published: true,
  index: true,

  name: "Financial services",
  formLabel: "Financial services",
  icon: "bank",
  hubSummary:
    "Client portals, approval workflows, reporting dashboards, document handling and integrations for finance businesses.",

  seo: {
    title: "Client Portals & Finance Workflow Software | RapidNexTech",
    description:
      "Client portals, approval workflows, reporting dashboards, document handling and API integrations for financial services firms.",
    serviceType: "Software development for financial services firms",
  },

  hero: {
    eyebrow: "Financial services",
    title: "Client portals and internal systems that replace email and spreadsheets",
    intro:
      "We build secure web applications for finance businesses: portals where clients share documents and see their status, approval workflows with a clear audit trail, and dashboards fed from the systems you already run.",
    primaryCta: "Discuss my project",
    secondaryCta: { label: "What we build", href: "#what-we-build" },
    chips: ["NDA before details are shared", "Role-based access and audit trails", "Your infrastructure, your data"],
  },

  // Placeholder price: to be confirmed with Dr. Nimr.
  startingFrom: { amount: 30000, currency: "SAR", note: "Scope, integrations and security requirements set the final price." },

  audience: {
    title: "Who this is for",
    items: [
      {
        icon: "bank",
        title: "Finance and leasing companies",
        description: "Teams handling applications, documents and approvals for many clients at once.",
      },
      {
        icon: "chart",
        title: "Advisory and accounting firms",
        description: "Firms that collect client documents every period and report back on accounts, investments or tax.",
      },
      {
        icon: "building",
        title: "Finance teams inside larger companies",
        description: "Departments running payments, expenses and reporting through email chains and shared workbooks.",
      },
    ],
  },

  problems: {
    title: "Where the work slows down",
    items: [
      {
        icon: "mail",
        title: "Sensitive documents travel by email",
        description: "Statements, IDs and contracts are sent as attachments, re-requested, and saved in several places.",
      },
      {
        icon: "workflow",
        title: "Approvals have no clear trail",
        description: "Sign-offs happen in email and chat, so it is hard to see who approved what, and when.",
      },
      {
        icon: "chart",
        title: "Reports are rebuilt by hand",
        description: "Analysts export data from several systems and reconcile spreadsheets before every management meeting.",
      },
      {
        icon: "phone",
        title: "Clients call to ask for a status update",
        description: "Without a portal, every 'where is my application?' question becomes a call or an email for your team.",
      },
    ],
  },

  solutions: {
    title: "What we build for finance teams",
    intro: "Scoped around your processes, and around the requirements your compliance team sets.",
    items: [
      {
        icon: "users",
        title: "Client portals",
        description: "Secure logins where clients upload documents, see application or account status, and message your team.",
        deliverables: ["Client accounts with two-step login", "Document upload and status pages", "Staff admin console"],
      },
      {
        icon: "workflow",
        title: "Workflow and approval systems",
        description: "Multi-step approvals with limits by role, reminders, and a complete record of every decision.",
        deliverables: ["Configurable approval stages", "Audit trail", "Notifications and escalations"],
      },
      {
        icon: "dashboard",
        title: "Reporting dashboards",
        description: "Live views of volumes, balances, pipeline or performance, built on data from your existing systems.",
        deliverables: ["Agreed metric definitions", "Dashboards by role", "Scheduled exports"],
      },
      {
        icon: "file",
        title: "Document handling",
        description: "Structured document collection, versioning and retention rules, with optional AI extraction of key fields for staff to check.",
        deliverables: ["Document requests and checklists", "Version history", "Field extraction with review"],
      },
      {
        icon: "plug",
        title: "API integrations",
        description: "Connections to core systems, CRMs, accounting software and third-party data providers through their APIs.",
        deliverables: ["Integration design", "Error handling and logging", "Technical documentation"],
      },
      {
        icon: "lock",
        title: "Secure development practices",
        description: "Role-based access, encrypted connections, input validation, code review and least-privilege access to environments, applied throughout the build.",
        deliverables: ["Access model agreed with you", "Security review before launch"],
      },
    ],
  },

  scenarios: {
    title: "What this can look like",
    intro: "Illustrative examples of typical projects, not client results.",
    items: [
      {
        title: "Equipment leasing company",
        before: "Applicants emailed documents, staff chased missing pages, and approvals were confirmed in chat messages.",
        after: "A client portal with a document checklist, and an approval workflow that records each decision.",
      },
      {
        title: "Accounting firm",
        before: "Each month, clients were emailed for statements and receipts, and reports were assembled in spreadsheets.",
        after: "A portal for monthly uploads and a dashboard that shows each client's status at a glance.",
      },
    ],
  },

  proof: {
    title: "Related work from other sectors",
    intro: "Live systems built by our team. These are not financial-services clients.",
    items: [
      {
        title: "LeadFlow CRM",
        summary: "Pipelines, assignment rules and real-time dashboards for a team managing a high volume of records.",
        href: "/case-studies/leadflow-crm-case-study",
      },
      {
        title: "FlowAutomate workflow automation",
        summary: "Automated multi-step workflows with triggers, actions and a full run history.",
        href: "/case-studies/flow-automate-ai-automation",
      },
    ],
  },

  testimonialId: 1,

  faqs: [
    {
      question: "How do you handle regulatory and compliance requirements?",
      answer:
        "Compliance requirements are scoped with your own compliance team at the start of the project. We build to the requirements they set, such as access rules, data retention and audit trails, and document how the system meets each one. We don't provide regulatory advice or certification.",
    },
    {
      question: "How do you keep client data secure during development?",
      answer:
        "We follow secure development practices: role-based access, encrypted connections, validated inputs, code review, and least-privilege access to environments. We can work with anonymised or test data, and sign an NDA before any details are shared.",
    },
    {
      question: "Where will the system and data be hosted?",
      answer:
        "Where your requirements say: on your own servers, a local data centre or a cloud region you choose. We deploy to your infrastructure, so the data stays under your control.",
    },
    {
      question: "What drives the cost?",
      answer:
        "The number of user roles and workflows, integrations with core and third-party systems, document and data migration, and the security and audit requirements your team sets. We quote per phase, in writing, after discovery.",
    },
    {
      question: "How long does a client portal or workflow system take?",
      answer:
        "A focused first release typically takes three to five months, including your security review. We deliver in phases so one process or client group can go live before the next is built.",
    },
    {
      question: "Who owns the code?",
      answer:
        "You do. The source code is kept in repositories you control, and you receive full documentation so your in-house team or another provider can maintain it.",
    },
    {
      question: "What support is available after launch?",
      answer:
        "Monthly support covers monitoring, security updates, fixes and changes as your processes evolve. Response times and responsibilities are agreed in writing.",
    },
    {
      question: "Can the portal be in Arabic?",
      answer:
        "Yes, on request. Client-facing screens, documents and notifications can be in Arabic or bilingual, with right-to-left layouts. Tell us at the start so it is included in the scope.",
    },
  ],

  finalCta: {
    title: "Tell us about the process you want to improve",
    body: "Describe the workflow, the people involved and the systems in use. We'll reply with questions or a suggested approach, and sign an NDA first if you need one.",
    button: "Discuss my project",
  },

  relatedIndustries: ["enterprise-it", "ecommerce-retail", "business-websites"],

  sections: ["audience", "problems", "solutions", "scenarios", "proof", "testimonial", "process", "faq", "related"],
}
