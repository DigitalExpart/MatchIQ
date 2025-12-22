# Quick Start Guide - MyMatchIQ Backend

## 🚀 Get Started in 5 Minutes

### Step 1: Set Up Supabase (2 minutes)

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password

### Step 2: Configure Backend (1 minute)

1. Copy `.env.example` to `.env`:
   ```powershell
   cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ\backend"
   copy .env.example .env
   ```

2. Edit `.env` and paste your Supabase connection string:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```

### Step 3: Install Dependencies (1 minute)

```powershell
cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ\backend"
python -m pip install -r requirements.txt
```

### Step 4: Start Backend Server (1 minute)

```powershell
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 5: Verify It Works

Open a new terminal and test:

```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing

# Should return:
# {
#   "status": "healthy",
#   "version": "1.0.0",
#   "database": "connected"
# }
```

Or visit: [http://localhost:8000/docs](http://localhost:8000/docs) for API documentation

---

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] `.env` file configured with Supabase connection string
- [ ] Dependencies installed
- [ ] Backend server running on port 8000
- [ ] Health check returns `"database": "connected"`

---

## 🐛 Troubleshooting

### Database Connection Failed?

1. **Check connection string format:**
   ```
   postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
   ```

2. **Verify password is correct** (no brackets `[]`)

3. **Check Supabase project is active** (not paused)

### Port 8000 Already in Use?

Change port in startup command:
```powershell
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

### Module Not Found?

Install dependencies:
```powershell
python -m pip install -r requirements.txt
```

---

## 📚 Next Steps

- Read [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) for full architecture
- Read [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed Supabase setup
- Read [FRONTEND_BACKEND_INTEGRATION.md](./FRONTEND_BACKEND_INTEGRATION.md) for integration guide

---

## 🆘 Need Help?

- Check server logs for error messages
- Verify `.env` file is in the `backend/` directory
- Ensure Supabase project is active
- Check firewall/network settings
