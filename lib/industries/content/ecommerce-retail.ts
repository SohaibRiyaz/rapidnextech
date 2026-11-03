import type { IndustryContent } from "../types"

export const ecommerceRetail: IndustryContent = {
  slug: "ecommerce-retail",
  published: true,
  index: true,

  name: "E-commerce & retail",
  formLabel: "E-commerce & retail",
  icon: "cart",
  hubSummary:
    "Online stores, custom storefronts and the order, stock and payment systems behind them, for retailers and distributors.",

  seo: {
    title: "E-commerce Store Development for Retailers | RapidNexTech",
    description:
      "Online stores and custom storefronts with local payment gateways, shipping, stock and order management, and ERP or CRM integration.",
    serviceType: "E-commerce website and online store development",
  },

  hero: {
    eyebrow: "E-commerce & retail",
    title: "Sell online without the manual work behind every order",
    intro:
      "We build online stores and custom storefronts that take local payments, connect to your couriers, and keep stock and orders in step with the rest of your business.",
    primaryCta: "Plan my online store",
    secondaryCta: { label: "What we build", href: "#what-we-build" },
    chips: ["Local payment methods", "Courier and stock integration", "You own the store and the data"],
  },

  // Placeholder price: to be confirmed with Dr. Nimr.
  startingFrom: { amount: 12000, currency: "SAR", note: "Final price depends on catalogue size, integrations and design." },

  audience: {
    title: "Who this is for",
    items: [
      {
        icon: "store",
        title: "Shops moving online",
        description: "You sell in-store or through Instagram and WhatsApp, and want a proper store that takes payment.",
      },
      {
        icon: "truck",
        title: "Distributors and wholesalers",
        description: "Trade customers order by phone, email or spreadsheet, and you want them to reorder online.",
      },
      {
        icon: "cart",
        title: "Brands outgrowing their first store",
        description: "Your current store works, but stock, orders and reports now take more staff time than selling.",
      },
    ],
  },

  problems: {
    title: "Where online selling gets stuck",
    items: [
      {
        icon: "card",
        title: "Customers can't pay the way they want",
        description: "Shoppers expect local cards, Apple Pay or pay-later options. When they're missing, carts are abandoned.",
      },
      {
        icon: "boxes",
        title: "Stock is wrong online",
        description: "The website sells items that are out of stock because the store and the warehouse aren't connected.",
      },
      {
        icon: "clipboard",
        title: "Orders are re-typed by hand",
        description: "Staff copy each order into the accounting system and the courier portal, and mistakes slip through.",
      },
      {
        icon: "truck",
        title: "Customers keep asking where their order is",
        description: "Without tracking links and status emails, the support team spends the day answering the same question.",
      },
    ],
  },

  solutions: {
    title: "What we build for retailers",
    intro: "From a first online store to the systems that run orders and stock behind it.",
    items: [
      {
        icon: "store",
        title: "Online store",
        description:
          "A fast, mobile-first store built on WordPress or as a custom storefront, with product pages, search, filters and a short checkout.",
        deliverables: ["Store design and build", "Product import", "Checkout and order emails"],
      },
      {
        icon: "card",
        title: "Payment gateway integration",
        description:
          "Integration with gateways such as HyperPay, Moyasar or PayTabs for Mada cards and Apple Pay, and pay-later providers such as Tabby or Tamara.",
        deliverables: ["Gateway setup and testing", "Refund and failed-payment handling"],
      },
      {
        icon: "truck",
        title: "Shipping and courier integration",
        description:
          "Shipping rates at checkout, labels and tracking numbers through courier integrations such as Aramex, SMSA or DHL, and automatic status emails.",
        deliverables: ["Shipping rules by city or weight", "Tracking links for customers"],
      },
      {
        icon: "boxes",
        title: "Order and stock management",
        description:
          "One admin view of orders, returns and stock levels across your store, warehouse or branches, with low-stock alerts.",
        deliverables: ["Order and returns dashboard", "Stock sync and alerts"],
      },
      {
        icon: "users",
        title: "Customer accounts and B2B ordering",
        description:
          "Order history and quick reorder for shoppers, plus trade accounts with their own prices, credit terms and bulk ordering.",
        deliverables: ["Customer accounts", "Trade pricing and bulk order forms"],
      },
      {
        icon: "plug",
        title: "ERP, CRM and accounting integration",
        description:
          "Orders, customers and stock flow into the systems you already use through their APIs, so nobody re-types an order again.",
        deliverables: ["Integration plan", "Two-way data sync", "Sales dashboard"],
      },
    ],
  },

  scenarios: {
    title: "What this can look like",
    intro: "Illustrative examples of typical projects, not client results.",
    items: [
      {
        title: "Fashion boutique selling on Instagram",
        before: "Orders taken in direct messages, payment by bank transfer, and stock tracked in a notebook.",
        after: "An online store with card and Apple Pay checkout, courier tracking links and live stock counts.",
      },
      {
        title: "Building-supplies distributor",
        before: "Contractors ordered by phone and WhatsApp, and each order was typed into the accounting system twice.",
        after: "A trade ordering portal with customer-specific prices that sends confirmed orders straight to accounts.",
      },
    ],
  },

  proof: {
    title: "Related work",
    intro: "A live ordering and admin system built by our team.",
    items: [
      {
        title: "Lumière ordering and admin system",
        summary: "Online ordering and reservations with an admin area where staff manage every order and booking in one place.",
        href: "/case-studies/lumiere-restaurant-management-system",
      },
    ],
  },

  testimonialId: 2,

  faqs: [
    {
      question: "What does an online store cost?",
      answer:
        "The main cost drivers are the number of products and variations, the payment and shipping integrations you need, custom design, and any connection to your ERP or accounting system. We quote a fixed price in writing after a short discovery call.",
    },
    {
      question: "How long until the store is live?",
      answer:
        "A standard store with a single payment gateway and courier typically takes six to ten weeks. Trade portals and ERP integrations add time and are planned in phases so you can start selling sooner.",
    },
    {
      question: "Which payment methods can you integrate?",
      answer:
        "We integrate with the gateway you choose, such as HyperPay, Moyasar, PayTabs or Tap, for Mada, Visa, Mastercard and Apple Pay, and pay-later providers such as Tabby or Tamara. You open the merchant account with the provider directly, and payments go straight to you.",
    },
    {
      question: "Should the store be on WordPress or custom-built?",
      answer:
        "WordPress suits most new stores: it is quick to launch and easy for your team to manage. A custom storefront makes sense when you need trade pricing, complex stock rules or deep integration with your own systems. We'll recommend one in the proposal and explain why.",
    },
    {
      question: "Can you move my products from my current store?",
      answer:
        "Yes. We import products, categories, images and customer records where your current platform allows export, and set up redirects so existing links keep working.",
    },
    {
      question: "Who owns the store and the customer data?",
      answer:
        "You do. The store, code, domain and all customer and order data belong to your business, and you get full admin access at handover.",
    },
    {
      question: "What happens after launch?",
      answer:
        "We stay on hand during the first weeks of trading to fix anything that comes up. After that, an optional monthly support plan covers updates, security patches and new features such as seasonal campaigns.",
    },
    {
      question: "Can the store be in Arabic?",
      answer:
        "Yes, on request. We can build a bilingual English and Arabic store with a right-to-left layout and Arabic product content. Tell us at the start so it is included in the plan and the quote.",
    },
  ],

  finalCta: {
    title: "Tell us what you sell and how you sell it today",
    body: "Share your products, sales channels and the systems you use. We'll reply with questions or a suggested approach, and a clear quote.",
    button: "Plan my online store",
  },

  relatedIndustries: ["business-websites", "enterprise-it", "financial-services"],

  sections: ["audience", "problems", "solutions", "scenarios", "proof", "testimonial", "process", "faq", "related"],
}
