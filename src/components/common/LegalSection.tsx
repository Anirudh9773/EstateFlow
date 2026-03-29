import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface LegalSectionProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function LegalSection({
  icon: Icon,
  title,
  children,
  className = '',
}: LegalSectionProps) {
  return (
    <section className={`mb-12 ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <Icon className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mt-0 mb-3">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}
