export interface Agent {
  id: string
  name: string
  agency: string
  location: string
  postcode: string
  avatar: string
  bio: string
  specialisations: string[]
  coverageAreas: string[]
  tier: 'local' | 'regional' | 'nationwide'
  rating: number
  reviewCount: number
  leadsHandled: number
  yearsExperience: number
  responseTime: string
  verified: boolean
  featured: boolean
  commission: number
  fee: string
}
