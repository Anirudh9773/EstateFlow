'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Building2, 
  Menu, 
  X,
  User,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Logo, LogoIcon } from '@/components/logo'
import { useUser } from '@/lib/auth/useUser'
import { signOut } from '@/lib/auth/actions'
import { getInitials } from '@/lib/utils/getInitials'

const navItems = [
  { name: 'Overview', href: '/agent-dashboard', icon: LayoutDashboard },
  { name: 'Property Listings', href: '/agent-dashboard/listings', icon: Home },
  { name: 'Leads & Inquiries', href: '/agent-dashboard/leads', icon: Users },
  { name: 'Analytics', href: '/agent-dashboard/analytics', icon: TrendingUp },
  { name: 'Settings', href: '/agent-dashboard/settings', icon: Settings },
]

export default function AgentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleToggle = () => setMobileMenuOpen(prev => !prev)
    window.addEventListener('toggle-dashboard-sidebar', handleToggle)
    return () => window.removeEventListener('toggle-dashboard-sidebar', handleToggle)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/agent-login')
  }

  const agentName = user?.user_metadata?.full_name || 'Agent'
  const agentAgency = user?.user_metadata?.agency_name || 'Estate Agent'

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#14141E] border-r border-white/10 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100dvh-4rem)] md:translate-x-0 md:z-30 overflow-y-auto shrink-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          {/* Logo Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-3">
              <LogoIcon className="h-8 w-8 text-gold" />
              <span className="font-bold text-lg tracking-tight text-white font-heading">
                Estate<span className="text-gold">Flow</span>
              </span>
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-text-muted hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/agent-dashboard' && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-[#1E1E2C] text-gold font-semibold shadow-sm border-l-4 border-gold' 
                      : 'text-[#B8B5AE] hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-text-muted'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
