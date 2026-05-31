"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Loader2, Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react"

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

type FormData = {
  name: string
  email: string
  phone: string
  inquiryType: string
  preferredCallTime: string
  bookingSource: string
  message: string
}

export default function ContactClient() {
  const searchParams = useSearchParams()
  const bookingSource = searchParams.get("bookingSource") as BookingSourceKey | null
  const fromBookRedirect = searchParams.get("fromBook") === "1"
  const shouldShowDemoPrompt = searchParams.get("showDemoPrompt") === "1"

  const bookingSourceContent = useMemo(() => {
    if (!bookingSource || !(bookingSource in BOOKING_SOURCE_CONTENT)) {
      return null
    }
    return BOOKING_SOURCE_CONTENT[bookingSource]
  }, [bookingSource])

  const getInitialFormState = (): FormData => ({
    name: "",
    email: "",
    phone: "",
    inquiryType: bookingSourceContent ? "Schedule Demo Call" : "General Inquiry",
    preferredCallTime: "",
    bookingSource: bookingSource ?? "",
    message: bookingSourceContent ? bookingSourceContent.prefillMessage : "",
  })

  const [formData, setFormData] = useState<FormData>(getInitialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [isSourcePopupOpen, setIsSourcePopupOpen] = useState(false)
  const [sourceApplied, setSourceApplied] = useState(false)
  const { mode, color } = useThemeContext()

  useEffect(() => {
    if (!bookingSourceContent || sourceApplied) {
      return
    }

    setFormData((prevState) => ({
      ...prevState,
      inquiryType: "Schedule Demo Call",
      bookingSource: bookingSource ?? "",
      message: prevState.message || bookingSourceContent.prefillMessage,
    }))

    if (!fromBookRedirect && shouldShowDemoPrompt) {
      setIsSourcePopupOpen(true)
    }
    setSourceApplied(true)
  }, [bookingSource, bookingSourceContent, fromBookRedirect, shouldShowDemoPrompt, sourceApplied])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    mode === "dark" || color === "black" ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-300"

  const cardBgClass =
    mode === "dark" || color === "black" ? "bg-gray-900/40 border-white/10" : "bg-white/40 border-white/30"

  const selectClass =
    mode === "dark" || color === "black"
      ? "bg-gray-800/50 border-gray-700 text-white"
      : "bg-white/50 border-gray-300 text-gray-900"

  const formHeading = bookingSourceContent ? `Book Your ${bookingSourceContent.title} Demo Call` : "Send Us a Message"

  const formIntro = bookingSourceContent
    ? "Tell us about your clinic. We will schedule a quick call and tailor the setup around your workflow."
    : "Share your requirements and our team will get back to you shortly."

  return (
    <div className="min-h-screen theme-bg theme-transition relative overflow-hidden">
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
          animate={{
            x: ["0%", "100%", "0%"],
            y: ["0%", "50%", "0%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-6 pt-24 pb-12 relative z-10 md:pt-32">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent theme-gradient-text theme-transition">
            {bookingSourceContent ? "Great Demo Start. Let's Schedule the Real Setup." : "Let's Build Something Great Together"}
          </h1>
          <p className="text-lg md:text-xl theme-text opacity-80 max-w-2xl mx-auto theme-transition">
            {bookingSourceContent
              ? `You came from our ${bookingSourceContent.title} WhatsApp demo. Fill this quick form to schedule your strategy call.`
              : "Have a project, idea, or question? Reach out directly or fill out the form below."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
              <h2 className="text-2xl font-bold theme-text mb-2 theme-transition">{formHeading}</h2>
              <p className="text-sm theme-text opacity-75 mb-6">{formIntro}</p>

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
                  placeholder="+1 555 123 4567"
                />
              </div>

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
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Schedule Demo Call">Schedule Demo Call</option>
                  <option value="Pricing Discussion">Pricing Discussion</option>
                  <option value="Implementation Questions">Implementation Questions</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="preferredCallTime"
                  className="block text-sm font-medium theme-text mb-2 theme-transition"
                >
                  Preferred Call Time
                </label>
                <Input
                  type="text"
                  id="preferredCallTime"
                  name="preferredCallTime"
                  value={formData.preferredCallTime}
                  onChange={handleChange}
                  className={`${inputBgClass} theme-text focus:border-primary theme-transition`}
                  placeholder="e.g. Tomorrow 2:00 PM (your timezone)"
                />
              </div>

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
                  placeholder={
                    bookingSourceContent
                      ? "Share your clinic type, main treatments, and expected call volume..."
                      : "Tell us about your project..."
                  }
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
                ) : bookingSourceContent ? (
                  "Schedule My Demo Call"
                ) : (
                  "Discuss Your Project"
                )}
              </Button>

              {submitStatus === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-green-500 text-center font-medium"
                >
                  Message sent successfully! We'll get back to you soon.
                </motion.p>
              )}
              {submitStatus === "error" && (
                <p className="mt-4 text-red-500 text-center">An error occurred. Please try again.</p>
              )}
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <div className={`backdrop-blur-md p-8 rounded-2xl border ${cardBgClass} shadow-lg theme-transition`}>
              <h2 className="text-2xl font-bold theme-text mb-6 theme-transition">Get In Touch</h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-1">Email</h3>
                    <a href="mailto:contact@rapidnextech.com" className="text-primary hover:underline transition-all">
                      contact@rapidnextech.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-1">WhatsApp</h3>
                    <a
                      href="https://wa.me/12148964186"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline transition-all"
                    >
                      +1 214 896 4186
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-1">US Sales Phone</h3>
                    <a href="tel:+12148964186" className="text-primary hover:underline transition-all">
                      +1 214 896 4186
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-1">UK Phone</h3>
                    <a href="tel:+447311133668" className="text-primary hover:underline transition-all">
                      +44 7311 133668
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-1">UK Address</h3>
                    <p className="theme-text opacity-80 text-sm leading-relaxed">
                      38 Scotia Road,
                      <br />
                      Stoke-on-Trent, ST6 4EP, UK
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-1">Response Time</h3>
                    <p className="theme-text opacity-80 text-sm">
                      We respond within 24 hours
                      <br />
                      Mon-Sat, business hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`backdrop-blur-md p-6 rounded-2xl border ${cardBgClass} theme-transition text-center`}>
              <p className="theme-text opacity-90 text-sm leading-relaxed">
                <span className="font-semibold">Serving founders and teams globally</span> across fintech, hosting,
                e-commerce, and SaaS.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
