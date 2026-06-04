import { agents as staticAgents } from '@/data/agents'
import { fetchVerifiedAgents } from '@/lib/agents/fetchAgents'
import BrowseAgentsClient from './BrowseAgentsClient'

export default async function AgentsPage() {
  // Fetch dynamic agents from database
  const dynamicAgents = await fetchVerifiedAgents()
  
  // Combine static and dynamic agents
  const allAgents = [...dynamicAgents, ...staticAgents]
  
  return <BrowseAgentsClient agents={allAgents} />
}
