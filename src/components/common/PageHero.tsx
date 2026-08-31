import { ReactNode } from 'react';
import { GoldDivider } from '@/components/ui';

interface PageHeroProps {
  title: string;
  description?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  children?: ReactNode;
  variant?: 'default' | 'gradient';
  className?: string;
}

export default function PageHero({
  title,
  description,
  stats,
  children,
  className = '',
}: PageHeroProps) {
  return (
    <section className={`relative bg-[#0d0d14] text-white py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden border-b border-ef-border ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F3EE] mb-4">
          {title}
        </h1>
        
        <GoldDivider className="mx-auto mt-4 mb-5" />
        
        {description && (
          <p className="text-base sm:text-lg md:text-xl text-[#B8B5AE] mb-8 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
        )}

        {stats && stats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-14 text-center pt-2">
            {stats.map((stat, index) => (
              <div key={index} className="p-2">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-[#B8B5AE] mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
