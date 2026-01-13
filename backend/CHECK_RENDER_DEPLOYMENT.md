# Check if Render Has Latest Code

## Step 1: Check Render Deployment

1. Go to https://dashboard.render.com
2. Click **MacthIQ-ai-backend** service
3. Click **Events** tab
4. Look at the **latest deployment**
5. Check the **commit hash** (should match your latest commit)

**Latest commit should be:**
- `1089737` - "Fix imports in coach_service"
- Or `b203123` - "Fix Amora pattern matching"

## Step 2: Check Render Logs

1. In Render dashboard, click **Logs** tab
2. Ask Amora: "Am I ready for a committed relationship?"
3. Look for these log entries:

**Expected logs:**
```
INFO: Amora request: mode=LEARN, question='Am I ready for a committed relationship?', has_context=True
INFO: Amora question: original='Am I ready for a committed relationship?' normalized='am i ready for a committed relationship'
INFO: Matched READINESS pattern
```

**If you see:**
- No "Amora request" logs → Backend not receiving requests
- No "normalized" logs → Code not deployed
- No "Matched" logs → Pattern not matching (check normalization)

## Step 3: Test Backend Directly

Run this in PowerShell:

```powershell
$body = @{
    mode = "LEARN"
    specific_question = "Am I ready for a committed relationship?"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/coach/" -Method POST -ContentType "application/json" -Body $body
```

**Expected response:**
```json
{
  "message": "Readiness for a committed relationship often involves...",
  "mode": "LEARN",
  "confidence": 0.8
}
```

**If you get generic fallback:**
- Backend code not deployed
- Or pattern matching not working

## Step 4: Force Redeploy

If Render doesn't have latest code:

1. Go to Render dashboard
2. Click **MacthIQ-ai-backend** service
3. Click **Manual Deploy** → **Deploy latest commit**
4. Wait 2-5 minutes
5. Test again

## Step 5: Verify Code is on Backend Branch

```bash
git checkout backend
git log --oneline -3
```

Should see:
- `1089737 Fix imports in coach_service`
- `b203123 Fix Amora pattern matching`

If not, push backend branch:
```bash
git push origin backend
```
