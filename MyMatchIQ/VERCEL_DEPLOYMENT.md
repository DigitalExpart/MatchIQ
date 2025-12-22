# 🚀 Vercel Deployment Guide for MatchIQ Frontend

## ⚠️ Important: Backend Hosting

**Vercel is for FRONTEND only.** Your FastAPI backend needs separate hosting:

- **Recommended**: Railway, Render, or Fly.io
- **Why**: Vercel is optimized for static sites and serverless functions, not long-running Python applications with database connections

---

## 📋 Frontend Deployment Steps

### Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository: `DigitalExpart/MatchIQ`
4. Select the **`frontend`** branch

### Step 2: Configure Build Settings

Vercel should auto-detect Vite, but verify:

- **Framework Preset**: Vite
- **Root Directory**: `MyMatchIQ` (if deploying from root) or leave empty if deploying from `MyMatchIQ` folder
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Set Environment Variables

In Vercel project settings → **Environment Variables**, add:

```env
# API Configuration
VITE_API_BASE_URL=https://your-backend-url.com/api/v1
VITE_ENV=production

# Feature Flags (optional)
VITE_FEATURE_AI_COACH=true
VITE_FEATURE_AI_INSIGHTS=true
VITE_FEATURE_RATE_LIMITING=true
VITE_FEATURE_ANALYTICS=true

# API Timeout (optional, default: 30000ms)
VITE_API_TIMEOUT=30000
```

**Important**: Replace `https://your-backend-url.com` with your actual backend URL (from Railway, Render, etc.)

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Your site will be live at `https://match-iq.vercel.app` (or your custom domain)

---

## 🔧 Backend Deployment (Separate Service)

### Option 1: Railway (Recommended - Easiest)

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository and **`backend`** branch
4. Set root directory: `MyMatchIQ/backend`
5. Add environment variables:
   ```env
   DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
   SECRET_KEY=your-secret-key-here
   CORS_ORIGINS=https://match-iq.vercel.app,https://yourdomain.com
   AI_VERSION=1.0.0
   DEBUG=False
   ```
6. Railway will auto-detect Python and install dependencies
7. Your backend will be live at: `https://your-project.up.railway.app`

### Option 2: Render

1. Go to [render.com](https://render.com)
2. Click **"New"** → **"Web Service"**
3. Connect GitHub repo, select **`backend`** branch
4. Configure:
   - **Root Directory**: `MyMatchIQ/backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3
5. Add environment variables (same as Railway)
6. Deploy

### Option 3: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. In `MyMatchIQ/backend/`, create `fly.toml`:
   ```toml
   app = "matchiq-backend"
   primary_region = "iad"

   [build]

   [http_service]
     internal_port = 8000
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0
     processes = ["app"]

   [[vm]]
     memory_mb = 512
     cpu_kind = "shared"
     cpus = 1
   ```
3. Run: `fly launch` and follow prompts
4. Set secrets: `fly secrets set DATABASE_URL=... SECRET_KEY=...`

---

## 🔗 Connect Frontend to Backend

After deploying backend, update Vercel environment variables:

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Update `VITE_API_BASE_URL`:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api/v1
   ```
3. Redeploy frontend (Vercel will auto-redeploy if connected to GitHub)

---

## ✅ Verify Deployment

### Frontend (Vercel)
- Visit: `https://match-iq.vercel.app`
- Should load without 404 errors
- Check browser console for API connection errors

### Backend (Railway/Render/Fly.io)
- Visit: `https://your-backend-url.com/health`
- Should return:
  ```json
  {
    "status": "healthy",
    "version": "1.0.0",
    "database": "connected"
  }
  ```

---

## 🐛 Troubleshooting

### 404 Error on Vercel

**Problem**: Routes not working, showing 404

**Solution**: 
- Verify `vercel.json` exists in `MyMatchIQ/` folder
- Check that `rewrites` rule is present
- Ensure `outputDirectory` is `dist` (not `build`)

### API Connection Errors

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Check `VITE_API_BASE_URL` in Vercel environment variables
2. Verify backend CORS settings include your Vercel domain
3. Check backend logs for connection errors
4. Test backend health endpoint directly

### Build Failures

**Problem**: Vercel build fails

**Solutions**:
1. Check build logs in Vercel dashboard
2. Ensure `package.json` has correct build script
3. Verify Node.js version (Vercel auto-detects, but can set in `package.json`):
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

### Backend Not Starting

**Problem**: Backend crashes on Railway/Render

**Solutions**:
1. Check logs in hosting platform dashboard
2. Verify all environment variables are set
3. Ensure `requirements.txt` includes all dependencies
4. Check that `DATABASE_URL` is correct and Supabase is accessible

---

## 📝 Environment Variables Checklist

### Vercel (Frontend)
- [ ] `VITE_API_BASE_URL` - Your backend URL
- [ ] `VITE_ENV` - `production`
- [ ] `VITE_FEATURE_AI_COACH` - `true` or `false`
- [ ] `VITE_FEATURE_AI_INSIGHTS` - `true` or `false`

### Railway/Render/Fly.io (Backend)
- [ ] `DATABASE_URL` - Supabase connection string
- [ ] `SECRET_KEY` - JWT secret key
- [ ] `CORS_ORIGINS` - Your Vercel domain + custom domain
- [ ] `AI_VERSION` - `1.0.0`
- [ ] `DEBUG` - `False` (production)

---

## 🔄 Continuous Deployment

Both Vercel and Railway/Render support automatic deployments:

- **Vercel**: Auto-deploys on push to `frontend` branch
- **Railway/Render**: Auto-deploys on push to `backend` branch

Just push to GitHub and both will redeploy automatically!

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Fly.io Documentation](https://fly.io/docs)

---

## 🆘 Need Help?

1. Check deployment logs in respective platforms
2. Verify environment variables are set correctly
3. Test backend health endpoint independently
4. Check browser console for frontend errors

