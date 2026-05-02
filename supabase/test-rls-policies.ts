/**
 * RLS Policy Testing Script
 * 
 * This script tests Row Level Security policies for clients and agents tables.
 * It verifies that:
 * 1. Users can only view their own client profile
 * 2. Users can only update their own client profile
 * 3. Users can only view their own agent profile
 * 4. Users can only update their own agent profile
 * 5. Public can view all agent profiles
 * 6. Users cannot access other users' profiles
 * 
 * Prerequisites:
 * - Run migrations 001 and 002 first
 * - Have at least 2 test users created (1 client, 1 agent)
 * 
 * Usage:
 * npx tsx supabase/test-rls-policies.ts
 */

import { createClient } from '@supabase/supabase-js'

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

// Create admin client (bypasses RLS)
const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

interface TestUser {
  id: string
  email: string
  password: string
  userType: 'client' | 'agent'
}

interface TestResult {
  test: string
  passed: boolean
  message: string
}

const results: TestResult[] = []

function logResult(test: string, passed: boolean, message: string) {
  results.push({ test, passed, message })
  const icon = passed ? '✅' : '❌'
  console.log(`${icon} ${test}: ${message}`)
}

async function createTestUsers(): Promise<{ client: TestUser; agent: TestUser }> {
  console.log('\n📝 Creating test users...\n')

  const timestamp = Date.now()
  const clientEmail = `test-client-${timestamp}@example.com`
  const agentEmail = `test-agent-${timestamp}@example.com`
  const password = 'TestPassword123!'

  // Create client user
  const { data: clientData, error: clientError } = await adminClient.auth.admin.createUser({
    email: clientEmail,
    password: password,
    email_confirm: true,
    user_metadata: {
      full_name: 'Test Client',
      phone: '1234567890',
      user_type: 'client',
    },
  })

  if (clientError || !clientData.user) {
    throw new Error(`Failed to create client user: ${clientError?.message}`)
  }

  // Create agent user
  const { data: agentData, error: agentError } = await adminClient.auth.admin.createUser({
    email: agentEmail,
    password: password,
    email_confirm: true,
    user_metadata: {
      full_name: 'Test Agent',
      phone: '0987654321',
      user_type: 'agent',
      agency_name: 'Test Agency',
      license_number: 'LIC123',
      area_of_operation: 'Test Area',
      years_experience: '5-10 years',
    },
  })

  if (agentError || !agentData.user) {
    throw new Error(`Failed to create agent user: ${agentError?.message}`)
  }

  console.log(`✅ Created client user: ${clientEmail} (ID: ${clientData.user.id})`)
  console.log(`✅ Created agent user: ${agentEmail} (ID: ${agentData.user.id})`)

  // Wait for trigger to create profile records
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return {
    client: {
      id: clientData.user.id,
      email: clientEmail,
      password: password,
      userType: 'client',
    },
    agent: {
      id: agentData.user.id,
      email: agentEmail,
      password: password,
      userType: 'agent',
    },
  }
}

async function testClientRLS(clientUser: TestUser, agentUser: TestUser) {
  console.log('\n🧪 Testing Client RLS Policies...\n')

  // Create authenticated client for client user
  const clientAuthClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const { error: signInError } = await clientAuthClient.auth.signInWithPassword({
    email: clientUser.email,
    password: clientUser.password,
  })

  if (signInError) {
    throw new Error(`Failed to sign in client user: ${signInError.message}`)
  }

  // Test 1: Client can view own profile
  const { data: ownProfile, error: ownProfileError } = await clientAuthClient
    .from('clients')
    .select('*')
    .eq('user_id', clientUser.id)
    .single()

  if (ownProfile && !ownProfileError) {
    logResult(
      'Client SELECT own profile',
      true,
      `Successfully retrieved own profile (${ownProfile.full_name})`
    )
  } else {
    logResult('Client SELECT own profile', false, `Failed: ${ownProfileError?.message}`)
  }

  // Test 2: Client can update own profile
  const { error: updateError } = await clientAuthClient
    .from('clients')
    .update({ phone: '9999999999' })
    .eq('user_id', clientUser.id)

  if (!updateError) {
    logResult('Client UPDATE own profile', true, 'Successfully updated own profile')
  } else {
    logResult('Client UPDATE own profile', false, `Failed: ${updateError.message}`)
  }

  // Test 3: Client cannot view other client profiles (if agent has client profile)
  // Since agent doesn't have client profile, we'll test they can't see any other clients
  const { data: otherProfiles, error: otherError } = await clientAuthClient
    .from('clients')
    .select('*')
    .neq('user_id', clientUser.id)

  if (otherProfiles && otherProfiles.length === 0) {
    logResult('Client cannot view other profiles', true, 'No other profiles returned (correct)')
  } else if (otherError) {
    logResult('Client cannot view other profiles', true, `Access denied (correct): ${otherError.message}`)
  } else {
    logResult(
      'Client cannot view other profiles',
      false,
      `SECURITY ISSUE: Retrieved ${otherProfiles?.length} other profiles`
    )
  }

  await clientAuthClient.auth.signOut()
}

