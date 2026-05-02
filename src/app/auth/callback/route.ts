import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const userType = requestUrl.searchParams.get('user_type')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('OAuth callback error:', error)
      return NextResponse.redirect(new URL('/sign-in?error=oauth_failed', request.url))
    }

    // If user_type is provided via query parameter (from sign-up) and not already in metadata, update user metadata
    if (data.user && userType && (userType === 'client' || userType === 'agent')) {
      const existingUserType = data.user.user_metadata?.user_type
      
      // Only update if user_type is not already set (to handle both new sign-ups and existing sign-ins)
      if (!existingUserType) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            user_type: userType,
          },
        })

        if (updateError) {
          console.error('Error updating user metadata:', updateError)
        }
      }
    }

    // Get user metadata to determine redirect
    const { data: { user } } = await supabase.auth.getUser()
    const metadata = user?.user_metadata

    // Redirect based on user type
    if (metadata?.user_type === 'agent') {
      return NextResponse.redirect(new URL('/agent-dashboard', request.url))
    }

    // Default redirect to home for clients or users without type
    return NextResponse.redirect(new URL('/', request.url))
  }

  // No code provided, redirect to sign-in
  return NextResponse.redirect(new URL('/sign-in', request.url))
}

export const dynamic = 'force-dynamic'