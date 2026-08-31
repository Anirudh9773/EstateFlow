import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTASection {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  buttonVariant?: 'primary' | 'secondary';
  icon?: LucideIcon;
}

interface DualCTAProps {
  leftSection: CTASection;
  rightSection: CTASection;
  footerText?: string;
  className?: string;
}

export default function DualCTA({
  leftSection,
  rightSection,
  footerText,
  className = '',
}: DualCTAProps) {
  return (
    <section className={`py-12 md:py-16 lg:py-24 bg-surface border-y border-ef-border ${className}`}>
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-[#1A1A24] rounded-xl md:rounded-2xl border border-white/10 shadow-2xl p-6 md:p-8 lg:p-12">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {/* Left Section */}
            <div className="text-center md:text-left">
              {leftSection.icon && (
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gold/10 border border-gold/20 rounded-xl mb-4 text-gold">
                  <leftSection.icon className="w-6 h-6 text-gold" />
                </div>
              )}
              <h3 className="font-heading text-xl md:text-2xl lg:text-3xl font-bold text-[#F5F3EE] mb-3 md:mb-4">
                {leftSection.title}
              </h3>
              <p className="text-sm md:text-base text-[#B8B5AE] mb-5 md:mb-6 leading-relaxed">
                {leftSection.description}
              </p>
              <Link href={leftSection.buttonHref}>
                <Button className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold h-10 md:h-11 w-full sm:w-auto cursor-pointer">
                  {leftSection.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
            </div>

            {/* Right Section */}
            <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 lg:pl-12">
              {rightSection.icon && (
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gold/10 border border-gold/20 rounded-xl mb-4 text-gold">
                  <rightSection.icon className="w-6 h-6 text-gold" />
                </div>
              )}
              <h3 className="font-heading text-xl md:text-2xl lg:text-3xl font-bold text-[#F5F3EE] mb-3 md:mb-4">
                {rightSection.title}
              </h3>
              <p className="text-sm md:text-base text-[#B8B5AE] mb-5 md:mb-6 leading-relaxed">
                {rightSection.description}
              </p>
              <Link href={rightSection.buttonHref}>
                <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 font-semibold h-10 md:h-11 w-full sm:w-auto cursor-pointer">
                  {rightSection.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {footerText && (
          <p className="text-center text-text-muted mt-6 md:mt-8 text-xs md:text-sm px-4">
            {footerText}
          </p>
        )}
      </div>
    </section>
  );
}
