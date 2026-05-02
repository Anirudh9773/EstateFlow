-- Migration: Enable Row Level Security Policies
-- Description: Sets up RLS policies for clients and agents tables to protect user data
-- Date: 2024

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on clients table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Enable RLS on agents table
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CLIENTS TABLE POLICIES
-- ============================================================================

-- Policy: Users can view their own client profile
CREATE POLICY "Users can view own client profile"
  ON public.clients
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own client profile
CREATE POLICY "Users can insert own client profile"
  ON public.clients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own client profile
CREATE POLICY "Users can update own client profile"
  ON public.clients
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- AGENTS TABLE POLICIES
-- ============================================================================

-- Policy: Users can view their own agent profile
CREATE POLICY "Users can view own agent profile"
  ON public.agents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own agent profile
CREATE POLICY "Users can insert own agent profile"
  ON public.agents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own agent profile
CREATE POLICY "Users can update own agent profile"
  ON public.agents
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Public can view all agent profiles (for browsing)
CREATE POLICY "Public can view all agent profiles"
  ON public.agents
  FOR SELECT
  USING (true);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON POLICY "Users can view own client profile" ON public.clients IS 
  'Allows authenticated users to view only their own client profile';

COMMENT ON POLICY "Users can update own client profile" ON public.clients IS 
  'Allows authenticated users to update only their own client profile';

COMMENT ON POLICY "Users can view own agent profile" ON public.agents IS 
  'Allows authenticated users to view their own agent profile';

COMMENT ON POLICY "Users can update own agent profile" ON public.agents IS 
  'Allows authenticated users to update their own agent profile';

COMMENT ON POLICY "Public can view all agent profiles" ON public.agents IS 
  'Allows public access to view all agent profiles for browsing functionality';

-- ============================================================================
-- VERIFICATION QUERIES (for testing)
-- ============================================================================
-- Uncomment these queries to verify the RLS setup:

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('clients', 'agents');

-- List all policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public' AND tablename IN ('clients', 'agents');
