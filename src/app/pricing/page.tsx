'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SectionLabel, GoldDivider } from '@/components/ui'
import { CheckCircle, Star, Users, MapPin, TrendingUp, Shield, Phone, Mail, Zap, ArrowRight, Crown, Home, Briefcase } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { useUser } from '@/lib/auth/useUser'

export default function PricingPage() {
  const { user } = useUser()
  const userType = user?.user_metadata?.user_type || 'client'
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string>('Professional')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  // Client Pricing Tiers
  const clientPricing = [
    {
      category: 'Basic',
      description: 'Perfect for homeowners looking to sell a single property',
      price: '£49',
      period: 'one-time',
      features: [
        'Submit one property listing',
        'Connect with up to 3 agents',
        'Basic property profile',
        'Email notifications',
        '7-day agent matching',
        'Basic market insights',
        'Standard support'
      ],
      notIncluded: [
        'Priority placement',
        'Featured listing',
        'Advanced analytics',
        'Dedicated support'
      ],
      popular: false,
      icon: Home
    },
    {
      category: 'Professional',
      description: 'Ideal for serious sellers with multiple properties or investment needs',
      price: '£149',
      period: 'one-time',
      popular: true,
      heading: 'Most Popular',
      features: [
        'Submit up to 5 properties',
        'Connect with unlimited agents',
        'Enhanced property profiles with photos',
        'Priority agent matching',
        'Featured property placement',
        'Advanced market analytics',
        'Dedicated account manager',
        '30-day money-back guarantee'
      ],
      notIncluded: [
        'White-label solutions',
        'API access',
        'Custom branding'
      ],
      icon: Crown
    },
    {
      category: 'Enterprise',
      description: 'For property developers, portfolio managers, and corporate clients',
      price: 'Custom',
      period: 'contact us',
      features: [
        'Unlimited property submissions',
        'White-label platform options',
        'API access for integrations',
        'Custom branding solutions',
        'Dedicated account team',
        'Priority 24/7 support',
        'Custom reporting & analytics',
        'Bulk processing capabilities'
      ],
      notIncluded: [],
      popular: false,
      icon: Briefcase
    }
  ]

  // Agent Pricing Summary (links to detailed page)
  const agentPricingSummary = [
    {
      category: 'Local Agent',
      description: 'Serve specific postcodes and neighborhoods',
      price: '£29',
      period: 'per month',
      commission: '1.2% - 2.0%',
      features: ['Up to 5 postcodes', '20 listings', 'Email support'],
      popular: false
    },
    {
      category: 'City Agent',
      description: 'Cover entire cities and metropolitan areas',
      price: '£79',
      period: 'per month',
      commission: '1.8% - 2.5%',
      features: ['City coverage', '50 listings', 'Priority support'],
      popular: true
    },
    {
      category: 'State Agent',
      description: 'Regional specialists serving multiple counties',
      price: '£149',
      period: 'per month',
      commission: '2.3% - 2.8%',
      features: ['Multi-county', '100 listings', 'Dedicated manager'],
      popular: false
    },
    {
      category: 'National Agent',
      description: 'UK-wide coverage for nationwide agents',
      price: '£299',
      period: 'per month',
      commission: '3.0% - 4.0%',
      features: ['Nationwide', 'Unlimited listings', 'Full support'],
      popular: false
    }
  ]

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and bank transfers. All payments are processed securely through our encrypted payment gateway.'
    },
    {
      question: 'How do agents get paid?',
      answer: 'Agents pay a monthly subscription fee based on their coverage area. They earn commission from successful property transactions as agreed with their clients.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, all subscriptions can be cancelled monthly. We also offer annual plans with 20% savings for longer commitments.'
    },
    {
      question: 'What makes EstateFlow different from other platforms?',
      answer: 'We focus on quality over quantity. All agents are verified, we provide intelligent matching, and offer tools for both homeowners and agents to streamline the process.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Our Professional plan comes with a 30-day money-back guarantee. Agent subscriptions are prorated if cancelled mid-month.'
    },
    {
      question: 'How quickly will I hear from agents?',
      answer: 'Most homeowners receive responses from verified agents within 24-48 hours. Professional plan members get priority matching and faster responses.'
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="bg-[#0d0d14] py-16 sm:py-20 md:py-28 relative overflow-hidden border-b border-ef-border">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl relative z-10 mx-auto px-4 sm:px-6">
          <div className="text-center">
            <SectionLabel>Transparent Pricing</SectionLabel>
            
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F3EE] leading-[1.15] mt-3">
              Simple, fair pricing for
              <br />
              everyone
            </h1>
            
            <GoldDivider className="mx-auto mt-4 sm:mt-5 mb-4 sm:mb-6" />
            
            <p className="text-[#B8B5AE] text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              Whether you're selling your home or growing your agency, we have a plan that fits your needs. 
              No hidden fees, no surprises - just transparent pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Client Pricing Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
              For Homeowners
            </h2>
            <p className="text-[#B8B5AE] text-base sm:text-lg max-w-2xl mx-auto">
              Choose the plan that works best for your property selling needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 pt-4">
            {clientPricing.map((tier) => {
              const Icon = tier.icon
              const isSelected = selectedPlan === tier.category
              return (
                <Card 
                  key={tier.category}
                  className={`relative transition-all duration-300 h-full flex flex-col bg-[#1A1A24] cursor-pointer rounded-2xl overflow-visible ${
                    isSelected
                      ? 'border-2 border-gold shadow-2xl shadow-gold/10 scale-105 bg-[#1E1E2C]' 
                      : 'border border-white/10 hover:border-gold/40'
                  }`}
                  onClick={() => setSelectedPlan(tier.category)}
                >
                  {tier.popular && (
                    <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-20">
                      <Badge className="bg-gold text-[#0d0d14] font-bold px-3.5 py-1 shadow-lg text-xs tracking-wide uppercase">
                        {tier.heading || "Most Popular"}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-gold/10 border border-gold/20">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <CardTitle className="font-heading text-2xl font-bold text-white">
                      {tier.category}
                    </CardTitle>
                    <CardDescription className="text-sm text-text-secondary mt-1">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 flex-1 flex flex-col p-6 pt-0">
                    <div className="text-center pb-4 border-b border-white/10">
                      <div className="font-heading text-4xl font-bold text-white">
                        {tier.price}
                      </div>
                      <div className="text-text-muted text-xs sm:text-sm mt-1 uppercase tracking-wider font-medium">
                        {tier.period}
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-[#B8B5AE]">{feature}</span>
                        </div>
                      ))}
                      
                      {tier.notIncluded.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 opacity-40">
                          <div className="w-4 h-4 border border-white/30 rounded-full flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-text-muted line-through">{feature}</span>
                        </div>
                      ))}
                    </div>

                     <Button 
                      render={
                        tier.price === 'Custom' 
                          ? <Link href="/contact" /> 
                          : <Link href={`/checkout?plan=${encodeURIComponent(tier.category)}&price=${encodeURIComponent(tier.price)}&cycle=${billingCycle}`} />
                      }
                      nativeButton={false}
                      className={`w-full mt-auto cursor-pointer font-semibold py-3 h-11 rounded-xl transition-all ${
                        isSelected
                          ? "bg-gold text-[#0d0d14] hover:bg-gold/90" 
                          : "bg-white/10 text-white hover:bg-gold hover:text-[#0d0d14]"
                      }`}
                    >
                      {tier.price === 'Custom' ? 'Contact Sales' : 'Choose Plan'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Agent Pricing Section */}
      <section className="py-20 bg-surface border-y border-ef-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
              For Real Estate Agents
            </h2>
            <p className="text-[#B8B5AE] text-base sm:text-lg max-w-2xl mx-auto mb-8">
              Grow your business with qualified leads and powerful tools
            </p>
            <Link href="/agent-pricing">
              <Button className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold px-8 py-3.5 rounded-xl cursor-pointer">
                View Detailed Agent Pricing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Agent Pricing Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {agentPricingSummary.map((tier) => (
              <Link key={tier.category} href={`/checkout?plan=${encodeURIComponent(tier.category)}&price=${encodeURIComponent(tier.price)}&cycle=monthly`} className="block">
                <Card className="border border-white/10 bg-[#1A1A24] p-6 hover:border-gold/40 hover:shadow-xl transition-all duration-300 cursor-pointer group rounded-xl">
                  <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors">{tier.category}</h3>
                  <p className="text-text-secondary text-xs sm:text-sm mb-4">{tier.description}</p>
                  <div className="font-heading text-3xl font-bold text-gold mb-1">{tier.price}</div>
                  <div className="text-text-muted text-xs mb-3">{tier.period}</div>
                  <div className="text-xs text-text-secondary bg-white/5 py-1 px-2 rounded mb-4 inline-block">Commission: {tier.commission}</div>
                  <ul className="space-y-2 mb-4">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-[#B8B5AE] flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    {tier.popular && (
                      <Badge className="bg-gold/15 text-gold border border-gold/25 text-[10px]">
                        Most Popular
                      </Badge>
                    )}
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-gold transition-colors ml-auto" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-[#B8B5AE] text-base sm:text-lg">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <Card 
                  key={index} 
                  className="border border-white/10 bg-[#1A1A24] overflow-hidden transition-all duration-200 rounded-xl"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-medium text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="text-base sm:text-lg">{faq.question}</span>
                    <span className="ml-4 shrink-0 text-gold text-xl font-bold transition-transform duration-200">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[300px] border-t border-white/10' : 'max-h-0 overflow-hidden'
                    }`}
                  >
                    <p className="p-5 sm:p-6 text-[#B8B5AE] leading-relaxed text-sm sm:text-base bg-white/[0.02]">
                      {faq.answer}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#111118] text-white py-16 border-t border-ef-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gold mb-4">
            Ready to get started?
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of homeowners and agents who trust EstateFlow for their property needs.
          </p>
          {user && userType === 'agent' ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/agent-dashboard">
                <Button className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold px-8 py-3.5 rounded-xl cursor-pointer">
                  Agent Dashboard
                </Button>
              </Link>
              <Link href="/agent-pricing">
                <Button 
                  variant="outline" 
                  className="border-gold/40 text-gold hover:bg-gold/10 font-semibold px-8 py-3.5 rounded-xl cursor-pointer"
                >
                  View Agent Pricing
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/submit-property">
                <Button className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold px-8 py-3.5 rounded-xl cursor-pointer">
                  Submit Your Property
                </Button>
              </Link>
              <Link href="/sign-up/agent">
                <Button 
                  variant="outline" 
                  className="border-gold/40 text-gold hover:bg-gold/10 font-semibold px-8 py-3.5 rounded-xl cursor-pointer"
                >
                  Join as an Agent
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
