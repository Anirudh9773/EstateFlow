import Link from 'next/link'
import { SITE_TAGLINE, SITE_EMAIL, SITE_PHONE, SITE_ADDRESS, ROUTES } from '@/lib/constants'

export default function Footer() {
  const platformLinks = [
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Find an agent', href: ROUTES.findAgent },
    { label: 'Submit a property', href: ROUTES.submitLead },
    { label: 'Pricing', href: ROUTES.pricing },
  ]

  const agentLinks = [
    { label: 'Agent pricing', href: ROUTES.pricing },
    { label: 'Join as an agent', href: '/join' },
    { label: 'Agent login', href: ROUTES.agentLogin },
    { label: 'Agent dashboard', href: ROUTES.agentDashboard },
  ]

  const companyLinks = [
    { label: 'About us', href: ROUTES.about },
    { label: 'Contact', href: ROUTES.contact },
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Terms of service', href: '/terms' },
  ]

  return (
    <>
      {/* Separator line */}
      <div className="bg-white border-t border-slate-200"></div>
      
      <footer className="bg-navy pt-12 sm:pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 pb-8 sm:pb-12 border-b border-white/10">
            {/* Brand column */}
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="mb-3 flex items-center gap-2">
                {/* Property icon */}
                <svg
                  className="h-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2"
                    y="4"
                    width="10"
                    height="12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-gold"
                  />
                  <rect
                    x="8"
                    y="4"
                    width="10"
                    height="12"
                    fill="currentColor"
                    className="text-gold/20"
                  />
                  <path
                    d="M14 10L17 10M17 10L15.5 8.5M17 10L15.5 11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gold"
                  />
                </svg>
                <span className="text-lg font-semibold text-gold">
                  EstateFlow
                </span>
              </div>
              <p className="text-white/40 text-sm mb-4">{SITE_TAGLINE}</p>
              
              {/* Social icons */}
              <div className="flex items-center gap-3">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-gold transition-colors duration-150"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-gold transition-colors duration-150"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Platform links */}
            <div>
              <h3 className="text-white font-medium mb-4 text-sm">Platform</h3>
              <ul className="space-y-2.5">
                {platformLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/50 text-sm hover:text-gold transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Agents links */}
            <div>
              <h3 className="text-white font-medium mb-4 text-sm">For Agents</h3>
              <ul className="space-y-2.5">
                {agentLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/50 text-sm hover:text-gold transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <h3 className="text-white font-medium mb-4 text-sm">Company</h3>
              <ul className="space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/50 text-sm hover:text-gold transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs text-center sm:text-left">
              © 2026 EstateFlow Ltd. All rights reserved.
            </p>
            <p className="text-white/20 text-xs text-center sm:text-right">Built for UK real estate</p>
          </div>
        </div>
      </footer>
    </>
  )
}
