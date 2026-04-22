"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import OAuthButtonsGroup from "./OAuthButtonsGroup"

export default function SimpleAgentSignInForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    console.log('Agent sign in:', { email, password, rememberMe })
    setLoading(false)
    router.push("/agent/dashboard")
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

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
              id="remember-me-agent"
              checked={rememberMe}
              onCheckedChange={setRememberMe}
            />
            <label htmlFor="remember-me-agent" className="text-sm">
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Sign in as Agent
        </Button>

        <Separator />
        
        {/* OAuth Options */}
        <OAuthButtonsGroup 
          onOAuthClick={(provider) => console.log(`Agent sign in with ${provider}`)}
          disabled={loading}
          type="signin"
        />
      </form>
    </div>
  )
}
