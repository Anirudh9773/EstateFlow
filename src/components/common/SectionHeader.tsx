import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'left' | 'center';
  dividerColor?: 'amber' | 'emerald' | 'slate';
  children?: ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  description,
  align = 'center',
  dividerColor = 'amber',
  children,
  className = '',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  const dividerAlign = align === 'center' ? 'mx-auto' : '';
  
  const dividerColors = {
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    slate: 'bg-slate-500',
  };

  return (
    <div className={`mb-8 md:mb-12 ${alignClass} ${className}`}>
      {subtitle && (
        <p className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {subtitle}
        </p>
      )}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 md:mb-4 px-4 md:px-0">
        {title}
      </h2>
      <div className={`w-16 md:w-20 h-1 ${dividerColors[dividerColor]} ${dividerAlign} mb-4 md:mb-6`}></div>
      {description && (
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4 md:px-0">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
