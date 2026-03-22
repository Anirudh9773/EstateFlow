import Link from 'next/link'
import type { Agent } from '@/types/agent'
import { Button } from '@/components/ui/button'
import { SectionLabel, GoldDivider } from '@/components/ui'
import AgentFilterTabs from './AgentFilterTabs'
import { ROUTES } from '@/lib/constants'

interface FeaturedAgentsProps {
  agents: Agent[]
}

export default function FeaturedAgents({ agents }: FeaturedAgentsProps) {
  return (
    <section id="agents" className="bg-surface py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <SectionLabel>OUR AGENTS</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-semibold text-navy mt-3">
            Meet our top-rated agents
          </h2>
          <GoldDivider className="mx-auto mt-5 mb-3" />
          <p className="text-text-secondary max-w-2xl mx-auto">
            Verified professionals covering every corner of the UK
          </p>
        </div>

        {/* Dynamic Filter Tabs */}
        <div className="mt-10">
          <AgentFilterTabs agents={agents} />
        </div>

        {/* View all button */}
        <div className="mt-10 text-center">
          <Link href={ROUTES.agents}>
            <Button
              variant="outline"
              className="border-navy text-navy hover:bg-navy hover:text-gold px-8"
            >
              View all agents →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
