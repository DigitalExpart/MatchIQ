# Render Deployment Guide for MyMatchIQ Backend

## Prerequisites

1. GitHub account with the MatchIQ repository
2. Render account (sign up at https://render.com)
3. Supabase project credentials

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your backend code is pushed to GitHub on the `backend` branch.

### 2. Create Render Account & Connect GitHub

1. Go to https://render.com and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select repository: **DigitalExpart/MatchIQ**
5. Select branch: **backend**

### 3. Configure the Web Service

Fill in the following settings:

#### Basic Settings
- **Name**: `matchiq-ai-backend` (or your preferred name)
- **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch**: `backend`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```env
# Supabase Configuration
SUPABASE_PROJECT_ID=xvicydrqtddctywkvyge
SUPABASE_URL=https://xvicydrqtddctywkvyge.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aWN5ZHJxdGRkY3R5d2t2eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MTE5MTMsImV4cCI6MjA4MTk4NzkxM30.OlDfoK_IjbWXHRzhaWb3Yo3Zfo40OLvN4e4pFnwHRuA
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database (Get from Supabase Dashboard > Settings > Database)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xvicydrqtddctywkvyge.supabase.co:5432/postgres

# AI Configuration
AI_VERSION=1.0.0

# CORS (Add your frontend URLs)
CORS_ORIGINS=https://match-iq-git-frontend-digital-experts.vercel.app,https://match-iq.vercel.app,http://localhost:3000,http://localhost:5173

# Security
SECRET_KEY=generate-a-random-secret-key-here-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Environment
ENVIRONMENT=production
DEBUG=false
```

**Important Notes:**
- Replace `[YOUR-PASSWORD]` with your actual Supabase database password
- Get `SUPABASE_SERVICE_ROLE_KEY` from Supabase Dashboard > Settings > API
- Generate a secure `SECRET_KEY` (you can use: `openssl rand -hex 32`)

### 4. Get Your Database Password

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/xvicydrqtddctywkvyge
2. Click **Settings** → **Database**
3. Scroll to **Connection string** section
4. Copy the password from the connection string
5. Or click **"Reset database password"** to set a new one

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait for deployment to complete (usually 2-5 minutes)
4. Once deployed, you'll get a URL like: `https://matchiq-ai-backend.onrender.com`

### 6. Test the Deployment

1. Visit: `https://your-app-name.onrender.com/health`
2. Should return: `{"status":"healthy","version":"1.0.0","database":"connected"}`
3. Visit: `https://your-app-name.onrender.com/docs` for API documentation

### 7. Update Frontend Environment Variable

Update your Vercel environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update:
   ```
   VITE_API_BASE_URL=https://your-app-name.onrender.com/api/v1
   ```
3. Redeploy frontend

## Troubleshooting

### Build Fails

- Check build logs in Render dashboard
- Ensure `requirements.txt` is in the `backend/` directory
- Verify Python version compatibility

### 500 Errors

- Check Render logs: **Logs** tab in Render dashboard
- Verify all environment variables are set correctly
- Check Supabase connection (test DATABASE_URL)

### CORS Errors

- Add your frontend URL to `CORS_ORIGINS`
- Ensure URLs are comma-separated with no spaces
- Restart the service after updating

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check Supabase network settings (allow Render IPs)
- Test connection string locally first

### Service Goes to Sleep (Free Plan)

- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Consider upgrading to paid plan for always-on service

## Monitoring

- **Logs**: View real-time logs in Render dashboard
- **Metrics**: Monitor CPU, memory, and request metrics
- **Alerts**: Set up email alerts for deployment failures

## Updating the Deployment

1. Push changes to `backend` branch on GitHub
2. Render will automatically detect and redeploy
3. Or manually trigger redeploy from Render dashboard

## Custom Domain (Optional)

1. Go to Render dashboard → Your service
2. Click **Settings** → **Custom Domains**
3. Add your domain and follow DNS instructions

## Cost

- **Free Plan**: 
  - Services sleep after inactivity
  - 750 hours/month free
  - Good for development/testing
  
- **Starter Plan** ($7/month):
  - Always-on service
  - Better for production

## Next Steps

After deployment:
1. ✅ Test all API endpoints
2. ✅ Verify database connection
3. ✅ Update frontend API URL
4. ✅ Test Amora AI Coach
5. ✅ Monitor logs for errors

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Check logs first for error details
