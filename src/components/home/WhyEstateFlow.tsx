import { SectionLabel, GoldDivider } from '@/components/ui'

export default function WhyEstateFlow() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Verified agents only',
      description: 'Every agent on our platform is thoroughly vetted, licensed, and verified before they can receive leads.',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Matched in under 2 minutes',
      description: 'Our intelligent matching algorithm connects you with the most suitable agents in your area instantly.',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Hyper-local coverage',
      description: 'We work with agents who specialise in your specific postcode area and understand your local market.',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Your data stays private',
      description: 'We never sell your information. Your details are only shared with agents you choose to connect with.',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: 'Rated by real sellers',
      description: 'Read genuine reviews from property owners who have worked with our agents before making your choice.',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: 'Affordable pricing',
      description: 'Transparent pricing with no hidden fees. Choose the plan that fits your needs and only pay for what you use.',
    },
  ]

  return (
    <section className="bg-[#0d0d14] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <SectionLabel>WHY ESTATEFLOW</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#F5F3EE] mt-3 font-heading">
            Built for the modern property market
          </h2>
          <GoldDivider className="mx-auto mt-5" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10 mt-12">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-[#F5F3EE] font-semibold mt-1 mb-2 text-sm sm:text-base">{feature.title}</h3>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed max-w-[200px] mx-auto">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
