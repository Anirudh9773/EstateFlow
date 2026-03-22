import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import SectionLabel from '@/components/ui/SectionLabel'
import { ROUTES } from '@/lib/constants'

export default function AgentCTABanner() {
  const features = [
    'Leads delivered to your inbox within minutes',
    'Only pay for leads in your postcode area',
    'Cancel or pause your plan at any time',
  ]

  const planFeatures = [
    'Up to 30 qualified leads per month',
    'Instant email and SMS notifications',
    'Detailed lead information and contact details',
    'Priority placement in search results',
  ]

  return (
    <section className="bg-navy py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          {/* Left column */}
          <div className="md:col-span-7">
            <SectionLabel className="text-gold/60">FOR REAL ESTATE AGENTS</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mt-3 mb-4">
              Grow your pipeline with qualified property leads
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Join 1,200+ agents who trust EstateFlow to deliver high-quality leads directly to their inbox.
            </p>

            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                  <span className="text-white/70 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column - Pricing card */}
          <div className="md:col-span-5">
            <Card className="bg-white/5 border-white/10 shadow-none p-8">
              <div className="text-gold text-[11px] uppercase tracking-widest mb-3">
                Most popular plan
              </div>
              <div className="text-white text-4xl font-semibold mb-2">£99/month</div>
              <div className="text-white/50 text-sm mb-6">
                Regional plan · Up to 30 leads/month
              </div>

              <Separator className="bg-white/10 my-6" />

              <ul className="space-y-3 mb-6">
                {planFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gold flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-white/70 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={ROUTES.pricing}>
                <Button className="w-full bg-gold text-navy hover:bg-gold/90 font-medium">
                  See all pricing plans
                </Button>
              </Link>

              <p className="text-white/30 text-[11px] text-center mt-4">
                No setup fee · Cancel anytime
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
