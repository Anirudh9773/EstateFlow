-- Migration: Create Profile Tables and Automatic Profile Creation Trigger
-- Description: Creates clients and agents tables with automatic profile creation via database trigger
-- Date: 2024

-- ============================================================================
-- CLIENTS TABLE
-- ============================================================================
-- Table for storing client (property owner/seeker) profiles
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT clients_user_id_unique UNIQUE (user_id)
);

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);

-- Add comment for documentation
COMMENT ON TABLE public.clients IS 'Stores profile information for client users (property owners/seekers)';

-- ============================================================================
-- AGENTS TABLE
-- ============================================================================
-- Table for storing agent (real estate professional) profiles
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  agency_name TEXT,
  license_number TEXT,
  area_of_operation TEXT,
  years_experience TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT agents_user_id_unique UNIQUE (user_id)
);

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON public.agents(user_id);

-- Add comment for documentation
COMMENT ON TABLE public.agents IS 'Stores profile information for agent users (real estate professionals)';

-- ============================================================================
-- TRIGGER FUNCTION: handle_new_user()
-- ============================================================================
-- Automatically creates profile records in clients or agents table based on user_type
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

-- Add comment for documentation
COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function that automatically creates profile records in clients or agents table based on user_metadata.user_type';

-- ============================================================================
-- TRIGGER: on_auth_user_created
-- ============================================================================
-- Trigger that fires after INSERT on auth.users to create profile records
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add comment for documentation
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Automatically creates profile records after new user registration';

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
-- Grant necessary permissions for authenticated users to access their profiles
-- Note: RLS policies will be added in a separate migration

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant select/update on clients table (insert handled by trigger)
GRANT SELECT, UPDATE ON public.clients TO authenticated;

-- Grant select/update on agents table (insert handled by trigger)
GRANT SELECT, UPDATE ON public.agents TO authenticated;

-- ============================================================================
-- VERIFICATION QUERIES (for testing)
-- ============================================================================
-- Uncomment these queries to verify the setup:

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('clients', 'agents');

-- Check if trigger exists
-- SELECT trigger_name, event_manipulation, event_object_table FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists
-- SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name = 'handle_new_user';
