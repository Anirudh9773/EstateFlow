"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import AgentCard from "@/components/agents/AgentCard"
import { Card } from "@/components/ui/card"
import { useUser } from "@/lib/auth/useUser"
import type { Agent } from "@/types/agent"

interface BrowseAgentsClientProps {
  agents: Agent[]
}

export default function BrowseAgentsClient({ agents }: BrowseAgentsClientProps) {
  const { user } = useUser()
  const userType = user?.user_metadata?.user_type || 'client'
  const [activeTab, setActiveTab] = useState("all")
  const [showAllAgents, setShowAllAgents] = useState(false)

  // Filter agents by tier
  const localAgents = agents.filter(a => a.tier === 'local')
  const regionalAgents = agents.filter(a => a.tier === 'regional')
  const nationwideAgents = agents.filter(a => a.tier === 'nationwide')

  // Get the agents to display based on active tab
  const getDisplayedAgents = () => {
    switch (activeTab) {
      case "local":
        return localAgents
      case "regional":
        return regionalAgents
      case "nationwide":
        return nationwideAgents
      default:
        return agents
    }
  }

  const displayedAgents = getDisplayedAgents()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F3EE] mb-4">
            Find Your Perfect Agent
          </h1>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
            Browse our curated selection of verified agents across different service areas. 
            From local specialists to national experts, find the right professional for your property needs.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <Card className="bg-[#1A1A24] border-white/10 text-white text-center p-4 sm:p-5 shadow-none">
            <div className="font-heading text-2xl sm:text-3xl font-bold text-gold">{agents.length}</div>
            <div className="text-xs sm:text-sm text-text-secondary mt-1">Expert Agents</div>
          </Card>
          <Card className="bg-[#1A1A24] border-white/10 text-white text-center p-4 sm:p-5 shadow-none">
            <div className="font-heading text-2xl sm:text-3xl font-bold text-gold">4.5+</div>
            <div className="text-xs sm:text-sm text-text-secondary mt-1">Average Rating</div>
          </Card>
          <Card className="bg-[#1A1A24] border-white/10 text-white text-center p-4 sm:p-5 shadow-none">
            <div className="font-heading text-2xl sm:text-3xl font-bold text-gold">2,000+</div>
            <div className="text-xs sm:text-sm text-text-secondary mt-1">Properties Sold</div>
          </Card>
          <Card className="bg-[#1A1A24] border-white/10 text-white text-center p-4 sm:p-5 shadow-none">
            <div className="font-heading text-2xl sm:text-3xl font-bold text-gold">24/7</div>
            <div className="text-xs sm:text-sm text-text-secondary mt-1">Support Available</div>
          </Card>
        </div>

        {/* Tabbed Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 bg-transparent border-0 shadow-none p-0 w-full group-data-horizontal/tabs:h-auto">
            <TabsTrigger 
              value="all" 
              className="bg-[#1E1E28] border border-white/15 text-text-secondary hover:text-white hover:border-gold/40 data-active:bg-gold data-active:text-[#0d0d14] data-active:font-bold transition-all duration-200 py-3 sm:py-3.5 px-3 sm:px-6 text-sm sm:text-base font-medium rounded-xl cursor-pointer"
            >
              All ({agents.length})
            </TabsTrigger>
            <TabsTrigger 
              value="local" 
              className="bg-[#1E1E28] border border-white/15 text-text-secondary hover:text-white hover:border-gold/40 data-active:bg-gold data-active:text-[#0d0d14] data-active:font-bold transition-all duration-200 py-3 sm:py-3.5 px-3 sm:px-6 text-sm sm:text-base font-medium rounded-xl cursor-pointer"
            >
              Local ({localAgents.length})
            </TabsTrigger>
            <TabsTrigger 
              value="regional" 
              className="bg-[#1E1E28] border border-white/15 text-text-secondary hover:text-white hover:border-gold/40 data-active:bg-gold data-active:text-[#0d0d14] data-active:font-bold transition-all duration-200 py-3 sm:py-3.5 px-3 sm:px-6 text-sm sm:text-base font-medium rounded-xl cursor-pointer"
            >
              Regional ({regionalAgents.length})
            </TabsTrigger>
            <TabsTrigger 
              value="nationwide" 
              className="bg-[#1E1E28] border border-white/15 text-text-secondary hover:text-white hover:border-gold/40 data-active:bg-gold data-active:text-[#0d0d14] data-active:font-bold transition-all duration-200 py-3 sm:py-3.5 px-3 sm:px-6 text-sm sm:text-base font-medium rounded-xl cursor-pointer"
            >
              Nationwide ({nationwideAgents.length})
            </TabsTrigger>
          </TabsList>

          {/* All Agents Tab */}
          <TabsContent value="all" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">All Agents</h2>
              <p className="text-text-secondary">
                Browse all {agents.length} verified agents across all service areas
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </TabsContent>

          {/* Local Agents Tab */}
          <TabsContent value="local" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">Local Agents</h2>
              <p className="text-text-secondary">
                {localAgents.length} specialized agents serving specific postcodes and neighborhoods
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {localAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </TabsContent>

          {/* Regional Agents Tab */}
          <TabsContent value="regional" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">Regional Agents</h2>
              <p className="text-text-secondary">
                {regionalAgents.length} agents covering cities, counties and regional areas
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regionalAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </TabsContent>

          {/* Nationwide Agents Tab */}
          <TabsContent value="nationwide" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">Nationwide Agents</h2>
              <p className="text-text-secondary">
                {nationwideAgents.length} agents with extensive UK-wide property expertise
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nationwideAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="text-center mt-12 p-6 sm:p-10 bg-[#14141E] border border-gold/30 text-white rounded-2xl">
          {user && userType === 'agent' ? (
            <>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3 text-gold">Grow Your Business with EstateFlow</h2>
              <p className="mb-6 text-text-secondary max-w-2xl mx-auto text-sm sm:text-base">
                Manage your profile, view client property submissions matched to your service area, and track your active leads.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link 
                  href="/agent-dashboard"
                  className="px-8 py-3.5 bg-gold text-[#0d0d14] font-semibold rounded-xl hover:bg-gold/90 transition-colors text-sm sm:text-base cursor-pointer inline-block"
                >
                  Agent Dashboard
                </Link>
                <Link 
                  href="/agent-dashboard/listings"
                  className="px-8 py-3.5 border border-gold/40 text-gold font-semibold rounded-xl hover:bg-gold/10 transition-colors text-sm sm:text-base cursor-pointer inline-block"
                >
                  Manage Listings
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3 text-gold">Are You a Real Estate Agent?</h2>
              <p className="mb-6 text-text-secondary max-w-2xl mx-auto text-sm sm:text-base">
                Join our network of verified agents and get connected with high-intent property owners in your area.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link 
                  href="/join"
                  className="px-8 py-3.5 bg-gold text-[#0d0d14] font-semibold rounded-xl hover:bg-gold/90 transition-colors text-sm sm:text-base cursor-pointer inline-block"
                >
                  Join as an Agent
                </Link>
                <Link 
                  href="/agent-pricing"
                  className="px-8 py-3.5 border border-gold/40 text-gold font-semibold rounded-xl hover:bg-gold/10 transition-colors text-sm sm:text-base cursor-pointer inline-block"
                >
                  View Pricing Plans
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
