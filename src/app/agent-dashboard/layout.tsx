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
import { Logo } from '@/components/logo'
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

  const handleSignOut = async () => {
    await signOut()
    router.push('/agent-login')
  }

  const agentName = user?.user_metadata?.full_name || 'Agent'
  const agentAgency = user?.user_metadata?.agency_name || 'Estate Agent'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Nav Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Logo showSubtitle={false} className="h-7 w-7" />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
          </Button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          {/* Logo Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-3">
              <Logo showSubtitle={false} className="h-8 w-8 text-gold" />
              <span className="font-bold text-lg tracking-tight text-white font-heading">
                Estate<span className="text-gold">Flow</span>
              </span>
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Add Listing CTA */}
          <Link href="/submit-property" className="block mb-6">
            <Button className="w-full bg-gold text-navy hover:bg-gold/90 font-semibold shadow-sm flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add Listing
            </Button>
          </Link>

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
                      ? 'bg-navy text-gold font-semibold shadow-sm border-l-4 border-gold' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <Avatar className="w-9 h-9 border border-slate-700">
              <AvatarFallback className="bg-navy text-gold text-xs font-semibold">
                {getInitials(agentName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{agentName}</p>
              <p className="text-[11px] text-slate-400 truncate">{agentAgency}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full text-slate-400 hover:text-red-400 hover:bg-slate-800/50 justify-start gap-2 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
