import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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

  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to sign-in if not authenticated and accessing protected routes
  if (!user && (
    request.nextUrl.pathname.startsWith('/agent-dashboard') ||
    request.nextUrl.pathname.startsWith('/submit-property')
  )) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // Redirect authenticated users away from auth pages
  if (user && (
    request.nextUrl.pathname.startsWith('/sign-in') ||
    request.nextUrl.pathname.startsWith('/sign-up')
  )) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/agent-dashboard/:path*',
    '/submit-property/:path*',
    '/sign-in',
    '/sign-up/:path*',
  ],
}