# Quick Render Deployment (5 Minutes)

## Fast Track Steps

### 1. Go to Render
Visit: https://dashboard.render.com

### 2. Create New Web Service
- Click **"New +"** → **"Web Service"**
- Connect GitHub → Select **DigitalExpart/MatchIQ**
- Branch: **backend**

### 3. Quick Settings
```
Name: matchiq-ai-backend
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 4. Essential Environment Variables

**Copy these exactly:**

```env
SUPABASE_PROJECT_ID=xvicydrqtddctywkvyge
SUPABASE_URL=https://xvicydrqtddctywkvyge.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aWN5ZHJxdGRkY3R5d2t2eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MTE5MTMsImV4cCI6MjA4MTk4NzkxM30.OlDfoK_IjbWXHRzhaWb3Yo3Zfo40OLvN4e4pFnwHRuA
```

**Get these from Supabase Dashboard:**

1. **DATABASE_URL**: 
   - Go to: https://supabase.com/dashboard/project/xvicydrqtddctywkvyge/settings/database
   - Copy "Connection string" → URI
   - Replace `[YOUR-PASSWORD]` with your actual password

2. **SUPABASE_SERVICE_ROLE_KEY**:
   - Go to: https://supabase.com/dashboard/project/xvicydrqtddctywkvyge/settings/api
   - Copy "service_role" key (keep it secret!)

**Add these:**

```env
AI_VERSION=1.0.0
CORS_ORIGINS=https://match-iq-git-frontend-digital-experts.vercel.app,https://match-iq.vercel.app
SECRET_KEY=change-this-to-random-32-char-string
ENVIRONMENT=production
DEBUG=false
```

### 5. Deploy
Click **"Create Web Service"** and wait 2-5 minutes.

### 6. Get Your URL
After deployment, copy your URL (e.g., `https://matchiq-ai-backend.onrender.com`)

### 7. Update Frontend
1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add: `VITE_API_BASE_URL=https://your-app-name.onrender.com/api/v1`
3. Redeploy frontend

### 8. Test
Visit: `https://your-app-name.onrender.com/health`

Should see: `{"status":"healthy","version":"1.0.0","database":"connected"}`

## Done! 🎉

Your backend is now live. Amora should work!

## Need Help?

See `RENDER_DEPLOYMENT.md` for detailed instructions.
