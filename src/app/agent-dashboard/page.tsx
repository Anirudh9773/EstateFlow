'use client'

import { useState } from 'react'
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
  AlertCircle
} from 'lucide-react'
import { getInitials } from '@/lib/utils/getInitials'
import { useUser } from '@/lib/auth/useUser'

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

  // Use actual user data instead of mock data
  const agentName = user?.user_metadata?.full_name || 'Agent'
  const agentAgency = user?.user_metadata?.agency_name || 'Your Agency'

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
        <div className="w-full lg:w-64 bg-white shadow-md lg:min-h-screen">
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
          
          <nav className="mt-6">
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
          <div className="hidden lg:block absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
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
            <Button variant="outline" size="sm" className="w-full border-[var(--color-navy)] text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white">
              View Profile
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {sidebarItems.find(item => item.id === activeTab)?.label}
                </h1>
                <p className="text-gray-600 mt-1">
                  Welcome back, {agentName}! Here's what's happening with your business.
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button size="sm" className="bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]/90 flex-1 sm:flex-none">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </div>
            </div>
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
                      <Link href="/dashboard/leads">
                        <Button variant="outline" size="sm">View All</Button>
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockLeads.slice(0, 3).map((lead) => (
                        <div key={lead.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-200 rounded-lg gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900 truncate">{lead.name}</p>
                              <Badge className={getPriorityColor(lead.priority)}>
                                {lead.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{lead.property}</p>
                            <p className="text-xs text-gray-500 mt-1">{lead.received}</p>
                          </div>
                          <Badge className={`${getStatusColor(lead.status)} flex-shrink-0`}>
                            {lead.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Listings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">Active Listings</span>
                      <Link href="/dashboard/listings">
                        <Button variant="outline" size="sm">View All</Button>
                      </Link>
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
                        {mockLeads.map((lead) => (
                          <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3">
                              <div>
                                <p className="font-medium text-gray-900">{lead.name}</p>
                                <p className="text-sm text-gray-600">{lead.email}</p>
                              </div>
                            </td>
                            <td className="p-3">
                              <p className="text-sm text-gray-900">{lead.property}</p>
                            </td>
                            <td className="p-3">
                              <p className="text-sm font-medium text-gray-900">{lead.budget}</p>
                            </td>
                            <td className="p-3">
                              <Badge className={getStatusColor(lead.status)}>
                                {lead.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge className={getPriorityColor(lead.priority)}>
                                {lead.priority}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <p className="text-sm text-gray-600">{lead.received}</p>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
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
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue={agentName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Agency</label>
                      <input
                        type="text"
                        defaultValue={agentAgency}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        defaultValue={user?.user_metadata?.phone || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      rows={4}
                      defaultValue={user?.user_metadata?.bio || 'Tell us about yourself and your experience...'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
                    />
                  </div>
                  <Button className="bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]/90">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
