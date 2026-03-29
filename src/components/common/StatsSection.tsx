import { LucideIcon } from 'lucide-react';

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
  variant = 'dark',
  columns = 4,
  className = '',
}: StatsSectionProps) {
  const isDark = variant === 'dark';
  const bgClass = isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900';
  const subtitleClass = isDark ? 'text-slate-300' : 'text-slate-600';
  const valueClass = isDark ? 'text-amber-400' : 'text-amber-600';
  const descClass = isDark ? 'text-slate-400' : 'text-slate-600';
  const iconBgClass = isDark ? 'bg-amber-500/10' : 'bg-amber-100';
  const iconClass = isDark ? 'text-amber-400' : 'text-amber-600';

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className={`py-12 md:py-16 lg:py-24 ${bgClass} ${className}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 px-4 md:px-0">
            {title}
          </h2>
          <div className="w-16 md:w-20 h-1 bg-amber-500 mx-auto mb-4 md:mb-6"></div>
          {subtitle && (
            <p className={`text-lg md:text-xl ${subtitleClass} max-w-3xl mx-auto px-4 md:px-0`}>
              {subtitle}
            </p>
          )}
        </div>

        <div className={`grid ${gridCols[columns]} gap-6 md:gap-8`}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center px-4">
                <div className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 ${iconBgClass} rounded-full mb-3 md:mb-4`}>
                  <Icon className={`w-7 h-7 md:w-8 md:h-8 ${iconClass}`} />
                </div>
                <div className={`text-3xl md:text-4xl lg:text-5xl font-bold ${valueClass} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-base md:text-lg font-semibold mb-2">
                  {stat.label}
                </div>
                <p className={`${descClass} text-xs md:text-sm`}>
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
