import Link from 'next/link';
import { ArrowRight, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How do I submit my property?',
    link: '/#how-it-works',
  },
  {
    question: 'How do agents get verified?',
    link: '/agent-pricing',
  },
  {
    question: 'Is EstateFlow free for sellers?',
    link: '/pricing',
  },
];

export default function FAQQuickLinks() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-3">Common Questions</h2>
          <p className="text-sm md:text-base text-slate-600">Quick answers to help you get started</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {faqs.map((faq, index) => (
            <Link
              key={index}
              href={faq.link}
              className="group bg-slate-50 rounded-xl p-5 md:p-6 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm md:text-base text-slate-900 font-medium mb-2 group-hover:text-amber-600 transition-colors">
                    {faq.question}
                  </p>
                  <div className="flex items-center gap-1 text-xs md:text-sm text-amber-600">
                    <span>Learn more</span>
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
