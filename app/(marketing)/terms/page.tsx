export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-sm text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p className="mb-4">
            By accessing or using Resumeably.ai, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
          <p className="mb-4">
            Resumeably.ai provides AI-powered resume analysis and optimization services:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Free ATS (Applicant Tracking System) analysis</li>
            <li>Premium AI-powered resume rewriting</li>
            <li>DOCX and PDF file generation</li>
            <li>Resume storage and history</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="mb-4">
            To access certain features, you must create an account. You are responsible for:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us of any unauthorized use</li>
            <li>Providing accurate and complete information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Pricing and Payment</h2>
          <h3 className="text-xl font-medium mb-2">Pricing</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Single Resume Rewrite: $17 (one-time)</li>
            <li>Monthly Unlimited: $27/month</li>
            <li>Free analysis available without payment</li>
          </ul>
          
          <h3 className="text-xl font-medium mb-2">Payment Terms</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Payments processed securely through Stripe</li>
            <li>Subscriptions auto-renew until cancelled</li>
            <li>Refunds available within 7 days if service not used</li>
            <li>No refunds after resume generation</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
          <p className="mb-4">You agree NOT to:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Upload false, misleading, or fraudulent information</li>
            <li>Use the service for illegal purposes</li>
            <li>Attempt to reverse-engineer our AI models</li>
            <li>Share generated resumes for commercial redistribution</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Upload malicious files or content</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
          <h3 className="text-xl font-medium mb-2">Your Content</h3>
          <p className="mb-4">
            You retain all rights to your resume content. By using our service, you grant us a limited license to process and analyze your content solely for providing our services.
          </p>
          
          <h3 className="text-xl font-medium mb-2">Our Service</h3>
          <p className="mb-4">
            All service features, AI models, and website content are proprietary to Resumeably.ai and protected by intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. AI-Generated Content</h2>
          <p className="mb-4">
            Our AI enhances and optimizes your resume content. You are responsible for:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Reviewing all AI-generated content for accuracy</li>
            <li>Ensuring all information is truthful</li>
            <li>Making necessary adjustments before use</li>
            <li>The final content you submit to employers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>We provide the service "as is" without warranties</li>
            <li>We are not liable for job search outcomes</li>
            <li>Our liability is limited to the amount paid for services</li>
            <li>We are not responsible for third-party services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account for:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Violation of these terms</li>
            <li>Fraudulent or illegal activity</li>
            <li>Non-payment of fees</li>
            <li>Extended inactivity (12+ months)</li>
          </ul>
          <p className="mb-4">
            You may cancel your account at any time through your dashboard.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Data Processing</h2>
          <p className="mb-4">
            By using our service, you acknowledge that:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Your resume data is processed by AI services (Anthropic/OpenAI)</li>
            <li>Data is stored securely for 6 months</li>
            <li>You can request deletion at any time</li>
            <li>We comply with GDPR and CCPA regulations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Dispute Resolution</h2>
          <p className="mb-4">
            Any disputes will be resolved through:
          </p>
          <ol className="list-decimal list-inside mb-4">
            <li>Good faith negotiation</li>
            <li>Mediation (if negotiation fails)</li>
            <li>Binding arbitration (if mediation fails)</li>
          </ol>
          <p className="mb-4">
            These terms are governed by the laws of the United States.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these terms. Material changes will be notified via email or website announcement 30 days before taking effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
          <p className="mb-4">
            For questions about these Terms of Service:
          </p>
          <ul className="list-none mb-4">
            <li>Email: inquire@resumeably.ai</li>
            <li>Website: https://resumeably.ai</li>
          </ul>
        </section>
      </div>
    </div>
  )
}