'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, User, Building2, LogOut, LayoutDashboard } from 'lucide-react';
import { useUser } from '@/lib/auth/useUser';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { HIDDEN_LAYOUT_ROUTES } from '@/lib/constants';
import { toast } from 'sonner';

export default function Header() {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith('/agent-dashboard') || pathname.startsWith('/client-dashboard') || pathname.startsWith('/admin-dashboard');
  const isHomePage = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showTrustBar, setShowTrustBar] = useState(true);
  const { user, loading } = useUser();
  const [is2faVerified, setIs2faVerified] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function check2fa() {
      if (loading) return;
      if (!user) {
        setIs2faVerified(true);
        return;
      }
      try {
        const { isSession2faVerified } = await import('@/lib/auth/actions');
        // Race against a 5s timeout so the header never stays in loading state
        const verified = await Promise.race([
          isSession2faVerified(),
          new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 5000)),
        ]);
        if (!cancelled) setIs2faVerified(verified);
      } catch (e) {
        console.error('Error checking 2FA in Header:', e);
        if (!cancelled) setIs2faVerified(true);
      }
    }
    check2fa();
    return () => { cancelled = true; };
  }, [user, loading]);

  // Lock body scroll when mobile menu is open to prevent background scrolling
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const platformDropdownRef = useRef<HTMLDivElement>(null);
  const agentsDropdownRef = useRef<HTMLDivElement>(null);
  const signUpDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuDropdownRef = useRef<HTMLDivElement>(null);

  // Memoize user display name to avoid recalculation
  const userDisplayName = useMemo(() => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  }, [user]);

  // Memoize user type to avoid recalculation
  const userType = useMemo(() => {
    return user?.user_metadata?.user_type || 'client';
  }, [user]);

  // Memoize user initial
  const userInitial = useMemo(() => {
    return userDisplayName.charAt(0).toUpperCase();
  }, [userDisplayName]);

  // 2FA state variables
  const showUserMenu = !!user && is2faVerified === true;
  const showLoading = loading || (!!user && is2faVerified === null);

  const platformLinks = useMemo(() => {
    if (userType === 'agent') {
      return [
        { label: 'Agent Dashboard', href: '/agent-dashboard' },
        { label: 'Property Listings', href: '/agent-dashboard/listings' },
        { label: 'Leads & Inquiries', href: '/agent-dashboard/leads' },
        { label: 'Agent Pricing', href: '/agent-pricing' },
        { label: 'How It Works', href: '/#how-it-works' },
      ];
    }
    return [
      { label: 'Find an Agent', href: '/find-an-agent' },
      { label: 'Submit a Property', href: '/submit-property' },
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'Pricing', href: '/pricing' },
    ];
  }, [userType]);

  const agentLinks = useMemo(() => {
    if (!user) {
      return [
        { label: 'Agent Pricing', href: '/agent-pricing' },
        { label: 'Join as an Agent', href: '/sign-up/agent' },
      ];
    }
    if (userType === 'agent') {
      return [
        { label: 'Agent Pricing', href: '/agent-pricing' },
        { label: 'Agent Dashboard', href: '/agent-dashboard' },
      ];
    }
    return [];
  }, [user, userType]);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        platformDropdownRef.current &&
        !platformDropdownRef.current.contains(event.target as Node)
      ) {
        if (openDropdown === 'platform') setOpenDropdown(null);
      }
      if (
        agentsDropdownRef.current &&
        !agentsDropdownRef.current.contains(event.target as Node)
      ) {
        if (openDropdown === 'agents') setOpenDropdown(null);
      }
      if (
        signUpDropdownRef.current &&
        !signUpDropdownRef.current.contains(event.target as Node)
      ) {
        if (openDropdown === 'signup') setOpenDropdown(null);
      }
      if (
        userMenuDropdownRef.current &&
        !userMenuDropdownRef.current.contains(event.target as Node)
      ) {
        if (openDropdown === 'usermenu') setOpenDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const toggleDropdown = useCallback((dropdown: string) => {
    setOpenDropdown(prev => prev === dropdown ? null : dropdown);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      const { signOut } = await import('@/lib/auth/actions');
      await signOut();
      toast.success('Signed out successfully');
      // Use hard reload for sign out to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('An error occurred during sign out');
    }
  }, []);

  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  if (HIDDEN_LAYOUT_ROUTES.some(route => pathname.startsWith(route))) {
    return null;
  }

  // Header transparent on homepage when not scrolled
  const isTransparent = isHomePage && !isScrolled && !isMobileMenuOpen;

  return (
    <>
      {/* Trust Bar */}
      {showTrustBar && !HIDDEN_LAYOUT_ROUTES.some(route => pathname.startsWith(route)) && (
        <div className="bg-[#1A1A24] text-[#B8B5AE] text-xs sm:text-sm py-2 border-b border-gold/10">
          <div className="container mx-auto px-4 flex items-center justify-center relative">
            <span className="flex items-center gap-2 text-center">
              <span className="text-gold">✓</span>
              Trusted by 1,200+ verified agents across the UK
            </span>
            <button
              onClick={() => setShowTrustBar(false)}
              className="absolute right-4 text-text-muted hover:text-[#F5F3EE] transition-colors text-lg leading-none cursor-pointer"
              aria-label="Dismiss announcement"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isTransparent
            ? 'bg-transparent'
            : 'bg-[#0d0d14]/95 backdrop-blur-md border-b border-gold/10 shadow-lg shadow-black/20'
        }`}
      >
        <nav className="container mx-auto px-4" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0 select-none">
              <Logo showSubtitle={true} className="h-7 w-7 transition-transform group-hover:scale-105" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Platform Dropdown */}
              <div className="relative" ref={platformDropdownRef}>
                <button
                  onClick={() => toggleDropdown('platform')}
                  className="flex items-center gap-1 text-[#B8B5AE] hover:text-gold font-medium transition-colors cursor-pointer text-sm tracking-wide"
                  aria-expanded={openDropdown === 'platform'}
                  aria-haspopup="true"
                >
                  Platform
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openDropdown === 'platform' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openDropdown === 'platform' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-[#1A1A24] rounded-lg shadow-xl border border-gold/15 py-2 animate-fadeIn">
                    {platformLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-[#B8B5AE] hover:bg-gold/10 hover:text-gold transition-colors text-sm"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* For Agents Dropdown */}
              {(!user || userType === 'agent') && (
                <div className="relative" ref={agentsDropdownRef}>
                  <button
                    onClick={() => toggleDropdown('agents')}
                    className="flex items-center gap-1 text-[#B8B5AE] hover:text-gold font-medium transition-colors cursor-pointer text-sm tracking-wide"
                    aria-expanded={openDropdown === 'agents'}
                    aria-haspopup="true"
                  >
                    For Agents
                  </button>
                  {openDropdown === 'agents' && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-[#1A1A24] rounded-lg shadow-xl border border-gold/15 py-2 animate-fadeIn">
                      {agentLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2 text-[#B8B5AE] hover:bg-gold/10 hover:text-gold transition-colors text-sm"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Company Links */}
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#B8B5AE] hover:text-gold font-medium transition-colors text-sm tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Primary CTA */}
              {(!user || userType === 'client') && (
                <Button
                  nativeButton={false}
                  render={<Link href="/submit-property" />}
                  className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold text-sm"
                >
                  <span className="hidden sm:inline">Submit a Property</span>
                  <span className="sm:hidden">Submit</span>
                </Button>
              )}

              {showLoading ? (
                // Loading state
                <div className="w-24 h-10 bg-[#1E1E28] animate-pulse rounded-lg"></div>
              ) : showUserMenu ? (
                // Logged in - Show user menu
                <div className="relative" ref={userMenuDropdownRef}>
                  <button
                    onClick={() => toggleDropdown('usermenu')}
                    className="flex items-center gap-2 px-4 py-2 border border-gold/30 text-[#F5F3EE] rounded-lg font-medium hover:bg-gold/10 transition-colors text-sm cursor-pointer"
                    aria-expanded={openDropdown === 'usermenu'}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold text-[#0d0d14] flex items-center justify-center text-xs font-semibold">
                      {userInitial}
                    </div>
                    <span className="max-w-[100px] truncate">{userDisplayName}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openDropdown === 'usermenu' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openDropdown === 'usermenu' && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-[#1A1A24] rounded-lg shadow-xl border border-gold/15 py-2 animate-fadeIn z-50">
                      <div className="px-4 py-3 border-b border-gold/10">
                        <p className="text-sm font-medium text-[#F5F3EE]">{userDisplayName}</p>
                        <p className="text-xs text-text-muted">{user.email}</p>
                        <p className="text-xs text-text-muted mt-1 capitalize">
                          {userType} Account
                        </p>
                      </div>
                      {userType === 'agent' && (
                        <Link
                          href="/agent-dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-[#B8B5AE] hover:bg-gold/10 hover:text-gold transition-colors"
                          onClick={() => {
                            setOpenDropdown(null);
                            if (pathname === '/agent-dashboard') {
                              window.location.href = '/agent-dashboard';
                            }
                          }}
                        >
                          <Building2 className="w-5 h-5 text-gold" />
                          <span className="text-sm">Dashboard</span>
                        </Link>
                      )}
                      {userType === 'client' && (
                        <Link
                          href="/client-dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-[#B8B5AE] hover:bg-gold/10 hover:text-gold transition-colors"
                          onClick={() => {
                            setOpenDropdown(null);
                            if (pathname === '/client-dashboard') {
                              window.location.href = '/client-dashboard';
                            }
                          }}
                        >
                          <Building2 className="w-5 h-5 text-gold" />
                          <span className="text-sm">Dashboard</span>
                        </Link>
                      )}
                      {(userType === 'admin' || userType === 'semi-admin') && (
                        <Link
                          href="/admin-dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-[#B8B5AE] hover:bg-gold/10 hover:text-gold transition-colors"
                          onClick={() => {
                            setOpenDropdown(null);
                            if (pathname === '/admin-dashboard') {
                              window.location.href = '/admin-dashboard';
                            }
                          }}
                        >
                          <Building2 className="w-5 h-5 text-gold" />
                          <span className="text-sm">Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 text-[#B8B5AE] hover:bg-red-500/10 hover:text-red-400 transition-colors w-full text-left cursor-pointer"
                      >
                        <LogOut className="w-5 h-5 text-red-400" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Not logged in - Show sign in/up buttons
                <>
                  {/* Sign In Button */}
                  <Button
                    nativeButton={false}
                    variant="outline"
                    render={<Link href="/sign-in" />}
                    className="border border-gold/30 text-gold hover:bg-gold/10 hover:text-gold"
                  >
                    Sign In
                  </Button>

                  {/* Sign Up Dropdown */}
                  <div className="relative" ref={signUpDropdownRef}>
                    <Button
                      onClick={() => toggleDropdown('signup')}
                      className="bg-gold text-[#0d0d14] hover:bg-gold/90 gap-2 cursor-pointer font-semibold"
                      aria-expanded={openDropdown === 'signup'}
                      aria-haspopup="true"
                    >
                      Sign Up
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === 'signup' ? 'rotate-180' : ''
                        }`}
                      />
                    </Button>
                    {openDropdown === 'signup' && (
                      <div className="absolute top-full right-0 mt-2 w-64 bg-[#1A1A24] rounded-lg shadow-xl border border-gold/15 py-2 animate-fadeIn z-50">
                        <Link
                          href="/sign-up/client"
                          className="flex items-center gap-3 px-4 py-3 text-[#B8B5AE] hover:bg-gold/10 hover:text-gold transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold/10 border border-gold/20">
                            <User className="w-5 h-5 text-gold" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-[#F5F3EE]">As Client</div>
                            <div className="text-xs text-text-muted">Find your perfect agent</div>
                          </div>
                        </Link>
                        <Link
                          href="/sign-up/agent"
                          className="flex items-center gap-3 px-4 py-3 text-[#B8B5AE] hover:bg-gold/10 hover:text-gold transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold/10 border border-gold/20">
                            <Building2 className="w-5 h-5 text-gold" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-[#F5F3EE]">As Agent</div>
                            <div className="text-xs text-text-muted">Grow your pipeline</div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Controls Container */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Dashboard Sidebar Drawer Trigger Button */}
              {(isDashboardRoute || showUserMenu) && (
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('toggle-dashboard-sidebar'))
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 text-gold border border-gold/30 rounded-lg text-xs font-semibold hover:bg-gold/20 transition-all shadow-sm cursor-pointer"
                  aria-label="Toggle dashboard menu"
                >
                  <LayoutDashboard className="w-4 h-4 text-gold" />
                  <span>Dashboard</span>
                </button>
              )}

              {/* Main Navigation 3-Lines Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#B8B5AE] hover:text-gold transition-colors cursor-pointer"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)] bg-[#0d0d14] border-t border-gold/10 overflow-y-auto overscroll-y-contain py-6 pb-16 px-4 shadow-xl z-50 animate-fadeIn">
              {/* Platform Section */}
              <div className="mb-4">
                <h3 className="px-4 py-2 text-xs font-semibold text-gold/60 uppercase tracking-wider">
                  Platform
                </h3>
                {platformLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-[#B8B5AE] hover:bg-gold/10 hover:text-gold transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* For Agents Section */}
              {(!user || userType === 'agent') && (
                <div className="mb-4">
                  <h3 className="px-4 py-2 text-xs font-semibold text-gold/60 uppercase tracking-wider">
                    For Agents
                  </h3>
                  {agentLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-[#B8B5AE] hover:bg-gold/10 hover:text-gold transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* Company Section */}
              <div className="mb-4">
                <h3 className="px-4 py-2 text-xs font-semibold text-gold/60 uppercase tracking-wider">
                  Company
                </h3>
                {companyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-[#B8B5AE] hover:bg-gold/10 hover:text-gold transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gold/10 pt-4 px-4">
                {/* Primary CTA */}
                {(!user || userType === 'client') && (
                  <Button
                    nativeButton={false}
                    size="lg"
                    render={
                      <Link
                        href="/submit-property"
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                    }
                    className="w-full bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold mb-4 justify-center"
                  >
                    Submit a Property
                  </Button>
                )}

                {showLoading ? (
                  // Loading state
                  <div className="space-y-3">
                    <div className="h-20 bg-[#1E1E28] animate-pulse rounded-lg"></div>
                    <div className="h-20 bg-[#1E1E28] animate-pulse rounded-lg"></div>
                  </div>
                ) : showUserMenu ? (
                  // Logged in - Show user info and sign out
                  <div>
                    <div className="mb-4 p-4 bg-[#1A1A24] rounded-lg border border-gold/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gold text-[#0d0d14] flex items-center justify-center text-lg font-semibold">
                          {userInitial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#F5F3EE] truncate">{userDisplayName}</p>
                          <p className="text-xs text-text-muted truncate">{user.email}</p>
                          <p className="text-xs text-text-muted capitalize">
                            {userType} Account
                          </p>
                        </div>
                      </div>
                      {userType === 'agent' && (
                        <Link
                          href="/agent-dashboard"
                          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gold text-[#0d0d14] rounded-lg hover:bg-gold/90 transition-colors mb-2 font-semibold"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                      )}
                      {userType === 'client' && (
                        <Link
                          href="/client-dashboard"
                          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gold text-[#0d0d14] rounded-lg hover:bg-gold/90 transition-colors mb-2 font-semibold"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                      )}
                      {(userType === 'admin' || userType === 'semi-admin') && (
                        <Link
                          href="/admin-dashboard"
                          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gold text-[#0d0d14] rounded-lg hover:bg-gold/90 transition-colors mb-2 font-semibold"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Not logged in - Show sign in/up options
                  <>
                    {/* Sign In Button */}
                    <Button
                      nativeButton={false}
                      variant="outline"
                      size="lg"
                      render={
                        <Link
                          href="/sign-in"
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                      }
                      className="w-full border-gold/30 text-gold hover:bg-gold/10 font-semibold mb-4 justify-center"
                    >
                      Sign In
                    </Button>

                    {/* Sign Up Section */}
                    <div>
                      <h3 className="text-sm font-semibold text-[#F5F3EE] mb-3">Sign Up</h3>
                      <div className="space-y-2">
                        <Link
                          href="/sign-up/client"
                          className="flex items-center gap-3 px-4 py-3 border border-gold/15 rounded-lg hover:bg-gold/10 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold/10 border border-gold/20">
                            <User className="w-5 h-5 text-gold" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-[#F5F3EE] text-sm">As Client</div>
                            <div className="text-xs text-text-muted">Find your perfect agent</div>
                          </div>
                        </Link>
                        <Link
                          href="/sign-up/agent"
                          className="flex items-center gap-3 px-4 py-3 border border-gold/15 rounded-lg hover:bg-gold/10 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold/10 border border-gold/20">
                            <Building2 className="w-5 h-5 text-gold" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-[#F5F3EE] text-sm">As Agent</div>
                            <div className="text-xs text-text-muted">Grow your pipeline</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
