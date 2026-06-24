'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Home, 
  MapPin, 
  Clock, 
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
  X
} from 'lucide-react'
import { getClientProperties, updateProperty, deleteProperty } from '@/lib/auth/actions'
import { toast } from 'sonner'
import { useUser } from '@/lib/auth/useUser'

export default function ClientDashboard() {
  const { user } = useUser()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  
  // CRUD states
  const [editingProperty, setEditingProperty] = useState<any | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch client properties on load
  const fetchProperties = async () => {
    try {
      const result = await getClientProperties()
      if (result.success && result.data) {
        setProperties(result.data)
      } else {
        toast.error(result.error || 'Failed to load properties')
      }
    } catch (err) {
      console.error('Error fetching properties:', err)
      toast.error('An error occurred while loading your properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProperties()
    }
  }, [user])

  const handleEditClick = (property: any) => {
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

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingProperty.clientEmail)
    const phoneDigits = editingProperty.clientPhone.replace(/\D/g, "")
    
    if (!editingProperty.clientName.trim()) {
      toast.error('Client name is required')
      return
    }
    if (!isEmailValid) {
      toast.error('Please enter a valid email address')
      return
    }
    if (phoneDigits.length < 10) {
      toast.error('Please enter a valid phone number (minimum 10 digits)')
      return
    }

    startTransition(async () => {
      try {
        const payload = {
          intent: editingProperty.intent,
          postcode: editingProperty.postcode,
          propertyType: editingProperty.property_type,
          bedroomCount: editingProperty.bedroom_count,
          budget: Number(editingProperty.budget),
          timeline: editingProperty.timeline,
          clientName: editingProperty.clientName,
          clientEmail: editingProperty.clientEmail,
          clientPhone: editingProperty.clientPhone
        }
        
        const result = await updateProperty(editingProperty.id, payload)
        if (result.success) {
          toast.success('Property updated successfully')
          setEditingProperty(null)
          fetchProperties()
        } else {
          toast.error(result.error || 'Failed to update property')
        }
      } catch (err) {
        console.error('Error updating property:', err)
        toast.error('An error occurred during update')
      }
    })
  }

  const handleDeleteClick = (id: string) => {
    setDeletingId(id)
  }

  const handleConfirmDelete = async () => {
    if (!deletingId) return

    startTransition(async () => {
      try {
        const result = await deleteProperty(deletingId)
        if (result.success) {
          toast.success('Property deleted successfully')
          setDeletingId(null)
          fetchProperties()
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
    if (intent === 'renting') {
      return `£${amount.toLocaleString()} PCM`
    }
    if (amount >= 1000000) {
      return `£${(amount / 1000000).toFixed(1)}M`
    }
    return `£${(amount / 1000).toFixed(0)}K`
  }

  const clientName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Client'

  return (
    <main className="flex-1 bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Client Dashboard</h1>
            <p className="text-slate-500 mt-2">
              Welcome back, <span className="font-semibold text-slate-800">{clientName}</span>. Manage your submitted properties and find verified agents.
            </p>
          </div>
          <Link href="/submit-property">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold h-12 px-6 flex items-center gap-2 shadow-sm transition-all duration-200 hover:translate-y-[-1px]">
              <Plus className="w-5 h-5" />
              Submit New Property
            </Button>
          </Link>
        </div>

        {/* Dashboard Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            <p className="text-slate-500 font-medium">Loading your dashboard...</p>
          </div>
        ) : properties.length === 0 ? (
          /* Empty State */
          <Card className="border border-slate-200 shadow-sm bg-white p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Properties Submitted Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Submit your property's postcode, budget, and specs to match with top UK real estate agents.
            </p>
            <Link href="/submit-property">
              <Button className="bg-navy text-gold hover:bg-navy/90 h-12 px-8 font-semibold">
                Submit Your First Property
              </Button>
            </Link>
          </Card>
        ) : (
          /* Properties Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="border border-slate-200 bg-white hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <Badge className={
                      property.intent === 'selling' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 font-semibold px-3 py-1 text-xs capitalize'
                        : property.intent === 'renting'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 font-semibold px-3 py-1 text-xs capitalize'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-50 font-semibold px-3 py-1 text-xs capitalize'
                    }>
                      {property.intent === 'letting-selling' ? 'Letting & Selling' : property.intent}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(property.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Main stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Postcode</p>
                          <p className="text-sm font-bold text-slate-800 uppercase mt-0.5">{property.postcode}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Home className="w-4 h-4 text-slate-400 mt-1" />
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Specs</p>
                          <p className="text-sm font-bold text-slate-800 mt-0.5">{property.bedroom_count} • {property.property_type}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 mt-0.5 font-bold text-sm">£</span>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Budget/Value</p>
                          <p className="text-sm font-bold text-slate-800 mt-0.5">
                            {formatBudget(property.intent, property.budget)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-slate-400 mt-1" />
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Timeline</p>
                          <p className="text-sm font-bold text-slate-800 mt-0.5">{property.timeline}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact info info box */}
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-2 mt-4">
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Lead Contact Details:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                        <div className="truncate font-medium">{property.client_name}</div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{property.client_email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate sm:col-span-2">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{property.client_phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-200 text-slate-600 hover:text-slate-800 h-9"
                    onClick={() => handleEditClick(property)}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-9"
                    onClick={() => handleDeleteClick(property.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Property Modal */}
      {editingProperty && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-white shadow-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-navy">Edit Property Details</CardTitle>
                <CardDescription>Update your property listing details</CardDescription>
              </div>
              <button
                type="button"
                onClick={() => setEditingProperty(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <form onSubmit={handleSaveEdit}>
              <CardContent className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Intent</label>
                    <Select
                      value={editingProperty.intent}
                      onValueChange={(val) => setEditingProperty({ ...editingProperty, intent: val })}
                    >
                      <SelectTrigger className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="renting">Renting</SelectItem>
                        <SelectItem value="selling">Selling</SelectItem>
                        <SelectItem value="letting-selling">Letting & Selling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Postcode</label>
                    <Input
                      type="text"
                      className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 h-11"
                      value={editingProperty.postcode}
                      onChange={(e) => setEditingProperty({ ...editingProperty, postcode: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Property Type</label>
                    <Select
                      value={editingProperty.property_type}
                      onValueChange={(val) => setEditingProperty({ ...editingProperty, property_type: val })}
                    >
                      <SelectTrigger className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Flat">Flat</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Bungalow">Bungalow</SelectItem>
                        <SelectItem value="Studio">Studio</SelectItem>
                        <SelectItem value="Penthouse">Penthouse</SelectItem>
                        <SelectItem value="Maisonette">Maisonette</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Bedrooms</label>
                    <Select
                      value={editingProperty.bedroom_count}
                      onValueChange={(val) => setEditingProperty({ ...editingProperty, bedroom_count: val })}
                    >
                      <SelectTrigger className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Studio">Studio</SelectItem>
                        <SelectItem value="1 Bedroom">1 Bedroom</SelectItem>
                        <SelectItem value="2 Bedrooms">2 Bedrooms</SelectItem>
                        <SelectItem value="3 Bedrooms">3 Bedrooms</SelectItem>
                        <SelectItem value="4 Bedrooms">4 Bedrooms</SelectItem>
                        <SelectItem value="5+ Bedrooms">5+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Budget / Value (GBP)</label>
                    <Input
                      type="number"
                      className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 h-11"
                      value={editingProperty.budget}
                      onChange={(e) => setEditingProperty({ ...editingProperty, budget: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Timeline</label>
                    <Select
                      value={editingProperty.timeline}
                      onValueChange={(val) => setEditingProperty({ ...editingProperty, timeline: val })}
                    >
                      <SelectTrigger className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Immediately">Immediately</SelectItem>
                        <SelectItem value="1 Month or Less">1 Month or Less</SelectItem>
                        <SelectItem value="2 - 3 Months">2 - 3 Months</SelectItem>
                        <SelectItem value="3 - 6 Months">3 - 6 Months</SelectItem>
                        <SelectItem value="6 - 9 Months">6 - 9 Months</SelectItem>
                        <SelectItem value="9 Months or Later">9 Months or Later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-2 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800">Contact Details</h4>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <Input
                      type="text"
                      className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 h-11"
                      value={editingProperty.clientName}
                      onChange={(e) => setEditingProperty({ ...editingProperty, clientName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    <Input
                      type="email"
                      className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 h-11"
                      value={editingProperty.clientEmail}
                      onChange={(e) => setEditingProperty({ ...editingProperty, clientEmail: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                    <Input
                      type="text"
                      className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 h-11"
                      value={editingProperty.clientPhone}
                      onChange={(e) => setEditingProperty({ ...editingProperty, clientPhone: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 border-slate-200 text-slate-600"
                  onClick={() => setEditingProperty(null)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-11 bg-navy text-gold hover:bg-navy/90 px-6 font-semibold"
                  disabled={isPending}
                >
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white shadow-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Property Submission?</h3>
                <p className="text-slate-500 text-sm mt-1.5">
                  Are you sure you want to delete this property submission? This action is permanent and cannot be undone. Agents will no longer see it as a lead.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-8">
              <Button
                variant="outline"
                className="h-11 border-slate-200 text-slate-600"
                onClick={() => setDeletingId(null)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                className="h-11 bg-red-600 hover:bg-red-700 text-white font-semibold px-6"
                onClick={handleConfirmDelete}
                disabled={isPending}
              >
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirm Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </main>
  )
}
