# RapidNexTech — US Dental Cold Email Setup Guide

**Goal:** Stand up a separate sending domain on Zoho (free), protect rapidnextech.com, warm up 2–3 weeks, then start sending the US AI Voice Receptionist sequence to small dental practices.

**One-time setup time:** ~90 minutes. After that it runs in the background.

---

## PART 1 — The Big Picture (so it's clear)

You are buying/setting up THREE separate things:

1. **A domain** (`tryrapidnex.com`) — bought from a registrar (~$12/year). You own the name.
2. **Mailboxes on that domain** (`sohaib@tryrapidnex.com`, `hello@tryrapidnex.com`) — hosted on **Zoho free plan** (up to 5 mailboxes, $0).
3. **DNS records** (SPF / DKIM / DMARC) — text records you paste at your registrar so inbox providers trust your mail and it doesn't go to spam.

Your real `rapidnextech.com` Zoho account stays 100% untouched. The new domain lives in a SEPARATE Zoho account. If the cold domain's reputation ever gets burned, your main brand is safe.

---

## PART 2 — DNS Records (SPF, DKIM, DMARC)

These three records prove your email is legitimate. Without them, cold email lands in spam almost every time. You paste these into your **registrar's DNS settings** (Namecheap/Cloudflare/GoDaddy → "Manage Domain" → "Advanced DNS" or "DNS Records").

> **IMPORTANT:** Zoho will give you the EXACT values during setup (especially DKIM, which is unique to your account). The versions below are the standard templates so you understand what each one is and can confirm Zoho's match. Always use the exact DKIM value Zoho shows you.

### 1. SPF record (says "these servers are allowed to send mail for my domain")

| Field | Value |
|---|---|
| Type | TXT |
| Host / Name | `@` |
| Value | `v=spf1 include:zoho.com ~all` |
| TTL | Automatic (or 3600) |

**Plain English:** "Only Zoho's servers are authorized to send email from tryrapidnex.com. If mail comes from anywhere else, treat it as suspicious (`~all` = soft-fail)." You only get ONE SPF record per domain — never create two.

### 2. DKIM record (a cryptographic signature that proves the email wasn't tampered with)

| Field | Value |
|---|---|
| Type | TXT |
| Host / Name | `zmail._domainkey` (Zoho will give you the exact selector) |
| Value | `v=DKIM1; k=rsa; p=<LONG_KEY_ZOHO_GIVES_YOU>` |
| TTL | Automatic (or 3600) |

**Plain English:** Zoho generates a unique key pair. The public key goes in DNS; Zoho signs every outgoing email with the private key. Receiving servers check the signature matches — proving the mail really came from you and wasn't altered. **You MUST copy the exact `p=` value from Zoho's setup screen** — the template above is just to show you the shape.

### 3. DMARC record (tells receivers what to do if SPF/DKIM fail, and where to send reports)

| Field | Value |
|---|---|
| Type | TXT |
| Host / Name | `_dmarc` |
| Value | `v=DMARC1; p=none; rua=mailto:sohaib@tryrapidnex.com; pct=100; adkim=s; aspf=s` |
| TTL | Automatic (or 3600) |

