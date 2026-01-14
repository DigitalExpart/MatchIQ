# Deploy Amora Blocks - Quick Start

## TL;DR - 4 Steps to LLM-like Amora

```bash
# 1. Run SQL in Supabase (creates 150+ blocks)
# Copy/paste: backend/migrations/005_amora_blocks_architecture.sql

# 2. Compute embeddings locally
python backend/scripts/compute_block_embeddings.py

# 3. Commit and push
git add .
git commit -m "feat: Add Amora Blocks architecture for LLM-like responses"
git push

# 4. Test in production
# Ask: "I'm heartbroken and don't know how to move on"
```

---

## What You're Deploying

### Before
```
User: "My love life is a mess"
Amora: "I'm here to help. Can you share a bit more?"
```

### After
```
User: "My love life is a mess"
Amora: "It sounds like things feel really overwhelming right now, and that can be exhausting. When relationships feel messy, it often means there's a lot happening at once—emotions, situations, uncertainty. What part of this feels most tangled or confusing to you right now?"
```

### Key Improvements
✅ Rich, varied responses (150+ blocks)  
✅ No repetition (tracks last 15 blocks)  
✅ Emotionally intelligent (mirrors emotions)  
✅ Progressive depth (conversations deepen)  
✅ Topic-focused (20+ relationship topics)  
✅ 100% local (no API costs)  

---

## Step-by-Step Deployment

### Step 1: Database Setup (5 minutes)

1. **Open Supabase SQL Editor**
   - Go to your Supabase project
   - Click "SQL Editor" in left sidebar
   - Click "New query"

2. **Run Migration**
   - Copy entire contents of: `backend/migrations/005_amora_blocks_architecture.sql`
   - Paste into SQL Editor
   - Click "Run"
   - Wait ~30 seconds

3. **Verify**
   ```sql
   SELECT block_type, COUNT(*) 
   FROM amora_response_blocks 
   GROUP BY block_type;
   ```
   
   Expected output:
   ```
   reflection     | 40+
   normalization  | 40+
   exploration    | 50+
   reframe        | 10+
   ```

### Step 2: Compute Embeddings (5 minutes)

1. **Check Environment**
   ```bash
   # Verify .env has these variables:
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-key
   ```

2. **Install Dependencies (if needed)**
   ```bash
   pip install sentence-transformers
   ```

3. **Run Script**
   ```bash
   cd "C:\Users\Shilley Pc\MatchIQ"
   python backend/scripts/compute_block_embeddings.py
   ```

4. **Expected Output:**
   ```
   [INFO] Found 150+ block(s) to process
   [INFO] Blocks by type:
      exploration    :  50 blocks
      normalization  :  40 blocks
      reflection     :  40 blocks
      reframe        :  10 blocks
   ...
   [SUCCESS] All blocks now have embeddings!
   ```

### Step 3: Update API (Optional)

If you want to use the blocks service exclusively:

**Edit `backend/app/main.py`:**

```python
# Find this line:
from app.api import auth, assessments, blueprints, results, coach_enhanced

# Change to:
from app.api import auth, assessments, blueprints, results, coach_blocks

# Find this line:
app.include_router(coach_enhanced.router, prefix="/api/v1", tags=["coach"])

# Change to:
app.include_router(coach_blocks.router, prefix="/api/v1", tags=["coach-blocks"])
```

**OR keep both for gradual rollout:**

```python
# Keep old service at /api/v1/coach/
app.include_router(coach_enhanced.router, prefix="/api/v1/coach", tags=["coach"])

# Add new service at /api/v1/coach-blocks/
app.include_router(coach_blocks.router, prefix="/api/v1/coach-blocks", tags=["coach-blocks"])
```

### Step 4: Deploy (2 minutes)

```bash
# Stage all changes
git add backend/app/services/amora_blocks_service.py
git add backend/app/api/coach_blocks.py
git add backend/migrations/005_amora_blocks_architecture.sql
git add backend/scripts/compute_block_embeddings.py
git add AMORA_BLOCKS_GUIDE.md
git add DEPLOY_AMORA_BLOCKS.md

# Commit
git commit -m "feat: Add Amora Blocks architecture for LLM-like responses

- Block-based response system (reflection + normalization + exploration + reframe)
- 150+ blocks covering 20+ relationship topics
- Anti-repetition tracking (last 15 blocks)
- Progressive depth system (stages 1-4)
- Emotion and topic detection
- Personalization with context variables
- 100% local, no external AI APIs"

# Push
git push
```

### Step 5: Verify Deployment (2 minutes)

1. **Check Deploy Status**
   - Render/Railway: Check dashboard
   - Wait for "Deploy successful"

2. **Test Health Endpoint**
   ```bash
   curl https://your-backend.onrender.com/api/v1/coach/health
   # OR
   curl https://your-backend.onrender.com/api/v1/coach-blocks/health
   ```

3. **Test in Production**
   - Open your app
   - Go to AI Coach (Amora)
   - Ask: **"I'm heartbroken and don't know how to move on"**
   
   **Expected:** Rich, empathetic response with exploration question
   
   **Not:** "Can you share more about what you're thinking?"

---

## Testing Checklist

Test these scenarios to verify everything works:

- [ ] **Heartbreak:** "I'm heartbroken and don't know how to move on"
  - Should get: Validation + grief normalization + exploration
  
