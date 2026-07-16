"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, ShieldCheck, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { verify2faOtp, resend2faOtp } from "@/lib/auth/actions"
import { toast } from "sonner"

export default function Verify2faPage() {
  const router = useRouter()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [showResend, setShowResend] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(false)
  const [devOtp, setDevOtp] = useState<string | null>(null)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Read the dev_last_otp cookie if present
  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )dev_last_otp=([^;]*)/)
    if (match && match[1]) {
      setDevOtp(match[1])
    }
  }, [])

  // Read the otp_expires_at cookie if present to restore countdown on refresh
  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )otp_expires_at=([^;]*)/)
    if (match && match[1]) {
      try {
        const expiry = new Date(decodeURIComponent(match[1]))
        const diff = Math.floor((expiry.getTime() - Date.now()) / 1000)
        if (diff > 0) {
          setTimeLeft(diff)
        } else {
          setTimeLeft(0)
          setShowResend(true)
        }
      } catch (e) {
        console.error("Failed to parse otp_expires_at cookie:", e)
      }
    }
  }, [])

  // Focus the first input on component mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // 10-minute countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setShowResend(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleChange = (index: number, value: string) => {
    // Only accept numeric inputs
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    setError(null)

    // Shift focus forward if entering a digit
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are filled
    const completedOtp = newOtp.join("")
    if (completedOtp.length === 6 && newOtp.every(val => val !== "")) {
      handleVerification(completedOtp)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Shift focus backward on Backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp]
      newOtp[index - 1] = ""
      setOtp(newOtp)
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim().replace(/[^0-9]/g, "").slice(0, 6)
    
    if (pastedData.length === 0) return

    const newOtp = pastedData.split("")
    const filledOtp = [...newOtp, ...Array(6 - newOtp.length).fill("")]
    setOtp(filledOtp)

    // Set focus to the last filled input
    const nextFocusIndex = Math.min(newOtp.length, 5)
    inputRefs.current[nextFocusIndex]?.focus()

    if (pastedData.length === 6) {
      handleVerification(pastedData)
    }
  }

  const handleVerification = async (code: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await verify2faOtp(code, rememberDevice)
      
      if (result.error) {
        setError(result.error)
        toast.error("Verification failed")
        if (result.showResend) {
          setShowResend(true)
        }
        
        // Reset code inputs on failure
        setOtp(Array(6).fill(""))
        inputRefs.current[0]?.focus()
      } else if (result.success) {
        toast.success("Identity verified successfully!")
        
        // Redirect based on role type
        if (result.userType === "agent") {
          window.location.href = "/agent-dashboard"
        } else {
          window.location.href = "/"
        }
      }
    } catch (err) {
      console.error("Verification exception:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError(null)
    setShowResend(false)
    setOtp(Array(6).fill(""))
    
    try {
      const result = await resend2faOtp()
      if (result.error) {
        setError(result.error)
        setShowResend(true)
        toast.error("Could not resend code")
      } else {
        setTimeLeft(600) // Reset to 10 minutes
        toast.success("A new verification code has been sent to your email!")
        inputRefs.current[0]?.focus()
      }
    } catch (err) {
      console.error("Resend exception:", err)
      setError("Failed to resend code. Please try again.")
      setShowResend(true)
    } finally {
      setResending(false)
    }
  }
  const handleBackToSignIn = async (e: React.MouseEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { signOut } = await import('@/lib/auth/actions')
      await signOut()
      window.location.href = '/sign-in'
    } catch (err) {
      console.error("Back to sign-in signout error:", err)
      window.location.href = '/sign-in'
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center justify-center p-2 bg-navy/10 rounded-full text-navy dark:text-gold mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-navy dark:text-white">Security Verification</h1>
        <p className="text-muted-foreground text-sm">
          Please enter the 6-digit verification code sent to your registered email address.
        </p>
      </div>

      {devOtp && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-100 py-3">
          <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-gold animate-pulse" />
          <AlertDescription className="text-xs font-semibold">
            🔧 Dev Helper: Since email sending is restricted on unverified/free domains, you can use this OTP to test: <span className="font-mono text-sm px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900 rounded border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-50">{devOtp}</span>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
        </Alert>
      )}



      <div className="space-y-5">
        {/* OTP Input Fields Wrapper with Clipboard Paste support */}
        <div 
          className="flex justify-between gap-2 sm:gap-3" 
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={loading}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-slate-300 rounded-lg focus:border-navy focus:ring-2 focus:ring-navy/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-900 text-navy dark:text-white transition-all"
            />
          ))}
        </div>

        {/* Remember device checkbox */}
        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            id="remember-device"
            checked={rememberDevice}
            onCheckedChange={(checked) => setRememberDevice(checked === true)}
            className="border-2 border-slate-300 data-[state=checked]:bg-navy data-[state=checked]:border-navy"
          />
          <label htmlFor="remember-device" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            Trust this device for 30 days
          </label>
        </div>

        {/* Loading / Status State */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 py-1">
            <Loader2 className="w-4 h-4 animate-spin text-navy" />
            <span>Verifying code...</span>
          </div>
        )}

        {/* Resend actions & Timer */}
        <div className="flex flex-col items-center justify-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="text-sm">
            {timeLeft > 0 ? (
              <span className="text-muted-foreground">
                Code expires in: <span className="font-semibold text-navy dark:text-gold">{formatTime(timeLeft)}</span>
              </span>
            ) : (
              <span className="text-red-500 font-medium">Verification code has expired.</span>
            )}
          </div>

          {(showResend || timeLeft <= 0) && (
            <Button
              variant="outline"
              disabled={resending || loading}
              onClick={handleResend}
              className="border-navy text-navy hover:bg-navy hover:text-gold w-full text-xs font-semibold"
            >
              {resending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Sending code...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-2" />
                  Resend verification code
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleBackToSignIn}
          disabled={loading || resending}
          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-navy hover:underline cursor-pointer disabled:opacity-50 mx-auto"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          Back to sign in
        </button>
      </div>
    </div>
  )
}
