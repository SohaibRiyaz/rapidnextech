# DISCOVERY — RapidNexTech marketing site

Read-only discovery pass, 2026-10-09. No source files were modified. This file is the only file created.

**Stack:** Next.js 14.2.16 (App Router) · React 18 · TypeScript (strict, but build ignores type errors) · Tailwind 3.4 + shadcn/ui (Radix) · framer-motion · Supabase (Postgres, Auth, Storage) · Resend (email) · Groq + Hugging Face (admin AI blog tooling).

> ⚠️ **Read §11.1 first.** There are security problems that are independent of the homepage rewrite and that I'd treat as urgent: admin credentials committed in plain text to a public GitHub repo, and (per the repo's own docs) RLS disabled on content tables that the public anon key can reach.

---

## 1. Route map

`ConditionalLayout` (`components/conditional-layout.tsx`) wraps every route: Header + `<main>` + Footer + floating WhatsApp widget. The exceptions: `/admin*` and `/admin-login` get no chrome, and two routes hide only the widget (see §3).

Root metadata (`app/layout.tsx:28-101`): `metadataBase` = `getSiteOrigin()` (env `NEXT_PUBLIC_BASE_URL`, falls back to `https://rapidnextech.com`). It sets a title template `%s | RapidNexTech`, a default OG/Twitter image `/og-image.png` (1200×630), `robots: index,follow`, a root canonical, the manifest, and `generator: 'v0.app'` (vibecoding leftover). Organization and WebSite JSON-LD are injected in `<body>`.

Build column: ○ = static, ● = SSG with params, ƒ = dynamic (from the successful build, §10).

| Route | File(s) | Renders | Title / canonical / OG | Build |
|---|---|---|---|---|
| `/` | `app/page.tsx` | Homepage (see §2) | "Custom Software & AI Automation for Growing Businesses". **No `\| RapidNexTech` suffix**, because the root template doesn't apply to the root segment's own page. Canonical `https://rapidnextech.com`. OG `/og-image.png`. | ○ |
| `/about` | `app/about/page.tsx` → `components/about/AboutClient.tsx` | Hero, stats bar, Who We Are, leadership (5 people), mission/vision, bento services, `WorldMap`, process, CTA | Own title/desc/canonical/OG. AboutPage + Breadcrumb JSON-LD via `next/script afterInteractive` | ○ |
| `/services` | `app/services/page.tsx` (client) + `app/services/layout.tsx` (metadata) | Hero, 3 "pillars" × 3 services with sticky `GlobalChronometer`, industry-solutions grid, CTA | Metadata in layout. **No JSON-LD.** | ○ |
| `/services/[slug]` (9) | `app/services/[slug]/page.tsx` | `ServiceHero` + `BlockRenderer` blocks from `lib/services-data.ts` + CTA | `title.absolute` "X \| RapidNexTech Services", canonical, OG. Breadcrumb + Service + FAQPage JSON-LD (static `<script>`) | ● |
| `/case-studies` | `app/case-studies/page.tsx` → `PortfolioClient.tsx` | Hero, featured spotlight, filter/search, grid, quick-view drawer, process/FAQ, `ProjectCTA` | Own metadata. ItemList JSON-LD (afterInteractive) | ○ (server-fetches Supabase **and** client re-fetches) |
| `/case-studies/[slug]` (10 at build) | `app/case-studies/[slug]/page.tsx` → `ProjectDetailClient.tsx` | Long-form case study | Dynamic metadata from DB. **Fallback OG `/og-image.jpg` doesn't exist.** "CaseStudy" JSON-LD with logo `/logo.png`, **which doesn't exist** | ● `dynamicParams=true` |
| `/blog` | `app/blog/page.tsx` → `BlogClient.tsx` | "INSIGHTS" hero, featured post, bento grid | Own metadata. Blog JSON-LD (logo `/logo.png`, missing) | ○ (server-fetch + client re-fetch; shows a full-screen spinner if SSR got 0 posts) |
| `/blog/[slug]` (35 at build) | `app/blog/[slug]/page.tsx` → `BlogPostClient.tsx` | Markdown article (react-markdown + rehype-raw), FAQ, CTA, share, TOC, next post, related, comments | Dynamic metadata. BlogPosting + Breadcrumb + FAQPage JSON-LD. **Unknown slug returns 200 with "Post Not Found"** (soft 404) | ● |
| `/careers` | `app/careers/page.tsx` (+ `components/careers/*`) | Hero, features, pathways, hiring process, "talent pipeline", life, CTA | Own metadata. `app/careers/head.tsx` is a **legacy Pages-style head file that the App Router ignores** (dead) | ○ |
| `/contact` | `app/contact/page.tsx` → `ContactClient.tsx` | Lead form + contact sidebar (see §7) | Own metadata. ContactPage JSON-LD (afterInteractive) | ○ |
| `/solutions/aesthetic-clinics` | see §5 | Lahore/PKR WhatsApp booking assistant LP | "WhatsApp Booking Assistant for Lahore Clinics \| RapidNexTech". **Ends up with a double suffix** ("… \| RapidNexTech \| RapidNexTech") because the string already contains the brand and the template adds it again. Also has `keywords` | **ƒ** (reads `searchParams`) |
| `/solutions/dental-clinics` | §5 | Simple server-rendered LP | ✓ | ○ |
| `/solutions/never-miss-a-call` | §5 | Dark "medspa-style" LP, HVAC/plumbing | ✓ | ○ |
| `/solutions/never-miss-a-call/texas` | §5 | Simple server-rendered LP | ✓ | ○ |
| `/solutions/never-miss-a-medspa-call` | §5 | Dark luxury LP | ✓ | ○ |
| `/solutions/real-estate` | §5 | Generic WhatsApp-automation LP template | ✓ | ○ |
| `/solutions/diet-nutrition` | §5 | Same template as real-estate | ✓ | ○ |
| `/privacy-policy`, `/terms-of-service` | `components/legal/legal-layout.tsx` | Static legal text (last updated 2026-03-16) | ✓ | ○ |
| `/privacy`, `/terms` | `redirect()` | → `/privacy-policy`, `/terms-of-service` | — | ○ |
| `/book/{dental,aesthetic,medspa}` | `next.config.mjs` redirects (308) | → `/contact?bookingSource=…&fromBook=1` | — | — |
| `/admin` | `app/admin/page.tsx` → `components/admin/admin-dashboard.tsx` | CMS (projects, blog, comments, testimonials, partners, drafts, AI blog queue) | noindex | ○ (client-gated) |
| `/admin-login` | `app/admin-login/page.tsx` → `components/admin-auth.tsx` | Supabase email/password login | noindex | ○ |
| `/api/contact` | `app/api/contact/route.ts` | POST → Resend email | — | ƒ |
| `/api/stripe-intent` | `app/api/stripe-intent/route.ts` | POST beacon → Resend "checkout click" email | — | ƒ |
| `/api/ai-blog-image` | `app/api/ai-blog-image/route.ts` | POST prompt → HF text-to-image → Supabase Storage upload (service-role key) | — | ƒ |
| `/api/exchange-rates` | `app/api/exchange-rates/route.ts` | GET USD→GBP/QAR (only consumer is the unused `usePricingCurrency`) | — | ○ |
| `/sitemap.xml` | `app/sitemap.ts` | §8 | — | ƒ |
| `/robots.txt` | `app/robots.ts` | §8 | — | ○ |
| `/manifest.json`, `/icon.png`, `/apple-icon.png`, `/favicon.ico` | `app/*` | — | — | ○ |
| 404 | `app/not-found.tsx` | Hard-coded blue/emerald gradient page | "Page Not Found" | ○ |
| error | `app/error.tsx`, `app/global-error.tsx` | Generic error UIs | — | — |

