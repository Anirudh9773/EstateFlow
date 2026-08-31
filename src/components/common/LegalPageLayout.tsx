import { ReactNode } from 'react';
import { GoldDivider } from '@/components/ui';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: Date;
  children: ReactNode;
}

export default function LegalPageLayout({
  title,
  lastUpdated = new Date(),
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="bg-[#0d0d14] text-white py-12 md:py-16 border-b border-ef-border relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center md:text-left">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F3EE] mb-2">
            {title}
          </h1>
          <GoldDivider className="mt-3 mb-4 md:mx-0" />
          <p className="text-xs sm:text-sm text-text-muted">
            Last updated: {lastUpdated.toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-4xl py-12 md:py-16">
        <div className="prose prose-invert max-w-none text-[#B8B5AE] prose-headings:text-[#F5F3EE] prose-headings:font-heading prose-a:text-gold prose-strong:text-white prose-p:leading-relaxed">
          {children}
        </div>
      </div>
    </main>
  );
}
