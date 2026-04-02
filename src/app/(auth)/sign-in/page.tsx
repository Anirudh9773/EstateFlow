"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SimpleClientSignInForm from "@/components/auth/simple-client-signin"
import SimpleAgentSignInForm from "@/components/auth/simple-agent-signin"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
      </div>
      <Tabs defaultValue="client" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="client">I'm a Client</TabsTrigger>
          <TabsTrigger value="agent">I'm an Agent</TabsTrigger>
        </TabsList>
        <TabsContent value="client" className="mt-4">
          <SimpleClientSignInForm />
        </TabsContent>
        <TabsContent value="agent" className="mt-4">
          <SimpleAgentSignInForm />
        </TabsContent>
      </Tabs>
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/sign-up/client" className="text-blue-600 hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}
