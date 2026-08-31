import { Shield, Mail, Clock, Users, Lock, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function PrivacyContent() {
  return (
    <div className="container mx-auto px-4 max-w-4xl py-12 md:py-16">
      <div className="prose prose-invert max-w-none text-[#B8B5AE]">
        
        {/* Introduction */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">1. Introduction & Who We Are</h2>
            </div>
          </div>
          <p className="leading-relaxed">
            EstateFlow Ltd. (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates EstateFlow, a UK-based online property matching 
            platform that connects property owners with verified local estate agents.
          </p>
          <p className="leading-relaxed">
            We are committed to protecting your personal data and respecting your privacy. This Privacy Policy 
            explains how we collect, use, store, and protect your information in compliance with the UK General 
            Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>
          <p className="leading-relaxed">
            EstateFlow Ltd. is the data controller responsible for your personal data. If you have any questions 
            about this policy or how we handle your data, please contact us at{' '}
            <a href="mailto:privacy@estateflow.co.uk" className="text-gold hover:text-white font-medium">
              privacy@estateflow.co.uk
            </a>.
          </p>
        </section>

        {/* What Data We Collect */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <FileText className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">2. What Data We Collect</h2>
            </div>
          </div>
          
          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">From Property Owners (Sellers & Buyers)</h3>
          <p className="leading-relaxed mb-3">
            When you submit your property details to find an estate agent, we collect:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Your name and contact information (email address, phone number)</li>
            <li>Property postcode and address</li>
            <li>Property details (type, bedrooms, estimated value, condition)</li>
            <li>Your timeline and preferences for selling or buying</li>
            <li>Any additional information you choose to provide in your submission</li>
          </ul>

          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">From Estate Agents</h3>
          <p className="leading-relaxed mb-3">
            When you register as an estate agent on our platform, we collect:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Your name and professional contact information</li>
            <li>Agency name, address, and registration details</li>
            <li>Coverage areas and postcodes you serve</li>
            <li>Professional credentials and licensing information</li>
            <li>Reviews and ratings from property owners</li>
            <li>Payment and billing information (for subscription services)</li>
          </ul>

          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">Automatically Collected Data</h3>
          <p className="leading-relaxed mb-3">
            When you use our website, we automatically collect:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>IP address and browser type</li>
            <li>Device information and operating system</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referring website and search terms used</li>
          </ul>
        </section>

        {/* How We Use Your Data */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">3. How We Use Your Data</h2>
            </div>
          </div>
          <p className="leading-relaxed mb-3">
            We use your personal data for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong className="text-white">To provide our matching service:</strong> Connecting property owners with suitable local 
              estate agents based on location, property type, and agent expertise
            </li>
            <li>
              <strong className="text-white">To facilitate communication:</strong> Enabling property owners and agents to connect and 
              communicate about property transactions
            </li>
            <li>
              <strong className="text-white">To send notifications:</strong> Sending email and SMS notifications to agents when they 
              receive new leads, and to property owners about their matches
            </li>
            <li>
              <strong className="text-white">To improve our platform:</strong> Analyzing usage patterns to enhance our matching algorithm 
              and user experience
            </li>
            <li>
              <strong className="text-white">To provide customer support:</strong> Responding to your inquiries and resolving any issues
            </li>
            <li>
              <strong className="text-white">To verify agents:</strong> Conducting background checks and verification of estate agent 
              credentials to maintain platform quality
            </li>
            <li>
              <strong className="text-white">To comply with legal obligations:</strong> Meeting our legal and regulatory requirements
            </li>
          </ul>
          <p className="leading-relaxed">
            We process your data based on the following legal grounds: your consent, performance of a contract, 
            compliance with legal obligations, and our legitimate interests in operating and improving our platform.
          </p>
        </section>

        {/* Who We Share Data With */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <Users className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">4. Who We Share Your Data With</h2>
            </div>
          </div>
          
          <div className="bg-[#1A1A24] border-l-4 border-gold p-4 mb-6 rounded-r-xl border border-white/10">
            <div className="flex items-start gap-2">
              <Lock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <p className="text-white font-medium m-0">
                We NEVER sell your personal data to third parties. Your information is only shared as described below.
              </p>
            </div>
          </div>

          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">Matched Estate Agents</h3>
          <p className="leading-relaxed mb-6">
            When you submit your property details, we share your information ONLY with the verified estate agents 
            you explicitly choose to connect with. You remain in control of which agents receive your details.
          </p>

          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">Service Providers</h3>
          <p className="leading-relaxed mb-3">
            We work with trusted third-party service providers who help us operate our platform:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Email and SMS notification services</li>
            <li>Cloud hosting and data storage providers</li>
            <li>Payment processors (for agent subscriptions)</li>
            <li>Analytics and performance monitoring tools</li>
            <li>Customer support software</li>
          </ul>
          <p className="leading-relaxed mb-6">
            These providers are contractually obligated to protect your data and use it only for the specific 
            services they provide to us.
          </p>

          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">Legal Requirements</h3>
          <p className="leading-relaxed">
            We may disclose your data if required by law, court order, or to protect our legal rights, prevent 
            fraud, or ensure the safety of our users.
          </p>
        </section>

        {/* Cookies and Tracking */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">5. Cookies and Tracking</h2>
            </div>
          </div>
          <p className="leading-relaxed mb-3">
            We use cookies and similar tracking technologies to improve your experience on our website. Cookies 
            are small text files stored on your device that help us:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Remember your preferences and settings</li>
            <li>Understand how you use our platform</li>
            <li>Improve our website performance and functionality</li>
            <li>Provide relevant content and recommendations</li>
          </ul>
          <p className="leading-relaxed">
            You can control cookie settings through your browser preferences. However, disabling certain cookies 
            may affect the functionality of our website.
          </p>
        </section>

        {/* Data Retention */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <Clock className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">6. Data Retention Policy</h2>
            </div>
          </div>
          <p className="leading-relaxed mb-3">
            We retain your personal data only for as long as necessary to fulfill the purposes outlined in this 
            Privacy Policy:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong className="text-white">Property owner data:</strong> Retained for up to 12 months after your last interaction with 
              our platform, unless you request earlier deletion
            </li>
            <li>
              <strong className="text-white">Estate agent data:</strong> Retained for the duration of your active account, plus 6 years 
              after account closure for legal and tax purposes
            </li>
            <li>
              <strong className="text-white">Communication records:</strong> Retained for up to 3 years for customer support and quality 
              assurance purposes
            </li>
            <li>
              <strong className="text-white">Analytics data:</strong> Anonymized and aggregated data may be retained indefinitely for 
              statistical purposes
            </li>
          </ul>
          <p className="leading-relaxed">
            After the retention period expires, we securely delete or anonymize your personal data.
          </p>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">7. Your Rights Under UK GDPR</h2>
            </div>
          </div>
          <p className="leading-relaxed mb-3">
            Under UK GDPR and the Data Protection Act 2018, you have the following rights regarding your personal data:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong className="text-white">Right of access:</strong> Request a copy of the personal data we hold about you
            </li>
            <li>
              <strong className="text-white">Right to rectification:</strong> Request correction of inaccurate or incomplete data
            </li>
            <li>
              <strong className="text-white">Right to erasure:</strong> Request deletion of your personal data (subject to legal obligations)
            </li>
            <li>
              <strong className="text-white">Right to restrict processing:</strong> Request that we limit how we use your data
            </li>
            <li>
              <strong className="text-white">Right to data portability:</strong> Request a copy of your data in a structured, machine-readable format
            </li>
            <li>
              <strong className="text-white">Right to object:</strong> Object to processing based on legitimate interests or for direct marketing
            </li>
            <li>
              <strong className="text-white">Right to withdraw consent:</strong> Withdraw your consent at any time where we rely on consent 
              to process your data
            </li>
          </ul>
          <p className="leading-relaxed mb-4">
            To exercise any of these rights, please contact us at{' '}
            <a href="mailto:privacy@estateflow.co.uk" className="text-gold hover:text-white font-medium">
              privacy@estateflow.co.uk
            </a>. We will respond to your request within one month.
          </p>
          <p className="leading-relaxed">
            You also have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO), the UK&apos;s 
            data protection authority.
          </p>
        </section>

        {/* Contact Us */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <Mail className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">8. How to Contact Us</h2>
            </div>
          </div>
          <p className="leading-relaxed mb-3">
            If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your 
            personal data, please contact us:
          </p>
          <div className="bg-[#1A1A24] border border-white/10 p-6 rounded-xl mb-4">
            <p className="text-white font-semibold mb-2">EstateFlow Ltd.</p>
            <p className="text-[#B8B5AE] mb-1">Data Protection Officer</p>
            <p className="text-[#B8B5AE] mb-1">
              Email:{' '}
              <a href="mailto:privacy@estateflow.co.uk" className="text-gold hover:text-white font-medium">
                privacy@estateflow.co.uk
              </a>
            </p>
            <p className="text-[#B8B5AE]">
              Website:{' '}
              <a href="https://estateflow.co.uk" className="text-gold hover:text-white font-medium">
                www.estateflow.co.uk
              </a>
            </p>
          </div>
          <p className="leading-relaxed">
            We aim to respond to all privacy-related inquiries within 5 business days.
          </p>
        </section>

        {/* Changes to Policy */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <FileText className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">9. Changes to This Policy</h2>
            </div>
          </div>
          <p className="leading-relaxed mb-4">
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, 
            legal requirements, or other factors.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Posting the updated policy on our website with a new &quot;Last updated&quot; date</li>
            <li>Sending an email notification to registered users (for material changes)</li>
            <li>Displaying a prominent notice on our platform</li>
          </ul>
        </section>

        {/* Footer Note */}
        <div className="border-t border-white/10 pt-8 mt-12">
          <p className="text-text-muted text-sm text-center">
            This Privacy Policy was last updated on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} 
            {' '}and is effective immediately.
          </p>
          <p className="text-text-muted text-sm text-center mt-2">
            EstateFlow Ltd. • Registered in England and Wales • Committed to protecting your privacy
          </p>
        </div>

      </div>
    </div>
  );
}
