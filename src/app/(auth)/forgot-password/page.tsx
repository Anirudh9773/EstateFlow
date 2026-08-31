"use client"

import SimpleForgotPasswordForm from "@/components/auth/simple-forgot-password"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">Forgot your password?</h1>
        <p className="text-text-secondary text-sm mt-1">
          Enter your email and we'll send you a reset link.
        </p>
      </div>
      <SimpleForgotPasswordForm />
      <p className="text-center text-xs text-text-secondary pt-1">
        Remember it?{" "}
        <Link href="/sign-in" className="text-gold hover:underline font-semibold">
          Back to Sign In
        </Link>
      </p>
    </div>
  )
}
