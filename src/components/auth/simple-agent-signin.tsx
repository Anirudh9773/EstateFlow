"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Shield } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import OAuthButtonsGroup from "./OAuthButtonsGroup"
import { signInWithOAuth } from "@/lib/auth/actions"
import { signInSchema, type SignInFormData } from "@/lib/validations/auth"

export default function SimpleAgentSignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  })

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
      // NEXT_REDIRECT is expected - it means redirect is working
      if (error instanceof Error && error.message?.includes('NEXT_REDIRECT')) {
        return
      }
      console.error('OAuth error:', error)
      setServerError('An error occurred during OAuth sign in')
      setOauthLoading(false)
    }
  }

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true)
    setServerError(null)
    
    try {
      const { signIn } = await import('@/lib/auth/actions')
      const result = await signIn(data)
      
      if (result?.error) {
        setServerError(result.error)
        setLoading(false)
        return
      }
      
      // Success - redirect to agent dashboard
      window.location.href = '/agent-dashboard'
    } catch (error) {
      console.error('Sign in error:', error)
      setServerError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Agent Portal Badge */}
      <div className="flex justify-center">
        <Badge variant="secondary" className="border-green-600 text-green-600">
          <Shield className="mr-2 h-3 w-3" />
          Agent Portal
        </Badge>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

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
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-me-agent"
              checked={rememberMe}
              onCheckedChange={setRememberMe}
              className="border-2 border-slate-300 data-[state=checked]:bg-navy data-[state=checked]:border-navy"
            />
            <label htmlFor="remember-me-agent" className="text-sm">
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading || oauthLoading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Sign in as Agent
        </Button>

        <Separator />
        
        {/* OAuth Options */}
        <OAuthButtonsGroup 
          onOAuthClick={handleOAuthClick}
          disabled={loading || oauthLoading}
          loading={oauthLoading}
          type="signin"
        />
      </form>
    </div>
  )
}
