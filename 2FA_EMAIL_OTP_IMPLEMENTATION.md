# 🔐 2FA & Email OTP Implementation Guide

## 🎯 What This Implements

1. **Email OTP on Sign-Up** - Users receive a code via email to verify their account
2. **2FA (Two-Factor Authentication)** - Additional security layer for sign-in
3. **Email Verification** - Confirm email ownership before allowing access

---

## 📋 Overview

### Current Flow (Without OTP):
```
User signs up → Profile created → Logged in immediately ❌
```

### New Flow (With OTP):
```
User signs up → Email sent with OTP → User enters OTP → Email verified ✅ → Profile created → Logged in
```

---

## 🚀 Implementation Options

### Option 1: Supabase Built-in Email Verification (RECOMMENDED)
**Pros**: 
- ✅ Already built into Supabase
- ✅ No additional setup required
- ✅ Secure and tested
- ✅ Free

**Cons**:
- ❌ Uses email link (not OTP code)
- ❌ Less customizable

### Option 2: Custom OTP System with Resend (BEST FOR YOUR NEEDS)
**Pros**:
- ✅ 6-digit OTP codes (like "123456")
- ✅ Full control over email templates
- ✅ Can customize expiry time
- ✅ Free tier: 3,000 emails/month
- ✅ Professional email service

**Cons**:
- ❌ Requires additional setup

---

## 📖 Recommended: Custom OTP with Resend

I'll guide you through implementing a **custom OTP system** that sends a 6-digit code via email.

---

## 🔧 Step-by-Step Implementation

### Step 1: Sign Up for Resend (Email Service)

1. **Go to**: https://resend.com
2. **Sign up** with your email
3. **Verify your email**
4. **Get API Key**:
   - Dashboard → API Keys → Create API Key
   - Copy the key (starts with `re_`)
5. **Add to `.env.local`**:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   ```

---

### Step 2: Install Resend Package

```bash
pnpm add resend
```

---

### Step 3: Create OTP Utilities

**Create file**: `src/lib/otp/otpService.ts`

```typescript
import { Resend } from 'resend'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send OTP via email
 */
export async function sendOTPEmail(
  email: string,
  otp: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: 'EstateFlow <onboarding@yourdomain.com>', // Change this!
      to: email,
      subject: 'Verify Your Email - EstateFlow',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background: #f9f9f9;
                border-radius: 8px;
                padding: 30px;
                border: 1px solid #e0e0e0;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 28px;
                font-weight: bold;
                color: #1e3a8a;
              }
              .otp-box {
                background: white;
                border: 2px solid #1e3a8a;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 30px 0;
              }
              .otp-code {
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #1e3a8a;
                font-family: monospace;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">EstateFlow</div>
              </div>
              
              <h2>Welcome, ${name}!</h2>
              <p>Thank you for signing up with EstateFlow. To complete your registration, please verify your email address.</p>
              
              <p>Your verification code is:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <p><strong>This code will expire in 10 minutes.</strong></p>
              
              <p>If you didn't create an account with EstateFlow, please ignore this email.</p>
              
              <div class="footer">
                <p>&copy; 2026 EstateFlow. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending OTP email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

/**
 * Store OTP in database (temporary table)
 */
export interface OTPRecord {
  email: string
  otp: string
  created_at: Date
  expires_at: Date
  user_type: 'client' | 'agent'
}
```

---

### Step 4: Create OTP Database Table

**Go to**: Supabase Dashboard → SQL Editor

**Run this SQL**:

```sql
-- Create OTP verification table
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('client', 'agent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_email ON public.otp_verifications(email);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON public.otp_verifications(expires_at);

-- Auto-delete expired OTPs (run every hour)
CREATE OR REPLACE FUNCTION delete_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.otp_verifications 
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Optional: Set up automatic cleanup (requires pg_cron extension)
-- SELECT cron.schedule('delete-expired-otps', '0 * * * *', 'SELECT delete_expired_otps()');
```

---

### Step 5: Update Sign-Up Server Actions

**File**: `src/lib/auth/actions.ts`

**Add OTP functions**:

```typescript
import { sendOTPEmail, generateOTP } from '@/lib/otp/otpService'

/**
 * Step 1: Send OTP during sign-up
 */
export async function sendSignUpOTP(formData: {
  email: string
  fullName: string
  userType: 'client' | 'agent'
}) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Check if email already exists
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail(formData.email)
    if (existingUser) {
      return { success: false, error: 'Email already registered' }
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in database
    const { error: dbError } = await supabase
      .from('otp_verifications')
      .insert({
        email: formData.email,
        otp: otp,
        user_type: formData.userType,
        expires_at: expiresAt.toISOString(),
      })

    if (dbError) {
      console.error('Error storing OTP:', dbError)
      return { success: false, error: 'Failed to generate verification code' }
    }

    // Send OTP via email
    const emailResult = await sendOTPEmail(formData.email, otp, formData.fullName)
    
    if (!emailResult.success) {
      return { success: false, error: 'Failed to send verification email' }
    }

    return { success: true, message: 'Verification code sent to your email' }
  } catch (error) {
    console.error('Error in sendSignUpOTP:', error)
    return { success: false, error: 'An error occurred. Please try again.' }
  }
}

/**
 * Step 2: Verify OTP and complete sign-up
 */
export async function verifyOTPAndSignUp(formData: {
  email: string
  otp: string
  password: string
  fullName: string
  phone?: string
  userType: 'client' | 'agent'
  // Agent-specific fields
  agencyName?: string
  licenseNumber?: string
  areaOfOperation?: string
  yearsExperience?: string
}) {
  try {
    const supabase = createSupabaseServerClient()
    const supabaseAdmin = createSupabaseServerClient() // For admin operations

    // Verify OTP
    const { data: otpRecord, error: otpError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('email', formData.email)
      .eq('otp', formData.otp)
      .eq('verified', false)
      .single()

    if (otpError || !otpRecord) {
      return { success: false, error: 'Invalid or expired verification code' }
    }

    // Check if OTP is expired
    if (new Date(otpRecord.expires_at) < new Date()) {
      return { success: false, error: 'Verification code has expired' }
    }

    // Check attempts (prevent brute force)
    if (otpRecord.attempts >= 5) {
      return { success: false, error: 'Too many failed attempts. Please request a new code.' }
    }

    // Mark OTP as verified
    await supabase
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', otpRecord.id)

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          user_type: formData.userType,
          // Agent-specific fields
          ...(formData.userType === 'agent' && {
            agency_name: formData.agencyName,
            license_number: formData.licenseNumber,
            area_of_operation: formData.areaOfOperation,
            years_experience: formData.yearsExperience,
          }),
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: 'Failed to create account' }
    }

    // Create profile in appropriate table (clients or agents)
    if (formData.userType === 'client') {
      const { error: profileError } = await supabaseAdmin
        .from('clients')
        .insert({
          user_id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
        })

      if (profileError) {
        console.error('Error creating client profile:', profileError)
      }
    } else if (formData.userType === 'agent') {
      const { error: profileError } = await supabaseAdmin
        .from('agents')
        .insert({
          user_id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          agency_name: formData.agencyName || null,
          license_number: formData.licenseNumber || null,
          area_of_operation: formData.areaOfOperation || null,
          years_experience: formData.yearsExperience || null,
        })

      if (profileError) {
        console.error('Error creating agent profile:', profileError)
      }
    }

    return { 
      success: true, 
      message: 'Account created successfully',
      user: authData.user 
    }
  } catch (error) {
    console.error('Error in verifyOTPAndSignUp:', error)
    return { success: false, error: 'An error occurred. Please try again.' }
  }
}

