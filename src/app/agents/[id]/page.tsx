"use client"

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Award,
  Briefcase,
  Star,
  CheckCircle,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { getInitials } from '@/lib/utils/getInitials'
import StarRating from '@/components/ui/StarRating'
import { agents as realAgents } from '@/data/agents'
import { fetchAgentById } from '@/lib/agents/fetchAgents'
import type { Agent } from '@/types/agent'

// This would come from your database in production
// For now, we'll use the same dummy data structure
const getAllAgents = () => {
  const localAgents = [
    {
      id: "local-1",
      name: "Sarah Mitchell",
      agency: "Mitchell Properties",
      location: "SW1A, London",
      postcode: "SW1A",
      avatar: "",
      bio: "Specializing in residential properties in Central London",
      specialisations: ["Residential Sales", "Lettings", "Valuations"],
      coverageAreas: ["SW1A", "SW1H", "SW1V"],
      tier: "local" as const,
      rating: 4.8,
      reviewCount: 127,
      leadsHandled: 89,
      yearsExperience: 8,
      responseTime: "2 hours",
      verified: true,
      featured: true,
      commission: 1.5,
      fee: "1.5% commission"
    },
    {
      id: "local-2",
      name: "James Thompson",
      agency: "Thompson & Co",
      location: "EC1A, London",
      postcode: "EC1A",
      avatar: "",
      bio: "Expert in commercial and residential properties",
      specialisations: ["Commercial Property", "Investment Properties", "Residential Sales"],
      coverageAreas: ["EC1A", "EC1M", "EC1N"],
      tier: "local" as const,
      rating: 4.6,
      reviewCount: 94,
      leadsHandled: 76,
      yearsExperience: 6,
      responseTime: "1 hour",
      verified: true,
      featured: false,
      commission: 1.8,
      fee: "1.8% commission"
    },
    {
      id: "local-3",
      name: "Emma Wilson",
      agency: "Wilson Estate Agents",
      location: "W1A, London",
      postcode: "W1A",
      avatar: "",
      bio: "Luxury property specialist in Mayfair and surrounding areas",
      specialisations: ["Luxury Properties", "New Developments", "Valuations"],
      coverageAreas: ["W1A", "W1B", "W1S"],
      tier: "local" as const,
      rating: 4.9,
      reviewCount: 156,
      leadsHandled: 102,
      yearsExperience: 10,
      responseTime: "3 hours",
      verified: true,
      featured: true,
      commission: 2.0,
      fee: "2.0% commission"
    },
    {
      id: "local-4",
      name: "David Brown",
      agency: "Brown Properties",
      location: "NW1A, London",
      postcode: "NW1A",
      avatar: "",
      bio: "Family homes and apartments specialist",
      specialisations: ["Residential Sales", "Lettings & Property Management", "Auctions"],
      coverageAreas: ["NW1A", "NW1W", "NW3"],
      tier: "local" as const,
      rating: 4.5,
      reviewCount: 78,
      leadsHandled: 65,
      yearsExperience: 5,
      responseTime: "4 hours",
      verified: false,
      featured: false,
      commission: 1.2,
      fee: "1.2% commission"
    }
  ]

  const cityAgents = [
    {
      id: "city-1",
      name: "Michael Roberts",
      agency: "City Property Group",
      location: "London City",
      postcode: "EC2A",
      avatar: "",
      bio: "Commercial property expert serving the entire London area",
      specialisations: ["Commercial Property", "Investment Properties", "Land & Rural"],
      coverageAreas: ["EC1", "EC2", "EC3", "EC4"],
      tier: "regional" as const,
      rating: 4.7,
      reviewCount: 203,
      leadsHandled: 145,
      yearsExperience: 12,
      responseTime: "1 hour",
      verified: true,
      featured: true,
      commission: 2.5,
      fee: "2.5% commission"
    },
    {
      id: "city-2",
      name: "Lisa Anderson",
      agency: "Anderson London",
      location: "Greater London",
      postcode: "N1C",
      avatar: "",
      bio: "Comprehensive property services across London boroughs",
      specialisations: ["Residential Sales", "Lettings & Property Management", "New Developments"],
      coverageAreas: ["N", "E", "SE", "SW", "NW"],
      tier: "regional" as const,
      rating: 4.4,
      reviewCount: 167,
      leadsHandled: 118,
      yearsExperience: 7,
      responseTime: "2 hours",
      verified: true,
      featured: false,
      commission: 1.8,
      fee: "1.8% commission"
    },
    {
      id: "city-3",
      name: "Robert Taylor",
      agency: "Taylor Metropolitan",
      location: "London Metropolitan",
      postcode: "WC2H",
      avatar: "",
      bio: "Urban development and city properties specialist",
      specialisations: ["New Developments", "Commercial Property", "Investment Properties"],
      coverageAreas: ["WC1", "WC2", "EC1", "EC2"],
      tier: "regional" as const,
      rating: 4.6,
      reviewCount: 189,
      leadsHandled: 134,
      yearsExperience: 9,
      responseTime: "3 hours",
      verified: true,
      featured: true,
      commission: 2.2,
      fee: "2.2% commission"
    },
    {
      id: "city-4",
      name: "Jennifer White",
      agency: "White City Properties",
      location: "London City & Suburbs",
      postcode: "E14",
      avatar: "",
      bio: "City and suburban property expert",
      specialisations: ["Residential Sales", "Lettings", "Valuations"],
      coverageAreas: ["E", "EC", "N", "EN"],
      tier: "regional" as const,
      rating: 4.3,
      reviewCount: 145,
      leadsHandled: 98,
      yearsExperience: 6,
      responseTime: "4 hours",
      verified: false,
      featured: false,
      commission: 1.5,
      fee: "1.5% commission"
    }
  ]

  const stateAgents = [
    {
      id: "state-1",
      name: "Christopher Evans",
      agency: "Evans Regional",
      location: "South East England",
      postcode: "RG1",
      avatar: "",
      bio: "Regional specialist covering multiple counties",
      specialisations: ["Residential Sales", "Land & Rural", "Investment Properties"],
      coverageAreas: ["Berkshire", "Surrey", "Hampshire", "Sussex"],
      tier: "regional" as const,
      rating: 4.5,
      reviewCount: 234,
      leadsHandled: 178,
      yearsExperience: 15,
      responseTime: "6 hours",
      verified: true,
      featured: true,
      commission: 2.8,
      fee: "2.8% commission"
    },
    {
      id: "state-2",
      name: "Amanda Harris",
      agency: "Harris Counties",
      location: "South West England",
      postcode: "BS1",
      avatar: "",
      bio: "Multi-county property expert",
      specialisations: ["Residential Sales", "Lettings & Property Management", "Valuations"],
      coverageAreas: ["Bristol", "Somerset", "Devon", "Cornwall"],
      tier: "regional" as const,
      rating: 4.4,
      reviewCount: 198,
      leadsHandled: 156,
      yearsExperience: 11,
      responseTime: "8 hours",
      verified: true,
      featured: false,
      commission: 2.3,
      fee: "2.3% commission"
    },
    {
      id: "state-3",
      name: "Daniel Clark",
      agency: "Clark Regional",
      location: "Midlands",
      postcode: "B1",
      avatar: "",
      bio: "Midlands property specialist",
      specialisations: ["Commercial Property", "Residential Sales", "Auctions"],
      coverageAreas: ["Birmingham", "Coventry", "Wolverhampton", "Nottingham"],
      tier: "regional" as const,
      rating: 4.2,
      reviewCount: 167,
      leadsHandled: 134,
      yearsExperience: 8,
      responseTime: "12 hours",
      verified: false,
      featured: false,
      commission: 2.0,
      fee: "2.0% commission"
    },
    {
      id: "state-4",
      name: "Sophie Martin",
      agency: "Martin Counties",
      location: "North of England",
      postcode: "M1",
      avatar: "",
      bio: "Northern England property expert",
      specialisations: ["Residential Sales", "Lettings", "New Developments"],
      coverageAreas: ["Manchester", "Leeds", "York", "Newcastle"],
      tier: "regional" as const,
      rating: 4.6,
      reviewCount: 212,
      leadsHandled: 189,
      yearsExperience: 13,
      responseTime: "4 hours",
      verified: true,
      featured: true,
      commission: 2.5,
      fee: "2.5% commission"
    }
  ]

  const nationalAgents = [
    {
      id: "national-1",
      name: "Alexander King",
      agency: "King National",
      location: "United Kingdom",
      postcode: "SW1A",
      avatar: "",
      bio: "Nationwide property expert with extensive UK coverage",
      specialisations: ["Commercial Property", "Investment Properties", "Land & Rural"],
      coverageAreas: ["England", "Scotland", "Wales", "Northern Ireland"],
      tier: "nationwide" as const,
      rating: 4.8,
      reviewCount: 456,
      leadsHandled: 367,
      yearsExperience: 20,
      responseTime: "24 hours",
      verified: true,
      featured: true,
      commission: 3.5,
      fee: "3.5% commission"
    },
    {
      id: "national-2",
      name: "Victoria Queen",
      agency: "Queen Nationwide",
      location: "UK Wide",
      postcode: "EC1A",
      avatar: "",
      bio: "Comprehensive UK property services",
      specialisations: ["Residential Sales", "Lettings & Property Management", "Valuations"],
      coverageAreas: ["All UK Counties"],
      tier: "nationwide" as const,
      rating: 4.6,
      reviewCount: 389,
      leadsHandled: 298,
      yearsExperience: 16,
      responseTime: "12 hours",
      verified: true,
      featured: true,
      commission: 3.0,
      fee: "3.0% commission"
    },
    {
      id: "national-3",
      name: "William Prince",
      agency: "Prince UK Properties",
      location: "Great Britain",
      postcode: "W1A",
      avatar: "",
      bio: "National property investment specialist",
      specialisations: ["Investment Properties", "New Developments", "Commercial Property"],
      coverageAreas: ["Major UK Cities", "Investment Hotspots"],
      tier: "nationwide" as const,
      rating: 4.5,
      reviewCount: 324,
      leadsHandled: 267,
      yearsExperience: 14,
      responseTime: "18 hours",
      verified: true,
      featured: false,
      commission: 3.2,
      fee: "3.2% commission"
    },
    {
      id: "national-4",
      name: "Elizabeth Royal",
      agency: "Royal Estate Group",
      location: "United Kingdom",
      postcode: "NW1A",
      avatar: "",
      bio: "Luxury and premium property specialist nationwide",
      specialisations: ["Luxury Properties", "Valuations", "Auctions"],
      coverageAreas: ["Premium UK Locations"],
      tier: "nationwide" as const,
      rating: 4.7,
      reviewCount: 412,
      leadsHandled: 345,
      yearsExperience: 18,
      responseTime: "6 hours",
      verified: true,
      featured: true,
      commission: 4.0,
      fee: "4.0% commission"
    }
  ]

  return [...localAgents, ...cityAgents, ...stateAgents, ...nationalAgents, ...realAgents]
}

