import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SectionLabel, GoldDivider, AvatarStack } from '@/components/ui'
import { ROUTES } from '@/lib/constants'

export default function Hero() {
  const propertyPills = [
    { postcode: 'SW1A 1AA', beds: '3 bed', price: '£485,000', rotation: 'rotate-1' },
    { postcode: 'M1 2JN', beds: '2 bed', price: '£220,000', rotation: '-rotate-1' },
    { postcode: 'E1 6RF', beds: '1 bed', price: '£310,000', rotation: 'rotate-2' },
    { postcode: 'BS1 4DJ', beds: '4 bed', price: '£595,000', rotation: '-rotate-2' },
    { postcode: 'LS1 1BA', beds: 'Studio', price: '£140,000', rotation: 'rotate-1' },
    { postcode: 'B1 1BB', beds: '5 bed', price: '£875,000', rotation: '-rotate-1' },
  ]

  return (
    <section className="bg-surface py-16 sm:py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left column */}
          <div className="md:col-span-7 text-center md:text-left">
            <SectionLabel>Trusted by 1,200+ agents across the UK</SectionLabel>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-navy leading-[1.1] mt-3">
              Where properties meet
              <br />
              the right agent
            </h1>
            
            <GoldDivider className="mt-4 sm:mt-5 mb-4 sm:mb-6 md:mx-0 mx-auto" />
            
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-xl md:mx-0 mx-auto">
              EstateFlow connects motivated sellers and buyers with verified local agents — fast, targeted, and fully managed.
            </p>
            
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link href={ROUTES.submitLead}>
                <Button
                  size="lg"
                  className="bg-navy text-gold hover:bg-navy/90 h-12 px-6 sm:px-8 text-sm font-medium w-full sm:w-auto"
                >
                  Submit your property
                </Button>
              </Link>
              <Link href={ROUTES.agents}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-navy text-navy hover:bg-navy hover:text-gold h-12 px-6 sm:px-8 text-sm font-medium w-full sm:w-auto"
                >
                  Browse agents →
                </Button>
              </Link>
            </div>
            
            <div className="mt-4 sm:mt-6 flex items-center gap-3 justify-center md:justify-start">
              <AvatarStack />
              <span className="text-text-muted text-xs sm:text-sm">Join 8,500+ happy property owners</span>
            </div>
          </div>

          {/* Right column - Property pills */}
          <div className="md:col-span-5 relative hidden md:block h-64 lg:h-80">
            <div className="absolute inset-0 grid grid-cols-2 gap-3 content-center">
              {propertyPills.map((pill, i) => (
                <div
                  key={i}
                  className={`bg-white border border-ef-border shadow-none rounded-md px-3 sm:px-4 py-2 sm:py-3 ${pill.rotation}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="font-mono text-xs text-text-muted">{pill.postcode}</span>
                  </div>
                  <div className="text-navy text-xs sm:text-sm font-medium">
                    {pill.beds} • {pill.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
