# Database Setup for Authentication

This guide will help you set up the authentication system in your Supabase database.

## Step 1: Run the New Migration

You need to add the `password_hash` column to the users table.

1. Go to your Supabase project: https://supabase.com/dashboard/project/xvicydrqtddctywkvyge
2. Click on **SQL Editor** in the left sidebar
3. Open the file `backend/migrations/002_add_password_hash.sql`
4. Copy the SQL script below and paste it into the Supabase SQL Editor:

```sql
-- Add password_hash column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Add index for email lookups (if not already exists)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Add index for user authentication lookups
CREATE INDEX IF NOT EXISTS idx_users_email_active ON users(email, is_active);
```

5. Click **Run** to execute the migration

## Step 2: Verify the Migration

After running the migration, verify the changes:

1. Go to **Table Editor** in the left sidebar
2. Select the `users` table
3. You should see a new column called `password_hash` with type `VARCHAR(255)`

## Step 3: Update Render Environment (if needed)

The backend has been updated with new authentication endpoints:

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/signin` - User login
- `GET /api/v1/auth/user/{user_id}` - Get user profile

The changes have already been pushed to the backend branch, and Render should automatically deploy them.

## Step 4: Test the Authentication

Once the backend is deployed and the database migration is complete:

1. Go to your frontend: https://match-iq.vercel.app
2. Click "Sign Up" on the onboarding screen
3. Fill in your details and create an account
4. The account will be created in Supabase and you'll be logged in automatically

## How It Works

### Frontend (SignUpScreen.tsx)
- User fills out the sign-up form
- Form data is sent to `/api/v1/auth/signup` endpoint
- If successful, user is logged in and redirected to dashboard

### Backend (auth.py)
- Receives sign-up request
- Hashes the password using SHA-256
- Stores user data in Supabase `users` table
- Returns user profile data

### Authentication Service (authService.ts)
- Handles all authentication API calls
- Stores user session in localStorage
- Provides methods for sign-in, sign-out, and user management

## Security Notes

⚠️ **For Production:**
- The current implementation uses SHA-256 for password hashing
- Consider upgrading to bcrypt or argon2 for better security
- Implement JWT tokens for stateless authentication
- Add email verification
- Add password reset functionality
- Set up Row Level Security (RLS) policies in Supabase

## Troubleshooting

### "Email already registered" error
- This means the email is already in the database
- Try signing in instead, or use a different email

### "Failed to connect to server" error
- Check that the Render backend is running: https://macthiq-ai-backend.onrender.com/health
- Verify the `VITE_API_BASE_URL` in Vercel environment variables

### Database migration fails
- Make sure you're in the correct Supabase project
- Check that the `users` table exists from migration `001_create_tables.sql`
- If the column already exists, the migration will skip it (using `IF NOT EXISTS`)

## Next Steps

After setting up authentication:

1. ✅ Users can create accounts
2. ✅ Users can sign in
3. ✅ User data is stored in Supabase
4. 🔜 Add email verification
5. 🔜 Add password reset
6. 🔜 Add JWT tokens
7. 🔜 Set up Row Level Security policies

