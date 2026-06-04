import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeSupabaseToken } from '@/lib/auth/twoFactor'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const userType = requestUrl.searchParams.get('user_type')
  const next = requestUrl.searchParams.get('next')

  console.log('🔍 OAuth Callback - Code:', code ? 'Present' : 'Missing')
  console.log('🔍 OAuth Callback - User Type:', userType)
  console.log('🔍 OAuth Callback - Next Path:', next)

  if (code) {
    const cookieStore = await cookies()
    
    let response = NextResponse.next()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
                response.cookies.set(name, value, options)
              })
            } catch (error) {
              console.error('❌ Error setting cookies:', error)
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('❌ OAuth callback error:', error)
      return NextResponse.redirect(new URL('/sign-in?error=oauth_failed', request.url))
    }

    console.log('✅ Session exchanged successfully')
    console.log('👤 User:', data.user?.email)

    // Check for password recovery flow (forgot password)
    if (data.session) {
      const payload = decodeSupabaseToken(data.session.access_token)
      const amr = payload?.amr || []
      console.log('🔍 Session AMR:', amr)
      
      if (amr.includes('recovery')) {
        console.log('➡️  Detected password recovery session. Redirecting to reset-password')
        return NextResponse.redirect(new URL('/reset-password', request.url))
      }
    }

    // If user_type is provided and not already set, update user metadata and create profile
    if (data.user && userType && (userType === 'client' || userType === 'agent')) {
      const existingUserType = data.user.user_metadata?.user_type
      
      console.log('🔍 Checking user type - Existing:', existingUserType, 'Requested:', userType)
      
      if (!existingUserType) {
        console.log('📝 Updating user metadata...')
        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            user_type: userType,
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0],
            email: data.user.email,
          },
        })

        if (updateError) {
          console.error('❌ Error updating user metadata:', updateError)
        } else {
          console.log('✅ User metadata updated')
        }

        // Create profile
        try {
          const { createClient } = await import('@supabase/supabase-js')
          
          if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.log('🔑 Using service role key to create profile')
            const supabaseAdmin = createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.SUPABASE_SERVICE_ROLE_KEY!,
              { auth: { autoRefreshToken: false, persistSession: false } }
            )

            const fullName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User'
            const email = data.user.email!

            if (userType === 'client') {
              console.log('👤 Creating client profile...')
              const { data: existingProfile } = await supabaseAdmin
                .from('clients')
                .select('id')
                .eq('user_id', data.user.id)
                .single()

              if (!existingProfile) {
                const { error: insertError } = await supabaseAdmin.from('clients').insert({
                  user_id: data.user.id,
                  full_name: fullName,
                  email: email,
                  phone: null,
                })
                
                if (insertError) {
                  console.error('❌ Error creating client profile:', insertError)
                } else {
                  console.log('✅ Client profile created')
                }
              } else {
                console.log('ℹ️  Client profile already exists')
              }
            } else if (userType === 'agent') {
              console.log('👤 Creating agent profile...')
              const { data: existingProfile } = await supabaseAdmin
                .from('agents')
                .select('id')
                .eq('user_id', data.user.id)
                .single()

              if (!existingProfile) {
                const { error: insertError } = await supabaseAdmin.from('agents').insert({
                  user_id: data.user.id,
                  full_name: fullName,
                  email: email,
                  phone: null,
                  agency_name: null,
                  license_number: null,
                  area_of_operation: null,
                  years_experience: null,
                })
                
                if (insertError) {
                  console.error('❌ Error creating agent profile:', insertError)
                } else {
                  console.log('✅ Agent profile created')
                }
              } else {
                console.log('ℹ️  Agent profile already exists')
              }
            }
          } else {
            console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment')
          }
        } catch (profileError) {
          console.error('❌ Exception creating profile:', profileError)
        }
      } else {
        console.log('ℹ️  User type already set:', existingUserType)
      }
    }

    // Redirect based on user type or next parameter
    const { data: { user } } = await supabase.auth.getUser()
    const metadata = user?.user_metadata

    console.log('🔄 Redirecting user...')
    console.log('📋 User metadata:', metadata)

    if (next) {
      console.log('➡️  Redirecting to next path:', next)
      return NextResponse.redirect(new URL(next, request.url))
    }

    if (metadata?.user_type === 'agent') {
      console.log('➡️  Redirecting to agent dashboard')
      return NextResponse.redirect(new URL('/agent-dashboard', request.url))
    }

    console.log('➡️  Redirecting to homepage')
    return NextResponse.redirect(new URL('/', request.url))
  }

  console.log('⚠️  No code provided, redirecting to sign-in')
  return NextResponse.redirect(new URL('/sign-in', request.url))
}

export const dynamic = 'force-dynamic'