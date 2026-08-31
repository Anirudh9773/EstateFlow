"use client"

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Award,
  Briefcase,
  Star,
  CheckCircle,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { getInitials } from '@/lib/utils/getInitials'
import StarRating from '@/components/ui/StarRating'
import { agents as realAgents } from '@/data/agents'
import { fetchAgentById } from '@/lib/agents/fetchAgents'
import { submitAgentDirectInquiry } from '@/lib/auth/actions'
import type { Agent } from '@/types/agent'

// ── Form validation helpers ────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX = /^[A-Za-z\s'-]{2,50}$/

function validateCountryPhone(countryCode: string, phone: string): { isValid: boolean; error?: string; maxDigits: number } {
  const digits = phone.replace(/\D/g, '')
  let isValid = false
  let error = 'Please enter a valid phone number'
  let maxDigits = 11

  if (countryCode === '+91') {
    maxDigits = 10
    isValid = /^\d{10}$/.test(digits)
    error = 'Please enter a valid 10-digit Indian phone number'
  } else if (countryCode === '+1') {
    maxDigits = 10
    isValid = /^\d{10}$/.test(digits)
    error = 'Please enter a valid 10-digit US phone number'
  } else if (countryCode === '+44') {
    maxDigits = 11
    isValid = /^\d{10,11}$/.test(digits)
    error = 'Please enter a valid 10 or 11-digit UK phone number'
  } else if (countryCode === '+971') {
    maxDigits = 10
    isValid = /^\d{9,10}$/.test(digits)
    error = 'Please enter a valid 9 or 10-digit UAE phone number'
  } else {
    maxDigits = 11
    isValid = /^\d{9,11}$/.test(digits)
    error = 'Please enter a valid phone number'
  }

  return { isValid, error, maxDigits }
}

interface ContactFormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

interface CallbackFormErrors {
  name?: string
  phone?: string
}

