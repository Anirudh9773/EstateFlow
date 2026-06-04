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
        setTimeout(() => {
          router.replace("/sign-in")
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
        <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full text-green-600 mb-2">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-navy">Password Updated!</h1>
        <p className="text-muted-foreground text-sm">
          Your password has been successfully updated. You are being redirected to the sign-in page...
        </p>
        <Link
          href="/sign-in"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none w-full bg-navy text-gold hover:bg-navy/90 h-8 gap-1.5 px-2.5"
        >
          Sign In Now
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center justify-center p-2 bg-navy/10 rounded-full text-navy mb-2">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-navy">Reset Your Password</h1>
        <p className="text-muted-foreground text-sm">
          Please enter your new security password below.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">New Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 pr-10"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Must be 8+ characters with uppercase, lowercase, number, and special character
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm New Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 pr-10"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-navy text-gold hover:bg-navy/90 font-medium" 
          disabled={loading}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Update Password
        </Button>
      </form>
    </div>
  )
}
