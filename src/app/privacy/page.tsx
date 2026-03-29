import { Metadata } from 'next';
import PrivacyContent from '@/components/privacy/PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy | EstateFlow Ltd.',
  description: 'Learn how EstateFlow Ltd. collects, uses, and protects your personal data in compliance with UK GDPR and the Data Protection Act 2018.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-slate-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-slate-300 text-lg">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
      <PrivacyContent />
    </main>
  );
}
