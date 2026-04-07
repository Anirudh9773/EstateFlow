'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SectionLabel, GoldDivider } from '@/components/ui'
import { CheckCircle, Star, Users, MapPin, TrendingUp, Shield, Phone, Mail, Zap, ArrowRight, Crown, Home, Briefcase } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string>('Professional')

  // Client Pricing Tiers (Free for clients)
  const clientPricing = [
    {
      category: 'Basic',
      description: 'Perfect for homeowners looking to sell a single property',
      price: 'Free',
      period: 'one-time',
      features: [
        'Submit one property listing',
        'Connect with up to 3 agents',
        'Basic property profile',
        'Email notifications',
        '7-day agent matching',
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
      question: 'Is EstateFlow really free for homeowners?',
      answer: 'Yes! Our Basic plan for homeowners is completely free. You can submit your property and connect with up to 3 verified agents at no cost.'
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
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-surface py-16 sm:py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <SectionLabel>Transparent Pricing</SectionLabel>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--color-navy)] leading-[1.1] mt-3">
              Simple, fair pricing for
              <br />
              everyone
            </h1>
            
            <GoldDivider className="mx-auto mt-4 sm:mt-5 mb-4 sm:mb-6" />
            
            <p className="text-[var(--color-text-secondary)] text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              Whether you're selling your home or growing your agency, we have a plan that fits your needs. 
              No hidden fees, no surprises - just transparent pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Client Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
              For Homeowners
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
              Choose the plan that works best for your property selling needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {clientPricing.map((tier, index) => {
              const Icon = tier.icon
              return (
                <Card 
                  key={tier.category}
                  className={`relative border-2 transition-all duration-300 hover:shadow-xl h-full flex flex-col ${
                    selectedPlan === tier.category
                      ? 'border-[var(--color-gold)] shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-[var(--color-gold)]/30'
                  }`}
                  onClick={() => setSelectedPlan(tier.category)}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-[var(--color-gold)] text-[var(--color-navy)] font-semibold px-3 py-1 shadow-md">
                        {tier.heading || "Most Popular"}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-[var(--color-gold)]/20">
                      <Icon className="w-6 h-6 text-[var(--color-gold)]" />
                    </div>
                    <CardTitle className="text-xl font-bold text-[var(--color-navy)]">
                      {tier.category}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 flex-1 flex flex-col">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[var(--color-navy)]">
                        {tier.price}
                      </div>
                      <div className="text-[var(--color-text-secondary)] text-sm">
                        {tier.period}
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-[var(--color-text-secondary)]">{feature}</span>
                        </div>
                      ))}
                      
                      {tier.notIncluded.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 opacity-50">
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-[var(--color-text-muted)] line-through">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className={`w-full mt-auto ${
                        selectedPlan === tier.category
                          ? "bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]/90" 
                          : tier.popular
                          ? "bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]/90"
                          : "bg-[var(--color-navy)] text-[var(--color-gold)] hover:bg-[var(--color-navy)]/90"
                      }`}
                    >
                      {tier.price === 'Custom' ? 'Contact Sales' : tier.price === 'Free' ? 'Get Started' : 'Choose Plan'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Agent Pricing Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
              For Real Estate Agents
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto mb-8">
              Grow your business with qualified leads and powerful tools
            </p>
            <Link href={ROUTES.pricing}>
              <Button className="bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]/90 px-6">
                View Detailed Agent Pricing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Agent Pricing Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agentPricingSummary.map((tier) => (
              <Link key={tier.category} href="/agent-pricing" className="block">
                <Card className="border border-[var(--color-ef-border)] bg-white p-6 hover:border-[var(--color-gold)]/30 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <h3 className="text-lg font-semibold text-[var(--color-navy)] mb-2 group-hover:text-[var(--color-gold)] transition-colors">{tier.category}</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm mb-4">{tier.description}</p>
                  <div className="text-2xl font-bold text-[var(--color-navy)] mb-1">{tier.price}</div>
                  <div className="text-[var(--color-text-secondary)] text-sm mb-4">{tier.period}</div>
                  <div className="text-xs text-[var(--color-text-muted)] mb-4">Commission: {tier.commission}</div>
                  <ul className="space-y-2 mb-4">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-[var(--color-text-secondary)] flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    {tier.popular && (
                      <Badge className="bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-xs">
                        Most Popular
                      </Badge>
                    )}
                    <ArrowRight className="w-4 h-4 text-[var(--color-text-secondary)] group-hover:text-[var(--color-gold)] transition-colors ml-auto" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-[var(--color-ef-border)] bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-[var(--color-navy)] mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--color-navy)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-gold)] mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of homeowners and agents who trust EstateFlow for their property needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]/90 px-8 py-3">
              Submit Your Property
            </Button>
            <Button variant="outline" className="border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 px-8 py-3">
              Join as an Agent
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
