"use client"

import SimpleClientSignUpForm from "@/components/auth/simple-client-signup"
import Link from "next/link"

export default function ClientSignUpPage() {
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
        <Link href="/sign-in" className="text-blue-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
