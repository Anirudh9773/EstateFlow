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
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Check your inbox for the reset link. If you don't see it within a few minutes, check your spam folder.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-navy/10 rounded-full mb-4">
          <Mail className="h-8 w-8 text-navy" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-navy mb-2">Forgot your password?</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-navy">Email Address</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-navy text-gold hover:bg-navy/90 font-medium" 
          disabled={loading}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </div>
  )
}
