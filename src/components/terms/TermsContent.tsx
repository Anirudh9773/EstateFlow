import { FileText, Building2, Users, CreditCard, AlertTriangle, Copyright, Shield, Scale, Mail } from 'lucide-react';

export default function TermsContent() {
  return (
    <div className="container mx-auto px-4 max-w-4xl py-12 md:py-16">
      <div className="prose prose-invert max-w-none text-[#B8B5AE]">
        
        {/* Introduction */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <FileText className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">1. Introduction & Acceptance of Terms</h2>
            </div>
          </div>
          <p className="leading-relaxed">
            Welcome to EstateFlow. These Terms of Service (&quot;Terms&quot;) govern your access to and use of the EstateFlow 
            platform, website, and services (collectively, the &quot;Platform&quot;).
          </p>
          <p className="leading-relaxed">
            By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree to these 
            Terms, you must not use our Platform.
          </p>
          <p className="leading-relaxed">
            These Terms constitute a legally binding agreement between you and EstateFlow Ltd. Please read them 
            carefully before using our services.
          </p>
        </section>

        {/* Who We Are */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <Building2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">2. Who We Are</h2>
            </div>
          </div>
          <p className="leading-relaxed mb-4">
            EstateFlow Ltd. (&quot;EstateFlow&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is a company registered in England and Wales. 
            We operate an online property matching platform that connects property owners and buyers with verified, 
            local estate agents across the United Kingdom.
          </p>
          
          <div className="bg-[#1A1A24] border-l-4 border-gold p-4 mb-4 rounded-r-xl border border-white/10">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold m-0 mb-2">Important Notice</p>
                <p className="text-[#B8B5AE] m-0">
                  EstateFlow is a matching and introduction service only. We are not estate agents and do not 
                  provide property sales, lettings, or valuation services. All property transactions are conducted 
                  between you and the estate agents you choose to work with.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Using Our Platform */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <Users className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">3. Using Our Platform</h2>
            </div>
          </div>
          
          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">Eligibility</h3>
          <p className="leading-relaxed mb-4">
            You must be at least 18 years old to use our Platform. By using our services, you represent and warrant 
            that you meet this age requirement and have the legal capacity to enter into these Terms.
          </p>

          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">Account Registration</h3>
          <p className="leading-relaxed mb-3">
            Estate agents must register an account to receive leads. When registering, you agree to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and update your information to keep it accurate</li>
            <li>Keep your account credentials secure and confidential</li>
            <li>Notify us immediately of any unauthorized access to your account</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>

          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">Acceptable Use</h3>
          <p className="leading-relaxed mb-3">
            You agree not to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Use the Platform for any unlawful purpose or in violation of these Terms</li>
            <li>Provide false, misleading, or fraudulent information</li>
            <li>Impersonate any person or entity</li>
            <li>Interfere with or disrupt the Platform or servers</li>
            <li>Attempt to gain unauthorized access to any part of the Platform</li>
            <li>Use automated systems to access the Platform without our permission</li>
            <li>Collect or harvest data from the Platform without authorization</li>
            <li>Transmit viruses, malware, or other harmful code</li>
          </ul>
        </section>

        {/* For Property Owners */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">4. For Property Owners</h2>
            </div>
          </div>
          
          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">Our Service</h3>
          <p className="leading-relaxed mb-4">
            When you submit your property details, we use our matching algorithm to connect you with suitable 
            verified estate agents in your area. Our service is free for property owners, with no hidden fees 
            or obligations.
          </p>

          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">Your Responsibilities</h3>
          <p className="leading-relaxed mb-3">
            When submitting property information, you agree to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Provide accurate and truthful information about your property</li>
            <li>Have the legal right to sell or let the property</li>
            <li>Respond to agent inquiries in a timely and professional manner</li>
            <li>Understand that EstateFlow does not guarantee any specific outcome</li>
          </ul>

          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">No Guarantee</h3>
          <p className="leading-relaxed mb-4">
            While we strive to match you with suitable agents, we do not guarantee that you will find an agent, 
            sell your property, or achieve any particular result. All agreements and transactions are between you 
            and the estate agents you choose to work with.
          </p>
        </section>

        {/* For Estate Agents */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">5. For Estate Agents</h2>
            </div>
          </div>
          
          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">Verification Requirements</h3>
          <p className="leading-relaxed mb-3">
            To join EstateFlow as an agent, you must:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Be a licensed and registered estate agent in the UK</li>
            <li>Provide proof of professional indemnity insurance</li>
            <li>Be a member of a recognized property ombudsman scheme</li>
            <li>Comply with all relevant UK property laws and regulations</li>
            <li>Pass our verification and background checks</li>
          </ul>

          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">Lead Delivery & Payment</h3>
          <p className="leading-relaxed mb-4">
            Agents receive qualified leads based on their coverage areas and subscription plan. Payment terms, 
            lead pricing, and subscription fees are outlined in your agent agreement. All fees are non-refundable 
            unless otherwise stated.
          </p>

          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">Professional Conduct</h3>
          <p className="leading-relaxed mb-3">
            As a registered agent, you agree to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Respond to leads promptly and professionally</li>
            <li>Comply with all applicable laws and industry regulations</li>
            <li>Maintain professional standards in all communications</li>
            <li>Not misuse or share lead information with third parties</li>
            <li>Provide accurate information about your services and fees</li>
          </ul>

          <h3 className="font-heading text-lg md:text-xl font-semibold text-white mb-3">Suspension & Termination</h3>
          <p className="leading-relaxed mb-4">
            We reserve the right to suspend or terminate your account if you breach these Terms, engage in 
            unprofessional conduct, receive consistent negative feedback, or if your professional credentials 
            are revoked or expire.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <Copyright className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">6. Intellectual Property</h2>
            </div>
          </div>
          <p className="leading-relaxed mb-4">
            All content, features, and functionality on the Platform, including but not limited to text, graphics, 
            logos, icons, images, software, and the matching algorithm, are owned by EstateFlow Ltd. and are 
            protected by UK and international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <Scale className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">7. Limitation of Liability</h2>
            </div>
          </div>
          <p className="leading-relaxed mb-4">
            To the fullest extent permitted by law:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              EstateFlow provides the Platform &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, 
              either express or implied
            </li>
            <li>
              We do not warrant that the Platform will be uninterrupted, secure, or error-free
            </li>
            <li>
              We are not responsible for the actions, conduct, or services of estate agents on our Platform
            </li>
            <li>
              We are not liable for any property transactions, disputes, or outcomes between property owners 
              and estate agents
            </li>
          </ul>
        </section>

        {/* Indemnification */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">8. Indemnification</h2>
            </div>
          </div>
          <p className="leading-relaxed mb-4">
            You agree to indemnify, defend, and hold harmless EstateFlow Ltd., its officers, directors, employees, 
            and agents from any claims, liabilities, damages, losses, costs, or expenses arising from your use of the Platform or breach of these Terms.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <Scale className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">9. Governing Law & Disputes</h2>
            </div>
          </div>
          <p className="leading-relaxed mb-4">
            These Terms are governed by and construed in accordance with the laws of England and Wales. Any 
            disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <FileText className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">10. Changes to These Terms</h2>
            </div>
          </div>
          <p className="leading-relaxed mb-4">
            We may update these Terms from time to time. Your continued use of the Platform after changes are posted constitutes your acceptance of the updated Terms.
          </p>
        </section>

        {/* Contact Us */}
        <section className="mb-12">
          <div className="flex items-start gap-3 mb-4">
            <Mail className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-white mt-0 mb-3">11. Contact Us</h2>
            </div>
          </div>
          <p className="leading-relaxed mb-3">
            If you have any questions about these Terms, please contact us:
          </p>
          <div className="bg-[#1A1A24] border border-white/10 p-6 rounded-xl mb-4">
            <p className="text-white font-semibold mb-2">EstateFlow Ltd.</p>
            <p className="text-[#B8B5AE] mb-1">Legal Department</p>
            <p className="text-[#B8B5AE] mb-1">
              Email:{' '}
              <a href="mailto:legal@estateflow.co.uk" className="text-gold hover:text-white font-medium">
                legal@estateflow.co.uk
              </a>
            </p>
            <p className="text-[#B8B5AE]">
              Website:{' '}
              <a href="https://estateflow.co.uk" className="text-gold hover:text-white font-medium">
                www.estateflow.co.uk
              </a>
            </p>
          </div>
        </section>

        {/* Footer Note */}
        <div className="border-t border-white/10 pt-8 mt-12">
          <p className="text-text-muted text-sm text-center">
            These Terms of Service were last updated on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} 
            {' '}and is effective immediately.
          </p>
          <p className="text-text-muted text-sm text-center mt-2">
            EstateFlow Ltd. • Registered in England and Wales
          </p>
        </div>

      </div>
    </div>
  );
}
