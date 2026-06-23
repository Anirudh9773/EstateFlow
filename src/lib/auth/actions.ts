'use server'

import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { UserMetadata } from '@/types/profile'
import type { Provider } from '@supabase/supabase-js'
import { serverSignInSchema, serverSignUpSchema } from '@/lib/validations/auth'
import { sendEmail } from '@/lib/utils/email'
import { decodeSupabaseToken } from '@/lib/auth/twoFactor'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'

export async function signUp(formData: {
  email: string
  password: string
  fullName: string
  phone?: string
  userType: 'client' | 'agent' | 'admin' | 'semi-admin'
  // Agent-specific fields (optional)
  agencyName?: string
  licenseNumber?: string
  areaOfOperation?: string
  yearsExperience?: string
}) {
  // Server-side validation
  const validationResult = serverSignUpSchema.safeParse(formData)
  
  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors
    const firstError = Object.values(errors)[0]?.[0] || 'Validation failed'
    return { error: firstError }
  }

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
      } else if (formData.userType === 'admin' || formData.userType === 'semi-admin') {
        console.log('📝 Creating staff profile for:', formData.email)
        const { data: insertData, error: insertError } = await supabaseAdmin.from('staff').insert({
          user_id: data.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          role: formData.userType,
        }).select()
        
        if (insertError) {
          console.error('❌ Error creating staff profile:', insertError)
          return { error: `Failed to create profile: ${insertError.message}` }
        }
        console.log('✅ Staff profile created successfully:', insertData)
      }
    } catch (profileError) {
      console.error('❌ Exception creating profile:', profileError)
      return { error: 'Failed to create user profile. Please try again.' }
    }

    // Automatically send 2FA OTP on sign up
    try {
      const otpResult = await send2faOtp(data.user.id, data.user.email!)
      if (otpResult.error) {
        console.error('❌ Failed to send initial signup 2FA OTP:', otpResult.error)
      }
    } catch (otpError) {
      console.error('❌ Exception sending initial signup 2FA OTP:', otpError)
    }
  }

  revalidatePath('/', 'layout')
  return { success: true, data, error: null }
}

export async function signIn(formData: {
  email: string
  password: string
}) {
  // Server-side validation
  const validationResult = serverSignInSchema.safeParse(formData)
  
  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors
    const firstError = Object.values(errors)[0]?.[0] || 'Validation failed'
    return { error: firstError }
  }

  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return { error: 'Invalid email or password' }
  }

  // Check if device is trusted
  const cookieStore = await cookies()
  const trustToken = cookieStore.get('remember_device_token')?.value
  let hasTrustedDevice = false

  if (trustToken && data.user) {
    let queryClient;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { createClient } = await import('@supabase/supabase-js')
      queryClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      )
    } else {
      queryClient = supabase
    }

    const { data: deviceRecord } = await queryClient
      .from('remembered_devices')
      .select('id')
      .eq('user_id', data.user.id)
      .eq('device_token', trustToken)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()
    
    hasTrustedDevice = !!deviceRecord
  }

  if (hasTrustedDevice && data.user && data.session) {
    const tokenPayload = decodeSupabaseToken(data.session.access_token)
    const sid = tokenPayload?.sid
    if (sid) {
      let queryClient;
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { createClient } = await import('@supabase/supabase-js')
        queryClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { auth: { autoRefreshToken: false, persistSession: false } }
        )
      } else {
        queryClient = supabase
      }

      await queryClient.from('user_2fa_sessions').insert({
        user_id: data.user.id,
        session_id: sid,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
    }

    revalidatePath('/', 'layout')
    return { 
      success: true, 
      requires2fa: false,
      userType: data.user?.user_metadata?.user_type || 'client' 
    }
  }

  // Trigger 2FA OTP generation and dispatch
  if (data.user) {
    const otpResult = await send2faOtp(data.user.id, data.user.email!)
    if (otpResult.error) {
      return { error: otpResult.error }
    }
  }

  revalidatePath('/', 'layout')
  
  return { 
    success: true, 
    requires2fa: true,
    userType: data.user?.user_metadata?.user_type || 'client' 
  }
}

