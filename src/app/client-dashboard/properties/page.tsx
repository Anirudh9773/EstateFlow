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
  X
} from 'lucide-react'
import { getClientProperties, updateProperty, deleteProperty } from '@/lib/auth/actions'
import { toast } from 'sonner'
import { validatePostcode, validatePhone, validatePriceBounds } from '@/lib/validations/property'

export default function ClientPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // CRUD states
  const [editingProperty, setEditingProperty] = useState<any | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProperties = async () => {
    setLoading(true)
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
    } font-medium: finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

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

    if (!editingProperty.postcode || !editingProperty.postcode.trim()) {
      toast.error('Postcode is required')
      return
    }

    if (!validatePostcode(editingProperty.postcode)) {
      toast.error('Please enter a valid UK postcode (e.g., SW1A 1AA)')
      return
    }

    if (!validatePhone(editingProperty.clientPhone)) {
      toast.error('Please enter a valid phone number (minimum 10 digits)')
      return
    }

    const priceCheck = validatePriceBounds(editingProperty.intent, Number(editingProperty.budget))
    if (!priceCheck.isValid) {
      toast.error(priceCheck.error || 'Invalid price bounds')
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
    if (intent === 'renting' || intent === 'letting') {
      return `£${amount.toLocaleString()} PCM`
    }
    return `£${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">My Submitted Properties</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and update your active property requests</p>
        </div>
        <Link href="/submit-property">
          <Button className="bg-navy text-gold hover:bg-navy/90 font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Submit New Property
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-8 h-8 text-navy animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <Card className="border border-slate-200 shadow-sm p-12 text-center max-w-xl mx-auto">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Properties Submitted Yet</h3>
          <p className="text-sm text-slate-500 mb-6">Submit your property details to match with top UK agents.</p>
          <Link href="/submit-property">
            <Button className="bg-navy text-gold hover:bg-navy/90 font-semibold">Submit First Property</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="border border-slate-200 bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <Badge className="bg-navy/10 text-navy border-navy/20 font-semibold uppercase text-xs">
                  {property.intent === 'letting-selling' ? 'Letting & Selling' : property.intent}
                </Badge>
                <span className="text-xs text-slate-400">{new Date(property.created_at).toLocaleDateString()}</span>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Postcode</p>
                    <p className="font-bold text-slate-900 uppercase mt-0.5">{property.postcode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Specs</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{property.bedroom_count} • {property.property_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Budget / Value</p>
                    <p className="font-bold text-navy mt-0.5">{formatBudget(property.intent, property.budget)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Timeline</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{property.timeline || 'Immediately'}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditClick(property)}
                    className="h-8 text-xs gap-1 border-slate-300 text-slate-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setDeletingId(property.id)}
                    className="h-8 text-xs gap-1 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-xl w-full bg-white p-6 rounded-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Edit Property Details</h3>
              <button onClick={() => setEditingProperty(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Postcode *</label>
                <Input value={editingProperty.postcode} onChange={(e) => setEditingProperty({ ...editingProperty, postcode: e.target.value })} required />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Budget / Value (GBP) *</label>
                <Input type="number" value={editingProperty.budget} onChange={(e) => setEditingProperty({ ...editingProperty, budget: e.target.value })} required />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <Input 
                  value={editingProperty.clientPhone} 
                  onChange={(e) => {
                    const val = e.target.value
                    if (/^[0-9+\s-()]*$/.test(val)) {
                      setEditingProperty({ ...editingProperty, clientPhone: val })
                    }
                  }} 
                  required 
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setEditingProperty(null)}>Cancel</Button>
                <Button type="submit" disabled={isPending} className="bg-navy text-gold">
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Delete Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Delete Property Request?</h3>
            <p className="text-sm text-slate-500">Are you sure you want to remove this property request? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
              <Button onClick={handleConfirmDelete} disabled={isPending} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
