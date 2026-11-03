import type { IndustryContent } from "../types"

export const businessWebsites: IndustryContent = {
  slug: "business-websites",
  // Draft: published in Patch 3 once copy and the starting price are confirmed.
  published: false,
  index: true,

  name: "Business websites",
  formLabel: "Business website",
  icon: "globe",
  hubSummary:
    "A professional website your team can update, that loads fast on mobile and turns visitors into enquiries.",

  seo: {
    title: "Business Website Design & Development | RapidNexTech",
    description:
      "Professional websites for growing businesses: fast on mobile, easy to update, built to bring in enquiries. WordPress or custom. Free consultation.",
    serviceType: "Business website design and development",
  },

  hero: {
    eyebrow: "Business websites",
    title: "A website that wins you customers, not one you apologise for.",
    intro:
      "We design and build professional websites for growing businesses: fast on mobile, easy for your team to update, and set up so every enquiry reaches the right person.",
    primaryCta: "Plan my new website",
    secondaryCta: { label: "What's included", href: "#solutions" },
    chips: ["You own the site and the domain", "Works with your existing hosting", "Clear fixed quote before we start"],
  },

  startingFrom: { amount: 4500, currency: "SAR", note: "Final price depends on pages, features and content." },

  audience: {
    title: "Built for businesses like yours",
    items: [
      {
        icon: "store",
        title: "Owner-led businesses",
        description: "Clinics, contractors, trading companies and service firms whose website no longer reflects the business.",
      },
      {
        icon: "building",
        title: "Growing companies",
        description: "Teams adding branches, services or markets who need a site that grows with them instead of a rebuild every year.",
      },
      {
        icon: "globe",
        title: "Businesses with no website yet",
        description: "You run on WhatsApp and referrals today and want a credible place to send new customers.",
      },
    ],
  },

  problems: {
    title: "Sound familiar?",
    intro: "Most of the businesses we speak to have at least one of these.",
    items: [
      {
        icon: "clock",
        title: "It looks out of date",
        description: "Prospects compare you with competitors in seconds. An old design quietly tells them to look elsewhere.",
      },
      {
        icon: "pen",
        title: "Nobody can update it",
        description: "Every change waits for a developer, so prices, services and team pages stay wrong for months.",
      },
      {
        icon: "phone",
        title: "It's slow on mobile",
        description: "Most visitors arrive on a phone. If pages take too long to load, they leave before seeing what you offer.",
      },
      {
        icon: "mail",
        title: "Enquiries go missing",
        description: "A generic contact form sends messages to an inbox no one checks, and leads go cold.",
      },
    ],
  },

  solutions: {
    title: "What we build for you",
    intro: "Every project is quoted on what you actually need. These are the building blocks most businesses choose from.",
    items: [
      {
        icon: "globe",
        title: "Company website",
        description: "Clear pages for your services, team and locations, designed for mobile first and written around how customers buy.",
        deliverables: ["Page structure and wireframes", "Mobile and desktop design", "Launch on your hosting"],
      },
      {
        icon: "pen",
        title: "Easy editing",
        description: "Built on WordPress or a custom editor, so your team can change text, prices and photos without calling us.",
        deliverables: ["Simple admin panel", "Short training video"],
      },
      {
        icon: "message",
        title: "Enquiries that reach the right person",
        description: "Quote and contact forms routed by service or branch, with optional WhatsApp and email notifications.",
        deliverables: ["Smart enquiry forms", "Spam protection", "Notification routing"],
      },
      {
        icon: "calendar",
        title: "Bookings and appointments",
        description: "Let customers request or book a time online, with confirmations sent automatically.",
      },
      {
        icon: "search",
        title: "Found on Google",
        description: "Technical SEO foundations, page titles, Google Business Profile setup and analytics from day one.",
      },
      {
        icon: "refresh",
        title: "Redesign or migration",
        description: "Already have a site? We can redesign it and move your content without losing what already ranks.",
      },
    ],
  },

  scenarios: {
    title: "What this can look like",
    intro: "Illustrative examples of typical projects, not client results.",
    items: [
      {
        title: "Service company with three branches",
        before: "A 2015 website, one contact form for everyone, and price lists only the developer could change.",
        after: "An editable website with a page per branch and quote requests routed to the right branch manager.",
      },
      {
        title: "Consultancy without a website",
        before: "New clients came only through referrals and WhatsApp, with nowhere credible to send them.",
        after: "A focused five-page site with case examples and a consultation form, live in a few weeks.",
      },
    ],
  },

  faqs: [
    {
      question: "Can you use my existing hosting and domain?",
      answer:
        "Yes. We build on your current hosting where it meets the site's needs, or advise on what to change. You keep ownership of the domain, hosting account and website.",
    },
    {
      question: "Do I need to write all the content?",
      answer:
        "No. You give us the facts about your business and we structure the pages and draft the copy for you to review. You can also supply your own text.",
    },
    {
      question: "Can my team update the website themselves?",
      answer:
        "Yes. Everyday changes like text, images, prices and team members are done from a simple admin panel. We include a short training video at handover.",
    },
    {
      question: "How long does a website take?",
      answer:
        "It depends on the number of pages and features. We agree a timeline in the written proposal before work starts and keep you updated at each stage.",
    },
    {
      question: "What happens after launch?",
      answer:
        "You can manage the site yourself, or choose an optional monthly care plan for updates, backup checks and small changes.",
    },
  ],

  finalCta: {
    title: "Tell us about your business",
    body: "Share what you have today and what you need. We'll reply with questions or a suggested approach and a clear quote.",
    button: "Plan my new website",
  },

  sections: ["audience", "problems", "solutions", "scenarios", "process", "faq"],
}
