"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
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

export default function SimpleAgentSignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

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

  const areaOfOperation = watch("areaOfOperation")
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
      // If successful, user will be redirected
    } catch (error: unknown) {
      // NEXT_REDIRECT is expected and means redirect is working
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
      window.location.href = '/verify-2fa'
    } catch (error) {
      console.error('Sign up error:', error)
      setServerError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <Input
          type="text"
          placeholder="John Doe"
          className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="you@example.com"
          className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number</label>
        <Input
          type="tel"
          placeholder="+44 7700 900000"
          className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Agency / Company Name</label>
        <Input
          type="text"
          placeholder="Your Agency Name"
          className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
          {...register("agencyName")}
        />
        {errors.agencyName && (
          <p className="text-sm text-red-600">{errors.agencyName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">License Number</label>
        <Input
          type="text"
          placeholder="Your License Number"
          className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
          {...register("licenseNumber")}
        />
        {errors.licenseNumber && (
          <p className="text-sm text-red-600">{errors.licenseNumber.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Area of Operation</label>
          <Select 
            value={areaOfOperation} 
            onValueChange={(value) => setValue("areaOfOperation", value || "", { shouldValidate: true })}
          >
            <SelectTrigger className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20">
              <SelectValue placeholder="Select your area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north">North Zone</SelectItem>
              <SelectItem value="south">South Zone</SelectItem>
              <SelectItem value="east">East Zone</SelectItem>
              <SelectItem value="west">West Zone</SelectItem>
              <SelectItem value="pan-city">Pan City</SelectItem>
            </SelectContent>
          </Select>
          {errors.areaOfOperation && (
            <p className="text-sm text-red-600">{errors.areaOfOperation.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Years of Experience</label>
          <Select 
            value={experience} 
            onValueChange={(value) => setValue("experience", value || "", { shouldValidate: true })}
          >
            <SelectTrigger className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20">
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-2">0-2 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
          {errors.experience && (
            <p className="text-sm text-red-600">{errors.experience.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
        {!errors.password && (
          <p className="text-xs text-gray-500">
            Must be 8+ characters with uppercase, lowercase, number, and special character
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Confirm Password</label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms-agent"
            checked={termsAccepted}
            onCheckedChange={(checked) => setValue("terms", checked === true, { shouldValidate: true })}
            className="border-2 border-slate-300 data-[state=checked]:bg-navy data-[state=checked]:border-navy mt-0.5"
          />
          <label htmlFor="terms-agent" className="text-sm leading-tight">
            I agree to the{" "}
            <Link href="/terms" className="text-emerald-600 hover:underline font-medium">
              Terms & Conditions
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-600">{errors.terms.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-medium" 
        disabled={loading || oauthLoading}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Register as Agent
      </Button>

      <Separator />
      
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
