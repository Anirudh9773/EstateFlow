import { ReactNode } from 'react';

interface ContentSectionProps {
  children: ReactNode;
  variant?: 'white' | 'gray' | 'navy';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ContentSection({
  children,
  variant = 'white',
  maxWidth = 'lg',
  padding = 'md',
  className = '',
}: ContentSectionProps) {
  const bgColors = {
    white: 'bg-white',
    gray: 'bg-slate-50',
    navy: 'bg-slate-900 text-white',
  };

  const maxWidths = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddings = {
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-24',
    lg: 'py-20 md:py-32',
  };

  return (
    <section className={`${bgColors[variant]} ${paddings[padding]} ${className}`}>
      <div className={`container mx-auto px-4 ${maxWidths[maxWidth]}`}>
        {children}
      </div>
    </section>
  );
}
