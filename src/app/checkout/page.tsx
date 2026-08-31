'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SectionLabel, GoldDivider } from '@/components/ui'
import { 
  CreditCard, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  ArrowLeft, 
  Building2, 
  Sparkles, 
  Mail, 
  Lock,
  ArrowRight,
  HelpCircle
} from 'lucide-react'
import { useUser } from '@/lib/auth/useUser'
import { SITE_EMAIL, SITE_PHONE } from '@/lib/constants'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const { user } = useUser()

  const planParam = searchParams.get('plan') || 'City Agent'
  const priceParam = searchParams.get('price') || '£79'
  const cycleParam = searchParams.get('cycle') || 'monthly'

  const userType = user?.user_metadata?.user_type
  const isClientPlan = ['basic', 'professional', 'homeowner', 'enterprise'].some(p => planParam.toLowerCase().includes(p))

  // Determine pricing details based on params
  const isAnnual = cycleParam === 'annual'
  const baseNumericPrice = parseInt(priceParam.replace(/[^0-9]/g, '')) || 79
  const displayPrice = (!isClientPlan && isAnnual) 
    ? `£${Math.round(baseNumericPrice * 0.8)}` 
    : priceParam

  return (
    <div className="min-h-screen bg-background text-foreground py-12 sm:py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Top Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href={isClientPlan ? "/pricing" : "/agent-pricing"} 
            className="inline-flex items-center text-sm font-semibold text-text-secondary hover:text-gold transition-colors gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {isClientPlan ? "Back to Pricing" : "Back to Agent Pricing Plans"}
          </Link>
          
          <Badge className="bg-gold/15 text-gold border border-gold/30 font-semibold px-3 py-1 text-xs">
            ⚡ Payment Gateway Integration
          </Badge>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gold/10 text-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-gold/30">
            <CreditCard className="w-8 h-8" />
          </div>

          <SectionLabel>Online Checkout</SectionLabel>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F3EE] mt-3">
            Payment Processing Coming Soon
          </h1>

          <GoldDivider className="mx-auto mt-4 mb-4" />

          <p className="text-[#B8B5AE] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Thank you for selecting the <strong className="text-gold font-semibold">{planParam}</strong> plan! We are currently integrating our secure payment gateway to deliver a seamless automated experience.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          
          {/* Left Column: Plan Summary */}
          <Card className="md:col-span-1 border border-gold/40 bg-[#1A1A24] text-white shadow-xl flex flex-col justify-between rounded-2xl overflow-hidden">
            <CardHeader className="bg-[#14141E] border-b border-white/10 pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-gold text-[#0d0d14] font-bold text-xs">
                  Selected Plan
                </Badge>
                <span className="text-xs text-text-muted capitalize font-medium">
                  {isClientPlan ? 'One-Time' : `${cycleParam} Billing`}
                </span>
              </div>
              <CardTitle className="font-heading text-xl font-bold text-white">
                {planParam}
              </CardTitle>
              <CardDescription className="text-xs text-text-secondary">
                {planParam.toLowerCase().includes('basic') 
                  ? 'Perfect for single property listings & agent matching'
                  : planParam.toLowerCase().includes('professional')
                  ? 'Multiple property submissions & priority agent matching'
                  : planParam.toLowerCase().includes('local')
                  ? 'Ideal for neighborhood specialists'
                  : planParam.toLowerCase().includes('city')
                  ? 'City-wide coverage & boosted leads'
                  : planParam.toLowerCase().includes('state')
                  ? 'Multi-county regional coverage'
                  : 'Nationwide UK agency coverage'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4 p-6">
              <div className="text-center py-3 bg-white/5 rounded-xl border border-white/10">
                <div className="font-heading text-3xl font-extrabold text-white">
                  {displayPrice}
                </div>
                <div className="text-xs text-text-muted font-medium mt-0.5">
                  {isClientPlan 
                    ? 'one-time payment' 
                    : `per month ${isAnnual ? '(billed annually - 20% OFF)' : ''}`
                  }
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#B8B5AE]">
                {isClientPlan ? (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Submit property listings & reach verified agents</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Priority matching & market analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Full access to client dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>7-day agent response guarantee</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Full access to matched client leads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Verified agent badge & profile listing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Performance reporting dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>No long-term contract commitment</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>

            <div className="p-4 bg-gold/10 border-t border-gold/20 text-center">
              <p className="text-xs text-gold font-medium">
                No immediate payment required today.
              </p>
            </div>
          </Card>

          {/* Right Column: Status & Next Steps */}
          <Card className="md:col-span-2 border border-white/10 bg-[#1A1A24] text-white shadow-xl rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold border border-gold/20 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="font-heading text-lg font-bold text-white">
                    What happens next?
                  </CardTitle>
                  <CardDescription className="text-xs text-text-secondary">
                    How your account and selected plan are handled during our preview launch
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6 pt-0">
              
              {/* Feature Notice Box */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#14141E] border border-white/10 space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Complimentary Access During Gateway Upgrade
                    </h4>
                    <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                      {isClientPlan
                        ? 'While our card payment system is being finalized, all property submission and agent matching features are fully active! You can submit your property and connect with agents immediately.'
                        : 'While our card payment system is being finalized, all agent account features and dashboard access are available to registered agents. You can start using EstateFlow immediately!'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons based on User Auth state */}
              <div className="space-y-3 pt-2">
                {user ? (
                  userType === 'agent' ? (
                    <Link href="/agent-dashboard" className="block">
                      <Button className="w-full bg-gold text-[#0d0d14] hover:bg-gold/90 h-12 text-base font-semibold gap-2 shadow-md cursor-pointer rounded-xl">
                        <Building2 className="w-5 h-5" />
                        Go to Agent Dashboard
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Link href="/submit-property" className="block">
                        <Button className="w-full bg-gold text-[#0d0d14] hover:bg-gold/90 h-11 text-sm font-semibold gap-2 shadow-md cursor-pointer rounded-xl">
                          Submit Your Property
                        </Button>
                      </Link>
                      <Link href="/client-dashboard" className="block">
                        <Button variant="outline" className="w-full border-white/15 text-text-secondary hover:text-white hover:bg-white/10 h-11 text-sm font-semibold cursor-pointer rounded-xl">
                          Client Dashboard
                        </Button>
                      </Link>
                    </div>
                  )
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {isClientPlan ? (
                      <>
                        <Link href="/submit-property" className="block">
                          <Button className="w-full bg-gold text-[#0d0d14] hover:bg-gold/90 h-11 text-sm font-semibold gap-2 shadow-md cursor-pointer rounded-xl">
                            Submit Your Property
                          </Button>
                        </Link>
                        <Link href="/sign-in" className="block">
                          <Button variant="outline" className="w-full border-white/15 text-text-secondary hover:text-white hover:bg-white/10 h-11 text-sm font-semibold cursor-pointer rounded-xl">
                            Sign In / Register
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/sign-up/agent" className="block">
                          <Button className="w-full bg-gold text-[#0d0d14] hover:bg-gold/90 h-11 text-sm font-semibold gap-2 shadow-md cursor-pointer rounded-xl">
                            <Building2 className="w-4 h-4" />
                            Create Agent Account
                          </Button>
                        </Link>
                        <Link href="/sign-in" className="block">
                          <Button variant="outline" className="w-full border-white/15 text-text-secondary hover:text-white hover:bg-white/10 h-11 text-sm font-semibold cursor-pointer rounded-xl">
                            Already Registered? Sign In
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                )}

                <Link href="/contact" className="block text-center pt-2">
                  <span className="text-xs text-text-muted hover:text-gold underline transition-colors">
                    Need a custom invoice or bank transfer details? Contact our team
                  </span>
                </Link>
              </div>

              {/* Direct Support Info */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-2">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gold" />
                  {SITE_EMAIL}
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gold" />
                  256-bit SSL Encrypted Connection
                </span>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* FAQs */}
        <Card className="border border-white/10 bg-[#1A1A24] text-white rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <HelpCircle className="w-4 h-4 text-gold" />
              <span>Checkout FAQs</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-text-secondary p-6 pt-0">
            <div>
              <p className="font-semibold text-white text-sm">When will automated card payments be enabled?</p>
              <p className="mt-1 leading-relaxed">We are rolling out full automated billing shortly. Registered agents will receive an email notification when payment setup is required.</p>
            </div>
            <div className="pt-3 border-t border-white/10">
              <p className="font-semibold text-white text-sm">Will I lose access if payment is delayed?</p>
              <p className="mt-1 leading-relaxed">No, during our initial launch phase, accounts will remain fully active while our payment gateway integration completes.</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-white/10 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-secondary">Loading Checkout Information...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
