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
    <section className={`py-16 md:py-24 bg-gradient-to-br from-amber-50 to-white ${className}`}>
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Section */}
            <div className="text-center md:text-left">
              {leftSection.icon && (
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg mb-4">
                  <leftSection.icon className="w-6 h-6 text-amber-600" />
                </div>
              )}
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                {leftSection.title}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {leftSection.description}
              </p>
              <Link href={leftSection.buttonHref}>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white h-11">
                  {leftSection.buttonText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Right Section */}
            <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-slate-200 pt-8 md:pt-0 md:pl-12">
              {rightSection.icon && (
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mb-4">
                  <rightSection.icon className="w-6 h-6 text-emerald-600" />
                </div>
              )}
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                {rightSection.title}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {rightSection.description}
              </p>
              <Link href={rightSection.buttonHref}>
                <Button variant="outline" className="h-11">
                  {rightSection.buttonText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {footerText && (
          <p className="text-center text-slate-500 mt-8 text-sm">
            {footerText}
          </p>
        )}
      </div>
    </section>
  );
}