**Plain English:** "If an email fails the SPF/DKIM checks, here's my policy." Start with `p=none` (monitor only — don't block anything yet) for the first few weeks so you don't accidentally block your own warmup mail. The `rua=` address receives daily reports on who's sending mail as your domain. **After 3–4 weeks of clean sending, upgrade `p=none` to `p=quarantine`** for stronger protection.

> **Why start at p=none:** A brand-new domain with an aggressive DMARC policy can block its own legitimate mail during warmup. Loosen first, tighten once stable.

### Optional but recommended: MX records

Zoho needs MX records so the domain can RECEIVE mail (important — you need replies to land somewhere). Zoho gives you these during setup, typically:

| Type | Host | Value | Priority |
|---|---|---|---|
| MX | `@` | `mx.zoho.com` | 10 |
| MX | `@` | `mx2.zoho.com` | 20 |
| MX | `@` | `mx3.zoho.com` | 50 |

---

## PART 3 — Step-by-Step Setup Checklist (~90 min)

### A. Buy the domain (10 min)
- [ ] Go to registrar (Namecheap or Cloudflare recommended for clean DNS)
- [ ] Buy `tryrapidnex.com` (or `getrapidnex.com` if taken)
- [ ] Skip all upsells (no need for their email, privacy is usually free/cheap)

### B. Create a SEPARATE Zoho account + add domain (20 min)
- [ ] Sign up for Zoho Mail with a DIFFERENT login than your rapidnextech.com account (use a personal Gmail to register, keep it separate)
- [ ] Choose the **Forever Free plan** (5 users, 5GB each, single domain)
- [ ] Add `tryrapidnex.com` as your domain
- [ ] Zoho will ask you to **verify ownership** — it gives you a TXT record to paste in DNS (do it, wait for verification)

### C. Paste DNS records (20 min + propagation wait)
- [ ] Add the **SPF** TXT record (Part 2.1)
- [ ] Add the **DKIM** TXT record — use the EXACT value Zoho generates (Part 2.2)
- [ ] Add the **DMARC** TXT record (Part 2.3)
- [ ] Add the **MX** records Zoho provides (Part 2 optional section)
- [ ] DNS changes take 15 min – a few hours to propagate. Zoho shows a green check when each verifies.

### D. Create your mailboxes (10 min)
- [ ] Create `sohaib@tryrapidnex.com` (your main sender)
- [ ] Create `hello@tryrapidnex.com` (second sender, for spreading volume later)
- [ ] Log into each via mail.zoho.com to confirm they send/receive
- [ ] Send a test email from each to your personal Gmail — confirm it ARRIVES (and check it's not in spam)

### E. Set up your signature (5 min)
- [ ] In Zoho settings, add a clean signature for sohaib@ (template in Part 5)
- [ ] Link to your REAL site `rapidnextech.com/solutions/never-miss-a-call` in the signature — this is the credibility bridge back to your real brand

### F. Begin warmup (passive, 2–3 weeks)
- [ ] Days 1–3: send 2–5 REAL emails/day (to friends, yourself, anyone who'll reply). Replies matter — they build reputation.
- [ ] Days 4–10: ramp to 8–12/day. Mix sends + replies.
- [ ] Days 11–21: ramp to 15–25/day.
- [ ] **Do NOT send cold prospect emails until ~day 14+.** Early sending to strangers who don't reply (or mark spam) damages the new domain fast.
- [ ] Optional: a free/cheap warmup tool can automate this, but manual sending from a real person in low volume IS a valid warmup.

### G. Then (after warmup) — start the real campaign
- [ ] Build lead list of 300–500 small dental practices (see Part 6)
- [ ] Start sending the sequence (Part 4), ~15–25/day max from one mailbox
- [ ] Track replies in a simple sheet
- [ ] After ~50 sent: if you're getting replies → consider Instantly to automate/scale. If zero → we fix the offer before scaling.

---

## PART 4 — The Refined 3-Email Sequence

**Deliverability changes made vs. the original drafts:**
- Removed the literal word **"demo"** from subject lines and softened it in body (spam-trigger heavy in cold email)
- Removed hard **"$397/month"** from the first email body (dollar amounts + cold = higher spam scoring). Money is introduced later, once interest exists.
- Kept subject lines short, lowercase, curiosity-driven (looks like a real person, not a blast)
- One link max per email (multiple links hurt deliverability)
- Plain text only, no images, no attachments

### EMAIL 1 — Day 1
**Subject:** missed calls at {{clinic_name}}?

> Dr. {{last_name}},
>
> Most single-dentist practices miss 20–30% of new-patient calls — not from lack of care, but because no one's free to pick up mid-procedure.
>
> We set up an AI phone receptionist that answers 24/7 and books appointments straight into your calendar. It sounds human, not like a robot menu.
>
> I can let you hear it handle a real appointment call this week — you'd just dial a number and listen, no commitment either way.
>
> Worth a quick listen?
>
> Sohaib
> RapidNexTech
> rapidnextech.com/solutions/never-miss-a-call

### EMAIL 2 — Day 4
**Subject:** the call that went to voicemail

> Dr. {{last_name}},
>
> A practice we work with had a new patient call during a procedure last month — it went to voicemail, and they booked with someone else down the road. That single missed call was worth well over a thousand dollars in lifetime value.
>
> Our AI receptionist makes sure those calls always get answered and booked, around the clock. If you'd like, I can set you up to hear it in action this week before deciding anything.
>
> Open to a quick call Thursday or Friday?
>
> Sohaib
> RapidNexTech

### EMAIL 3 — Day 8 (the breakup)
**Subject:** last note from me

> Dr. {{last_name}},
>
> I know you're busy running a practice, so I'll leave it here. If answered calls and booked appointments ever move up your list, we handle 24/7 phone answering that books straight into your calendar — and you can hear exactly how it works before committing to anything.
>
> The line to hear it is open whenever you're curious. Wishing you a great week.
>
> Sohaib
> RapidNexTech
> rapidnextech.com/solutions/never-miss-a-call

> **Note on pricing:** Introduce the $397/month figure on the REPLY, not in the cold email itself. When someone responds with interest, then: "It's $397/month flat — and you can hear it handle a real call first, free." This keeps the cold emails cleaner for spam filters and saves the number for a warm moment.

---

## PART 5 — Signature Template

```
Sohaib
Founder, RapidNexTech
AI Voice Receptionists for Dental Practices
rapidnextech.com/solutions/never-miss-a-call
```

Keep it text-only. No logo image (images hurt cold-email deliverability and trigger "marketing email" filters). The link back to your real domain is the credibility anchor.

---

## PART 6 — Lead List Building (for when warmup is done)

Target = small, owner-operated dental practices NOT currently hiring (they haven't decided "I need a human" yet).

**Source:** Apollo.io (free tier ~100 contacts/month) or similar.

**Filters:**
- Industry: Dental / Dentist offices
- Employee count: **1–5** (filters for owner-operated, not chains)
- Revenue: exclude $5M+ (those already have call centers)
- Geography: start with **2–3 states** — Texas, Florida, Arizona (high density, owner-friendly, and AZ has no DST which simplifies your send-time math)
- Title: "Owner," "Dentist," "Practice Owner," "DDS"

**Goal:** build 300–500 before starting. Verify emails (Apollo flags deliverability) to protect your new domain's reputation — sending to dead addresses (bounces) hurts you badly on a fresh domain.

---

## PART 7 — Guardrails (protect the new domain)

- **Never exceed ~25–30 sends/day per mailbox**, especially in the first month.
- **Verify every email before sending** — bounces are the fastest way to wreck a new domain.
- **One link per email**, plain text, no attachments.
- **Reply to every reply fast** — engagement (replies) is the strongest positive signal to inbox providers.
- **Watch your DMARC reports** (the rua= address) for anything sending as your domain.
- **After 3–4 clean weeks:** upgrade DMARC `p=none` → `p=quarantine`.
- If a mailbox starts landing in spam, pause it, send only replies for a week to recover.

---

## Quick Reference — Decision Point After First ~50 Emails

| Result | Next move |
|---|---|
| Getting replies (even 1–2) | Channel works → consider Instantly to automate + scale + add 2nd mailbox |
| Zero replies, but landing in inbox | Offer/sequence problem → revise messaging, not infrastructure |
| Landing in spam | Deliverability problem → check DNS, slow down, warm more |

---

*Setup once, then it runs quietly in the background while you focus on Lahore local outreach.*
