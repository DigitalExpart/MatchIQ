# Amora Topic Detection Fix - Breakup Intimacy Loss

## Problem Summary
Amora was giving mismatched responses when users talked about missing physical intimacy with an ex after a breakup. Messages like "I miss our sex life" or "i miss the way i and my ex do have sex" were triggering generic topics like "unlovable" or "lust_vs_love" instead of breakup-specific intimacy loss topics.

## Root Cause Analysis

1. **No text normalization**: "Im" vs "I'm", "dont" vs "don't" caused keyword mismatches
2. **Missing topic**: No `breakup_intimacy_loss` topic existed for missing sex/intimacy with ex
3. **Weak topic detection**: Simple keyword matching without priority routing
4. **No guardrails**: Wrong topics (unlovable, lust_vs_love) were selected even when breakup context was clear
5. **Semantic similarity picking wrong blocks**: Embeddings were finding semantically "close" but topic-wrong blocks

## Solution Implemented

### A) Text Normalization
- Added `normalize_text()` method that:
  - Lowercases text
  - Normalizes contractions ("im" → "i am", "dont" → "do not")
  - Removes punctuation
  - Collapses whitespace
- Applied to both topic and emotion detection

### B) Priority-Based Topic Detection
- Added `HIGH_PRIORITY_TOPICS` dictionary checked FIRST:
  - `breakup_intimacy_loss`: High-priority keywords for missing sex/intimacy with ex
  - `breakup_grief`: High-priority keywords for grieving breakups
- These topics override generic topic detection

### C) Topic Guardrails
- Added `_apply_topic_guardrails()` method that:
  - Removes "unlovable" when breakup_intimacy_loss detected (unless explicitly stated)
  - Removes "lust_vs_love" when breakup_intimacy_loss detected
  - Removes "unlovable" when breakup_grief detected (unless explicitly stated)
- Prevents wrong topic blocks from being selected

### D) Enhanced Logging
- Added detailed logging for:
  - Normalized text
  - Topic detection process
  - Guardrail actions
  - Block selection with scores and topics

### E) New Blocks (SQL Migration)
- Created `009_breakup_intimacy_blocks.sql` with:
  - 14 blocks for `breakup_grief` (reflection, normalization, insight, exploration)
  - 14 blocks for `breakup_intimacy_loss` (reflection, normalization, insight, exploration)
- All blocks are non-explicit, ethical, and relationship-focused
- Priority set to 90-95 for high relevance

### F) Test Suite
- Created `tests/test_topic_detection.py` with pytest tests:
  - Heartbreak detection
  - Missing ex detection
  - Missing sex life → breakup_intimacy_loss
  - Missing way we had sex → breakup_intimacy_loss
  - Guardrails (unlovable removal)
  - Text normalization
  - Priority routing

## Files Changed

1. **backend/app/services/amora_blocks_service.py**
   - Added `normalize_text()` static method
   - Added `HIGH_PRIORITY_TOPICS` dictionary
   - Enhanced `detect_topics()` with normalization and priority routing
   - Added `_apply_topic_guardrails()` method
   - Updated `detect_emotions()` to use normalized text
   - Enhanced logging throughout
   - Added `breakup_grief` and `breakup_intimacy_loss` to `HEAVY_TOPICS`

2. **backend/migrations/009_breakup_intimacy_blocks.sql**
   - 28 new blocks for breakup grief and intimacy loss
   - Ready to run in Supabase SQL Editor

3. **backend/tests/test_topic_detection.py**
   - Comprehensive test suite for topic detection

## Deployment Steps

1. **Run SQL Migration**:
   ```sql
   -- Copy contents of backend/migrations/009_breakup_intimacy_blocks.sql
   -- Run in Supabase SQL Editor
   ```

2. **Compute Embeddings**:
   ```bash
   # Option 1: Use admin API endpoint
   curl -X POST https://macthiq-ai-backend.onrender.com/api/v1/admin/compute-embeddings
   
   # Option 2: Run script locally
   python backend/scripts/compute_block_embeddings.py --topics breakup_grief breakup_intimacy_loss
   ```

3. **Verify Blocks**:
   ```sql
   -- Check blocks were inserted
   SELECT COUNT(*) FROM amora_response_blocks 
   WHERE 'breakup_intimacy_loss' = ANY(topics) OR 'breakup_grief' = ANY(topics);
   
   -- Check embeddings exist
   SELECT COUNT(*) FROM amora_response_blocks 
   WHERE ('breakup_intimacy_loss' = ANY(topics) OR 'breakup_grief' = ANY(topics))
   AND embedding IS NOT NULL;
   ```

4. **Test**:
   ```bash
   # Run pytest tests
   pytest backend/tests/test_topic_detection.py -v
   ```

## Expected Behavior After Fix

**Before:**
- User: "I miss our sex life"
- Amora: "It sounds like you feel broken because your interest in sex doesn't match society..." ❌

**After:**
- User: "I miss our sex life"
- Amora: "It sounds like you're missing the physical closeness and connection you had with your ex, and that's a real part of what you're grieving." ✅

## Testing Examples

Test these messages to verify fix:
1. "Im heartbroken" → Should detect `breakup_grief` or `heartbreak`
2. "I miss our sex life" → Should detect `breakup_intimacy_loss`
3. "i miss the way i and my ex do have sex" → Should detect `breakup_intimacy_loss`
4. "I miss our sex and I feel unlovable" → Should detect BOTH (unlovable explicitly stated)
5. "I miss our sex" → Should NOT detect `unlovable` (guardrail)

## Notes

- All blocks are non-explicit and relationship-focused
- Guardrails prevent wrong topics but allow explicit user statements
- Text normalization handles common typos and contractions
- Priority routing ensures specific topics override generic ones
- Logging helps debug any remaining issues
