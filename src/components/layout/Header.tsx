'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, User, Building2, LogOut } from 'lucide-react';
import { useUser } from '@/lib/auth/useUser';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showTrustBar, setShowTrustBar] = useState(true);
  const { user, loading } = useUser();

  const platformDropdownRef = useRef<HTMLDivElement>(null);
  const agentsDropdownRef = useRef<HTMLDivElement>(null);
  const signInDropdownRef = useRef<HTMLDivElement>(null);
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
        signInDropdownRef.current &&
        !signInDropdownRef.current.contains(event.target as Node)
      ) {
        if (openDropdown === 'signin') setOpenDropdown(null);
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
      // Use hard reload for sign out to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, []);

  const platformLinks = [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Find an Agent', href: '/find-an-agent' },
    { label: 'Submit a Property', href: '/submit-property' },
    { label: 'Pricing', href: '/pricing' },
  ];

  const agentLinks = [
    { label: 'Agent Pricing', href: '/agent-pricing' },
    { label: 'Join as an Agent', href: '/join-as-agent' },
    { label: 'Agent Dashboard', href: '/agent-dashboard' },
  ];

  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Trust Bar */}
      {showTrustBar && (
        <div className="bg-slate-900 text-white text-xs sm:text-sm py-2">
          <div className="container mx-auto px-4 flex items-center justify-center relative">
            <span className="flex items-center gap-2 text-center">
              <span className="text-emerald-400">✓</span>
              Trusted by 1,200+ verified agents across the UK
            </span>
            <button
              onClick={() => setShowTrustBar(false)}
              className="absolute right-4 text-slate-400 hover:text-white transition-colors text-lg leading-none"
              aria-label="Dismiss announcement"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-md backdrop-blur-sm bg-white/95' : ''
        }`}
      >
        <nav className="container mx-auto px-4" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">🏡</span>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-slate-900">EstateFlow</span>
                <span className="text-xs text-slate-500 hidden lg:block">
                  Where properties meet the right agent
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Platform Dropdown */}
              <div className="relative" ref={platformDropdownRef}>
                <button
                  onClick={() => toggleDropdown('platform')}
                  className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-medium transition-colors"
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
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 animate-fadeIn">
                    {platformLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* For Agents Dropdown */}
              <div className="relative" ref={agentsDropdownRef}>
                <button
                  onClick={() => toggleDropdown('agents')}
                  className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-medium transition-colors"
                  aria-expanded={openDropdown === 'agents'}
                  aria-haspopup="true"
                >
                  For Agents
                 
                </button>
                {openDropdown === 'agents' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 animate-fadeIn">
                    {agentLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Company Links */}
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Primary CTA */}
              <Link
                href="/submit-property"
                className="px-3 sm:px-5 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors text-sm"
              >
                <span className="hidden sm:inline">Submit a Property</span>
                <span className="sm:hidden">Submit</span>
              </Link>

              {loading ? (
                // Loading state
                <div className="w-24 h-10 bg-slate-200 animate-pulse rounded-lg"></div>
              ) : user ? (
                // Logged in - Show user menu
                <div className="relative" ref={userMenuDropdownRef}>
                  <button
                    onClick={() => toggleDropdown('usermenu')}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm"
                    aria-expanded={openDropdown === 'usermenu'}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-navy text-gold flex items-center justify-center text-xs font-semibold">
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
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 animate-fadeIn z-50">
                      <div className="px-4 py-3 border-b border-slate-200">
                        <p className="text-sm font-medium text-slate-900">{userDisplayName}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        <p className="text-xs text-slate-400 mt-1 capitalize">
                          {userType} Account
                        </p>
                      </div>
                      {userType === 'agent' && (
                        <Link
                          href="/agent-dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <Building2 className="w-5 h-5 text-emerald-600" />
                          <span className="text-sm">Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-5 h-5 text-red-600" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Not logged in - Show sign in/up buttons
                <>
                  {/* Sign In Dropdown */}
                  <div className="relative" ref={signInDropdownRef}>
                    <button
                      onClick={() => toggleDropdown('signin')}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm"
                      aria-expanded={openDropdown === 'signin'}
                      aria-haspopup="true"
                    >
                      Sign In
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === 'signin' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openDropdown === 'signin' && (
                      <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 animate-fadeIn z-50">
                        <Link
                          href="/sign-in"
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
                            <User className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">As Client</div>
                            <div className="text-xs text-slate-500">Find your perfect agent</div>
                          </div>
                        </Link>
                        <Link
                          href="/sign-in"
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">As Agent</div>
                            <div className="text-xs text-slate-500">Manage your leads</div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Sign Up Dropdown */}
                  <div className="relative" ref={signUpDropdownRef}>
                    <button
                      onClick={() => toggleDropdown('signup')}
                      className="flex items-center gap-2 px-4 py-2 bg-navy text-gold rounded-lg font-medium hover:bg-navy/90 transition-colors text-sm"
                      aria-expanded={openDropdown === 'signup'}
                      aria-haspopup="true"
                    >
                      Sign Up
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === 'signup' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openDropdown === 'signup' && (
                      <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 animate-fadeIn z-50">
                        <Link
                          href="/sign-up/client"
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
                            <User className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">As Client</div>
                            <div className="text-xs text-slate-500">Find your perfect agent</div>
                          </div>
                        </Link>
                        <Link
                          href="/sign-up/agent"
                          className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">As Agent</div>
                            <div className="text-xs text-slate-500">Grow your pipeline</div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200 animate-slideDown">
              {/* Platform Section */}
              <div className="mb-4">
                <h3 className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Platform
                </h3>
                {platformLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* For Agents Section */}
              <div className="mb-4">
                <h3 className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  For Agents
                </h3>
                {agentLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Company Section */}
              <div className="mb-4">
                <h3 className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Company
                </h3>
                {companyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 px-4">
                {/* Primary CTA */}
                <Link
                  href="/submit-property"
                  className="block w-full px-5 py-3 bg-amber-500 text-white rounded-lg text-center font-medium hover:bg-amber-600 transition-colors mb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Submit a Property
                </Link>

                {loading ? (
                  // Loading state
                  <div className="space-y-3">
                    <div className="h-20 bg-slate-200 animate-pulse rounded-lg"></div>
                    <div className="h-20 bg-slate-200 animate-pulse rounded-lg"></div>
                  </div>
                ) : user ? (
                  // Logged in - Show user info and sign out
                  <div>
                    <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-navy text-gold flex items-center justify-center text-lg font-semibold">
                          {userInitial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{userDisplayName}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          <p className="text-xs text-slate-400 capitalize">
                            {userType} Account
                          </p>
                        </div>
                      </div>
                      {userType === 'agent' && (
                        <Link
                          href="/agent-dashboard"
                          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors mb-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Not logged in - Show sign in/up options
                  <>
                    {/* Sign In Section */}
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Sign In</h3>
                      <div className="space-y-2">
                        <Link
                          href="/sign-in"
                          className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
                            <User className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 text-sm">As Client</div>
                            <div className="text-xs text-slate-500">Find your perfect agent</div>
                          </div>
                        </Link>
                        <Link
                          href="/sign-in"
                          className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 text-sm">As Agent</div>
                            <div className="text-xs text-slate-500">Manage your leads</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Sign Up Section */}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Sign Up</h3>
                      <div className="space-y-2">
                        <Link
                          href="/sign-up/client"
                          className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
                            <User className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 text-sm">As Client</div>
                            <div className="text-xs text-slate-500">Find your perfect agent</div>
                          </div>
                        </Link>
                        <Link
                          href="/sign-up/agent"
                          className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 text-sm">As Agent</div>
                            <div className="text-xs text-slate-500">Grow your pipeline</div>
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
