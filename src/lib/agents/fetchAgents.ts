import { createSupabaseClient } from '@/lib/supabaseClient'
import type { Agent } from '@/types/agent'

/**
 * Transform database agent record to Agent type for display
 */
function transformDbAgentToAgent(dbAgent: any): Agent {
  return {
    id: dbAgent.id,
    name: dbAgent.full_name,
    agency: dbAgent.agency_name || 'Independent Agent',
    location: dbAgent.location || 'UK',
    postcode: dbAgent.postcode || '',
    avatar: dbAgent.avatar || '',
    bio: dbAgent.bio || 'Experienced real estate professional',
    specialisations: dbAgent.specialisations || [],
    coverageAreas: dbAgent.coverage_areas || [],
    tier: dbAgent.tier || 'local',
    rating: parseFloat(dbAgent.rating) || 0,
    reviewCount: dbAgent.review_count || 0,
    leadsHandled: dbAgent.leads_handled || 0,
    yearsExperience: parseInt(dbAgent.years_experience) || 0,
    responseTime: dbAgent.response_time || '< 24 hours',
    verified: dbAgent.verified || false,
    featured: dbAgent.featured || false,
    commission: parseFloat(dbAgent.commission) || 1.5,
    fee: dbAgent.fee || '1.5% + VAT',
  }
}

/**
 * Fetch all agents from the database (verified only by default)
 * Use this in public-facing pages to show all verified agents
 */
export async function fetchAllAgents(includeUnverified = false): Promise<Agent[]> {
  try {
    const supabase = createSupabaseClient()
    
    let query = supabase
      .from('agents')
      .select('*')
      .order('rating', { ascending: false })
    
    // Only show verified agents unless explicitly requested
    if (!includeUnverified) {
      query = query.eq('verified', true)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching agents:', error)
      return []
    }
    
    if (!data || data.length === 0) {
      return []
    }
    
    return data.map(transformDbAgentToAgent)
  } catch (error) {
    console.error('Exception fetching agents:', error)
    return []
  }
}

/**
 * Fetch verified agents only (for public display)
 * This is the most commonly used function for public pages
 */
export async function fetchVerifiedAgents(): Promise<Agent[]> {
  return fetchAllAgents(false)
}

/**
 * Fetch a single agent by ID
 * Used for agent profile pages
 */
export async function fetchAgentById(id: string): Promise<Agent | null> {
  try {
    // Validate UUID format to prevent database syntax errors on static mock IDs (e.g. 'local-1')
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return null
    }

    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error || !data) {
      console.error('Error fetching agent:', error)
      return null
    }
    
    return transformDbAgentToAgent(data)
  } catch (error) {
    console.error('Exception fetching agent:', error)
    return null
  }
}

/**
 * Fetch agents by tier
 * Used for filtering on Browse Agents page
 */
export async function fetchAgentsByTier(tier: 'local' | 'regional' | 'nationwide'): Promise<Agent[]> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('tier', tier)
      .eq('verified', true)
      .order('rating', { ascending: false })
    
    if (error || !data) {
      console.error('Error fetching agents by tier:', error)
      return []
    }
    
    return data.map(transformDbAgentToAgent)
  } catch (error) {
    console.error('Exception fetching agents by tier:', error)
    return []
  }
}

/**
 * Fetch featured agents
 * Used for homepage or featured sections
 */
export async function fetchFeaturedAgents(): Promise<Agent[]> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('featured', true)
      .eq('verified', true)
      .order('rating', { ascending: false })
      .limit(6)
    
    if (error || !data) {
      console.error('Error fetching featured agents:', error)
      return []
    }
    
    return data.map(transformDbAgentToAgent)
  } catch (error) {
    console.error('Exception fetching featured agents:', error)
    return []
  }
}

/**
 * Search agents by name, agency, or location
 * Used for search functionality
 */
export async function searchAgents(searchTerm: string): Promise<Agent[]> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('verified', true)
      .or(`full_name.ilike.%${searchTerm}%,agency_name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
      .order('rating', { ascending: false })
    
    if (error || !data) {
      console.error('Error searching agents:', error)
      return []
    }
    
    return data.map(transformDbAgentToAgent)
  } catch (error) {
    console.error('Exception searching agents:', error)
    return []
  }
}
