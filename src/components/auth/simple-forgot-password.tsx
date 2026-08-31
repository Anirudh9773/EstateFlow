"use client"

import { useState } from "react"
import { Loader2, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function SimpleForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      alert("Please enter your email")
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const { resetPasswordForEmail } = await import("@/lib/auth/actions")
      const result = await resetPasswordForEmail(email)
      
      if (result?.error) {
        setError(result.error)
      } else {
        setIsSuccess(true)
      }
    } catch (err) {
      console.error("Forgot password error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Alert className="border-emerald-500/40 bg-emerald-950/40 text-emerald-200">
        <CheckCircle className="h-4 w-4 text-emerald-400" />
        <AlertDescription className="text-xs text-emerald-200">
          Check your inbox for the reset link. If you don't see it within a few minutes, check your spam folder.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="bg-red-950/50 border-red-500/50 text-red-200">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Address</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gold text-[#0d0d14] hover:bg-gold/90 font-bold h-11 rounded-xl cursor-pointer" 
          disabled={loading}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </div>
  )
}
