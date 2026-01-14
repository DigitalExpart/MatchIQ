# Fixing Generic Amora Responses

## Problem
Amora is giving generic "clarifying" responses like:
- "I'm here to help. Can you share a bit more about what you're thinking?"
- "I want to make sure I understand you properly. Can you tell me a little more about what's going on?"

Instead of substantive, contextual responses to relationship questions.

## Root Cause
The **AmoraEnhancedService** is working correctly, but it's falling back to generic responses because:
1. The `amora_templates` table may not have embeddings computed yet
2. Or the templates don't exist in the production database
3. Or there's no matching template for the specific question

## Quick Fix (Immediate - Works Without Database Changes)

I've already updated `backend/app/services/coach_service.py` with better pattern matching for common questions:

**New patterns added:**
- Past relationships ("How does my past affect my present relationships?")
- Relationship feeling messy ("My love life is a mess")
- Complicated status ("My relationship status is complicated")
- Relationship patterns ("I keep dating the same type of person")
- Doubts ("I have doubts about my relationship")
- Jealousy ("I feel jealous")
- Toxic relationships ("Is my relationship toxic?")
- Emotional availability

**To deploy this fix:**
1. Commit the changes to `backend/app/services/coach_service.py`
2. Push to your repository
3. The backend will automatically redeploy with the improved pattern matching

## Complete Fix (Database + Embeddings)

For the best experience, follow these steps in order:

### Step 1: Diagnose the Current State
```bash
python backend/scripts/diagnose_amora.py
```

This will tell you:
- ✅ What's working
- ❌ What's broken
- 💡 What to do next

### Step 2: Create/Update Database Tables

If the `amora_templates` table doesn't exist or needs updates:

1. **Open Supabase SQL Editor**
2. **Run migrations in order:**
   ```sql
   -- First, run the base migration
   backend/migrations/002_amora_templates.sql
   
   -- Then, run the new templates migration
   backend/migrations/004_add_common_question_templates.sql
   ```

Alternatively, if starting fresh, run:
```sql
RUN_THIS_IN_SUPABASE.sql
```
Then:
```sql
backend/migrations/004_add_common_question_templates.sql
```

### Step 3: Compute Embeddings

After templates are in the database, compute their embeddings:

```bash
# Make sure you have sentence-transformers installed
pip install sentence-transformers

# Run the embedding script
python backend/scripts/add_template_embeddings.py
```

**Expected output:**
```
[INFO] Connecting to Supabase...
[INFO] Loading sentence-transformers model (all-MiniLM-L6-v2)...
[INFO] Found X template(s) to process
...
[COMPLETE] Processed X template(s)
   ✅ Success: X
[SUCCESS] ✅ All templates now have embeddings!
```

### Step 4: Verify the Fix

Run the diagnostic again:
```bash
python backend/scripts/diagnose_amora.py
```

You should see:
```
✅ EVERYTHING LOOKS GOOD!
   Your Amora Enhanced Service should be working correctly.
```

## Testing Locally

Test with the same questions from your console logs:

```bash
curl -X POST http://localhost:8000/api/v1/coach/ \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "LEARN",
    "specific_question": "How does my past affect my present relationships?"
  }'
```

Expected response (after fixes):
```json
{
  "message": "Your past experiences often shape how you approach relationships now—that's natural. Sometimes patterns from previous relationships can influence what feels safe or comfortable...",
  "mode": "LEARN",
  "confidence": 0.8
}
```

## New Templates Added

I've created 10 new templates in `004_add_common_question_templates.sql` that cover:

1. **Past relationships** - "How does my past affect my present relationships?"
2. **Relationship mess** - "My love life is a mess"
3. **Complicated status** - "My relationship status is complicated"
4. **Relationship patterns** - "I keep making the same mistakes"
5. **Emotional availability** - "Am I emotionally available?"
6. **Relationship doubt** - "I have doubts about my relationship"
7. **Emotional pain** - "I'm hurting"
8. **Relationship stages** - "What are the stages of a relationship?"
9. **Jealousy** - "I feel jealous"
10. **Toxic relationships** - "Is my relationship toxic?"

## Architecture Overview

```
Frontend (AICoachScreen.tsx)
    ↓
    POST /api/v1/coach/
    ↓
backend/app/api/coach_enhanced.py (✅ Currently active)
    ↓
backend/app/services/amora_enhanced_service.py
    ↓
    ├─→ Generate question embedding (sentence-transformers)
    ├─→ Detect emotions & intent
    ├─→ Find best template match (cosine similarity)
    ├─→ Apply confidence gating
    ├─→ Add emotional mirroring
    └─→ Return response
    
    ↓ (if no match or error)
    
    Fallback to _safe_fallback()
    → Generic "clarifying" response
```

## Deployment Checklist

- [ ] Run `diagnose_amora.py` to understand current state
- [ ] Run SQL migrations in Supabase (if needed)
- [ ] Run `add_template_embeddings.py` (if needed)
- [ ] Verify with `diagnose_amora.py` again
- [ ] Commit updated `coach_service.py` (improved pattern matching)
- [ ] Push to repository
- [ ] Backend auto-deploys
- [ ] Test in production with real questions

## Common Issues

### Issue: "No templates found in database"
**Solution:** Run the SQL migrations in Supabase SQL Editor

### Issue: "Templates missing embeddings"
**Solution:** Run `python backend/scripts/add_template_embeddings.py`

### Issue: "sentence-transformers not installed"
**Solution:** 
```bash
pip install sentence-transformers
```
Or add to `requirements.txt` and redeploy

### Issue: "Still getting generic responses after fixes"
**Possible causes:**
1. Embeddings not computed - Run diagnostic script
2. Vector extension not installed in Supabase - Run: `CREATE EXTENSION IF NOT EXISTS vector;`
3. Templates not active - Check `active = true` in database
4. Very low similarity scores - Add more example questions to templates

## Monitoring & Debugging

Check backend logs for these messages:
```
INFO: Amora request: mode=LEARN, question='...', has_context=True
INFO: Amora response: mode=LEARN, message_length=200, confidence=0.8
```

If you see:
```
ERROR: Error finding template: ...
```
Then there's a database or embedding issue.

If you see:
```
WARNING: No templates found for confidence level: LOW
```
Then templates aren't in the database or don't match the confidence level.

## Next Steps

1. **Immediate:** Deploy the improved `coach_service.py` (already done in this session)
2. **Short-term:** Run the database setup and embedding scripts
3. **Long-term:** Add more templates based on actual user questions
4. **Monitoring:** Set up logging to track which questions fall through to fallback

## Resources

- **Templates:** `backend/migrations/004_add_common_question_templates.sql`
- **Pattern Matching:** `backend/app/services/coach_service.py` (lines 298-350)
- **Enhanced Service:** `backend/app/services/amora_enhanced_service.py`
- **Diagnostic Tool:** `backend/scripts/diagnose_amora.py`
- **Embedding Tool:** `backend/scripts/add_template_embeddings.py`

---

**Questions?** Check the diagnostic script output first, then review the backend logs.
