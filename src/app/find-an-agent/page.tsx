import { agents as staticAgents } from '@/data/agents'
import { fetchVerifiedAgents } from '@/lib/agents/fetchAgents'
import FindAgentClient from './FindAgentClient'

export default async function FindAgentPage() {
  // Fetch dynamic agents from database
  const dynamicAgents = await fetchVerifiedAgents()
  
  // Combine static and dynamic agents
  const allAgents = [...dynamicAgents, ...staticAgents]
  
  return <FindAgentClient agents={allAgents} />
}
