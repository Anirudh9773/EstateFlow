import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  variant?: 'card' | 'simple';
  iconColor?: 'amber' | 'emerald' | 'blue';
  className?: string;
}

export default function FeatureGrid({
  features,
  columns = 3,
  variant = 'card',
  iconColor = 'amber',
  className = '',
}: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  const iconColors = {
    amber: {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
    },
    emerald: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-600',
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
    },
  };

  const cardClass = variant === 'card' 
    ? 'bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow' 
    : 'p-6';

  return (
    <div className={`grid ${gridCols[columns]} gap-6 md:gap-8 ${className}`}>
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className={cardClass}>
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 md:w-12 md:h-12 ${iconColors[iconColor].bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${iconColors[iconColor].text}`} />
                </div>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
