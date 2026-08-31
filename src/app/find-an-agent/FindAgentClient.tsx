'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Agent } from '@/types/agent'
import AgentCard from '@/components/agents/AgentCard'
import { Button } from '@/components/ui/button'
import { SectionLabel, GoldDivider } from '@/components/ui'
import { Search, Filter } from 'lucide-react'
import { useUser } from '@/lib/auth/useUser'

interface FindAgentClientProps {
  agents: Agent[]
}

export default function FindAgentClient({ agents }: FindAgentClientProps) {
  const { user } = useUser()
  const userType = user?.user_metadata?.user_type || 'client'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedSpecialisation, setSelectedSpecialisation] = useState('all')
  const [sortBy, setSortBy] = useState('rating')

  // Get unique specialisations from all agents
  const allSpecialisations = Array.from(
    new Set(agents.flatMap(agent => agent.specialisations))
  ).sort()

  // Filter agents based on search, location, and specialisation
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLocation = 
      selectedLocation === 'all' || 
      agent.location.toLowerCase().includes(selectedLocation.toLowerCase())
    
    const matchesSpecialisation = 
      selectedSpecialisation === 'all' || 
      agent.specialisations.includes(selectedSpecialisation)

    return matchesSearch && matchesLocation && matchesSpecialisation
  })

  // Sort agents
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'reviews':
        return b.reviewCount - a.reviewCount
      case 'experience':
        return b.yearsExperience - a.yearsExperience
      case 'response':
        return a.responseTime.localeCompare(b.responseTime)
      default:
        return 0
    }
  })

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'london', label: 'London' },
    { value: 'manchester', label: 'Manchester' },
    { value: 'birmingham', label: 'Birmingham' },
    { value: 'bristol', label: 'Bristol' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="bg-[#0d0d14] py-16 sm:py-20 md:py-28 relative overflow-hidden border-b border-ef-border">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl relative z-10 mx-auto px-4 sm:px-6">
          <div className="text-center">
            <SectionLabel>Find Your Perfect Agent</SectionLabel>
            
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F3EE] leading-[1.15] mt-3">
              Connect with verified
              <br />
              property experts
            </h1>
            
            <GoldDivider className="mx-auto mt-4 sm:mt-5 mb-4 sm:mb-6" />
            
            <p className="text-[#B8B5AE] text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              Browse our network of verified agents across the UK. 
              Find the perfect match for your property needs based on location, expertise, and verified reviews.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, agency, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-white/15 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-[#1E1E28] text-white placeholder:text-text-muted transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-surface py-8 border-b border-ef-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="space-y-4">
            {/* Filter Header */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gold" />
              <span className="font-medium text-white">Filters:</span>
            </div>
            
            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Filter */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2.5 border border-white/15 rounded-xl focus:outline-none focus:border-gold bg-[#1E1E28] text-white w-full"
              >
                {locations.map(location => (
                  <option key={location.value} value={location.value} className="bg-[#1A1A24] text-white">
                    {location.label}
                  </option>
                ))}
              </select>

              {/* Specialisation Filter */}
              <select
                value={selectedSpecialisation}
                onChange={(e) => setSelectedSpecialisation(e.target.value)}
                className="px-4 py-2.5 border border-white/15 rounded-xl focus:outline-none focus:border-gold bg-[#1E1E28] text-white w-full"
              >
                <option value="all" className="bg-[#1A1A24] text-white">All Specialisations</option>
                {allSpecialisations.map(spec => (
                  <option key={spec} value={spec} className="bg-[#1A1A24] text-white">{spec}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-white/15 rounded-xl focus:outline-none focus:border-gold bg-[#1E1E28] text-white w-full"
              >
                <option value="rating" className="bg-[#1A1A24] text-white">Highest Rated</option>
                <option value="reviews" className="bg-[#1A1A24] text-white">Most Reviews</option>
                <option value="experience" className="bg-[#1A1A24] text-white">Most Experience</option>
                <option value="response" className="bg-[#1A1A24] text-white">Fastest Response</option>
              </select>

              {/* Clear Filters Button */}
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedLocation('all')
                  setSelectedSpecialisation('all')
                }}
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/10 w-full h-[42px] font-medium cursor-pointer"
              >
                Clear Filters
              </Button>
            </div>

            {/* Results Count */}
            <div className="text-text-secondary text-sm">
              Showing {sortedAgents.length} of {agents.length} agents
            </div>
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {sortedAgents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/20 mb-4">
                <Search className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-white mb-2">
                No agents found
              </h3>
              <p className="text-text-secondary mb-6">
                Try adjusting your search terms or filters to find more agents.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedLocation('all')
                  setSelectedSpecialisation('all')
                }}
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/10 font-medium"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#111118] text-white py-16 border-t border-ef-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {user && userType === 'agent' ? (
            <>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gold mb-4">
                Are you an Agent looking for Leads?
              </h2>
              <p className="text-base sm:text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                Access qualified client property submissions matched to your coverage area and grow your pipeline.
              </p>
              <Button 
                render={<Link href="/agent-dashboard" />}
                nativeButton={false}
                className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold px-8 py-3 cursor-pointer"
              >
                Go to Agent Dashboard
              </Button>
            </>
          ) : (
            <>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gold mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-base sm:text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                Submit your property details and we'll match you with the perfect agents from our network.
              </p>
              <Button 
                render={<Link href="/submit-property" />}
                nativeButton={false}
                className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold px-8 py-3 cursor-pointer"
              >
                Submit Your Property
              </Button>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
