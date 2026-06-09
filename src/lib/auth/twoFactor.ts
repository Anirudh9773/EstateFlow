import { SupabaseClient } from '@supabase/supabase-js'

export interface SupabaseJwtPayload {
  sid: string;       // Session ID
  amr: string[];     // Authentication Method Reference
  exp: number;
  sub: string;       // User ID
}

/**
 * Decodes the Supabase JWT access token to retrieve session claims (sid, amr, etc.)
 */
export function decodeSupabaseToken(token: string): SupabaseJwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    
    // Decode base64 using atob (Edge Runtime compatible)
    const jsonStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    
    const rawPayload = JSON.parse(jsonStr)
    
    // Normalize AMR array to be a string array
    let amr: string[] = []
    if (Array.isArray(rawPayload.amr)) {
      amr = rawPayload.amr.map((item: unknown) => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object' && 'method' in item) {
          const obj = item as { method: unknown }
          if (typeof obj.method === 'string') {
            return obj.method
          }
        }
        return ''
      }).filter(Boolean)
    }
    
    return {
      ...rawPayload,
      sid: rawPayload.sid || rawPayload.session_id,
      amr
    } as SupabaseJwtPayload
  } catch (e) {
    console.error('Error decoding Supabase token:', e)
    return null
  }
}

interface CookieStore {
  get(name: string): { value: string } | undefined;
}

/**
 * Check if the user is 2FA verified for the current session or via a trusted device cookie.
 */
export async function isUser2faVerified(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string,
  cookies: CookieStore
): Promise<boolean> {
  // 1. Check if this session ID is marked as verified in public.user_2fa_sessions
  const { data: sessionData, error: sessionError } = await supabase
    .from('user_2fa_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('session_id', sessionId)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (sessionError) {
    console.error('Error checking 2FA sessions:', sessionError)
  }

  if (sessionData) {
    return true
  }

  // 2. Check if a trusted device token exists in cookies
  const trustToken = cookies.get('remember_device_token')?.value
  if (!trustToken) {
    return false
  }

  // 3. Verify the trusted device token in the database
  const { data: deviceData, error: deviceError } = await supabase
    .from('remembered_devices')
    .select('id')
    .eq('user_id', userId)
    .eq('device_token', trustToken)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (deviceError) {
    console.error('Error checking remembered devices:', deviceError)
  }

  return !!deviceData
}
