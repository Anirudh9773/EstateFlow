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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Common Questions</h2>
          <p className="text-slate-600">Quick answers to help you get started</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {faqs.map((faq, index) => (
            <Link
              key={index}
              href={faq.link}
              className="group bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-slate-900 font-medium mb-2 group-hover:text-amber-600 transition-colors">
                    {faq.question}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-amber-600">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
