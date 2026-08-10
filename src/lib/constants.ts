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
