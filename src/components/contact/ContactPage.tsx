'use client';

import { useState } from 'react';
import ContactHero from './ContactHero';
import ContactForm from './ContactForm';
import ContactInfoCards from './ContactInfoCards';
import FAQQuickLinks from './FAQQuickLinks';
import ContactTrustBar from './ContactTrustBar';

export default function ContactPage() {
  const [userRole, setUserRole] = useState<'client' | 'agent'>('client');

  return (
    <main className="min-h-screen bg-[#F5F3EE]">
      <ContactHero />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Form - Takes 2 columns */}
            <div className="lg:col-span-2">
              <ContactForm userRole={userRole} setUserRole={setUserRole} />
            </div>
            
            {/* Contact Info Cards - Takes 1 column */}
            <div className="lg:col-span-1">
              <ContactInfoCards />
            </div>
          </div>
        </div>
      </section>

      <FAQQuickLinks />
      <ContactTrustBar />
    </main>
  );
}
