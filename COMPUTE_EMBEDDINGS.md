# Compute Embeddings for New Blocks

## Option 1: Admin API Endpoint (Recommended)

If your backend is running locally:

```bash
# Make sure backend is running
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# In another terminal, call the admin endpoint
curl -X POST http://localhost:8000/api/v1/admin/compute-embeddings \
  -H "Content-Type: application/json"
```

Or if you need authentication:

```bash
curl -X POST http://localhost:8000/api/v1/admin/compute-embeddings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Option 2: Python Script

```bash
cd backend
python scripts/compute_block_embeddings.py --topics breakup_intimacy_loss breakup_grief
```

## Option 3: Direct Supabase (if you have access)

You can also compute embeddings directly if you have the embedding model available, but the admin endpoint is the easiest.

---

## Verify Embeddings Were Computed

After running the embedding computation, verify in Supabase:

```sql
-- Should return 0 (all blocks should have embeddings now)
SELECT COUNT(*) as blocks_without_embeddings
FROM amora_response_blocks 
WHERE ('breakup_intimacy_loss' = ANY(topics) OR 'breakup_grief' = ANY(topics))
  AND embedding IS NULL;

-- Should return 28 (or 56 if counting all blocks with these topics)
SELECT COUNT(*) as blocks_with_embeddings
FROM amora_response_blocks 
WHERE ('breakup_intimacy_loss' = ANY(topics) OR 'breakup_grief' = ANY(topics))
  AND embedding IS NOT NULL;
```

---

## Next Steps After Embeddings

Once embeddings are computed:

1. ✅ **Test topic detection:**
   - "I miss our sex life with my ex" → Should detect `breakup_intimacy_loss`
   - "I'm heartbroken" → Should detect `breakup_grief`
   - "I miss our sex life" (without "ex") → Should NOT detect `breakup_intimacy_loss`

2. ✅ **Test block filtering:**
   - Messages about missing intimacy with ex should NOT return "unlovable" blocks
   - Messages about breakup grief should NOT return "unlovable" blocks unless explicitly stated

3. ✅ **Monitor logs:**
   - Check for `[TopicDetection]`, `[BlockFilter]`, and `[BlockSelection]` log messages
   - Verify `forced_topic` is correct
   - Verify `selected_block_topic` matches the detected topic
