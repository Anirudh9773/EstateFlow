-- ============================================
-- QUICK FIX: DISABLE RLS COMPLETELY (FOR TESTING ONLY)
-- ============================================
-- This is a temporary solution to test if RLS is causing the issue
-- Run this in Supabase Dashboard → SQL Editor

-- Disable RLS on both tables
ALTER TABLE public.agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('agents', 'clients');

-- Expected output: rls_enabled should be 'false' for both tables

SELECT '✅ RLS disabled. Try signing up as an agent now.' as status;
SELECT '⚠️ WARNING: This is for testing only. Re-enable RLS before production!' as warning;
