import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { decodeSupabaseToken } from '@/lib/auth/twoFactor'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  // 1. Redirect to sign-in if not authenticated and accessing protected routes or verify-2fa
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin-dashboard')
  const isAgentRoute = request.nextUrl.pathname.startsWith('/agent-dashboard')
  const isProtectedRoute =
    isAgentRoute ||
    request.nextUrl.pathname.startsWith('/submit-property') ||
    isAdminRoute

  if (!user && (isProtectedRoute || request.nextUrl.pathname.startsWith('/verify-2fa'))) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // 2. Redirect authenticated users based on 2FA status
  if (user && session) {
    const payload = decodeSupabaseToken(session.access_token)
    const amr = payload?.amr || []
    const sid = payload?.sid
    const isPasswordLogin = amr.includes('password')
    const userType = user.user_metadata?.user_type

    console.log('🔍 Middleware Auth Status:', {
      email: user.email,
      amr,
      sid: sid ? 'Present' : 'Missing',
      isPasswordLogin,
      path: request.nextUrl.pathname,
      userType
    })

    const isAuthRoute =
      request.nextUrl.pathname.startsWith('/sign-in') ||
      request.nextUrl.pathname.startsWith('/sign-up')

    const is2faRoute = request.nextUrl.pathname.startsWith('/verify-2fa')

    // Role-based authorization guards
    if (isAdminRoute && userType !== 'admin' && userType !== 'semi-admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (isAgentRoute && userType !== 'agent') {
      const dest = (userType === 'admin' || userType === 'semi-admin') ? '/admin-dashboard' : '/'
      return NextResponse.redirect(new URL(dest, request.url))
    }

    let isVerified = true
    if (isPasswordLogin && sid) {
      const { isUser2faVerified } = await import('@/lib/auth/twoFactor')
      isVerified = await isUser2faVerified(supabase, user.id, sid, request.cookies)
    }

    if (!isVerified) {
      // If not 2FA-verified, force redirect to /verify-2fa for protected pages
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/verify-2fa', request.url))
      }
    } else {
      // If already verified, redirect away from /verify-2fa or standard auth pages
      if (is2faRoute || isAuthRoute) {
        let dest = '/'
        if (userType === 'agent') {
          dest = '/agent-dashboard'
        } else if (userType === 'admin' || userType === 'semi-admin') {
          dest = '/admin-dashboard'
        }
        return NextResponse.redirect(new URL(dest, request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/agent-dashboard/:path*',
    '/submit-property/:path*',
    '/admin-dashboard/:path*',
    '/sign-in',
    '/sign-up/:path*',
    '/verify-2fa',
  ],
}