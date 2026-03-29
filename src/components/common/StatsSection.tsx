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
    <section className={`py-16 md:py-24 ${bgClass} ${className}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mb-6"></div>
          {subtitle && (
            <p className={`text-xl ${subtitleClass} max-w-3xl mx-auto`}>
              {subtitle}
            </p>
          )}
        </div>

        <div className={`grid ${gridCols[columns]} gap-8`}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${iconBgClass} rounded-full mb-4`}>
                  <Icon className={`w-8 h-8 ${iconClass}`} />
                </div>
                <div className={`text-4xl md:text-5xl font-bold ${valueClass} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-lg font-semibold mb-2">
                  {stat.label}
                </div>
                <p className={`${descClass} text-sm`}>
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
