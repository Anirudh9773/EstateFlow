'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  Edit,
  Loader2
} from 'lucide-react'
import { getInitials } from '@/lib/utils/getInitials'
import { useUser } from '@/lib/auth/useUser'
import { createSupabaseClient } from '@/lib/supabaseClient'

interface AgentProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string | null
  agency_name: string | null
  license_number: string | null
  area_of_operation: string | null
  years_experience: string | null
  created_at: string
  updated_at: string
}

export default function AgentProfilePage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [profile, setProfile] = useState<AgentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const supabase = createSupabaseClient()
        
        const { data, error: fetchError } = await supabase
          .from('agents')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (fetchError) {
          console.error('Error fetching profile:', fetchError)
          setError('Failed to load profile')
        } else {
          setProfile(data)
        }
      } catch (err) {
        console.error('Exception fetching profile:', err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (!userLoading) {
      fetchProfile()
    }
  }, [user, userLoading])

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-gold)] mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
            <Button onClick={() => router.push('/agent-dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getExperienceLabel = (exp: string | null) => {
    if (!exp) return 'Not specified'
    return exp === '10+' ? '10+ years' : `${exp} years`
  }

  const getAreaLabel = (area: string | null) => {
    if (!area) return 'Not specified'
    const areaMap: Record<string, string> = {
      'north': 'North Zone',
      'south': 'South Zone',
      'east': 'East Zone',
      'west': 'West Zone',
      'pan-city': 'Pan City'
    }
    return areaMap[area] || area
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header - Simple title only */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Agent Profile</h1>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-[var(--color-gold)] flex-shrink-0">
                <AvatarFallback className="bg-[var(--color-navy)] text-[var(--color-gold)] text-3xl sm:text-4xl font-bold">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>

              {/* Basic Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{profile.full_name}</h2>
                  <Badge className="bg-green-100 text-green-800 w-fit mx-auto sm:mx-0">
                    Verified Agent
                  </Badge>
                </div>
                
                {profile.agency_name && (
                  <p className="text-lg text-gray-600 mb-4">{profile.agency_name}</p>
                )}

                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="w-4 h-4 text-[var(--color-gold)]" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Phone className="w-4 h-4 text-[var(--color-gold)]" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[var(--color-gold)]" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">License Number</label>
                <p className="text-base text-gray-900 mt-1">
                  {profile.license_number || 'Not provided'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Years of Experience</label>
                <div className="flex items-center gap-2 mt-1">
                  <Award className="w-4 h-4 text-[var(--color-gold)]" />
                  <p className="text-base text-gray-900">
                    {getExperienceLabel(profile.years_experience)}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Area of Operation</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-[var(--color-gold)]" />
                  <p className="text-base text-gray-900">
                    {getAreaLabel(profile.area_of_operation)}
                  </p>
                </div>
              </div>

              {profile.agency_name && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Agency / Company</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4 text-[var(--color-gold)]" />
                    <p className="text-base text-gray-900">{profile.agency_name}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--color-gold)]" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-base text-gray-900 mt-1">
                  {formatDate(profile.created_at)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-base text-gray-900 mt-1">
                  {formatDate(profile.updated_at)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">Account Type</label>
                <Badge className="bg-[var(--color-navy)] text-[var(--color-gold)]">
                  Professional Agent
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <p className="text-xs text-gray-600 mt-1 font-mono break-all">
                  {profile.user_id}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[var(--color-gold)]/10 rounded-lg">
                    <Mail className="w-5 h-5 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="text-base text-gray-900">{profile.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[var(--color-gold)]/10 rounded-lg">
                    <Phone className="w-5 h-5 text-[var(--color-gold)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-base text-gray-900">
                      {profile.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons - Only at bottom */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => {
              // Navigate to dashboard and trigger settings tab via URL hash
              router.push('/agent-dashboard#settings')
            }}
            className="flex-1 bg-[var(--color-gold)] text-[var(--color-navy)] hover:bg-[var(--color-gold)]/90 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            onClick={() => router.push('/agent-dashboard')}
            className="flex-1 bg-[var(--color-navy)] text-[var(--color-gold)] hover:bg-[var(--color-navy)]/90 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 border-[var(--color-navy)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
