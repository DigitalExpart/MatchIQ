-- Add password_hash column to users table
-- Run this in your Supabase SQL Editor

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Add index for email lookups (if not already exists)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Add index for user authentication lookups
CREATE INDEX IF NOT EXISTS idx_users_email_active ON users(email, is_active);

