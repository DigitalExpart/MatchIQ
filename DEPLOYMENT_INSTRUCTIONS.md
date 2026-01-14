# 🚀 Amora V1 Enhanced - Deployment Instructions

## ✅ STEP 1: PUSHED TO GITHUB ✅

**Commit**: `f50032a`  
**Branch**: `backend`  
**Status**: Successfully pushed

---

## 📋 STEP 2: RUN DATABASE MIGRATION (5 minutes)

### Option A: Supabase SQL Editor (EASIEST - Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `xvicydrqtddctywkvyge`

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New query"

3. **Copy Migration SQL**
   - Open file: `backend/migrations/002_amora_templates.sql`
   - Copy ALL contents (181 lines)

4. **Run Migration**
   - Paste into SQL Editor
   - Click "Run" (or Ctrl+Enter)
   - ✅ Should see "Success" message
   - ✅ Should see "8 rows inserted" or similar

5. **Verify Tables Created**
   - Go to "Table Editor" in Supabase
   - Look for new table: `amora_templates`
   - Should see 8 rows with categories: confusion, venting, anxiety, etc.

### Option B: Command Line (If you have psql installed)

```bash
# Get your DATABASE_URL from Supabase settings
psql YOUR_DATABASE_URL -f backend/migrations/002_amora_templates.sql
```

---

## 🔧 STEP 3: RENDER WILL AUTO-INSTALL DEPENDENCIES

**When you push to GitHub, Render automatically:**
1. Detects changes on `backend` branch
2. Runs: `pip install -r requirements.txt`
3. Installs new packages:
   - `sentence-transformers==2.3.1` (80MB model)
   - `scikit-learn==1.4.0`
   - `joblib==1.3.2`
   - `numpy==1.24.3`

**This happens automatically - no action needed!**

---

## ⚙️ STEP 4: UPDATE RENDER SETTINGS (IMPORTANT)

### Upgrade Instance Type

1. **Go to Render Dashboard**
   - https://dashboard.render.com
   - Select your service: `macthiq-ai-backend`

2. **Change Instance Type**
   - Click "Settings" tab
   - Scroll to "Instance Type"
   - Change from: **Starter (512MB)** or **Free**
   - Change to: **Standard (2GB RAM)** ← REQUIRED
   - Cost: $7/month
   - Click "Save Changes"

   **Why?** sentence-transformers needs ~300MB RAM + your app needs ~100MB = 400MB total

3. **Verify Build Command** (should already be set)
   ```
   pip install -r requirements.txt
   ```

4. **Verify Start Command** (should already be set)
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

---

## 🚀 STEP 5: RENDER WILL AUTO-DEPLOY

**Monitor deployment:**
1. Go to Render Dashboard
2. Click on your service
3. Click "Logs" tab
4. Watch for these messages:

### ✅ GOOD SIGNS (What to look for):
```
==> Installing Python version 3.11.9...
==> Running build command 'pip install -r requirements.txt'...
Collecting sentence-transformers==2.3.1
Collecting scikit-learn==1.4.0
...
Successfully installed sentence-transformers-2.3.1 scikit-learn-1.4.0 joblib-1.3.2
==> Build successful 🎉
==> Deploying...
INFO: Started server process
INFO: Application startup complete.
INFO: Uvicorn running on http://0.0.0.0:10000
==> Your service is live 🎉
```

### ❌ BAD SIGNS (Troubleshooting):
```
ERROR: Could not find a version that satisfies the requirement sentence-transformers
```
**Fix**: Check `requirements.txt` syntax, repush

```
MemoryError or OOM (Out of Memory)
```
**Fix**: Upgrade to Standard (2GB) instance (see Step 4)

```
ModuleNotFoundError: No module named 'sentence_transformers'
```
**Fix**: Check requirements.txt was committed and pushed

---

## 🧪 STEP 6: TEST DEPLOYMENT (5 minutes)

### Test 1: Health Check
```bash
curl https://macthiq-ai-backend.onrender.com/api/v1/coach/health
```

**Expected Response**:
```json
{"status":"healthy","service":"amora_enhanced","version":"1.0.0"}
```

---

### Test 2: First-Turn Welcome
```bash
curl -X POST https://macthiq-ai-backend.onrender.com/api/v1/coach/ \
  -H "Content-Type: application/json" \
  -d "{\"mode\":\"LEARN\",\"specific_question\":\"hi\"}"
```

**Expected Response** (one of these):
```json
{
  "message": "I'm Amora. I help people think through love and relationships without judgment or pressure. What's been on your mind lately?",
  "mode": "LEARN",
  "confidence": 0.7
}
```

---

### Test 3: Emotional Mirroring (Confusion)
```bash
curl -X POST https://macthiq-ai-backend.onrender.com/api/v1/coach/ \
  -H "Content-Type: application/json" \
  -d "{\"mode\":\"LEARN\",\"specific_question\":\"I'm so confused about my relationship\"}"
```

