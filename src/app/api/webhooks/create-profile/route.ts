import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Create Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret to ensure request is from Supabase
    const webhookSecret = request.headers.get('x-webhook-secret')
    if (webhookSecret !== process.env.SUPABASE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await request.json()
    
    // Extract user data from webhook payload
    const { type, record } = payload
    
    // Only process insert events
    if (type !== 'INSERT') {
      return NextResponse.json({ message: 'Event type not supported' }, { status: 200 })
    }

    const userId = record.id
    const userMetadata = record.raw_user_meta_data || {}
    const userType = userMetadata.user_type
    const email = record.email

    console.log('Creating profile for user:', userId, 'type:', userType)

    // Create client profile
    if (userType === 'client') {
      const { error } = await supabaseAdmin
        .from('clients')
        .insert({
          user_id: userId,
          full_name: userMetadata.full_name || '',
          email: email,
          phone: userMetadata.phone || null
        })

      if (error) {
        console.error('Error creating client profile:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      console.log('Client profile created successfully')
      return NextResponse.json({ message: 'Client profile created' }, { status: 200 })
    }

    // Create agent profile
    if (userType === 'agent') {
      const { error } = await supabaseAdmin
        .from('agents')
        .insert({
          user_id: userId,
          full_name: userMetadata.full_name || '',
          email: email,
          phone: userMetadata.phone || null,
          agency_name: userMetadata.agency_name || null,
          license_number: userMetadata.license_number || null,
          area_of_operation: userMetadata.area_of_operation || null,
          years_experience: userMetadata.years_experience || null
        })

      if (error) {
        console.error('Error creating agent profile:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      console.log('Agent profile created successfully')
      return NextResponse.json({ message: 'Agent profile created' }, { status: 200 })
    }

    // No user_type specified
    console.log('No user_type specified, skipping profile creation')
    return NextResponse.json({ message: 'No user_type specified' }, { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
