'use client'

import React, { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Home, 
  MapPin, 
  Trash2, 
  Edit2, 
  Plus, 
  Loader2, 
  Phone, 
  Mail, 
  User, 
  AlertCircle,
  Building2,
  Calendar,
  X,
  UserCheck,
  Users,
  Clock,
  RefreshCw,
  XCircle,
  CheckCircle2,
} from 'lucide-react'
import { getClientProperties, updateProperty, deleteProperty } from '@/lib/auth/actions'
import { getClientEngagements, withdrawEngagement, cancelEngagement, createEngagement } from '@/lib/engagement/actions'
import { toast } from 'sonner'
import { validatePostcode, validatePhone, validatePriceBounds } from '@/lib/validations/property'
import { EngagementStatusBadge } from '@/components/engagements/EngagementStatusBadge'
import { CancelEngagementModal } from '@/components/engagements/CancelEngagementModal'
import { AgentPickerModal } from '@/components/engagements/AgentPickerModal'
import type { ClientEngagementView } from '@/types/engagement'
import { ENGAGEMENT_MODES_ENABLED } from '@/lib/constants'

export interface ClientProperty {
  id: string
  intent: string
  property_type?: string
  postcode?: string
  property_postcode?: string
  desired_postcode?: string
  budget?: number
  sale_value?: number
  timeline?: string
  mortgage_status?: string
  bedroom_count?: string
  status?: string
  created_at?: string
  client_name?: string
  client_email?: string
  client_phone?: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  _postcodeError?: string
  _phoneError?: string
  _budgetError?: string
}