**Expected Response** should:
- ✅ Include emotional reflection (e.g., "It sounds like...", "I can sense...")
- ✅ End with a clarifying question
- ✅ NOT include advice like "you should" or "you could try"

---

### Test 4: Template Matching (New Template)
```bash
curl -X POST https://macthiq-ai-backend.onrender.com/api/v1/coach/ \
  -H "Content-Type: application/json" \
  -d "{\"mode\":\"LEARN\",\"specific_question\":\"Is this relationship toxic\"}"
```

**Expected Response** should mention:
- "Healthy relationships involve respect, trust, and emotional safety"
- Ask "What specific behaviors have you concerned?"

---

### Test 5: Confidence Gating (LOW - No Advice)
```bash
curl -X POST https://macthiq-ai-backend.onrender.com/api/v1/coach/ \
  -H "Content-Type: application/json" \
  -d "{\"mode\":\"LEARN\",\"specific_question\":\"I'm so overwhelmed and anxious I don't know what to do\"}"
```

**Expected Response** should:
- ✅ Reflect emotion (overwhelm/anxiety)
- ✅ End with clarifying question
- ❌ NOT include advice or suggestions
- ❌ NOT say "you should" or "you could try"

---

## 📊 STEP 7: VERIFY IN FRONTEND

1. **Open your frontend**: https://your-frontend-url.vercel.app
2. **Navigate to AI Coach**
3. **Test these scenarios**:

### Scenario A: First Interaction
- Open AI Coach for first time
- Should see warm welcome message
- Privacy badge should be visible

### Scenario B: Emotional Support
- Type: "I'm feeling really confused"
- Should get emotional mirroring
- Should feel understood, not judged

### Scenario C: Response Variability
- Ask same question 3 times: "I'm confused about my relationship"
- Responses should vary slightly
- Should never sound repetitive

---

## ✅ SUCCESS CHECKLIST

After deployment, verify:

- [ ] Render shows "Your service is live 🎉"
- [ ] Health check returns 200 OK
- [ ] First-turn test works
- [ ] Emotional mirroring test works
- [ ] Template matching test works
- [ ] Confidence gating test works (no advice at LOW)
- [ ] Frontend can connect to backend
- [ ] No errors in Render logs
- [ ] Response time <500ms (first request after cold start may be slower)
- [ ] Memory usage <500MB in Render metrics

---

## 🔧 TROUBLESHOOTING

### Issue: "sentence-transformers not found"
**Solution**: 
1. Check `requirements.txt` has `sentence-transformers==2.3.1`
2. Repush to GitHub
3. Wait for Render to rebuild

### Issue: "Out of memory" or service crashes
**Solution**: 
1. Go to Render Settings
2. Upgrade to Standard (2GB) instance
3. Cost: $7/month

### Issue: "Table amora_templates does not exist"
**Solution**: 
1. Run database migration in Supabase SQL Editor
2. Copy contents of `backend/migrations/002_amora_templates.sql`
3. Paste and run

### Issue: Generic responses, no emotional mirroring
**Check**:
1. Verify `coach_enhanced` router is being used (not old `coach`)
2. Check `backend/app/main.py` line 66 shows `coach_enhanced`
3. Restart service if needed

### Issue: Response takes 10+ seconds
**Explanation**: 
- First request after cold start loads sentence-transformers model (~10 seconds)
- Subsequent requests should be <500ms
- This is normal behavior

---

## 📈 MONITORING (First 24 Hours)

### Watch For:
1. **Error Rate**: Should be <1%
2. **Response Time**: Should be <500ms (after cold start)
3. **Memory Usage**: Should be ~400MB
4. **User Feedback**: Monitor for "doesn't understand" complaints

### Render Logs to Monitor:
```bash
# In Render dashboard, filter logs for:
"Amora Enhanced request"  # Should see user questions
"Amora Enhanced response"  # Should see responses
"ERROR"  # Should be minimal
"Loaded sentence-transformers model"  # Should see once per deployment
```

---

## 🎉 DEPLOYMENT COMPLETE!

**You now have:**
- ✅ Semantic, emotionally intelligent AI coach
- ✅ 100% self-hosted (no OpenAI)
- ✅ $7/month cost (vs $2,400+ for OpenAI)
- ✅ 10 enhancement tasks implemented
- ✅ 5 signature wow moments
- ✅ Production-ready, stress-tested

**What's Next:**
1. Monitor user feedback for 3-5 days
2. Collect examples of wow moments in action
3. Implement Week 2 improvements if desired (see `IMPLEMENT_WOW_MOMENTS.md`)

---

**Questions? Issues?** Check:
- `START_HERE.md` - Quick start guide
- `DEPLOY_CHECKLIST.md` - Detailed checklist
- `AMORA_V1_DEPLOYMENT.md` - Comprehensive deployment guide
- `AMORA_STRESS_TEST.md` - Stress test results

**Deploy with confidence. This is production-ready.** 🚀
