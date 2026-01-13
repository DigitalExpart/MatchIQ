# Deployment Checklist

## Pre-Deployment

- [ ] All code pushed to GitHub `backend` branch
- [ ] Database tables created in Supabase (run `migrations/001_create_tables.sql`)
- [ ] Tested backend locally (`python -m app.main`)
- [ ] All environment variables documented

## Render Setup

- [ ] Created Render account
- [ ] Connected GitHub repository
- [ ] Created new Web Service
- [ ] Set correct branch (`backend`)
- [ ] Set root directory (`backend`)

## Environment Variables

- [ ] `SUPABASE_PROJECT_ID` = `xvicydrqtddctywkvyge`
- [ ] `SUPABASE_URL` = `https://xvicydrqtddctywkvyge.supabase.co`
- [ ] `SUPABASE_ANON_KEY` = (from Supabase)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = (from Supabase Settings > API)
- [ ] `DATABASE_URL` = (from Supabase Settings > Database)
- [ ] `AI_VERSION` = `1.0.0`
- [ ] `CORS_ORIGINS` = (your frontend URLs)
- [ ] `SECRET_KEY` = (generated secure key)
- [ ] `ALGORITHM` = `HS256`
- [ ] `ACCESS_TOKEN_EXPIRE_MINUTES` = `30`
- [ ] `ENVIRONMENT` = `production`
- [ ] `DEBUG` = `false`

## Build Configuration

- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Python Version: `3.11.0`

## Post-Deployment Testing

- [ ] Health check: `https://your-app.onrender.com/health`
- [ ] API docs: `https://your-app.onrender.com/docs`
- [ ] Test `/api/v1/coach/` endpoint
- [ ] Test database connection
- [ ] Check logs for errors

## Frontend Update

- [ ] Update `VITE_API_BASE_URL` in Vercel
- [ ] Redeploy frontend
- [ ] Test Amora AI Coach in production

## Monitoring

- [ ] Set up log monitoring
- [ ] Check service metrics
- [ ] Set up deployment alerts (optional)
