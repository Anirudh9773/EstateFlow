"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateUserPassword } from "@/lib/auth/actions"
import Link from "next/link"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validatePassword = (pass: string) => {
    // Requires 8+ chars, at least one uppercase, one lowercase, one number, and one special character
    const minLength = pass.length >= 8
    const hasUpper = /[A-Z]/.test(pass)
    const hasLower = /[a-z]/.test(pass)
    const hasDigit = /\d/.test(pass)
    const hasSpecial = /[^A-Za-z0-9]/.test(pass)
    return minLength && hasUpper && hasLower && hasDigit && hasSpecial
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and contain uppercase, lowercase, a number, and a special character.")
      setLoading(false)
      return
    }

    try {
      const result = await updateUserPassword(password)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        toast.success("Password reset successfully!")
        // Sign out the recovery session to force a clean re-login
        try {
          const { signOut } = await import('@/lib/auth/actions')
          await signOut()
        } catch (signOutErr) {
          console.error("Error signing out after password reset:", signOutErr)
        }
        setTimeout(() => {
          window.location.href = "/sign-in"
        }, 3000)
      }
    } catch (err) {
      console.error("Password reset error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-950/40 rounded-full text-emerald-400 mb-2">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Password Updated!</h1>
        <p className="text-text-secondary text-sm">
          Your password has been successfully updated. You are being redirected to the sign-in page...
        </p>
        <Link
          href="/sign-in"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none w-full bg-gold text-[#0d0d14] hover:bg-gold/90 h-11 gap-1.5 px-2.5 font-bold rounded-xl"
        >
          Sign In Now
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center justify-center p-2 bg-gold/10 rounded-full text-gold mb-2">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Reset Your Password</h1>
        <p className="text-text-secondary text-sm">
          Please enter your new security password below.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-500/40 bg-red-950/40 text-red-200">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-xs font-medium text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">New Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold pr-10"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-text-muted">
            Must be 8+ characters with uppercase, lowercase, number, and special character
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Confirm New Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-10 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold pr-10"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gold text-[#0d0d14] hover:bg-gold/90 font-bold h-11 rounded-xl cursor-pointer" 
          disabled={loading}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Update Password
        </Button>
      </form>
    </div>
  )
}
