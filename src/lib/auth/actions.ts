'use server'

import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { UserMetadata } from '@/types/profile'

export async function signUp(formData: {
  email: string
  password: string
  fullName: string
  phone?: string
  userType: 'client' | 'agent'
  // Agent-specific fields (optional)
  agencyName?: string
  licenseNumber?: string
  areaOfOperation?: string
  yearsExperience?: string
}) {
  const supabase = await createSupabaseServerClient()

  // Build metadata object conditionally based on userType
  const metadata: UserMetadata = {
    full_name: formData.fullName,
    phone: formData.phone,
    user_type: formData.userType,
  }

  // Include agent-specific fields in metadata when userType='agent'
  if (formData.userType === 'agent') {
    metadata.agency_name = formData.agencyName
    metadata.license_number = formData.licenseNumber
    metadata.area_of_operation = formData.areaOfOperation
    metadata.years_experience = formData.yearsExperience
  }

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: metadata,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Manually create profile record since trigger doesn't work
  // Use service role client to bypass RLS policies during profile creation
  if (data.user) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      
      // Check if service role key exists
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set in environment variables!')
        return { error: 'Server configuration error. Please contact support.' }
      }

      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )

      if (formData.userType === 'client') {
        console.log('📝 Creating client profile for:', formData.email)
        const { data: insertData, error: insertError } = await supabaseAdmin.from('clients').insert({
          user_id: data.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
        }).select()
        
        if (insertError) {
          console.error('❌ Error creating client profile:', insertError)
          return { error: `Failed to create profile: ${insertError.message}` }
        }
        console.log('✅ Client profile created successfully:', insertData)
      } else if (formData.userType === 'agent') {
        console.log('📝 Creating agent profile for:', formData.email)
        const { data: insertData, error: insertError } = await supabaseAdmin.from('agents').insert({
          user_id: data.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          agency_name: formData.agencyName || null,
          license_number: formData.licenseNumber || null,
          area_of_operation: formData.areaOfOperation || null,
          years_experience: formData.yearsExperience || null,
        }).select()
        
        if (insertError) {
          console.error('❌ Error creating agent profile:', insertError)
          return { error: `Failed to create profile: ${insertError.message}` }
        }
        console.log('✅ Agent profile created successfully:', insertData)
      }
    } catch (profileError) {
      console.error('❌ Exception creating profile:', profileError)
      return { error: 'Failed to create user profile. Please try again.' }
    }
  }

  revalidatePath('/', 'layout')
  return { success: true, data, error: null }
}

export async function signIn(formData: {
  email: string
  password: string
}) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return { error: 'Invalid email or password' }
  }

  revalidatePath('/', 'layout')
  
  // Return success with user type for client-side redirect
  return { 
    success: true, 
    userType: data.user?.user_metadata?.user_type || 'client' 
  }
}

export async function signInWithOAuth(provider: 'google' | 'azure' | 'twitter', userType?: 'client' | 'agent') {
  const supabase = await createSupabaseServerClient()
  
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback${userType ? `?user_type=${userType}` : ''}`
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: redirectUrl,
      ...(userType && {
        data: {
          user_type: userType,
        },
      }),
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }

  return { error: 'Failed to initiate OAuth flow' }
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  // Don't redirect - let client handle it
  return { success: true }
}

export async function getUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
