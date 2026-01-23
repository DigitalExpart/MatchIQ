# Conversation Design Improvements - Implementation Summary

## Overview

This implementation addresses the core UX problems identified in Amora's conversation design:
1. **Weak session continuity** - Amora now links back to previous topics
2. **Over-assuming context** - Dual-signal detection prevents incorrect assumptions
3. **Over-labeling emotions** - Only explicit emotion mentions are used
4. **Generic/mismatched responses** - New specific topics and rewritten blocks

## Files Created/Modified

### 1. SQL Migration: `backend/migrations/010_conversation_design_improvements.sql`
- **28 new blocks** across 5 topics:
  - `unlovable` (8 blocks) - Rewritten with softer, less dismissive language
  - `breakup_intimacy_loss` (8 blocks) - Already good, minor polish
  - `heartbreak_general` (3 blocks) - NEW: Heartbreak NOT about breakup
  - `relationship_intimacy_concerns` (3 blocks) - NEW: Current relationship intimacy issues
  - `partner_withdrawing` (4 blocks) - NEW: Specific withdrawal behaviors
  - **Linking blocks** (2 blocks) - Session continuity for `unlovable` + `partner_withdrawing` and `breakup_grief` + `breakup_intimacy_loss`

### 2. Backend Logic: `backend/app/services/amora_blocks_service.py`

#### Topic Detection Updates:
- **New topics added:**
  - `heartbreak_general` - Heartbreak WITHOUT breakup signal
  - `relationship_intimacy_concerns` - Intimacy loss in CURRENT relationship (no ex/breakup)
  - `partner_withdrawing` - Specific withdrawal behaviors (ignoring messages, not calling back)

#### Dual-Signal Detection:
- **`breakup_grief`** now requires BOTH heartbreak word AND breakup signal
- **`breakup_intimacy_loss`** already requires BOTH breakup/ex signal AND intimacy signal ✓
- **`heartbreak_general`** triggers when heartbreak WITHOUT breakup signal
- **`relationship_intimacy_concerns`** triggers when intimacy signal WITHOUT breakup/ex signal

#### Topic Policies:
- Added policies for new topics to prevent conflicts:
  - `relationship_intimacy_concerns` denies `breakup_intimacy_loss`, `breakup_grief`, `breakup`
  - `heartbreak_general` denies `breakup_grief`, `breakup_intimacy_loss`, `breakup`

#### Block Selection Improvements:
- **Linking bonus:** Blocks with multiple topics matching current + context get +0.3-0.4 score bonus
- **Block text validation:** Filters out blocks containing "ex"/"breakup" if user didn't mention breakup
- **Context topics:** `state.active_topics` passed to block selector for linking

## Key Features Implemented

### 1. Session Continuity
- **Linking blocks** explicitly connect previous topics to current message
- **Linking bonus** prioritizes multi-topic blocks when context matches
- Example: If user previously said "I feel unlovable" and now describes partner withdrawing, linking blocks are prioritized

### 2. Assumption Prevention
- **Dual-signal detection** prevents "heartbroken" → assuming breakup
- **Block text validation** prevents blocks with "ex"/"breakup" when user didn't mention them
- **Topic policies** prevent conflicting topics from being selected together

### 3. Specificity
- **New topics** for specific situations (`partner_withdrawing`, `relationship_intimacy_concerns`)
- **Rewritten blocks** mirror exact user situations (e.g., "leaves messages unread for days")
- **No generic responses** - blocks are situation-specific

## Next Steps

1. **Apply SQL Migration:**
   ```sql
   -- Run in Supabase SQL Editor:
   -- backend/migrations/010_conversation_design_improvements.sql
   ```

2. **Compute Embeddings:**
   ```bash
   # Call production admin endpoint:
   POST https://macthiq-ai-backend.onrender.com/api/v1/admin/compute-embeddings
   ```

3. **Test Scenarios:**
   - "I'm heartbroken" (no breakup) → should use `heartbreak_general` blocks
   - "I miss our sex life" (no ex) → should use `relationship_intimacy_concerns` blocks
   - "I feel unlovable" then "my boyfriend ignores me" → should use linking blocks
   - "I miss our sex life with my ex" → should use `breakup_intimacy_loss` blocks

4. **Deploy:**
   - Push backend changes to `backend` branch
   - Verify migration applied
   - Verify embeddings computed
   - Test key scenarios

## Expected Improvements

- ✅ **Session continuity:** Amora will reference previous topics ("Earlier you shared...")
- ✅ **No false assumptions:** "I miss our sex life" won't assume ex if no breakup signal
- ✅ **Specific responses:** Blocks mirror exact user situations
- ✅ **Better linking:** Multi-topic blocks connect related themes

## Testing Checklist

- [ ] "I'm heartbroken" → uses `heartbreak_general`, NOT `breakup_grief`
- [ ] "I miss our sex life" (no ex) → uses `relationship_intimacy_concerns`, NOT `breakup_intimacy_loss`
- [ ] "I feel unlovable" then "my boyfriend ignores me" → uses linking blocks
- [ ] "I miss our sex life with my ex" → uses `breakup_intimacy_loss` blocks
- [ ] Blocks don't contain "ex"/"breakup" when user didn't mention them
- [ ] Linking bonus applies when context topics match
