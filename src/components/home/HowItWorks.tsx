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
    <section id="how-it-works" className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-navy mt-3">
            How EstateFlow works
          </h2>
          <GoldDivider className="mx-auto mt-4 sm:mt-5 mb-3" />
          <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg">
            Three simple steps to connect your property with the perfect agent
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12">
          {steps.map((step, index) => (
            <Card key={step.number} className="border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 p-6 sm:p-8 h-full">
              <div className="w-12 h-12 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mb-6">
                <span className="text-gold font-semibold text-sm">{step.number}</span>
              </div>
              <h3 className="font-semibold text-navy text-lg mb-2">{step.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