There is no `middleware.ts`, no `pages/`, no `src/`, and no `.env.example`.

---

## 2. Homepage component tree (`app/page.tsx`)

`app/page.tsx` is a **server component**. Everything except the hero and the inline solutions block is `next/dynamic`-imported with a pulse-skeleton loader (`SectionLoader`). These are still SSR'd, because `ssr` isn't disabled; dynamic import only splits the code.

```
RootLayout (app/layout.tsx)
└─ ThemeProvider (next-themes) → ThemeContextProvider (context/theme-context.tsx)
   └─ <div.theme-bg> NextTopLoader + ConditionalLayout
      ├─ Header (components/Header.tsx) ─ HeaderNav, ThemeSwitcher            [§3]
      ├─ <main role=main>
      │  └─ Home (app/page.tsx) <div.bg-transparent>
      │     1. HeroSection                components/hero-section.tsx
      │        ├─ MeshGradient            components/mesh-gradient.tsx (CSS-only blobs, animate-drift-*)
      │        ├─ grid.svg overlay + bottom fade
      │        ├─ <h1> TypewriterText     components/typewriter-text.tsx (3 rotating lines; SSR'd text = first line in sr-only span + invisible ghost)
      │        ├─ subhead "We help companies automate operations, launch products, and scale with confidence."
      │        ├─ CTA "Discuss Your Project" → /contact (gradient primary→purple→pink)
      │        ├─ CTA "View Case Studies" → /case-studies
      │        └─ "Scroll to explore" (animate-float)
      │     2. AiAutomationSolutions      (inline in app/page.tsx:69-113)
      │        └─ 3 cards: Aesthetic (says "Dubai and GCC" ⚠ page is now Lahore), Home-Service, Med Spa
      │     3. CompanyCarousel            components/company-carousel.tsx  ← Supabase trusted_partners (client fetch, marquee; placeholder fallback)
      │     4. StatsSection               components/stats-section.tsx     (hard-coded 4+ yrs / 20+ projects / 5+ countries; framer infinite glow)
      │     5. ServicesBento              components/services-bento.tsx    ← lib/services-data.ts (first 8 services) + BentoGrid/BentoCard + TiltButton; copy says "9+ services"
      │     6. ScrollSection              components/scroll-section.tsx    ("Why Founders Choose RapidNexTech", 4 cards; useScroll value unused)
      │     7. FeaturedWorkSection        components/featured-work.tsx     ← Supabase projects (is_featured, ≤5) client fetch; renders null until loaded/if empty; mobile sticky stacked cards, desktop alternating rows
      │     8. TestimonialsSection        components/testimonials-section.tsx (2 HARD-CODED testimonials: KGulf Hosting, TKMachino. Does NOT read client_reviews)
      │     9. ProcessSection             components/process-section.tsx   (Discover/Plan/Build/Deliver; uses dark: variants, see §4)
      │    10. ProjectCTA                 components/shared/ProjectCTA.tsx (default "Ready to Build Something Extraordinary?" → /contact; also used on /case-studies)
      ├─ Footer (components/Footer.tsx)                                        [§3]
      └─ FloatingWhatsAppWidget                                                [§3]
```

Notes for the rewrite:

- **Two Supabase reads happen client-side on every homepage view** (partners, featured projects), so that content isn't in the SSR HTML for crawlers.
- The rendered H1 text in the built HTML is "Custom Software That Solves Real Business Problems" with a cursor `<span>` inside it.
- The H2 order in the built HTML is: Practical AI systems… / Trusted by founders… / Our Impact at a Glance / Our Expertise / Why Founders Choose… / What Our [Clients Say] / Our Process / Ready to Build Something Extraordinary?
- `FeaturedWorkSection` has no H2 in the SSR output; it returns `null` server-side because `loading` starts as true.
- Unused homepage-style components still in the repo: `elegant-partners`, `minimal-partners`, `floating-cards`, `particle-background`, `team-section`, `image-carousel`, `optimized-image`, `testimonials-section.backup`.

---

## 3. Layout-level components

### Header — `components/Header.tsx` (client)
- Fixed, `z-50`. Grows from `h-20` to `h-16` and becomes `bg-white/95` with a blur after 20px of scroll. Logo images are chosen by theme: `/symbol-{blue,white}.png` + `/header-logo-{blue,white}.png`.
- **Dark-LP override:** when the pathname is `/solutions/never-miss-a-medspa-call` or `/solutions/never-miss-a-call` (`Header.tsx:53`), the header is transparent until scroll, uses white logos, and injects inline CSS variables (`--foreground`, `--background`, `--popover`, …) so the nav text turns light.
- Desktop: `<HeaderNav/>` + `<ThemeSwitcher/>` (dark/light toggle + 7-colour palette picker). There is **no header CTA button**.
- Mobile: hamburger opens a full-height framer panel listing About / What We Do / Case Studies, a "Solutions" accordion (from `industrySolutions`), then Blog / Careers / Contact. The **mobile menu labels the blog "Blog", while desktop says "Insights".**
- Unused locals: `Button`, `Code2`, `linkClass` (lint errors).

### Nav — `components/header-nav.tsx` (Radix NavigationMenu via `components/ui/navigation-menu.tsx`)
Order: About · **What We Do ▾** · **Solutions ▾** · Case Studies · Insights (`/blog`) · Careers. There's no Contact link on desktop.

- **What We Do** mega menu: `w-[calc(100vw-6rem)] max-w-3xl`, a 3-column grid from `serviceCategories` (Product Engineering / AI, Automation & Cloud / Strategy, Security & Scale). Each column lists `servicesData[slug]` icon + title → `/services/{slug}`, with an "All services →" link to `/services`.
- **Solutions** dropdown: 420px wide, scrollable, "Industry Solutions" label, one card per `industrySolutions` entry (title + description) → its href. Rendered only if `industrySolutions.length > 0`.
- Both are data-driven from **`lib/services-data.ts`** (`servicesData`, `serviceCategories`, `industrySolutions`). The same arrays feed the mobile menu, footer, `/services`, the sitemap, and the services bento. Changing them ripples everywhere.
- It uses the deprecated `<Link legacyBehavior passHref>` + `NavigationMenuLink asChild` pattern.

### Footer — `components/Footer.tsx` (client)
- Brand block with tagline "Building the future of digital experiences…" and social icons (GitHub/Twitter/LinkedIn/Facebook/Instagram → `/RapidNexTech` handles, unverified).
- Company links (About, Careers, Contact) plus a **hard-coded** Solutions list (6 links, *not* driven by `industrySolutions`, labels differ from nav).
- Services list (all 9 from `servicesData`).
- Resources: Blog, Case Studies, email, US +1 214 896 4186, UK +44 7311 133668, Stoke-on-Trent address.
- Bottom row: © year, Privacy Policy, Terms of Service.

