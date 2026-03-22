import dynamic from 'next/dynamic'
import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import StatsBar from '@/components/home/StatsBar'
import { agents } from '@/data/agents'
import { testimonials } from '@/data/testimonials'
import { stats } from '@/data/stats'

// Below the fold — dynamically imported
const FeaturedAgents = dynamic(() => import('@/components/home/FeaturedAgents'), {
  loading: () => import('@/components/home/skeletons/FeaturedAgentsSkeleton').then(mod => mod.default()),
})

const Testimonials = dynamic(() => import('@/components/home/Testimonials'), {
  loading: () => import('@/components/home/skeletons/SectionSkeleton').then(mod => mod.default()),
})

const WhyEstateFlow = dynamic(() => import('@/components/home/WhyEstateFlow'), {
  loading: () => import('@/components/home/skeletons/SectionSkeleton').then(mod => mod.default()),
})

const AgentCTABanner = dynamic(() => import('@/components/home/AgentCTABanner'), {
  loading: () => import('@/components/home/skeletons/SectionSkeleton').then(mod => mod.default()),
})

export default function HomePage() {
  // Show all agents in the featured section with tab filtering
  const displayAgents = agents

  return (
    <main>
      <Hero />
      <HowItWorks />
      <StatsBar stats={stats} />
      <FeaturedAgents agents={displayAgents} />
      <Testimonials testimonials={testimonials} />
      <WhyEstateFlow />
      <AgentCTABanner />
    </main>
  )
}
