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
import { Logo } from "@/components/logo"
import { toast } from "sonner"

export default function SignInPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // Read email from search params to pre-fill if redirected from signup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const emailParam = params.get("email")
      if (emailParam) {
        setEmail(emailParam)
      }
    }
  }, [])

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

  const [isVerified, setIsVerified] = useState<boolean | null>(null)

  // Redirect if already logged in and 2FA verified
  useEffect(() => {
    async function checkAuthAndRedirect() {
      if (userLoading) return
      if (!user) {
        setIsVerified(false)
        return
      }

      try {
        const { isSession2faVerified } = await import('@/lib/auth/actions')
        const verified = await isSession2faVerified()
        setIsVerified(verified)

        if (verified) {
          const userType = user.user_metadata?.user_type || 'client'
          if (userType === 'agent') {
            router.replace('/agent-dashboard')
          } else if (userType === 'admin' || userType === 'semi-admin') {
            router.replace('/admin-dashboard')
          } else {
            router.replace('/client-dashboard')
          }
        }
      } catch (err) {
        console.error('Error verifying 2FA session on sign-in mount:', err)
        setIsVerified(false)
      }
    }

    checkAuthAndRedirect()
  }, [user, userLoading, router])

  // Show loading while checking auth status
  if (userLoading || (user && isVerified === null)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    )
  }

  // Don't render form if user is logged in AND 2FA verified (will redirect)
  if (user && isVerified === true) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-navy mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  const handleOAuthClick = async (provider: string) => {
    setOauthLoading(true)
    try {
      const result = await signInWithOAuth(provider as 'google' | 'facebook' | 'twitter', 'client')
      if (result?.error) {
        toast.error(result.error)
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
      toast.error('An error occurred during OAuth sign in')
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
        toast.error(result.error)
        setLoading(false)
        return
      }
      
      if (result.requires2fa) {
        window.location.href = '/verify-2fa'
        return
      }

      // Success - force reload for immediate auth state update
      // This is necessary because Supabase auth state needs to propagate
      toast.success('Signed in successfully!')
      if (result.userType === 'agent') {
        window.location.href = '/agent-dashboard'
      } else if (result.userType === 'admin' || result.userType === 'semi-admin') {
        window.location.href = '/admin-dashboard'
      } else {
        window.location.href = '/client-dashboard'
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('An unexpected error occurred during sign in')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Show logo on mobile only since LeftPanel is hidden */}
      <div className="flex lg:hidden justify-center mb-2">
        <Logo showSubtitle={false} className="h-8 w-8" />
      </div>

      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">Welcome back</h1>
        <p className="text-text-secondary text-sm mt-1">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Address</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white cursor-pointer"
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
              className="border border-white/20 data-[state=checked]:bg-gold data-[state=checked]:text-[#0d0d14]"
            />
            <label htmlFor="remember-me" className="text-xs text-text-secondary cursor-pointer">
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className="text-xs text-gold hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          size="lg"
          className="w-full bg-gold text-[#0d0d14] hover:bg-gold/90 font-bold h-11 rounded-xl cursor-pointer" 
          disabled={loading || oauthLoading}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Sign In
        </Button>

        <Separator className="bg-white/10" />
        
        {/* OAuth Options */}
        <OAuthButtonsGroup 
          onOAuthClick={handleOAuthClick}
          disabled={loading || oauthLoading}
          loading={oauthLoading}
          type="signin"
        />
      </form>

      <p className="text-center text-xs text-text-secondary pt-2">
        Don't have an account?{" "}
        <Link href="/sign-up/client" className="text-gold hover:underline font-semibold">
          Sign up as Client
        </Link>
        {" or "}
        <Link href="/sign-up/agent" className="text-gold hover:underline font-semibold">
          Sign up as Agent
        </Link>
      </p>
    </div>
  )
}
