import type { IndustryContent } from "../types"

export const businessWebsites: IndustryContent = {
  slug: "business-websites",
  published: true,
  index: true,

  name: "Business websites & web apps",
  formLabel: "Business website",
  icon: "globe",
  hubSummary:
    "Professional websites, booking systems, customer portals and simple internal tools for small and growing businesses.",

  seo: {
    title: "Business Websites & Web Apps | RapidNexTech",
    description:
      "Websites, booking systems, customer portals and internal tools for growing businesses. Fast on mobile, easy to update, and you own everything.",
    serviceType: "Business website and web application development",
  },

  hero: {
    eyebrow: "Websites & web apps",
    title: "Websites and web apps for growing businesses",
    intro:
      "A professional website that brings in enquiries, and the simple online tools around it: bookings, a customer portal, or an internal system that replaces the spreadsheet. Built on your existing hosting, easy for your team to update.",
    primaryCta: "Plan my project",
    secondaryCta: { label: "What we build", href: "#what-we-build" },
    chips: ["You own the site, code and domain", "Works with your existing hosting", "Written fixed quote before we start"],
  },

  // Placeholder price: to be confirmed with Dr. Nimr.
  startingFrom: { amount: 4500, currency: "SAR", note: "Final price depends on pages, features and content." },

  audience: {
    title: "Who this is for",
    intro: "Small and mid-sized businesses that have outgrown a basic web presence.",
    items: [
      {
        icon: "globe",
        title: "You already pay for hosting",
        description:
          "You have a domain and a hosting plan, but the website on it is old, half-finished or a placeholder page.",
      },
      {
        icon: "store",
        title: "You run on WhatsApp and referrals",
        description:
          "Work comes in through people you know, and you need a credible place to send new prospects before they call.",
      },
      {
        icon: "building",
        title: "You're adding branches or services",
        description:
          "The business has grown and the website, booking process and paperwork haven't kept up.",
      },
    ],
  },

  problems: {
    title: "What usually goes wrong",
    intro: "Most of the businesses we speak to recognise at least two of these.",
    items: [
      {
        icon: "clock",
        title: "The site no longer reflects the business",
        description:
          "Services, prices and photos are years out of date, and prospects compare you with competitors in seconds.",
      },
      {
        icon: "pen",
        title: "Every change needs a developer",
        description: "Small edits wait weeks, so the website stays wrong and nobody wants to send customers to it.",
      },
      {
        icon: "phone",
        title: "Bookings happen by phone and chat",
        description:
          "Staff spend hours confirming appointments and chasing details that a simple online form could collect.",
      },
      {
        icon: "file",
        title: "Customers keep asking for the same documents",
        description:
          "Quotes, invoices and project files are sent one email at a time because there's nowhere for clients to log in.",
      },
      {
        icon: "clipboard",
        title: "The office runs on spreadsheets",
        description:
          "Orders, jobs or stock are tracked in shared sheets that break, get overwritten, and only one person understands.",
      },
    ],
  },

  solutions: {
    title: "What we build for you",
    intro: "Start with what you need now. Each piece can be added later without rebuilding the rest.",
    items: [
      {
        icon: "globe",
        title: "Company website",
        description:
          "Clear pages for your services, team and locations, designed mobile-first and written around how your customers decide.",
        deliverables: ["Page plan and design", "Copywriting support", "Launch on your hosting"],
      },
      {
        icon: "pen",
        title: "Editable by your team",
        description:
          "Built on WordPress or a custom admin panel, so staff can change text, prices and photos themselves.",
        deliverables: ["Simple admin panel", "Recorded training session"],
      },
      {
        icon: "calendar",
        title: "Online booking",
        description:
          "Customers choose a service and time, get an automatic confirmation, and your team sees every booking in one place.",
        deliverables: ["Booking form and calendar", "Email confirmations", "Staff view of bookings"],
      },
      {
        icon: "users",
        title: "Customer portal",
        description:
          "A secure login where clients see their quotes, invoices, documents or project status without emailing you.",
        deliverables: ["Client accounts and login", "Document and status pages", "Admin to manage clients"],
      },
      {
        icon: "dashboard",
        title: "Simple internal tool",
        description:
          "Replace the shared spreadsheet with a small web app for jobs, orders or stock, with the right access for each person.",
        deliverables: ["Data entry screens", "Search and export", "User roles"],
      },
      {
        icon: "search",
        title: "Found on Google",
        description:
          "Page titles, site structure, speed and Google Business Profile set up properly from day one, plus analytics.",
        deliverables: ["Technical SEO setup", "Analytics and enquiry tracking"],
      },
    ],
  },

  scenarios: {
    title: "What this can look like",
    intro: "Illustrative examples of typical projects, not client results.",
    items: [
      {
        title: "Maintenance company with two branches",
        before: "A one-page site, bookings by phone, and a shared spreadsheet of jobs that two people edited at once.",
        after: "A full website with online booking per branch, and a small job tracker the office and technicians both use.",
      },
      {
        title: "Consultancy sending files by email",
        before: "Proposals, reports and invoices were emailed back and forth, and clients kept asking for the latest version.",
        after: "A professional website plus a client portal where each client logs in to see their own documents.",
      },
      {
        title: "Training provider with a placeholder site",
        before: "A domain and hosting plan paid for every year, showing only a 'coming soon' page.",
        after: "A course website with a registration form that sends each enquiry to the right coordinator.",
      },
    ],
  },

  proof: {
    title: "Projects we've delivered",
    intro: "Live systems built by our team. Each case study links to the working product.",
    items: [
      {
        title: "Lumière restaurant system",
        summary: "Online reservations, ordering and an admin area where staff manage bookings and orders in one place.",
        href: "/case-studies/lumiere-restaurant-management-system",
      },
      {
        title: "EduPlatform learning portal",
        summary: "A members-only portal with separate logins and views for instructors and students.",
        href: "/case-studies/eduplatform-fullstack-elearning-management-system",
      },
    ],
  },

  testimonialId: 2,

  faqs: [
    {
      question: "How much does a business website cost?",
      answer:
        "It depends on the number of pages, whether we write the content, and features such as booking or a client login. A focused company website is at the lower end; portals and internal tools are quoted on their scope. You get a written, fixed quote before any work starts.",
    },
    {
      question: "How long does it take?",
      answer:
        "A focused company website typically takes three to five weeks from approved plan to launch. Booking systems, portals and internal tools take longer, depending on scope. The timeline is agreed in writing in the proposal, and we show you progress at each checkpoint.",
    },
    {
      question: "Can you use my existing hosting and domain?",
      answer:
        "Yes, in most cases. We check that your hosting plan suits the site and tell you if anything needs upgrading. The domain and hosting account stay in your name.",
    },
    {
      question: "Who owns the website and the code?",
      answer:
        "You do. At handover you receive the admin access, source code and documentation. There is no lock-in, so you can keep working with us or move to another developer.",
    },
    {
      question: "Do I need to write all the content?",
      answer:
        "No. You give us the facts about your business, and we plan the pages and draft the copy for you to review. If you already have text, we can edit it for the web.",
    },
    {
      question: "What happens after launch?",
      answer:
        "Your team can manage everyday changes themselves. If you prefer, an optional monthly support plan covers updates, backup checks, fixes and small improvements.",
    },
    {
      question: "How does working remotely across time zones work?",
      answer:
        "We work with clients in the Gulf, the UK and the US by video call, email and shared progress links. We agree call times that suit your working day, and you see working progress at every checkpoint, not just at the end.",
    },
    {
      question: "Can the website be in Arabic?",
      answer:
        "Yes, on request. We can build an Arabic version or a bilingual English and Arabic site with a right-to-left layout. Tell us at the start so it is planned into the design and the quote.",
    },
  ],

  finalCta: {
    title: "Tell us what your business needs",
    body: "Share what you have today and what you'd like to fix. We'll reply with questions or a suggested approach, and a clear quote.",
    button: "Plan my project",
  },

  relatedIndustries: ["ecommerce-retail", "enterprise-it", "nonprofits"],

  sections: ["audience", "problems", "solutions", "scenarios", "proof", "testimonial", "process", "faq", "related"],
}
