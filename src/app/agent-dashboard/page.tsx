'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Home, 
  MessageSquare, 
  Clock, 
  Plus, 
  ArrowRight, 
  Building2, 
  TrendingUp, 
  Eye, 
  CheckCircle,
  MapPin
} from 'lucide-react'
import { getAgentProperties } from '@/lib/auth/actions'
import { useUser } from '@/lib/auth/useUser'

const stats = [
  {
    title: 'Active Leads',
    value: '12',
    change: '+3 this week',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    title: 'Properties Listed',
    value: '8',
    change: '+2 this month',
    icon: Home,
    color: 'text-emerald-600'
  },
  {
    title: 'Response Rate',
    value: '94%',
    change: '+2% this month',
    icon: MessageSquare,
    color: 'text-purple-600'
  },
  {
    title: 'Avg. Response Time',
    value: '1.8h',
    change: '-15min this week',
    icon: Clock,
    color: 'text-orange-600'
  }
]

export default function AgentOverviewPage() {
  const { user } = useUser()
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOverview() {
      setLoading(true)
      try {
        const result = await getAgentProperties()
        if (result?.success && result.data) {
          setLeads(result.data)
        }
      } catch (err) {
        console.error('Error loading agent overview leads:', err)
      } finally {
        setLoading(false)
      }
    }
    loadOverview()
  }, [])

  const agentName = user?.user_metadata?.full_name || 'Agent'

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-navy text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading">
            Welcome back, <span className="text-gold">{agentName}</span> 👋
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Here is what is happening across your property listings and lead inquiries today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/agent-dashboard/listings">
            <Button className="bg-white/10 text-white border border-white/30 hover:bg-white hover:text-navy font-semibold transition-colors">
              View Listings
            </Button>
          </Link>
          <Link href="/agent-dashboard/leads">
            <Button className="bg-gold text-navy hover:bg-amber-400 hover:text-navy font-semibold flex items-center gap-2 transition-colors">
              <Users className="w-4 h-4" />
              Browse Leads
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="bg-[#1A1A24] border border-white/10 rounded-2xl shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{stat.title}</span>
                  <div className="p-2.5 rounded-xl bg-gold/10 text-gold border border-gold/20">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-heading text-3xl font-bold text-white">{stat.value}</span>
                  <p className="text-xs text-emerald-400 font-medium mt-1">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Leads Table */}
      <Card className="bg-[#1A1A24] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/10">
          <div>
            <CardTitle className="font-heading text-lg font-bold text-white">Recent Lead Inquiries</CardTitle>
            <CardDescription className="text-xs text-text-secondary">Latest client submissions matched to your service area</CardDescription>
          </div>
          <Link href="/agent-dashboard/leads">
            <Button variant="ghost" size="sm" className="text-gold hover:text-white text-xs font-semibold gap-1.5 cursor-pointer">
              View All Leads <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-8 text-center text-text-secondary font-medium">Loading recent inquiries...</div>
          ) : leads.length === 0 ? (
            <div className="py-8 text-center text-text-secondary">No recent lead inquiries found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#14141E] text-gold font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Client</th>
                    <th className="py-3 px-4 sm:px-6">Postcode & Intent</th>
                    <th className="py-3 px-4 sm:px-6">Budget</th>
                    <th className="py-3 px-4 sm:px-6">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads.slice(0, 5).map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 sm:px-6 font-semibold text-white">{lead.client_name || 'Client'}</td>
                      <td className="py-3 px-4 sm:px-6">
                        <span className="font-mono text-xs px-2 py-0.5 bg-white/5 rounded border border-white/10 font-bold uppercase mr-2 text-gold">
                          {lead.postcode}
                        </span>
                        <span className="capitalize text-text-secondary">{lead.intent}</span>
                      </td>
                      <td className="py-3 px-4 sm:px-6 font-semibold text-gold">
                        £{Number(lead.budget).toLocaleString()}
                        {(lead.intent === 'renting' || lead.intent === 'letting') && ' PCM'}
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-xs text-text-muted">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
