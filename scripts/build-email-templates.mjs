// Builds the outreach email templates in /email-templates from the copy below.
// Run: node scripts/build-email-templates.mjs
// Edit the copy here, re-run, and commit the generated files. The README is written by hand.

import fs from "node:fs"
import path from "node:path"

const SITE = "https://rapidnextech.com"
const OUT = path.join(process.cwd(), "email-templates")

const OPENER =
  "As one of our valued K Gulf Hosting customers, I wanted to personally introduce you to a team that may be useful to {{CompanyName}}."
const OPENER_NO_MERGE =
  "As one of our valued K Gulf Hosting customers, I wanted to personally introduce you to a team that may be useful to your business."

const templates = [
  {
    file: "general",
    path: "/software/industries",
    campaign: "general",
    subject: "An introduction for {{CompanyName}}: RapidNexTech",
    subjectNoMerge: "An introduction: RapidNexTech",
    problem:
      "Many of the businesses we host have their domain and hosting in place, but the website or the systems behind it no longer keep up with how the business works.",
    intro:
      "RapidNexTech is a software development team I have worked with directly. They build websites, online stores and business systems, and can work with the hosting you already have.",
    bullets: [
      "A professional website your team can update itself",
      "An online store with local payment methods and courier tracking",
      "A customer portal or internal tool that replaces spreadsheets and email",
    ],
    button: "See what they build",
  },
  {
    file: "business-websites",
    path: "/software/industries/business-websites",
    campaign: "business-websites",
    subject: "A better website for {{CompanyName}}",
    subjectNoMerge: "A better website for your business",
    problem:
      "Many businesses we host have a domain and hosting plan in place, but the website on it is out of date, hard to change, or doesn't bring in enquiries.",
    intro:
      "RapidNexTech is a software development team I have worked with directly. They build websites and simple web apps for growing businesses, on the hosting you already have.",
    bullets: [
      "A professional website your team can update without a developer",
      "Online booking with automatic confirmations",
      "A customer portal for quotes, invoices and documents",
    ],
    button: "See websites and web apps",
  },
  {
    file: "ecommerce-retail",
    path: "/software/industries/ecommerce-retail",
    campaign: "ecommerce-retail",
    subject: "Selling online for {{CompanyName}}",
    subjectNoMerge: "Selling online for your business",
    problem:
      "Selling online often means re-typing orders, correcting stock levels and answering “where is my order?” messages by hand.",
    intro:
      "RapidNexTech is a software development team I have worked with directly. They build online stores and the order and stock systems behind them.",
    bullets: [
      "An online store with Mada, Apple Pay and pay-later options through your payment gateway",
      "Courier integration with tracking links for your customers",
      "Order and stock management connected to your accounting system",
    ],
    button: "See e-commerce projects",
  },
  {
    file: "enterprise-it",
    path: "/software/industries/enterprise-it",
    campaign: "enterprise-it",
    subject: "Custom software and extra engineering capacity for {{CompanyName}}",
    subjectNoMerge: "Custom software and extra engineering capacity",
    problem:
      "When CRM, accounting and in-house tools don't talk to each other, teams lose hours moving data and building reports by hand. And when projects pile up, hiring engineers takes months.",
    intro:
      "RapidNexTech is a software development team I have worked with directly. They build custom systems and integrations, and also work as a white-label team for IT firms.",
    bullets: [
      "Internal systems for requests, approvals and job tracking",
      "Integrations and live dashboards across your existing systems",
      "AI and automation for repetitive work, or engineers working under your brand",
    ],
    button: "See enterprise and IT services",
  },
  {
    file: "nonprofits",
    path: "/software/industries/nonprofits",
    campaign: "nonprofits",
    subject: "Less admin for {{CompanyName}}",
    subjectNoMerge: "Less admin for your organisation",
    problem:
      "Small teams often spend more time on donation admin, volunteer spreadsheets and donor reports than on the mission itself.",
    intro:
      "RapidNexTech is a software development team I have worked with directly. They build websites and simple systems for charities and non-profit organisations, and can start small.",
    bullets: [
      "A website with one-off and monthly online donations",
      "Volunteer and member management in one place",
      "Dashboards for donors and the board",
    ],
    button: "See non-profit projects",
  },
  {
    file: "financial-services",
    path: "/software/industries/financial-services",
    campaign: "financial-services",
    subject: "Client portals and workflow systems for {{CompanyName}}",
    subjectNoMerge: "Client portals and workflow systems",
    problem:
      "Many finance teams still collect sensitive documents by email and confirm approvals in chat, which makes client updates and audits harder than they need to be.",
    intro:
      "RapidNexTech is a software development team I have worked with directly. They build secure web applications around your own processes and security requirements.",
    bullets: [
      "A client portal for documents and application status",
      "Approval workflows with a complete audit trail",
      "Reporting dashboards built on your existing systems",
    ],
    button: "See financial services projects",
  },
]

