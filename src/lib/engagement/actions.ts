'use server'

import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { revalidatePath } from 'next/cache'
import { OPEN_POOL_SIZE, PENDING_TIMEOUT_DAYS } from '@/lib/constants'
import {
  CLIENT_REASON_TO_NEUTRAL_CATEGORY,
  AGENT_REASON_TO_NEUTRAL_CATEGORY,
} from '@/types/engagement'
import type {
  EngagementMode,
  CancelledByParty,
  PropertyEngagement,
  ClientEngagementView,
  AgentEngagementView,
} from '@/types/engagement'

// ─── Helper: get service-role client ────────────────────────────────

async function getAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// ─── Helper: get authenticated user ────────────────────────────────

async function requireUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Not authenticated')
  return { supabase, user }
}

// ═══════════════════════════════════════════════════════════════════
// CREATE ENGAGEMENT
// ═══════════════════════════════════════════════════════════════════

export async function createEngagement(payload: {
  propertyId: string
  mode: EngagementMode
  agentId?: string // Required for Mode A; ignored for Mode B
}) {
  const { user } = await requireUser()
  const adminClient = await getAdminClient()

  // Verify the property belongs to this client
  const { data: property, error: propError } = await adminClient
    .from('properties')
    .select('id, client_id, postcode')
    .eq('id', payload.propertyId)
    .single()

  if (propError || !property) {
    return { error: 'Property not found' }
  }
  if (property.client_id !== user.id) {
    return { error: 'You can only create engagements for your own properties' }
  }

  // Check no existing accepted engagement for this property
  const { data: existingAccepted } = await adminClient
    .from('property_engagements')
    .select('id')
    .eq('property_id', payload.propertyId)
    .eq('status', 'accepted')
    .maybeSingle()

  if (existingAccepted) {
    return { error: 'This property already has an active agent engagement' }
  }

  if (payload.mode === 'direct') {
    // ── Mode A: Direct Request ──
    if (!payload.agentId) {
      return { error: 'Agent ID is required for a direct request' }
    }

    // Verify the agent exists
    const { data: agent } = await adminClient
      .from('agents')
      .select('user_id')
      .eq('user_id', payload.agentId)
      .maybeSingle()

    if (!agent) {
      return { error: 'Selected agent not found' }
    }

    const { data, error } = await adminClient
      .from('property_engagements')
      .insert({
        property_id: payload.propertyId,
        client_id: user.id,
        agent_id: payload.agentId,
        status: 'pending',
        engagement_mode: 'direct',
        requested_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating direct engagement:', error)
      return { error: error.message }
    }

    revalidatePath('/client-dashboard')
    return { success: true, data, created: 1 }
  }

  // ── Mode B: Open Pool ──
  // Get matched agents using postcode prefix
  const cleanPostcode = (property.postcode || '').trim().toUpperCase()
  const prefixMatch = cleanPostcode.match(/^([A-Z]{1,2})/)
  const postcodePrefix = prefixMatch ? prefixMatch[1] : ''

  if (!postcodePrefix) {
    return { error: 'Cannot determine area from property postcode' }
  }

  const { data: allAgents } = await adminClient
    .from('agents')
    .select('user_id, area_of_operation')
    .not('area_of_operation', 'is', null)

  const matchedAgentIds = (allAgents || [])
    .filter(agent => {
      if (!agent.area_of_operation) return false
      // Exclude the client themselves if they happen to also be an agent
      if (agent.user_id === user.id) return false
      const areaCodes = agent.area_of_operation
        .split(',')
        .map((a: string) => a.trim().toUpperCase())
        .filter(Boolean)
      return areaCodes.some((area: string) =>
        area === postcodePrefix ||
        area === 'ALL' ||
        area === 'NATIONWIDE' ||
        area === 'PAN CITY' ||
        area === 'PAN-CITY'
      )
    })
    .map(a => a.user_id)
    .slice(0, OPEN_POOL_SIZE) // Cap at pool size; if fewer match, send to all

  if (matchedAgentIds.length === 0) {
    return { error: 'No agents currently cover your property area. Try choosing a specific agent instead.' }
  }

  // Create one engagement row per matched agent
  const rows = matchedAgentIds.map(agentId => ({
    property_id: payload.propertyId,
    client_id: user.id,
    agent_id: agentId,
    status: 'pending' as const,
    engagement_mode: 'open_pool' as const,
    requested_at: new Date().toISOString(),
  }))

  const { data, error } = await adminClient
    .from('property_engagements')
    .insert(rows)
    .select()

  if (error) {
    console.error('Error creating open pool engagements:', error)
    return { error: error.message }
  }

  revalidatePath('/client-dashboard')
  return { success: true, data, created: matchedAgentIds.length }
}

// ═══════════════════════════════════════════════════════════════════
// ACCEPT ENGAGEMENT (Agent)
// ═══════════════════════════════════════════════════════════════════

export async function acceptEngagement(engagementId: string) {
  const { user } = await requireUser()
  const adminClient = await getAdminClient()

  // Fetch the engagement
  const { data: engagement, error: fetchErr } = await adminClient
    .from('property_engagements')
    .select('*')
    .eq('id', engagementId)
    .single()

  if (fetchErr || !engagement) {
    return { error: 'Engagement not found' }
  }
  if (engagement.agent_id !== user.id) {
    return { error: 'You are not assigned to this engagement' }
  }
  if (engagement.status !== 'pending') {
    return { error: `Cannot accept an engagement that is ${engagement.status}` }
  }

  // Attempt to accept — the partial unique index will prevent duplicates
  const { error: updateErr } = await adminClient
    .from('property_engagements')
    .update({
      status: 'accepted',
      responded_at: new Date().toISOString(),
    })
    .eq('id', engagementId)

  if (updateErr) {
    // Likely the unique index fired — another agent already accepted
    if (updateErr.message?.includes('one_accepted_engagement_per_property') ||
        updateErr.code === '23505') {
      return { error: 'Another agent has already been assigned to this property' }
    }
    console.error('Error accepting engagement:', updateErr)
    return { error: updateErr.message }
  }

  // Mode B: auto-expire all sibling pending rows for the same property
  if (engagement.engagement_mode === 'open_pool') {
    await adminClient
      .from('property_engagements')
      .update({
        status: 'expired',
        responded_at: new Date().toISOString(),
      })
      .eq('property_id', engagement.property_id)
      .eq('status', 'pending')
      .eq('engagement_mode', 'open_pool')
      .neq('id', engagementId)
  }

  revalidatePath('/agent-dashboard')
  revalidatePath('/client-dashboard')
  return { success: true }
}

// ═══════════════════════════════════════════════════════════════════
// DECLINE ENGAGEMENT (Agent)
// ═══════════════════════════════════════════════════════════════════

export async function declineEngagement(engagementId: string, reason?: string) {
  const { user } = await requireUser()
  const adminClient = await getAdminClient()

  const { data: engagement } = await adminClient
    .from('property_engagements')
    .select('*')
    .eq('id', engagementId)
    .single()

  if (!engagement) return { error: 'Engagement not found' }
  if (engagement.agent_id !== user.id) return { error: 'Not your engagement' }
  if (engagement.status !== 'pending') return { error: `Cannot decline — status is ${engagement.status}` }

  const { error } = await adminClient
    .from('property_engagements')
    .update({
      status: 'declined',
      decline_reason: reason || null,
      responded_at: new Date().toISOString(),
    })
    .eq('id', engagementId)

  if (error) return { error: error.message }

  revalidatePath('/agent-dashboard')
  revalidatePath('/client-dashboard')
  return { success: true }
}

// ═══════════════════════════════════════════════════════════════════
// WITHDRAW ENGAGEMENT (Client — pre-accept only)
// ═══════════════════════════════════════════════════════════════════

export async function withdrawEngagement(engagementId: string) {
  const { user } = await requireUser()
  const adminClient = await getAdminClient()

  const { data: engagement } = await adminClient
    .from('property_engagements')
    .select('*')
    .eq('id', engagementId)
    .single()

  if (!engagement) return { error: 'Engagement not found' }
  if (engagement.client_id !== user.id) return { error: 'Not your engagement' }
  if (engagement.status !== 'pending') {
    return { error: 'Can only withdraw a pending request. Use cancel for accepted engagements.' }
  }

  const { error } = await adminClient
    .from('property_engagements')
    .update({ status: 'withdrawn' })
    .eq('id', engagementId)

  if (error) return { error: error.message }

  // If Mode B, also withdraw all sibling pending rows for same property
  if (engagement.engagement_mode === 'open_pool') {
    await adminClient
      .from('property_engagements')
      .update({ status: 'withdrawn' })
      .eq('property_id', engagement.property_id)
      .eq('client_id', user.id)
      .eq('status', 'pending')
      .eq('engagement_mode', 'open_pool')
  }

  revalidatePath('/client-dashboard')
  return { success: true }
}

// ═══════════════════════════════════════════════════════════════════
// CANCEL ENGAGEMENT (Client OR Agent — post-accept only)
// ═══════════════════════════════════════════════════════════════════

export async function cancelEngagement(
  engagementId: string,
  presetReason: string,
  freeTextReason?: string,
) {
  const { user } = await requireUser()
  const adminClient = await getAdminClient()

  const { data: engagement } = await adminClient
    .from('property_engagements')
    .select('*')
    .eq('id', engagementId)
    .single()

  if (!engagement) return { error: 'Engagement not found' }
  if (engagement.status !== 'accepted') {
    return { error: 'Can only cancel an accepted engagement' }
  }

  // Determine who is cancelling
  let cancelledBy: CancelledByParty
  if (engagement.client_id === user.id) {
    cancelledBy = 'client'
  } else if (engagement.agent_id === user.id) {
    cancelledBy = 'agent'
  } else {
    return { error: 'You are not a party to this engagement' }
  }

  // Build the verbatim reason (admin-only) from preset + optional free text
  const verbatimReason = freeTextReason
    ? `${presetReason}: ${freeTextReason}`
    : presetReason

  // Map to neutral category for the other party
  const categoryMap = cancelledBy === 'client'
    ? CLIENT_REASON_TO_NEUTRAL_CATEGORY
    : AGENT_REASON_TO_NEUTRAL_CATEGORY
  const neutralCategory = categoryMap[presetReason] || (
    cancelledBy === 'client' ? 'Client ended the engagement' : 'Agent ended the engagement'
  )

  const { error } = await adminClient
    .from('property_engagements')
    .update({
      status: 'cancelled',
      cancelled_by: cancelledBy,
      cancellation_reason: verbatimReason,
      cancellation_category: neutralCategory,
      responded_at: new Date().toISOString(),
    })
    .eq('id', engagementId)

  if (error) return { error: error.message }

  revalidatePath('/client-dashboard')
  revalidatePath('/agent-dashboard')
  return { success: true }
}

// ═══════════════════════════════════════════════════════════════════
// COMPLETE ENGAGEMENT (Agent)
// ═══════════════════════════════════════════════════════════════════

export async function completeEngagement(engagementId: string) {
  const { user } = await requireUser()
  const adminClient = await getAdminClient()

  const { data: engagement } = await adminClient
    .from('property_engagements')
    .select('*')
    .eq('id', engagementId)
    .single()

  if (!engagement) return { error: 'Engagement not found' }
  if (engagement.agent_id !== user.id) return { error: 'Not your engagement' }
  if (engagement.status !== 'accepted') {
    return { error: 'Can only complete an active engagement' }
  }

  const { error } = await adminClient
    .from('property_engagements')
    .update({
      status: 'completed',
      responded_at: new Date().toISOString(),
    })
    .eq('id', engagementId)

  if (error) return { error: error.message }

  revalidatePath('/agent-dashboard')
  revalidatePath('/client-dashboard')
  return { success: true }
}

// ═══════════════════════════════════════════════════════════════════
// GET CLIENT ENGAGEMENTS (for Client Dashboard)
// ═══════════════════════════════════════════════════════════════════

export async function getClientEngagements(propertyId?: string) {
  const { user } = await requireUser()
  const adminClient = await getAdminClient()

  let query = adminClient
    .from('property_engagements')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  if (propertyId) {
    query = query.eq('property_id', propertyId)
  }

  const { data: engagements, error } = await query

  if (error) return { error: error.message, data: [] }

  // Enrich with agent profile info
  const agentIds = [...new Set((engagements || []).map(e => e.agent_id))]

  let agentMap: Record<string, { full_name: string; email: string; agency_name: string | null; phone: string | null }> = {}
  if (agentIds.length > 0) {
    const { data: agents } = await adminClient
      .from('agents')
      .select('user_id, full_name, email, agency_name, phone')
      .in('user_id', agentIds)

    if (agents) {
      agentMap = Object.fromEntries(
        agents.map(a => [a.user_id, { full_name: a.full_name, email: a.email, agency_name: a.agency_name, phone: a.phone }])
      )
    }
  }

  const enriched: ClientEngagementView[] = (engagements || []).map(e => ({
    ...e,
    agent_name: agentMap[e.agent_id]?.full_name || null,
    agent_email: agentMap[e.agent_id]?.email || null,
    agent_agency: agentMap[e.agent_id]?.agency_name || null,
    agent_phone: agentMap[e.agent_id]?.phone || null,
  }))

  return { success: true, data: enriched }
}

// ═══════════════════════════════════════════════════════════════════
// GET AGENT ENGAGEMENTS (for Agent Dashboard)
// ═══════════════════════════════════════════════════════════════════

export async function getAgentEngagements(statusFilter?: string) {
  const { user } = await requireUser()
  const adminClient = await getAdminClient()

  let query = adminClient
    .from('property_engagements')
    .select('*')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false })

  if (statusFilter) {
    query = query.eq('status', statusFilter)
  }

  const { data: engagements, error } = await query

  if (error) return { error: error.message, data: [] }

  // Enrich with property + client info
  const propertyIds = [...new Set((engagements || []).map(e => e.property_id))]

  let propertyMap: Record<string, {
    intent: string; postcode: string; property_type: string;
    bedroom_count: string; budget: number; timeline: string;
    client_name: string; client_email: string; client_phone: string;
  }> = {}

  if (propertyIds.length > 0) {
    const { data: properties } = await adminClient
      .from('properties')
      .select('id, intent, postcode, property_type, bedroom_count, budget, timeline, client_name, client_email, client_phone')
      .in('id', propertyIds)

    if (properties) {
      propertyMap = Object.fromEntries(
        properties.map(p => [p.id, {
          intent: p.intent,
          postcode: p.postcode,
          property_type: p.property_type,
          bedroom_count: p.bedroom_count,
          budget: p.budget,
          timeline: p.timeline,
          client_name: p.client_name,
          client_email: p.client_email,
          client_phone: p.client_phone,
        }])
      )
    }
  }

  const enriched: AgentEngagementView[] = (engagements || []).map(e => ({
    ...e,
    property_intent: propertyMap[e.property_id]?.intent || null,
    property_postcode: propertyMap[e.property_id]?.postcode || null,
    property_type: propertyMap[e.property_id]?.property_type || null,
    property_bedroom_count: propertyMap[e.property_id]?.bedroom_count || null,
    property_budget: propertyMap[e.property_id]?.budget || null,
    property_timeline: propertyMap[e.property_id]?.timeline || null,
    client_name: propertyMap[e.property_id]?.client_name || null,
    client_email: propertyMap[e.property_id]?.client_email || null,
    client_phone: propertyMap[e.property_id]?.client_phone || null,
  }))

  return { success: true, data: enriched }
}

// ═══════════════════════════════════════════════════════════════════
// GET CANCELLATION COUNT (for tracking cancel-restart cycles)
// ═══════════════════════════════════════════════════════════════════

export async function getCancellationCount(propertyId: string) {
  const adminClient = await getAdminClient()

  const { count, error } = await adminClient
    .from('property_engagements')
    .select('id', { count: 'exact', head: true })
    .eq('property_id', propertyId)
    .eq('status', 'cancelled')

  if (error) return { error: error.message, count: 0 }
  return { success: true, count: count || 0 }
}
