# Compute Embeddings Using Production Backend

Since your backend is already live on Render, call the **production endpoint** directly:

## Call Production Admin Endpoint

**Using PowerShell:**

```powershell
Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/admin/compute-embeddings" -Method POST -ContentType "application/json"
```

**Using curl (if available):**

```bash
curl -X POST https://macthiq-ai-backend.onrender.com/api/v1/admin/compute-embeddings -H "Content-Type: application/json"
```

**Using Python:**

```python
import requests
response = requests.post("https://macthiq-ai-backend.onrender.com/api/v1/admin/compute-embeddings")
print(response.json())
```

## Expected Response

```json
{
  "status": "success",
  "message": "Computed embeddings for 28 blocks",
  "processed": 28,
  "total": 28,
  "success_rate": "100.0%"
}
```

## Verify After Running

Check in Supabase SQL Editor:

```sql
-- Should return 0 (all blocks should have embeddings now)
SELECT COUNT(*) as blocks_without_embeddings
FROM amora_response_blocks 
WHERE ('breakup_intimacy_loss' = ANY(topics) OR 'breakup_grief' = ANY(topics))
  AND embedding IS NULL;
```

Expected: **0**

---

## Why This Works

1. ✅ **No local setup needed** - Uses your already-deployed backend
2. ✅ **Production database** - Directly updates the same database your app uses
3. ✅ **Handles pagination** - The endpoint queries `embedding IS NULL` directly, which works correctly
4. ✅ **Same credentials** - Uses your Render environment variables

---

## After Embeddings Are Computed

Once embeddings are computed, your topic detection improvements will be fully active:

- ✅ Dual-signal detection for `breakup_intimacy_loss`
- ✅ Deterministic topic ordering
- ✅ Block-level filtering to prevent wrong topics
- ✅ All 28 new blocks ready to use

You can test with messages like:
- "I miss our sex life with my ex" → Should detect `breakup_intimacy_loss`
- "I'm heartbroken" → Should detect `breakup_grief`
