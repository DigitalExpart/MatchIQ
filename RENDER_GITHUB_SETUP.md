# Fix Render GitHub Integration

## Problem
Render logs show:
```
==> It looks like we don't have access to your repo, but we'll try to clone it anyway.
==> Checking out commit 2c01c9a69eb9c437b30537f30bf00bc272eff127
```

This means Render is using **public clone** instead of **GitHub integration**, which:
- ❌ Doesn't trigger auto-deployments
- ❌ May not get latest commits
- ❌ Requires manual deployments

## Solution: Connect Render to GitHub

### Step 1: Disconnect Current Service (if needed)

1. Go to https://dashboard.render.com
2. Click **MacthIQ-ai-backend** service
3. Click **Settings** tab
4. Scroll to **GitHub** section
5. If it shows "Public Git repository" → You need to reconnect

### Step 2: Connect GitHub Account

1. In Render dashboard, click your **profile icon** (top right)
2. Click **Account Settings**
3. Go to **Connected Accounts** or **GitHub** section
4. Click **Connect GitHub** or **Reconnect**
5. Authorize Render to access your repositories
6. Select the repositories you want to give access to (or "All repositories")

### Step 3: Reconnect Service to GitHub

**Option A: Edit Existing Service**

1. Go to **MacthIQ-ai-backend** service
2. Click **Settings** tab
3. Scroll to **GitHub** section
4. Click **Disconnect** (if connected to public repo)
5. Click **Connect GitHub**
6. Select repository: **DigitalExpart/MatchIQ**
7. Select branch: **backend**
8. Click **Save**

**Option B: Create New Service (if edit doesn't work)**

1. Click **New +** → **Web Service**
2. Connect to **GitHub**
3. Select repository: **DigitalExpart/MatchIQ**
4. Select branch: **backend**
5. Configure:
   - **Name:** `MacthIQ-ai-backend` (or new name)
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables (copy from old service)
7. Click **Create Web Service**

### Step 4: Enable Auto-Deploy

1. In service settings, scroll to **Auto-Deploy** section
2. Make sure **Auto-Deploy** is **Enabled**
3. Select **Deploy latest commit on every push**
4. Click **Save Changes**

### Step 5: Verify Connection

1. Go to service **Settings** → **GitHub** section
2. Should show:
   - ✅ **Connected to GitHub**
   - Repository: `DigitalExpart/MatchIQ`
   - Branch: `backend`
   - Auto-Deploy: **Enabled**

### Step 6: Test Auto-Deploy

1. Make a small change to `backend/README.md`
2. Commit and push:
   ```bash
   git add backend/README.md
   git commit -m "Test auto-deploy"
   git push origin backend
   ```
3. Go to Render dashboard
4. You should see a **new deployment start automatically** within 30 seconds
5. No more "we don't have access" message!

## Troubleshooting

### Issue: "Repository not found"
**Solution:** 
- Make sure GitHub account is connected in Render
- Repository must be accessible to your GitHub account
- If private repo, Render needs access

### Issue: "Branch not found"
**Solution:**
- Make sure `backend` branch exists
- Check branch name spelling (case-sensitive)

### Issue: Still showing old commit
**Solution:**
- Wait 1-2 minutes for Render to refresh
- Click **Manual Deploy** → **Deploy latest commit**
- Check that you pushed to correct branch: `git push origin backend`

### Issue: Auto-deploy not working
**Solution:**
- Verify Auto-Deploy is enabled in settings
- Check that you're pushing to the correct branch (`backend`)
- Render only auto-deploys from the connected branch

## After Setup

Once connected properly:
- ✅ Every `git push origin backend` triggers auto-deploy
- ✅ Render gets latest commits automatically
- ✅ No more manual deployments needed
- ✅ Logs will show: `==> Cloning from https://github.com/DigitalExpart/MatchIQ.git` (with access)

## Current Status Check

After connecting, check Render logs. You should see:
```
==> Cloning from https://github.com/DigitalExpart/MatchIQ.git
==> Checking out commit [LATEST_COMMIT_HASH] in branch backend
```

Instead of:
```
==> It looks like we don't have access to your repo...
```
