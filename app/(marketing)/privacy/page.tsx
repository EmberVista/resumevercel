export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-sm text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Resumeably.ai ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered resume optimization service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-medium mb-2">Personal Information</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Name and email address (when you create an account)</li>
            <li>Resume content and job descriptions you provide</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Usage data and analytics</li>
          </ul>
          
          <h3 className="text-xl font-medium mb-2">Automatically Collected Information</h3>
          <ul className="list-disc list-inside mb-4">
            <li>IP address and device information</li>
            <li>Browser type and operating system</li>
            <li>Pages visited and features used</li>
            <li>Timestamps and referring pages</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We use your information to:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Provide our resume analysis and optimization services</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send service-related emails and updates</li>
            <li>Improve our AI models and service quality</li>
            <li>Respond to customer support requests</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
          <p className="mb-4">
            We implement industry-standard security measures to protect your data:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Encryption of data in transit and at rest</li>
            <li>Secure cloud storage with Supabase</li>
            <li>Regular security audits and updates</li>
            <li>Limited access to personal information</li>
          </ul>
          <p className="mb-4">
            <strong>Data Retention:</strong> We retain your resume data and analysis results for 6 months after your last activity. You can request deletion at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
          <p className="mb-4">We use trusted third-party services:</p>
          <ul className="list-disc list-inside mb-4">
            <li><strong>Stripe:</strong> Payment processing (PCI-compliant)</li>
            <li><strong>Anthropic/OpenAI:</strong> AI analysis (data processed per their privacy policies)</li>
            <li><strong>Kit (ConvertKit):</strong> Email marketing (if you opt-in)</li>
            <li><strong>Google Analytics:</strong> Website analytics (anonymized)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights (GDPR/CCPA)</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc list-inside mb-4">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Rectification:</strong> Correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request removal of your data</li>
            <li><strong>Portability:</strong> Export your data in a portable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Restriction:</strong> Limit how we process your data</li>
          </ul>
          <p className="mb-4">
            To exercise these rights, email us at inquire@resumeably.ai
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
          <p className="mb-4">
            We use essential cookies for authentication and functionality. Analytics cookies are used only with your consent. You can manage cookie preferences through your browser settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
          <p className="mb-4">
            Our service is not intended for users under 16 years of age. We do not knowingly collect information from children.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy periodically. We'll notify you of significant changes via email or website notification.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p className="mb-4">
            For privacy-related questions or concerns:
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