async function testAgentRLS(agentUser: TestUser, clientUser: TestUser) {
  console.log('\n🧪 Testing Agent RLS Policies...\n')

  // Create authenticated client for agent user
  const agentAuthClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const { error: signInError } = await agentAuthClient.auth.signInWithPassword({
    email: agentUser.email,
    password: agentUser.password,
  })

  if (signInError) {
    throw new Error(`Failed to sign in agent user: ${signInError.message}`)
  }

  // Test 1: Agent can view own profile
  const { data: ownProfile, error: ownProfileError } = await agentAuthClient
    .from('agents')
    .select('*')
    .eq('user_id', agentUser.id)
    .single()

  if (ownProfile && !ownProfileError) {
    logResult(
      'Agent SELECT own profile',
      true,
      `Successfully retrieved own profile (${ownProfile.full_name})`
    )
  } else {
    logResult('Agent SELECT own profile', false, `Failed: ${ownProfileError?.message}`)
  }

  // Test 2: Agent can update own profile
  const { error: updateError } = await agentAuthClient
    .from('agents')
    .update({ phone: '8888888888' })
    .eq('user_id', agentUser.id)

  if (!updateError) {
    logResult('Agent UPDATE own profile', true, 'Successfully updated own profile')
  } else {
    logResult('Agent UPDATE own profile', false, `Failed: ${updateError.message}`)
  }

  // Test 3: Agent cannot update other agent profiles
  const { error: updateOtherError } = await agentAuthClient
    .from('agents')
    .update({ phone: '7777777777' })
    .neq('user_id', agentUser.id)

  const hasError = updateOtherError !== null
  logResult('Agent cannot update other profiles', hasError, hasError ? 'Update blocked (correct)' : 'SECURITY ISSUE: Update succeeded')

  await agentAuthClient.auth.signOut()
}

async function testPublicAgentAccess() {
  console.log('\n🧪 Testing Public Agent Access...\n')

  // Create unauthenticated client
  const publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  // Test: Public can view all agent profiles
  const { data: allAgents, error: agentsError } = await publicClient.from('agents').select('*')

  if (allAgents && allAgents.length > 0 && !agentsError) {
    logResult(
      'Public can view all agent profiles',
      true,
      `Successfully retrieved ${allAgents.length} agent profile(s)`
    )
  } else if (agentsError) {
    logResult('Public can view all agent profiles', false, `Failed: ${agentsError.message}`)
  } else {
    logResult('Public can view all agent profiles', false, 'No agents found')
  }

  // Test: Public cannot view client profiles
  const { data: clients, error: clientsError } = await publicClient.from('clients').select('*')

  if ((!clients || clients.length === 0) && !clientsError) {
    logResult('Public cannot view client profiles', true, 'No client profiles returned (correct)')
  } else if (clientsError) {
    logResult('Public cannot view client profiles', true, `Access denied (correct)`)
  } else {
    logResult(
      'Public cannot view client profiles',
      false,
      `SECURITY ISSUE: Retrieved ${clients?.length} client profiles`
    )
  }
}

async function cleanupTestUsers(clientUser: TestUser, agentUser: TestUser) {
  console.log('\n🧹 Cleaning up test users...\n')

  // Delete users (CASCADE will delete profile records)
  await adminClient.auth.admin.deleteUser(clientUser.id)
  await adminClient.auth.admin.deleteUser(agentUser.id)

  console.log('✅ Test users deleted')
}

async function runTests() {
  console.log('🚀 Starting RLS Policy Tests\n')
  console.log('=' .repeat(60))

  let testUsers: { client: TestUser; agent: TestUser } | null = null

  try {
    // Create test users
    testUsers = await createTestUsers()

    // Run tests
    await testClientRLS(testUsers.client, testUsers.agent)
    await testAgentRLS(testUsers.agent, testUsers.client)
    await testPublicAgentAccess()

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('\n📊 Test Summary\n')

    const passed = results.filter((r) => r.passed).length
    const failed = results.filter((r) => !r.passed).length
    const total = results.length

    console.log(`Total Tests: ${total}`)
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)

    if (failed > 0) {
      console.log('\n❌ Failed Tests:')
      results
        .filter((r) => !r.passed)
        .forEach((r) => {
          console.log(`  - ${r.test}: ${r.message}`)
        })
    }

    console.log('\n' + '='.repeat(60))

    if (failed === 0) {
      console.log('\n🎉 All RLS policies are working correctly!')
    } else {
      console.log('\n⚠️  Some RLS policies need attention.')
      process.exit(1)
    }
  } catch (error) {
    console.error('\n❌ Test execution failed:', error)
    process.exit(1)
  } finally {
    // Cleanup
    if (testUsers) {
      await cleanupTestUsers(testUsers.client, testUsers.agent)
    }
  }
}

// Run tests
runTests()