### Floating WhatsApp AI badge — `components/whatsapp/floating-whatsapp-widget.tsx`
- **Mounted** once, in `ConditionalLayout` (`conditional-layout.tsx:32`), on every non-admin route **except** `/solutions/never-miss-a-call` and `/solutions/never-miss-a-medspa-call` (exact-match `pathname ===`, so `/solutions/never-miss-a-call/texas` *does* show it).
- **Render:** client-only. It returns `null` until mounted (`isClient` flag), then renders a `fixed bottom-5 right-5 z-[70]` stack:
  1. An optional hint bubble: "See how a patient inquiry gets handled instantly / Try the live WhatsApp demo (2 min) – no signup". It's dismissible, and dismissal persists in `localStorage["wr-whatsapp-widget-hint-dismissed"]="1"`. The initial state is "dismissed", so the bubble appears only after hydration.
  2. A 56px green `#25D366` round `Button` with an `animate-ping` halo and a lucide `MessageCircle` icon (aria-label "Open live WhatsApp demo").
- **Behaviour:** the button is the `trigger` of `WhatsAppDemoDialog` (`components/whatsapp/whatsapp-demo-dialog.tsx`, Radix Dialog). The dialog shows the demo number and on "Start the Live Demo →" calls `window.open(getWhatsAppDemoUrl(contextLabel))`.
- **Depends on:** `lib/whatsapp-demo.ts`. Demo number `12148964186` / display "+1 (214) 896-4186", which is the **same number as the US sales line**. The pre-filled message is clinic-specific ("…how patient inquiries are handled…"). `contextLabel` is accepted but ignored. Other dependencies: `components/ui/button`, `components/ui/dialog`.
- **Other consumers of `WhatsAppDemoDialog`:** the aesthetic-clinics hero (with `autoOpen` driven by `?open-popup-automatically`, `?openPopup` or `?demo`), the aesthetic CTA section, and the aesthetic `StickyDemoCTA`. `ContactClient` uses `getWhatsAppDemoUrl` directly.
- **Collisions:**
  - On the aesthetic page (mobile), `StickyDemoCTA` is `fixed bottom-0 z-50`, so the badge (`z-70`) sits on top of the sticky bar.
  - On blog posts (mobile), the TOC toggle is `fixed bottom-6 right-6 z-40`, *underneath* the badge at the same corner.
  - On blog posts (desktop), the reading-progress pill is `fixed bottom-10 right-10`, which overlaps it.
- **Messaging mismatch:** the copy is clinic/patient-centric but it shows site-wide, including on software/service pages.

### Other global floaters / chrome
- `NextTopLoader` (blue `#3b82f6`) at the top of the page.
- `BlogPostClient` adds a fixed top progress bar, a back button (`fixed top-24 left-6`), and a reading-stats pill. `TableOfContents` adds a desktop fixed left sidebar (xl+) and a mobile FAB.
- `PortfolioClient` has a full-screen SVG `feTurbulence` noise overlay at `fixed z-50` (pointer-events-none; expensive to paint).

---

## 4. Design system

**Tailwind** (`tailwind.config.js`; note that `components.json` points at a non-existent `tailwind.config.ts`):
- `darkMode: ["class"]`. `container`: centered, padding 2rem, 2xl = 1400px. **Breakpoints are Tailwind defaults** (sm 640, md 768, lg 1024, xl 1280, 2xl 1536 / container 1400).
- Colours are all shadcn HSL tokens: `border input ring background foreground primary secondary destructive muted accent popover card` (+ `-foreground`). Radius: `--radius` (0.5rem) lg/md/sm.
- Custom keyframes/animations: `accordion-*`, `drift-slow`, `drift-reverse`, `fade-in-up`, `float`, and `medspa-{marquee,shimmer,wave-pulse,border-sweep}`.
- Plugin: `tailwindcss-animate`. **There's no `@tailwindcss/typography`**, so every `prose-*` modifier class (heavily used in `BlogPostClient`, `legal-layout`) is a no-op. Only the hand-written `.prose` rules in `globals.css` apply.
- `postcss.config.mjs` loads only `tailwindcss`, with **no autoprefixer** (the dependency is installed but not wired).
- Content globs include `*.{js,ts,jsx,tsx,mdx}` at the root (so `server.js` and `debug-projects.js` get scanned too).

**CSS variables / theming** (`app/globals.css`, 1,143 lines):
- `:root` = shadcn slate defaults. `.dark-mode` = dark overrides. Note the class is **`.dark-mode`, not `.dark`**.
- Seven colour themes via `html[data-theme-color="blue|green|purple|red|orange|white|black"]`. Each × `.light-mode`/`.dark-mode` overrides `--primary`, `--background`, `--card`, `--muted`, `--border`, and so on. The default is `class="light-mode" data-theme-color="blue"`, hard-coded on `<html>` in `layout.tsx:109`.
- Semantic utility classes used everywhere: `.theme-bg` (per-theme gradient background), `.theme-text`, `.theme-gradient-text` (gradient; used with `bg-clip-text text-transparent`), `.theme-glow`, `.theme-transition` (`transition-all 300ms`, on almost every element).
- Misc: `.glitch-*`, `.btn-primary`, `.btn-outline`, `.mask-gradient-x`, `.animate-marquee`, `.animate-fade-in-up`, `.animate-float`, `.line-clamp-*`, a reduced-motion kill-switch, a high-contrast mode (forces `border-2 border-black` on **all buttons**), and print styles.
- MedSpa LP scope: `.medspa-voice-landing` defines `--medspa-bg-*`, `--medspa-accent-gold #c9a052`, and `--medspa-text-*`, plus `.medspa-{cta-shimmer,card-trace,reveal,noise,hero-*}`. The home-service LP reuses it.
- `styles/globals.css` is an **unused** v0/shadcn default (neutral palette, Geist font vars, sidebar/chart tokens); nothing imports it.

**Dark mode is two systems that don't talk to each other:**
1. `next-themes` `ThemeProvider attribute="class" defaultTheme="light" enableSystem` toggles `.light`/`.dark` on `<html>`. **Nothing ever calls its `setTheme`**, so it stays "light". Tailwind `dark:` variants key off `.dark`, which means **all 89 `dark:` usages are effectively dead**. Example: homepage `ProcessSection` cards are `bg-white/60 dark:bg-black/40`, so they render white on the dark theme. `particle-background.tsx` reads next-themes too (unused component).
2. `ThemeContext` (`context/theme-context.tsx`) is the real switch. It keeps `mode`/`color` in state and `localStorage` (`themeMode`, `themeColor`) and toggles `.light-mode`/`.dark-mode` + `data-theme-color` on `<html>`. It's applied only in a client effect, so **dark-mode users get a flash of the light theme** (no inline pre-hydration script). Many components branch in JS on `mode === "dark" || color === "black"` instead of using CSS (Header, Footer, ProjectCTA, Testimonials, Contact, About…).

**Fonts:** `Inter` (body, via `next/font` className) and `Space_Grotesk` (exposed as `--font-space`, **never referenced**). `.font-chakra` uses `var(--font-chakra)`, which is never defined. The `geist` package is installed but unused. MedSpa/Home-service LPs load `Bebas_Neue`, `Cormorant_Garamond`, and `Syne` per page (`--font-medspa-*`). `layout.tsx` also adds manual Google Fonts preconnects, which aren't needed with `next/font`.

