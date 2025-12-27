# Quick Setup Guide

## 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## 2. Set Up Supabase Database

1. Go to your Supabase project: https://supabase.com/dashboard/project/xvicydrqtddctywkvyge
2. Click on **SQL Editor** in the left sidebar
3. Open the file `migrations/001_create_tables.sql`
4. Copy the entire SQL script
5. Paste it into the Supabase SQL Editor
6. Click **Run** to execute
7. Verify tables were created in **Table Editor**

## 3. Configure Environment

Create a `.env` file in the `backend/` directory:

```env
SUPABASE_PROJECT_ID=xvicydrqtddctywkvyge
SUPABASE_URL=https://xvicydrqtddctywkvyge.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aWN5ZHJxdGRkY3R5d2t2eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MTE5MTMsImV4cCI6MjA4MTk4NzkxM30.OlDfoK_IjbWXHRzhaWb3Yo3Zfo40OLvN4e4pFnwHRuA

# Get your database password from Supabase Dashboard > Settings > Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xvicydrqtddctywkvyge.supabase.co:5432/postgres

AI_VERSION=1.0.0
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
SECRET_KEY=your-secret-key-here
ENVIRONMENT=development
DEBUG=True
```

**To get your database password:**
1. Go to Supabase Dashboard > Settings > Database
2. Find "Connection string" section
3. Copy the password from the connection string

## 4. Run the Server

```bash
# From the backend directory
python -m app.main

# Or
uvicorn app.main:app --reload
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 5. Test the API

Open http://localhost:8000/docs in your browser to see the interactive API documentation and test endpoints.

## Next Steps

- Set up authentication (JWT tokens)
- Configure Row Level Security policies in Supabase
- Deploy to Railway, Render, or Fly.io
- Connect frontend to backend API

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check that tables were created in Supabase
- Ensure your IP is allowed in Supabase network settings

### Import Errors
- Make sure you're running from the `backend/` directory
- Verify all dependencies are installed: `pip install -r requirements.txt`

### CORS Issues
- Add your frontend URL to `CORS_ORIGINS` in `.env`
- Restart the server after changing environment variables

