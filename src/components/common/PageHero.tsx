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
    <section className={`relative ${bgClass} text-white py-20 md:py-28 ${className}`}>
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          {title}
        </h1>
        
        {description && (
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            {description}
          </p>
        )}

        {stats && stats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-amber-400">
                  {stat.value}
                </div>
                <div className="text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
