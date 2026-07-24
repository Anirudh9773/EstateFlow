'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useUser } from '@/lib/auth/useUser'
import { createSupabaseClient } from '@/lib/supabaseClient'
import { validatePhone } from '@/lib/validations/property'
import { toast } from 'sonner'

export default function ClientSettingsPage() {
  const { user } = useUser()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      if (!user) return
      setLoading(true)
      try {
        const supabase = createSupabaseClient()
        const { data } = await supabase.from('clients').select('*').eq('user_id', user.id).single()
        if (data) {
          setProfileId(data.id)
          setFullName(data.full_name || '')
          setPhone(data.phone || '')
        }
      } catch (err) {
        console.error('Error loading client settings:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileId) return
    setSaving(true)

    if (!fullName || !fullName.trim()) {
      toast.error('Full name is required')
      setSaving(false)
      return
    }

    if (phone && phone.trim() !== '' && !validatePhone(phone)) {
      toast.error('Please enter a valid phone number (minimum 10 digits)')
      setSaving(false)
      return
    }

    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.from('clients').update({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        updated_at: new Date().toISOString()
      }).eq('id', profileId)

      if (error) {
        toast.error('Failed to update settings: ' + error.message)
      } else {
        toast.success('Account settings saved successfully!')
      }
    } catch (err) {
      console.error('Error saving client settings:', err)
      toast.error('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-slate-500 font-medium">Loading settings...</div>
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your contact information and personal details</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Keep your contact details up to date for real estate agents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-10 border-slate-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address (Read Only)</label>
              <Input
                type="email"
                value={user?.email || ''}
                disabled
                className="h-10 border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value
                  if (/^[0-9+\s-()]*$/.test(val)) {
                    setPhone(val)
                  }
                }}
                placeholder="+44 7700 900000"
                className="h-10 border-slate-300"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-navy text-gold hover:bg-navy/90 font-semibold px-8 h-11">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
