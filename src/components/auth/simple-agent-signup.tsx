"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2, X, ChevronDown, Search } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import OAuthButtonsGroup from "./OAuthButtonsGroup"
import { signInWithOAuth } from "@/lib/auth/actions"
import { agentSignUpSchema, type AgentSignUpFormData } from "@/lib/validations/auth"
import { Logo } from "@/components/logo"
import { toast } from "sonner"
import { UK_POSTCODE_AREAS } from "@/data/postcodeAreas"

interface AreaOfOperationSelectProps {
  value: string
  onChange: (value: string) => void
}

function AreaOfOperationSelect({ value, onChange }: AreaOfOperationSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedCodes = value ? value.split(",").filter(Boolean) : []

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredAreas = UK_POSTCODE_AREAS.filter(area => {
    const q = search.toLowerCase()
    return area.code.toLowerCase().includes(q) || area.name.toLowerCase().includes(q)
  })

  const toggleArea = (code: string) => {
    if (selectedCodes.includes(code)) {
      const updated = selectedCodes.filter(c => c !== code)
      onChange(updated.join(","))
    } else {
      onChange([...selectedCodes, code].join(","))
    }
  }

  const removeArea = (code: string) => {
    const updated = selectedCodes.filter(c => c !== code)
    onChange(updated.join(","))
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-10 px-3 border border-white/15 rounded-md bg-[#1E1E28] text-sm text-white hover:border-gold/40 focus:border-gold focus:outline-none transition-colors"
      >
        <span className="text-text-muted truncate">
          {selectedCodes.length === 0
            ? "Select areas..."
            : `${selectedCodes.length} area${selectedCodes.length > 1 ? "s" : ""} selected`}
        </span>
        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Selected badges */}
      {selectedCodes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedCodes.map(code => {
            const area = UK_POSTCODE_AREAS.find(a => a.code === code)
            return (
              <span
                key={code}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold/15 text-gold border border-gold/30 rounded-md text-xs font-medium"
              >
                {code} — {area?.name || code}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeArea(code) }}
                  className="text-gold hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )
          })}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-[#1A1A24] border border-white/15 rounded-lg shadow-xl max-h-56 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-white/10 sticky top-0 bg-[#1A1A24]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search postcode areas..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-[#14141E] border border-white/15 text-white rounded-md focus:border-gold focus:outline-none"
                autoFocus
              />
            </div>
          </div>
          {/* Options list */}
          <div className="overflow-y-auto max-h-44">
            {filteredAreas.length === 0 ? (
              <div className="px-3 py-4 text-xs text-text-muted text-center">No areas found</div>
            ) : (
              filteredAreas.map(area => {
                const isSelected = selectedCodes.includes(area.code)
                return (
                  <button
                    key={area.code}
                    type="button"
                    onClick={() => toggleArea(area.code)}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-gold/15 text-gold font-medium"
                        : "hover:bg-white/5 text-[#B8B5AE]"
                    }`}
                  >
                    <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? "bg-gold border-gold" : "border-white/30"
                    }`}>
                      {isSelected && (
                        <svg className="w-2.5 h-2.5 text-[#0d0d14]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className="font-mono font-bold text-[11px] w-7 text-white">{area.code}</span>
                    <span className="truncate">{area.name}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}


export default function SimpleAgentSignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Reset loading states when page is shown (handles back-forward cache restores)
  useEffect(() => {
    const handlePageShow = () => {
      setOauthLoading(false)
      setLoading(false)
    }

    window.addEventListener("pageshow", handlePageShow)
    return () => {
      window.removeEventListener("pageshow", handlePageShow)
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AgentSignUpFormData>({
    resolver: zodResolver(agentSignUpSchema),
    mode: "onBlur",
    defaultValues: {
      terms: false,
      areaOfOperation: "",
      experience: "",
    },
  })

  const experience = watch("experience")
  const termsAccepted = watch("terms")

  const handleOAuthClick = async (provider: string) => {
    setOauthLoading(true)
    try {
      const result = await signInWithOAuth(provider as 'google' | 'facebook' | 'twitter', 'agent')
      if (result?.error) {
        setServerError(result.error)
        setOauthLoading(false)
        return
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes('NEXT_REDIRECT')) {
        console.log('Redirect initiated successfully')
        return
      }
      console.error('OAuth error:', error)
      setServerError('An error occurred during OAuth sign up')
      setOauthLoading(false)
    }
  }

  const onSubmit = async (data: AgentSignUpFormData) => {
    setLoading(true)
    setServerError(null)
    
    try {
      const { signUp } = await import('@/lib/auth/actions')
      const result = await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
        userType: 'agent',
        agencyName: data.agencyName,
        licenseNumber: data.licenseNumber,
        areaOfOperation: data.areaOfOperation,
        yearsExperience: data.experience,
      })
      
      if (result.error) {
        setServerError(result.error)
        setLoading(false)
        return
      }
      
      // Success - redirect to 2FA verification page
      toast.success('Account created successfully!')
      window.location.href = '/verify-2fa'
    } catch (error) {
      console.error('Sign up error:', error)
      setServerError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Show logo on mobile only since LeftPanel is hidden */}
      <div className="flex lg:hidden justify-center mb-4">
        <Logo showSubtitle={false} className="h-8 w-8" />
      </div>

      {serverError && (
        <Alert variant="destructive" className="py-2 bg-red-950/50 border-red-500/50 text-red-200">
          <AlertDescription className="text-xs">
            {serverError.toLowerCase().includes('already registered') || serverError.toLowerCase().includes('already exists') ? (
              <span>
                An account with this email already exists. <Link href={`/sign-in?email=${encodeURIComponent(watch('email') || '')}`} className="underline font-semibold text-gold hover:text-gold/80">Sign in instead</Link>.
              </span>
            ) : (
              serverError
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Grid for Name and Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Full Name</label>
          <Input
            type="text"
            placeholder="John Doe"
            className="h-10 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-xs text-red-400">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Address</label>
          <Input
            type="email"
            placeholder="you@example.com"
            className="h-10 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Grid for Phone and Agency Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Phone Number</label>
          <Input
            type="tel"
            placeholder="+44 7700 900000"
            className="h-10 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold"
            {...register("phone")}
            onChange={(e) => {
              const val = e.target.value
              if (/^[0-9+\s\-()]*$/.test(val)) {
                e.target.value = val
                register("phone").onChange(e)
              } else {
                e.preventDefault()
              }
            }}
          />
          {errors.phone && (
            <p className="text-xs text-red-400">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Agency / Company Name</label>
          <Input
            type="text"
            placeholder="Your Agency Name"
            className="h-10 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold"
            {...register("agencyName")}
          />
          {errors.agencyName && (
            <p className="text-xs text-red-400">{errors.agencyName.message}</p>
          )}
        </div>
      </div>

      {/* Grid for License and Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">License Number</label>
          <Input
            type="text"
            placeholder="Your License Number"
            className="h-10 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold"
            {...register("licenseNumber")}
          />
          {errors.licenseNumber && (
            <p className="text-xs text-red-400">{errors.licenseNumber.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Years of Experience</label>
          <Select 
            value={experience} 
            onValueChange={(value) => setValue("experience", value || "", { shouldValidate: true })}
          >
            <SelectTrigger className="h-10 bg-[#1E1E28] border-white/15 text-white focus:border-gold">
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent className="bg-[#1E1E28] border-white/15 text-white">
              <SelectItem value="0-2">0-2 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
          {errors.experience && (
            <p className="text-xs text-red-400">{errors.experience.message}</p>
          )}
        </div>
      </div>

      {/* Area of Operation multi-select */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Area of Operation</label>
        <AreaOfOperationSelect
          value={watch("areaOfOperation") || ""}
          onChange={(val) => setValue("areaOfOperation", val, { shouldValidate: true })}
        />
        {errors.areaOfOperation && (
          <p className="text-xs text-red-400">{errors.areaOfOperation.message}</p>
        )}
      </div>

      {/* Grid for Password and Confirm Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-10 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Confirm Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-10 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold pr-10"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1 pt-1">
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms-agent"
            checked={termsAccepted}
            onCheckedChange={(checked) => setValue("terms", checked === true, { shouldValidate: true })}
            className="border border-white/20 data-[state=checked]:bg-gold data-[state=checked]:text-[#0d0d14] mt-0.5"
          />
          <label htmlFor="terms-agent" className="text-xs text-text-secondary leading-tight cursor-pointer">
            I agree to the{" "}
            <Link href="/terms" className="text-gold hover:underline font-semibold">
              Terms & Conditions
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="text-xs text-red-400">{errors.terms.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        size="lg"
        className="w-full bg-gold text-[#0d0d14] hover:bg-gold/90 font-bold h-11 rounded-xl cursor-pointer" 
        disabled={loading || oauthLoading}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Register as Agent
      </Button>

      <Separator className="bg-white/10" />
      
      {/* OAuth Options */}
      <OAuthButtonsGroup 
        onOAuthClick={handleOAuthClick}
        disabled={loading || oauthLoading}
        loading={oauthLoading}
        type="signup"
      />
    </form>
  )
}
