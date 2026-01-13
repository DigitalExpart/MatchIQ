# Supabase Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the `MyMatchIQ/` directory with the following:

```env
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID=xvicydrqtddctywkvyge
VITE_SUPABASE_URL=https://xvicydrqtddctywkvyge.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aWN5ZHJxdGRkY3R5d2t2eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MTE5MTMsImV4cCI6MjA4MTk4NzkxM30.OlDfoK_IjbWXHRzhaWb3Yo3Zfo40OLvN4e4pFnwHRuA

# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_ENV=local

# Feature Flags
VITE_FEATURE_AI_COACH=true
VITE_FEATURE_AI_INSIGHTS=true
VITE_FEATURE_RATE_LIMITING=true
VITE_FEATURE_ANALYTICS=true
```

## Installation

Install the Supabase client library:

```bash
cd MyMatchIQ
npm install @supabase/supabase-js
```

## Usage

The Supabase client is already configured in `src/utils/supabaseClient.ts`. You can import and use it anywhere:

```typescript
import { supabase } from '@/utils/supabaseClient';

// Example usage
const { data, error } = await supabase
  .from('users')
  .select('*');
```

## Note

The Supabase client has default values configured, so it will work even without the `.env` file. However, it's recommended to use environment variables for different environments (local, staging, production).

