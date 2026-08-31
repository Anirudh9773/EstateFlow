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

  // Prevent re-fetching data on browser tab switch (useUser triggers onAuthStateChange)
  const hasLoadedRef = React.useRef(false)

  useEffect(() => {
    async function loadData() {
      if (!user) return
      // Only load from DB once; subsequent user ref changes (tab switch) should not overwrite local state
      if (hasLoadedRef.current) return
      setLoading(true)
      try {
        const supabase = createSupabaseClient()
        const { data } = await supabase.from('agents').select('*').eq('user_id', user.id).single()
        if (data) {
          hasLoadedRef.current = true
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
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Settings & Profile</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your account information, phone number, and rating integrations</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="bg-[#14141E] border-b border-white/10 p-5 sm:p-6">
            <CardTitle className="font-heading text-lg font-bold text-white">Profile Details</CardTitle>
            <CardDescription className="text-xs text-text-secondary">Personal and agency information visible to property owners</CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#1E1E28] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Agency Name</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1E1E28] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Email (Read Only)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-text-muted cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Phone Number</label>
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
                  className="w-full px-3.5 py-2.5 bg-[#1E1E28] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-gold placeholder:text-text-muted"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Biography</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Introduce yourself and your experience..."
                className="w-full px-3.5 py-2.5 bg-[#1E1E28] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-gold placeholder:text-text-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Ratings Integration */}
        <Card className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="bg-[#14141E] border-b border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="font-heading text-lg font-bold text-white">Ratings Integration</CardTitle>
              <CardDescription className="text-xs text-text-secondary">Configure external profiles to sync customer ratings</CardDescription>
            </div>
            <Button
              type="button"
              onClick={handleSync}
              disabled={syncing}
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold hover:text-[#0d0d14] rounded-xl font-semibold cursor-pointer transition-colors"
            >
              {syncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Sync Ratings Now
            </Button>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Trustpilot Username</label>
                <input
                  type="text"
                  value={trustpilotUsername}
                  onChange={(e) => setTrustpilotUsername(e.target.value)}
                  placeholder="e.g. savills"
                  className="w-full px-3.5 py-2.5 bg-[#1E1E28] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-gold placeholder:text-text-muted"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">allAgents Slug</label>
                <input
                  type="text"
                  value={allagentsUsername}
                  onChange={(e) => setAllagentsUsername(e.target.value)}
                  placeholder="e.g. savills-london"
                  className="w-full px-3.5 py-2.5 bg-[#1E1E28] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-gold placeholder:text-text-muted"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Google Place ID</label>
                <input
                  type="text"
                  value={googlePlaceId}
                  onChange={(e) => setGooglePlaceId(e.target.value)}
                  placeholder="e.g. ChIJ..."
                  className="w-full px-3.5 py-2.5 bg-[#1E1E28] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-gold placeholder:text-text-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Ratings Fallbacks */}
        <Card className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="bg-[#14141E] border-b border-white/10 p-5 sm:p-6">
            <CardTitle className="font-heading text-lg font-bold text-white">Manual Ratings Fallbacks</CardTitle>
            <CardDescription className="text-xs text-text-secondary">Enter ratings manually if auto-sync is not configured</CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-[#14141E] border border-white/10 rounded-xl space-y-3">
              <p className="text-xs font-bold text-gold uppercase tracking-wider">Trustpilot</p>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-text-secondary block mb-1">Score (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={trustpilotRating}
                    onChange={(e) => setTrustpilotRating(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1E1E28] border border-white/15 rounded-lg text-xs text-white focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-text-secondary block mb-1">Reviews</label>
                  <input
                    type="number"
                    min="0"
                    value={trustpilotReviewCount}
                    onChange={(e) => setTrustpilotReviewCount(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1E1E28] border border-white/15 rounded-lg text-xs text-white focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#14141E] border border-white/10 rounded-xl space-y-3">
              <p className="text-xs font-bold text-gold uppercase tracking-wider">allAgents</p>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-text-secondary block mb-1">Score (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={allagentsRating}
                    onChange={(e) => setAllagentsRating(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1E1E28] border border-white/15 rounded-lg text-xs text-white focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-text-secondary block mb-1">Reviews</label>
                  <input
                    type="number"
                    min="0"
                    value={allagentsReviewCount}
                    onChange={(e) => setAllagentsReviewCount(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1E1E28] border border-white/15 rounded-lg text-xs text-white focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#14141E] border border-white/10 rounded-xl space-y-3">
              <p className="text-xs font-bold text-gold uppercase tracking-wider">Google Reviews</p>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-text-secondary block mb-1">Score (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={googleRating}
                    onChange={(e) => setGoogleRating(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1E1E28] border border-white/15 rounded-lg text-xs text-white focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-text-secondary block mb-1">Reviews</label>
                  <input
                    type="number"
                    min="0"
                    value={googleReviewCount}
                    onChange={(e) => setGoogleReviewCount(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#1E1E28] border border-white/15 rounded-lg text-xs text-white focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-bold px-8 h-11 rounded-xl cursor-pointer">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
