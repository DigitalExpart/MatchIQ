# Compute Embeddings for Migration 010

After successfully applying `010_conversation_design_improvements.sql`, you need to compute embeddings for the 28 new blocks.

## Option 1: Production Admin Endpoint (Recommended)

```powershell
# Call the production admin endpoint
Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/admin/compute-embeddings" -Method POST -ContentType "application/json"
```

This will:
- Find all blocks without embeddings
- Compute embeddings using `sentence-transformers/all-MiniLM-L6-v2`
- Update the database

**Expected output:** Should process 28 new blocks (or more if there were existing blocks without embeddings).

## Option 2: Verify Before Computing

First, check how many blocks need embeddings:

```sql
-- Run in Supabase SQL Editor
SELECT 
    COUNT(*) as blocks_without_embeddings
FROM amora_response_blocks 
WHERE (topics && ARRAY['unlovable', 'breakup_intimacy_loss', 'heartbreak_general', 'relationship_intimacy_concerns', 'partner_withdrawing'])
  AND embedding IS NULL;
```

Should return **28** (the new blocks from migration 010).

## Verification After Computing

After running the compute-embeddings endpoint, verify all blocks have embeddings:

```sql
-- Should return 0
SELECT 
    COUNT(*) as blocks_still_missing_embeddings
FROM amora_response_blocks 
WHERE (topics && ARRAY['unlovable', 'breakup_intimacy_loss', 'heartbreak_general', 'relationship_intimacy_concerns', 'partner_withdrawing'])
  AND embedding IS NULL;
```

## Testing

Once embeddings are computed, test these scenarios:

1. **"I'm heartbroken"** (no breakup mentioned)
   - Should detect: `heartbreak_general`
   - Should NOT use blocks with "breakup" language

2. **"I miss our sex life"** (no ex/breakup mentioned)
   - Should detect: `relationship_intimacy_concerns`
   - Should NOT use blocks with "ex" language

3. **"I feel unlovable"** then **"my boyfriend ignores me"**
   - First message: `unlovable` topic
   - Second message: Should detect `partner_withdrawing`
   - Should prioritize linking blocks that mention both topics

4. **"I miss our sex life with my ex"**
   - Should detect: `breakup_intimacy_loss`
   - Should use blocks that mention "ex" and "physical intimacy"
