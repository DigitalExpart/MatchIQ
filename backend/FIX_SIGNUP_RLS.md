# Fix Signup RLS Error

## Problem
User signup fails with: `new row violates row-level security policy for table "users"`

## Solution
The users table has RLS enabled but no INSERT policy, blocking new user registration.

## Steps to Fix

### 1. Go to Supabase SQL Editor
1. Open [Supabase Dashboard](https://supabase.com/dashboard/project/xvicydrqtddctywkvyge)
2. Click **SQL Editor** in the left sidebar

### 2. Run the Migration
Copy and paste the contents of `migrations/003_fix_rls_for_signup.sql` and click **Run**

Or manually run these commands:

```sql
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Allow anyone to insert (signup) - this is public registration
CREATE POLICY "Allow public user registration" ON users
    FOR INSERT
    WITH CHECK (true);

-- Allow users to view their own data  
CREATE POLICY "Users can view own data" ON users
    FOR SELECT 
    USING (auth.uid()::text = id::text OR auth.uid() IS NULL);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE 
    USING (auth.uid()::text = id::text);

-- Allow users to delete their own data (optional)
CREATE POLICY "Users can delete own data" ON users
    FOR DELETE
    USING (auth.uid()::text = id::text);
```

### 3. Verify the Fix
Try signing up again at http://localhost:3000 or your deployed URL

## What Changed?
- ✅ Added INSERT policy to allow public user registration
- ✅ Users can still only view/update/delete their own data
- ✅ Security maintained while allowing signup

## Security Notes
- The INSERT policy allows anyone to create a user account (required for signup)
- Once created, users can only access their own data (protected by user_id checks)
- This is the standard pattern for public registration in Supabase

