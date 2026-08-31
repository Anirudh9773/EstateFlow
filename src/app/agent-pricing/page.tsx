"use client"

import { useState } from "react"
import Link from "next/link"
import { useUser } from "@/lib/auth/useUser"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Users, MapPin, TrendingUp, Shield, Phone, Mail, Zap } from "lucide-react"

const pricingTiers = [
  {
    category: "Local Agent",
    description: "Perfect for agents serving specific postcodes and neighborhoods",
    price: "£29",
    period: "per month",
    commission: "1.2% - 2.0%",
    popular: false,
    features: [
      "Serve up to 5 postcodes",
      "Basic profile with photo",
      "Up to 20 active listings",
      "Email support",
      "Monthly performance reports",
      "Basic analytics dashboard",
      "Standard response time tracking",
      "Local area visibility"
    ],
    notIncluded: [
      "Premium placement",
      "Advanced analytics",
      "Priority support",
      "Multi-area coverage"
    ],
    color: "border-gold-600",
    badgeColor: "bg-green-100 text-green-800"
  },
  {
    category: "City Agent",
    description: "Ideal for agents covering entire cities and metropolitan areas",
    price: "£79",
    period: "per month",
    commission: "1.8% - 2.5%",
    popular: true,
    heading: "Most Purchased",
    features: [
      "Serve entire city coverage",
      "Enhanced profile with video",
      "Up to 50 active listings",
      "Priority email & phone support",
      "Weekly performance reports",
      "Advanced analytics dashboard",
      "Real-time response tracking",
      "City-wide visibility boost",
      "Featured placement in search",
      "Lead qualification tools"
    ],
    notIncluded: [
      "Multi-city coverage",
      "Dedicated account manager",
      "Custom marketing materials"
    ],
    color: "border-gold-600",
    badgeColor: "bg-blue-100 text-blue-800"
  },
  {
    category: "State Agent",
    description: "Best for regional specialists serving multiple counties and states",
    price: "£149",
    period: "per month",
    commission: "2.3% - 2.8%",
    popular: false,
    features: [
      "Serve multiple counties/states",
      "Premium profile with virtual tours",
      "Up to 100 active listings",
      "Dedicated account manager",
      "Daily performance reports",
      "Enterprise analytics dashboard",
      "AI-powered response optimization",
      "Regional visibility campaigns",
      "Premium placement in search",
      "Advanced lead qualification",
      "Custom marketing materials",
      "API access for integrations"
    ],
    notIncluded: [
      "National coverage",
      "White-label solutions",
      "Custom branding"
    ],
    color: "border-gold-600",
    badgeColor: "bg-purple-100 text-purple-800"
  },
  {
    category: "National Agent",
    description: "Ultimate solution for nationwide agents with UK-wide coverage",
    price: "£299",
    period: "per month",
    commission: "3.0% - 4.0%",
    popular: false,
    features: [
      "Nationwide UK coverage",
      "Elite profile with custom branding",
      "Unlimited active listings",
      "Dedicated account manager + team",
      "Real-time performance monitoring",
      "Custom analytics & insights",
      "AI-powered lead generation",
      "National marketing campaigns",
      "Premium placement everywhere",
      "Enterprise lead management",
      "Custom marketing materials",
      "Full API access & integrations",
      "White-label solutions",
      "Custom mobile app",
      "Priority 24/7 support"
    ],
    notIncluded: [],
    color: "border-gold-600",
    badgeColor: "bg-gold-100 text-gold-800"
  }
]

