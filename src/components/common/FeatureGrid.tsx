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
  className = '',
}: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  const cardClass = variant === 'card' 
    ? 'bg-[#1A1A24] p-6 sm:p-8 rounded-xl border border-white/10 hover:border-gold/30 hover:shadow-lg transition-all duration-300' 
    : 'p-6';

  return (
    <div className={`grid ${gridCols[columns]} gap-6 md:gap-8 ${className}`}>
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className={cardClass}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                </div>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-[#F5F3EE] mb-2 font-heading">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-[#B8B5AE] leading-relaxed">
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