**Shared UI primitives:** shadcn "default" style, 50+ files in `components/ui/`. Only these are imported by app code: `button` (50 imports), `input` (14), `textarea` (7), `accordion` (5), `card` (2), `dialog` (2), `navigation-menu` (1), `toast` (type only). The other ~45 (sidebar, chart, calendar, carousel, form, select, tabs, sonner, drawer, …) are unmodified boilerplate and unused. `components/ui/use-toast.ts` and `use-mobile.tsx` are byte-identical duplicates of `hooks/use-toast.ts` and `hooks/use-mobile.tsx`. Project-level shared pieces: `BentoGrid/BentoCard`, `TiltButton`, `MeshGradient`, `TypewriterText`, `ProjectCTA`, `WhatsAppDemoDialog`, `VoiceDemoEmbed`, `LegalLayout`.

**Animation libraries:**
- `framer-motion` (version `latest` in package.json) is used on nearly every page: `whileInView` reveals, infinite background glows, scroll-linked transforms, `AnimatePresence` modals.
- CSS keyframes (above) and `tailwindcss-animate` (Radix enter/exit).
- `nextjs-toploader`.
- Raw `IntersectionObserver` + `requestAnimationFrame` in the MedSpa LPs.
- `public/design-process.riv` (Rive) exists, but no Rive runtime is installed (unused).
- Icons: `lucide-react` 0.454.

---

## 5. Solution pages

Common points:
- Each page renders inside the global Header/Footer.
- Most pages wrap content in their own `<main>`, **nested inside the layout's `<main role="main">`** (the voice LPs use `<div role="main">`).
- `industrySolutions` (`lib/services-data.ts:384`) drives nav, mobile menu, `/services`, and the sitemap. The footer list is hard-coded separately.
- The breadcrumb JSON-LD on 5 of these pages points "Solutions" at `/services#solutions`, **an anchor that doesn't exist** on `/services`.

| Page | Structure | Content summary | Reused components | Conversion paths |
|---|---|---|---|---|
| **aesthetic-clinics** (`app/solutions/aesthetic-clinics/page.tsx`, `components/solutions/aesthetic-clinics/*`) | Hero → Problem → Solution → HowItWorks → WhoItsFor → ROI → Pricing → Founder → CTA → FAQ + `StickyDemoCTA` (mobile) | **Re-localised for Lahore, Pakistan** (commit 2026-06-24): WhatsApp booking assistant, English + Roman Urdu. Pricing in **PKR**: Standard 25k setup + 12k/mo, Advanced 45k + 22k (recommended), Premium 60k + 30k; "first 3 Lahore clinics 50% off setup". Founder section "Built by Sohaib — Based in Lahore". FAQ data in `faq-data.ts` (shared with FAQPage JSON-LD). JSON-LD uses a *custom* LocalBusiness-provider Service schema (areaServed Lahore) instead of `lib/seo` helpers. | `WhatsAppDemoDialog` ×3, shadcn Button/Accordion, `.theme-*` classes. **Dead in folder:** `feature-deep-dive-section.tsx` (still mentions "AED revenue" from the GCC version) and `optional-offers-section.tsx` | WhatsApp demo dialog (US demo number); pricing CTAs → `wa.me/923314664279` (PK "buyer" number); "or fill a quick form" → `/contact?plan=<slug>&type=aesthetic` |
| **dental-clinics** (`app/solutions/dental-clinics/page.tsx`, single file, server component) | Hero (H1 + "what the assistant captures" card) → 4 feature cards → FAQ list | US/global AI voice receptionist for dental. 4 FAQs (also in FAQPage JSON-LD). Breadcrumb + Service + FAQ JSON-LD via `lib/seo`. | None. Inline markup only. **Does not embed `VoiceDemoEmbed`**, even though `lib/voice-demo.ts` has a `dental` persona | `/contact?topic=dental-ai-receptionist` (param ignored by contact page); secondary link to medspa page |
| **never-miss-a-call** (`app/solutions/never-miss-a-call/page.tsx` → `components/solutions/home-service-voice-landing/HomeServiceVoiceLanding.tsx`, 773 lines) | Fold hero (no `<h1>`) → stat math (40% / 68% / $1,200 count-up) → gold marquee → 5-step how-it-works → "It knows your trade" + tags → live voice demo iframe → ROI calculator → pricing → objections → full-height CTA, plus page-local "Contractor growth resources" links | HVAC/plumbing/electrical, US states (TX/FL/CA/GA/AZ). Pricing: Starter $497 + $397/mo (300 calls), Growth $997 + $597 (800), Pro $1,997 + $997 (2,000), with overage tooltips. "Free first month – next 10 contractors". | `VoiceDemoEmbed` (`components/solutions/shared/voice-demo-embed.tsx`, iframe `https://try.rapidnextech.com/embed?persona=…` + postMessage transcript/booking listener). **Uses `pageKey="dental"`**, i.e. the HVAC page loads the dental persona. ~95% copy-paste of the MedSpa component; unused `AudioDemoPlayer` (fake player) in both. | `/contact?topic=hvac-voice-demo`; links to `/blog/hvac-answering-service-vs-ai`, `/blog/missed-hvac-call-cost` (existence not verified against DB) |
| **never-miss-a-call/texas** (single file, server) | Hero → 4 features → FAQ | Texas HVAC variant. Breadcrumb/Service/FAQ JSON-LD. | Inline only | `/contact?topic=texas-hvac-call-answering`; link back to parent |
| **never-miss-a-medspa-call** (`…/MedSpaVoiceLanding.tsx`, 725 lines) | Same skeleton as home-service. Headline "YOUR FRONT DESK / JUST CALLED IN / SICK. AGAIN." is rendered as `<span>`s, so **the page has no `<h1>`** (confirmed in built HTML; never-miss-a-call likewise) | US med spas. Pricing Starter $497 + $397, Growth $997 + $597, Pro $1,997 + $997 unlimited. "Free first month – next 10 med spas". | `VoiceDemoEmbed pageKey="medspa"` | `/contact?topic=medspa-voice-demo` (×3); links to aesthetic page + 2 blog posts |
| **real-estate** (`components/solutions/real-estate/*`, 11 files) | Hero → Problem → Solution → HowItWorks (5 steps) → FeatureDeepDive → WhoItsFor → ROI → Pricing → OptionalOffers → CTA → FAQ | WhatsApp property-inquiry qualification / viewing booking. USD pricing Starter $599→$299 + $149/mo, Growth $1,399→$699 + $349, Pro $2,799→$1,399 + $699. **"50% off – until April 30, 2026" banner is expired.** Claims "GDPR compliant", "30-40% of inquiries lost". **No JSON-LD.** | Template shared with diet-nutrition (near-identical files; only copy differs). `lib/currency.formatUSD`, `lib/stripe-intent.sendStripeIntent` | Pricing buttons → **live Stripe Payment Links** (`buy.stripe.com/…`) + intent beacon email; `/contact`; `/contact?demo=live-flow` (param ignored); `wa.me/923314664279` |
| **diet-nutrition** (`components/solutions/diet-nutrition/*`, 11 files) | Identical section order to real-estate | Diet/nutrition coaching; GBP economics in "who it's for". Same pricing numbers **and the same 3 Stripe links** as real-estate. Same expired April-30 banner. Hero secondary CTA → a **Notion page**. **No JSON-LD.** | Same as real-estate | Stripe links, `/contact`, Notion demo, `wa.me/923314664279` |

---

## 6. Database: reconstructed schema (from `scripts/`, chronological)