const comparisonData = [
  {
    feature: "Coverage Area",
    local: "Up to 5 postcodes",
    city: "Entire city",
    state: "Multiple counties",
    national: "Nationwide UK"
  },
  {
    feature: "Active Listings",
    local: "20",
    city: "50",
    state: "100",
    national: "Unlimited"
  },
  {
    feature: "Support Level",
    local: "Email only",
    city: "Email & phone",
    state: "Dedicated manager",
    national: "Manager + 24/7"
  },
  {
    feature: "Analytics",
    local: "Basic dashboard",
    city: "Advanced analytics",
    state: "Enterprise insights",
    national: "Custom solutions"
  },
  {
    feature: "Marketing",
    local: "Standard visibility",
    city: "Featured placement",
    state: "Regional campaigns",
    national: "National campaigns"
  },
  {
    feature: "Commission Rate",
    local: "1.2% - 2.0%",
    city: "1.8% - 2.5%",
    state: "2.3% - 2.8%",
    national: "3.0% - 4.0%"
  }
]

const faqs = [
  {
    question: 'How do I receive leads?',
    answer: 'When a client submits their property details matching your coverage area and tier, you will receive an email notification and the lead will appear instantly on your Agent Dashboard.'
  },
  {
    question: 'Can I change my postcode coverage area?',
    answer: 'Yes! You can update your postcodes or regional areas at any time directly through your account settings in the dashboard.'
  },
  {
    question: 'Is there a contract commitment?',
    answer: 'No, all plans are billed month-to-month and you can cancel, upgrade, or downgrade your subscription at any time.'
  },
  {
    question: 'What are the commission rates?',
    answer: 'You retain your standard commission rates as agreed directly with clients. EstateFlow does not take a percentage of your commission or charge referral fees.'
  },
  {
    question: 'How does the visibility boost work?',
    answer: 'City, State, and National plans feature higher ranking search priority, custom profile options, and advertising campaigns targeting active sellers in your area.'
  }
]

