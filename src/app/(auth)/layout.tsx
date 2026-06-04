import type { Metadata } from "next"
import { Outfit, Inter } from "next/font/google"
import AuthLeftPanel from "@/components/auth/auth-left-panel"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Auth | EstateFlow",
  description: "Sign in or create your EstateFlow account",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${outfit.variable} ${inter.variable} min-h-screen flex flex-col lg:flex-row`}>
      {/* Left Panel - Hidden on mobile, 50% width on desktop */}
      <AuthLeftPanel />
      
      {/* Right Panel - Form Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-white dark:bg-slate-950 min-h-screen">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  )
}
