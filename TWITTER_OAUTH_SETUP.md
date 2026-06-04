# X/Twitter OAuth 2.0 Setup Guide

> **Status**: ✅ X/Twitter OAuth is now fully configured and ready to use!

This guide documents the X/Twitter OAuth 2.0 integration for EstateFlow.

---

## 🎉 What's Already Done

### 1. Supabase Configuration ✅
- X/Twitter OAuth 2.0 is **enabled** in Supabase Dashboard
- **Client ID**: `Mk43Q2pBRzNKalNYOTR2OEFQOTc6MTpjaQ`
- **Client Secret**: Configured (hidden for security)
- **Callback URL**: `https://cdzhgwptfwwyubrdcbsa.supabase.co/auth/v1/callback`
- **Allow users without email**: Disabled (email required)

### 2. X Developer Platform Configuration ✅
Based on your screenshots, you've configured:
- **App Type**: Web App, Automated App or Bot (Confidential client)
- **Callback URL**: `https://cdzhgwptfwwyubrdcbsa.supabase.co/auth/v1/callback`
- **Website URL**: `https://estate-flow-seven.vercel.app/`
- **Permissions**: Read, Read and write, Read and write and Direct message

### 3. Code Implementation ✅
All code is already implemented and ready:

#### Authentication Actions (`src/lib/auth/actions.ts`)
```typescript
export async function signInWithOAuth(
  provider: 'google' | 'facebook' | 'twitter', 
  userType?: 'client' | 'agent'
)
```
- Supports X/Twitter OAuth
- Handles user type (client/agent) for proper redirects
- Creates profile automatically after OAuth

#### OAuth Components
- ✅ `OAuthButton.tsx` - Individual provider button with X icon
- ✅ `OAuthButtonsGroup.tsx` - Shows all OAuth providers including X
- ✅ `simple-client-signup.tsx` - Client sign-up with X OAuth
- ✅ `simple-agent-signup.tsx` - Agent sign-up with X OAuth
- ✅ `simple-client-signin.tsx` - Client sign-in with X OAuth

#### OAuth Callback Handler (`src/app/auth/callback/route.ts`)
- ✅ Exchanges OAuth code for session
- ✅ Updates user metadata with user_type
- ✅ Creates profile in appropriate table (clients/agents)
- ✅ Redirects based on user type

---

## 🚀 How It Works

### User Flow

1. **User clicks "Continue with X" button**
   - On sign-up page: User type (client/agent) is passed
   - On sign-in page: User type is detected from existing metadata

2. **Redirect to X/Twitter**
   - User authorizes EstateFlow app
   - X/Twitter redirects back with authorization code

3. **Callback Processing**
   - Code exchanged for session
   - User metadata updated with user_type
   - Profile created in database (clients or agents table)

4. **Final Redirect**
   - Agents → `/agent-dashboard`
   - Clients → `/` (homepage)

---

## 🧪 Testing X/Twitter OAuth

### Test Sign-Up (Client)
1. Navigate to `/sign-up/client`
2. Click "Sign up with X"
3. Authorize on X/Twitter
4. Should redirect to homepage
5. Verify profile created in `public.clients` table

### Test Sign-Up (Agent)
1. Navigate to `/sign-up/agent`
2. Click "Sign up with X"
3. Authorize on X/Twitter
4. Should redirect to `/agent-dashboard`
5. Verify profile created in `public.agents` table

### Test Sign-In
1. Navigate to `/sign-in`
2. Click "Continue with X"
3. Authorize on X/Twitter
4. Should redirect based on user_type:
   - Agent → `/agent-dashboard`
   - Client → `/` (homepage)

---

## 🔍 Verification Checklist

### Supabase Dashboard
- [ ] Go to Authentication → Providers
- [ ] Find "X / Twitter (OAuth 2.0)"
- [ ] Verify it shows "enabled" toggle is ON
- [ ] Verify Client ID is set
- [ ] Verify Client Secret is set (hidden)
- [ ] Verify Callback URL matches

