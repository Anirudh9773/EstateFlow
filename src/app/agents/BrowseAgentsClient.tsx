"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import AgentCard from "@/components/agents/AgentCard"
import { Card } from "@/components/ui/card"
import type { Agent } from "@/types/agent"

interface BrowseAgentsClientProps {
  agents: Agent[]
}

export default function BrowseAgentsClient({ agents }: BrowseAgentsClientProps) {
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
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Find Your Perfect Agent
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Browse our curated selection of verified agents across different service areas. 
            From local specialists to national experts, find the right professional for your property needs.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <Card className="bg-navy text-white text-center p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-gold">{agents.length}</div>
            <div className="text-xs sm:text-sm opacity-90">Expert Agents</div>
          </Card>
          <Card className="bg-navy text-white text-center p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-gold">4.5+</div>
            <div className="text-xs sm:text-sm opacity-90">Average Rating</div>
          </Card>
          <Card className="bg-navy text-white text-center p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-gold">2,000+</div>
            <div className="text-xs sm:text-sm opacity-90">Properties Sold</div>
          </Card>
          <Card className="bg-navy text-white text-center p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-gold">24/7</div>
            <div className="text-xs sm:text-sm opacity-90">Support Available</div>
          </Card>
        </div>

        {/* Tabbed Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 bg-transparent border-0 shadow-none p-0 w-full group-data-horizontal/tabs:h-auto">
            <TabsTrigger 
              value="all" 
              className="data-active:bg-navy data-active:text-gold data-active:shadow-lg transition-all duration-200 py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base font-bold border-2 border-navy/20 rounded-lg hover:border-gold/50"
            >
              All ({agents.length})
            </TabsTrigger>
            <TabsTrigger 
              value="local" 
              className="data-active:bg-navy data-active:text-gold data-active:shadow-lg transition-all duration-200 py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base font-bold border-2 border-navy/20 rounded-lg hover:border-gold/50"
            >
              Local ({localAgents.length})
            </TabsTrigger>
            <TabsTrigger 
              value="regional" 
              className="data-active:bg-navy data-active:text-gold data-active:shadow-lg transition-all duration-200 py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base font-bold border-2 border-navy/20 rounded-lg hover:border-gold/50"
            >
              Regional ({regionalAgents.length})
            </TabsTrigger>
            <TabsTrigger 
              value="nationwide" 
              className="data-active:bg-navy data-active:text-gold data-active:shadow-lg transition-all duration-200 py-3 sm:py-4 px-3 sm:px-6 text-sm sm:text-base font-bold border-2 border-navy/20 rounded-lg hover:border-gold/50"
            >
              Nationwide ({nationwideAgents.length})
            </TabsTrigger>
          </TabsList>

          {/* All Agents Tab */}
          <TabsContent value="all" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-navy mb-2">All Agents</h2>
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
              <h2 className="text-2xl font-bold text-navy mb-2">Local Agents</h2>
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
              <h2 className="text-2xl font-bold text-navy mb-2">Regional Agents</h2>
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
              <h2 className="text-2xl font-bold text-navy mb-2">Nationwide Agents</h2>
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
        <div className="text-center mt-12 p-6 sm:p-8 bg-navy text-white rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gold">Ready to Find Your Perfect Agent?</h2>
          <p className="mb-4 sm:mb-6 opacity-90 max-w-2xl mx-auto text-sm sm:text-base">
            Get personalized recommendations based on your property needs and location. 
            Our AI-powered matching system connects you with the best agents for your requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="px-6 py-3 bg-gold text-navy font-semibold rounded-lg hover:bg-gold/90 transition-colors text-sm sm:text-base">
              Get Matched
            </button>
            <a 
              href="/find-an-agent"
              className="px-6 py-3 border border-gold text-gold font-semibold rounded-lg hover:bg-gold/10 transition-colors text-sm sm:text-base inline-block"
            >
              Advanced Search
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
