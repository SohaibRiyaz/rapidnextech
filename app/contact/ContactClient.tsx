"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Loader2, Mail, Phone, MapPin, Clock, MessageCircle, CheckCircle } from "lucide-react"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 3C8.82 3 3 8.82 3 16c0 2.3.62 4.46 1.7 6.32L3 29l6.85-1.67A12.93 12.93 0 0016 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.77a10.72 10.72 0 01-5.47-1.5l-.39-.23-4.07.99.98-3.96-.26-.41A10.75 10.75 0 0116 5.23c5.94 0 10.77 4.83 10.77 10.77S21.94 26.77 16 26.77zm5.9-8.06c-.32-.16-1.9-.94-2.2-1.04-.29-.1-.5-.16-.72.16-.21.32-.83 1.04-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.67s1.14 3.1 1.3 3.31c.16.21 2.25 3.44 5.45 4.82.76.33 1.35.53 1.81.68.76.24 1.46.2 2.01.12.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37z"
        fill="#25D366"
      />
    </svg>
  )
}

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { useThemeContext } from "@/context/theme-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getWhatsAppDemoUrl } from "@/lib/whatsapp-demo"

/* ------------------------------------------------------------------ */
/* Constants                                                            */
/* ------------------------------------------------------------------ */

const BUYER_WA = "923314664279"

function buildBuyerWALink(msg: string) {
  return `https://wa.me/${BUYER_WA}?text=${encodeURIComponent(msg)}`
}

const GENERIC_WA_LINK = buildBuyerWALink(
  "Hi, I'd like to know more about the WhatsApp booking assistant for my clinic."
)

/* ------------------------------------------------------------------ */
/* Booking-source content (existing behaviour — kept intact)           */
/* ------------------------------------------------------------------ */

type BookingSourceKey = "medspa" | "aesthetic" | "dental"

const BOOKING_SOURCE_CONTENT: Record<
  BookingSourceKey,
  {
    title: string
    popupTitle: string
    popupDescription: string
    prefillMessage: string
  }
> = {
  medspa: {
    title: "Med Spa",
    popupTitle: "Inspired by the Med Spa demo?",
    popupDescription:
      "Schedule a quick strategy call and we will show exactly how this flow can book more consultations for your clinic.",
    prefillMessage:
      "I just tried the Med Spa WhatsApp demo and I want to schedule a strategy call for my clinic.",
  },
  aesthetic: {
    title: "Aesthetic Clinic",
    popupTitle: "Loved the Aesthetic demo flow?",
    popupDescription:
      "Fill the form below to book a call. We will map your inquiry flow and show you where conversions can improve.",
    prefillMessage:
      "I just tried the Aesthetic Clinic WhatsApp demo and I want to schedule a strategy call.",
  },
  dental: {
    title: "Dental Clinic",
    popupTitle: "Ready to use this for your dental clinic?",
    popupDescription:
      "Book a short discovery call and we will tailor this demo flow around your dental treatments and booking process.",
    prefillMessage:
      "I just tried the Dental WhatsApp demo and I want to schedule a strategy call.",
  },
}

/* ------------------------------------------------------------------ */
/* Plan param helpers                                                   */
/* ------------------------------------------------------------------ */

const PLAN_NAMES: Record<string, string> = {
  standard: "Standard",
  advanced: "Advanced",
  premium: "Premium",
  starter: "Starter",
  growth: "Growth",
}

function getPlanPrefillMessage(planName: string) {
  return `Hi, I'm interested in the ${planName} package for my aesthetic clinic. I'd like to see a demo and discuss getting started.`
}

/* ------------------------------------------------------------------ */
/* Form type                                                            */
/* ------------------------------------------------------------------ */

