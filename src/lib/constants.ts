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
  submitLead: '/submit-lead',
  submitProperty: '/submit-property',
  agents: '/agents',
  pricing: '/pricing',
  about: '/about',
  contact: '/contact',
  login: '/login',
  dashboard: '/dashboard',
} as const
