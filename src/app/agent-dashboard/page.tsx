'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  TrendingUp, 
  Settings, 
  MessageSquare, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Star,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { getInitials } from '@/lib/utils/getInitials'
import { useUser } from '@/lib/auth/useUser'
import { createSupabaseClient } from '@/lib/supabaseClient'
import { syncAgentRatings } from '@/lib/agents/ratings'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'

// Mock data for the dashboard
const mockAgent = {
  id: '1',
  name: 'Oliver Hartley',
  agency: 'Hartley & Partners',
  location: 'Kensington, London',
  postcode: 'SW7',
  avatar: 'https://ui-avatars.com/api/?name=Oliver+Hartley&background=1A1A2E&color=C9A84C&size=128',
  bio: 'Specialising in prime central London properties with over 15 years of experience in the luxury market.',
  tier: 'regional',
  rating: 4.9,
  reviewCount: 127,
  leadsHandled: 340,
  yearsExperience: 15,
  responseTime: '< 2 hours',
  verified: true,
  commission: 1.5,
  fee: '1.5% + VAT'
}

const mockLeads = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+44 20 1234 5678',
    property: '3 bed house - Chelsea',
    budget: '£850,000',
    status: 'new',
    priority: 'high',
    received: '2 hours ago',
    message: 'Looking to sell my property quickly, need an experienced agent in the Chelsea area.'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@email.com',
    phone: '+44 20 2345 6789',
    property: '2 bed flat - Kensington',
    budget: '£650,000',
    status: 'contacted',
    priority: 'medium',
    received: '5 hours ago',
    message: 'First-time buyer looking for properties in the Kensington area.'
  },
  {
    id: '3',
    name: 'Emma Williams',
    email: 'emma.w@email.com',
    phone: '+44 20 3456 7890',
    property: '4 bed house - Notting Hill',
    budget: '£1,200,000',
    status: 'qualified',
    priority: 'high',
    received: '1 day ago',
    message: 'Investment property search, looking for good rental yields in prime locations.'
  },
  {
    id: '4',
    name: 'James Brown',
    email: 'j.brown@email.com',
    phone: '+44 20 4567 8901',
    property: '1 bed flat - Knightsbridge',
    budget: '£450,000',
    status: 'closed',
    priority: 'low',
    received: '3 days ago',
    message: 'Successfully sold property, looking for investment opportunities.'
  }
]

const mockListings = [
  {
    id: '1',
    address: '42 Kensington High Street, Kensington, London SW7',
    type: '3 bed House',
    price: '£1,250,000',
    status: 'active',
    views: 1240,
    inquiries: 15,
    listed: '2 weeks ago'
  },
  {
    id: '2',
    address: '15 Chelsea Manor Gardens, Chelsea, London SW3',
    type: '2 bed Flat',
    price: '£875,000',
    status: 'active',
    views: 890,
    inquiries: 8,
    listed: '1 month ago'
  },
  {
    id: '3',
    address: '8 Notting Hill Gate, Notting Hill, London W11',
    type: '4 bed House',
    price: '£2,100,000',
    status: 'under_offer',
    views: 2100,
    inquiries: 23,
    listed: '3 weeks ago'
  }
]

