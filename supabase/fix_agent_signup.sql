-- ============================================
-- FIX AGENT SIGN-UP PERMISSION DENIED ERROR
-- ============================================
-- Run this entire script in Supabase Dashboard → SQL Editor
-- This will fix the "permission denied for table agents" error

-- Step 1: Check current state of tables and policies
SELECT 'Checking if tables exist...' as status;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('clients', 'agents');

SELECT 'Checking current RLS policies...' as status;
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('clients', 'agents')
ORDER BY tablename, cmd;

-- Step 2: Temporarily disable RLS to test if that's the issue
SELECT 'Disabling RLS temporarily...' as status;
ALTER TABLE public.agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;

-- Step 3: Drop all existing policies
SELECT 'Dropping existing policies...' as status;
DROP POLICY IF EXISTS "Users can view own agent profile" ON public.agents;
DROP POLICY IF EXISTS "Users can update own agent profile" ON public.agents;
DROP POLICY IF EXISTS "Users can insert own agent profile" ON public.agents;
DROP POLICY IF EXISTS "Public can view all agent profiles" ON public.agents;

DROP POLICY IF EXISTS "Users can view own client profile" ON public.clients;
DROP POLICY IF EXISTS "Users can update own client profile" ON public.clients;
DROP POLICY IF EXISTS "Users can insert own client profile" ON public.clients;

-- Step 4: Re-enable RLS
SELECT 'Re-enabling RLS...' as status;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Step 5: Create new policies with correct permissions
SELECT 'Creating new RLS policies...' as status;

-- AGENTS TABLE POLICIES
CREATE POLICY "Users can view own agent profile"
  ON public.agents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own agent profile"
  ON public.agents
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own agent profile"
  ON public.agents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view all agent profiles"
  ON public.agents
  FOR SELECT
  USING (true);

-- CLIENTS TABLE POLICIES
CREATE POLICY "Users can view own client profile"
  ON public.clients
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own client profile"
  ON public.clients
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own client profile"
  ON public.clients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Step 6: Verify policies were created
SELECT 'Verifying new policies...' as status;
SELECT tablename, policyname, cmd
FROM pg_policies 
WHERE tablename IN ('clients', 'agents')
ORDER BY tablename, cmd;

-- Step 7: Grant necessary permissions to authenticated users
SELECT 'Granting permissions...' as status;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.agents TO authenticated;
GRANT ALL ON public.clients TO authenticated;

-- Step 8: Check if service_role has full access (it should by default)
SELECT 'Checking service_role permissions...' as status;
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name IN ('agents', 'clients')
  AND grantee = 'service_role';

SELECT '✅ Script completed! Try signing up as an agent now.' as status;