Script order (git first-add date): `create-tables.sql` → `fix-project-slugs.js` → `update-testimonials-schema.sql` (2025-10-16) → `create-blog-images-bucket.sql` → `migrate-blog-images.js` → `supabase-blog-migration.sql` (10-17) → `partners-setup.js` (10-26) → `update-projects-featured.sql` (10-27) → `generate-branding.js` (2026-01-18) → `add-comparison-fields.sql`, `add-conversion-fields.sql`, `add-mobile-image-field.sql`, `create-blog-comments-table.sql`, `update-blog-schema-faqs-cta.sql` (02-01) → `database-optimizations-2024.sql` (02-22) → `add-blog-image-prompts.sql` (03-29) → `delete-duplicate-blog-posts.sql` (03-30) → `fix-duplicate-seo-titles.sql` (03-31) → `audit-blog-seo.js` (05-31).

The `.js` files are browser-console or Node utilities, not SQL migrations. `generate-branding.js` needs a missing `public/logo-main-symbol.png`; `audit-blog-seo.js` writes `docs/blog-seo-audit.md`.

**Gaps (schema that must exist but no script creates it):**
- `projects.slug`: no script adds it, yet all code depends on it. `supabase_structure.md` says `text NULL`.
- `client_reviews` and `trusted_partners`: **never `CREATE`d in any script**; they're only altered or indexed. They were created in the dashboard; columns below are inferred from `lib/supabase.ts` types + docs.
- **No table-level RLS policies in any script.** Only `storage.objects` policies for `blog-images`. `supabase_structure.md` (Dec 2025) records RLS **disabled** on `projects`, `blog_posts`, `client_reviews` and enabled with policies on `trusted_partners`; `blog_comments` is unknown.
- Buckets `project-images` (used by admin uploads) and `partner-logos` (docs only) aren't created in scripts.
- `update_updated_at_column()` trigger exists for `projects`, `blog_posts`, `blog_comments`, but **none is scripted for `client_reviews` / `trusted_partners`**.
- `update-testimonials-schema.sql` uses non-idempotent `ADD COLUMN` / `CREATE INDEX`.

### `projects`
`id serial PK` · `title varchar(255) NN` · `slug text` *(unscripted)* · `category varchar(100) NN` · `technology text[] NN '{}'` · `description text NN` · `long_description text` · `challenge text` · `solution text` · `results text[] NN '{}'` · `features text[] NN '{}'` · `images jsonb NN '[]'` (`[{id,url,alt,caption}]`) · `duration varchar(50)` · `team_size int NN 1` · `client_type varchar(100)` · `live_url varchar(500)` · `github_url varchar(500)` · `is_published bool NN false` · `is_featured bool NN false` · `testimonial jsonb` (`{quote,author,position,company}`) · `mobile_image text` · `client_description text` · `business_outcome text` · `before_items text[] '{}'` · `after_items text[] '{}'` · `created_at/updated_at timestamptz now()` + trigger.

Indexes: `is_published`; `category`; `created_at DESC`; `(is_published,is_featured)`; `(slug,is_published)`; `(is_published,updated_at DESC)`.

Seed: 2 sample "RapidXTech" projects with placeholder images (may still exist in prod; unknown).

Touched by:
- `lib/supabase-cms.ts` `PortfolioCMS`
- `app/case-studies/page.tsx`, `[slug]/page.tsx` (server)
- `PortfolioClient.tsx` (client re-fetch)
- `components/featured-work.tsx` (homepage, featured)
- `app/sitemap.ts`
- Admin dashboard (CRUD, toggles)

**Columns never rendered publicly:** `mobile_image`, `testimonial`, `github_url`.

### `blog_posts`
`id serial PK` · `title varchar(255) NN` · `slug varchar(255) UNIQUE NN` · `excerpt text NN` · `content text NN` (originally HTML; AI posts are Markdown; rendered with `rehype-raw`, so raw HTML is allowed) · ~~`image varchar(500)`~~ (dropped) · `images jsonb NN '[]' CHECK jsonb_typeof='array'` · `tags text[] NN '{}'` · `author varchar(100) NN 'RapidXTech Team'` · `date date NN current_date` · `is_published bool NN false` · `seo_title varchar(255)` · `seo_description text` · `faqs jsonb '[]'` · `cta jsonb NULL` (`{title,description,buttonText,buttonLink}`) · `image_prompts jsonb` · timestamps + trigger.

Indexes: `is_published`; `slug`; `date DESC`; GIN `tags`; `(is_published,date DESC)`.

Data scripts: 3 seed posts (2024, fake authors); deletion of 14 duplicate AI slugs; 6 `seo_title` fixes.

Touched by:
- `BlogCMS`
- `app/blog/page.tsx` + `BlogClient` (re-fetch)
- `app/blog/[slug]/page.tsx`
- `app/sitemap.ts`
- Admin (CRUD + AI queue: `lib/ai-blog-generator.ts` runs **in the browser** with `NEXT_PUBLIC_GROQ_API_KEY` and inserts posts with `is_published:true, images:[]`)
- `/api/ai-blog-image` (Storage only)

### `client_reviews` *(table creation unscripted)*
`id` · `client_name/position/company` (nullable after alter) · `client_image` · `review_text NN` · `rating int` · `project_category` · `testimonial_type varchar(20) DEFAULT 'identified' CHECK IN ('identified','anonymous')` · `is_featured` · `is_published` · timestamps.

Indexes: `testimonial_type`; `(is_published,testimonial_type)`; `(is_published,is_featured)`. Seed: 3 anonymous reviews.

Touched by: `ReviewsCMS` → **admin only**. The public site never reads it. The homepage testimonials are hard-coded; only `testimonials-section.backup.tsx` (dead) calls `getPublishedReviews`.

### `trusted_partners` *(table creation unscripted)*
`id` · `company_name NN` · `company_logo NN` (URL) · `company_website` · `partnership_type` · `description` · `is_featured` · `is_published` · `display_order int NN 0` · timestamps. Indexes `(is_published,is_featured)`, `(is_published,display_order)`. Per docs, RLS is enabled: anon can read published rows; authenticated users get full CRUD.

Touched by: `PartnersCMS`; homepage `CompanyCarousel` (client, anon); admin.

### `blog_comments`
`id bigserial PK` · `post_slug text NN` · `name text NN` · `email text NN` · `website text` · `content text NN` · `is_approved bool NN false` · `created_at/updated_at timestamptz NN now()` + trigger. Indexes `post_slug`, `is_approved`, `(post_slug,is_approved)`.

Touched by: `components/blog/comment-section.tsx` (anon SELECT approved + anon INSERT, no captcha or rate limit); admin (list/approve/delete).

### Storage
- `blog-images`: public bucket. Authenticated users can INSERT/UPDATE/DELETE. Used by admin `ImageManager` / `StorageCMS.uploadImage` and by `/api/ai-blog-image` (service role).
- `project-images`: admin uploads (not scripted).

### Auth
Supabase email/password. Any `authenticated` session is treated as admin; there's no role or allow-list check. Lockout (3 tries / 15 min) is **client-side `localStorage` only**. The repo contains two parallel implementations (`lib/auth.ts` — unused — and `context/auth-context.tsx`).

### Contact leads
**Not stored in the DB.** Email only, via Resend (§7).

---

## 7. Contact / lead forms

