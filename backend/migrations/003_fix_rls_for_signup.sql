-- Fix RLS policies to allow user signup
-- Run this in your Supabase SQL Editor

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

