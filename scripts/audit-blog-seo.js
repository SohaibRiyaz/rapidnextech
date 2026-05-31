const fs = require("fs")
const path = require("path")

const root = process.cwd()
const blogDir = path.join(root, ".next", "server", "app", "blog")
const outFile = path.join(root, "docs", "blog-seo-audit.md")

const stopWords = new Set([
  "the",
  "and",
  "for",
  "with",
  "your",
  "you",
  "how",
  "why",
  "what",
  "are",
  "that",
  "this",
  "from",
  "into",
  "rapidnextech",
  "blog",
])

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

function stripTags(value) {
  return decode(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim())
}

function extract(pattern, html) {
  const match = html.match(pattern)
  return match ? decode(match[1].trim()) : ""
}

function getFocusKeyword({ title, keywords }) {
  const firstKeyword = keywords
    .split(",")
    .map((item) => item.trim())
    .find(Boolean)

  if (firstKeyword) return firstKeyword.toLowerCase()

  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .slice(0, 3)
    .join(" ")
}

function hasKeyword(text, keyword) {
  if (!keyword) return false
  const normalizedText = text.toLowerCase()
  const normalizedKeyword = keyword.toLowerCase()
  if (normalizedText.includes(normalizedKeyword)) return true

  const parts = normalizedKeyword
    .split(/\s+/)
    .filter((part) => part.length > 3 && !stopWords.has(part))

  if (!parts.length) return false
  return parts.some((part) => normalizedText.includes(part))
}

function firstParagraph(html) {
  const articleMatch = html.match(/<article[\s\S]*?<\/article>/i)
  const scope = articleMatch ? articleMatch[0] : html
  const paragraph = scope.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  return paragraph ? stripTags(paragraph[1]) : ""
}

function auditFile(filePath) {
  const html = fs.readFileSync(filePath, "utf8")
  const slug = path.basename(filePath, ".html")
  const title = extract(/<title>([\s\S]*?)<\/title>/i, html).replace(/\s*\|\s*RapidNexTech.*$/i, "")
  const h1 = stripTags(extract(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html))
  const keywords = extract(/<meta\s+name=["']keywords["']\s+content=["']([^"']*)["']/i, html)
  const focusKeyword = getFocusKeyword({ title: h1 || title, keywords })
  const intro = firstParagraph(html)
  const solutionLink = /href=["']\/solutions\/[^"']+["']/.test(html) || /href=["']https:\/\/rapidnextech\.com\/solutions\/[^"']+["']/.test(html)
  const cta = /href=["'][^"']*(\/contact|\/solutions\/)[^"']*["']/.test(html) || /\b(book|schedule|demo|consultation|start your project|get in touch|ready to)\b/i.test(html)

  return {
    slug,
    title: h1 || title || slug,
    focusKeyword,
    checks: {
      uniqueTitle: true,
      keywordInH1: hasKeyword(h1 || title, focusKeyword),
      keywordInFirstParagraph: hasKeyword(intro, focusKeyword),
      solutionInternalLink: solutionLink,
      cta,
    },
  }
}

function main() {
  if (!fs.existsSync(blogDir)) {
    throw new Error("Build output not found. Run `npm run build:only` before auditing blog SEO.")
  }

  const files = fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html") && entry.name !== "index.html")
    .map((entry) => path.join(blogDir, entry.name))
    .filter((file) => fs.existsSync(file))

  const audits = files.map(auditFile)
  const titleCounts = audits.reduce((acc, audit) => {
    const key = audit.title.toLowerCase()
    acc.set(key, (acc.get(key) || 0) + 1)
    return acc
  }, new Map())

  for (const audit of audits) {
    audit.checks.uniqueTitle = titleCounts.get(audit.title.toLowerCase()) === 1
  }

  const flagged = audits.filter((audit) => Object.values(audit.checks).some((passed) => !passed))
  fs.mkdirSync(path.dirname(outFile), { recursive: true })

  const lines = [
    "# Blog SEO Audit",
    "",
    `Generated from built HTML in \`.next/server/app/blog\`.`,
    "",
    `Total posts audited: ${audits.length}`,
    `Flagged posts: ${flagged.length}`,
    "",
    "## Checklist",
    "",
    "- Unique title",
    "- Focus keyword in H1/title",
    "- Focus keyword or close variant in first paragraph",
    "- At least one internal link to a solution page",
    "- Clear CTA",
    "",
    "## Flagged Posts",
    "",
  ]

  if (!flagged.length) {
    lines.push("No posts failed the checklist.", "")
  } else {
    for (const audit of flagged) {
      const failed = Object.entries(audit.checks)
        .filter(([, passed]) => !passed)
        .map(([name]) => name)
        .join(", ")
      lines.push(`- /blog/${audit.slug} - ${audit.title}`)
      lines.push(`  - Focus keyword: ${audit.focusKeyword || "not detected"}`)
      lines.push(`  - Fails: ${failed}`)
    }
    lines.push("")
  }

  lines.push("## Full Results", "")
  lines.push("| Post | Focus keyword | Unique title | Keyword in H1 | Keyword in first paragraph | Solution link | CTA |")
  lines.push("| --- | --- | --- | --- | --- | --- | --- |")

  for (const audit of audits.sort((a, b) => a.slug.localeCompare(b.slug))) {
    lines.push(
      `| /blog/${audit.slug} | ${audit.focusKeyword || "-"} | ${audit.checks.uniqueTitle ? "pass" : "fail"} | ${audit.checks.keywordInH1 ? "pass" : "fail"} | ${audit.checks.keywordInFirstParagraph ? "pass" : "fail"} | ${audit.checks.solutionInternalLink ? "pass" : "fail"} | ${audit.checks.cta ? "pass" : "fail"} |`,
    )
  }

  fs.writeFileSync(outFile, `${lines.join("\n")}\n`)
  console.log(`Audited ${audits.length} posts. Flagged ${flagged.length}. Report: ${path.relative(root, outFile)}`)
}

main()
