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
      <div className="bg-slate-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-slate-300 text-lg">
            Last updated: {lastUpdated.toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-4xl py-12 md:py-16">
        <div className="prose prose-slate max-w-none">
          {children}
        </div>
      </div>
    </main>
  );
}
