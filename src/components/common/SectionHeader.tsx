import { ReactNode } from 'react';
import { GoldDivider, SectionLabel } from '@/components/ui';

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
  children,
  className = '',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  const dividerAlign = align === 'center' ? 'mx-auto' : '';

  return (
    <div className={`mb-8 md:mb-12 ${alignClass} ${className}`}>
      {subtitle && (
        <div className={align === 'center' ? 'flex justify-center mb-2' : 'mb-2'}>
          <SectionLabel>{subtitle}</SectionLabel>
        </div>
      )}
      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#F5F3EE] mb-3 md:mb-4 px-4 md:px-0">
        {title}
      </h2>
      <GoldDivider className={`${dividerAlign} mt-2 mb-4 sm:mb-6`} />
      {description && (
        <p className="text-base sm:text-lg text-[#B8B5AE] max-w-3xl mx-auto leading-relaxed px-4 md:px-0">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
