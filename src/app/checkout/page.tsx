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

  // Determine pricing details based on params
  const isAnnual = cycleParam === 'annual'
  const baseNumericPrice = parseInt(priceParam.replace(/[^0-9]/g, '')) || 79
  const displayPrice = isAnnual 
    ? `£${Math.round(baseNumericPrice * 0.8)}` 
    : priceParam

  return (
    <div className="min-h-screen bg-surface py-12 sm:py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Top Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/agent-pricing" 
            className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-[var(--color-navy)] transition-colors gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing Plans
          </Link>
          
          <Badge className="bg-amber-100 text-amber-800 border border-amber-300 font-semibold px-3 py-1 text-xs">
            ⚡ Payment Gateway Integration
          </Badge>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[var(--color-navy)] text-[var(--color-gold)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-[var(--color-gold)]/30">
            <CreditCard className="w-8 h-8" />
          </div>

          <SectionLabel>Online Checkout</SectionLabel>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-navy)] mt-2">
            Payment Processing Coming Soon
          </h1>

          <GoldDivider className="mx-auto mt-4 mb-4" />

          <p className="text-[var(--color-text-secondary)] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Thank you for selecting the <strong className="text-[var(--color-navy)]">{planParam}</strong> plan! We are currently integrating our secure payment gateway to deliver a seamless automated experience.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          
          {/* Left Column: Plan Summary (1 col on desktop or 3 col span) */}
          <Card className="md:col-span-1 border-2 border-[var(--color-gold)]/40 bg-white shadow-lg flex flex-col justify-between">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-[var(--color-gold)] text-[var(--color-navy)] font-bold text-xs">
                  Selected Plan
                </Badge>
                <span className="text-xs text-slate-500 capitalize font-medium">{cycleParam} Billing</span>
              </div>
              <CardTitle className="text-xl font-bold text-[var(--color-navy)]">
                {planParam}
              </CardTitle>
              <CardDescription className="text-xs">
                {planParam.includes('Local') 
                  ? 'Ideal for neighborhood specialists'
                  : planParam.includes('City')
                  ? 'City-wide coverage & boosted leads'
                  : planParam.includes('State')
                  ? 'Multi-county regional coverage'
                  : 'Nationwide UK agency coverage'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-3xl font-extrabold text-[var(--color-navy)]">
                  {displayPrice}
                </div>
                <div className="text-xs text-[var(--color-text-secondary)] font-medium">
                  per month {isAnnual ? '(billed annually - 20% OFF)' : ''}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full access to matched client leads</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified agent badge & profile listing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Performance reporting dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No long-term contract commitment</span>
                </div>
              </div>
            </CardContent>

            <div className="p-4 bg-amber-50/60 border-t border-amber-100 rounded-b-xl text-center">
              <p className="text-xs text-amber-800 font-medium">
                No immediate payment required today.
              </p>
            </div>
          </Card>

          {/* Right Column: Status & Next Steps (2 cols on desktop) */}
          <Card className="md:col-span-2 border border-[var(--color-ef-border)] bg-white shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-[var(--color-navy)]">
                    What happens next?
                  </CardTitle>
                  <CardDescription className="text-xs">
                    How your account and selected plan are handled during our preview launch
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              
              {/* Feature Notice Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Complimentary Access During Gateway Upgrade
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      While our card payment system is being finalized, all agent account features and dashboard access are available to registered agents. You can start using EstateFlow immediately!
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons based on User Auth state */}
              <div className="space-y-3 pt-2">
                {user ? (
                  userType === 'agent' ? (
                    <Link href="/agent-dashboard" className="block">
                      <Button className="w-full bg-[var(--color-navy)] text-[var(--color-gold)] hover:bg-[var(--color-navy)]/90 h-12 text-base font-semibold gap-2 shadow-md cursor-pointer">
                        <Building2 className="w-5 h-5" />
                        Go to Agent Dashboard
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/contact" className="block">
                      <Button className="w-full bg-[var(--color-navy)] text-[var(--color-gold)] hover:bg-[var(--color-navy)]/90 h-12 text-base font-semibold gap-2 shadow-md cursor-pointer">
                        <Mail className="w-5 h-5" />
                        Contact Support for Agent Access
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                    </Link>
                  )
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link href="/sign-up/agent" className="block">
                      <Button className="w-full bg-[var(--color-navy)] text-[var(--color-gold)] hover:bg-[var(--color-navy)]/90 h-11 text-sm font-semibold gap-2 shadow-md cursor-pointer">
                        <Building2 className="w-4 h-4" />
                        Create Agent Account
                      </Button>
                    </Link>
                    <Link href="/sign-in" className="block">
                      <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 h-11 text-sm font-semibold cursor-pointer">
                        Already Registered? Sign In
                      </Button>
                    </Link>
                  </div>
                )}

                <Link href="/contact" className="block text-center pt-2">
                  <span className="text-xs text-slate-500 hover:text-[var(--color-navy)] underline transition-colors">
                    Need a custom invoice or bank transfer details? Contact our team
                  </span>
                </Link>
              </div>

              {/* Direct Support Info */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {SITE_EMAIL}
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  256-bit SSL Encrypted Connection
                </span>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* FAQs */}
        <Card className="border border-[var(--color-ef-border)] bg-white">
          <CardHeader>
            <div className="flex items-center gap-2 text-[var(--color-navy)] font-semibold text-sm">
              <HelpCircle className="w-4 h-4 text-[var(--color-gold)]" />
              <span>Checkout FAQs</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-slate-600">
            <div>
              <p className="font-semibold text-slate-800">When will automated card payments be enabled?</p>
              <p className="mt-1">We are rolling out full automated billing shortly. Registered agents will receive an email notification when payment setup is required.</p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <p className="font-semibold text-slate-800">Will I lose access if payment is delayed?</p>
              <p className="mt-1">No, during our initial launch phase, accounts will remain fully active while our payment gateway integration completes.</p>
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
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--color-navy)] border-t-[var(--color-gold)] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-600">Loading Checkout Information...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
