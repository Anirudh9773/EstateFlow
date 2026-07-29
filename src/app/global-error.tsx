'use client'

import React, { useEffect } from 'react'

export default function GlobalRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Critical Root Layout Error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">System Error</h1>
            <p className="text-sm text-slate-300">
              A critical error occurred while initializing EstateFlow. Please try refreshing the application.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Reload Application
            </button>
            <button
              onClick={() => { window.location.href = '/' }}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Back to Safety
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
