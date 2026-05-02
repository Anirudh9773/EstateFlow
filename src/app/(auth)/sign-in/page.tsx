"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import OAuthButtonsGroup from "@/components/auth/OAuthButtonsGroup"
import { signInWithOAuth } from "@/lib/auth/actions"
import { useUser } from "@/lib/auth/useUser"

export default function SignInPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (!userLoading && user) {
      const userType = user.user_metadata?.user_type
      if (userType === 'agent') {
        router.replace('/agent-dashboard')
      } else {
        router.replace('/')
      }
    }
  }, [user, userLoading, router])

  // Show loading while checking auth status
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    )
  }

  // Don't render form if user is logged in (will redirect)
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-navy mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  const handleOAuthClick = async (provider: string) => {
    setOauthLoading(true)
    try {
      const result = await signInWithOAuth(provider as 'google' | 'azure' | 'twitter')
      if (result?.error) {
        alert(result.error)
        setOauthLoading(false)
      }
      // If successful, user will be redirected
    } catch (error) {
      console.error('OAuth error:', error)
      alert('An error occurred during OAuth sign in')
      setOauthLoading(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { signIn } = await import('@/lib/auth/actions')
      const result = await signIn({ email, password })
      
      if (result?.error) {
        alert(result.error)
        setLoading(false)
        return
      }
      
      // Success - force reload for immediate auth state update
      // This is necessary because Supabase auth state needs to propagate
      if (result.userType === 'agent') {
        window.location.href = '/agent-dashboard'
      } else {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Sign in error:', error)
      alert('An error occurred during sign in')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="border-2 border-slate-300 data-[state=checked]:bg-navy data-[state=checked]:border-navy"
            />
            <label htmlFor="remember-me" className="text-sm">
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-navy text-gold hover:bg-navy/90" 
          disabled={loading || oauthLoading}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Sign In
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

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/sign-up/client" className="text-blue-600 hover:underline font-medium">
          Sign up as Client
        </Link>
        {" or "}
        <Link href="/sign-up/agent" className="text-blue-600 hover:underline font-medium">
          Sign up as Agent
        </Link>
      </p>
    </div>
  )
}
