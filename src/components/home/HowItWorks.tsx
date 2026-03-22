import { Card } from '@/components/ui/card'
import { SectionLabel, GoldDivider } from '@/components/ui'

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Describe your property',
      description: 'Tell us your postcode, property type, number of bedrooms, estimated value, and your preferred timeline.',
    },
    {
      number: '02',
      title: 'We match you instantly',
      description: 'Our matching engine finds verified agents covering your area and ranks them by expertise and availability.',
    },
    {
      number: '03',
      title: 'Agents reach out to you',
      description: 'Matched agents contact you directly — no middleman, no chasing. You choose who to work with.',
    },
  ]

  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-semibold text-navy mt-3">
            How EstateFlow works
          </h2>
          <GoldDivider className="mx-auto mt-5 mb-3" />
          <p className="text-text-secondary max-w-2xl mx-auto">
            Three simple steps to connect your property with the perfect agent
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <Card className="border-ef-border shadow-none p-8 h-full">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-6">
                  <span className="text-gold font-semibold text-sm">{step.number}</span>
                </div>
                <h3 className="font-semibold text-navy text-lg mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
              </Card>
              
              {/* Arrow between cards (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <svg className="w-5 h-5 text-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
