const fs = require('fs');
const path = require('path');

// Manually parse .env.local to load environment variables without external dependencies
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found at:', envPath);
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const firstEquals = trimmed.indexOf('=');
    if (firstEquals === -1) return;
    const key = trimmed.slice(0, firstEquals).trim();
    const value = trimmed.slice(firstEquals + 1).trim();
    env[key] = value;
  });
  return env;
}

async function run() {
  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in .env.local');
    process.exit(1);
  }

  console.log(`🔍 Pinging Supabase URL: ${supabaseUrl}`);
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });

    console.log(`✅ Supabase responded with status: ${response.status}`);
    if (response.ok || response.status === 401 || response.status === 404) {
      console.log('🎉 Project is active and responding!');
    } else {
      console.warn('⚠️ Unexpected response status received.');
    }
  } catch (error) {
    console.error('❌ Failed to ping Supabase:', error.message);
    const causeStr = error.cause ? String(error.cause) : '';
    if (causeStr) {
      console.error('   Cause:', causeStr);
    }
    
    const isDnsError = 
      error.message.includes('ENOTFOUND') || 
      error.message.includes('getaddrinfo') || 
      error.message.includes('DNS') || 
      causeStr.includes('ENOTFOUND') || 
      causeStr.includes('getaddrinfo') ||
      error.message === 'fetch failed'; // Often covers DNS resolution failure in Node fetch

    if (isDnsError) {
      console.error('\n💡 DIAGNOSIS: The project URL DNS could not be resolved (fetch failed / ENOTFOUND).');
      console.error('This means the project is currently PAUSED or DELETED on the Supabase dashboard.');
      console.error('Please log in to https://supabase.com/dashboard and click "Restore" or "Resume" on your project.');
    }
  }
}

run();
