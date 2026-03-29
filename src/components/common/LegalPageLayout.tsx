import { ReactNode } from 'react';

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
    <main className="min-h-screen bg-white">
      <div className="bg-slate-900 text-white py-10 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">{title}</h1>
          <p className="text-sm md:text-base lg:text-lg text-slate-300">
            Last updated: {lastUpdated.toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-4xl py-10 md:py-12 lg:py-16">
        <div className="prose prose-slate max-w-none">
          {children}
        </div>
      </div>
    </main>
  );
}
