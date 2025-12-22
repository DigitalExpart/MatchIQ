# Supabase Setup Guide for MyMatchIQ Backend

## 🚀 Quick Setup

### Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: MyMatchIQ (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be created (~2 minutes)

### Step 2: Get Database Connection String

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string**
3. Select **URI** tab
4. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password

### Step 3: Configure Backend

1. Copy `.env.example` to `.env`:
   ```powershell
   cd "C:\Users\Shilley Pc\MatchIQ\MyMatchIQ\backend"
   copy .env.example .env
   ```

2. Open `.env` and update:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```

3. Update CORS origins if needed:
   ```env
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173,https://yourdomain.com
   ```

### Step 4: Initialize Database Tables

The backend will automatically create tables on first startup. However, you can also run migrations manually:

```powershell
# If using Alembic (when migrations are set up)
alembic upgrade head
```

Or the tables will be created automatically when the server starts (via `init_db()`).

### Step 5: Verify Connection

1. Start the backend server:
   ```powershell
   python -m uvicorn app.main:app --reload
   ```

2. Check health endpoint:
   ```powershell
   # Should show "database": "connected"
   Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing
   ```

---

## 🔍 Supabase Dashboard

### View Your Data

1. Go to **Table Editor** in Supabase dashboard
2. You'll see all tables created by the backend:
   - `users`
   - `blueprints`
   - `scans`
   - `scan_results`
   - `red_flags`
   - `pattern_knowledge_base`
   - `ai_logic_versions`
   - `user_feedback`

### SQL Editor

Use the **SQL Editor** to run queries:
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- View recent scan results
SELECT id, overall_score, category, created_at 
FROM scan_results 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🔐 Security Best Practices

### 1. Use Connection Pooling

Supabase provides connection pooling. For production, use the **Connection Pooler**:

1. Go to **Settings** → **Database**
2. Find **Connection Pooling**
3. Use the **Session** mode connection string for your backend

### 2. Environment Variables

- **Never commit `.env` to git**
- Use different `.env` files for dev/staging/production
- Rotate database passwords regularly

### 3. Row Level Security (RLS)

Consider enabling RLS in Supabase for additional security:
- Go to **Authentication** → **Policies**
- Create policies to restrict data access

---

## 🛠️ Troubleshooting

### Connection Refused

**Error**: `connection to server at "localhost" failed`

**Solution**: 
- Make sure you're using the Supabase connection string (not localhost)
- Check that your password is correct
- Verify the project is active in Supabase dashboard

### SSL Required

**Error**: `SSL connection required`

**Solution**: Add `?sslmode=require` to your connection string:
```
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

### Table Already Exists

**Error**: `relation "users" already exists`

**Solution**: This is normal if tables were already created. The server will continue normally.

---

## 📊 Monitoring

### Supabase Dashboard

- **Database** → **Usage**: Monitor database size and connections
- **Database** → **Connection Pooling**: Monitor pool usage
- **Logs**: View query logs and errors

### Backend Health Check

The `/health` endpoint shows database status:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "ai_version": "1.0.0",
  "database": "connected"
}
```

---

## 🔄 Migration Strategy

### Development → Production

1. **Development**: Use Supabase project for dev
2. **Production**: Create separate Supabase project
3. **Migration**: Use Alembic migrations (when set up) or manual SQL

### Backup Strategy

Supabase provides automatic backups:
- Go to **Settings** → **Database** → **Backups**
- Daily backups are automatic
- Can restore to any point in time

---

## 📝 Next Steps

1. ✅ Set up Supabase project
2. ✅ Configure `.env` file
3. ✅ Start backend server
4. ✅ Verify database connection
5. ⏭️ Set up Supabase Auth (if using)
6. ⏭️ Configure Row Level Security (optional)
7. ⏭️ Set up connection pooling for production

---

## 🆘 Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Backend Issues**: Check server logs for detailed error messages


