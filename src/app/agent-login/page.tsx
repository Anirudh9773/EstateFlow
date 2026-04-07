'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Building2, Users, Star, ArrowRight, CheckCircle, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function AgentLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Simulate successful login
      console.log('Agent sign in:', { email, password, rememberMe })
      
      // Redirect to agent dashboard
      window.location.href = "/agent-dashboard"
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const agentBenefits = [
    {
      icon: Users,
      title: "Access to Qualified Leads",
      description: "Connect with motivated buyers and sellers in your area"
    },
    {
      icon: Building2,
      title: "Professional Tools",
      description: "Manage listings, track performance, and grow your business"
    },
    {
      icon: Star,
      title: "Build Your Reputation",
      description: "Get verified and showcase your expertise to potential clients"
    }
  ]

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        {/* Left Panel - Agent Benefits */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy)]/90 p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-[var(--color-gold)] rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-[var(--color-gold)] rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-[var(--color-gold)] rounded-full"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-gold)] flex items-center justify-center">
                  <span className="text-[var(--color-navy)] font-bold text-lg">EF</span>
                </div>
                <div>
                  <h1 className="text-white text-2xl font-bold">EstateFlow</h1>
                  <p className="text-[var(--color-gold)]/70 text-sm">Agent Portal</p>
                </div>
              </div>

              <Badge className="bg-[var(--color-gold)] text-[var(--color-navy)] mb-6 w-fit">
                <Shield className="w-3 h-3 mr-2" />
                For Real Estate Professionals
              </Badge>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-white text-4xl font-bold mb-4">
                  Grow your real estate business with EstateFlow
                </h2>
                <p className="text-[var(--color-gold)]/80 text-lg leading-relaxed">
                  Join thousands of successful agents who trust our platform to generate qualified leads, 
                  manage listings, and build their professional reputation.
                </p>
              </div>

              <div className="space-y-6">
                {agentBenefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[var(--color-gold)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-[var(--color-gold)]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-1">{benefit.title}</h3>
                        <p className="text-[var(--color-gold)]/70 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm">Trusted by 1,200+ verified agents</span>
              </div>
              <p className="text-[var(--color-gold)]/50 text-xs">© 2025 EstateFlow Ltd. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="text-center mb-8 lg:hidden">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-gold)] flex items-center justify-center">
                  <span className="text-[var(--color-navy)] font-bold text-lg">EF</span>
                </div>
                <div>
                  <h1 className="text-[var(--color-navy)] text-2xl font-bold">EstateFlow</h1>
                  <p className="text-[var(--color-gold)] text-sm">Agent Portal</p>
                </div>
              </div>
              <Badge className="bg-[var(--color-gold)] text-[var(--color-navy)]">
                <Shield className="w-3 h-3 mr-2" />
                For Real Estate Professionals
              </Badge>
            </div>

            {/* Login Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-navy)] mb-2">Welcome Back</h2>
                <p className="text-[var(--color-text-secondary)]">Sign in to your agent account</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-navy)]">Email Address</label>
                  <Input
                    type="email"
                    placeholder="agent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-[var(--color-ef-border)] focus:border-[var(--color-gold)] focus:ring-[var(--color-gold)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-navy)]">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-[var(--color-ef-border)] focus:border-[var(--color-gold)] focus:ring-[var(--color-gold)] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-navy)]"
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
                      onCheckedChange={setRememberMe}
                      className="border-[var(--color-ef-border)] focus:ring-[var(--color-gold)]"
                    />
                    <label htmlFor="remember-me" className="text-sm text-[var(--color-text-secondary)]">
                      Remember me
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-[var(--color-gold)] hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[var(--color-navy)] hover:bg-[var(--color-navy)]/90 text-[var(--color-gold)] font-medium" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Sign In as Agent
                </Button>

                <Separator />

                <Button type="button" variant="outline" className="w-full gap-2 border-[var(--color-ef-border)]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Don't have an agent account?{' '}
                  <Link href="/join-as-agent" className="text-[var(--color-gold)] hover:underline font-medium">
                    Join EstateFlow
                  </Link>
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-[var(--color-ef-border)]">
                <div className="flex items-center justify-center gap-4 text-xs text-[var(--color-text-muted)]">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Secure Login</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified Agents</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>1,200+ Agents</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Login Link */}
            <div className="mt-6 text-center">
              <p className="text-[var(--color-text-secondary)] text-sm">
                Are you a client?{' '}
                <Link href="/sign-in" className="text-[var(--color-navy)] hover:underline font-medium">
                  Sign in as Client
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