const SIGN_OFF = ["Best regards,", "Dr. Nimr", "CEO, K Gulf Hosting"]
const FOOTNOTE =
  "RapidNexTech is an independent software company. Your hosting services remain with K Gulf Hosting."

function buildUrl(t, merge) {
  const params = new URLSearchParams({ ref: "kgulf" })
  if (merge) params.set("for", "__COMPANY__")
  params.set("utm_source", "kgulf")
  params.set("utm_medium", "email")
  params.set("utm_campaign", t.campaign)
  // Keep the merge field readable (not percent-encoded) so mail-merge tools can replace it.
  return `${SITE}${t.path}?${params.toString().replace("__COMPANY__", "{{CompanyName}}")}`
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const P = `margin:0 0 16px 0;font-family:${FONT};font-size:16px;line-height:24px;color:#1f2937;`

function html(t, merge) {
  const greeting = merge ? "Hello {{FirstName}}," : "Hello,"
  const subject = merge ? t.subject : t.subjectNoMerge
  const url = buildUrl(t, merge)
  const bullets = t.bullets
    .map(
      (b) => `<tr>
<td valign="top" width="20" style="padding:0 0 8px 0;font-family:${FONT};font-size:16px;line-height:24px;color:#1d4ed8;">&#8226;</td>
<td valign="top" style="padding:0 0 8px 0;font-family:${FONT};font-size:16px;line-height:24px;color:#1f2937;">${esc(b)}</td>
</tr>`,
    )
    .join("\n")

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;">
<!-- Subject line: ${esc(subject)} -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f4f6" style="background-color:#f3f4f6;">
<tr>
<td align="center" style="padding:24px 12px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width:600px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:8px;">
<tr>
<td style="padding:32px 32px 16px 32px;">
<p style="${P}">${esc(greeting)}</p>
<!-- EDIT: personal opener. Change this sentence to suit the customer. -->
<p style="${P}">${esc(merge ? OPENER : OPENER_NO_MERGE)}</p>
<p style="${P}">${esc(t.problem)}</p>
<p style="${P}">${esc(t.intro)}</p>
<p style="${P}margin-bottom:8px;">A few examples of what they could build:</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px 0;">
${bullets}
</table>
<p style="${P}">They have put together a short page with examples and common questions:</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px 0;">
<tr>
<td align="center" bgcolor="#1d4ed8" style="border-radius:6px;background-color:#1d4ed8;">
<a href="${esc(url)}" target="_blank" style="display:inline-block;padding:12px 24px;font-family:${FONT};font-size:16px;line-height:20px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:6px;border:1px solid #1d4ed8;">${esc(t.button)}</a>
</td>
</tr>
</table>
<p style="${P}">If anything there is relevant, you can contact them directly from that page. There is no obligation.</p>
<p style="${P}margin-bottom:0;">${SIGN_OFF.map(esc).join("<br>")}</p>
</td>
</tr>
<tr>
<td style="padding:16px 32px 24px 32px;border-top:1px solid #e5e7eb;">
<p style="margin:0;font-family:${FONT};font-size:12px;line-height:18px;color:#6b7280;">${esc(FOOTNOTE)}</p>
</td>
</tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td>
</tr>
</table>
</body>
</html>
`
}

function text(t, merge) {
  return [
    `Subject: ${merge ? t.subject : t.subjectNoMerge}`,
    "",
    merge ? "Hello {{FirstName}}," : "Hello,",
    "",
    merge ? OPENER : OPENER_NO_MERGE,
    "",
    t.problem,
    "",
    t.intro,
    "",
    "A few examples of what they could build:",
    ...t.bullets.map((b) => `- ${b}`),
    "",
    "They have put together a short page with examples and common questions:",
    buildUrl(t, merge),
    "",
    "If anything there is relevant, you can contact them directly from that page. There is no obligation.",
    "",
    ...SIGN_OFF,
    "",
    "--",
    FOOTNOTE,
    "",
  ].join("\n")
}

fs.mkdirSync(OUT, { recursive: true })
for (const t of templates) {
  for (const merge of [true, false]) {
    const base = merge ? t.file : `${t.file}-no-merge`
    fs.writeFileSync(path.join(OUT, `${base}.html`), html(t, merge))
    fs.writeFileSync(path.join(OUT, `${base}.txt`), text(t, merge))
  }
  // Word count of the body (greeting to sign-off), for the 120-180 word brief.
  const words = text(t, true).split("\n").slice(2, -6).join(" ").split(/\s+/).filter(Boolean).length
  console.log(`${t.file}: ${words} words -> ${buildUrl(t, true)}`)
}
