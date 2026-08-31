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
      <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
        <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4 md:w-5 md:h-5 text-gold" />
        </div>
        <div className="flex-1">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-[#F5F3EE] mt-0 mb-2 md:mb-3">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}
