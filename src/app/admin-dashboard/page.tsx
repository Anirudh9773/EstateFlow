'use client'

import { useState, useEffect, startTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/lib/auth/useUser'
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  Users2,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  Search,
  Building,
  Check,
  AlertTriangle,
  Percent,
  DollarSign,
  Sliders,
  Plus,
  Loader2,
  Phone,
  Mail,
  User,
  Shield,
  HelpCircle,
  Building2,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { createStaffMember } from '@/lib/auth/actions'

// Mock Initial Data
const initialAgents = [
  { id: '1', fullName: 'Sarah Jenkins', email: 'sarah.j@example.com', licenseNumber: 'UK-78291', agencyName: 'Apex Real Estate', yearsExperience: '5+ Years', status: 'pending', phone: '+44 7700 900011' },
  { id: '2', fullName: 'David Miller', email: 'd.miller@example.com', licenseNumber: 'UK-90184', agencyName: 'Miller & Co Agents', yearsExperience: '2 Years', status: 'pending', phone: '+44 7700 900022' },
  { id: '3', fullName: 'Amelie Rostand', email: 'amelie@realty.co.uk', licenseNumber: 'UK-34190', agencyName: 'Prestige Homes', yearsExperience: '10+ Years', status: 'pending', phone: '+44 7700 900033' },
  { id: '4', fullName: 'Marcus Vance', email: 'marcus@vanceproperties.co.uk', licenseNumber: 'UK-81273', agencyName: 'Vance & Partners', yearsExperience: '8 Years', status: 'verified', phone: '+44 7700 900044' }
]

const initialProperties = [
  { id: '1', title: '3 Bed Penthouse in Chelsea', location: 'Chelsea, London (SW3)', price: '£1,250,000', owner: 'John Carter', intent: 'selling', status: 'pending' },
  { id: '2', title: '2 Bed Flat in Manchester', location: 'Deansgate, Manchester (M3)', price: '£2,400 PCM', owner: 'Emma Watson', intent: 'renting', status: 'pending' },
  { id: '3', title: '4 Bed Detached House in Bristol', location: 'Clifton, Bristol (BS8)', price: '£650,000', owner: 'Robert Downey', intent: 'selling', status: 'pending' },
  { id: '4', title: '1 Bed Studio in Birmingham', location: 'City Centre, Birmingham (B1)', price: '£850 PCM', owner: 'Scarlett Johansson', intent: 'renting', status: 'approved' }
]

const initialStaff = [
  { id: '1', fullName: 'Alex Mercer', email: 'alex.mercer@estateflow.com', phone: '+44 7700 900099', role: 'admin', createdAt: '2026-01-15' },
  { id: '2', fullName: 'Jane Moderator', email: 'jane.mod@estateflow.com', phone: '+44 7700 900088', role: 'semi-admin', createdAt: '2026-03-22' }
]

export default function AdminDashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: userLoading } = useUser()
  
  // Tabs state synced with URL search params
  const currentTab = searchParams.get('tab') || 'overview'
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [agents, setAgents] = useState(initialAgents)
  const [properties, setProperties] = useState(initialProperties)
  const [staffList, setStaffList] = useState(initialStaff)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Staff form state
  const [staffForm, setStaffForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'semi-admin' as 'admin' | 'semi-admin'
  })
  const [submittingStaff, setSubmittingStaff] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    commissionRate: '1.5',
    premiumAgentPrice: '49',
    autoApproveThreshold: '80',
    verificationEmailNotifications: true
  })
  const [savingSettings, setSavingSettings] = useState(false)

  const userType = user?.user_metadata?.user_type || 'semi-admin'
  const isSuperAdmin = userType === 'admin'

  const changeTab = (tabName: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tabName)
    router.push(`?${params.toString()}`)
    setMobileMenuOpen(false)
  }

  const handleSignOut = async () => {
    try {
      const { signOut } = await import('@/lib/auth/actions')
      await signOut()
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Agent Actions
  const handleVerifyAgent = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'verified' } : a))
    toast.success('Agent verified successfully')
  }

  const handleRejectAgent = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a))
    toast.error('Agent verification rejected')
  }

  const handleFlagAgent = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'flagged' } : a))
    toast.warning('Agent application flagged for admin review')
  }

  // Property Actions
  const handleApproveProperty = (id: string) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p))
    toast.success('Property listing approved')
  }

  const handleRejectProperty = (id: string) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p))
    toast.error('Property listing rejected')
  }

  const handleFlagProperty = (id: string) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'flagged' } : p))
    toast.warning('Property flagged for edit requirements')
  }

  // Add new staff handler
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!staffForm.fullName || !staffForm.email || !staffForm.password) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmittingStaff(true)
    try {
      const result = await createStaffMember({
        email: staffForm.email,
        password: staffForm.password,
        fullName: staffForm.fullName,
        phone: staffForm.phone || undefined,
        role: staffForm.role
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Successfully created ${staffForm.role} account!`)
        // Update local list
        setStaffList(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            fullName: staffForm.fullName,
            email: staffForm.email,
            phone: staffForm.phone,
            role: staffForm.role,
            createdAt: new Date().toISOString().split('T')[0]
          }
        ])
        // Reset form
        setStaffForm({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          role: 'semi-admin'
        })
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to create staff member.')
    } finally {
      setSubmittingStaff(false)
    }
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setSavingSettings(true)
    setTimeout(() => {
      setSavingSettings(false)
      toast.success('System configurations updated successfully')
    }, 1000)
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F6F2]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-navy mx-auto mb-4" />
          <p className="text-text-secondary font-medium">Loading panel session...</p>
        </div>
      </div>
    )
  }

  const filteredAgents = agents.filter(a => 
    a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.agencyName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-[#F7F6F2] text-navy">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-navy text-white shrink-0 border-r border-navy/20">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-navy font-bold text-lg">
            EF
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wider">ESTATEFLOW</h1>
            <span className="text-[10px] text-gold tracking-widest font-semibold uppercase">Admin Panel</span>
          </div>
        </div>

        {/* Current user badge */}
        <div className="p-4 mx-4 my-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold text-sm font-semibold">
            {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-medium text-sm truncate">{user?.user_metadata?.full_name || 'Staff User'}</h4>
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-gold" />
              <span className="text-xs text-white/60 capitalize font-medium">{userType}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          <button
            onClick={() => changeTab('overview')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'overview' ? 'bg-gold text-navy font-semibold' : 'text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Overview
          </button>
          <button
            onClick={() => changeTab('agents')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'agents' ? 'bg-gold text-navy font-semibold' : 'text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            Agent Verification
            {agents.filter(a => a.status === 'pending').length > 0 && (
              <span className="ml-auto bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {agents.filter(a => a.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => changeTab('properties')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'properties' ? 'bg-gold text-navy font-semibold' : 'text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            Property Moderation
            {properties.filter(p => p.status === 'pending').length > 0 && (
              <span className="ml-auto bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {properties.filter(p => p.status === 'pending').length}
              </span>
            )}
          </button>

          <div className="pt-4 border-t border-white/10 my-4">
            <span className="px-4 text-[10px] font-semibold text-white/40 tracking-wider uppercase">Administrative Controls</span>
          </div>

          <button
            onClick={() => changeTab('staff')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'staff' ? 'bg-gold text-navy font-semibold' : 'text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users2 className="w-4 h-4 shrink-0" />
            Staff Management
            {!isSuperAdmin && <Shield className="w-3.5 h-3.5 ml-auto text-white/40" />}
          </button>
          <button
            onClick={() => changeTab('settings')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'settings' ? 'bg-gold text-navy font-semibold' : 'text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            System Settings
            {!isSuperAdmin && <Shield className="w-3.5 h-3.5 ml-auto text-white/40" />}
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-white/80 hover:bg-white/5 hover:text-white gap-3 rounded-lg"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between bg-navy text-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-navy font-bold">
              EF
            </div>
            <h1 className="font-bold tracking-wider text-sm">ESTATEFLOW</h1>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 rounded-lg hover:bg-white/10 text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
            <aside className="relative flex flex-col w-72 bg-navy text-white h-full max-w-xs animate-in slide-in-from-left duration-300">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-navy font-bold">
                    EF
                  </div>
                  <h1 className="font-bold text-sm tracking-wider">ESTATEFLOW</h1>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 mx-4 my-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold text-sm font-semibold">
                  {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <h4 className="font-medium text-xs truncate max-w-[150px]">{user?.user_metadata?.full_name}</h4>
                  <span className="text-[10px] text-gold capitalize">{userType}</span>
                </div>
              </div>

              <nav className="flex-1 px-4 py-2 space-y-1">
                <button
                  onClick={() => changeTab('overview')}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    currentTab === 'overview' ? 'bg-gold text-navy' : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  Overview
                </button>
                <button
                  onClick={() => changeTab('agents')}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    currentTab === 'agents' ? 'bg-gold text-navy' : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <UserCheck className="w-4 h-4 shrink-0" />
                  Agent Verification
                </button>
                <button
                  onClick={() => changeTab('properties')}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    currentTab === 'properties' ? 'bg-gold text-navy' : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  Property Moderation
                </button>
                <div className="pt-4 border-t border-white/10 my-4">
                  <span className="px-4 text-[9px] font-semibold text-white/40 tracking-wider uppercase">Administration</span>
                </div>
                <button
                  onClick={() => changeTab('staff')}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    currentTab === 'staff' ? 'bg-gold text-navy' : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <Users2 className="w-4 h-4 shrink-0" />
                  Staff Management
                </button>
                <button
                  onClick={() => changeTab('settings')}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    currentTab === 'settings' ? 'bg-gold text-navy' : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  System Settings
                </button>
              </nav>

              <div className="p-4 border-t border-white/10">
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="w-full justify-start text-white/80 hover:bg-white/5 hover:text-white gap-3 rounded-lg"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Sign Out
                </Button>
              </div>
            </aside>
          </div>
        )}

        {/* Dashboard Panels */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header Panel info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-[#E5E3DC] shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-navy tracking-tight capitalize">{currentTab} Panel</h2>
              <p className="text-text-secondary text-sm">
                {currentTab === 'overview' && 'Overview stats, listings growth, and platform health metrics.'}
                {currentTab === 'agents' && 'Review credentials and approve applications for real estate agents.'}
                {currentTab === 'properties' && 'Review and moderate property listings submitted by client owners.'}
                {currentTab === 'staff' && 'Manage staff accounts and permissions.'}
                {currentTab === 'settings' && 'Configure commissions, verification limits, and system parameters.'}
              </p>
            </div>
            
            {(currentTab === 'agents' || currentTab === 'properties') && (
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 border-[#E5E3DC]"
                />
              </div>
            )}
          </div>

          {/* OVERVIEW PANEL */}
          {currentTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-[#E5E3DC] shadow-sm bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Clients</p>
                      <h3 className="text-2xl font-bold text-navy mt-1">1,248</h3>
                      <span className="text-xs text-green-600 font-semibold flex items-center gap-0.5 mt-2">
                        +12% <span className="text-gray-400 font-normal">vs last month</span>
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center text-navy">
                      <User className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-[#E5E3DC] shadow-sm bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Verified Agents</p>
                      <h3 className="text-2xl font-bold text-navy mt-1">162</h3>
                      <span className="text-xs text-green-600 font-semibold flex items-center gap-0.5 mt-2">
                        +4% <span className="text-gray-400 font-normal">vs last month</span>
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                      <UserCheck className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-[#E5E3DC] shadow-sm bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Properties Listed</p>
                      <h3 className="text-2xl font-bold text-navy mt-1">486</h3>
                      <span className="text-xs text-green-600 font-semibold flex items-center gap-0.5 mt-2">
                        +18% <span className="text-gray-400 font-normal">vs last month</span>
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center text-navy">
                      <Building2 className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-[#E5E3DC] shadow-sm bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Pending Tasks</p>
                      <h3 className="text-2xl font-bold text-navy mt-1">
                        {agents.filter(a => a.status === 'pending').length + properties.filter(p => p.status === 'pending').length}
                      </h3>
                      <span className="text-xs text-amber-600 font-semibold flex items-center gap-0.5 mt-2">
                        Immediate Action <span className="text-gray-400 font-normal">required</span>
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                      <Clock className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Graphs & Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Platform Activity Panel */}
                <Card className="border-[#E5E3DC] bg-white lg:col-span-2 shadow-sm">
                  <CardHeader className="border-b border-[#E5E3DC]">
                    <CardTitle className="text-navy font-bold text-lg">Verification Queue Status</CardTitle>
                    <CardDescription>Visual summary of system backlogs.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-text-secondary mb-2">
                        <span>AGENT APPLICATION QUEUE</span>
                        <span>{agents.filter(a => a.status === 'pending').length} PENDING</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gold transition-all duration-500" 
                          style={{ width: `${(agents.filter(a => a.status === 'verified').length / agents.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-text-secondary mb-2">
                        <span>PROPERTY MODERATION QUEUE</span>
                        <span>{properties.filter(p => p.status === 'pending').length} PENDING</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-navy transition-all duration-500" 
                          style={{ width: `${(properties.filter(p => p.status === 'approved').length / properties.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-[#F7F6F2] border border-[#E5E3DC] rounded-xl flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gold shrink-0" />
                      <p className="text-xs text-text-secondary">
                        <strong className="text-navy">Security Rule Notice:</strong> As a {userType === 'admin' ? 'Super Admin' : 'Semi-Admin'}, you have {isSuperAdmin ? 'full administrative privileges' : 'restricted moderator-level privileges'}. Action buttons dynamically adapt to your security clearance.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* System Activity Logs Mockup */}
                <Card className="border-[#E5E3DC] bg-white shadow-sm flex flex-col">
                  <CardHeader className="border-b border-[#E5E3DC]">
                    <CardTitle className="text-navy font-bold text-lg">System Logs</CardTitle>
                    <CardDescription>Latest platform actions.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 flex-1 overflow-y-auto space-y-4">
                    <div className="flex gap-2 text-xs border-b border-[#E5E3DC]/60 pb-2">
                      <span className="text-green-600 font-bold shrink-0">[AUTH]</span>
                      <div>
                        <p className="text-navy font-medium">Session initialized for {user?.email}</p>
                        <span className="text-[10px] text-text-muted">Just now</span>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs border-b border-[#E5E3DC]/60 pb-2">
                      <span className="text-blue-600 font-bold shrink-0">[PROP]</span>
                      <div>
                        <p className="text-navy font-medium">Property "Chelsea Penthouse" submitted for review</p>
                        <span className="text-[10px] text-text-muted">2 hours ago</span>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs border-b border-[#E5E3DC]/60 pb-2">
                      <span className="text-gold font-bold shrink-0">[AGNT]</span>
                      <div>
                        <p className="text-navy font-medium">Agent "Sarah Jenkins" registered verification documents</p>
                        <span className="text-[10px] text-text-muted">5 hours ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* AGENT VERIFICATION PANEL */}
          {currentTab === 'agents' && (
            <div className="bg-white rounded-2xl border border-[#E5E3DC] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#E5E3DC] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-navy">Agent Applications</h3>
                  <p className="text-text-secondary text-xs mt-0.5">Verify real estate agents claiming professional credentials</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F7F6F2] text-text-secondary text-xs uppercase font-semibold border-b border-[#E5E3DC]">
                    <tr>
                      <th className="px-6 py-4">Agent Name</th>
                      <th className="px-6 py-4">Agency</th>
                      <th className="px-6 py-4">License Number</th>
                      <th className="px-6 py-4">Experience</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E3DC]">
                    {filteredAgents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-text-secondary font-medium">
                          No agent applications found matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAgents.map((agent) => (
                        <tr key={agent.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-navy">{agent.fullName}</div>
                            <div className="text-xs text-text-secondary">{agent.email}</div>
                            <div className="text-[10px] text-text-muted mt-0.5">{agent.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-text-secondary font-medium">{agent.agencyName}</td>
                          <td className="px-6 py-4 font-mono text-xs font-semibold text-navy">{agent.licenseNumber}</td>
                          <td className="px-6 py-4 text-text-secondary">{agent.yearsExperience}</td>
                          <td className="px-6 py-4">
                            {agent.status === 'pending' && <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending Review</Badge>}
                            {agent.status === 'verified' && <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>}
                            {agent.status === 'rejected' && <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>}
                            {agent.status === 'flagged' && <Badge className="bg-blue-100 text-blue-800 border-blue-200">Flagged for SuperAdmin</Badge>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              {agent.status === 'pending' && (
                                <>
                                  {isSuperAdmin ? (
                                    <>
                                      <Button 
                                        size="sm" 
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleVerifyAgent(agent.id)}
                                      >
                                        Verify
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="destructive"
                                        onClick={() => handleRejectAgent(agent.id)}
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button 
                                        size="sm" 
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() => handleFlagAgent(agent.id)}
                                      >
                                        Flag for Admin
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => toast.info(`Info requested from ${agent.fullName}`)}
                                      >
                                        Request Info
                                      </Button>
                                    </>
                                  )}
                                </>
                              )}
                              {agent.status !== 'pending' && (
                                <span className="text-xs text-text-muted italic">No actions available</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROPERTY MODERATION PANEL */}
          {currentTab === 'properties' && (
            <div className="bg-white rounded-2xl border border-[#E5E3DC] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#E5E3DC]">
                <h3 className="text-lg font-bold text-navy">Property Submissions</h3>
                <p className="text-text-secondary text-xs mt-0.5">Approve property listings submitted by owners before displaying on public browsing</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F7F6F2] text-text-secondary text-xs uppercase font-semibold border-b border-[#E5E3DC]">
                    <tr>
                      <th className="px-6 py-4">Property Detail</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Valuation</th>
                      <th className="px-6 py-4">Owner</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E3DC]">
                    {filteredProperties.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-text-secondary font-medium">
                          No property listings found matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredProperties.map((prop) => (
                        <tr key={prop.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-navy flex items-center gap-1.5">
                              <Building className="w-4 h-4 text-text-secondary" />
                              {prop.title}
                            </div>
                            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold block mt-0.5">
                              {prop.intent} Listing
                            </span>
                          </td>
                          <td className="px-6 py-4 text-text-secondary font-medium">{prop.location}</td>
                          <td className="px-6 py-4 font-semibold text-navy">{prop.price}</td>
                          <td className="px-6 py-4 text-text-secondary">{prop.owner}</td>
                          <td className="px-6 py-4">
                            {prop.status === 'pending' && <Badge className="bg-amber-100 text-amber-800 border-amber-200">Awaiting Review</Badge>}
                            {prop.status === 'approved' && <Badge className="bg-green-100 text-green-800 border-green-200">Approved & Live</Badge>}
                            {prop.status === 'rejected' && <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>}
                            {prop.status === 'flagged' && <Badge className="bg-blue-100 text-blue-800 border-blue-200">Changes Requested</Badge>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              {prop.status === 'pending' && (
                                <>
                                  {isSuperAdmin ? (
                                    <>
                                      <Button 
                                        size="sm" 
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleApproveProperty(prop.id)}
                                      >
                                        Approve
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="destructive"
                                        onClick={() => handleRejectProperty(prop.id)}
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button 
                                        size="sm" 
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() => handleFlagProperty(prop.id)}
                                      >
                                        Request Changes
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => toast.info(`Flagged for admin`)}
                                      >
                                        Triage Info
                                      </Button>
                                    </>
                                  )}
                                </>
                              )}
                              {prop.status !== 'pending' && (
                                <span className="text-xs text-text-muted italic">No actions available</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STAFF MANAGEMENT PANEL */}
          {currentTab === 'staff' && (
            <div className="space-y-6">
              {!isSuperAdmin ? (
                /* Access Denied Shield Screen for Semi Admin */
                <Card className="border-[#E5E3DC] shadow-sm bg-white overflow-hidden py-12">
                  <CardContent className="flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600 mb-6 animate-pulse">
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-navy tracking-tight">Access Denied</h3>
                    <p className="text-text-secondary text-sm mt-3">
                      This screen requires **Super Admin** level authorization credentials. Your profile is flagged as a **Semi-Admin (Moderator)**. You can triage listings and agents but cannot create staff members or change permissions.
                    </p>
                    <GoldDivider className="mx-auto my-6" />
                    <Button 
                      onClick={() => changeTab('overview')} 
                      className="bg-navy text-gold hover:bg-navy/90"
                    >
                      Return to Overview
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                /* Full Admin view */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Create staff form */}
                  <Card className="border-[#E5E3DC] bg-white shadow-sm lg:col-span-1">
                    <CardHeader className="border-b border-[#E5E3DC]">
                      <CardTitle className="text-navy font-bold text-lg">Add New Staff</CardTitle>
                      <CardDescription>Provision administrative or moderator profiles.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleAddStaff} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-secondary uppercase">Full Name</label>
                          <div className="relative">
                            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                              type="text"
                              required
                              placeholder="Alex Mercer"
                              value={staffForm.fullName}
                              onChange={(e) => setStaffForm(prev => ({ ...prev, fullName: e.target.value }))}
                              className="pl-9 border-[#E5E3DC] focus:border-navy focus:ring-2 focus:ring-navy/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-secondary uppercase">Email Address</label>
                          <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                              type="email"
                              required
                              placeholder="alex@estateflow.com"
                              value={staffForm.email}
                              onChange={(e) => setStaffForm(prev => ({ ...prev, email: e.target.value }))}
                              className="pl-9 border-[#E5E3DC] focus:border-navy focus:ring-2 focus:ring-navy/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-secondary uppercase">Phone Number (Optional)</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                              type="text"
                              placeholder="+44 7700 900099"
                              value={staffForm.phone}
                              onChange={(e) => setStaffForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="pl-9 border-[#E5E3DC] focus:border-navy focus:ring-2 focus:ring-navy/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-secondary uppercase">Temp Password</label>
                          <Input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={staffForm.password}
                            onChange={(e) => setStaffForm(prev => ({ ...prev, password: e.target.value }))}
                            className="border-[#E5E3DC] focus:border-navy focus:ring-2 focus:ring-navy/20"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-secondary uppercase">Security Role</label>
                          <Select 
                            value={staffForm.role} 
                            onValueChange={(val) => { if (val) setStaffForm(prev => ({ ...prev, role: val as 'admin' | 'semi-admin' })) }}
                          >
                            <SelectTrigger className="border-[#E5E3DC]">
                              <SelectValue placeholder="Select security role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="semi-admin">Semi-Admin (Moderator)</SelectItem>
                              <SelectItem value="admin">Super Admin (All-Access)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button 
                          type="submit" 
                          disabled={submittingStaff}
                          className="w-full bg-navy text-gold hover:bg-navy/90"
                        >
                          {submittingStaff && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Create Account
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Staff listing */}
                  <Card className="border-[#E5E3DC] bg-white shadow-sm lg:col-span-2">
                    <CardHeader className="border-b border-[#E5E3DC]">
                      <CardTitle className="text-navy font-bold text-lg">Active Staff Members</CardTitle>
                      <CardDescription>Current registered platform administrators.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-[#F7F6F2] text-text-secondary text-xs uppercase font-semibold border-b border-[#E5E3DC]">
                            <tr>
                              <th className="px-6 py-4">Name</th>
                              <th className="px-6 py-4">Email / Phone</th>
                              <th className="px-6 py-4">Role</th>
                              <th className="px-6 py-4">Created At</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E5E3DC]">
                            {staffList.map((staff) => (
                              <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-navy">{staff.fullName}</td>
                                <td className="px-6 py-4">
                                  <div className="text-text-secondary">{staff.email}</div>
                                  <div className="text-xs text-text-muted">{staff.phone || 'No phone number'}</div>
                                </td>
                                <td className="px-6 py-4">
                                  {staff.role === 'admin' ? (
                                    <Badge className="bg-red-50 text-red-700 border-red-150 font-bold uppercase tracking-wider text-[10px]">
                                      Super Admin
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-blue-50 text-blue-700 border-blue-150 font-bold uppercase tracking-wider text-[10px]">
                                      Semi-Admin
                                    </Badge>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-text-muted">{staff.createdAt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* SYSTEM SETTINGS PANEL */}
          {currentTab === 'settings' && (
            <div>
              {!isSuperAdmin ? (
                /* Access Denied Shield Screen for Semi Admin */
                <Card className="border-[#E5E3DC] shadow-sm bg-white overflow-hidden py-12">
                  <CardContent className="flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600 mb-6 animate-pulse">
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-navy tracking-tight">Access Denied</h3>
                    <p className="text-text-secondary text-sm mt-3">
                      This screen requires **Super Admin** level authorization credentials. Your profile is flagged as a **Semi-Admin (Moderator)**. You can triage listings and agents but cannot edit platform settings.
                    </p>
                    <GoldDivider className="mx-auto my-6" />
                    <Button 
                      onClick={() => changeTab('overview')} 
                      className="bg-navy text-gold hover:bg-navy/90"
                    >
                      Return to Overview
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                /* Settings view */
                <Card className="border-[#E5E3DC] bg-white shadow-sm max-w-2xl">
                  <CardHeader className="border-b border-[#E5E3DC]">
                    <CardTitle className="text-navy font-bold text-lg">Platform Settings</CardTitle>
                    <CardDescription>Adjust variables governing fees, automated audits, and emails.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-secondary uppercase">Platform Commission Fee (%)</label>
                          <div className="relative">
                            <Percent className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                              type="number"
                              step="0.1"
                              value={settings.commissionRate}
                              onChange={(e) => setSettings(prev => ({ ...prev, commissionRate: e.target.value }))}
                              className="pl-9 border-[#E5E3DC] focus:border-navy focus:ring-2 focus:ring-navy/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-secondary uppercase">Premium Agent Price (£/mo)</label>
                          <div className="relative">
                            <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                              type="number"
                              value={settings.premiumAgentPrice}
                              onChange={(e) => setSettings(prev => ({ ...prev, premiumAgentPrice: e.target.value }))}
                              className="pl-9 border-[#E5E3DC] focus:border-navy focus:ring-2 focus:ring-navy/20"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase">Auto-Approve Threshold Score</label>
                        <div className="relative">
                          <Sliders className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={settings.autoApproveThreshold}
                            onChange={(e) => setSettings(prev => ({ ...prev, autoApproveThreshold: e.target.value }))}
                            className="pl-9 border-[#E5E3DC] focus:border-navy focus:ring-2 focus:ring-navy/20"
                          />
                        </div>
                        <p className="text-[10px] text-text-muted mt-1">Applications scoring above this margin bypass initial queues.</p>
                      </div>

                      <div className="pt-4 border-t border-[#E5E3DC] flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-sm text-navy">Email Notifications</h4>
                          <p className="text-xs text-text-secondary">Send email dispatch when new agent applications are queued</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.verificationEmailNotifications}
                          onChange={(e) => setSettings(prev => ({ ...prev, verificationEmailNotifications: e.target.checked }))}
                          className="w-4 h-4 rounded text-navy border-slate-300 focus:ring-navy accent-navy cursor-pointer"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={savingSettings}
                        className="bg-navy text-gold hover:bg-navy/90"
                      >
                        {savingSettings && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Configurations
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function GoldDivider({ className }: { className?: string }) {
  return (
    <div className={`h-[1px] w-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent ${className}`} />
  )
}
