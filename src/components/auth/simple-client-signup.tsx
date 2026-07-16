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
      window.location.href = '/verify-2fa'
    } catch (error) {
      console.error('Sign up error:', error)
      setServerError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Show logo on mobile only since LeftPanel is hidden */}
      <div className="flex lg:hidden justify-center mb-4">
        <Logo showSubtitle={false} className="h-8 w-8" />
      </div>

      {serverError && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="text-xs">
            {serverError.toLowerCase().includes('already registered') || serverError.toLowerCase().includes('already exists') ? (
              <span>
                An account with this email already exists. <Link href={`/sign-in?email=${encodeURIComponent(watch('email') || '')}`} className="underline font-semibold text-navy hover:text-navy/80">Sign in instead</Link>.
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
          <label className="text-xs font-semibold text-slate-600">Full Name</label>
          <Input
            type="text"
            placeholder="John Doe"
            className="h-10 border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-xs text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">Phone Number</label>
          <Input
            type="tel"
            placeholder="+44 7700 900000"
            className="h-10 border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Email full width */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-600">Email Address</label>
        <Input
          type="email"
          placeholder="you@example.com"
          className="h-10 border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Grid for Password and Confirm Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-10 border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
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
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">Confirm Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-10 border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
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
            <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setValue("terms", checked === true, { shouldValidate: true })}
            className="border-2 border-slate-300 data-[state=checked]:bg-navy data-[state=checked]:border-navy mt-0.5"
          />
          <label htmlFor="terms" className="text-xs leading-tight">
            I agree to the{" "}
            <Link href="/terms" className="text-navy hover:underline font-medium">
              Terms & Conditions
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="text-xs text-red-600">{errors.terms.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        size="lg"
        className="w-full bg-navy text-gold hover:bg-navy/90 font-medium" 
        disabled={loading || oauthLoading}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Create Client Account
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
