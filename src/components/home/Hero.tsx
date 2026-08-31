'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { useUser } from '@/lib/auth/useUser'
import { Search, MapPin, Home, Banknote } from 'lucide-react'

export default function Hero() {
  const { user } = useUser()
  const userType = user?.user_metadata?.user_type || 'client'

  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [budget, setBudget] = useState('')

  return (
    <section className="relative min-h-[100vh] flex flex-col justify-center -mt-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Luxury modern villa at dusk"
          fill
          priority
          className="object-cover object-center"
          quality={90}
        />
        {/* Gradient Overlay */}
        <div className="hero-gradient absolute inset-0" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-32 pb-40 sm:pb-48">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#F5F3EE] leading-[1.05] tracking-tight">
            Experience Living
            <br />
            Without Limits
          </h1>

          <p className="mt-5 sm:mt-6 text-[#B8B5AE] text-base sm:text-lg md:text-xl max-w-xl leading-relaxed">
            An elegant platform connecting you with verified agents and exclusive properties across the UK.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {user && userType === 'agent' ? (
              <Link href={ROUTES.agentDashboard}>
                <Button
                  size="lg"
                  className="bg-gold text-[#0d0d14] hover:bg-gold/90 h-12 px-8 text-sm font-semibold w-full sm:w-auto cursor-pointer"
                >
                  Agent Dashboard
                </Button>
              </Link>
            ) : (
              <Link href={ROUTES.submitProperty}>
                <Button
                  size="lg"
                  className="bg-gold text-[#0d0d14] hover:bg-gold/90 h-12 px-8 text-sm font-semibold w-full sm:w-auto cursor-pointer"
                >
                  Submit Your Property
                </Button>
              </Link>
            )}
            <Link href={ROUTES.agents}>
              <Button
                size="lg"
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10 h-12 px-8 text-sm font-semibold w-full sm:w-auto cursor-pointer"
              >
                Browse Agents →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Glass Search Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-2xl shadow-black/30">
            <h3 className="font-heading text-[#F5F3EE] text-lg sm:text-xl font-semibold mb-4">
              Luxury Search Bar
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Location */}
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1A24] border border-gold/15 rounded-lg text-[#F5F3EE] text-sm appearance-none cursor-pointer focus:outline-none focus:border-gold/40 transition-colors"
                >
                  <option value="">Location</option>
                  <option value="london">London</option>
                  <option value="manchester">Manchester</option>
                  <option value="birmingham">Birmingham</option>
                  <option value="bristol">Bristol</option>
                  <option value="leeds">Leeds</option>
                  <option value="edinburgh">Edinburgh</option>
                </select>
                <ChevronIcon className="absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Property Type */}
              <div className="relative flex-1">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1A24] border border-gold/15 rounded-lg text-[#F5F3EE] text-sm appearance-none cursor-pointer focus:outline-none focus:border-gold/40 transition-colors"
                >
                  <option value="">Property Type</option>
                  <option value="house">House</option>
                  <option value="flat">Flat / Apartment</option>
                  <option value="bungalow">Bungalow</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="villa">Villa</option>
                  <option value="cottage">Cottage</option>
                </select>
                <ChevronIcon className="absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Budget */}
              <div className="relative flex-1">
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1A24] border border-gold/15 rounded-lg text-[#F5F3EE] text-sm appearance-none cursor-pointer focus:outline-none focus:border-gold/40 transition-colors"
                >
                  <option value="">Budget</option>
                  <option value="100k-250k">£100k - £250k</option>
                  <option value="250k-500k">£250k - £500k</option>
                  <option value="500k-1m">£500k - £1M</option>
                  <option value="1m-2m">£1M - £2M</option>
                  <option value="2m+">£2M+</option>
                </select>
                <ChevronIcon className="absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Search Button */}
              <Link href={ROUTES.findAgent}>
                <Button className="bg-gold text-[#0d0d14] hover:bg-gold/90 h-[46px] px-8 font-semibold cursor-pointer w-full sm:w-auto">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 text-text-muted pointer-events-none ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}
