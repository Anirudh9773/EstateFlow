"use client"

import SimpleAgentSignUpForm from "@/components/auth/simple-agent-signup"
import Link from "next/link"

export default function AgentSignUpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">Register as an Agent</h1>
        <p className="text-text-secondary text-sm mt-1">
          Join EstateFlow to connect with clients
        </p>
      </div>
      <SimpleAgentSignUpForm />
      <p className="text-center text-xs text-text-secondary pt-1">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-gold hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  )
}
