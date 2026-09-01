export const SITE_NAME = 'EstateFlow'
export const SITE_TAGLINE = 'Where properties meet the right agent'
export const SITE_EMAIL = 'hello@estateflow.co.uk'
export const SITE_PHONE = '+44 20 0000 0000'
export const SITE_ADDRESS = '12 Bishopsgate, London EC2N 4AJ'

export const AGENT_TIERS = {
  local: 'Local',
  regional: 'Regional',
  nationwide: 'Nationwide',
} as const

export const ROUTES = {
  home: '/',
  submitProperty: '/submit-property',
  findAgent: '/find-an-agent',
  agents: '/agents',
  agentDashboard: '/agent-dashboard',
  clientDashboard: '/client-dashboard',
  adminDashboard: '/admin-dashboard',
  pricing: '/pricing',
  agentPricing: '/agent-pricing',
  about: '/about',
  contact: '/contact',
  signIn: '/sign-in',
  join: '/join',
  privacy: '/privacy',
  terms: '/terms',
  checkout: '/checkout',
} as const

/** Routes where Header and Footer should be hidden */
export const HIDDEN_LAYOUT_ROUTES = [
  '/submit-property',
  '/sign-in',
  '/sign-up/client',
  '/sign-up/agent',
  '/forgot-password',
  '/verify-2fa',
  '/reset-password',
] as const

// ─── Engagement Configuration ──────────────────────────────────────
// Set to 'direct_only' to hide Mode B (open pool) at launch.
export const ENGAGEMENT_MODES_ENABLED: 'both' | 'direct_only' = 'both'

// Max agents in Mode B open pool (if fewer match, send to all that do)
export const OPEN_POOL_SIZE = 5

// Timeout before a pending engagement auto-expires (in days)
export const PENDING_TIMEOUT_DAYS = {
  direct: 7,       // Mode A: 7 days for a specific agent to respond
  open_pool: 2,    // Mode B: 48 hours — speed is the point of this mode
} as const
