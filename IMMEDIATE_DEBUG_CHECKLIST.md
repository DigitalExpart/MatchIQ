# Immediate Debug Checklist

## ✅ Step 1: Check Network Tab (DO THIS FIRST)

1. Open DevTools (F12)
2. Go to **Network** tab
3. **Filter by "coach"** (type "coach" in filter box)
4. Ask Amora: "Am I ready for a committed relationship?"
5. **Look for the `/coach/` request**

### What You're Looking For:

**If you see the request:**
- Click on it
- Check **Status** column (should be 200, 400, 500, or "failed")
- Click **Response** tab to see what backend returned
- Click **Payload** tab to see what was sent

**If you DON'T see the request:**
- Frontend isn't calling backend (code issue)
- Check Console for JavaScript errors

## ✅ Step 2: Test Backend Directly

Open PowerShell or Command Prompt and run:

```powershell
curl.exe -X POST https://macthiq-ai-backend.onrender.com/api/v1/coach/ -H "Content-Type: application/json" -d "{\"mode\": \"LEARN\", \"specific_question\": \"Am I ready for a committed relationship?\"}"
```

**If this returns JSON with a message** → Backend works, issue is frontend
**If this fails or times out** → Backend issue (check Render)

## ✅ Step 3: Check Render Logs

1. Go to https://dashboard.render.com
2. Click **MacthIQ-ai-backend** service
3. Click **Logs** tab
4. Look for recent entries when you asked the question
5. Search for "Amora" in logs

**What to look for:**
- `Amora request: mode=LEARN, question='...'`
- `Amora question: original='...' normalized='...'`
- `Matched READINESS pattern` or `Matched LOVE pattern`
- Any Python errors

## ✅ Step 4: Wait for Frontend Deployment

I just pushed the frontend changes. Vercel should auto-deploy in 2-3 minutes.

**After deployment:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Ask Amora again
3. Check console - you should now see:
   - `🔵 Amora API Call:` (blue circle)
   - `🟢 Amora API Response Status:` (green circle)
   - `✅ Amora API Success:` (green checkmark) OR
   - `❌ Amora API Exception:` (red X)

## Common Issues & Solutions

### Issue: Network tab shows status 200 but generic response
**Solution:** Check Response tab - backend might be returning fallback message

### Issue: Network tab shows status 500
**Solution:** Check Render logs for Python error

### Issue: Network tab shows CORS error
**Solution:** Add your Vercel URL to `CORS_ORIGINS` in Render environment variables

### Issue: Network tab shows "failed" or timeout
**Solution:** Render free tier is slow - wait 30 seconds and try again

### Issue: No `/coach/` request in Network tab
**Solution:** Frontend code issue - check Console for JavaScript errors

## Ignore These

The `horizen.js` and `api.tokenmint.global` errors are from browser extensions. They're **completely unrelated** to your app. You can ignore them or disable extensions to reduce noise.
