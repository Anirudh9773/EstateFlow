-- Migration: Create Staff Table and Update Trigger (Idempotent Version)
-- Description: Creates staff table and updates trigger function to handle admin and semi-admin roles
-- Date: 2026-06-17

-- 1. CREATE TABLE
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'semi-admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT staff_user_id_unique UNIQUE (user_id)
);

-- 2. CREATE INDEX
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON public.staff(user_id);

COMMENT ON TABLE public.staff IS 'Stores profile information for administrative and moderator staff';

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- 4. DROP EXISTING POLICIES (prevents "policy already exists" errors)
DROP POLICY IF EXISTS "Allow public select for staff" ON public.staff;
DROP POLICY IF EXISTS "Allow individual update for own staff profile" ON public.staff;
DROP POLICY IF EXISTS "Allow service role full access to staff" ON public.staff;

-- 5. CREATE POLICIES
CREATE POLICY "Allow public select for staff"
  ON public.staff
  FOR SELECT
  USING (true);

CREATE POLICY "Allow individual update for own staff profile"
  ON public.staff
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow service role full access to staff"
  ON public.staff
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. DROP TRIGGER IF ATTACHED (prevents lock or function dependency errors)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 7. CREATE OR REPLACE FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_type TEXT;
BEGIN
  -- Extract user_type from user_metadata
  user_type := NEW.raw_user_meta_data->>'user_type';
  
  -- Log for debugging
  RAISE LOG 'handle_new_user triggered for user_id: %, user_type: %', NEW.id, user_type;
  
  -- Create client profile
  IF user_type = 'client' THEN
    INSERT INTO public.clients (user_id, full_name, email, phone)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      NEW.email,
      NEW.raw_user_meta_data->>'phone'
    );
    RAISE LOG 'Created client profile for user_id: %', NEW.id;
  
  -- Create agent profile
  ELSIF user_type = 'agent' THEN
    INSERT INTO public.agents (
      user_id, 
      full_name, 
      email, 
      phone,
      agency_name,
      license_number,
      area_of_operation,
      years_experience
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      NEW.email,
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'agency_name',
      NEW.raw_user_meta_data->>'license_number',
      NEW.raw_user_meta_data->>'area_of_operation',
      NEW.raw_user_meta_data->>'years_experience'
    );
    RAISE LOG 'Created agent profile for user_id: %', NEW.id;
    
  -- Create staff profile for admin and semi-admin
  ELSIF user_type IN ('admin', 'semi-admin') THEN
    INSERT INTO public.staff (
      user_id,
      full_name,
      email,
      phone,
      role
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      NEW.email,
      NEW.raw_user_meta_data->>'phone',
      user_type
    );
    RAISE LOG 'Created staff profile for user_id: % (role: %)', NEW.id, user_type;
  
  ELSE
    RAISE LOG 'No user_type specified for user_id: %, skipping profile creation', NEW.id;
  END IF;
  
  RETURN NEW;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user for user_id: %, error: %', NEW.id, SQLERRM;
    RETURN NEW; -- Don't block auth.users creation
END;
$$;

-- 8. RECREATE TRIGGER
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 9. GRANT PERMISSIONS
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff TO service_role;