export default function AgentPricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<string>("City Agent")
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const { user } = useUser()

  const handleSelectPlan = (tierCategory: string = "City Agent", tierPrice: string = "£79") => (e: React.MouseEvent) => {
    e.preventDefault()
    const checkoutUrl = `/checkout?plan=${encodeURIComponent(tierCategory)}&price=${encodeURIComponent(tierPrice)}&cycle=${billingCycle}`
    window.location.href = checkoutUrl
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F3EE] mb-4">
            Agent Pricing Plans
          </h1>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your agency size and coverage area. 
            Flexible pricing designed to grow with your business.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#1E1E28] border border-white/15 rounded-xl p-1 flex shadow-md">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all text-sm cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-gold text-[#0d0d14] font-bold shadow"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all text-sm cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-gold text-[#0d0d14] font-bold shadow"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-[#0d0d14]/20 font-bold px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 pt-4">
          {pricingTiers.map((tier) => {
            const isSelected = selectedPlan === tier.category
            return (
              <Card 
                key={tier.category}
                className={`relative transition-all duration-300 h-full flex flex-col bg-[#1A1A24] cursor-pointer rounded-2xl overflow-visible ${
                  isSelected
                    ? `border-2 border-gold shadow-2xl shadow-gold/10 scale-105 bg-[#1E1E2C]` 
                    : 'border border-white/10 hover:border-gold/40'
                }`}
                onClick={() => setSelectedPlan(tier.category)}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-gold text-[#0d0d14] font-bold px-3.5 py-1 shadow-md text-xs tracking-wide uppercase">
                      {tier.heading || "Most Purchased"}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4 pt-8">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-gold/10 border border-gold/20">
                    {tier.category === "Local Agent" ? <MapPin className="w-6 h-6 text-gold" /> :
                     tier.category === "City Agent" ? <Users className="w-6 h-6 text-gold" /> :
                     tier.category === "State Agent" ? <TrendingUp className="w-6 h-6 text-gold" /> :
                     <Star className="w-6 h-6 text-gold" />}
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
                      {billingCycle === "annual" 
                        ? `£${Math.round(parseInt(tier.price.replace('£', '')) * 0.8)}`
                        : tier.price
                      }
                    </div>
                    <div className="text-text-muted text-xs sm:text-sm mt-1 uppercase tracking-wider font-medium">
                      {tier.period}
                      {billingCycle === "annual" && (
                        <span className="text-emerald-400 font-semibold ml-1">
                          (Save 20%)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-secondary bg-white/5 py-1 px-2.5 rounded-lg mt-3 inline-block">
                      Commission: {tier.commission}
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
                    render={<Link href={`/checkout?plan=${encodeURIComponent(tier.category)}&price=${encodeURIComponent(tier.price)}&cycle=${billingCycle}`} onClick={handleSelectPlan(tier.category, tier.price)} />}
                    nativeButton={false}
                    className={`w-full mt-auto cursor-pointer font-semibold py-3 h-11 rounded-xl transition-all ${
                      isSelected
                        ? "bg-gold text-[#0d0d14] hover:bg-gold/90" 
                        : "bg-white/10 text-white hover:bg-gold hover:text-[#0d0d14]"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">Compare All Plans</h2>
            <p className="text-text-secondary">
              Side-by-side comparison of all pricing tiers
            </p>
          </div>
          
          <Card className="overflow-hidden bg-[#1A1A24] border border-white/10 rounded-2xl shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#14141E] text-gold border-b border-white/10">
                    <th className="text-left p-4 sm:p-5 font-heading font-semibold text-base">Feature</th>
                    <th className="text-center p-4 sm:p-5 font-heading font-semibold text-base">Local Agent</th>
                    <th className="text-center p-4 sm:p-5 font-heading font-semibold text-base">City Agent</th>
                    <th className="text-center p-4 sm:p-5 font-heading font-semibold text-base">State Agent</th>
                    <th className="text-center p-4 sm:p-5 font-heading font-semibold text-base">National Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 sm:p-5 font-medium text-white">{row.feature}</td>
                      <td className="p-4 sm:p-5 text-center text-[#B8B5AE]">{row.local}</td>
                      <td className="p-4 sm:p-5 text-center text-[#B8B5AE]">{row.city}</td>
                      <td className="p-4 sm:p-5 text-center text-[#B8B5AE]">{row.state}</td>
                      <td className="p-4 sm:p-5 text-center text-[#B8B5AE]">{row.national}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-[#1A1A24] border border-white/10 text-white p-6 sm:p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2 text-white">Quick Setup</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Get started in minutes with our streamlined onboarding process. 
              No long-term contracts required.
            </p>
          </Card>
          
          <Card className="bg-[#1A1A24] border border-white/10 text-white p-6 sm:p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2 text-white">Secure Platform</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Bank-level security for your data and client information. 
              GDPR compliant and fully insured.
            </p>
          </Card>
          
          <Card className="bg-[#1A1A24] border border-white/10 text-white p-6 sm:p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-2 text-white">24/7 Support</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Round-the-clock support for all plans. 
              Get help when you need it from our expert team.
            </p>
          </Card>
        </div>

        {/* FAQ Section */}
        <section className="py-12 bg-surface rounded-2xl border border-ef-border mb-16 p-6 sm:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl font-bold text-white mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-text-secondary text-base sm:text-lg">
                Everything you need to know about growing your business with EstateFlow
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
        <div className="text-center p-8 sm:p-12 bg-[#14141E] border border-gold/30 text-white rounded-2xl">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4 text-gold">Ready to Grow Your Agency?</h2>
          <p className="mb-8 text-text-secondary max-w-2xl mx-auto text-base sm:text-lg">
            Join thousands of successful agents who trust EstateFlow to grow their business 
            and connect with qualified leads.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/checkout?plan=City%20Agent&price=%C2%A379&cycle=${billingCycle}`}>
              <Button 
                onClick={handleSelectPlan("City Agent", "£79")}
                className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold px-8 py-3.5 rounded-xl cursor-pointer"
              >
                Get Started Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant="outline" 
                className="border-gold/40 text-gold hover:bg-gold/10 font-semibold px-8 py-3.5 rounded-xl cursor-pointer"
              >
                Schedule Demo
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-xs sm:text-sm text-text-muted">
            Flexible monthly plans · Cancel anytime · No setup fees
          </p>
        </div>
      </div>
    </div>
  )
}
