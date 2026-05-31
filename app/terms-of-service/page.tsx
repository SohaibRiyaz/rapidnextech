import type { Metadata } from "next"
import { LegalLayout } from "@/components/legal/legal-layout"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms governing your use of the RapidNexTech website and services.",
  alternates: { canonical: "https://rapidnextech.com/terms-of-service" },
  openGraph: {
    title: "Terms of Service - RapidNexTech",
    description:
      "Read the terms governing your use of the RapidNexTech website and services.",
    url: "https://rapidnextech.com/terms-of-service",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech Terms of Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service - RapidNexTech",
    description:
      "Read the terms governing your use of the RapidNexTech website and services.",
    images: ["/og-image.png"],
  },
}

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated="March 16, 2026"
      intro="These Terms of Service govern your use of the RapidNexTech website and services."
    >
      <section>
        <h2>1. Introduction</h2>
        <p>
          These Terms apply to your access to and use of the RapidNexTech website and services. If you do not agree,
          you should not use the site or services.
        </p>
      </section>

      <section>
        <h2>2. Acceptance of Terms</h2>
        <p>
          By accessing or using our website or services, you agree to be bound by these Terms. These Terms form a
          legally binding agreement between you and RapidNexTech.
        </p>
      </section>

      <section>
        <h2>3. Services Description</h2>
        <p>RapidNexTech provides:</p>
        <ul>
          <li>Custom software development</li>
          <li>Web and mobile applications</li>
          <li>AI integrations and automation workflows</li>
          <li>Cloud architecture and consulting</li>
        </ul>
        <p>
          Project scope, timelines, and deliverables are defined in separate proposals or service agreements.
        </p>
      </section>

      <section>
        <h2>4. Intellectual Property</h2>
        <p>
          Unless otherwise agreed in a project contract, RapidNexTech retains ownership of its pre-existing tools,
          frameworks, and reusable components. Client-specific deliverables are transferred upon full payment, as
          stated in the project agreement.
        </p>
      </section>

      <section>
        <h2>5. Client Responsibilities</h2>
        <ul>
          <li>Provide accurate requirements and timely feedback</li>
          <li>Ensure you have rights to any materials you provide</li>
          <li>Meet payment obligations under agreed terms</li>
        </ul>
      </section>

      <section>
        <h2>6. Payment and Project Agreements</h2>
        <p>
          Project pricing, milestones, and payment schedules are defined in proposals or contracts. Failure to pay may
          result in project suspension or termination.
        </p>
      </section>

      <section>
        <h2>7. Limitation of Liability</h2>
        <p>
          RapidNexTech shall not be liable for any indirect, incidental, special, consequential, or punitive damages
          arising from the use of our services or website.
        </p>
        <p>
          To the maximum extent permitted by law, our total liability for any claim related to the services will not
          exceed the amount paid for the specific services giving rise to the claim.
        </p>
      </section>

      <section>
        <h2>8. Disclaimer of Warranties</h2>
        <p>
          The website and services are provided on an "as-is" and "as-available" basis. We make no warranties regarding
          uninterrupted service, error-free operation, or guaranteed business outcomes.
        </p>
      </section>

      <section>
        <h2>9. Third-Party Integrations</h2>
        <p>
          Our services may integrate with third-party platforms or APIs. RapidNexTech is not responsible for the
          availability, performance, or policies of those third-party services.
        </p>
      </section>

      <section>
        <h2>10. Termination</h2>
        <p>
          We may suspend or terminate access to the website or services if these Terms are violated or if required by
          law. Client project termination will follow the terms outlined in the applicable agreement.
        </p>
      </section>

      <section>
        <h2>11. Governing Law</h2>
        <p>
          These Terms are governed by the laws of England and Wales, without regard to conflict of law principles.
        </p>
      </section>

      <section>
        <h2>12. Contact Information</h2>
        <p>If you have questions about these Terms, please contact:</p>
        <div>
          <strong>RapidNexTech</strong>
          <div>Email: contact@rapidnextech.com</div>
          <div>Website: https://rapidnextech.com</div>
          <div>UK address: 38 Scotia Road, Stoke-on-Trent, ST6 4EP, UK</div>
          <div>US sales phone: +1 214 896 4186</div>
          <div>UK phone: +44 7311 133668</div>
        </div>
      </section>
    </LegalLayout>
  )
}
