"use client"

import SimpleAgentSignUpForm from "@/components/auth/simple-agent-signup"
import Link from "next/link"

export default function AgentSignUpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Register as an Agent</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Join EstateFlow to connect with clients
        </p>
      </div>
      <SimpleAgentSignUpForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-green-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
