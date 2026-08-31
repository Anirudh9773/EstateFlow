import { LucideIcon } from 'lucide-react';
import { GoldDivider } from '@/components/ui';

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
  description: string;
}

interface StatsSectionProps {
  title: string;
  subtitle?: string;
  stats: Stat[];
  variant?: 'dark' | 'light';
  columns?: 2 | 3 | 4;
  className?: string;
}

export default function StatsSection({
  title,
  subtitle,
  stats,
  columns = 4,
  className = '',
}: StatsSectionProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className={`py-12 md:py-16 lg:py-24 bg-[#0d0d14] text-white border-y border-ef-border ${className}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#F5F3EE] mb-3 px-4 md:px-0">
            {title}
          </h2>
          <GoldDivider className="mx-auto mt-3 mb-4 sm:mb-6" />
          {subtitle && (
            <p className="text-base sm:text-lg text-[#B8B5AE] max-w-3xl mx-auto px-4 md:px-0">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`grid ${gridCols[columns]} gap-6 md:gap-8`}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center px-4 p-6 rounded-xl bg-[#1A1A24] border border-white/10 hover:border-gold/30 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gold/10 border border-gold/20 rounded-2xl mb-4 text-gold">
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-gold" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gold mb-2 font-heading">
                  {stat.value}
                </div>
                <div className="text-base font-semibold text-[#F5F3EE] mb-1.5">
                  {stat.label}
                </div>
                <p className="text-[#B8B5AE] text-xs sm:text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
