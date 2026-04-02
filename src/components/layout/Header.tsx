'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, User, Building2 } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openAuthDropdown, setOpenAuthDropdown] = useState<string | null>(null);
  const [showTrustBar, setShowTrustBar] = useState(true);

  const platformDropdownRef = useRef<HTMLDivElement>(null);
  const agentsDropdownRef = useRef<HTMLDivElement>(null);
  const clientAuthRef = useRef<HTMLDivElement>(null);
  const agentAuthRef = useRef<HTMLDivElement>(null);

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
        clientAuthRef.current &&
        !clientAuthRef.current.contains(event.target as Node)
      ) {
        if (openAuthDropdown === 'client') setOpenAuthDropdown(null);
      }
      if (
        agentAuthRef.current &&
        !agentAuthRef.current.contains(event.target as Node)
      ) {
        if (openAuthDropdown === 'agent') setOpenAuthDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown, openAuthDropdown]);

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const toggleAuthDropdown = (dropdown: string) => {
    setOpenAuthDropdown(openAuthDropdown === dropdown ? null : dropdown);
  };

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
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openDropdown === 'agents' ? 'rotate-180' : ''
                    }`}
                  />
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

              {/* Client Auth Dropdown */}
              <div className="relative" ref={clientAuthRef}>
                <button
                  onClick={() => toggleAuthDropdown('client')}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-slate-700 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm"
                  aria-expanded={openAuthDropdown === 'client'}
                  aria-haspopup="true"
                >
                  <span className="hidden sm:inline">I'm a Client</span>
                  <span className="sm:hidden">Client</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAuthDropdown === 'client' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAuthDropdown === 'client' && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-5 animate-fadeIn">
                    <div className="flex items-start gap-3 mb-4">
                      <User className="w-6 h-6 text-slate-700 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">For Clients</h3>
                        <p className="text-sm text-slate-600">Find your perfect property agent</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href="/client/signin"
                        className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-center font-medium hover:bg-slate-50 transition-colors"
                        onClick={() => setOpenAuthDropdown(null)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/client/signup"
                        className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-center font-medium hover:bg-slate-800 transition-colors"
                        onClick={() => setOpenAuthDropdown(null)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Agent Auth Dropdown */}
              <div className="relative" ref={agentAuthRef}>
                <button
                  onClick={() => toggleAuthDropdown('agent')}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm"
                  aria-expanded={openAuthDropdown === 'agent'}
                  aria-haspopup="true"
                >
                  <span className="hidden sm:inline">I'm an Agent</span>
                  <span className="sm:hidden">Agent</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAuthDropdown === 'agent' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAuthDropdown === 'agent' && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-5 animate-fadeIn">
                    <div className="flex items-start gap-3 mb-4">
                      <Building2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">For Agents</h3>
                        <p className="text-sm text-slate-600">
                          Grow your pipeline with qualified leads
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href="/agent/signin"
                        className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-center font-medium hover:bg-slate-50 transition-colors"
                        onClick={() => setOpenAuthDropdown(null)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/agent/signup"
                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-center font-medium hover:bg-emerald-700 transition-colors"
                        onClick={() => setOpenAuthDropdown(null)}
                      >
                        Join as an Agent
                      </Link>
                    </div>
                  </div>
                )}
              </div>
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
                {/* Client Auth */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Client Sign In / Sign Up
                  </h3>
                  <p className="text-xs text-slate-600 mb-3">Find your perfect property agent</p>
                  <div className="flex gap-2">
                    <Link
                      href="/client/signin"
                      className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-center text-sm font-medium hover:bg-slate-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/client/signup"
                      className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-center text-sm font-medium hover:bg-slate-800 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>

                {/* Agent Auth */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Agent Sign In / Sign Up
                  </h3>
                  <p className="text-xs text-slate-600 mb-3">
                    Grow your pipeline with qualified leads
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href="/agent/signin"
                      className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-center text-sm font-medium hover:bg-slate-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/agent/signup"
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-center text-sm font-medium hover:bg-emerald-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Join as an Agent
                    </Link>
                  </div>
                </div>

                {/* Primary CTA */}
                <Link
                  href="/submit-property"
                  className="block w-full px-5 py-3 bg-amber-500 text-white rounded-lg text-center font-medium hover:bg-amber-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Submit a Property
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
