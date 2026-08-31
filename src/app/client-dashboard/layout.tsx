'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Building2, 
  Settings, 
  LogOut, 
  Plus, 
  Menu, 
  X,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Logo, LogoIcon } from '@/components/logo'
import { useUser } from '@/lib/auth/useUser'
import { signOut } from '@/lib/auth/actions'
import { getInitials } from '@/lib/utils/getInitials'

const navItems = [
  { name: 'Overview', href: '/client-dashboard', icon: LayoutDashboard },
  { name: 'My Properties', href: '/client-dashboard/properties', icon: Building2 },
  { name: 'Account Settings', href: '/client-dashboard/settings', icon: Settings },
]

export default function ClientDashboardLayout({
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
    router.push('/sign-in')
  }

  const clientName = user?.user_metadata?.full_name || 'Client'

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

          {/* Quick Submit Property CTA */}
          <Link href="/submit-property" className="block mb-6">
            <Button className="w-full bg-gold text-[#0d0d14] hover:bg-gold/90 font-bold shadow-sm flex items-center justify-center gap-2 rounded-xl cursor-pointer">
              <Plus className="w-4 h-4" />
              Submit Property
            </Button>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/client-dashboard' && pathname.startsWith(item.href))
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
