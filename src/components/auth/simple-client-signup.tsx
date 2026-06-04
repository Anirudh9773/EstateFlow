"use client"

import { useState } from "react"
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

export default function SimpleClientSignUpForm() {
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
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setValue("terms", checked === true, { shouldValidate: true })}
            className="border-2 border-slate-300 data-[state=checked]:bg-navy data-[state=checked]:border-navy mt-0.5"
          />
          <label htmlFor="terms" className="text-sm leading-tight">
            I agree to the{" "}
            <Link href="/terms" className="text-navy hover:underline font-medium">
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
