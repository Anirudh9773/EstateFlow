/**
 * Engagement Type Definitions
 *
 * TypeScript interfaces for the property_engagements table and related
 * engagement workflow types.
 */

// ─── Status & Mode enums ───────────────────────────────────────────

export type EngagementStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'withdrawn'
  | 'expired'
  | 'cancelled'
  | 'completed'

export type EngagementMode = 'direct' | 'open_pool'

export type CancelledByParty = 'client' | 'agent'

// ─── Main engagement row ───────────────────────────────────────────

export interface PropertyEngagement {
  id: string
  property_id: string
  client_id: string
  agent_id: string
  status: EngagementStatus
  engagement_mode: EngagementMode
  cancelled_by: CancelledByParty | null
  cancellation_reason: string | null       // Verbatim free-text — admin-only
  cancellation_category: string | null     // Neutral label shown to the other party
  decline_reason: string | null
  notes: string | null
  requested_at: string
  responded_at: string | null
  created_at: string
  updated_at: string
}

// ─── Joined views used by dashboards ───────────────────────────────

/** Engagement with agent profile info — used on Client Dashboard */
export interface ClientEngagementView extends PropertyEngagement {
  agent_name: string | null
  agent_email: string | null
  agent_agency: string | null
  agent_phone: string | null
}

/** Engagement with property + client info — used on Agent Dashboard */
export interface AgentEngagementView extends PropertyEngagement {
  property_intent: string | null
  property_postcode: string | null
  property_type: string | null
  property_bedroom_count: string | null
  property_budget: number | null
  property_timeline: string | null
  client_name: string | null
  client_email: string | null
  client_phone: string | null
}

// ─── Cancellation reason presets ───────────────────────────────────

/** Client-facing presets (shown in client cancel modal) */
export const CLIENT_CANCELLATION_PRESETS = [
  'Unresponsive agent',
  'Found a different way to sell/buy',
  'Concerns after viewing agent profile/reviews',
  'Response time too slow',
  'Changed my mind about the property',
  'Other',
] as const

/** Agent-facing presets (shown in agent cancel modal) */
export const AGENT_CANCELLATION_PRESETS = [
  'Property not a good fit for my expertise',
  'Client is unresponsive',
  'Property details don\'t match expectations',
  'Capacity / workload issues',
  'Other',
] as const

// ─── Neutral category mapping ──────────────────────────────────────
// When a client cancels, the agent sees one of these neutral labels
// instead of the client's verbatim reason.

export const CLIENT_REASON_TO_NEUTRAL_CATEGORY: Record<string, string> = {
  'Unresponsive agent': 'Client chose a different agent',
  'Found a different way to sell/buy': 'Client is no longer looking for an agent',
  'Concerns after viewing agent profile/reviews': 'Client chose a different agent',
  'Response time too slow': 'Client found response time too slow',
  'Changed my mind about the property': 'Client is no longer looking for an agent',
  'Other': 'Client ended the engagement',
}

// When an agent cancels, the client sees one of these neutral labels
export const AGENT_REASON_TO_NEUTRAL_CATEGORY: Record<string, string> = {
  'Property not a good fit for my expertise': 'Agent is unable to take on this property',
  'Client is unresponsive': 'Agent ended the engagement',
  'Property details don\'t match expectations': 'Agent is unable to take on this property',
  'Capacity / workload issues': 'Agent is currently at capacity',
  'Other': 'Agent ended the engagement',
}

// ─── Status display helpers ────────────────────────────────────────

export const ENGAGEMENT_STATUS_LABELS: Record<EngagementStatus, string> = {
  pending: 'Pending',
  accepted: 'Active',
  declined: 'Declined',
  withdrawn: 'Withdrawn',
  expired: 'Expired',
  cancelled: 'Cancelled',
  completed: 'Completed',
}

export const ENGAGEMENT_STATUS_COLORS: Record<EngagementStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  accepted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  declined: 'bg-red-500/15 text-red-400 border-red-500/30',
  withdrawn: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  expired: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
  completed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
}
