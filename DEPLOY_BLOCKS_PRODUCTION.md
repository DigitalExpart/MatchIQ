# 🚀 Deploying Amora Blocks to Production

## What Changed

**The `/api/v1/coach/` endpoint now uses the new BLOCKS architecture for LEARN mode:**

- ✅ Block-based responses (reflection + normalization + exploration)
- ✅ Topic and emotion-aware selection
- ✅ Anti-repetition tracking
- ✅ Progressive depth per topic
- ✅ Context personalization
- ✅ Graceful fallback to legacy templates
- ✅ `engine` debug field in API responses

## Files Modified

1. **`backend/app/models/pydantic_models.py`**
   - Added `engine` field to `CoachResponse`

2. **`backend/app/api/coach_enhanced.py`**
   - Now tries `AmoraBlocksService` first for LEARN mode
   - Falls back to `AmoraEnhancedService` if blocks fail
   - Sets `engine = "blocks"` or `engine = "legacy_templates"`
   - Updated health check to show blocks count

3. **`backend/app/main.py`**
   - Added startup logging for blocks service
   - Logs count of loaded blocks with embeddings
   - Warns if blocks table is empty

4. **`backend/app/services/amora_blocks_service.py`**
   - Added `get_blocks_count()` method for health checks

## Deployment Steps

### 1. Run the Migration on Supabase

```sql
-- Run this in Supabase SQL Editor:
-- backend/migrations/005_amora_blocks_architecture.sql
```

This creates the `amora_response_blocks` table with 87 pre-populated blocks.

### 2. Compute Embeddings

**Option A: On Render (after deployment)**

```bash
# SSH into Render or use their console
cd /opt/render/project/src
python backend/scripts/compute_block_embeddings.py
```

**Option B: Locally (then push to production)**

```bash
# Make sure you have production env vars
python backend/scripts/compute_block_embeddings.py
```

This will compute embeddings for all 87 blocks and store them in the database.

### 3. Deploy to Render

```bash
git add .
git commit -m "feat: enable Amora Blocks architecture for production"
git push origin main
```

Render will automatically deploy.

### 4. Verify Deployment

**Check startup logs in Render dashboard:**

Look for:
```
✅ Amora Blocks Service: Loaded 87 blocks with embeddings
```

If you see:
```
⚠️  Amora Blocks Service: NO BLOCKS FOUND!
```

Then embeddings weren't computed. Run step 2.

**Test the API:**

```bash
curl https://macthiq-ai-backend.onrender.com/api/v1/coach/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "amora_blocks_primary",
  "version": "2.0.0-blocks",
  "blocks_loaded": 87,
  "fallback": "legacy_templates"
}
```

**Test a real question:**

```bash
curl -X POST https://macthiq-ai-backend.onrender.com/api/v1/coach/ \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "LEARN",
    "specific_question": "My girlfriend cheated on me with my best friend",
    "session_id": "test123"
  }'
```

Expected response:
```json
{
  "message": "I can hear how much pain...",  // Multi-sentence, empathetic
  "mode": "LEARN",
  "confidence": 0.85,
  "referenced_data": {
    "topics": ["cheating", "betrayed"],
    "emotions": ["hurt", "betrayed"],
    "stage": 1
  },
  "engine": "blocks"  // ⭐ THIS CONFIRMS BLOCKS ARE WORKING
}
```

## Troubleshooting

### ❌ Still seeing `"engine": "legacy_templates"`?

**Check Render logs for errors:**

1. Go to https://dashboard.render.com
2. Open your backend service
3. Click "Logs"
4. Look for:
   ```
   AmoraBlocksService failed, falling back to legacy templates: {error}
   ```

**Common issues:**

1. **Embeddings not computed:**
   ```
   ⚠️  Amora Blocks Service: NO BLOCKS FOUND!
   ```
   **Fix:** Run `python backend/scripts/compute_block_embeddings.py`

2. **Migration not run:**
   ```
   relation "amora_response_blocks" does not exist
   ```
   **Fix:** Run migration 005 in Supabase SQL Editor

3. **Postgres pgvector extension not enabled:**
   ```
   type "vector" does not exist
   ```
   **Fix:** Run `CREATE EXTENSION IF NOT EXISTS vector;` in Supabase

### ⚠️ Still seeing generic responses?

Clear your browser cache and try a new session_id.

The old responses might be cached.

## Success Criteria

✅ `/api/v1/coach/health` shows `"blocks_loaded": 87`

✅ API responses show `"engine": "blocks"`

✅ Responses are multi-sentence, emotionally specific

✅ No repeated generic "Can you share more?" lines in the same conversation

## Rollback Plan

If something goes wrong, revert to legacy templates:

```python
# In backend/app/api/coach_enhanced.py, comment out blocks logic:

# Try blocks service first (for LEARN mode)
# if request.mode == "LEARN":
#     try:
#         blocks_service = AmoraBlocksService()
#         ...

# Use enhanced service directly:
enhanced_service = AmoraEnhancedService()
response = enhanced_service.get_response(request, user_id, is_paid_user)
response.engine = "legacy_templates"
return response
```

Then redeploy.

---

**Questions?** Check Render logs or test locally first with the same .env settings.
