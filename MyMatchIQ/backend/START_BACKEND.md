# How to Start the Backend Server

## Quick Start (Windows)

### Option 1: Use the Batch File (Easiest)
Double-click `start_backend.bat` in the backend folder, or run:
```powershell
cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ\backend"
.\start_backend.bat
```

### Option 2: Manual Start (PowerShell)

#### Step 1: Navigate to backend directory
```powershell
cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ\backend"
```

#### Step 2: Install Dependencies
```powershell
python -m pip install -r requirements.txt
```

This will install all required dependencies including `psycopg2-binary` for Supabase connectivity.

**Note**: If you haven't set up Supabase yet, the server will start but database features won't work. See `SUPABASE_SETUP.md` for setup instructions.

#### Step 3: Start the Server
```powershell
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## What You Should See

When the server starts successfully, you'll see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Verify It's Working

### Option 1: Test Script (PowerShell)
```powershell
.\test_server.ps1
```

### Option 2: Browser
Open your browser and go to:
- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs

You should see JSON responses or the Swagger UI.

### Option 3: Command Line (PowerShell)
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing
```

## Troubleshooting

### "Module not found" error
Install the missing module:
```powershell
python -m pip install <module-name>
```

### "Port 8000 already in use"
Either:
1. Stop the other process using port 8000
2. Use a different port: `--port 8001`

### Database connection error
- The server will start even without a database connection
- Database features (assessments, coach) require Supabase (PostgreSQL)
- For testing, you can start the server and test the `/health` endpoint
- **To set up Supabase database:**
  1. Create a Supabase project at [https://app.supabase.com](https://app.supabase.com)
  2. Go to **Settings** → **Database**
  3. Copy the **Connection string** (URI format)
  4. Create a `.env` file in the backend folder:
     ```
     DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
     ```
  5. Replace `YOUR_PASSWORD` with your actual database password
  6. See `SUPABASE_SETUP.md` for detailed instructions

### "psycopg2-binary" installation fails
- This package is required for Supabase (PostgreSQL) connectivity
- Try installing it separately: `python -m pip install psycopg2-binary`
- If it still fails, you can start the server without database features
- See `SUPABASE_SETUP.md` for Supabase setup instructions

## Stop the Server

Press `Ctrl+C` in the terminal where the server is running.


