"use client"

import { useState } from "react"
import Link from "next/link"
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

export default function AgentPricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<string>("City Agent")

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
            Agent Pricing Plans
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your agency size and coverage area. 
            Flexible pricing designed to grow with your business.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white border border-navy/20 rounded-lg p-1 flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-md transition-colors ${
                billingCycle === "monthly"
                  ? "bg-[var(--color-navy)] text-[var(--color-gold)]"
                  : "text-[var(--color-navy)] hover:bg-[var(--color-navy)]/10"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-2 rounded-md transition-colors ${
                billingCycle === "annual"
                  ? "bg-[var(--color-navy)] text-[var(--color-gold)]"
                  : "text-[var(--color-navy)] hover:bg-[var(--color-navy)]/10"
              }`}
            >
              Annual Billing
              <span className="ml-1 text-xs bg-[var(--color-gold)] text-[var(--color-navy)] px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={tier.category}
              className={`relative border-2 transition-all duration-300 hover:shadow-xl h-full flex flex-col ${
                selectedPlan === tier.category
                  ? `border-[var(--color-gold)] shadow-lg scale-105` 
                  : 'border-gray-200 hover:border-[var(--color-gold)]/30'
              }`}
              onClick={() => setSelectedPlan(tier.category)}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className={`${tier.badgeColor} font-semibold px-3 py-1 shadow-md`}>
                    {tier.heading || "Most Popular"}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4 pt-8">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  tier.category === "Local Agent" ? "bg-green-100" :
                  tier.category === "City Agent" ? "bg-blue-100" :
                  tier.category === "State Agent" ? "bg-purple-100" :
                  "bg-[var(--color-gold)]/20"
                }`}>
                  {tier.category === "Local Agent" ? <MapPin className="w-6 h-6 text-green-600" /> :
                   tier.category === "City Agent" ? <Users className="w-6 h-6 text-blue-600" /> :
                   tier.category === "State Agent" ? <TrendingUp className="w-6 h-6 text-purple-600" /> :
                   <Star className="w-6 h-6 text-[var(--color-gold)]" />}
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
                    {billingCycle === "annual" 
                      ? `£${Math.round(parseInt(tier.price.replace('£', '')) * 0.8)}`
                      : tier.price
                    }
                  </div>
                  <div className="text-text-secondary text-sm">
                    {tier.period}
                    {billingCycle === "annual" && (
                      <div className="text-green-600 font-semibold">
                        (Save 20%)
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-text-muted mt-2">
                    Commission: {tier.commission}
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </div>
                  ))}
                  
                  {tier.notIncluded.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 opacity-50">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-text-muted line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full mt-auto ${
                    selectedPlan === tier.category
                      ? "bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]/90" 
                      : "bg-[var(--color-navy)] text-[var(--color-gold)] hover:bg-[var(--color-navy)]/90"
                  }`}
                >
                  {selectedPlan === tier.category ? "Selected" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-navy)] mb-2">Compare All Plans</h2>
            <p className="text-text-secondary">
              Side-by-side comparison of all pricing tiers
            </p>
          </div>
          
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--color-navy)] text-[var(--color-gold)]">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">Local Agent</th>
                    <th className="text-center p-4 font-semibold">City Agent</th>
                    <th className="text-center p-4 font-semibold">State Agent</th>
                    <th className="text-center p-4 font-semibold">National Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-b border-ef-border">
                      <td className="p-4 font-medium text-[var(--color-navy)]">{row.feature}</td>
                      <td className="p-4 text-center text-text-secondary">{row.local}</td>
                      <td className="p-4 text-center text-text-secondary">{row.city}</td>
                      <td className="p-4 text-center text-text-secondary">{row.state}</td>
                      <td className="p-4 text-center text-text-secondary">{row.national}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-[var(--color-navy)] text-white p-6">
            <Zap className="w-8 h-8 text-[var(--color-gold)] mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-[var(--color-gold)]">Quick Setup</h3>
            <p className="text-sm opacity-90">
              Get started in minutes with our streamlined onboarding process. 
              No long-term contracts required.
            </p>
          </Card>
          
          <Card className="bg-[var(--color-navy)] text-white p-6">
            <Shield className="w-8 h-8 text-[var(--color-gold)] mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-[var(--color-gold)]">Secure Platform</h3>
            <p className="text-sm opacity-90">
              Bank-level security for your data and client information. 
              GDPR compliant and fully insured.
            </p>
          </Card>
          
          <Card className="bg-[var(--color-navy)] text-white p-6">
            <Phone className="w-8 h-8 text-[var(--color-gold)] mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-[var(--color-gold)]">24/7 Support</h3>
            <p className="text-sm opacity-90">
              Round-the-clock support for all plans. 
              Get help when you need it from our expert team.
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center p-8 bg-[var(--color-navy)] text-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-gold)]">Ready to Grow Your Agency?</h2>
          <p className="mb-6 opacity-90 max-w-2xl mx-auto">
            Join thousands of successful agents who trust EstateFlow to grow their business 
            and connect with qualified leads.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]/90 px-6 py-3">
              Get Started Now
            </Button>
            <Button variant="outline" className="border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 px-6 py-3">
              Schedule Demo
            </Button>
          </div>
          <p className="mt-4 text-sm opacity-75">
            Flexible monthly plans · Cancel anytime · No setup fees
          </p>
        </div>
      </div>
    </div>
  )
}
