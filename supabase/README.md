# Supabase Scripts & Documentation

This folder contains SQL scripts and documentation for setting up and troubleshooting the Supabase database.

---

## 📁 Files in This Folder

### SQL Scripts

1. **fix_agent_signup.sql** ⭐ MAIN FIX SCRIPT
   - Complete solution for "permission denied" errors
   - Fixes RLS policies for agent and client sign-up
   - Run this script to fix agent sign-up issues
   - Safe to run multiple times

2. **quick_fix_disable_rls.sql** 🧪 TESTING ONLY
   - Temporarily disables RLS for testing
   - Use this to verify if RLS is causing the issue
   - ⚠️ DO NOT use in production
   - Re-enable RLS after testing

---

## 🚀 Quick Start

### Problem: "Permission denied for table agents"

**Solution (3 steps):**

1. Open Supabase Dashboard → SQL Editor
2. Copy and run `fix_agent_signup.sql`
3. Restart dev server and test

**Detailed guides:**
- See `../FIX_SUMMARY.md` for quick overview
- See `../VISUAL_FIX_GUIDE.md` for step-by-step with screenshots
- See `../AGENT_SIGNUP_FIX_GUIDE.md` for complete troubleshooting

---

## 📋 What Each Script Does

### fix_agent_signup.sql

**Purpose**: Fix RLS policies to allow profile creation

**What it does:**
1. ✅ Checks if tables exist
2. ✅ Temporarily disables RLS
3. ✅ Drops all existing policies (clean slate)
4. ✅ Re-enables RLS
5. ✅ Creates new policies with correct permissions
6. ✅ Grants permissions to authenticated users
7. ✅ Verifies service_role has full access
8. ✅ Confirms everything is set up correctly

**When to use:**
- Getting "permission denied" errors when signing up
- Agent or client profiles not being created
- After fresh database setup
- When RLS policies are misconfigured

**How to use:**
```sql
-- Copy the entire file and run in Supabase SQL Editor
-- No parameters needed
-- Safe to run multiple times
```

**Expected output:**
```
status: "Checking if tables exist..."
table_name: "clients"
table_name: "agents"
...
status: "✅ Script completed! Try signing up as an agent now."
```

---

### quick_fix_disable_rls.sql

**Purpose**: Temporarily disable RLS for testing

**What it does:**
1. Disables RLS on agents table
2. Disables RLS on clients table
3. Verifies RLS is disabled

**When to use:**
- Testing if RLS is causing the issue
- Quick verification before running full fix
- Debugging permission problems

**How to use:**
```sql
-- Copy and run in Supabase SQL Editor
-- Test sign-up immediately after
-- If it works, RLS was the issue
-- Then run fix_agent_signup.sql to properly secure it
```

**⚠️ WARNING:**
- This is for TESTING ONLY
- DO NOT use in production
- Re-enable RLS after testing
- Run fix_agent_signup.sql to properly secure your database

---

## 🔍 Verification Queries

After running the fix script, verify it worked:

### Check if policies exist
```sql
SELECT tablename, policyname, cmd
FROM pg_policies 
WHERE tablename IN ('clients', 'agents')
ORDER BY tablename, cmd;
```

Expected: 3-4 policies for each table (INSERT, SELECT, UPDATE)

### Check if RLS is enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('agents', 'clients');
```

Expected: `rowsecurity` = true for both tables

### Check permissions
```sql
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants 
WHERE table_name IN ('agents', 'clients')
  AND grantee IN ('authenticated', 'service_role')
ORDER BY table_name, grantee;
```

Expected: Both `authenticated` and `service_role` have permissions

---

## 🧪 Testing

After running the fix:

### Test Agent Sign-Up
1. Go to http://localhost:3000/sign-up/agent
2. Fill in the form
3. Submit
4. Should work without errors
5. Check `agents` table in Supabase

### Test Client Sign-Up
1. Go to http://localhost:3000/sign-up/client
2. Fill in the form
3. Submit
4. Should work without errors
5. Check `clients` table in Supabase

---

## 📚 Related Documentation

### In Root Directory:
- `FIX_SUMMARY.md` - Quick 3-step fix guide
- `VISUAL_FIX_GUIDE.md` - Step-by-step with visual aids
- `AGENT_SIGNUP_FIX_GUIDE.md` - Complete troubleshooting guide
- `SUPABASE_NAVIGATION_GUIDE.md` - How to navigate Supabase Dashboard
- `CHECKLIST.md` - Step-by-step checklist
- `AGENTS.md` - Complete project documentation (see "Permission Denied" section)

---

## ❓ FAQ

### Q: Which script should I run?
**A:** Run `fix_agent_signup.sql` - it's the complete solution.

### Q: Can I run the script multiple times?
**A:** Yes, it's safe to run multiple times. It drops and recreates policies.

### Q: What if the script fails?
**A:** Check the error message. Common issues:
- Syntax error: Make sure you copied the entire script
- Permission error: You need admin access to the database
- Connection error: Check your internet connection

### Q: Should I disable RLS in production?
**A:** NO! Never disable RLS in production. Use `fix_agent_signup.sql` to properly configure it.

### Q: How do I know if it worked?
**A:** Run the verification queries above. You should see policies for both tables.

### Q: What if I still get errors?
**A:** See `../AGENT_SIGNUP_FIX_GUIDE.md` for detailed troubleshooting steps.

---

## 🔧 Maintenance

### Regular Checks
- Verify RLS is enabled: Run verification queries
- Check policies exist: Run policy verification query
- Test sign-up flows: Both agent and client

### After Database Changes
- If you drop/recreate tables, run `fix_agent_signup.sql` again
- If you modify RLS policies, verify they work correctly
- Always test sign-up after database changes

---

## 🆘 Need Help?

1. **Quick fix**: See `../FIX_SUMMARY.md`
2. **Visual guide**: See `../VISUAL_FIX_GUIDE.md`
3. **Detailed help**: See `../AGENT_SIGNUP_FIX_GUIDE.md`
4. **Navigation help**: See `../SUPABASE_NAVIGATION_GUIDE.md`
5. **Checklist**: See `../CHECKLIST.md`

---

## 📝 Notes

- All scripts are idempotent (safe to run multiple times)
- Scripts include status messages for debugging
- Verification queries included in each script
- Scripts follow PostgreSQL best practices
- RLS policies follow principle of least privilege

---

**Last Updated**: Current session
**Maintainer**: EstateFlow Development Team
**Status**: Production Ready ✅
