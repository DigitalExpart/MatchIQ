# 🔌 Connect Supabase to Backend - Quick Guide

## ✅ Step 1: Get Your Supabase Connection String

1. Go to **[https://app.supabase.com](https://app.supabase.com)**
2. Select your **project**
3. Click **Settings** (gear icon) → **Database**
4. Scroll to **Connection string** section
5. Click the **URI** tab
6. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
7. **Replace `[YOUR-PASSWORD]`** with your actual database password

---

## ✅ Step 2: Update .env File

The `.env` file has been created in the backend folder. Open it and update:

```env
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

**Replace:**
- `YOUR_ACTUAL_PASSWORD` → Your Supabase database password
- `xxxxx` → Your actual project reference ID

**Example:**
```env
DATABASE_URL=postgresql://postgres:mypassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

## ✅ Step 3: Test Connection

1. **Restart your backend server:**
   ```powershell
   cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ\backend"
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Check health endpoint:**
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing
   ```

3. **Should return:**
   ```json
   {
     "status": "healthy",
     "version": "1.0.0",
     "database": "connected"
   }
   ```

---

## 🔍 Verify in Supabase Dashboard

1. Go to **Table Editor** in Supabase
2. You should see tables created automatically:
   - `users`
   - `blueprints`
   - `scans`
   - `scan_results`
   - `red_flags`
   - `chat_sessions`
   - `chat_messages`
   - And more...

---

## ⚠️ Troubleshooting

### SSL Connection Error
If you see SSL errors, add `?sslmode=require` to your connection string:
```env
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

### Connection Refused
- Check your password is correct
- Verify project is active in Supabase dashboard
- Make sure you're using the URI format (not Session mode)

### Tables Not Created
- Check backend logs for errors
- Tables are created automatically on first startup
- If errors occur, check Supabase dashboard → Logs

---

## 📝 Full .env File Template

Your `.env` file should look like this:

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres

# AI Version
AI_VERSION=1.0.0

# CORS (add your frontend URLs)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application
DEBUG=False
LOG_LEVEL=INFO
```

---

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Connection string copied from Supabase dashboard
- [ ] `.env` file updated with connection string
- [ ] Backend server restarted
- [ ] Health endpoint shows `"database": "connected"`
- [ ] Tables visible in Supabase Table Editor

---

## 🆘 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Backend Logs**: Check terminal output for detailed errors
- **Supabase Dashboard**: Check Database → Logs for connection issues