### X Developer Portal
- [ ] Go to https://developer.x.com/en/portal/dashboard
- [ ] Find your app
- [ ] Verify OAuth 2.0 settings:
  - [ ] Callback URL: `https://cdzhgwptfwwyubrdcbsa.supabase.co/auth/v1/callback`
  - [ ] Website URL: `https://estate-flow-seven.vercel.app/`
  - [ ] App permissions are set correctly

### Code Verification
- [ ] X/Twitter button appears on sign-up pages
- [ ] X/Twitter button appears on sign-in page
- [ ] Button shows X icon (not Twitter bird)
- [ ] Button text says "Continue with X" or "Sign up with X"

---

## 🐛 Troubleshooting

### Issue: "OAuth provider not configured"
**Solution**: Verify X/Twitter is enabled in Supabase Dashboard → Authentication → Providers

### Issue: "Invalid callback URL"
**Solution**: 
1. Check X Developer Portal callback URL matches Supabase
2. Should be: `https://cdzhgwptfwwyubrdcbsa.supabase.co/auth/v1/callback`
3. No trailing slash

### Issue: "Email not returned by provider"
**Symptoms**: User can't sign up because X doesn't return email

**Solution**: 
1. In Supabase Dashboard → Authentication → Providers → X/Twitter
2. Enable "Allow users without an email"
3. OR require users to verify email in X settings

### Issue: Profile not created after OAuth
**Solution**: Check server logs for errors. Profile creation happens in `/auth/callback/route.ts`

**Verify**:
```sql
-- Check if user exists in auth
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'user@example.com';

-- Check if profile exists
SELECT * FROM public.clients WHERE user_id = 'USER_ID_HERE';
SELECT * FROM public.agents WHERE user_id = 'USER_ID_HERE';
```

### Issue: Redirect loop or wrong redirect
**Solution**: Check user_metadata.user_type is set correctly

```sql
-- Check user metadata
SELECT id, email, raw_user_meta_data->>'user_type' as user_type
FROM auth.users 
WHERE email = 'user@example.com';
```

---

## 📝 Environment Variables

All required environment variables are already set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cdzhgwptfwwyubrdcbsa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**For Production**: Update `NEXT_PUBLIC_SITE_URL` to your production domain.

---

## 🎨 UI Components

### X/Twitter Button Styling
The X button uses the new X logo (not the old Twitter bird):

```tsx
<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#000000"/>
</svg>
```

### Button Text
- Sign-up: "Sign up with X"
- Sign-in: "Continue with X"

---

## 🔐 Security Notes

1. **Client Secret**: Never expose in client-side code (already handled)
2. **Service Role Key**: Only used server-side for profile creation
3. **Callback URL**: Must match exactly in both Supabase and X Developer Portal
4. **HTTPS Required**: OAuth requires HTTPS in production (localhost OK for dev)

---

## 📚 Related Documentation

- `AGENTS.md` - Complete project guidelines
- `GOOGLE_OAUTH_SETUP.md` - Google OAuth setup (similar process)
- `OAUTH_IMPLEMENTATION_SUMMARY.md` - OAuth implementation details
- `SUPABASE_DATABASE_SETUP.md` - Database schema and profile tables

---

## ✅ Next Steps

Your X/Twitter OAuth is fully configured! Here's what you can do:

1. **Test it locally**:
   ```bash
   pnpm dev
   ```
   Navigate to `/sign-up/client` or `/sign-up/agent` and click "Sign up with X"

2. **Deploy to production**:
   - Update `NEXT_PUBLIC_SITE_URL` in `.env.local` (or Vercel environment variables)
   - Deploy to Vercel
   - Test OAuth in production

3. **Monitor usage**:
   - Check Supabase Dashboard → Authentication → Users
   - Verify profiles are created correctly
   - Monitor for any OAuth errors

---

**Last Updated**: January 2025  
**Status**: ✅ Fully Configured and Ready to Use  
**Maintainer**: EstateFlow Development Team

---

*X/Twitter OAuth 2.0 is now fully integrated into EstateFlow. Users can sign up and sign in using their X/Twitter accounts!*
