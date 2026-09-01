'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, Mail, Phone, Calendar, User, Eye, CheckCircle, 
  Clock, XCircle, UserCheck, Users, ArrowRight, Loader2,
  Check, X, Building2, MapPin, AlertCircle
} from 'lucide-react'
import { getAgentProperties } from '@/lib/auth/actions'
import { getAgentEngagements, acceptEngagement, declineEngagement, cancelEngagement, completeEngagement } from '@/lib/engagement/actions'
import { toast } from 'sonner'
import { EngagementStatusBadge } from '@/components/engagements/EngagementStatusBadge'
import { CancelEngagementModal } from '@/components/engagements/CancelEngagementModal'
import type { AgentEngagementView, EngagementStatus } from '@/types/engagement'

type TabKey = 'pending' | 'active' | 'past'

export default function AgentLeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [engagements, setEngagements] = useState<AgentEngagementView[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Cancel modal state
  const [cancellingEngagementId, setCancellingEngagementId] = useState<string | null>(null)
  const [cancellingClientName, setCancellingClientName] = useState('')
  const [cancelLoading, setCancelLoading] = useState(false)

  const fetchData = async () => {
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
      console.error('Error fetching data:', err)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ─── Filtered engagement lists ───────────────────────────────────

  const pendingEngagements = engagements.filter(e => e.status === 'pending')
  const activeEngagements = engagements.filter(e => e.status === 'accepted')
  const pastEngagements = engagements.filter(e =>
    ['declined', 'cancelled', 'completed', 'withdrawn', 'expired'].includes(e.status)
  )

  // Search filter
  const filterBySearch = (items: AgentEngagementView[]) =>
    items.filter(e =>
      (e.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.property_postcode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.client_email || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

  // ─── Actions ─────────────────────────────────────────────────────

  const handleAccept = async (id: string) => {
    setActionLoading(id)
    try {
      const result = await acceptEngagement(id)
      if (result.success) {
        toast.success('Engagement accepted! You are now assigned to this property.')
        fetchData()
      } else {
        toast.error(result.error || 'Failed to accept')
      }
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDecline = async (id: string) => {
    setActionLoading(id)
    try {
      const result = await declineEngagement(id)
      if (result.success) {
        toast.success('Request declined')
        fetchData()
      } else {
        toast.error(result.error || 'Failed to decline')
      }
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setActionLoading(null)
    }
  }

  const handleComplete = async (id: string) => {
    setActionLoading(id)
    try {
      const result = await completeEngagement(id)
      if (result.success) {
        toast.success('Engagement marked as completed!')
        fetchData()
      } else {
        toast.error(result.error || 'Failed to complete')
      }
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelConfirm = async (presetReason: string, freeText?: string) => {
    if (!cancellingEngagementId) return
    setCancelLoading(true)
    try {
      const result = await cancelEngagement(cancellingEngagementId, presetReason, freeText)
      if (result.success) {
        toast.success('Engagement ended')
        setCancellingEngagementId(null)
        fetchData()
      } else {
        toast.error(result.error || 'Failed to cancel')
      }
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setCancelLoading(false)
    }
  }

  // ─── Tab config ──────────────────────────────────────────────────

  const tabs: { key: TabKey; label: string; count: number; icon: React.ReactNode }[] = [
    { key: 'pending', label: 'Pending Requests', count: pendingEngagements.length, icon: <Clock className="w-4 h-4" /> },
    { key: 'active', label: 'Active Engagements', count: activeEngagements.length, icon: <UserCheck className="w-4 h-4" /> },
    { key: 'past', label: 'Past Engagements', count: pastEngagements.length, icon: <CheckCircle className="w-4 h-4" /> },
  ]

  // ─── Render engagement card ──────────────────────────────────────

  function renderEngagementCard(eng: AgentEngagementView) {
    const isLoading = actionLoading === eng.id

    return (
      <div key={eng.id} className="p-4 bg-[#14141E] border border-white/10 rounded-xl space-y-3 hover:border-gold/20 transition-colors">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <EngagementStatusBadge status={eng.status} />
            {eng.engagement_mode === 'open_pool' && (
              <Badge className="bg-purple-500/15 text-purple-400 border border-purple-500/30 font-bold text-xs">
                Pool
              </Badge>
            )}
          </div>
          <span className="text-xs text-text-muted shrink-0">
            {new Date(eng.requested_at).toLocaleDateString()}
          </span>
        </div>

        {/* Property details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Postcode</p>
            <p className="font-bold text-gold font-mono uppercase mt-0.5">{eng.property_postcode || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Intent</p>
            <p className="font-semibold text-white capitalize mt-0.5">{eng.property_intent || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Budget</p>
            <p className="font-bold text-gold mt-0.5">
              {eng.property_budget ? `£${Number(eng.property_budget).toLocaleString()}` : 'N/A'}
              {(eng.property_intent === 'renting' || eng.property_intent === 'letting') && ' PCM'}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Specs</p>
            <p className="font-semibold text-white mt-0.5">
              {eng.property_bedroom_count || '—'} • {eng.property_type || '—'}
            </p>
          </div>
        </div>

        {/* Client info */}
        <div className="pt-2 border-t border-white/10 space-y-1">
          <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Client</p>
          <p className="text-sm font-semibold text-white">{eng.client_name || 'Anonymous'}</p>
          {eng.client_email && (
            <p className="text-xs text-text-muted flex items-center gap-1">
              <Mail className="w-3 h-3" /> {eng.client_email}
            </p>
          )}
          {eng.client_phone && (
            <p className="text-xs text-text-muted flex items-center gap-1">
              <Phone className="w-3 h-3" /> {eng.client_phone}
            </p>
          )}
        </div>

        {/* Cancellation info for past engagements */}
        {eng.status === 'cancelled' && eng.cancellation_category && (
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-red-300 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {eng.cancelled_by === 'client' ? 'Client' : 'You'} ended: {eng.cancellation_category}
            </p>
          </div>
        )}

        {/* Action buttons */}
        {eng.status === 'pending' && (
          <div className="pt-2 border-t border-white/10 flex gap-2">
            <Button
              size="sm"
              onClick={() => handleAccept(eng.id)}
              disabled={isLoading}
              className="flex-1 h-8 text-xs gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold rounded-lg cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDecline(eng.id)}
              disabled={isLoading}
              className="flex-1 h-8 text-xs gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Decline
            </Button>
          </div>
        )}

        {eng.status === 'accepted' && (
          <div className="pt-2 border-t border-white/10 flex gap-2">
            <Button
              size="sm"
              onClick={() => handleComplete(eng.id)}
              disabled={isLoading}
              className="flex-1 h-8 text-xs gap-1.5 bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
              Mark Complete
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCancellingEngagementId(eng.id)
                setCancellingClientName(eng.client_name || 'Client')
              }}
              disabled={isLoading}
              className="h-8 text-xs gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" /> End
            </Button>
          </div>
        )}
      </div>
    )
  }

  // ─── Current tab content ─────────────────────────────────────────

  function getCurrentTabEngagements(): AgentEngagementView[] {
    switch (activeTab) {
      case 'pending': return filterBySearch(pendingEngagements)
      case 'active': return filterBySearch(activeEngagements)
      case 'past': return filterBySearch(pastEngagements)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Leads & Engagements</h1>
        <p className="text-sm text-text-secondary mt-1">Manage requests, active engagements, and engagement history</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'bg-gold text-[#0d0d14]'
                : 'bg-[#1A1A24] text-text-secondary border border-white/10 hover:border-gold/30 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.key ? 'bg-[#0d0d14]/20 text-[#0d0d14]' : 'bg-gold/15 text-gold'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + Content */}
      <Card className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-white/10">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input 
              type="text"
              placeholder="Search by client name, email, or postcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-sm bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold"
            />
          </div>
        </CardHeader>
        <CardContent className="p-5">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : getCurrentTabEngagements().length === 0 ? (
            <div className="py-12 text-center space-y-2">
              {activeTab === 'pending' && <Clock className="w-10 h-10 text-text-muted mx-auto" />}
              {activeTab === 'active' && <UserCheck className="w-10 h-10 text-text-muted mx-auto" />}
              {activeTab === 'past' && <CheckCircle className="w-10 h-10 text-text-muted mx-auto" />}
              <p className="text-sm text-text-secondary">
                {activeTab === 'pending' && 'No pending requests at the moment.'}
                {activeTab === 'active' && 'No active engagements right now.'}
                {activeTab === 'past' && 'No past engagements to show.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getCurrentTabEngagements().map(eng => renderEngagementCard(eng))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unmatched Leads Section (from old system — property submissions without engagements) */}
      {leads.length > 0 && engagements.length === 0 && (
        <Card className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="pb-4 border-b border-white/10">
            <CardTitle className="font-heading text-lg font-bold text-white">Property Submissions in Your Area</CardTitle>
            <CardDescription className="text-xs text-text-secondary">These property submissions match your service area but have no engagement yet.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#14141E] text-gold font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Client</th>
                    <th className="py-3 px-4 sm:px-6">Postcode & Intent</th>
                    <th className="py-3 px-4 sm:px-6">Budget</th>
                    <th className="py-3 px-4 sm:px-6">Date</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads.slice(0, 10).map((lead) => (
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
                      <td className="py-3 px-4 sm:px-6 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedLead(lead)}
                          className="h-8 text-xs gap-1.5 border-gold/40 text-gold hover:bg-gold hover:text-[#0d0d14] rounded-lg cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Engagement Modal */}
      <CancelEngagementModal
        isOpen={!!cancellingEngagementId}
        onClose={() => setCancellingEngagementId(null)}
        onConfirm={handleCancelConfirm}
        cancelledBy="agent"
        otherPartyName={cancellingClientName}
        loading={cancelLoading}
      />

      {/* Legacy Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-[#1A1A24] border border-white/15 text-white p-6 rounded-2xl shadow-2xl space-y-4">
            <h3 className="font-heading text-xl font-bold text-white">Lead Details</h3>
            <div className="space-y-2.5 text-sm text-[#B8B5AE] bg-[#14141E] p-4 rounded-xl border border-white/10">
              <p><span className="font-semibold text-white">Name:</span> {selectedLead.client_name}</p>
              <p><span className="font-semibold text-white">Email:</span> {selectedLead.client_email}</p>
              <p><span className="font-semibold text-white">Phone:</span> {selectedLead.client_phone}</p>
              <p><span className="font-semibold text-white">Postcode:</span> <span className="text-gold font-mono font-bold">{selectedLead.postcode}</span></p>
              <p><span className="font-semibold text-white">Property Spec:</span> {selectedLead.bedroom_count} • {selectedLead.property_type}</p>
              <p><span className="font-semibold text-white">Budget:</span> <span className="text-gold font-bold">£{Number(selectedLead.budget).toLocaleString()}</span></p>
            </div>
            <div className="pt-2 flex justify-end">
              <Button onClick={() => setSelectedLead(null)} className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold px-6 rounded-xl cursor-pointer">Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