const stats = [
  {
    title: 'Active Leads',
    value: '12',
    change: '+3 this week',
    changeType: 'increase',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    title: 'Properties Listed',
    value: '8',
    change: '+2 this month',
    changeType: 'increase',
    icon: Home,
    color: 'text-green-600'
  },
  {
    title: 'Response Rate',
    value: '94%',
    change: '+2% this month',
    changeType: 'increase',
    icon: MessageSquare,
    color: 'text-purple-600'
  },
  {
    title: 'Avg. Response Time',
    value: '1.8h',
    change: '-15min this week',
    changeType: 'decrease',
    icon: Clock,
    color: 'text-orange-600'
  }
]

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useUser() // Get actual logged-in user

  // Profile and Leads states
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [leads, setLeads] = useState<any[]>([])
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [savingSettings, setSavingSettings] = useState(false)
  const [syncingRatings, setSyncingRatings] = useState(false)
  const hasLoadedRef = useRef(false)

  // Settings form states
  const [fullName, setFullName] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [trustpilotUsername, setTrustpilotUsername] = useState('')
  const [allagentsUsername, setAllagentsUsername] = useState('')
  const [googlePlaceId, setGooglePlaceId] = useState('')
  
  // Manual ratings states
  const [trustpilotRating, setTrustpilotRating] = useState('')
  const [trustpilotReviewCount, setTrustpilotReviewCount] = useState('')
  const [allagentsRating, setAllagentsRating] = useState('')
  const [allagentsReviewCount, setAllagentsReviewCount] = useState('')
  const [googleRating, setGoogleRating] = useState('')
  const [googleReviewCount, setGoogleReviewCount] = useState('')

  // Handle URL hash navigation (e.g., #settings from profile page)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && sidebarItems.some(item => item.id === hash)) {
      setActiveTab(hash)
      // Clear the hash from URL after reading it
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  // Load agent profile & leads on mount
  useEffect(() => {
    if (hasLoadedRef.current) return
    async function loadAgentData() {
      if (!user) return
      setProfileLoading(true)
      setLeadsLoading(true)
      try {
        const supabase = createSupabaseClient()
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (data) {
          setProfile(data)
          setFullName(data.full_name || '')
          setAgencyName(data.agency_name || '')
          setPhone(data.phone || '')
          setBio(data.bio || '')
          
          setTrustpilotUsername(data.trustpilot_username || '')
          setAllagentsUsername(data.allagents_username || '')
          setGooglePlaceId(data.google_place_id || '')
          
          // Manual fallback inputs
          setTrustpilotRating(data.trustpilot_rating?.toString() || '')
          setTrustpilotReviewCount(data.trustpilot_review_count?.toString() || '')
          setAllagentsRating(data.allagents_rating?.toString() || '')
          setAllagentsReviewCount(data.allagents_review_count?.toString() || '')
          setGoogleRating(data.google_rating?.toString() || '')
          setGoogleReviewCount(data.google_review_count?.toString() || '')
          
          hasLoadedRef.current = true
        }

        // Fetch matched properties as leads
        const { getAgentProperties } = await import('@/lib/auth/actions')
        const result = await getAgentProperties()
        if (result?.success && result.data) {
          setLeads(result.data)
        }
      } catch (err) {
        console.error('Error loading agent dashboard data:', err)
      } finally {
        setProfileLoading(false)
        setLeadsLoading(false)
      }
    }
    loadAgentData()
  }, [user])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSavingSettings(true)

    try {
      const supabase = createSupabaseClient()
      
      const updates = {
        full_name: fullName,
        agency_name: agencyName,
        phone: phone || null,
        bio: bio || null,
        trustpilot_username: trustpilotUsername || null,
        allagents_username: allagentsUsername || null,
        google_place_id: googlePlaceId || null,
        
        // Convert input values to numbers or nulls
        trustpilot_rating: trustpilotRating !== '' ? parseFloat(trustpilotRating) : null,
        trustpilot_review_count: trustpilotReviewCount !== '' ? parseInt(trustpilotReviewCount, 10) : 0,
        allagents_rating: allagentsRating !== '' ? parseFloat(allagentsRating) : null,
        allagents_review_count: allagentsReviewCount !== '' ? parseInt(allagentsReviewCount, 10) : 0,
        google_rating: googleRating !== '' ? parseFloat(googleRating) : null,
        google_review_count: googleReviewCount !== '' ? parseInt(googleReviewCount, 10) : 0,
        
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('agents')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single()

      if (error) {
        toast.error('Failed to save settings: ' + error.message)
      } else {
        setProfile(data)
        toast.success('Settings updated successfully!')
      }
    } catch (err) {
      console.error('Error saving settings:', err)
      toast.error('An unexpected error occurred while saving settings.')
    } finally {
      setSavingSettings(false)
    }
  }

  const handleSyncRatings = async () => {
    if (!profile) return
    setSyncingRatings(true)
    toast.info('Starting ratings synchronization...')

    try {
      // First save current profile inputs so usernames are stored in database
      const supabase = createSupabaseClient()
      await supabase.from('agents').update({
        trustpilot_username: trustpilotUsername || null,
        allagents_username: allagentsUsername || null,
        google_place_id: googlePlaceId || null,
      }).eq('id', profile.id)

      const result = await syncAgentRatings(profile.id)

      if (result.error) {
        toast.error(result.error)
      } else if (result.warning) {
        toast.warning(result.message)
        
        // Reload new profile settings from database to display saved usernames
        const { data } = await supabase
          .from('agents')
          .select('*')
          .eq('id', profile.id)
          .single()
        
        if (data) {
          setProfile(data)
        }
      } else {
        toast.success('Ratings synchronized successfully!')
        
        // Reload new profile settings from database to display new numbers
        const { data } = await supabase
          .from('agents')
          .select('*')
          .eq('id', profile.id)
          .single()
        
        if (data) {
          setProfile(data)
          setTrustpilotRating(data.trustpilot_rating?.toString() || '')
          setTrustpilotReviewCount(data.trustpilot_review_count?.toString() || '')
          setAllagentsRating(data.allagents_rating?.toString() || '')
          setAllagentsReviewCount(data.allagents_review_count?.toString() || '')
          setGoogleRating(data.google_rating?.toString() || '')
          setGoogleReviewCount(data.google_review_count?.toString() || '')
        }
      }
    } catch (err) {
      console.error('Error syncing ratings:', err)
      toast.error('Failed to sync ratings.')
    } finally {
      setSyncingRatings(false)
    }
  }

  // Use actual user data instead of mock data
  const agentName = profile?.full_name || user?.user_metadata?.full_name || 'Agent'
  const agentAgency = profile?.agency_name || user?.user_metadata?.agency_name || 'Your Agency'

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'listings', label: 'Listings', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'qualified': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'under_offer': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white shadow-md lg:min-h-screen lg:flex lg:flex-col">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-[var(--color-navy)]">EstateFlow</h2>
            <p className="text-sm text-gray-600">Agent Dashboard</p>
          </div>

          {/* Mobile Profile Summary */}
          <div className="lg:hidden px-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-[var(--color-gold)]">
                <AvatarFallback className="bg-[var(--color-navy)] text-[var(--color-gold)] text-lg font-semibold">
                  {getInitials(agentName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{agentName}</p>
                <p className="text-xs text-gray-500 truncate">{agentAgency}</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-6 flex-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-[var(--color-gold)]/10 text-[var(--color-gold)] border-r-2 border-[var(--color-gold)]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Agent Profile Summary - Desktop */}
          <div className="hidden lg:block p-6 border-t border-gray-200 bg-white mt-auto">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12 border-2 border-[var(--color-gold)]">
                <AvatarFallback className="bg-[var(--color-navy)] text-[var(--color-gold)] text-lg font-semibold">
                  {getInitials(agentName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{agentName}</p>
                <p className="text-xs text-gray-500 truncate">{agentAgency}</p>
              </div>
            </div>
            <Link href="/agent-dashboard/profile">
              <Button variant="outline" size="sm" className="w-full border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white">
                View Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="mb-6 lg:mb-8 border-b border-gray-200 pb-5">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {sidebarItems.find(item => item.id === activeTab)?.label}
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {agentName}! Here's what's happening with your business.
            </p>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            <p className={`text-sm mt-2 flex items-center ${
                              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {stat.changeType === 'increase' ? (
                                <ArrowUp className="w-4 h-4 mr-1" />
                              ) : (
                                <ArrowDown className="w-4 h-4 mr-1" />
                              )}
                              {stat.change}
                            </p>
                          </div>
                          <Icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Recent Leads and Listings */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Recent Leads */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">Recent Leads</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab('leads')}
                      >
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leadsLoading ? (
                        <div className="flex flex-col items-center justify-center py-6 gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-navy)]" />
                          <span className="text-sm text-gray-500 font-medium">Loading matched leads...</span>
                        </div>
                      ) : leads.length === 0 ? (
                        <div className="text-center py-6 text-sm text-gray-500">
                          No matching leads in your area of operation ({profile?.area_of_operation || 'None'}).
                        </div>
                      ) : (
                        leads.slice(0, 3).map((lead) => (
                          <div key={lead.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-200 rounded-lg gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-slate-800 truncate">{lead.client_name}</p>
                                <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 font-medium capitalize shrink-0">
                                  {lead.intent === 'letting-selling' ? 'Letting & Selling' : lead.intent}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 truncate">
                                {lead.bedroom_count} {lead.property_type} in {lead.postcode}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Budget/Value: {lead.intent === 'renting' ? `£${lead.budget.toLocaleString()} PCM` : `£${lead.budget.toLocaleString()}`}
                              </p>
                            </div>
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0 capitalize px-2 font-semibold">
                              {lead.timeline}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Listings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">Active Listings</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab('listings')}
                      >
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockListings.slice(0, 3).map((listing) => (
                        <div key={listing.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-200 rounded-lg gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{listing.type}</p>
                            <p className="text-sm text-gray-600 truncate">{listing.address}</p>
                            <p className="text-xs text-gray-500 mt-1">{listing.listed}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-medium text-gray-900">{listing.price}</p>
                            <Badge className={getStatusColor(listing.status)}>
                              {listing.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Leads Tab */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Leads</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search leads..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left p-3 font-medium text-gray-900">Lead</th>
                          <th className="text-left p-3 font-medium text-gray-900">Property</th>
                          <th className="text-left p-3 font-medium text-gray-900">Budget</th>
                          <th className="text-left p-3 font-medium text-gray-900">Status</th>
                          <th className="text-left p-3 font-medium text-gray-900">Priority</th>
                          <th className="text-left p-3 font-medium text-gray-900">Received</th>
                          <th className="text-left p-3 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leadsLoading ? (
                          <tr>
                            <td colSpan={7} className="text-center p-8">
                              <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin text-[var(--color-navy)]" />
                                <span className="text-sm text-gray-500">Loading leads...</span>
                              </div>
                            </td>
                          </tr>
                        ) : leads.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center p-8 text-sm text-gray-500">
                              No matching leads found in your area of operation ({profile?.area_of_operation || 'None'}).
                            </td>
                          </tr>
                        ) : (
                          leads
                            .filter(lead => {
                              if (!searchTerm) return true
                              const term = searchTerm.toLowerCase()
                              return (
                                lead.client_name?.toLowerCase().includes(term) ||
                                lead.client_email?.toLowerCase().includes(term) ||
                                lead.postcode?.toLowerCase().includes(term) ||
                                lead.property_type?.toLowerCase().includes(term)
                              )
                            })
                            .map((lead) => (
                              <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-3">
                                  <div>
                                    <p className="font-semibold text-slate-800">{lead.client_name}</p>
                                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                                      {lead.client_email}
                                    </p>
                                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                                      {lead.client_phone}
                                    </p>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <p className="text-sm text-slate-800 font-semibold">{lead.bedroom_count} {lead.property_type}</p>
                                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    {lead.postcode}
                                  </p>
                                </td>
                                <td className="p-3">
                                  <p className="text-sm font-bold text-slate-900">
                                    {lead.intent === 'renting' ? `£${lead.budget.toLocaleString()} PCM` : `£${lead.budget.toLocaleString()}`}
                                  </p>
                                </td>
                                <td className="p-3">
                                  <Badge className={
                                    lead.intent === 'selling' 
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  }>
                                    {lead.intent === 'letting-selling' ? 'Letting & Selling' : lead.intent}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <Badge className="bg-amber-50 text-amber-700 border border-amber-200">
                                    {lead.timeline}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(lead.created_at).toLocaleDateString()}
                                  </p>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <a href={`mailto:${lead.client_email}`} className="inline-flex items-center justify-center rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800">
                                      <Mail className="w-4 h-4" />
                                    </a>
                                    <a href={`tel:${lead.client_phone}`} className="inline-flex items-center justify-center rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800">
                                      <Phone className="w-4 h-4" />
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Property Listings</h2>
                <Button className="bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Listing
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {mockListings.map((listing) => (
                  <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(listing.status)}>
                          {listing.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold text-gray-900 mb-2">{listing.type}</h3>
                      <p className="text-sm text-gray-600 mb-4">{listing.address}</p>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xl font-bold text-gray-900">{listing.price}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Views</p>
                          <p className="font-medium text-gray-900">{listing.views.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Inquiries</p>
                          <p className="font-medium text-gray-900">{listing.inquiries}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">Listed {listing.listed}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Conversion Funnel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">New Leads</span>
                        <span className="text-sm font-medium text-gray-900">45</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Contacted</span>
                        <span className="text-sm font-medium text-gray-900">32</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '71%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Qualified</span>
                        <span className="text-sm font-medium text-gray-900">18</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Closed</span>
                        <span className="text-sm font-medium text-gray-900">12</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '27%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Average Response Time</p>
                          <p className="text-xs text-gray-600">Last 30 days</p>
                        </div>
                        <p className="text-lg font-bold text-green-600">1.8 hours</p>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Lead Conversion Rate</p>
                          <p className="text-xs text-gray-600">Last 30 days</p>
                        </div>
                        <p className="text-lg font-bold text-blue-600">26.7%</p>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Customer Satisfaction</p>
                          <p className="text-xs text-gray-600">Average rating</p>
                        </div>
                        <p className="text-lg font-bold text-purple-600">4.9/5.0</p>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Revenue This Month</p>
                          <p className="text-xs text-gray-600">From closed deals</p>
                        </div>
                        <p className="text-lg font-bold text-orange-600">£18,750</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {profileLoading ? (
                <div className="flex items-center justify-center p-12 bg-white rounded-xl shadow">
                  <Loader2 className="w-8 h-8 animate-spin text-navy" />
                </div>
              ) : (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {/* Personal & Professional Details Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Details</CardTitle>
                      <CardDescription>Update your personal information and biography</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Agency Name</label>
                          <input
                            type="text"
                            value={agencyName}
                            onChange={(e) => setAgencyName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read Only)</label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                        <textarea
                          rows={4}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                          placeholder="Introduce yourself, your coverage, and your specialties..."
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ratings Integration Card */}
                  <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle>Ratings Integration</CardTitle>
                        <CardDescription>Configure identifiers to synchronize reviews automatically for free</CardDescription>
                      </div>
                      <Button
                        type="button"
                        onClick={handleSyncRatings}
                        disabled={syncingRatings}
                        className="bg-navy text-gold hover:bg-navy/90 font-medium w-full sm:w-auto"
                      >
                        {syncingRatings ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync Ratings Now
                          </>
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                            <span>Trustpilot Username</span>
                          </label>
                          <input
                            type="text"
                            value={trustpilotUsername}
                            onChange={(e) => setTrustpilotUsername(e.target.value)}
                            placeholder="e.g. savills"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                          />
                          <p className="text-xs text-gray-400 mt-1">Username from your Trustpilot profile URL</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                            <span>allAgents Slug</span>
                          </label>
                          <input
                            type="text"
                            value={allagentsUsername}
                            onChange={(e) => setAllagentsUsername(e.target.value)}
                            placeholder="e.g. savills-london"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                          />
                          <p className="text-xs text-gray-400 mt-1">Agency slug from allAgents listing URL</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                            <span>Google Place ID</span>
                          </label>
                          <input
                            type="text"
                            value={googlePlaceId}
                            onChange={(e) => setGooglePlaceId(e.target.value)}
                            placeholder="e.g. ChIJtX..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                          />
                          <p className="text-xs text-gray-400 mt-1">Google Maps location Place ID or Maps link</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Manual Override Ratings Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Manual Ratings Fallbacks</CardTitle>
                      <CardDescription>Enter metrics manually if you don't wish to use auto-sync or if Google Places API is not configured</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Trustpilot Manual Inputs */}
                        <div className="space-y-3 p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
                          <p className="font-semibold text-sm text-slate-800">Trustpilot Fallbacks</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Score (0-5)</label>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={trustpilotRating}
                                onChange={(e) => setTrustpilotRating(e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Review Count</label>
                              <input
                                type="number"
                                value={trustpilotReviewCount}
                                onChange={(e) => setTrustpilotReviewCount(e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* allAgents Manual Inputs */}
                        <div className="space-y-3 p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
                          <p className="font-semibold text-sm text-slate-800">allAgents Fallbacks</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Score (0-5)</label>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={allagentsRating}
                                onChange={(e) => setAllagentsRating(e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Review Count</label>
                              <input
                                type="number"
                                value={allagentsReviewCount}
                                onChange={(e) => setAllagentsReviewCount(e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Google My Business Manual Inputs */}
                        <div className="space-y-3 p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
                          <p className="font-semibold text-sm text-slate-800">Google Reviews Fallbacks</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Score (0-5)</label>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={googleRating}
                                onChange={(e) => setGoogleRating(e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Review Count</label>
                              <input
                                type="number"
                                value={googleReviewCount}
                                onChange={(e) => setGoogleReviewCount(e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={savingSettings}
                      className="flex-1 bg-[var(--color-navy)] text-[var(--color-gold)] hover:bg-[var(--color-navy)]/90 h-11"
                    >
                      {savingSettings ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving changes...
                        </>
                      ) : (
                        'Save All Settings'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
