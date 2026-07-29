import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileQuestion, Home, Search, Building2 } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-50/50">
      <Card className="max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden rounded-2xl bg-white">
        <div className="h-2 bg-gradient-to-r from-navy via-amber-500 to-emerald-600" />
        <CardContent className="p-8 sm:p-10 text-center space-y-6">
          {/* Badge & Icon */}
          <div className="relative w-20 h-20 bg-navy/5 border border-navy/10 text-navy rounded-full flex items-center justify-center mx-auto shadow-inner">
            <FileQuestion className="w-10 h-10 text-navy" />
            <span className="absolute -top-1 -right-1 bg-gold text-navy text-xs font-bold px-2 py-0.5 rounded-full border border-white shadow-sm">
              404
            </span>
          </div>

          {/* Heading & Text */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              Page Not Found
            </h1>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              Sorry, we couldn&apos;t find the page you were looking for. It may have been moved, renamed, or no longer exists.
            </p>
          </div>

          {/* Useful Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link href="/" className="w-full">
              <Button
                variant="outline"
                className="w-full border-slate-200 text-slate-700 hover:bg-navy hover:text-gold font-medium h-11 flex flex-col items-center justify-center gap-1 text-xs transition-all"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Link href="/agents" className="w-full">
              <Button
                variant="outline"
                className="w-full border-slate-200 text-slate-700 hover:bg-navy hover:text-gold font-medium h-11 flex flex-col items-center justify-center gap-1 text-xs transition-all"
              >
                <Search className="w-4 h-4" />
                Find Agents
              </Button>
            </Link>
            <Link href="/submit-property" className="w-full">
              <Button
                variant="outline"
                className="w-full border-slate-200 text-slate-700 hover:bg-navy hover:text-gold font-medium h-11 flex flex-col items-center justify-center gap-1 text-xs transition-all"
              >
                <Building2 className="w-4 h-4" />
                Submit Property
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
