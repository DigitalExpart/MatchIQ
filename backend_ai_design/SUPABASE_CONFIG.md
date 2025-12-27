# Supabase Configuration

## Project Details

- **Project ID**: `xvicydrqtddctywkvyge`
- **Project URL**: `https://xvicydrqtddctywkvyge.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aWN5ZHJxdGRkY3R5d2t2eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MTE5MTMsImV4cCI6MjA4MTk4NzkxM30.OlDfoK_IjbWXHRzhaWb3Yo3Zfo40OLvN4e4pFnwHRuA`

## Frontend Configuration

### Environment Variables

Add these to your `.env` file in `MyMatchIQ/`:

```env
VITE_SUPABASE_PROJECT_ID=xvicydrqtddctywkvyge
VITE_SUPABASE_URL=https://xvicydrqtddctywkvyge.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aWN5ZHJxdGRkY3R5d2t2eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MTE5MTMsImV4cCI6MjA4MTk4NzkxM30.OlDfoK_IjbWXHRzhaWb3Yo3Zfo40OLvN4e4pFnwHRuA
```

### Usage

Import the Supabase client in your components:

```typescript
import { supabase } from '@/utils/supabaseClient';

// Example: Query data
const { data, error } = await supabase
  .from('users')
  .select('*');

// Example: Insert data
const { data, error } = await supabase
  .from('users')
  .insert([{ email: 'user@example.com' }]);

// Example: Authentication
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});
```

## Backend Configuration

### Environment Variables

For the FastAPI backend, add these to your `.env` file:

```env
SUPABASE_PROJECT_ID=xvicydrqtddctywkvyge
SUPABASE_URL=https://xvicydrqtddctywkvyge.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aWN5ZHJxdGRkY3R5d2t2eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MTE5MTMsImV4cCI6MjA4MTk4NzkxM30.OlDfoK_IjbWXHRzhaWb3Yo3Zfo40OLvN4e4pFnwHRuA

# Database connection string (from Supabase dashboard)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xvicydrqtddctywkvyge.supabase.co:5432/postgres
```

### Python Backend Setup

Install the Supabase Python client:

```bash
pip install supabase
```

Create a Supabase client in your backend:

```python
from supabase import create_client, Client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
```

## Security Notes

⚠️ **Important**: 
- The anon key is safe to use in frontend code (it's public)
- Never commit your service role key to version control
- Use Row Level Security (RLS) policies in Supabase to protect your data
- The anon key has limited permissions based on your RLS policies

## Database Connection

To get your database connection string:
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Copy the connection string under **Connection string** → **URI**
4. Replace `[YOUR-PASSWORD]` with your database password

## Next Steps

1. Set up database tables according to `DATA_MODELS.md`
2. Configure Row Level Security (RLS) policies
3. Set up authentication if needed
4. Configure storage buckets if using file uploads

