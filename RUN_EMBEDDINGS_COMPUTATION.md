# Compute Embeddings Using Admin API Endpoint

The admin endpoint `/api/v1/admin/compute-embeddings` queries blocks with `embedding IS NULL` directly, which works better than fetching all blocks.

## Step 1: Start Your Backend

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Step 2: Call the Admin Endpoint

**Option A: Using curl (if backend is running locally)**

```bash
curl -X POST http://localhost:8000/api/v1/admin/compute-embeddings \
  -H "Content-Type: application/json"
```

**Option B: Using PowerShell (if backend is running locally)**

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/admin/compute-embeddings" -Method POST -ContentType "application/json"
```

**Option C: Using Python requests**

```python
import requests
response = requests.post("http://localhost:8000/api/v1/admin/compute-embeddings")
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

## Step 3: Verify in Supabase

After running, verify embeddings were computed:

```sql
-- Should return 0 (all blocks should have embeddings now)
SELECT COUNT(*) as blocks_without_embeddings
FROM amora_response_blocks 
WHERE ('breakup_intimacy_loss' = ANY(topics) OR 'breakup_grief' = ANY(topics))
  AND embedding IS NULL;
```

Expected: **0**

---

## Alternative: Direct Python Script (If Admin Endpoint Not Available)

If you can't use the admin endpoint, you can modify the script to query specifically for these topics with proper NULL checking:

```python
# Quick script to compute embeddings for breakup topics
import os
from supabase import create_client
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

model = SentenceTransformer('all-MiniLM-L6-v2')

# Query blocks with these topics AND NULL embeddings
response = supabase.table('amora_response_blocks') \
    .select('id, text, topics') \
    .eq('active', True) \
    .is_('embedding', 'null') \
    .execute()

# Filter for our topics
target_topics = ['breakup_intimacy_loss', 'breakup_grief']
blocks = [
    b for b in (response.data or [])
    if any(topic in (b.get('topics') or []) for topic in target_topics)
]

print(f"Found {len(blocks)} blocks to process")

for block in blocks:
    embedding = model.encode(block['text']).tolist()
    supabase.table('amora_response_blocks') \
        .update({'embedding': embedding}) \
        .eq('id', block['id']) \
        .execute()
    print(f"Processed: {block['id'][:8]}")

print(f"Done! Processed {len(blocks)} blocks")
```
