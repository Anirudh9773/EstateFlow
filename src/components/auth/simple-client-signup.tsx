"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import OAuthButtonsGroup from "./OAuthButtonsGroup"
import { signInWithOAuth } from "@/lib/auth/actions"
import { clientSignUpSchema, type ClientSignUpFormData } from "@/lib/validations/auth"
import { Logo } from "@/components/logo"
import { toast } from "sonner"

export default function SimpleClientSignUpForm() {
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
  } = useForm<ClientSignUpFormData>({
    resolver: zodResolver(clientSignUpSchema),
    mode: "onBlur",
    defaultValues: {
      terms: false,
    },
  })

  const termsAccepted = watch("terms")

  const handleOAuthClick = async (provider: string) => {
    setOauthLoading(true)
    try {
      const result = await signInWithOAuth(provider as 'google' | 'facebook' | 'twitter', 'client')
      if (result?.error) {
        setServerError(result.error)
        setOauthLoading(false)
        return
      }
    } catch (error: unknown) {
      // NEXT_REDIRECT is expected - it means redirect is working
      if (error instanceof Error && error.message?.includes('NEXT_REDIRECT')) {
        return
      }
      console.error('OAuth error:', error)
      setServerError('An error occurred during OAuth sign up')
      setOauthLoading(false)
    }
  }

  const onSubmit = async (data: ClientSignUpFormData) => {
    setLoading(true)
    setServerError(null)
    
    try {
      const { signUp } = await import('@/lib/auth/actions')
      const result = await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
        userType: 'client',
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

      {/* Grid for Name and Phone */}
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
      </div>

      {/* Email full width */}
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
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setValue("terms", checked === true, { shouldValidate: true })}
            className="border border-white/20 data-[state=checked]:bg-gold data-[state=checked]:text-[#0d0d14] mt-0.5"
          />
          <label htmlFor="terms" className="text-xs text-text-secondary leading-tight cursor-pointer">
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
        Create Client Account
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
