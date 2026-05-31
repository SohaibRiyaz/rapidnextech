import type { Metadata } from "next"
import Link from "next/link"
import { LegalLayout } from "@/components/legal/legal-layout"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how RapidNexTech collects, uses, and protects personal information on rapidnextech.com.",
  alternates: { canonical: "https://rapidnextech.com/privacy-policy" },
  openGraph: {
    title: "Privacy Policy - RapidNexTech",
    description:
      "Learn how RapidNexTech collects, uses, and protects personal information on rapidnextech.com.",
    url: "https://rapidnextech.com/privacy-policy",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech Privacy Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - RapidNexTech",
    description:
      "Learn how RapidNexTech collects, uses, and protects personal information on rapidnextech.com.",
    images: ["/og-image.png"],
  },
}

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="March 16, 2026"
      intro="This Privacy Policy explains how RapidNexTech collects, uses, and protects personal information when you visit our website or contact us about our services."
    >
      <section>
        <h2>1. Introduction</h2>
        <p>
          RapidNexTech ("Company", "we", "our", or "us") respects your privacy and is committed to protecting the
          personal information you share with us through <Link href="/">rapidnextech.com</Link>.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <h3>2.1 Contact Form and Inquiry Data</h3>
        <p>When you submit a form or inquiry, we may collect:</p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Company name</li>
          <li>Message or project details</li>
        </ul>

        <h3>2.2 Analytics and Usage Data</h3>
        <p>When you visit our website, we may automatically collect:</p>
        <ul>
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device and operating system details</li>
          <li>Pages visited and time spent</li>
          <li>Referring URLs</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>Respond to inquiries and project requests</li>
          <li>Provide software development and consulting services</li>
          <li>Communicate about proposals, timelines, or updates</li>
          <li>Improve website performance and user experience</li>
          <li>Monitor usage trends and analytics</li>
          <li>Maintain website security and prevent abuse</li>
        </ul>
      </section>

      <section>
        <h2>4. Cookies and Tracking</h2>
        <p>
          We use cookies and similar technologies to understand how visitors interact with our website and to improve
          performance. You can disable cookies in your browser settings, but some site features may not function as
          expected.
        </p>
      </section>

      <section>
        <h2>5. Third-Party Services</h2>
        <p>We may use trusted third-party services, including:</p>
        <ul>
          <li>Google Analytics (traffic and usage insights)</li>
          <li>Hosting and infrastructure providers</li>
          <li>Communication tools used to reply to inquiries</li>
        </ul>
        <p>We do not sell or rent personal data to third parties.</p>
      </section>

      <section>
        <h2>6. Data Protection and Security</h2>
        <p>
          We implement reasonable technical and organizational safeguards to protect your information. However, no
          method of transmission over the internet is completely secure.
        </p>
      </section>

      <section>
        <h2>7. Data Retention</h2>
        <p>
          We retain personal information only for as long as necessary to respond to inquiries, provide services, and
          meet legal or contractual obligations.
        </p>
      </section>

      <section>
        <h2>8. Your Rights (GDPR Style)</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate or incomplete information</li>
          <li>Request deletion of your personal data</li>
          <li>Restrict or object to certain processing</li>
          <li>Request data portability</li>
          <li>Withdraw consent where processing is based on consent</li>
        </ul>
        <p>
          To exercise these rights, contact us at{" "}
          <a href="mailto:contact@rapidnextech.com">contact@rapidnextech.com</a>.
        </p>
      </section>

      <section>
        <h2>9. Children's Privacy</h2>
        <p>
          Our website and services are not intended for children under the age of 13, and we do not knowingly collect
          personal information from children.
        </p>
      </section>

      <section>
        <h2>10. Policy Updates</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated
          revision date.
        </p>
      </section>

      <section>
        <h2>11. Contact Information</h2>
        <p>If you have questions about this Privacy Policy, please contact:</p>
        <div>
          <strong>RapidNexTech</strong>
          <div>Email: <a href="mailto:contact@rapidnextech.com">contact@rapidnextech.com</a></div>
          <div>Website: https://rapidnextech.com</div>
          <div>UK address: 38 Scotia Road, Stoke-on-Trent, ST6 4EP, UK</div>
          <div>US sales phone: +1 214 896 4186</div>
          <div>UK phone: +44 7311 133668</div>
        </div>
      </section>
    </LegalLayout>
  )
}
