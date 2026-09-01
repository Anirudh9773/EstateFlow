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
  ArrowRight, 
  Building2, 
  TrendingUp, 
  Eye, 
  CheckCircle,
  MapPin,
  UserCheck,
  Loader2,
} from 'lucide-react'
import { getAgentProperties } from '@/lib/auth/actions'
import { getAgentEngagements } from '@/lib/engagement/actions'
import { useUser } from '@/lib/auth/useUser'
import { EngagementStatusBadge } from '@/components/engagements/EngagementStatusBadge'
import type { AgentEngagementView } from '@/types/engagement'

export default function AgentOverviewPage() {
  const { user } = useUser()
  const [leads, setLeads] = useState<any[]>([])
  const [engagements, setEngagements] = useState<AgentEngagementView[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOverview() {
      setLoading(true)
      try {
        const [leadsResult, engResult] = await Promise.all([
          getAgentProperties(),
          getAgentEngagements(),
        ])
        if (leadsResult?.success && leadsResult.data) {
          setLeads(leadsResult.data)
        }
        if (engResult?.success && engResult.data) {
          setEngagements(engResult.data)
        }
      } catch (err) {
        console.error('Error loading agent overview:', err)
      } finally {
        setLoading(false)
      }
    }
    loadOverview()
  }, [])

  const agentName = user?.user_metadata?.full_name || 'Agent'

  // Real stats from engagements
  const pendingCount = engagements.filter(e => e.status === 'pending').length
  const activeCount = engagements.filter(e => e.status === 'accepted').length
  const completedCount = engagements.filter(e => e.status === 'completed').length
  const totalEngagements = engagements.length

  const stats = [
    {
      title: 'Pending Requests',
      value: String(pendingCount),
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Active Engagements',
      value: String(activeCount),
      icon: UserCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Completed',
      value: String(completedCount),
      icon: CheckCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Area Leads',
      value: String(leads.length),
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
    },
  ]

  // Recent activity — latest engagements
  const recentEngagements = engagements.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-navy text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading">
            Welcome back, <span className="text-gold">{agentName}</span> 👋
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Here is what is happening across your property engagements and lead inquiries.
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
              View Engagements
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
                  <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color} border`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-heading text-3xl font-bold text-white">{stat.value}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Engagement Activity */}
      <Card className="bg-[#1A1A24] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/10">
          <div>
            <CardTitle className="font-heading text-lg font-bold text-white">Recent Activity</CardTitle>
            <CardDescription className="text-xs text-text-secondary">Latest engagement activity across your properties</CardDescription>
          </div>
          <Link href="/agent-dashboard/leads">
            <Button variant="ghost" size="sm" className="text-gold hover:text-white text-xs font-semibold gap-1.5 cursor-pointer">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-5">
          {loading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="w-7 h-7 text-gold animate-spin" />
            </div>
          ) : recentEngagements.length === 0 ? (
            <div className="py-8 text-center text-text-secondary text-sm">No recent engagement activity.</div>
          ) : (
            <div className="space-y-3">
              {recentEngagements.map((eng) => (
                <div key={eng.id} className="flex items-center justify-between p-3 bg-[#14141E] border border-white/10 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <EngagementStatusBadge status={eng.status} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{eng.client_name || 'Client'}</p>
                      <p className="text-xs text-text-muted">
                        {eng.property_postcode || '—'} • {eng.property_intent || '—'}
                        {eng.property_budget ? ` • £${Number(eng.property_budget).toLocaleString()}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-text-muted shrink-0 ml-2">
                    {new Date(eng.updated_at || eng.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
