import type { Metadata } from "next"
import { Outfit, Inter } from "next/font/google"
import AuthLeftPanel from "@/components/auth/auth-left-panel"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-white dark:bg-slate-950 min-h-screen relative">
        {/* Back to Home Link */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-10">
          <Link 
            href="/" 
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-navy dark:hover:text-gold transition-colors gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  )
}
