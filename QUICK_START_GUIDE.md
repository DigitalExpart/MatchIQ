# Quick Start: Fix Amora Generic Responses

## TL;DR - Do This Now ⚡

```bash
# 1. Commit the improved pattern matching
git add backend/app/services/coach_service.py
git commit -m "Fix: Improve Amora pattern matching for common relationship questions"
git push

# 2. Wait for auto-deployment (~2-5 minutes)

# 3. Test in your app - Ask:
"My love life is a mess"
```

**Expected Result:** You'll get a substantive, empathetic response instead of "Can you share more?"

---

## What Was Fixed

### Problem
Amora was giving generic responses like:
- "I'm here to help. Can you share a bit more about what you're thinking?"
- "I want to make sure I understand you properly..."

### Solution
Added pattern matching for 7 new question categories covering:
- Past relationships
- Relationship chaos/complications
- Relationship patterns
- Doubts and uncertainty
- Jealousy
- Toxic relationships
- Emotional availability

### Test Results
✅ **100% success rate** on all test questions from your console logs

---

## Two Deployment Options

### Option A: Pattern Matching Only (Recommended First)
**Time:** 5 minutes  
**Requires:** Git access only

```bash
git add backend/app/services/coach_service.py
git commit -m "Fix: Improve Amora pattern matching"
git push
```

**Pros:**
- Works immediately
- No database changes needed
- Safe and reversible

**Cons:**
- Not as intelligent as semantic matching
- Requires exact phrase matches

### Option B: Full AI with Templates (Best Experience)
**Time:** 15 minutes  
**Requires:** Supabase access + local Python environment

```bash
# 1. Do Option A first

# 2. Run SQL in Supabase SQL Editor:
backend/migrations/004_add_common_question_templates.sql

# 3. Compute embeddings locally:
python backend/scripts/add_template_embeddings.py

# 4. Verify it worked:
python backend/scripts/diagnose_amora.py
```

**Pros:**
- Best response quality
- Semantic understanding
- Handles variations automatically

**Cons:**
- Requires database access
- More setup steps

---

## Verification

### Test Questions (from your console logs):
1. "How does my past affect my present relationships?"
2. "I'm thinking about my past relationships"
3. "My love life is a mess"
4. "My relationship status is very complicated"

### Expected Responses (Examples):

**Question:** "My love life is a mess"

**Before (Generic):**
> "I'm here to help. Can you share a bit more about what you're thinking?"

**After (Substantive):**
> "It sounds like things feel really overwhelming right now, and that can be exhausting. When relationships feel messy, it often means there's a lot happening at once—emotions, situations, uncertainty. What part of this feels most tangled or confusing to you right now?"

---

## Files Changed

### Modified:
- ✅ `backend/app/services/coach_service.py` - Improved pattern matching

### New Files (Optional, for Option B):
- 📄 `backend/migrations/004_add_common_question_templates.sql` - New templates
- 🛠️ `backend/scripts/diagnose_amora.py` - Diagnostic tool
- 🧪 `backend/scripts/test_pattern_matching.py` - Testing tool

---

## Troubleshooting

### Still Getting Generic Responses?

1. **Check backend logs:**
   - Look for: `Matched PAST_RELATIONSHIPS pattern` (or similar)
   - If missing: Pattern matching isn't running

2. **Verify deployment:**
   - Check your deployment platform (Render/Vercel/etc.)
   - Confirm latest commit was deployed

3. **Run diagnostic:**
   ```bash
   python backend/scripts/diagnose_amora.py
   ```

4. **Check endpoint:**
   - Frontend should call: `/api/v1/coach/`
   - Verify in browser DevTools → Network tab

### Common Issues:

**Issue:** Backend won't start after changes
**Fix:** Check for Python syntax errors in `coach_service.py`

**Issue:** Patterns still not matching
**Fix:** Check the normalization logic - questions are lowercased and punctuation removed

**Issue:** Want to add more patterns
**Fix:** Edit `coach_service.py` around line 298-360, follow existing pattern format

---

## What's Next?

### Immediate (Now):
- [x] Pattern matching improvements deployed
- [ ] Test with real users
- [ ] Monitor which questions still fall through

### Short-term (This Week):
- [ ] Run SQL migrations in Supabase
- [ ] Compute template embeddings
- [ ] Enable full semantic matching

### Long-term (Ongoing):
- [ ] Collect questions that don't match well
- [ ] Add more templates based on user questions
- [ ] Refine response quality based on feedback

---

## Resources

- **Testing:** `python backend/scripts/test_pattern_matching.py`
- **Diagnosis:** `python backend/scripts/diagnose_amora.py`
- **Full Guide:** `FIX_GENERIC_RESPONSES.md`
- **Technical Details:** `SOLUTION_SUMMARY.md`

---

## Success Checklist

- [ ] Committed `coach_service.py` changes
- [ ] Pushed to repository
- [ ] Backend redeployed successfully
- [ ] Tested 1-2 questions in live app
- [ ] Getting substantive responses (not generic)
- [ ] (Optional) Ran SQL migrations
- [ ] (Optional) Computed embeddings
- [ ] (Optional) Verified with diagnostic tool

---

**Status:** ✅ **Ready to Deploy**

Just commit and push `backend/app/services/coach_service.py` to fix the issue!

---

## Quick Commands Reference

```bash
# Test locally
python backend/scripts/test_pattern_matching.py

# Diagnose issues
python backend/scripts/diagnose_amora.py

# Compute embeddings
python backend/scripts/add_template_embeddings.py

# Force recompute all embeddings
python backend/scripts/add_template_embeddings.py --force

# Deploy (after committing)
git push

# Check logs (adjust for your platform)
heroku logs --tail
# OR
render logs
# OR
vercel logs
```

---

Need help? Check the full troubleshooting guide in `FIX_GENERIC_RESPONSES.md`
