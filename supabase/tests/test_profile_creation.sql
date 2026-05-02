-- Test Script: Profile Creation Trigger
-- Description: Tests automatic profile creation for clients and agents
-- Usage: Execute in Supabase SQL Editor to verify trigger functionality

-- ============================================================================
-- SETUP: Clean up any existing test data
-- ============================================================================

-- Delete test users (this will cascade to profile tables)
DELETE FROM auth.users WHERE email IN (
  'test-client-trigger@example.com',
  'test-agent-trigger@example.com'
);

-- ============================================================================
-- TEST 1: Verify Tables Exist
-- ============================================================================

SELECT 
  'TEST 1: Verify Tables Exist' as test_name,
  table_name,
  CASE 
    WHEN table_name IN ('clients', 'agents') THEN 'PASS'
    ELSE 'FAIL'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('clients', 'agents')
ORDER BY table_name;

-- ============================================================================
-- TEST 2: Verify Trigger Function Exists
-- ============================================================================

SELECT 
  'TEST 2: Verify Trigger Function Exists' as test_name,
  routine_name,
  routine_type,
  CASE 
    WHEN routine_name = 'handle_new_user' AND routine_type = 'FUNCTION' THEN 'PASS'
    ELSE 'FAIL'
  END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'handle_new_user';

-- ============================================================================
-- TEST 3: Verify Trigger Exists
-- ============================================================================

SELECT 
  'TEST 3: Verify Trigger Exists' as test_name,
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  CASE 
    WHEN trigger_name = 'on_auth_user_created' 
      AND event_object_table = 'users'
      AND action_timing = 'AFTER'
      AND event_manipulation = 'INSERT' THEN 'PASS'
    ELSE 'FAIL'
  END as status
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- ============================================================================
-- TEST 4: Verify Foreign Key Constraints
-- ============================================================================

SELECT 
  'TEST 4: Verify Foreign Key Constraints' as test_name,
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  CASE 
    WHEN tc.constraint_type = 'FOREIGN KEY' THEN 'PASS'
    ELSE 'FAIL'
  END as status
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public'
  AND tc.table_name IN ('clients', 'agents')
  AND tc.constraint_type = 'FOREIGN KEY';

-- ============================================================================
-- TEST 5: Verify Unique Constraints
-- ============================================================================

SELECT 
  'TEST 5: Verify Unique Constraints' as test_name,
  tc.table_name,
  tc.constraint_name,
  CASE 
    WHEN tc.constraint_name LIKE '%user_id_unique%' THEN 'PASS'
    ELSE 'FAIL'
  END as status
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public'
  AND tc.table_name IN ('clients', 'agents')
  AND tc.constraint_type = 'UNIQUE';

-- ============================================================================
-- TEST 6: Test Client Profile Creation
-- ============================================================================

-- Insert test client user
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Generate a new UUID for the test user
  test_user_id := gen_random_uuid();
  
  -- Insert test user with client metadata
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    test_user_id,
    'authenticated',
    'authenticated',
    'test-client-trigger@example.com',
    crypt('testpassword123', gen_salt('bf')),
    NOW(),
    jsonb_build_object(
      'user_type', 'client',
      'full_name', 'Test Client User',
      'phone', '1234567890'
    ),
    NOW(),
    NOW(),
    '',
    ''
  );
  
  RAISE NOTICE 'Created test client user with ID: %', test_user_id;
END $$;

-- Verify client profile was created
SELECT 
  'TEST 6: Test Client Profile Creation' as test_name,
  c.id,
  c.user_id,
  c.full_name,
  c.email,
  c.phone,
  CASE 
    WHEN c.full_name = 'Test Client User' 
      AND c.email = 'test-client-trigger@example.com'
      AND c.phone = '1234567890' THEN 'PASS'
    ELSE 'FAIL'
  END as status
FROM public.clients c
WHERE c.email = 'test-client-trigger@example.com';

-- ============================================================================
-- TEST 7: Test Agent Profile Creation
-- ============================================================================

-- Insert test agent user
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Generate a new UUID for the test user
  test_user_id := gen_random_uuid();
  
  -- Insert test user with agent metadata
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    test_user_id,
    'authenticated',
    'authenticated',
    'test-agent-trigger@example.com',
    crypt('testpassword123', gen_salt('bf')),
    NOW(),
    jsonb_build_object(
      'user_type', 'agent',
      'full_name', 'Test Agent User',
      'phone', '0987654321',
      'agency_name', 'Test Real Estate Agency',
      'license_number', 'LIC-TEST-12345',
      'area_of_operation', 'North Zone',
      'years_experience', '5-10 years'
    ),
    NOW(),
    NOW(),
    '',
    ''
  );
  
  RAISE NOTICE 'Created test agent user with ID: %', test_user_id;
END $$;

-- Verify agent profile was created with all fields
SELECT 
  'TEST 7: Test Agent Profile Creation' as test_name,
  a.id,
  a.user_id,
  a.full_name,
  a.email,
  a.phone,
  a.agency_name,
  a.license_number,
  a.area_of_operation,
  a.years_experience,
  CASE 
    WHEN a.full_name = 'Test Agent User' 
      AND a.email = 'test-agent-trigger@example.com'
      AND a.phone = '0987654321'
      AND a.agency_name = 'Test Real Estate Agency'
      AND a.license_number = 'LIC-TEST-12345'
      AND a.area_of_operation = 'North Zone'
      AND a.years_experience = '5-10 years' THEN 'PASS'
    ELSE 'FAIL'
  END as status
FROM public.agents a
WHERE a.email = 'test-agent-trigger@example.com';

-- ============================================================================
-- TEST 8: Test Cascade Delete
-- ============================================================================

-- Delete test users and verify profiles are also deleted
DELETE FROM auth.users WHERE email IN (
  'test-client-trigger@example.com',
  'test-agent-trigger@example.com'
);

-- Verify profiles were deleted
SELECT 
  'TEST 8: Test Cascade Delete (Clients)' as test_name,
  COUNT(*) as remaining_records,
  CASE 
    WHEN COUNT(*) = 0 THEN 'PASS'
    ELSE 'FAIL'
  END as status
FROM public.clients
WHERE email = 'test-client-trigger@example.com';

SELECT 
  'TEST 8: Test Cascade Delete (Agents)' as test_name,
  COUNT(*) as remaining_records,
  CASE 
    WHEN COUNT(*) = 0 THEN 'PASS'
    ELSE 'FAIL'
  END as status
FROM public.agents
WHERE email = 'test-agent-trigger@example.com';

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT 
  '========================================' as separator,
  'TEST SUMMARY' as title,
  '========================================' as separator2;

SELECT 
  'All tests completed. Review results above.' as message,
  'Check for PASS/FAIL status in each test.' as instruction;