type FormData = {
  name: string
  email: string
  phone: string
  inquiryType: string
  whichPackage: string
  bookingSource: string
  message: string
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export default function ContactClient() {
  const searchParams = useSearchParams()
  const bookingSource = searchParams.get("bookingSource") as BookingSourceKey | null
  const fromBookRedirect = searchParams.get("fromBook") === "1"
  const shouldShowDemoPrompt = searchParams.get("showDemoPrompt") === "1"
  const planParam = searchParams.get("plan")?.toLowerCase() ?? null
  const planName = planParam ? (PLAN_NAMES[planParam] ?? null) : null

  const bookingSourceContent = useMemo(() => {
    if (!bookingSource || !(bookingSource in BOOKING_SOURCE_CONTENT)) return null
    return BOOKING_SOURCE_CONTENT[bookingSource]
  }, [bookingSource])

  const getInitialFormState = (): FormData => ({
    name: "",
    email: "",
    phone: "",
    inquiryType: planName
      ? "Getting Started / Buy a Plan"
      : bookingSourceContent
      ? "Book a Demo"
      : "General Question",
    whichPackage: planName ?? "",
    bookingSource: bookingSource ?? "",
    message: planName
      ? getPlanPrefillMessage(planName)
      : bookingSourceContent
      ? bookingSourceContent.prefillMessage
      : "",
  })

  const [formData, setFormData] = useState<FormData>(getInitialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [isSourcePopupOpen, setIsSourcePopupOpen] = useState(false)
  const [sourceApplied, setSourceApplied] = useState(false)
  const { mode, color } = useThemeContext()

  useEffect(() => {
    if (!bookingSourceContent || sourceApplied) return

    setFormData((prev) => ({
      ...prev,
      inquiryType: planName ? "Getting Started / Buy a Plan" : "Book a Demo",
      bookingSource: bookingSource ?? "",
      message: prev.message || bookingSourceContent.prefillMessage,
    }))

    if (!fromBookRedirect && shouldShowDemoPrompt) {
      setIsSourcePopupOpen(true)
    }
    setSourceApplied(true)
  }, [bookingSource, bookingSourceContent, fromBookRedirect, shouldShowDemoPrompt, sourceApplied, planName])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setFormData(getInitialFormState())
        setTimeout(() => setSubmitStatus("idle"), 5000)
      } else {
        console.error("Submission failed:", data.error)
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBgClass =
    mode === "dark" || color === "black"
      ? "bg-gray-800/50 border-gray-700"
      : "bg-white/50 border-gray-300"

  const cardBgClass =
    mode === "dark" || color === "black"
      ? "bg-gray-900/40 border-white/10"
      : "bg-white/40 border-white/30"

  const selectClass =
    mode === "dark" || color === "black"
      ? "bg-gray-800/50 border-gray-700 text-white"
      : "bg-white/50 border-gray-300 text-gray-900"

  /* heading logic: plan banner takes priority, then bookingSource, else default */
  const pageHeading = planName
    ? "Let's Set Up Your Clinic's WhatsApp Assistant"
    : bookingSourceContent
    ? "Great Demo Start. Let's Schedule the Real Setup."
    : "Let's Set Up Your Clinic's WhatsApp Assistant"

  const pageSubheading = planName
    ? "Have a question, want to see a demo, or ready to get started? Message us on WhatsApp for the fastest reply, or fill the form below — we'll get back to you within 24 hours."
    : bookingSourceContent
    ? `You came from our ${bookingSourceContent.title} WhatsApp demo. Fill this quick form to schedule your strategy call.`
    : "Have a question, want to see a demo, or ready to get started? Message us on WhatsApp for the fastest reply, or fill the form below — we'll get back to you within 24 hours."

  return (
    <div className="min-h-screen theme-bg theme-transition relative overflow-hidden">
      {/* Existing booking-source popup — kept intact */}
      <Dialog open={isSourcePopupOpen} onOpenChange={setIsSourcePopupOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{bookingSourceContent?.popupTitle ?? "Let's Schedule Your Demo"}</DialogTitle>
            <DialogDescription>
              {bookingSourceContent?.popupDescription ??
                "Fill the form below and our team will schedule your call."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsSourcePopupOpen(false)}>
              Continue to Form
            </Button>
            <Button asChild type="button">
              <a href={getWhatsAppDemoUrl("Contact page")} target="_blank" rel="noopener noreferrer">
                Open WhatsApp Demo
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <motion.div
          className="absolute inset-0 theme-glow blur-3xl theme-transition"
          animate={{ x: ["0%", "100%", "0%"], y: ["0%", "50%", "0%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-6 pt-24 pb-12 relative z-10 md:pt-32">
        {/* Plan confirmation banner */}
        {planName && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/[0.06] px-5 py-4">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">
                  You&apos;re enquiring about: {planName} Plan — Aesthetic Clinics
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Great choice. Send us a quick message below, or message us directly on WhatsApp
                  and we&apos;ll set up your free demo.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Page heading */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent theme-gradient-text theme-transition">
            {pageHeading}
          </h1>
          {!planName && (
            <p className="text-lg md:text-xl theme-text opacity-80 max-w-2xl mx-auto theme-transition">
              {pageSubheading}
            </p>
          )}
        </motion.div>

        {/* WhatsApp fast-path banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <div className={`backdrop-blur-md rounded-2xl border ${cardBgClass} p-6 flex flex-col sm:flex-row items-center gap-4`}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#25D36620" }}>
              <WhatsAppIcon className="w-6 h-6" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <p className="font-semibold theme-text">Message us on WhatsApp — fastest reply</p>
              <p className="text-sm opacity-70 theme-text mt-0.5">
                The quickest way to get a reply and see a live demo. We&apos;ll respond personally.
              </p>
            </div>
            <a
              href={
                planName
                  ? buildBuyerWALink(getPlanPrefillMessage(planName))
                  : GENERIC_WA_LINK
              }
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{ backgroundColor: "#25D366" }}
            >
              <WhatsAppIcon className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form
              id="contact-demo-form"
              onSubmit={handleSubmit}
              className={`backdrop-blur-md p-8 rounded-2xl border ${cardBgClass} shadow-lg theme-transition`}
            >
              <h2 className="text-2xl font-bold theme-text mb-1 theme-transition">Send Us a Message</h2>
              <p className="text-sm theme-text opacity-75 mb-6">
                Share a few details and we&apos;ll get back to you within 24 hours.
              </p>

              {/* Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium theme-text mb-2 theme-transition">
                  Name *
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`${inputBgClass} theme-text focus:border-primary theme-transition`}
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium theme-text mb-2 theme-transition">
                  Email *
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`${inputBgClass} theme-text focus:border-primary theme-transition`}
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium theme-text mb-2 theme-transition">
                  Phone / WhatsApp Number
                </label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`${inputBgClass} theme-text focus:border-primary theme-transition`}
                  placeholder="+1 (555) 123 4567"
                />
                <p className="mt-1 text-xs text-muted-foreground">We&apos;ll reply on WhatsApp if you prefer.</p>
              </div>

              {/* Inquiry type */}
              <div className="mb-4">
                <label htmlFor="inquiryType" className="block text-sm font-medium theme-text mb-2 theme-transition">
                  Inquiry Type *
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:border-primary focus:outline-none theme-transition ${selectClass}`}
                >
                  <option value="Book a Demo">Book a Demo</option>
                  <option value="Pricing & Packages">Pricing &amp; Packages</option>
                  <option value="Getting Started / Buy a Plan">Getting Started / Buy a Plan</option>
                  <option value="General Question">General Question</option>
                </select>
              </div>

              {/* Which package — always visible, pre-selected if plan param present */}
              <div className="mb-4">
                <label htmlFor="whichPackage" className="block text-sm font-medium theme-text mb-2 theme-transition">
                  Which package?
                </label>
                <select
                  id="whichPackage"
                  name="whichPackage"
                  value={formData.whichPackage}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:border-primary focus:outline-none theme-transition ${selectClass}`}
                >
                  <option value="">Not sure yet</option>
                  <option value="Standard">Standard</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium theme-text mb-2 theme-transition">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`${inputBgClass} theme-text focus:border-primary theme-transition resize-none`}
                  placeholder="Tell us about your clinic and what you're looking for..."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white theme-transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>

              {submitStatus === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-green-500 text-center font-medium"
                >
                  Message sent! We&apos;ll get back to you within 24 hours.
                </motion.p>
              )}
              {submitStatus === "error" && (
                <p className="mt-4 text-red-500 text-center">An error occurred. Please try again.</p>
              )}
            </form>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <div className={`backdrop-blur-md p-8 rounded-2xl border ${cardBgClass} shadow-lg theme-transition`}>
              <h2 className="text-2xl font-bold theme-text mb-6 theme-transition">Get In Touch</h2>

              <div className="space-y-5">
                {/* WhatsApp — buyer number, shown first */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-0.5">WhatsApp (fastest)</h3>
                    <a
                      href={GENERIC_WA_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline transition-all text-sm"
                    >
                      +92 331 4664279
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-0.5">Email</h3>
                    <a href="mailto:contact@rapidnextech.com" className="text-primary hover:underline transition-all text-sm">
                      contact@rapidnextech.com
                    </a>
                  </div>
                </div>

                {/* US Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-0.5">US Phone</h3>
                    <a href="tel:+18132142552" className="text-primary hover:underline transition-all text-sm">
                      +1 813 214 2552
                    </a>
                  </div>
                </div>

                {/* UK Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-0.5">UK Phone</h3>
                    <a href="tel:+447311133668" className="text-primary hover:underline transition-all text-sm">
                      +44 7311 133668
                    </a>
                  </div>
                </div>

                {/* UK Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-0.5">UK Address</h3>
                    <p className="theme-text opacity-80 text-sm leading-relaxed">
                      38 Scotia Road,
                      <br />
                      Stoke-on-Trent, ST6 4EP, UK
                    </p>
                  </div>
                </div>

                {/* Response time */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-0.5">Response Time</h3>
                    <p className="theme-text opacity-80 text-sm">
                      We respond within 24 hours, Mon–Sat
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`backdrop-blur-md p-6 rounded-2xl border ${cardBgClass} theme-transition text-center`}>
              <p className="theme-text opacity-90 text-sm leading-relaxed">
                Helping aesthetic &amp; skin clinics turn WhatsApp inquiries into booked consultations.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
