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
    <section className={`mb-10 md:mb-12 ${className}`}>
      <div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4">
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-amber-500 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-0 mb-2 md:mb-3">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}
