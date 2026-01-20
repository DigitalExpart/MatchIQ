# Deployment Checklist: Breakup Intimacy Topic Detection Fix

## Status: ⚠️ Manual Application Required

The git diff format has trailing whitespace issues. We'll apply changes manually and verify.

---

## Step 1: Apply Code Changes ✅ (In Progress)

### Files to Modify:
1. `backend/app/services/amora_blocks_service.py`
   - [x] Add `TOPIC_POLICIES` and `EXPLICIT_MENTION_GATES` class variables
   - [ ] Update `detect_topics()` with dual-signal detection and deterministic ordering
   - [ ] Add `_apply_block_selection_filtering()` method to `BlockSelector`
   - [ ] Update `select_block()` to accept `normalized_text` parameter
   - [ ] Update `AmoraBlocksService.get_response()` to pass `normalized_text`

2. `backend/migrations/009_breakup_intimacy_blocks.sql`
   - [ ] Verify file exists and is correct

3. `backend/tests/test_topic_detection.py`
   - [ ] Verify file exists and tests are correct

---

## Step 2: Compile & Syntax Check

```bash
cd backend
python -m py_compile app/services/amora_blocks_service.py
python -m py_compile tests/test_topic_detection.py
```

---

## Step 3: Run Tests

```bash
cd backend
pytest tests/test_topic_detection.py -v
```

---

## Step 4: Apply Database Migration

1. Connect to dev/staging database
2. Run migration:
   ```sql
   -- Copy contents of backend/migrations/009_breakup_intimacy_blocks.sql
   ```
3. Verify blocks inserted:
   ```sql
   SELECT COUNT(*) FROM amora_response_blocks 
   WHERE 'breakup_intimacy_loss' = ANY(topics) 
      OR 'breakup_grief' = ANY(topics);
   ```
   Expected: 28 blocks (14 for breakup_grief, 14 for breakup_intimacy_loss)

---

## Step 5: Compute Embeddings for New Blocks

```bash
# Option 1: Use admin endpoint
curl -X POST http://localhost:8000/api/v1/admin/compute-embeddings \
  -H "Authorization: Bearer YOUR_TOKEN"

# Option 2: Use script
python backend/scripts/compute_block_embeddings.py --topics breakup_intimacy_loss breakup_grief
```

---

## Step 6: Manual QA Testing

### Test Cases:

1. **Should NOT trigger `breakup_intimacy_loss`:**
   - "I miss our sex life"
   - "Our sex life isn't the same"
   - Expected: No `breakup_intimacy_loss` topic

2. **Should trigger `breakup_intimacy_loss`:**
   - "I miss our sex life with my ex"
   - "I miss the way me and my ex used to have sex"
   - Expected: `breakup_intimacy_loss` in topics, first position

3. **Breakup grief without intimacy:**
   - "I'm heartbroken and I don't know what to do"
   - Expected: `breakup_grief` / `heartbreak` topics, no `unlovable`

4. **Explicit unlovable:**
   - "I miss my ex and I feel unlovable now"
   - Expected: Breakup topics + `unlovable` retained

### Check Logs For:
- `[TopicDetection] Final topics (ordered): ...`
- `[TopicGuardrail] ...`
- `[BlockFilter] ...`
- `[BlockSelection] ...`

---

## Step 7: Create PR

**Title:** Harden breakup intimacy topic detection & block filtering

**Description:**
- Dual-signal detection for `breakup_intimacy_loss` (requires both breakup + intimacy signals)
- Deterministic topic ordering with high-priority routing
- Guardrails to prevent `unlovable` / `lust_vs_love` from being triggered in breakup contexts unless explicitly mentioned
- Block-level filtering using `TOPIC_POLICIES` and `EXPLICIT_MENTION_GATES`
- Added non-explicit `breakup_grief` / `breakup_intimacy_loss` blocks via migration
- New tests for detection, guardrails, and ordering

---

## Step 8: Staging Deployment

1. Deploy to staging
2. Run manual QA tests
3. Monitor logs for:
   - Unexpected topic detections
   - `[BlockFilter] All blocks filtered out...` warnings
   - Any errors in topic detection/block selection

---

## Step 9: Production Deployment

1. Schedule production deploy
2. Monitor immediately after:
   - Error rates
   - 5xx responses
   - Logs for breakup/intimacy messages
3. Collect sample of real user messages (anonymized) and verify:
   - Topics detected correctly
   - Blocks selected appropriately

---

## Critical Changes Summary

### 1. Topic Detection (`TopicEmotionDetector`)
- Add `TOPIC_POLICIES` dict with allow/deny lists
- Add `EXPLICIT_MENTION_GATES` dict
- Implement dual-signal detection for `breakup_intimacy_loss`
- Return topics in deterministic order (high-priority first)

### 2. Block Selection (`BlockSelector`)
- Add `_apply_block_selection_filtering()` method
- Update `select_block()` signature to accept `normalized_text`
- Filter blocks based on `TOPIC_POLICIES` and explicit mention gates

### 3. Service Layer (`AmoraBlocksService`)
- Normalize question text
- Pass `normalized_text` to all `select_block()` calls

---

## Rollback Plan

If issues occur:
1. Revert code changes via git
2. No database rollback needed (blocks can remain, just won't be used if code is reverted)
3. Monitor error rates return to baseline
