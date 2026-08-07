'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled App Runtime Error:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50/50">
      <Card className="max-w-md w-full border border-slate-200 shadow-xl overflow-hidden rounded-2xl bg-white">
        <div className="h-2 bg-gradient-to-r from-amber-500 via-red-500 to-navy" />
        <CardContent className="p-8 text-center space-y-6">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-50 border border-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>

          {/* Error Title & Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 font-heading">
              Something Went Wrong
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              We encountered an unexpected error while loading this page. Don&apos;t worry, your data is safe.
            </p>
            {error?.digest && (
              <p className="text-[11px] font-mono bg-slate-100 text-slate-500 py-1 px-2 rounded inline-block mt-2">
                Error Ref: {error.digest}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              onClick={() => reset()}
              className="w-full bg-navy text-gold hover:bg-navy/90 font-semibold h-11 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Link href="/" className="w-full">
              <Button
                variant="outline"
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 font-medium h-11 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </Button>
            </Link>
          </div>

          {/* Help link */}
          <p className="text-xs text-slate-400 pt-2">
            If this issue persists, please{' '}
            <Link href="/contact" className="text-navy underline hover:text-navy/80 font-medium">
              contact support
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
