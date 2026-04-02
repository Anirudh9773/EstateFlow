import { ReactNode } from 'react';

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
  variant = 'gradient',
  className = '',
}: PageHeroProps) {
  const bgClass = variant === 'gradient' 
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
    : 'bg-slate-900';

  return (
    <section className={`relative ${bgClass} text-white py-12 sm:py-16 md:py-20 lg:py-28 ${className}`}>
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 px-4">
          {title}
        </h1>
        
        {description && (
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-4 sm:mb-6 md:mb-8 leading-relaxed px-4">
            {description}
          </p>
        )}

        {stats && stats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-center px-4">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-400">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
