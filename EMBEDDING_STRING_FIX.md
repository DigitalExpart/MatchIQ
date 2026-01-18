# 🎯 EMBEDDING STRING PARSING FIX

## Problem Identified

From Render logs at `2026-01-16 00:20:00` and `00:25:35`:

```
ValueError: could not convert string to float: '[-0.015186559,-0.088020995,0.06929704,...'
```

**Root Cause:**
- Supabase was returning embeddings as **JSON strings** (e.g., `"[-0.015186559,...]"`)
- The code was trying to convert them directly to `np.array()` without parsing
- `numpy` cannot convert a string representation of an array to an actual array

## Symptoms

- ✅ Blocks were being fetched correctly (94 blocks with embeddings)
- ✅ Block text was present and valid
- ❌ Cosine similarity calculation failed with `ValueError`
- ❌ All block selections failed, resulting in empty messages
- ❌ Response: `message_length=0, preview: ...`

## The Fix

**File:** `backend/app/services/amora_blocks_service.py`

**Line 241-251** (previously):
```python
if block_data.get('embedding'):
    candidates.append(ResponseBlock(
        id=block_data['id'],
        block_type=block_data['block_type'],
        text=block_data['text'],
        topics=block_data.get('topics', []),
        emotions=block_data.get('emotions', []),
        stage=block_data['stage'],
        priority=block_data.get('priority', 50),
        embedding=np.array(block_data['embedding'])  # ❌ FAILS if string
    ))
```

**Line 241-257** (fixed):
```python
if block_data.get('embedding'):
    # Parse embedding (may be string or list)
    embedding_data = block_data['embedding']
    if isinstance(embedding_data, str):
        import json
        embedding_data = json.loads(embedding_data)
    
    candidates.append(ResponseBlock(
        id=block_data['id'],
        block_type=block_data['block_type'],
        text=block_data['text'],
        topics=block_data.get('topics', []),
        emotions=block_data.get('emotions', []),
        stage=block_data['stage'],
        priority=block_data.get('priority', 50),
        embedding=np.array(embedding_data)  # ✅ Now works with both
    ))
```

## Why This Happened

Supabase's PostgREST API returns JSONB arrays as JSON strings when accessed via the Python client. The `embedding` column (type `vector(384)`) is serialized as a JSON string for transport.

## Deployment

**Commit:** `e236751`
**Branch:** `backend`
**Pushed:** 2026-01-16 00:XX UTC

Render will auto-deploy this fix. Expected deployment time: ~5-7 minutes.

## Expected Result After Fix

When you test again:

```json
{
  "message": "I can hear how much pain you're carrying right now, and I'm so sorry. Breakups can feel like your whole world is shifting, and that's incredibly painful. When you think about all of this, what part hurts the most right now?",
  "mode": "LEARN",
  "confidence": 0.85,
  "engine": "blocks"
}
```

✅ Multi-sentence, emotionally specific responses
✅ No more empty messages
✅ Proper block composition (reflection + normalization + exploration)
✅ No more `ValueError` in logs

## Testing

Wait for Render deployment to complete, then run:

```powershell
.\test_amora_detailed.ps1
```

Or test via frontend with:
- "My girlfriend broke up with me, she cheated on me with my best friend... I'm very hurt right now..."

You should see a rich, empathetic, multi-block response! 🎉
