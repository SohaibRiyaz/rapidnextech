"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Loader2, Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react"
import { useThemeContext } from "@/context/theme-context"
import Link from "next/link"

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const { mode, color } = useThemeContext()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", message: "" })
        // Reset status after 5 seconds to give user time to read
        setTimeout(() => setSubmitStatus("idle"), 5000)
      } else {
        console.error('Submission failed:', data.error)
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBgClass =
    mode === "dark" || color === "black" ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-300"

  const cardBgClass =
    mode === "dark" || color === "black" ? "bg-gray-900/40 border-white/10" : "bg-white/40 border-white/30"

  return (
    <div className="min-h-screen theme-bg theme-transition relative overflow-hidden">
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
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent theme-gradient-text theme-transition">
            Let's Build Something Great Together
          </h1>
          <p className="text-lg md:text-xl theme-text opacity-80 max-w-2xl mx-auto theme-transition">
            Have a project, idea, or question? Reach out directly or fill out the form below.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className={`backdrop-blur-md p-8 rounded-2xl border ${cardBgClass} shadow-lg theme-transition`}
            >
              <h2 className="text-2xl font-bold theme-text mb-6 theme-transition">Send Us a Message</h2>

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
                  placeholder="Tell us about your project..."
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
                  "Discuss Your Project"
                )}
              </Button>

              {submitStatus === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-green-500 text-center font-medium"
                >
                  ✓ Message sent successfully! We'll get back to you soon.
                </motion.p>
              )}
              {submitStatus === "error" && (
                <p className="mt-4 text-red-500 text-center">An error occurred. Please try again.</p>
              )}
            </form>
          </motion.div>

          {/* Right Column - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Contact Details Card */}
            <div className={`backdrop-blur-md p-8 rounded-2xl border ${cardBgClass} shadow-lg theme-transition`}>
              <h2 className="text-2xl font-bold theme-text mb-6 theme-transition">Get In Touch</h2>

              <div className="space-y-5">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-1">Email</h3>
                    <a
                      href="mailto:contact@rapidnextech.com"
                      className="text-primary hover:underline transition-all"
                    >
                      contact@rapidnextech.com
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-1">WhatsApp</h3>
                    <a
                      href="https://wa.me/923314664279"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline transition-all"
                    >
                      +92 331 4664 279
                    </a>
                  </div>
                </div>

                {/* Phone (Calls) */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-1">Phone (Calls)</h3>
                    <a
                      href="tel:+447311133668"
                      className="text-primary hover:underline transition-all"
                    >
                      +44 7311 133668
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-1">Address</h3>
                    <p className="theme-text opacity-80 text-sm leading-relaxed">
                      38 Scotia Road<br />
                      ST6 4EP<br />
                      UK
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text mb-1">Response Time</h3>
                    <p className="theme-text opacity-80 text-sm">
                      We respond within 24 hours<br />
                      Mon-Fri, 9am-6pm UK
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Signal */}
            <div className={`backdrop-blur-md p-6 rounded-2xl border ${cardBgClass} theme-transition text-center`}>
              <p className="theme-text opacity-90 text-sm leading-relaxed">
                <span className="font-semibold">Serving founders and teams globally</span> across fintech, hosting, e-commerce, and SaaS.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