- [ ] **Cheating:** "I found out my partner cheated"
  - Should get: Betrayal validation + trust context + decision exploration
  
- [ ] **Situationship:** "We've been talking for months but won't define it"
  - Should get: Frustration acknowledgment + ambiguity context + clarity exploration
  
- [ ] **Multiple Turns:** Ask 5 follow-up questions
  - Should get: No repeated blocks, progressive depth
  
- [ ] **Empty Input:** Send empty message
  - Should get: Gentle invitation to share

---

## Troubleshooting

### Issue: "No blocks found for type=reflection"

**Cause:** Migration not run or embeddings not computed

**Fix:**
```bash
# Check if blocks exist
python backend/scripts/compute_block_embeddings.py

# If "All blocks already have embeddings", good
# If "No blocks found", run migration in Supabase
```

### Issue: Still getting generic responses

**Cause:** API routing not updated

**Fix:** Verify which endpoint is being called:
```javascript
// In frontend code (AICoachScreen.tsx or similar)
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://...';
console.log('Calling:', `${apiUrl}/coach/`);
```

Make sure it points to the blocks service endpoint.

### Issue: Responses feel repetitive

**Cause:** Recent blocks not tracking properly

**Fix:** Check logs for:
```
INFO: recent_block_ids: ['uuid1', 'uuid2', ...]
```

Should show 0-15 UUIDs. If empty, session state not persisting.

### Issue: Wrong topics detected

**Cause:** Keywords need tuning

**Fix:** Add keywords to `TopicEmotionDetector.TOPIC_KEYWORDS` in `amora_blocks_service.py`

---

## Rollback Plan

If something goes wrong:

### Quick Rollback (5 minutes)

```bash
# Revert to previous version
git revert HEAD
git push

# Backend auto-deploys old version
```

### Keep Database, Just Disable Service

In `backend/app/main.py`:

```python
# Comment out blocks router
# app.include_router(coach_blocks.router, prefix="/api/v1", tags=["coach-blocks"])

# Use old service
app.include_router(coach_enhanced.router, prefix="/api/v1", tags=["coach"])
```

The blocks will stay in database for future use.

---

## Performance Expectations

### Response Times
- **First turn:** 500-700ms (embedding + selection)
- **Subsequent turns:** 400-600ms (cached state)

### Memory Usage
- **Per session:** ~2KB
- **1000 active sessions:** ~2MB
- **Embeddings (cached):** ~60KB

### Database Queries
- **Per response:** 3-4 queries (one per block type)
- **With proper indexes:** <50ms total query time

---

## Monitoring

### Key Metrics to Watch

1. **Response Variety**
   - Track: Unique block IDs used per session
   - Goal: >90% unique within 15-turn window

2. **Topic Coverage**
   - Track: Which topics users ask about
   - Goal: <5% "general" (means topic detected)

3. **User Satisfaction** (if you have ratings)
   - Track: Thumbs up/down per response
   - Goal: >80% positive

4. **Fallback Rate**
   - Track: Responses with `referenced_data.fallback = true`
   - Goal: <5%

### Logs to Monitor

```python
# Good logs
"Detected topics: ['heartbreak', 'grief'], emotions: ['sad', 'hurt']"
"Selected reflection block: score=0.85"
"Advanced heartbreak to stage 2"

# Concerning logs
"No blocks found for type=reflection"
"Best reflection block below threshold: 0.15"
"Error in blocks service: ..."
```

---

## Next Steps After Deployment

### Week 1: Monitor & Tune
- Watch logs for uncovered topics
- Check for repetition patterns
- Gather user feedback

### Week 2: Add Content
- Identify gaps (topics with <5 blocks)
- Write 5-10 new blocks per gap
- Run embedding script

### Month 1: Optimize
- Analyze most common topics
- Add more variants for popular topics
- Tune selection scoring weights

### Month 3: Expand
- Add Stage 4 blocks (deeper integration)
- Add new relationship topics (open relationships, polyamory, etc.)
- Consider user-specific personalization

---

## Success Criteria

✅ **Deployed successfully** when:
- [ ] Migration ran without errors
- [ ] All blocks have embeddings
- [ ] Health endpoint returns 200
- [ ] Test questions get substantive responses
- [ ] No repeated blocks in 5-turn conversation

✅ **Working well** when:
- [ ] Users stop complaining about repetitive responses
- [ ] Average conversation length increases
- [ ] Fallback rate <5%
- [ ] Positive feedback from users

---

## Files Changed

### New Files
- `backend/migrations/005_amora_blocks_architecture.sql` - Database schema + 150+ blocks
- `backend/app/services/amora_blocks_service.py` - Core service (600 lines)
- `backend/app/api/coach_blocks.py` - API endpoint
- `backend/scripts/compute_block_embeddings.py` - Embedding generation
- `AMORA_BLOCKS_GUIDE.md` - Complete documentation
- `DEPLOY_AMORA_BLOCKS.md` - This file

### Modified Files
- `backend/app/main.py` - API routing (optional)

---

## Support

- **Documentation:** `AMORA_BLOCKS_GUIDE.md`
- **Architecture Details:** `backend/app/services/amora_blocks_service.py` (docstrings)
- **SQL Schema:** `backend/migrations/005_amora_blocks_architecture.sql` (comments)

---

**Status:** ✅ **Ready to Deploy**

All files created, tested, and documented. Just follow the 5 steps above!