### Main form: `app/contact/ContactClient.tsx` → `POST /api/contact`
- **Fields:** `name`* (text), `email`* (type=email), `phone` (tel, optional), `inquiryType`* (select: Book a Demo / Pricing & Packages / Getting Started–Buy a Plan / General Question), `whichPackage` (select: Not sure / Standard / Advanced / Premium, i.e. the aesthetic PKR tiers), `message`* (textarea), plus hidden state `bookingSource`.
- **Validation:** HTML5 `required` / `type=email` only on the client. The server checks only `name && email && message`; **no email format check, no length limits, no type checks.**
- **Destination:** Resend email from `notifications@rapidnextech.com` → **`sohaib@rapidnextech.com` (hard-coded)**, `replyTo` = submitter.
  - Subject: `[inquiryType] New Lead: {name} via Website`.
  - The HTML body interpolates user input **without escaping** (HTML injection into the notification email).
  - **`whichPackage` is sent but ignored by the server**, so the selected package never reaches the email.
  - The server reads `preferredCallTime`, which the client never sends.
  - Nothing is written to Supabase or a CRM.
- **Spam protection:** none (no honeypot, captcha, rate limit, or origin check).
- **States:** a button spinner while submitting; success shows a green "Message sent! We'll get back to you within 24 hours." for 5 s and resets the form; error shows a red "An error occurred. Please try again." There's no field-level errors and no redirect or thank-you page (so no conversion URL for analytics).
- **URL params:**
  - `plan=standard|advanced|premium|starter|growth` pre-selects inquiry/package, pre-fills the message, and shows an "enquiring about X Plan — Aesthetic Clinics" banner.
  - `bookingSource=medspa|aesthetic|dental` (+ `fromBook`, `showDemoPrompt`) pre-fills and optionally opens a "Loved the demo?" dialog.
  - **`topic=…`, `type=…`, `demo=live-flow` are linked from solution pages but ignored.**
- **Copy is aesthetic-clinic-specific even for generic visitors.** H1 "Let's Set Up Your Clinic's WhatsApp Assistant", placeholder "Tell us about your clinic…", and the sidebar line "Helping aesthetic & skin clinics…". Every homepage/service "Start your project" CTA lands here.
- **Contact details on this page conflict with the rest of the site:** "US Phone **+1 813 214 2552**" (footer, JSON-LD, llms.txt, and legal pages say **+1 214 896 4186**). WhatsApp is +92 331 4664279.
- `app/contact/page.tsx` wraps the client in `<Suspense>` (needed for `useSearchParams`) and emits ContactPage JSON-LD that uses the +1 214 number.

### Other lead / interaction paths
- **Stripe intent beacon** (`lib/stripe-intent.ts` → `/api/stripe-intent`): fires on real-estate/diet pricing clicks and emails `sohaib@rapidnextech.com` plus a personal Gmail address. It's unauthenticated, has no rate limit, and is an email-spam vector. Input is HTML-escaped here.
- **Blog comments** (`comment-section.tsx`): Supabase insert; client validation (name, email regex, ≥5 chars); moderation via `is_approved`; error shown via `alert()`; no spam protection.
- **WhatsApp deep links:** demo `wa.me/12148964186`; sales `wa.me/923314664279` (aesthetic pricing, real-estate/diet CTA, contact page).
- **Voice demo iframe** (`try.rapidnextech.com`): its `booking` postMessage only flips a UI badge; nothing is persisted.
- **Careers:** `mailto:info@rapidnextech.com` (a different mailbox from contact@ / sohaib@).

---

## 8. SEO

- **Sitemap** (`app/sitemap.ts`, dynamic, `unstable_noStore`):
  - 9 static pages (home, about, case-studies, services, blog, careers, contact, privacy-policy, terms-of-service).
  - 9 `/services/*` from `servicesData`.
  - 6 `/solutions/*` from `industrySolutions`, plus explicit texas and dental (deduped).
  - Published blog posts and projects (fresh Supabase reads).
  - `lastModified` = request time for all static entries.
  - Silent `catch` returns an empty list if Supabase fails.
- **Robots** (`app/robots.ts`): `allow /`; **disallow `/admin`, `/api/`, `/private/`, `/_next/`, `/static/`**. Blocking `/_next/` stops Googlebot from fetching JS/CSS chunks needed to render client-heavy pages. Sitemap and host are set.
- **Canonicals:** every page sets one. Most are hard-coded `https://rapidnextech.com/...` strings; some use `absoluteSiteUrl()`. Home is set twice (layout + page). The root layout also sets `alternates.languages en-US`.
- **JSON-LD** (helpers in `lib/seo.ts`: organization, website, breadcrumb, faq, service, `jsonLd()`):
  - Root: Organization + WebSite.
  - Pages: Breadcrumb/Service/FAQ on services, dental, texas, never-miss-a-call, medspa. Custom Service + FAQ on aesthetic. AboutPage, ContactPage, ItemList (case studies), CaseStudy (detail), Blog, BlogPosting.
  - Some are emitted as `next/script afterInteractive`, so they're **not in the initial HTML** (about, contact, case-studies, blog index).
  - Real-estate, diet-nutrition, `/services` have none.
  - Organization `foundingDate: "2020"` vs the homepage "4+ years". `sameAs` handles are unverified.
  - Logo `/logo.png` referenced in Blog/CaseStudy/author schema **doesn't exist** (`/logo-main.png` does).