export default function PublicAgentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.id as string
  
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isCallbackOpen, setIsCallbackOpen] = useState(false)
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [isSubmittingCallback, setIsSubmittingCallback] = useState(false)
  
  const [contactForm, setContactForm] = useState({ name: '', email: '', countryCode: '+44', phone: '', message: '' })
  const [callbackForm, setCallbackForm] = useState({ name: '', countryCode: '+44', phone: '', time: 'morning' })
  const [contactErrors, setContactErrors] = useState<ContactFormErrors>({})
  const [callbackErrors, setCallbackErrors] = useState<CallbackFormErrors>({})
  const [contactTouched, setContactTouched] = useState<Record<string, boolean>>({})
  const [callbackTouched, setCallbackTouched] = useState<Record<string, boolean>>({})

  // ── Contact form validation ────────────────────────────────
  const validateContactForm = useCallback(() => {
    const errors: ContactFormErrors = {}
    const trimmedName = contactForm.name.trim()

    if (!trimmedName) {
      errors.name = 'Name is required'
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    } else if (/\d/.test(trimmedName)) {
      errors.name = 'Name cannot contain numbers'
    } else if (!NAME_REGEX.test(trimmedName)) {
      errors.name = 'Name must contain only letters'
    }

    if (!contactForm.email.trim()) {
      errors.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(contactForm.email.trim())) {
      errors.email = 'Please enter a valid email address'
    }

    if (!contactForm.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else {
      const phoneVal = validateCountryPhone(contactForm.countryCode, contactForm.phone)
      if (!phoneVal.isValid) {
        errors.phone = phoneVal.error
      }
    }

    if (!contactForm.message.trim()) {
      errors.message = 'Message is required'
    } else if (contactForm.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters'
    }

    setContactErrors(errors)
    return Object.keys(errors).length === 0
  }, [contactForm])

  // ── Callback form validation ───────────────────────────────
  const validateCallbackForm = useCallback(() => {
    const errors: CallbackFormErrors = {}
    const trimmedName = callbackForm.name.trim()

    if (!trimmedName) {
      errors.name = 'Name is required'
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    } else if (/\d/.test(trimmedName)) {
      errors.name = 'Name cannot contain numbers'
    } else if (!NAME_REGEX.test(trimmedName)) {
      errors.name = 'Name must contain only letters'
    }

    if (!callbackForm.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else {
      const phoneVal = validateCountryPhone(callbackForm.countryCode, callbackForm.phone)
      if (!phoneVal.isValid) {
        errors.phone = phoneVal.error
      }
    }

    setCallbackErrors(errors)
    return Object.keys(errors).length === 0
  }, [callbackForm])

  // Re-validate on each change (only shows errors for touched fields)
  useEffect(() => { validateContactForm() }, [validateContactForm])
  useEffect(() => { validateCallbackForm() }, [validateCallbackForm])

  useEffect(() => {
    async function loadAgent() {
      try {
        // Try to fetch from database first
        const dbAgent = await fetchAgentById(agentId)
        
        if (dbAgent) {
          setAgent(dbAgent)
        } else {
          // If not found in database, try static agents from dataset
          const staticAgent = realAgents.find(a => a.id === agentId)
          setAgent(staticAgent || null)
        }
      } catch (error) {
        console.error('Error loading agent:', error)
        // Fallback to static agents
        const staticAgent = realAgents.find(a => a.id === agentId)
        setAgent(staticAgent || null)
      } finally {
        setLoading(false)
      }
    }
    
    loadAgent()
  }, [agentId])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
          <p className="text-text-secondary">Loading agent profile...</p>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 bg-[#1A1A24] border-white/10">
          <CardContent className="p-6 text-center">
            <p className="text-red-400 mb-4">Agent not found</p>
            <Button onClick={() => router.push('/agents')} className="bg-gold text-navy hover:bg-gold/90">
              Back to Agents
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getTierLabel = (tier: string) => {
    const tierMap: Record<string, string> = {
      'local': 'Local Specialist',
      'regional': 'Regional Expert',
      'nationwide': 'Nationwide Coverage'
    }
    return tierMap[tier] || tier
  }

  const getTierColor = (tier: string) => {
    const colorMap: Record<string, string> = {
      'local': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      'regional': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      'nationwide': 'bg-gold/15 text-gold border border-gold/25'
    }
    return colorMap[tier] || 'bg-gold/10 text-gold border border-gold/20'
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.push('/agents')}
          className="mb-6 border-gold/30 text-gold hover:bg-gold/10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Agents
        </Button>

        {/* Profile Header Card */}
        <Card className="mb-6 bg-[#1A1A24] border-white/10 shadow-none">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-gold/40 flex-shrink-0">
                {agent.avatar && <AvatarImage src={agent.avatar} alt={agent.name} />}
                <AvatarFallback className="bg-gold text-[#0d0d14] text-3xl sm:text-4xl font-bold">
                  {getInitials(agent.name)}
                </AvatarFallback>
              </Avatar>

              {/* Basic Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F3EE]">{agent.name}</h1>
                  {agent.verified && (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mx-auto sm:mx-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Agent
                    </Badge>
                  )}
                </div>
                
                <p className="text-lg text-text-secondary mb-2">{agent.agency}</p>

                <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <StarRating rating={agent.rating} size="md" />
                    <span className="font-semibold text-gold">{agent.rating}</span>
                    <span className="text-text-muted">({agent.reviewCount} reviews)</span>
                  </div>
                  <Badge className={getTierColor(agent.tier)}>
                    {getTierLabel(agent.tier)}
                  </Badge>
                </div>

                <p className="text-text-secondary mb-5 leading-relaxed">{agent.bio}</p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => setIsContactOpen(true)}
                    className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold cursor-pointer"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Agent
                  </Button>
                  <Button 
                    onClick={() => setIsCallbackOpen(true)}
                    variant="outline" 
                    className="border-gold/40 text-gold hover:bg-gold/10 font-semibold cursor-pointer"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Request Callback
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-[#1A1A24] border-white/10 shadow-none">
            <CardContent className="p-5 text-center">
              <TrendingUp className="w-8 h-8 text-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-white font-heading">{agent.leadsHandled}</div>
              <div className="text-xs sm:text-sm text-text-secondary mt-1">Leads Handled</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A24] border-white/10 shadow-none">
            <CardContent className="p-5 text-center">
              <Award className="w-8 h-8 text-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-white font-heading">{agent.yearsExperience}</div>
              <div className="text-xs sm:text-sm text-text-secondary mt-1">Years Experience</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A24] border-white/10 shadow-none">
            <CardContent className="p-5 text-center">
              <Clock className="w-8 h-8 text-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-white font-heading">{agent.responseTime}</div>
              <div className="text-xs sm:text-sm text-text-secondary mt-1">Response Time</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A24] border-white/10 shadow-none">
            <CardContent className="p-5 text-center">
              <Star className="w-8 h-8 text-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-white font-heading">{agent.rating}</div>
              <div className="text-xs sm:text-sm text-text-secondary mt-1">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Third-Party Ratings Grid */}
        {(agent.trustpilot_rating || agent.allagents_rating || agent.google_rating) && (
          <div className="mb-6">
            <h2 className="font-heading text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" />
              Verified Third-Party Ratings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Trustpilot Card */}
              {agent.trustpilot_rating && (
                <Card className="bg-[#1A1A24] border-white/10 shadow-none hover:border-gold/30 transition-all duration-200">
                  <CardContent className="p-5 flex flex-col justify-between h-full min-h-[160px]">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <svg className="w-5 h-5 text-[#00b67a]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 9.5h-9L12 0 9 9.5H0l7.25 5.5-2.75 9L12 18.5l7.5 5.5-2.75-9L24 9.5z" />
                          </svg>
                          <span className="font-bold text-white text-sm tracking-tight">Trustpilot</span>
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted bg-white/5 px-1.5 py-0.5 rounded border border-white/10">Verified</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-extrabold text-white font-heading">{agent.trustpilot_rating.toFixed(1)}</span>
                        <span className="text-text-muted text-sm">/ 5.0</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <StarRating rating={agent.trustpilot_rating} size="sm" />
                        <span className="text-xs text-text-muted">({agent.trustpilot_review_count} reviews)</span>
                      </div>
                    </div>
                    {agent.trustpilot_username && (
                      <a 
                        href={`https://www.trustpilot.com/review/${agent.trustpilot_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-gold hover:underline flex items-center gap-1 transition-colors mt-auto pt-2 border-t border-white/10"
                      >
                        Verify on Trustpilot
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* allAgents Card */}
              {agent.allagents_rating && (
                <Card className="bg-[#1A1A24] border-white/10 shadow-none hover:border-gold/30 transition-all duration-200">
                  <CardContent className="p-5 flex flex-col justify-between h-full min-h-[160px]">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <svg className="w-5 h-5 text-[#f47a20]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 12h3v8h14v-8h3L12 2zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                          </svg>
                          <span className="font-bold text-white text-sm tracking-tight">allAgents</span>
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted bg-white/5 px-1.5 py-0.5 rounded border border-white/10">Verified</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-extrabold text-white font-heading">{agent.allagents_rating.toFixed(1)}</span>
                        <span className="text-text-muted text-sm">/ 5.0</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <StarRating rating={agent.allagents_rating} size="sm" />
                        <span className="text-xs text-text-muted">({agent.allagents_review_count} reviews)</span>
                      </div>
                    </div>
                    {agent.allagents_username && (
                      <a 
                        href={`https://www.allagents.co.uk/${agent.allagents_username}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-gold hover:underline flex items-center gap-1 transition-colors mt-auto pt-2 border-t border-white/10"
                      >
                        Verify on allAgents
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Google Reviews Card */}
              {agent.google_rating && (
                <Card className="bg-[#1A1A24] border-white/10 shadow-none hover:border-gold/30 transition-all duration-200">
                  <CardContent className="p-5 flex flex-col justify-between h-full min-h-[160px]">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                          </svg>
                          <span className="font-bold text-white text-sm tracking-tight ml-1.5">Google</span>
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted bg-white/5 px-1.5 py-0.5 rounded border border-white/10">Verified</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-extrabold text-white font-heading">{agent.google_rating.toFixed(1)}</span>
                        <span className="text-text-muted text-sm">/ 5.0</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <StarRating rating={agent.google_rating} size="sm" />
                        <span className="text-xs text-text-muted">({agent.google_review_count} reviews)</span>
                      </div>
                    </div>
                    {agent.google_place_id && (
                      <a 
                        href={`https://search.google.com/local/reviews?placeid=${agent.google_place_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-gold hover:underline flex items-center gap-1 transition-colors mt-auto pt-2 border-t border-white/10"
                      >
                        Verify on Google
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Professional Information */}
          <Card className="bg-[#1A1A24] border-white/10 shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-lg font-semibold text-white">
                <Briefcase className="w-5 h-5 text-gold" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Agency / Company</label>
                <p className="text-base text-white font-medium mt-1">{agent.agency}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Service Tier</label>
                <div className="mt-1">
                  <Badge className={getTierColor(agent.tier)}>
                    {getTierLabel(agent.tier)}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Years of Experience</label>
                <div className="flex items-center gap-2 mt-1">
                  <Award className="w-4 h-4 text-gold" />
                  <p className="text-base text-white font-medium">{agent.yearsExperience} years</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Commission Rate</label>
                <p className="text-base text-white font-medium mt-1">{agent.fee}</p>
              </div>
            </CardContent>
          </Card>

          {/* Coverage & Specializations */}
          <Card className="bg-[#1A1A24] border-white/10 shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-lg font-semibold text-white">
                <MapPin className="w-5 h-5 text-gold" />
                Coverage & Specializations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Primary Location</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gold" />
                  <p className="text-base text-white font-medium">{agent.location}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Coverage Areas</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {agent.coverageAreas.map((area) => (
                    <Badge key={area} variant="outline" className="border-gold/30 text-gold bg-gold/5 text-xs py-1 px-2.5">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Specializations</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {agent.specialisations.map((spec) => (
                    <Badge key={spec} className="bg-white/5 border border-white/15 text-white text-xs py-1 px-2.5">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Average Response Time</label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-gold" />
                  <p className="text-base text-white font-medium">{agent.responseTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <Card className="mt-6 bg-[#14141E] border border-gold/30 text-white">
          <CardContent className="p-6 sm:p-8 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3 text-gold">Ready to Work with {agent.name}?</h2>
            <p className="mb-6 text-text-secondary max-w-2xl mx-auto">
              Get in touch today to discuss your property needs. {agent.name} typically responds within {agent.responseTime}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => setIsContactOpen(true)}
                className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold cursor-pointer"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Agent
              </Button>
              <Button 
                onClick={() => setIsCallbackOpen(true)}
                variant="outline" 
                className="border-gold/40 text-gold hover:bg-gold/10 font-semibold cursor-pointer"
              >
                <Phone className="w-4 h-4 mr-2" />
                Request Callback
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Contact Agent Modal */}
        <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
          <DialogContent className="max-w-md bg-[#1A1A24] border border-white/15 p-6 rounded-2xl text-white">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl font-bold text-white">Contact {agent.name}</DialogTitle>
              <DialogDescription className="text-text-secondary text-sm">
                Send a secure message. {agent.name} typically responds in {agent.responseTime}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setContactTouched({ name: true, email: true, phone: true, message: true });
              if (!validateContactForm()) return;
              
              setIsSubmittingContact(true);
              try {
                const result = await submitAgentDirectInquiry({
                  agentId: agent.id,
                  agentName: agent.name,
                  type: 'inquiry',
                  clientName: contactForm.name,
                  clientEmail: contactForm.email,
                  clientPhone: contactForm.phone,
                  countryCode: contactForm.countryCode,
                  message: contactForm.message
                });

                if (result?.error) {
                  toast.error('Failed to send message: ' + result.error);
                  return;
                }

                toast.success(`Message sent successfully! ${agent.name} will receive your inquiry on their dashboard.`);
                setIsContactOpen(false);
                setContactForm({ name: '', email: '', countryCode: '+44', phone: '', message: '' });
                setContactTouched({});
                setContactErrors({});
              } catch (err) {
                console.error('Contact submit error:', err);
                toast.error('An error occurred while sending your message.');
              } finally {
                setIsSubmittingContact(false);
              }
            }} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Your Name <span className="text-red-400">*</span></label>
                <Input 
                  type="text" 
                  placeholder="John Doe" 
                  value={contactForm.name}
                  onChange={e => {
                    const filtered = e.target.value.replace(/[^A-Za-z\s'-]/g, '');
                    setContactForm({...contactForm, name: filtered});
                  }}
                  onBlur={() => setContactTouched(prev => ({ ...prev, name: true }))}
                  className={`bg-[#1E1E28] text-white border focus:border-gold ${contactTouched.name && contactErrors.name ? 'border-red-400' : 'border-white/15'}`}
                />
                {contactTouched.name && contactErrors.name && (
                  <p className="text-xs text-red-400 mt-0.5">{contactErrors.name}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Email Address <span className="text-red-400">*</span></label>
                <Input 
                  type="email" 
                  placeholder="john@example.com" 
                  value={contactForm.email}
                  onChange={e => setContactForm({...contactForm, email: e.target.value})}
                  onBlur={() => setContactTouched(prev => ({ ...prev, email: true }))}
                  className={`bg-[#1E1E28] text-white border focus:border-gold ${contactTouched.email && contactErrors.email ? 'border-red-400' : 'border-white/15'}`}
                />
                {contactTouched.email && contactErrors.email && (
                  <p className="text-xs text-red-400 mt-0.5">{contactErrors.email}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Phone Number <span className="text-red-400">*</span></label>
                <div className="flex gap-2">
                  <Select 
                    value={contactForm.countryCode} 
                    onValueChange={(val) => setContactForm(prev => ({ ...prev, countryCode: val || '+44', phone: '' }))}
                  >
                    <SelectTrigger className="w-28 h-10 border border-white/15 bg-[#1E1E28] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E28] border-white/15 text-white">
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+971">🇦🇪 +971</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={contactForm.phone}
                    onChange={e => {
                      const val = e.target.value;
                      const digits = val.replace(/\D/g, "");
                      const { maxDigits } = validateCountryPhone(contactForm.countryCode, val);
                      if (digits.length <= maxDigits) {
                        setContactForm({ ...contactForm, phone: val });
                      }
                    }}
                    onBlur={() => setContactTouched(prev => ({ ...prev, phone: true }))}
                    className={`flex-1 bg-[#1E1E28] text-white border focus:border-gold ${contactTouched.phone && contactErrors.phone ? 'border-red-400' : 'border-white/15'}`}
                  />
                </div>
                {contactTouched.phone && contactErrors.phone && (
                  <p className="text-xs text-red-400 mt-0.5">{contactErrors.phone}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Message <span className="text-red-400">*</span></label>
                <textarea 
                  rows={4}
                  placeholder={`Hello ${agent.name}, I would like to discuss...`} 
                  value={contactForm.message}
                  onChange={e => setContactForm({...contactForm, message: e.target.value})}
                  onBlur={() => setContactTouched(prev => ({ ...prev, message: true }))}
                  className={`w-full border rounded-lg p-2.5 bg-[#1E1E28] text-white placeholder:text-text-muted focus:outline-none focus:border-gold text-sm resize-none ${contactTouched.message && contactErrors.message ? 'border-red-400' : 'border-white/15'}`}
                />
                {contactTouched.message && contactErrors.message && (
                  <p className="text-xs text-red-400 mt-0.5">{contactErrors.message}</p>
                )}
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => { setIsContactOpen(false); setContactTouched({}); }} className="border-white/15 text-text-secondary hover:bg-white/10 hover:text-white cursor-pointer">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmittingContact || (Object.keys(contactErrors).length > 0 && Object.keys(contactTouched).length > 0)}
                  className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmittingContact && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Message
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Request Callback Modal */}
        <Dialog open={isCallbackOpen} onOpenChange={setIsCallbackOpen}>
          <DialogContent className="max-w-md bg-[#1A1A24] border border-white/15 p-6 rounded-2xl text-white">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl font-bold text-white">Request Callback</DialogTitle>
              <DialogDescription className="text-text-secondary text-sm">
                Leave your number and {agent.name} will call you back.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setCallbackTouched({ name: true, phone: true });
              if (!validateCallbackForm()) return;
              
              setIsSubmittingCallback(true);
              try {
                const result = await submitAgentDirectInquiry({
                  agentId: agent.id,
                  agentName: agent.name,
                  type: 'callback',
                  clientName: callbackForm.name,
                  clientPhone: callbackForm.phone,
                  countryCode: callbackForm.countryCode,
                  preferredTime: callbackForm.time
                });

                if (result?.error) {
                  toast.error('Failed to request callback: ' + result.error);
                  return;
                }

                toast.success(`Callback requested successfully! ${agent.name} will receive your request on their dashboard.`);
                setIsCallbackOpen(false);
                setCallbackForm({ name: '', countryCode: '+44', phone: '', time: 'morning' });
                setCallbackTouched({});
                setCallbackErrors({});
              } catch (err) {
                console.error('Callback submit error:', err);
                toast.error('An error occurred while requesting callback.');
              } finally {
                setIsSubmittingCallback(false);
              }
            }} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Your Name <span className="text-red-400">*</span></label>
                <Input 
                  type="text" 
                  placeholder="John Doe" 
                  value={callbackForm.name}
                  onChange={e => {
                    const filtered = e.target.value.replace(/[^A-Za-z\s'-]/g, '');
                    setCallbackForm({...callbackForm, name: filtered});
                  }}
                  onBlur={() => setCallbackTouched(prev => ({ ...prev, name: true }))}
                  className={`bg-[#1E1E28] text-white border focus:border-gold ${callbackTouched.name && callbackErrors.name ? 'border-red-400' : 'border-white/15'}`}
                />
                {callbackTouched.name && callbackErrors.name && (
                  <p className="text-xs text-red-400 mt-0.5">{callbackErrors.name}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Phone Number <span className="text-red-400">*</span></label>
                <div className="flex gap-2">
                  <Select 
                    value={callbackForm.countryCode} 
                    onValueChange={(val) => setCallbackForm(prev => ({ ...prev, countryCode: val || '+44', phone: '' }))}
                  >
                    <SelectTrigger className="w-28 h-10 border border-white/15 bg-[#1E1E28] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E1E28] border-white/15 text-white">
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+971">🇦🇪 +971</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={callbackForm.phone}
                    onChange={e => {
                      const val = e.target.value;
                      const digits = val.replace(/\D/g, "");
                      const { maxDigits } = validateCountryPhone(callbackForm.countryCode, val);
                      if (digits.length <= maxDigits) {
                        setCallbackForm({ ...callbackForm, phone: val });
                      }
                    }}
                    onBlur={() => setCallbackTouched(prev => ({ ...prev, phone: true }))}
                    className={`flex-1 bg-[#1E1E28] text-white border focus:border-gold ${callbackTouched.phone && callbackErrors.phone ? 'border-red-400' : 'border-white/15'}`}
                  />
                </div>
                {callbackTouched.phone && callbackErrors.phone && (
                  <p className="text-xs text-red-400 mt-0.5">{callbackErrors.phone}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Preferred Time to Call</label>
                <select 
                  value={callbackForm.time}
                  onChange={e => setCallbackForm({...callbackForm, time: e.target.value})}
                  className="w-full border border-white/15 rounded-lg p-2.5 focus:outline-none focus:border-gold text-sm bg-[#1E1E28] text-white"
                >
                  <option value="morning">Morning (9am - 12pm)</option>
                  <option value="afternoon">Afternoon (12pm - 4pm)</option>
                  <option value="evening">Evening (4pm - 7pm)</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => { setIsCallbackOpen(false); setCallbackTouched({}); }} className="border-white/15 text-text-secondary hover:bg-white/10 hover:text-white cursor-pointer">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmittingCallback || (Object.keys(callbackErrors).length > 0 && Object.keys(callbackTouched).length > 0)}
                  className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmittingCallback && <Loader2 className="w-4 h-4 animate-spin" />}
                  Request Call
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
