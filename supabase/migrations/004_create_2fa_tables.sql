-- Create user_2fa_otps table
CREATE TABLE IF NOT EXISTS public.user_2fa_otps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  otp_hash TEXT NOT NULL,
  attempts INTEGER DEFAULT 0 NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for user_2fa_otps
CREATE INDEX IF NOT EXISTS idx_user_2fa_otps_user ON public.user_2fa_otps(user_id);

-- Create user_2fa_sessions table
CREATE TABLE IF NOT EXISTS public.user_2fa_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL,
  verified_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for user_2fa_sessions
CREATE INDEX IF NOT EXISTS idx_user_2fa_sessions_lookup ON public.user_2fa_sessions(user_id, session_id);

-- Create remembered_devices table
CREATE TABLE IF NOT EXISTS public.remembered_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for remembered_devices
CREATE INDEX IF NOT EXISTS idx_remembered_devices_lookup ON public.remembered_devices(user_id, device_token);

-- Enable Row Level Security (RLS) on these tables
ALTER TABLE public.user_2fa_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_2fa_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remembered_devices ENABLE ROW LEVEL SECURITY;

-- Add RLS policies (since operations are performed via server client/admin role, we ensure the service role has access or users have restricted access)
-- Allow users to delete their own OTPs, sessions, or devices if authenticated
CREATE POLICY "Users can manage their own OTP records"
  ON public.user_2fa_otps
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own 2FA sessions"
  ON public.user_2fa_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own trusted devices"
  ON public.remembered_devices
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant privileges to standard Supabase roles
GRANT ALL ON TABLE public.user_2fa_otps TO postgres, service_role, authenticated;
GRANT ALL ON TABLE public.user_2fa_sessions TO postgres, service_role, authenticated;
GRANT ALL ON TABLE public.remembered_devices TO postgres, service_role, authenticated;

