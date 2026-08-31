import { Metadata } from 'next';
import TermsContent from '@/components/terms/TermsContent';

export const metadata: Metadata = {
  title: 'Terms of Service | EstateFlow Ltd.',
  description: 'Terms and conditions for using EstateFlow, the UK property matching platform connecting property owners with verified estate agents.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="bg-[#14141E] border-b border-white/10 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3 text-white">Terms of Service</h1>
          <p className="text-[#B8B5AE] text-base">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
      <TermsContent />
    </main>
  );
}
