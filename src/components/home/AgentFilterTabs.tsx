'use client'

import { useState } from 'react'
import type { Agent } from '@/types/agent'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import AgentCard from '@/components/agents/AgentCard'

interface AgentFilterTabsProps {
  agents: Agent[]
}

export default function AgentFilterTabs({ agents }: AgentFilterTabsProps) {
  const cities = [
    { value: 'all', label: 'All' },
    { value: 'london', label: 'London' },
    { value: 'manchester', label: 'Manchester' },
    { value: 'birmingham', label: 'Birmingham' },
    { value: 'bristol', label: 'Bristol' },
  ]

  const filterAgentsByCity = (city: string) => {
    if (city === 'all') return agents
    return agents.filter((agent) =>
      agent.location.toLowerCase().includes(city.toLowerCase())
    )
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      {/* Tab List */}
      <div className="w-full overflow-x-auto scrollbar-none flex sm:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
        <TabsList className="inline-flex min-w-max max-w-2xl mb-8 sm:mb-10 rounded-full p-1.5 bg-slate-100/80 gap-1.5 group-data-horizontal/tabs:h-auto border border-slate-200/50 shadow-sm">
          {cities.map((city) => (
            <TabsTrigger
              key={city.value}
              value={city.value}
              className="data-active:bg-navy data-active:text-gold text-text-secondary hover:text-navy data-active:hover:text-gold rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 border-0 whitespace-nowrap cursor-pointer shadow-none data-active:shadow-md"
            >
              {city.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Tab Content */}
      {cities.map((city) => {
        const filteredAgents = filterAgentsByCity(city.value)
        
        return (
          <TabsContent
            key={city.value}
            value={city.value}
            className="mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            {filteredAgents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-in fade-in-50 duration-300">
                {filteredAgents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-4">
                  <svg
                    className="w-8 h-8 text-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  No agents found in {city.label}
                </h3>
                <p className="text-text-secondary text-sm">
                  Try selecting a different location or view all agents.
                </p>
              </div>
            )}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
