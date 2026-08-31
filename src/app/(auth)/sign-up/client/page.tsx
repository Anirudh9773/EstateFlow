"use client"

import SimpleClientSignUpForm from "@/components/auth/simple-client-signup"
import Link from "next/link"

export default function ClientSignUpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">Create a Client Account</h1>
        <p className="text-text-secondary text-sm mt-1">
          Join EstateFlow to find your perfect property
        </p>
      </div>
      <SimpleClientSignUpForm />
      <p className="text-center text-xs text-text-secondary pt-1">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-gold hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  )
}