export default function PublicAgentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.id as string
  
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAgent() {
      try {
        // Try to fetch from database first
        const dbAgent = await fetchAgentById(agentId)
        
        if (dbAgent) {
          setAgent(dbAgent)
        } else {
          // If not found in database, try static agents
          const allStaticAgents = getAllAgents()
          const staticAgent = allStaticAgents.find(a => a.id === agentId)
          setAgent(staticAgent || null)
        }
      } catch (error) {
        console.error('Error loading agent:', error)
        // Fallback to static agents
        const allStaticAgents = getAllAgents()
        const staticAgent = allStaticAgents.find(a => a.id === agentId)
        setAgent(staticAgent || null)
      } finally {
        setLoading(false)
      }
    }
    
    loadAgent()
  }, [agentId])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-gold)] mx-auto mb-4" />
          <p className="text-gray-600">Loading agent profile...</p>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Agent not found</p>
            <Button onClick={() => router.push('/agents')}>
              Back to Agents
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getTierLabel = (tier: string) => {
    const tierMap: Record<string, string> = {
      'local': 'Local Specialist',
      'regional': 'Regional Expert',
      'nationwide': 'Nationwide Coverage'
    }
    return tierMap[tier] || tier
  }

  const getTierColor = (tier: string) => {
    const colorMap: Record<string, string> = {
      'local': 'bg-blue-100 text-blue-800',
      'regional': 'bg-purple-100 text-purple-800',
      'nationwide': 'bg-green-100 text-green-800'
    }
    return colorMap[tier] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.push('/agents')}
          className="mb-6 border-navy text-navy hover:bg-navy hover:text-gold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Agents
        </Button>

        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-[var(--color-gold)] flex-shrink-0">
                {agent.avatar && <AvatarImage src={agent.avatar} alt={agent.name} />}
                <AvatarFallback className="bg-[var(--color-navy)] text-[var(--color-gold)] text-3xl sm:text-4xl font-bold">
                  {getInitials(agent.name)}
                </AvatarFallback>
              </Avatar>

              {/* Basic Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{agent.name}</h1>
                  {agent.verified && (
                    <Badge className="bg-green-100 text-green-800 w-fit mx-auto sm:mx-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Agent
                    </Badge>
                  )}
                </div>
                
                <p className="text-lg text-gray-600 mb-2">{agent.agency}</p>

                <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <StarRating rating={agent.rating} size="md" />
                    <span className="font-semibold text-gray-900">{agent.rating}</span>
                    <span className="text-gray-500">({agent.reviewCount} reviews)</span>
                  </div>
                  <Badge className={getTierColor(agent.tier)}>
                    {getTierLabel(agent.tier)}
                  </Badge>
                </div>

                <p className="text-gray-700 mb-4">{agent.bio}</p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]/90">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Agent
                  </Button>
                  <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-gold">
                    <Phone className="w-4 h-4 mr-2" />
                    Request Callback
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-[var(--color-gold)] mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{agent.leadsHandled}</div>
              <div className="text-sm text-gray-600">Leads Handled</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-[var(--color-gold)] mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{agent.yearsExperience}</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-[var(--color-gold)] mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{agent.responseTime}</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-[var(--color-gold)] mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{agent.rating}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[var(--color-gold)]" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Agency / Company</label>
                <p className="text-base text-gray-900 mt-1">{agent.agency}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Service Tier</label>
                <div className="mt-1">
                  <Badge className={getTierColor(agent.tier)}>
                    {getTierLabel(agent.tier)}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Years of Experience</label>
                <div className="flex items-center gap-2 mt-1">
                  <Award className="w-4 h-4 text-[var(--color-gold)]" />
                  <p className="text-base text-gray-900">{agent.yearsExperience} years</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Commission Rate</label>
                <p className="text-base text-gray-900 mt-1">{agent.fee}</p>
              </div>
            </CardContent>
          </Card>

          {/* Coverage & Specializations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[var(--color-gold)]" />
                Coverage & Specializations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Primary Location</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-[var(--color-gold)]" />
                  <p className="text-base text-gray-900">{agent.location}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Coverage Areas</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {agent.coverageAreas.map((area) => (
                    <Badge key={area} variant="outline" className="border-navy text-navy">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Specializations</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {agent.specialisations.map((spec) => (
                    <Badge key={spec} className="bg-[var(--color-gold)]/10 text-[var(--color-navy)]">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Average Response Time</label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-[var(--color-gold)]" />
                  <p className="text-base text-gray-900">{agent.responseTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <Card className="mt-6 bg-[var(--color-navy)] text-white">
          <CardContent className="p-6 sm:p-8 text-center">
            <h2 className="text-2xl font-bold mb-3 text-[var(--color-gold)]">Ready to Work with {agent.name}?</h2>
            <p className="mb-6 opacity-90 max-w-2xl mx-auto">
              Get in touch today to discuss your property needs. {agent.name} typically responds within {agent.responseTime}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]/90">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)]">
                <Phone className="w-4 h-4 mr-2" />
                Request Callback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