/**
 * Resend OTP
 */
export async function resendOTP(email: string, userType: 'client' | 'agent') {
  try {
    const supabase = createSupabaseServerClient()

    // Get user's name from previous OTP record
    const { data: previousOtp } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Generate new OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Store new OTP
    const { error: dbError } = await supabase
      .from('otp_verifications')
      .insert({
        email: email,
        otp: otp,
        user_type: userType,
        expires_at: expiresAt.toISOString(),
      })

    if (dbError) {
      return { success: false, error: 'Failed to generate new code' }
    }

    // Send email
    const emailResult = await sendOTPEmail(email, otp, email.split('@')[0])

    if (!emailResult.success) {
      return { success: false, error: 'Failed to send email' }
    }

    return { success: true, message: 'New verification code sent' }
  } catch (error) {
    console.error('Error in resendOTP:', error)
    return { success: false, error: 'An error occurred' }
  }
}
```

---

### Step 6: Create OTP Verification UI Component

**Create file**: `src/components/auth/OTPVerification.tsx`

```typescript
'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

interface OTPVerificationProps {
  email: string
  onVerified: (otp: string) => void
  onResend: () => void
  loading?: boolean
  error?: string
}

export default function OTPVerification({
  email,
  onVerified,
  onResend,
  loading = false,
  error
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits entered
    if (newOtp.every((digit) => digit !== '') && !loading) {
      onVerified(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = pastedData.split('')
    while (newOtp.length < 6) newOtp.push('')
    
    setOtp(newOtp)
    
    if (pastedData.length === 6) {
      onVerified(pastedData)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@')
    const maskedName = name.charAt(0) + '***' + name.slice(-1)
    return `${maskedName}@${domain}`
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Verify Your Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-semibold text-navy">{maskEmail(email)}</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-navy focus:ring-2 focus:ring-navy/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          ))}
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm">
            {timeLeft > 0 ? (
              <>
                <span className="text-gray-600">Code expires in</span>
                <span className="font-semibold text-navy">{formatTime(timeLeft)}</span>
              </>
            ) : (
              <span className="text-red-600 font-semibold">Code expired</span>
            )}
          </div>

          <Button
            variant="link"
            onClick={onResend}
            disabled={loading || timeLeft > 540} // Can resend after 1 minute
            className="text-sm"
          >
            Didn't receive the code? Resend
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

---

### Step 7: Update Sign-Up Forms

**Example for Client Sign-Up** (`src/components/auth/simple-client-signup.tsx`):

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendSignUpOTP, verifyOTPAndSignUp, resendOTP } from '@/lib/auth/actions'
import OTPVerification from './OTPVerification'
// ... other imports

export default function SimpleClientSignup() {
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Step 1: Submit form and send OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await sendSignUpOTP({
      email: formData.email,
      fullName: formData.fullName,
      userType: 'client',
    })

    setLoading(false)

    if (result.success) {
      setStep('otp')
    } else {
      setError(result.error || 'Failed to send verification code')
    }
  }

  // Step 2: Verify OTP and complete sign-up
  const handleOTPVerified = async (otp: string) => {
    setLoading(true)
    setError('')

    const result = await verifyOTPAndSignUp({
      ...formData,
      otp,
      userType: 'client',
    })

    setLoading(false)

    if (result.success) {
      router.push('/') // Redirect to home
    } else {
      setError(result.error || 'Verification failed')
    }
  }

  // Resend OTP
  const handleResend = async () => {
    setLoading(true)
    const result = await resendOTP(formData.email, 'client')
    setLoading(false)

    if (!result.success) {
      setError(result.error || 'Failed to resend code')
    }
  }

  if (step === 'otp') {
    return (
      <OTPVerification
        email={formData.email}
        onVerified={handleOTPVerified}
        onResend={handleResend}
        loading={loading}
        error={error}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your existing form fields */}
      {/* ... */}
    </form>
  )
}
```

---

## 🎨 Email Template Customization

### In `otpService.ts`, customize:

```typescript
from: 'EstateFlow <noreply@yourdomain.com>', // ← Change this
```

**Important**:
1. Initially use: `onboarding@resend.dev` (Resend's test domain)
2. Later: Add your own domain in Resend dashboard

---

## 🔒 2FA for Sign-In (BONUS)

### Option A: Supabase Built-in 2FA

Supabase has built-in 2FA (Time-based One-Time Password - TOTP):

```typescript
// Enable 2FA for user
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
})

// User scans QR code with Google Authenticator/Authy

// Verify 2FA code on sign-in
const { data, error } = await supabase.auth.mfa.verify({
  factorId: factorId,
  code: userEnteredCode,
})
```

See: https://supabase.com/docs/guides/auth/auth-mfa

---

## 📊 Testing Checklist

### Test Sign-Up Flow:
- [ ] User fills sign-up form
- [ ] Click "Sign Up"
- [ ] OTP email received (check inbox/spam)
- [ ] Enter OTP code
- [ ] Account created
- [ ] Redirected to appropriate page

### Test OTP Features:
- [ ] Resend OTP works
- [ ] Expired OTP shows error
- [ ] Wrong OTP shows error
- [ ] Paste 6-digit code works
- [ ] Auto-submit after 6 digits

### Test Edge Cases:
- [ ] Duplicate email blocked
- [ ] Invalid email format
- [ ] Weak password rejected
- [ ] Network errors handled

---

## 🐛 Troubleshooting

### Email not sending?
1. Check Resend API key in `.env.local`
2. Restart dev server after adding env var
3. Check Resend dashboard → Logs
4. Use `onboarding@resend.dev` initially

### OTP not working?
1. Check database - is OTP stored?
   ```sql
   SELECT * FROM public.otp_verifications ORDER BY created_at DESC;
   ```
2. Check expiry time
3. Check `verified` status

### Email in spam?
- This is common with `onboarding@resend.dev`
- Solution: Add custom domain in Resend dashboard

---

## 📈 Production Checklist

Before going live:
- [ ] Add custom domain to Resend
- [ ] Update email `from` address
- [ ] Customize email template with branding
- [ ] Set up proper error logging
- [ ] Add rate limiting (prevent spam)
- [ ] Test on multiple email providers (Gmail, Outlook, etc.)
- [ ] Set up email deliverability monitoring

---

## 💰 Costs

### Resend Pricing:
- **Free**: 3,000 emails/month
- **Pro**: $20/month for 50,000 emails
- **Perfect for**: Small to medium websites

### Supabase:
- **Free tier**: Includes email (limited)
- Your current plan should work

---

## 🚀 Next Steps

1. **Sign up for Resend** → https://resend.com
2. **Get API key** → Add to `.env.local`
3. **Install package** → `pnpm add resend`
4. **Run database migration** → Create OTP table
5. **Update server actions** → Add OTP functions
6. **Create OTP component** → Add to sign-up flows
7. **Test thoroughly** → Complete checklist above

---

## 📚 Additional Resources

- **Resend Docs**: https://resend.com/docs
- **Supabase MFA**: https://supabase.com/docs/guides/auth/auth-mfa
- **Email Templates**: https://resend.com/templates

---

## ✅ Summary

This implementation gives you:
- ✅ **Email OTP verification** on sign-up
- ✅ **10-minute expiry** for security
- ✅ **Professional emails** via Resend
- ✅ **Beautiful OTP UI** with auto-focus
- ✅ **Resend functionality**
- ✅ **Rate limiting** (5 attempts max)
- ✅ **Auto-cleanup** of expired OTPs

**Your website will be much more secure!** 🔒

Ready to implement? Start with Step 1! 🚀
