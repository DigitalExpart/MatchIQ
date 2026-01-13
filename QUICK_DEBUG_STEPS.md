# Quick Debug Steps for Amora

## Immediate Action: Check Network Tab

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Clear network log** (trash icon)
4. **Ask Amora a question**: "Am I ready for a committed relationship?"
5. **Look for request to `/coach/`**

### What to Check:

**Request Details:**
- URL: Should be `https://macthiq-ai-backend.onrender.com/api/v1/coach/`
- Method: `POST`
- Status Code: 
  - ✅ `200` = Success (check Response tab)
  - ❌ `400` = Bad request
  - ❌ `500` = Server error
  - ❌ `CORS error` = CORS issue
  - ❌ `(failed)` = Network error

**Request Payload (click request → Payload tab):**
```json
{
  "mode": "LEARN",
  "specific_question": "Am I ready for a committed relationship?",
  "context": {...}
}
```

**Response (click request → Response tab):**
Should see:
```json
{
  "message": "Readiness for a committed relationship...",
  "mode": "LEARN",
  "confidence": 0.8,
  "referenced_data": {...}
}
```

## Test Backend Directly

Open a new terminal and run:

```bash
curl -X POST https://macthiq-ai-backend.onrender.com/api/v1/coach/ \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "LEARN",
    "specific_question": "Am I ready for a committed relationship?"
  }'
```

**Expected Output:**
```json
{
  "message": "Readiness for a committed relationship often involves...",
  "mode": "LEARN",
  "confidence": 0.8,
  "referenced_data": {
    "question": "Am I ready for a committed relationship?",
    "context": {}
  }
}
```

If this works → Backend is fine, issue is frontend
If this fails → Backend issue (check Render logs)

## Check Render Logs

1. Go to https://dashboard.render.com
2. Click your service: `MacthIQ-ai-backend`
3. Click **Logs** tab
4. Look for:
   - `Amora request: mode=LEARN, question='...'`
   - `Amora question: original='...' normalized='...'`
   - `Matched READINESS pattern` (or other pattern)
   - Any errors

## Frontend Deployment

The new logging code needs to be deployed to Vercel:

1. **Check if changes are on frontend branch:**
   ```bash
   git checkout frontend
   git log --oneline -3
   ```

2. **If not, merge backend changes:**
   ```bash
   git merge backend
   git push origin frontend
   ```

3. **Vercel will auto-deploy** (or manually trigger in Vercel dashboard)

4. **Wait 2-3 minutes** for deployment

5. **Hard refresh browser** (Ctrl+Shift+R or Cmd+Shift+R)

6. **Test again** - you should now see:
   - `🔵 Amora API Call:`
   - `🟢 Amora API Response Status:`
   - `✅ Amora API Success:` (if successful)

## Ignore These Errors

The `horizen.js` and `api.tokenmint.global` errors are from browser extensions and are **completely unrelated**. You can ignore them.

## Most Likely Issues

1. **Frontend not deployed** - New logging code not live yet
2. **Backend timeout** - Render free tier is slow (first request after sleep)
3. **CORS issue** - Backend not allowing frontend origin
4. **Network error** - Fetch failing silently

## Next Steps Based on Network Tab

- **If you see `/coach/` request with status 200**: Backend is working, check Response tab for actual message
- **If you see `/coach/` request with status 500**: Check Render logs for backend error
- **If you see `/coach/` request with CORS error**: Add frontend URL to CORS_ORIGINS in Render
- **If you DON'T see `/coach/` request**: Frontend code issue or fetch failing before request
