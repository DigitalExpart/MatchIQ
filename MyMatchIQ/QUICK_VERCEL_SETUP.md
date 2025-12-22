# ⚡ Quick Vercel Setup (5 Minutes)

## 🎯 Current Issue: 404 Error

Your Vercel deployment is showing 404 because:
1. ✅ **FIXED**: Created `vercel.json` configuration
2. ✅ **FIXED**: Updated build output to `dist`
3. ⚠️ **TODO**: Set environment variables in Vercel
4. ⚠️ **TODO**: Deploy backend separately (Railway/Render)

---

## 🚀 Step-by-Step Fix

### 1. Update Vercel Project Settings

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **match-iq** project
3. Go to **Settings** → **General**
4. Verify:
   - **Root Directory**: Leave empty (or set to `MyMatchIQ` if deploying from root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. Add Environment Variables

Go to **Settings** → **Environment Variables** and add:

```env
VITE_API_BASE_URL=https://your-backend-url.railway.app/api/v1
VITE_ENV=production
```

**⚠️ IMPORTANT**: Replace `your-backend-url.railway.app` with your actual backend URL after deploying backend.

### 3. Redeploy

1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Or push a new commit to trigger auto-deploy

---

## 🔧 Backend Deployment (Required)

Your backend **MUST** be deployed separately. Vercel cannot host FastAPI.

### Quick Railway Setup:

1. Go to [railway.app](https://railway.app) → Sign up
2. **New Project** → **Deploy from GitHub repo**
3. Select: `DigitalExpart/MatchIQ`
4. Select branch: **`backend`**
5. Set **Root Directory**: `MyMatchIQ/backend`
6. Add environment variables:
   ```
   DATABASE_URL=your-supabase-connection-string
   SECRET_KEY=generate-a-random-secret-key
   CORS_ORIGINS=https://match-iq.vercel.app
   AI_VERSION=1.0.0
   DEBUG=False
   ```
7. Railway will auto-deploy
8. Copy your Railway URL (e.g., `https://matchiq-production.up.railway.app`)
9. Update Vercel `VITE_API_BASE_URL` with this URL + `/api/v1`

---

## ✅ After Setup

1. **Frontend**: `https://match-iq.vercel.app` ✅
2. **Backend**: `https://your-backend.railway.app/health` ✅
3. **Test**: Visit frontend, check browser console for API calls

---

## 🐛 Still Getting 404?

1. **Check Vercel logs**: Dashboard → Deployments → Click deployment → View logs
2. **Verify `vercel.json`**: Should be in `MyMatchIQ/` folder
3. **Check build output**: Should create `dist/` folder
4. **Clear cache**: Vercel → Settings → Clear build cache → Redeploy

---

## 📞 Need Help?

See full guide: `VERCEL_DEPLOYMENT.md`

