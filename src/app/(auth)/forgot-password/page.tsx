"use client"

import SimpleForgotPasswordForm from "@/components/auth/simple-forgot-password"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Forgot your password?</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Enter your email and we'll send you a reset link.
        </p>
      </div>
      <SimpleForgotPasswordForm />
      <p className="text-center text-sm text-muted-foreground">
        Remember it?{" "}
        <Link href="/sign-in" className="text-blue-600 hover:underline font-medium">
          Back to Sign In
        </Link>
      </p>
    </div>
  )
}
