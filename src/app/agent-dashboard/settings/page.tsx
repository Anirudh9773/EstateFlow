'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw } from 'lucide-react'
import { useUser } from '@/lib/auth/useUser'
import { createSupabaseClient } from '@/lib/supabaseClient'
import { validatePhone } from '@/lib/validations/property'
import { syncAgentRatings } from '@/lib/agents/ratings'
import { toast } from 'sonner'

export default function AgentSettingsPage() {
  const { user } = useUser()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)

  // Form states
  const [fullName, setFullName] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [trustpilotUsername, setTrustpilotUsername] = useState('')
  const [allagentsUsername, setAllagentsUsername] = useState('')
  const [googlePlaceId, setGooglePlaceId] = useState('')

  // Manual fallback rating states
  const [trustpilotRating, setTrustpilotRating] = useState('')
  const [trustpilotReviewCount, setTrustpilotReviewCount] = useState('')
  const [allagentsRating, setAllagentsRating] = useState('')
  const [allagentsReviewCount, setAllagentsReviewCount] = useState('')
  const [googleRating, setGoogleRating] = useState('')
  const [googleReviewCount, setGoogleReviewCount] = useState('')

  useEffect(() => {
    async function loadData() {
      if (!user) return
      setLoading(true)
      try {
        const supabase = createSupabaseClient()
        const { data } = await supabase.from('agents').select('*').eq('user_id', user.id).single()
        if (data) {
          setProfile(data)
          setFullName(data.full_name || '')
          setAgencyName(data.agency_name || '')
          setPhone(data.phone || '')
          setBio(data.bio || '')
          setTrustpilotUsername(data.trustpilot_username || '')
          setAllagentsUsername(data.allagents_username || '')
          setGooglePlaceId(data.google_place_id || '')
          setTrustpilotRating(data.trustpilot_rating?.toString() || '')
          setTrustpilotReviewCount(data.trustpilot_review_count?.toString() || '')
          setAllagentsRating(data.allagents_rating?.toString() || '')
          setAllagentsReviewCount(data.allagents_review_count?.toString() || '')
          setGoogleRating(data.google_rating?.toString() || '')
          setGoogleReviewCount(data.google_review_count?.toString() || '')
        }
      } catch (err) {
        console.error('Error loading settings profile:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)

    // Full name validation
    if (!fullName || !fullName.trim()) {
      toast.error('Full name is required')
      setSaving(false)
      return
    }

    // Phone validation
    if (phone && phone.trim() !== '' && !validatePhone(phone)) {
      toast.error('Please enter a valid phone number (minimum 10 digits)')
      setSaving(false)
      return
    }

    // Rating validation helper
    const checkRating = (val: string, name: string) => {
      if (val !== '') {
        const num = parseFloat(val)
        if (isNaN(num) || num < 0 || num > 5) {
          toast.error(`${name} rating score must be between 0.0 and 5.0`)
          return false
        }
      }
      return true
    }

    // Review count validation helper
    const checkCount = (val: string, name: string) => {
      if (val !== '') {
        const num = Number(val)
        if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
          toast.error(`${name} review count must be a non-negative whole number`)
          return false
        }
      }
      return true
    }

    if (!checkRating(trustpilotRating, 'Trustpilot')) return setSaving(false)
    if (!checkCount(trustpilotReviewCount, 'Trustpilot')) return setSaving(false)

    if (!checkRating(allagentsRating, 'allAgents')) return setSaving(false)
    if (!checkCount(allagentsReviewCount, 'allAgents')) return setSaving(false)

    if (!checkRating(googleRating, 'Google')) return setSaving(false)
    if (!checkCount(googleReviewCount, 'Google')) return setSaving(false)

    try {
      const supabase = createSupabaseClient()
      const updates = {
        full_name: fullName.trim(),
        agency_name: agencyName.trim() || null,
        phone: phone.trim() || null,
        bio: bio.trim() || null,
        trustpilot_username: trustpilotUsername.trim() || null,
        allagents_username: allagentsUsername.trim() || null,
        google_place_id: googlePlaceId.trim() || null,
        trustpilot_rating: trustpilotRating !== '' ? parseFloat(trustpilotRating) : null,
        trustpilot_review_count: trustpilotReviewCount !== '' ? parseInt(trustpilotReviewCount, 10) : 0,
        allagents_rating: allagentsRating !== '' ? parseFloat(allagentsRating) : null,
        allagents_review_count: allagentsReviewCount !== '' ? parseInt(allagentsReviewCount, 10) : 0,
        google_rating: googleRating !== '' ? parseFloat(googleRating) : null,
        google_review_count: googleReviewCount !== '' ? parseInt(googleReviewCount, 10) : 0,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase.from('agents').update(updates).eq('id', profile.id).select().single()
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
      setSaving(false)
    }
  }

  const handleSync = async () => {
    if (!profile) return
    setSyncing(true)
    toast.info('Starting ratings synchronization...')
    try {
      const supabase = createSupabaseClient()
      await supabase.from('agents').update({
        trustpilot_username: trustpilotUsername || null,
        allagents_username: allagentsUsername || null,
        google_place_id: googlePlaceId || null,
      }).eq('id', profile.id)

      const result = await syncAgentRatings(profile.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Ratings synchronized successfully!')
      }
    } catch (err) {
      console.error('Sync error:', err)
      toast.error('Failed to sync ratings')
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-medium">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Settings & Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account information, phone number, and rating integrations</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Personal and agency information visible to property owners</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Agency Name</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email (Read Only)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value
                    if (/^[0-9+\s-()]*$/.test(val)) {
                      setPhone(val)
                    }
                  }}
                  placeholder="+44 7700 900000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Biography</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Introduce yourself and your experience..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy"
              />
            </div>
          </CardContent>
        </Card>

        {/* Ratings Integration */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Ratings Integration</CardTitle>
              <CardDescription>Configure external profiles to sync customer ratings</CardDescription>
            </div>
            <Button
              type="button"
              onClick={handleSync}
              disabled={syncing}
              variant="outline"
              className="border-navy text-navy hover:bg-navy hover:text-gold"
            >
              {syncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Sync Ratings Now
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trustpilot Username</label>
                <input
                  type="text"
                  value={trustpilotUsername}
                  onChange={(e) => setTrustpilotUsername(e.target.value)}
                  placeholder="e.g. savills"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">allAgents Slug</label>
                <input
                  type="text"
                  value={allagentsUsername}
                  onChange={(e) => setAllagentsUsername(e.target.value)}
                  placeholder="e.g. savills-london"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Google Place ID</label>
                <input
                  type="text"
                  value={googlePlaceId}
                  onChange={(e) => setGooglePlaceId(e.target.value)}
                  placeholder="e.g. ChIJ..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Ratings Fallbacks */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Manual Ratings Fallbacks</CardTitle>
            <CardDescription>Enter ratings manually if auto-sync is not configured</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <p className="text-xs font-bold text-slate-800">Trustpilot</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block">Score (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={trustpilotRating}
                    onChange={(e) => setTrustpilotRating(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block">Reviews</label>
                  <input
                    type="number"
                    min="0"
                    value={trustpilotReviewCount}
                    onChange={(e) => setTrustpilotReviewCount(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <p className="text-xs font-bold text-slate-800">allAgents</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block">Score (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={allagentsRating}
                    onChange={(e) => setAllagentsRating(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block">Reviews</label>
                  <input
                    type="number"
                    min="0"
                    value={allagentsReviewCount}
                    onChange={(e) => setAllagentsReviewCount(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <p className="text-xs font-bold text-slate-800">Google Reviews</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500 block">Score (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={googleRating}
                    onChange={(e) => setGoogleRating(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block">Reviews</label>
                  <input
                    type="number"
                    min="0"
                    value={googleReviewCount}
                    onChange={(e) => setGoogleReviewCount(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-navy text-gold hover:bg-navy/90 font-semibold px-8 h-11">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
