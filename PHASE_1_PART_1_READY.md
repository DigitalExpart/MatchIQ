# Phase 1 Part 1: Heartbreak & Breakup Expansion - READY TO DEPLOY

## ✅ Status: Ready for Supabase

**File**: `009_expand_core_topics_to_30.sql`  
**Blocks added**: 34 (15 heartbreak + 19 breakup)  
**Fixed**: Changed `'insight'` to `'reframe'` to match database constraint

---

## 🎯 What This Deployment Does

### Heartbreak (Current: 15 → Target: 30)
**Added 15 new blocks**:
- 4 reflection (stage 2) - deeper emotional mirroring
- 4 normalization (stage 2) - grief patterns, healing timeline
- 4 exploration (stage 2) - identity, needs, growth questions
- 3 reframe (stage 2) - layered grief, closure, past wounds

### Breakup (Current: 11 → Target: 30)
**Added 19 new blocks**:
- 5 reflection (stages 1 & 2) - ending acceptance, self-doubt, mixed feelings
- 5 normalization (stages 1 & 2) - withdrawal, numbness, lingering affection
- 5 exploration (stages 1 & 2) - patterns, identity, healing vision
- 4 reframe (stage 2) - identity crisis, patterns, complexity

---

## 📝 How to Deploy

### Step 1: Run in Supabase
1. Go to Supabase SQL Editor
2. Open `009_expand_core_topics_to_30.sql`
3. Copy entire contents
4. Paste into SQL Editor
5. Click **Run**

### Step 2: Compute Embeddings
**Option A - Remote** (if local network issues):
```powershell
# Call admin API endpoint
Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/admin/compute-embeddings" -Method Post
```

**Option B - Local**:
```bash
cd backend
python scripts/compute_block_embeddings.py
```

### Step 3: Verify Coverage
```bash
cd backend
python scripts/report_block_coverage.py
```

**Expected output**:
```
[OK] Topic: heartbreak
  TOTAL BLOCKS: 30 / 30
  ...

[OK] Topic: breakup  
  TOTAL BLOCKS: 30 / 30
  ...
```

---

## 🧪 Test After Deployment

### Test Heartbreak Responses
```powershell
$body = @{mode="LEARN"; specific_question="I'm heartbroken after my breakup"; user_id="test-123"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/coach/" -Method Post -Headers @{"Content-Type"="application/json"} -Body $body
```

Run 5 times - should see **variety** in responses.

### Test Breakup Responses
```powershell
$body = @{mode="LEARN"; specific_question="I just broke up with my partner"; user_id="test-456"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/coach/" -Method Post -Headers @{"Content-Type"="application/json"} -Body $body
```

Run 5 times - should see **different blocks** each time.

---

## 📊 Impact

### Before
- Heartbreak: 15 blocks (limited variety)
- Breakup: 11 blocks (limited variety)
- Repetition likely after 3-4 turns

### After
- Heartbreak: 30 blocks (2x improvement)
- Breakup: 30 blocks (nearly 3x improvement)
- Much less repetition, deeper emotional resonance

### User Experience
- ✅ More varied responses to same questions
- ✅ Deeper stage 2 content for ongoing conversations
- ✅ Better exploration questions
- ✅ More nuanced perspectives (reframe blocks)

---

## 🔄 Next Steps (After Testing)

### Phase 1 Part 2: Remaining Critical Topics
Generate and deploy blocks for:
- Cheating (need 21)
- Divorce (need 21)
- Separation (need 21)
- Infidelity (need 22)

**Total**: ~85 more blocks

### Phase 2: High Priority Topics
- Trust, Jealousy, Communication, Situationship
- **Total**: ~87 blocks

### Phase 3: Remaining Topics
- All other 12 core topics
- **Total**: ~170 blocks

---

## 🐛 Troubleshooting

### Issue: SQL error about block_type
**Fix**: Already fixed - using 'reframe' instead of 'insight'

### Issue: Embeddings not computing
**Solution**: Use remote admin endpoint (see Step 2, Option A)

### Issue: Blocks not showing up in responses
**Check**:
1. Are embeddings computed? (check admin/blocks-status endpoint)
2. Run coverage report - do blocks show up?
3. Check Render logs for any errors

---

## ✅ Ready to Deploy

The SQL file is corrected and ready. You can now:
1. Run it in Supabase SQL Editor
2. Compute embeddings
3. Test the improved variety

**Status**: 🟢 READY  
**File**: `009_expand_core_topics_to_30.sql`  
**Blocks**: 34 high-quality, non-directive blocks  
**Topics**: heartbreak ✅, breakup ✅