export default function ClientPropertiesPage() {
  const [properties, setProperties] = useState<ClientProperty[]>([])
  const [engagements, setEngagements] = useState<ClientEngagementView[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // CRUD states
  const [editingProperty, setEditingProperty] = useState<ClientProperty | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Engagement states
  const [cancellingEngagementId, setCancellingEngagementId] = useState<string | null>(null)
  const [cancellingAgentName, setCancellingAgentName] = useState<string>('')
  const [cancelLoading, setCancelLoading] = useState(false)
  const [agentPickerPropertyId, setAgentPickerPropertyId] = useState<string | null>(null)
  const [agentPickerPostcode, setAgentPickerPostcode] = useState('')
  const [engagementLoading, setEngagementLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [propsResult, engResult] = await Promise.all([
        getClientProperties(),
        getClientEngagements(),
      ])
      if (propsResult.success && propsResult.data) {
        setProperties(propsResult.data)
      } else {
        toast.error(propsResult.error || 'Failed to load properties')
      }
      if (engResult.success && engResult.data) {
        setEngagements(engResult.data)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      toast.error('An error occurred while loading data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ─── Engagement helpers ──────────────────────────────────────────

  /** Get the "current" engagement for a property (active or most recent pending) */
  function getCurrentEngagement(propertyId: string): ClientEngagementView | null {
    // Priority: accepted > pending > most recent other
    const forProperty = engagements.filter(e => e.property_id === propertyId)
    const accepted = forProperty.find(e => e.status === 'accepted')
    if (accepted) return accepted
    const pending = forProperty.filter(e => e.status === 'pending')
    if (pending.length > 0) return pending[0]
    return null
  }

  /** Count pending pool agents for a property */
  function getPendingPoolCount(propertyId: string): number {
    return engagements.filter(e => e.property_id === propertyId && e.status === 'pending' && e.engagement_mode === 'open_pool').length
  }

  /** Was there a previous cancelled/declined engagement? */
  function getLastCancelledEngagement(propertyId: string): ClientEngagementView | null {
    return engagements.find(
      e => e.property_id === propertyId && (e.status === 'cancelled' || e.status === 'declined')
    ) || null
  }

  // ─── Engagement actions ──────────────────────────────────────────

  const handleWithdraw = async (engagementId: string) => {
    setEngagementLoading(true)
    try {
      const result = await withdrawEngagement(engagementId)
      if (result.success) {
        toast.success('Request withdrawn successfully')
        fetchData()
      } else {
        toast.error(result.error || 'Failed to withdraw')
      }
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setEngagementLoading(false)
    }
  }

  const handleCancelConfirm = async (presetReason: string, freeText?: string) => {
    if (!cancellingEngagementId) return
    setCancelLoading(true)
    try {
      const result = await cancelEngagement(cancellingEngagementId, presetReason, freeText)
      if (result.success) {
        toast.success('Engagement ended successfully')
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

  const handleAgentSelect = async (agentUserId: string, agentName: string) => {
    if (!agentPickerPropertyId) return
    setEngagementLoading(true)
    try {
      const result = await createEngagement({
        propertyId: agentPickerPropertyId,
        mode: 'direct',
        agentId: agentUserId,
      })
      if (result.success) {
        toast.success(`Request sent to ${agentName}`)
        setAgentPickerPropertyId(null)
        fetchData()
      } else {
        toast.error(result.error || 'Failed to create engagement')
      }
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setEngagementLoading(false)
    }
  }

  const handleOpenPool = async (propertyId: string) => {
    setEngagementLoading(true)
    try {
      const result = await createEngagement({
        propertyId,
        mode: 'open_pool',
      })
      if (result.success) {
        toast.success(`Sent to ${result.created} matched agents!`)
        fetchData()
      } else {
        toast.error(result.error || 'Failed to create pool')
      }
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setEngagementLoading(false)
    }
  }

  // ─── Existing edit/delete handlers ───────────────────────────────

  const handleEditClick = (property: ClientProperty) => {
    setEditingProperty({
      ...property,
      clientName: property.client_name || '',
      clientEmail: property.client_email || '',
      clientPhone: property.client_phone || ''
    })
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProperty) return

    let hasError = false
    const updates = { ...editingProperty, _postcodeError: '', _phoneError: '', _budgetError: '' }

    if (!editingProperty.postcode || !editingProperty.postcode.trim()) {
      updates._postcodeError = 'Postcode is required'
      hasError = true
    } else if (!validatePostcode(editingProperty.postcode)) {
      updates._postcodeError = 'Please enter a valid UK postcode (e.g., SW1A 1AA)'
      hasError = true
    }

    if (!validatePhone(editingProperty.clientPhone || '')) {
      updates._phoneError = 'Please enter a valid phone number (minimum 10 digits, maximum 15)'
      hasError = true
    }

    const priceCheck = validatePriceBounds(editingProperty.intent, Number(editingProperty.budget))
    if (!priceCheck.isValid) {
      updates._budgetError = priceCheck.error || 'Invalid price bounds'
      hasError = true
    }

    if (hasError) {
      setEditingProperty(updates)
      toast.error('Please fix the errors in the form')
      return
    }

    startTransition(async () => {
      try {
        const payload = {
          intent: editingProperty.intent,
          postcode: editingProperty.postcode || editingProperty.property_postcode || editingProperty.desired_postcode || '',
          propertyType: editingProperty.property_type || '',
          bedroomCount: editingProperty.bedroom_count || '',
          budget: Number(editingProperty.budget || 0),
          timeline: editingProperty.timeline || '',
          clientName: editingProperty.clientName || '',
          clientEmail: editingProperty.clientEmail || '',
          clientPhone: editingProperty.clientPhone || ''
        }
        
        const result = await updateProperty(editingProperty.id, payload)
        if (result.success) {
          toast.success('Property updated successfully')
          setEditingProperty(null)
          fetchData()
        } else {
          toast.error(result.error || 'Failed to update property')
        }
      } catch (err) {
        console.error('Error updating property:', err)
        toast.error('An error occurred during update')
      }
    })
  }

  const handleConfirmDelete = async () => {
    if (!deletingId) return
    startTransition(async () => {
      try {
        const result = await deleteProperty(deletingId)
        if (result.success) {
          toast.success('Property deleted successfully')
          setDeletingId(null)
          fetchData()
        } else {
          toast.error(result.error || 'Failed to delete property')
        }
      } catch (err) {
        console.error('Error deleting property:', err)
        toast.error('An error occurred during deletion')
      }
    })
  }

  const formatBudget = (intent: string, amount: number) => {
    if (!amount || amount <= 0 || intent?.toLowerCase().includes('inquiry') || intent?.toLowerCase().includes('callback')) {
      return 'N/A'
    }
    if (intent === 'renting' || intent === 'letting') {
      return `£${amount.toLocaleString()} PCM`
    }
    return `£${amount.toLocaleString()}`
  }

  // ─── Engagement status section for each property card ────────────

  function renderEngagementSection(property: ClientProperty) {
    const current = getCurrentEngagement(property.id)
    const lastCancelled = getLastCancelledEngagement(property.id)

    // Case 1: Active (accepted) engagement
    if (current && current.status === 'accepted') {
      return (
        <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Active Agent</span>
            </div>
            <EngagementStatusBadge status="accepted" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold/10 text-gold border border-gold/20 rounded-lg">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{current.agent_name || 'Agent'}</p>
              {current.agent_agency && (
                <p className="text-xs text-text-secondary">{current.agent_agency}</p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCancellingEngagementId(current.id)
              setCancellingAgentName(current.agent_name || 'Agent')
            }}
            className="h-7 text-xs gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
          >
            <XCircle className="w-3 h-3" />
            This isn&#39;t working out — end engagement
          </Button>
        </div>
      )
    }

    // Case 2: Pending engagement(s)
    if (current && current.status === 'pending') {
      const isPool = current.engagement_mode === 'open_pool'
      const poolCount = isPool ? getPendingPoolCount(property.id) : 1
      return (
        <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {isPool ? 'Open Pool' : 'Awaiting Response'}
              </span>
            </div>
            <EngagementStatusBadge status="pending" />
          </div>
          <p className="text-sm text-text-secondary">
            {isPool
              ? `${poolCount} agent${poolCount !== 1 ? 's' : ''} notified — waiting for the first response.`
              : `Awaiting response from ${current.agent_name || 'agent'}.`
            }
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleWithdraw(current.id)}
            disabled={engagementLoading}
            className="h-7 text-xs gap-1.5 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-3 h-3" />
            Withdraw Request
          </Button>
        </div>
      )
    }

    // Case 3: Previous engagement was cancelled — show context + restart CTA
    if (lastCancelled) {
      const cancelledByOther = lastCancelled.cancelled_by !== 'client'
      return (
        <div className="mt-4 p-4 bg-slate-500/5 border border-white/10 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-text-secondary" />
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                {cancelledByOther ? 'Agent No Longer Engaged' : 'Engagement Ended'}
              </span>
            </div>
            <EngagementStatusBadge status="cancelled" />
          </div>
          {lastCancelled.cancellation_category && (
            <p className="text-xs text-text-muted">
              Reason: {lastCancelled.cancellation_category}
            </p>
          )}
          {renderFindAgentCTA(property)}
        </div>
      )
    }

    // Case 4: No engagement at all — show CTA
    return (
      <div className="mt-4 p-4 bg-[#14141E] border border-white/10 rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-text-muted" />
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">No Agent Assigned</span>
        </div>
        <p className="text-xs text-text-muted">Find an agent to help with this property.</p>
        {renderFindAgentCTA(property)}
      </div>
    )
  }

  /** CTA buttons for finding an agent (direct pick or open pool) */
  function renderFindAgentCTA(property: ClientProperty) {
    return (
      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          size="sm"
          onClick={() => {
            setAgentPickerPropertyId(property.id)
            setAgentPickerPostcode(property.postcode || '')
          }}
          disabled={engagementLoading}
          className="h-8 text-xs gap-1.5 bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold rounded-lg cursor-pointer"
        >
          <UserCheck className="w-3.5 h-3.5" />
          Choose an Agent
        </Button>
        {ENGAGEMENT_MODES_ENABLED === 'both' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenPool(property.id)}
            disabled={engagementLoading}
            className="h-8 text-xs gap-1.5 border-gold/40 text-gold hover:bg-gold/10 font-semibold rounded-lg cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Get Matched (First to Respond)
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">My Submitted Properties</h1>
          <p className="text-sm text-text-secondary mt-1">Manage your property requests and agent engagements</p>
        </div>
        <Link href="/submit-property">
          <Button className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-bold flex items-center gap-2 rounded-xl cursor-pointer">
            <Plus className="w-4 h-4" />
            Submit New Property
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <Card className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-xl p-12 text-center max-w-xl mx-auto">
          <Building2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="font-heading text-lg font-bold text-white mb-1">No Properties Submitted Yet</h3>
          <p className="text-sm text-text-secondary mb-6">Submit your property details to match with top UK agents.</p>
          <Link href="/submit-property">
            <Button className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-bold rounded-xl cursor-pointer">Submit First Property</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-xl hover:border-gold/30 transition-all duration-200 overflow-hidden border-t-2 border-t-gold">
              <CardHeader className="pb-3 bg-[#14141E] border-b border-white/10 flex flex-row items-center justify-between p-5">
                <Badge className="bg-gold/15 text-gold border border-gold/30 font-bold uppercase text-xs">
                  {property.intent === 'letting-selling' ? 'Letting & Selling' : property.intent}
                </Badge>
                <span className="text-xs text-text-muted">{property.created_at ? new Date(property.created_at).toLocaleDateString() : 'Just now'}</span>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Postcode</p>
                    <p className="font-bold text-gold font-mono uppercase mt-0.5">{property.postcode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Specs</p>
                    <p className="font-semibold text-white mt-0.5">{property.bedroom_count} • {property.property_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Budget / Value</p>
                    <p className="font-bold text-gold mt-0.5">{formatBudget(property.intent, property.budget ?? property.sale_value ?? 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Timeline</p>
                    <p className="font-semibold text-white mt-0.5">{property.timeline || 'Immediately'}</p>
                  </div>
                </div>

                {/* Engagement Section */}
                {renderEngagementSection(property)}

                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditClick(property)}
                    className="h-8 text-xs gap-1.5 border-gold/40 text-gold hover:bg-gold hover:text-[#0d0d14] rounded-lg cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setDeletingId(property.id)}
                    className="h-8 text-xs gap-1.5 border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cancel Engagement Modal */}
      <CancelEngagementModal
        isOpen={!!cancellingEngagementId}
        onClose={() => setCancellingEngagementId(null)}
        onConfirm={handleCancelConfirm}
        cancelledBy="client"
        otherPartyName={cancellingAgentName}
        loading={cancelLoading}
      />

      {/* Agent Picker Modal */}
      <AgentPickerModal
        isOpen={!!agentPickerPropertyId}
        onClose={() => setAgentPickerPropertyId(null)}
        onSelect={handleAgentSelect}
        postcode={agentPickerPostcode}
        loading={engagementLoading}
      />

      {/* Edit Property Modal */}
      {editingProperty && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-xl w-full bg-[#1A1A24] border border-white/15 text-white p-6 rounded-2xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading text-lg font-bold text-white">Edit Property Details</h3>
              <button onClick={() => setEditingProperty(null)} className="text-text-muted hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Postcode *</label>
                <Input 
                  value={editingProperty.postcode} 
                  onChange={(e) => {
                    setEditingProperty({ ...editingProperty, postcode: e.target.value, _postcodeError: '' })
                  }} 
                  className="bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold"
                  required 
                />
                {editingProperty._postcodeError && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{editingProperty._postcodeError}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Budget / Value (GBP) *</label>
                <Input 
                  type="number" 
                  value={editingProperty.budget} 
                  onChange={(e) => {
                    setEditingProperty({ ...editingProperty, budget: Number(e.target.value), _budgetError: '' })
                  }} 
                  className="bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold"
                  required 
                />
                {editingProperty._budgetError && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{editingProperty._budgetError}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Phone Number *</label>
                <Input 
                  value={editingProperty.clientPhone} 
                  onChange={(e) => {
                    const val = e.target.value
                    if (/^[0-9+\s-()]*$/.test(val)) {
                      setEditingProperty({ ...editingProperty, clientPhone: val, _phoneError: '' })
                    }
                  }} 
                  className="bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold"
                  required 
                />
                {editingProperty._phoneError && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{editingProperty._phoneError}</p>
                )}
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setEditingProperty(null)} className="border-white/15 text-text-secondary hover:text-white rounded-xl cursor-pointer">Cancel</Button>
                <Button type="submit" disabled={isPending} className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-bold rounded-xl cursor-pointer">
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Delete Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-[#1A1A24] border border-white/15 text-white p-6 rounded-2xl shadow-2xl space-y-4">
            <h3 className="font-heading text-lg font-bold text-white">Delete Property Request?</h3>
            <p className="text-sm text-[#B8B5AE]">Are you sure you want to remove this property request? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDeletingId(null)} className="border-white/15 text-text-secondary hover:text-white rounded-xl cursor-pointer">Cancel</Button>
              <Button onClick={handleConfirmDelete} disabled={isPending} className="bg-red-600 text-white hover:bg-red-700 font-bold rounded-xl cursor-pointer">Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
