# Deployment Steps for Breakup Intimacy Loss Fix

## ✅ Step 1: SQL Migration - COMPLETE
The migration `009_breakup_intimacy_blocks.sql` has been successfully run in Supabase.

## Step 2: Compute Embeddings for New Blocks

You have two options:

### Option A: Use Admin API (Recommended)
```bash
curl -X POST https://macthiq-ai-backend.onrender.com/api/v1/admin/compute-embeddings
```

This will compute embeddings for all blocks missing them, including the 28 new blocks.

### Option B: Use Script Locally
```bash
python backend/scripts/compute_block_embeddings.py --topics breakup_grief breakup_intimacy_loss
```

## Step 3: Verify Blocks Were Inserted

Run this in Supabase SQL Editor:
```sql
-- Check total count
SELECT COUNT(*) FROM amora_response_blocks 
WHERE 'breakup_intimacy_loss' = ANY(topics) OR 'breakup_grief' = ANY(topics);

-- Should return 28

-- Check embeddings exist
SELECT COUNT(*) FROM amora_response_blocks 
WHERE ('breakup_intimacy_loss' = ANY(topics) OR 'breakup_grief' = ANY(topics))
AND embedding IS NOT NULL;

-- Should return 28 after computing embeddings
```

## Step 4: Test Topic Detection

After backend deploys, test these messages:
1. "Im heartbroken" → Should detect `breakup_grief` or `heartbreak`
2. "I miss our sex life" → Should detect `breakup_intimacy_loss`
3. "i miss the way i and my ex do have sex" → Should detect `breakup_intimacy_loss`
4. "I miss our sex and I feel unlovable" → Should detect BOTH (unlovable explicitly stated)
5. "I miss our sex" → Should NOT detect `unlovable` (guardrail working)

## Step 5: Check Backend Logs

After testing, check Render logs for:
- `[TopicDetection] HIGH PRIORITY topic detected: breakup_intimacy_loss`
- `[TopicGuardrail] Removed 'unlovable' - not explicitly stated`
- `[BlockSelection] Selected reflection block: topics=['breakup_intimacy_loss', ...]`

## Expected Behavior

**Before Fix:**
- User: "I miss our sex life"
- Amora: "It sounds like you feel broken because your interest in sex doesn't match society..." ❌

**After Fix:**
- User: "I miss our sex life"
- Amora: "It sounds like you're missing the physical closeness and connection you had with your ex, and that's a real part of what you're grieving." ✅
