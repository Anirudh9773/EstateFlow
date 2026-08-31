import { Metadata } from 'next';
import PrivacyContent from '@/components/privacy/PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy | EstateFlow Ltd.',
  description: 'Learn how EstateFlow Ltd. collects, uses, and protects your personal data in compliance with UK GDPR and the Data Protection Act 2018.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="bg-[#14141E] border-b border-white/10 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3 text-white">Privacy Policy</h1>
          <p className="text-[#B8B5AE] text-base">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
      <PrivacyContent />
    </main>
  );
}
