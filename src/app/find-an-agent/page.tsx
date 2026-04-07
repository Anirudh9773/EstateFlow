'use client'

import { useState } from 'react'
import { agents } from '@/data/agents'
import AgentCard from '@/components/agents/AgentCard'
import { Button } from '@/components/ui/button'
import { SectionLabel, GoldDivider } from '@/components/ui'
import { Search, MapPin, Filter, Star } from 'lucide-react'

export default function FindAgentPage() {
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
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-surface py-16 sm:py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <SectionLabel>Find Your Perfect Agent</SectionLabel>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--color-navy)] leading-[1.1] mt-3">
              Connect with verified
              <br />
              property experts
            </h1>
            
            <GoldDivider className="mx-auto mt-4 sm:mt-5 mb-4 sm:mb-6" />
            
            <p className="text-[var(--color-text-secondary)] text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              Browse our network of 1,200+ verified agents across the UK. 
              Find the perfect match for your property needs based on location, expertise, and verified reviews.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-gold)] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, agency, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-[var(--color-ef-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent bg-white text-[var(--color-navy)] placeholder:text-[var(--color-text-muted)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white py-8 border-b border-[var(--color-ef-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[var(--color-gold)]" />
              <span className="font-medium text-[var(--color-navy)]">Filters:</span>
            </div>
            
            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-[var(--color-ef-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] bg-white text-[var(--color-navy)]"
            >
              {locations.map(location => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>

            {/* Specialisation Filter */}
            <select
              value={selectedSpecialisation}
              onChange={(e) => setSelectedSpecialisation(e.target.value)}
              className="px-4 py-2 border border-[var(--color-ef-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] bg-white text-[var(--color-navy)]"
            >
              <option value="all">All Specialisations</option>
              {allSpecialisations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-[var(--color-ef-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] bg-white text-[var(--color-navy)] ml-auto"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="experience">Most Experience</option>
              <option value="response">Fastest Response</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-[var(--color-text-secondary)]">
            Showing {sortedAgents.length} of {agents.length} agents
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {sortedAgents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-gold)]/10 mb-4">
                <Search className="w-8 h-8 text-[var(--color-gold)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-navy)] mb-2">
                No agents found
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Try adjusting your search terms or filters to find more agents.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedLocation('all')
                  setSelectedSpecialisation('all')
                }}
                variant="outline"
                className="border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-[var(--color-gold)]"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--color-navy)] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-gold)] mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Submit your property details and we'll match you with the perfect agents from our network.
          </p>
          <Button className="bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]/90 px-8 py-3">
            Submit Your Property
          </Button>
        </div>
      </section>
    </div>
  )
}