- **OG images:** a single generic `/og-image.png` for every static page. Blog/case-study pages use the first DB image, with fallback `/og-image.jpg`, **which doesn't exist**. No per-page OG generation (`opengraph-image.tsx`).
- **Headings:** homepage H1 is the typewriter (first phrase SSR'd). MedSpa and never-miss-a-call have **no H1**. The blog index H1 is the decorative word "INSIGHTS".
- **Internal linking:**
  - Header (services mega menu + solutions) and footer link to all services and solutions.
  - Homepage links to 3 of 6 solutions, the services bento (8 of 9), and case studies.
  - Solution pages cross-link medspa↔aesthetic, never-miss-a-call↔texas, dental→medspa, plus a few hard-coded blog slugs.
  - The AI blog generator injects internal links.
  - `/blog?tag=x` links are emitted from every post, but the blog index ignores `tag`, so the filter is dead and creates duplicate crawlable URLs.
- **Other:**
  - `public/llms.txt` (AI-crawler brief) describes the aesthetic offering as "Dubai and GCC", which conflicts with the live Lahore page.
  - `public/1e4d1447….txt` looks like an IndexNow/verification key.
  - Google/Bing verification is via env vars (unset in the provided env).
  - `docs/blog-seo-audit.md` exists (generated).

---

## 9. Analytics / tracking

**None is installed.** No GA4/gtag, GTM, Meta pixel, PostHog, Plausible, Clarity, or Hotjar. `@vercel/analytics` is in `package.json` but never imported.

The privacy policy states the site uses Google Analytics and cookies, which is inaccurate today. The only "events" are server-side emails: the contact form submission and the Stripe checkout-click beacon. The voice-demo iframe postMessages are only `console.info`'d.

---

## 10. Build / lint / typecheck results

Run with Node 20.20.0 / npm 10.8.2. No files were changed, except that tool-generated build output landed in the gitignored `.next/` (plus `next-env.d.ts`). `tsconfig.json` was verified unchanged. `package-lock.json` was already modified before this session.

| Command | Result |
|---|---|
| `npm run build` (1st run) | ❌ **Failed** at "Collecting page data for /case-studies": `Missing Supabase environment variables`. At that point the env file was named **`env.local`** (no leading dot), which Next doesn't load. `lib/supabase.ts` throws at import time when the vars are absent, so any missing env kills the whole build. |
| `npm run build` (2nd run) | ✅ **Passed** (29 s): 87 pages (35 blog posts, 10 case studies, 9 services). During the session the file became **`.env.local`** (renamed outside this session; I only read it). Next picked it up ("Environments: .env.local"). `copy-htaccess` printed "not copied (missing .htaccess or out/)": the script looks for `./.htaccess`, but the file is at `public/.htaccess`, and `out/` only exists with `NEXT_OUTPUT=export`. Warning: caniuse-lite outdated. First-load JS: home 217 kB, blog post 259 kB, admin 217 kB, shared 87.5 kB. |
| Build caveat | `next.config.mjs` sets **`typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true`**, so the passing build hides everything below. |
| `npm run lint` (`next lint`) | ❌ **187 errors, 27 warnings across 65 files.** Mostly `no-unused-vars` and `no-explicit-any`, then `react/no-unescaped-entities`, `exhaustive-deps`, `no-img-element`, 2× `jsx-a11y/alt-text`. Homepage-relevant files flagged: `Header.tsx`, `header-nav.tsx`, `featured-work.tsx`, `scroll-section.tsx`, `stats-section.tsx`, `typewriter-text.tsx`, `company-carousel.tsx`, `lib/services-data.ts`. |
| Typecheck (`npx tsc --noEmit --incremental false`; there is no typecheck script) | ❌ **14 errors in 11 files**: `app/admin/dashboard.tsx` (camelCase fields; dead file), `api/ai-blog-image` (string→Blob), `CareersClient`/`OpenRoles` (`id` prop on `FadeInSection`), `floating-cards` (unknown), `benefits-block` (stray `auth` prop), `deliverables-block` (missing type export; dead file), **both voice LPs** (`RoiSection` ref type), **`testimonials-section.tsx` (homepage; framer `ease: string`)**, `lib/supabase.ts` (`lockAcquireTimeout` not in current supabase-js types, because it's pinned to `latest`). |
| Tests | None configured. |

---

## 11. Risks

### 11.1 Security (independent of the rewrite; flagged for you to action)
1. **Plain-text admin credentials committed to a public GitHub repo**: `docs/DATABASE_SCHEMA.md:101` and `docs/MIGRATION_SUMMARY.md:10,46` (old `admin@rapidxtech.com` account + password). The remote is `github.com/SohaibRiyaz/rapidnextech` and history shows "pushing as public repo". Assume compromised: rotate/delete that Supabase user and scrub history.
2. **RLS:** per `supabase_structure.md`, RLS is *disabled* on `projects`, `blog_posts`, `client_reviews`, and the anon key ships in every client bundle. Anyone could edit or delete site content. I can't verify the live state read-only; please confirm in the dashboard.
3. **Any authenticated Supabase user = admin** (no role check). If public sign-ups are enabled in Supabase Auth, anyone can create an account and get write access (storage, partners, and any table with "authenticated" policies).
4. `/api/ai-blog-image` is **unauthenticated** and uses `SUPABASE_SERVICE_ROLE_KEY` + an HF token. Anyone can burn credits and upload files to your public bucket.
5. `NEXT_PUBLIC_GROQ_API_KEY` and `NEXT_PUBLIC_HUGGINGFACE_TOKEN` are `NEXT_PUBLIC_*`, so they're inlined into client JS (the admin chunk, publicly downloadable).
6. `/api/contact` (HTML injection in the email, no rate limit) and `/api/stripe-intent` (no auth, no rate limit) are spam/abuse vectors. Blog comments allow anonymous inserts with no throttling.
7. The admin lockout is client-side only (`localStorage`), so it's trivially bypassed.
8. `.gitignore` uses `.env*`, so a file named `env.local` (as it was at session start) would **not** be ignored. It's now `.env.local` and ignored. I grepped tracked files and history: no secret-like strings or env files found.

### 11.2 What a homepage rewrite can break
- **Global coupling via `lib/services-data.ts`:** the nav mega menu, mobile menu, footer services list, `/services`, `/services/[slug]` (`generateStaticParams`), sitemap, and homepage bento all read `servicesData` / `serviceCategories` / `industrySolutions`. Renaming slugs changes URLs (SEO) and breaks the sitemap.
- **`ConditionalLayout` path checks:** the widget suppression and the Header's dark-LP mode are exact pathname string matches in two separate files (`conditional-layout.tsx:18`, `Header.tsx:53`). New dark pages must be added in both.
- **Fixed header overlap:** the header is `fixed` (h-20 → h-16) and pages compensate ad hoc (`pt-16 md:pt-24`, `pt-28`, `pt-32`). There's no shared offset token.
- **Theme system:** sections depend on `.theme-bg`, `.theme-text`, `.theme-gradient-text`, the `data-theme-color` CSS, and JS `mode/color` branching. `dark:` utilities don't work (§4). The 7-colour picker means any new design must look acceptable in 14 theme/mode combos, or the picker has to go. Server HTML is always `light-mode`, which causes a flash for dark users.
- **`ProjectCTA`** is shared with `/case-studies`; `ProcessSection`, `MeshGradient`, `TypewriterText`, `BentoGrid` are shared with `/services` and others. Edit copies rather than these, or check consumers first.
- **`FeaturedWorkSection` / `CompanyCarousel`** need Supabase at runtime and render nothing or placeholders if it's empty. `lib/supabase.ts` throws on import without env vars, so any homepage component importing the CMS will fail builds in env-less CI.
- **Nested `<main>`:** the layout's `<main role="main">` wraps pages that also render `<main>` (about, careers, dental, texas, services detail, legal, solution templates) or `role="main"` (voice LPs). A new homepage shouldn't add another.
- **`'use client'` sprawl:** most sections are client components with framer-motion infinite animations (StatsSection glow, Contact glow). Watch LCP/INP.
- **`images.unoptimized: true`:** `next/image` does no optimization (originally for a static export). Large PNGs in `public/` ship as-is.
- **Static-export mode** (`NEXT_OUTPUT=export`, `.htaccess`, cPanel docs) is incompatible with the current API routes, the dynamic aesthetic page, and the dynamic sitemap. It's unclear which deployment target is live (`vercel.json` uses pnpm; `server.js` is a custom Node server; docs describe a cPanel static upload).
- **Dependencies pinned to `latest`** (`@supabase/supabase-js`, `framer-motion`, `next-themes`, `@radix-ui/react-slot`, `@emotion/is-prop-valid`). Both `package-lock.json` and `pnpm-lock.yaml` exist (Vercel uses pnpm; local uses npm and has a modified lock), so installs aren't reproducible.

### 11.3 Content inconsistencies / hard-coded content
- **Positioning conflict:**
  - Homepage card + `llms.txt` say aesthetic = "Dubai and GCC".
  - The page itself is Lahore/PKR.
  - The about page says "GCC, US, and UK".
  - Org schema says "US, GCC, UK".
- **Phone numbers:** +1 214 896 4186 (footer, schema, legal, also the WhatsApp *demo* line) vs +1 813 214 2552 (contact page) vs +92 331 4664279 (WhatsApp sales).
- **Emails:** contact@ (public), sohaib@ (lead inbox), info@ (careers), plus a personal Gmail in the Stripe beacon.
- **Hard-coded stats:**
  - Home: 4+ yrs / 20+ projects / 5+ countries.
  - About: 20+ projects / **98% client retention** / 5+ markets / 24/7.
  - Org `foundingDate 2020`.
  - Solution pages: "40% of med spa calls unanswered", "68%", "$1,200", "30-40% of inquiries lost", "2x bookings", "+35%".
  - Services: "Reduce manual work by 80%", "40-70% reduction", "save 20-40%", SOC2/HIPAA/ISO and 24/7 SOC claims.
  - `llms.txt` itself tells AI not to invent such claims. Worth verifying before reusing on the new homepage.
- **Expired offer:** "50% off setup — until April 30, 2026" on real-estate and diet-nutrition (today is 2026-10-09). The two pages share identical Stripe Payment Links.
- **Testimonials:** 2 hard-coded on the homepage (KGulf Hosting "Dr Nimr", TKMachino "Asad"). The `client_reviews` table (admin-managed) is never displayed.
- **Leftovers:** "RapidXTech" branding in seed data, `lib/portfolio-data.ts`, `lib/testimonials-data.ts`, `lib/blog-data.ts`, and DB defaults (`author DEFAULT 'RapidXTech Team'`). `generator: 'v0.app'` in metadata. The medspa sample script names a fictional "Glow Med Spa".
- **Missing assets referenced:** `/logo.png`, `/og-image.jpg`, `/sohail-riaz.jpg`. Also `/jehanzaib-javed.jpg` vs the actual `.JPG` file, which 404s on case-sensitive Linux hosts; that one is used only by the unused `team-section`.

### 11.4 Dead code / duplication (safe-to-remove candidates, *not* removed)
- **Unused components:** `elegant-partners`, `minimal-partners`, `floating-cards`, `particle-background`, `team-section`, `image-carousel`, `optimized-image`, `testimonials-section.backup.tsx`, `app/case-studies/PortfolioClient.backup.tsx`, `components/careers/CareersClient.tsx` (page uses split components), `blog/{author-card,blog-layout,code-block,image-zoom,pull-quote}`, `services/blocks/deliverables-block.tsx`, `admin/shared/AdminControls.tsx`, `app/admin/dashboard.tsx`, `components/admin/projects/*` (dashboard inlines its own project UI), aesthetic `feature-deep-dive` + `optional-offers`, `AudioDemoPlayer` ×2, `app/careers/head.tsx`.
- **Unused lib/hooks/styles:** `lib/{auth,blog-data,portfolio-data,testimonials-data,cms-data(categories only),image-utils,currency.formatCurrency}`, `hooks/{use-pricing-currency,use-media-query(only dead),use-mobile}`, `styles/globals.css`, ~45 shadcn primitives, `/api/exchange-rates`.
- **Duplicated code:**
  - `useSupabaseCMS` is defined twice (`lib/supabase-cms.ts` and `lib/hooks/use-supabase-cms.ts`).
  - Two auth implementations.
  - `use-toast` and `use-mobile` duplicated.
  - Voice LPs ~95% duplicate.
  - real-estate/diet-nutrition ~90% duplicate.
  - The `FeatureItem` tooltip component is copied in 3 pricing sections.
  - Blog and case-study lists fetch on the server and again on the client.
- **Unused public files:** `RapidNexTech_Logo.png`, `bilal_ahmad_sales_guy.jpeg`, `design-process.riv`, `no-image*.jpg`, `placeholder-*`, `project-evolution-steps.json`, `rapidnextech-logo.jpg`, `version-control-animate.svg`, `world-map.svg` (`worldmap.svg` is the one used).
- **Repo clutter committed to git:** `build_output.txt` (0.9 MB), `build_result.txt` (4.5 MB), `git_changes.patch` (12.6 MB), `logo/` concept PNGs, `debug-projects.js` (empty), and assorted planning `.md` files.

### 11.5 Smaller bugs noticed
- `HiringProcess.tsx` builds Tailwind classes dynamically (`w-[${circleSize}px]`), so they never compile.
- `ThemeContext` applies classes using stale state on first mount.
- `StatsSection` / `AboutClient` `Counter` calls `setTimeout` during render, and its initial state equals the target, so the count-up never animates.
- `FeaturedWorkSection` `useEffect` misses the `cms` dependency.
- Admin `BlogCard` "view prompt" is a `title` tooltip only.
- AI-generated posts auto-publish with no image, so they render with the `/placeholder.svg` hero.
- `/services` is a client page whose layout supplies metadata (fine), but its breadcrumbs elsewhere point to a non-existent `#solutions` anchor.

---

## 12. Clarifying questions

1. **Where is production actually deployed?** Vercel (`vercel.json`), cPanel static export (`DEPLOYMENT_*.md`, `.htaccess`), or cPanel Node (`server.js`)? This decides whether API routes, the dynamic sitemap, and the `searchParams` page work, and whether I can rely on server rendering for the new homepage.
2. **Homepage positioning:** should the rewrite lead with custom software/SaaS engineering (current hero) or with the vertical AI-automation products? Which markets should it speak to: US, UK, GCC, Pakistan? (The aesthetic page is now Lahore/PKR, while the homepage and `llms.txt` still say Dubai/GCC.)
3. **Scope boundary:** is the rewrite homepage-only (`app/page.tsx` + new section components), or may I also change shared pieces: Header/HeaderNav (e.g. add a header CTA, rename "Insights"/"Blog"), Footer, `globals.css`, `services-data.ts`, `ProjectCTA`?
4. **Theme system:** keep the 7-colour picker and the dark/light toggle, or can the new design standardise on one brand theme? (It affects how much theme-variant work every new section needs, and fixing the dead `dark:` / flash-of-light issues.)
5. **WhatsApp badge:** should it stay site-wide on the new homepage? Its copy is clinic/patient-specific and it opens the US demo number. Should it be hidden, re-worded, or routed differently on the homepage and software pages?
6. **Canonical contact details:** which US number is correct, +1 214 896 4186 or +1 813 214 2552? And should the WhatsApp demo and sales numbers stay separate?
7. **Social proof:** are the stats (4+ yrs, 20+ projects, 5+ countries, 98% retention) and the two testimonials verified and approved for reuse? Should testimonials come from the `client_reviews` table instead of being hard-coded? Are the partner logos in `trusted_partners` real and current?
8. **Featured work:** keep pulling featured case studies from Supabase on the homepage? If so, OK to move that fetch server-side so it's in the SSR HTML?
9. **Contact form:** should the generic contact page stop being aesthetic-clinic-specific? And do you want leads persisted (e.g. a Supabase `leads` table) and spam protection added? (That would be a later, separate change.)
10. **Analytics:** none is installed, but the privacy policy says GA is used. Do you want GA4, Vercel Analytics (already a dependency), or something else wired in with the rewrite, and which conversion events should be tracked?
11. **Security items in §11.1:** have the leaked admin credentials been rotated, and is RLS currently enabled on `projects`, `blog_posts`, `client_reviews`, `blog_comments`? Are Supabase public sign-ups disabled? Do you want these fixed before or alongside the homepage work?
12. **Stale solution pages:** are real-estate and diet-nutrition still active offers? Should the expired "until April 30, 2026" banners and the shared Stripe links be left untouched for now?
13. **Cleanup:** may a later session delete the dead code, backups, and committed build logs/patch files listed in §11.4, or should the repo stay as-is apart from the homepage?
