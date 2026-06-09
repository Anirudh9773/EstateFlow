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
  trustpilot_username?: string | null
  trustpilot_rating?: number | null
  trustpilot_review_count?: number | null
  allagents_username?: string | null
  allagents_rating?: number | null
  allagents_review_count?: number | null
  google_place_id?: string | null
  google_rating?: number | null
  google_review_count?: number | null
  ratings_last_synced_at?: string | null
}
