"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import SimpleClientSignUpForm from "@/components/auth/simple-client-signup"
import Link from "next/link"
import { useUser } from "@/lib/auth/useUser"
import { Loader2 } from "lucide-react"

export default function ClientSignUpPage() {
  const router = useRouter()
  const { user, loading } = useUser()

  // Redirect if already logged in (handling 2FA check first)
  useEffect(() => {
    async function checkAuthAndRedirect() {
      if (loading || !user) return

      try {
        const { isSession2faVerified } = await import('@/lib/auth/actions')
        const isVerified = await isSession2faVerified()

        if (!isVerified) {
          router.replace('/verify-2fa')
          return
        }

        router.replace('/')
      } catch (err) {
        console.error('Error verifying 2FA session on sign-up mount:', err)
      }
    }

    checkAuthAndRedirect()
  }, [user, loading, router])

  // Show loading while checking auth status
  if (loading) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create a Client Account</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Join EstateFlow to find your perfect property
        </p>
      </div>
      <SimpleClientSignUpForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-navy hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