export async function signInWithOAuth(provider: 'google' | 'facebook' | 'twitter', userType?: 'client' | 'agent') {
  const supabase = await createSupabaseServerClient()
  
  // Resolve site URL dynamically on Vercel to avoid redirecting to localhost in production
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  if (process.env.VERCEL_URL && (siteUrl.includes('localhost') || !siteUrl)) {
    siteUrl = `https://${process.env.VERCEL_URL}`
  }
  
  const redirectUrl = `${siteUrl}/auth/callback${userType ? `?user_type=${userType}` : ''}`
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
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

export async function send2faOtp(userId: string, email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  let supabase;
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient } = await import('@supabase/supabase-js')
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  } else {
    supabase = await createSupabaseServerClient()
  }

  // Delete existing OTPs first
  await supabase.from('user_2fa_otps').delete().eq('user_id', userId)

  const { error } = await supabase.from('user_2fa_otps').insert({
    user_id: userId,
    otp_hash: otpHash,
    expires_at: expiresAt.toISOString(),
  })

  if (error) {
    console.error('Error inserting OTP:', error)
    return { error: 'Failed to generate 2FA code' }
  }

  // Send the email
  await sendEmail({
    to: email,
    subject: 'Your EstateFlow 2FA Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e3a8a; text-align: center;">Two-Factor Authentication</h2>
        <p style="color: #475569; font-size: 16px;">Hello,</p>
        <p style="color: #475569; font-size: 16px;">Please use the following 6-digit security code to verify your sign-in attempt at EstateFlow:</p>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0f172a; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #e11d48; font-size: 14px; font-weight: 500;">This code will expire in 10 minutes. Do not share this code with anyone.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #64748b; font-size: 12px; text-align: center;">This is an automated security email from EstateFlow. If you did not request this, please ignore it.</p>
      </div>
    `,
    code: otp,
  })

  return { success: true }
}

export async function verify2faOtp(otpCode: string, rememberDevice: boolean) {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return { error: 'Session not found. Please log in again.' }
  }

  const user = session.user
  const payload = decodeSupabaseToken(session.access_token)
  const sid = payload?.sid

  if (!sid) {
    return { error: 'Invalid session structure' }
  }

  let queryClient;
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient } = await import('@supabase/supabase-js')
    queryClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  } else {
    queryClient = supabase
  }

  // Fetch OTP record
  const { data: otpRecord, error: otpError } = await queryClient
    .from('user_2fa_otps')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (otpError || !otpRecord) {
    return { error: 'Verification code not found. Please click Resend.' }
  }

  // Check expiration
  if (new Date(otpRecord.expires_at) < new Date()) {
    return { error: 'Verification code has expired. Please click Resend.', showResend: true }
  }

  // Check attempts
  if (otpRecord.attempts >= 3) {
    return { error: 'Too many failed attempts. Please request a new code.', showResend: true }
  }

  // Hash user input and compare
  const inputHash = crypto.createHash('sha256').update(otpCode).digest('hex')
  if (inputHash !== otpRecord.otp_hash) {
    const newAttempts = otpRecord.attempts + 1
    await queryClient
      .from('user_2fa_otps')
      .update({ attempts: newAttempts })
      .eq('id', otpRecord.id)

    const remaining = 3 - newAttempts
    return {
      error: `Invalid verification code. ${remaining > 0 ? `${remaining} attempts remaining.` : 'No attempts remaining.'}`,
      showResend: remaining <= 0
    }
  }

  // Success! Delete OTP record
  await queryClient.from('user_2fa_otps').delete().eq('id', otpRecord.id)

  // Mark session as 2FA-verified
  const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  const { error: sessionInsertError } = await queryClient.from('user_2fa_sessions').insert({
    user_id: user.id,
    session_id: sid,
    expires_at: sessionExpiry.toISOString(),
  })

  if (sessionInsertError) {
    console.error('Error saving 2FA session:', sessionInsertError)
    return { error: 'Failed to finalize 2FA session verification.' }
  }

  // Handle "Remember this device"
  if (rememberDevice) {
    const trustToken = crypto.randomBytes(32).toString('hex')
    const deviceExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    const { error: deviceInsertError } = await queryClient.from('remembered_devices').insert({
      user_id: user.id,
      device_token: trustToken,
      expires_at: deviceExpiry.toISOString(),
    })

    if (deviceInsertError) {
      console.error('Error saving remembered device:', deviceInsertError)
    } else {
      const cookieStore = await cookies()
      cookieStore.set('remember_device_token', trustToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: deviceExpiry,
        path: '/',
      })
    }
  }

  return { success: true, userType: user.user_metadata?.user_type || 'client' }
}

export async function resend2faOtp() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return { error: 'Session not found. Please log in again.' }
  }

  const result = await send2faOtp(session.user.id, session.user.email!)
  return result
}

export async function resetPasswordForEmail(email: string) {
  const supabase = await createSupabaseServerClient()
  
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updateUserPassword(password: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function isSession2faVerified() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  const cookieStore = await cookies()
  const rememberToken = cookieStore.get('remember_device_token')?.value
  
  let payload = null
  let amr: string[] = []
  let sid = null
  let isPasswordLogin = false
  let isVerified = false
  
  if (session) {
    payload = decodeSupabaseToken(session.access_token)
    amr = payload?.amr || []
    sid = payload?.sid
    isPasswordLogin = amr.includes('password')
    
    if (isPasswordLogin && sid) {
      const { isUser2faVerified } = await import('@/lib/auth/twoFactor')
      isVerified = await isUser2faVerified(supabase, session.user.id, sid, cookieStore)
    } else {
      isVerified = true // OAuth/Non-password
    }
  }

  // Write debug log
  try {
    const logDir = 'd:\\Anirudh\'s Project\\estateflow\\scratch'
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }
    fs.appendFileSync(
      path.join(logDir, 'debug.log'),
      JSON.stringify({
        timestamp: new Date().toISOString(),
        hasSession: !!session,
        email: session?.user?.email,
        amr,
        sid,
        isPasswordLogin,
        isVerified,
        rememberTokenPresent: !!rememberToken,
      }, null, 2) + '\n'
    )
  } catch (err) {
    console.error('Failed to write debug log:', err)
  }
  
  if (!session) return false
  return isVerified
}

export async function createStaffMember(staffData: {
  email: string
  password: string
  fullName: string
  phone?: string
  role: 'admin' | 'semi-admin'
}) {
  const supabase = await createSupabaseServerClient()
  
  // 1. Get current logged-in user
  const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
  if (userError || !currentUser) {
    return { error: 'Not authenticated' }
  }

  // 2. Verify current user is an Admin
  let adminCheckClient = supabase
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createClient } = await import('@supabase/supabase-js')
    adminCheckClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  }

  const { data: currentStaff, error: staffError } = await adminCheckClient
    .from('staff')
    .select('role')
    .eq('user_id', currentUser.id)
    .maybeSingle()

  if (staffError || !currentStaff || currentStaff.role !== 'admin') {
    return { error: 'Unauthorized: Only admins can manage staff accounts' }
  }

  // 3. Create staff user using Admin client
  const { data: newUserData, error: createError } = await adminCheckClient.auth.admin.createUser({
    email: staffData.email,
    password: staffData.password,
    email_confirm: true,
    user_metadata: {
      full_name: staffData.fullName,
      phone: staffData.phone,
      user_type: staffData.role,
    }
  })

  if (createError || !newUserData.user) {
    return { error: createError?.message || 'Failed to create user' }
  }

  // 4. Manually insert profile into staff table (robust fallback)
  const { error: insertError } = await adminCheckClient.from('staff').insert({
    user_id: newUserData.user.id,
    full_name: staffData.fullName,
    email: staffData.email,
    phone: staffData.phone || null,
    role: staffData.role,
  })

  if (insertError) {
    console.error('❌ Error creating staff profile:', insertError)
    // Attempt to cleanup created auth user
    await adminCheckClient.auth.admin.deleteUser(newUserData.user.id)
    return { error: `Failed to create profile: ${insertError.message}` }
  }

  return { success: true }
}

export async function submitProperty(payload: {
  intent: string
  postcode: string
  propertyType: string
  bedroomCount: string
  budget: number
  timeline: string
  clientName: string
  clientEmail: string
  clientPhone: string
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('properties')
    .insert({
      client_id: user.id,
      intent: payload.intent,
      postcode: payload.postcode,
      property_type: payload.propertyType,
      bedroom_count: payload.bedroomCount,
      budget: payload.budget,
      timeline: payload.timeline,
      client_name: payload.clientName,
      client_email: payload.clientEmail,
      client_phone: payload.clientPhone
    })
    .select()

  if (error) {
    console.error('Error inserting property:', error)
    return { error: error.message }
  }

  revalidatePath('/client-dashboard')
  return { success: true, data }
}

export async function getClientProperties() {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Not authenticated', data: [] }
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message, data: [] }
  }

  return { success: true, data }
}

export async function updateProperty(id: string, payload: {
  intent: string
  postcode: string
  propertyType: string
  bedroomCount: string
  budget: number
  timeline: string
  clientName: string
  clientEmail: string
  clientPhone: string
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('properties')
    .update({
      intent: payload.intent,
      postcode: payload.postcode,
      property_type: payload.propertyType,
      bedroom_count: payload.bedroomCount,
      budget: payload.budget,
      timeline: payload.timeline,
      client_name: payload.clientName,
      client_email: payload.clientEmail,
      client_phone: payload.clientPhone,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('client_id', user.id)
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/client-dashboard')
  return { success: true, data }
}

export async function deleteProperty(id: string) {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)
    .eq('client_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/client-dashboard')
  return { success: true }
}

export async function getAgentProperties() {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Not authenticated', data: [] }
  }

  // Get agent profile to read area of operation
  const { data: agent, error: agentError } = await supabase
    .from('agents')
    .select('area_of_operation')
    .eq('user_id', user.id)
    .maybeSingle()

  if (agentError) {
    console.error('Error fetching agent profile:', agentError)
    return { error: agentError.message, data: [] }
  }

  // Fetch all properties
  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (propertiesError) {
    return { error: propertiesError.message, data: [] }
  }

  if (!agent || !agent.area_of_operation) {
    // If agent has no area of operation, return all properties as fallback
    return { success: true, data: properties || [] }
  }

  const cleanArea = agent.area_of_operation.trim().toLowerCase()
  
  // Filter properties based on postcode matching
  const matchedProperties = (properties || []).filter(property => {
    if (!property.postcode) return false
    const cleanPostcode = property.postcode.trim().toLowerCase()
    
    // Check if either postcode starts with, is included in, or matches
    return (
      cleanPostcode.includes(cleanArea) || 
      cleanArea.includes(cleanPostcode) ||
      cleanArea === 'all' || 
      cleanArea === 'pan city' || 
      cleanArea === 'pan-city'
    )
  })

  return { success: true, data: matchedProperties }
}
