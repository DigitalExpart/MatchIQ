# Deploy Core Topics Expansion - Complete Guide

## 🎯 Overview

This expansion adds **~404 new blocks** across **18 core relationship topics**, bringing each topic to **30+ blocks** for comprehensive coverage.

---

## ✅ What's Been Created

### Part 1: Heartbreak & Breakup ✅ DEPLOYED
- **File**: `009_expand_core_topics_FIXED.sql`
- **Blocks**: 34 (15 heartbreak + 19 breakup)
- **Status**: ✅ Already deployed and working in production

### Part 2: Critical Topics (8 topics)
- **File**: `009_expand_core_topics_PART2_critical.sql` (cheating, divorce)
- **File**: `009_expand_core_topics_PART2_continued.sql` (separation, jealousy)
- **File**: `009_expand_core_topics_PART2_final.sql` (infidelity, trust)
- **File**: `009_expand_core_topics_PART2_complete.sql` (communication, situationship)
- **Total Blocks**: ~170
- **Status**: ⏳ Ready to deploy

### Part 3: Remaining Topics (8 topics)
- **File**: `009_expand_core_topics_PART3_remaining.sql` (cheating_self, lust_vs_love)
- **File**: `009_expand_core_topics_PART3_continued.sql` (pretense, inauthenticity)
- **File**: `009_expand_core_topics_PART3_final.sql` (marriage_strain, talking_stage)
- **File**: `009_expand_core_topics_PART3_complete.sql` (unclear, unlovable)
- **Total Blocks**: ~200
- **Status**: ⏳ Ready to deploy

---

## 📋 Deployment Order

### Step 1: Deploy Part 2 (Critical Topics)

**Run these files in Supabase SQL Editor in order:**

1. `009_expand_core_topics_PART2_critical.sql`
   - Cheating (21 blocks)
   - Divorce (21 blocks)
   - **Expected**: 42 rows returned

2. `009_expand_core_topics_PART2_continued.sql`
   - Separation (21 blocks)
   - Jealousy (21 blocks)
   - **Expected**: 42 rows returned

3. `009_expand_core_topics_PART2_final.sql`
   - Infidelity (22 blocks)
   - Trust (22 blocks)
   - **Expected**: 44 rows returned

4. `009_expand_core_topics_PART2_complete.sql`
   - Communication (22 blocks)
   - Situationship (22 blocks)
   - **Expected**: 44 rows returned

**After Part 2**: ~172 blocks added

### Step 2: Compute Embeddings for Part 2

```powershell
Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/admin/compute-embeddings" -Method Post
```

**Expected**: "Computed embeddings for ~172 blocks"

### Step 3: Deploy Part 3 (Remaining Topics)

**Run these files in Supabase SQL Editor in order:**

1. `009_expand_core_topics_PART3_remaining.sql`
   - Cheating_self (23 blocks)
   - Lust_vs_love (23 blocks)
   - **Expected**: 46 rows returned

2. `009_expand_core_topics_PART3_continued.sql`
   - Pretense (23 blocks)
   - Inauthenticity (25 blocks)
   - **Expected**: 48 rows returned

3. `009_expand_core_topics_PART3_final.sql`
   - Marriage_strain (25 blocks)
   - Talking_stage (26 blocks)
   - **Expected**: 51 rows returned

4. `009_expand_core_topics_PART3_complete.sql`
   - Unclear (26 blocks)
   - Unlovable (26 blocks)
   - **Expected**: 52 rows returned

**After Part 3**: ~200 blocks added

### Step 4: Compute Embeddings for Part 3

```powershell
Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/admin/compute-embeddings" -Method Post
```

**Expected**: "Computed embeddings for ~200 blocks"

---

## ✅ Verification Steps

### After Each Part Deployment

1. **Check block count in Supabase**:
```sql
SELECT COUNT(*) FROM amora_response_blocks WHERE active = true;
```

2. **Check specific topic counts**:
```sql
SELECT 
  COUNT(*) FILTER (WHERE 'cheating' = ANY(topics)) as cheating_blocks,
  COUNT(*) FILTER (WHERE 'divorce' = ANY(topics)) as divorce_blocks,
  COUNT(*) FILTER (WHERE 'trust' = ANY(topics)) as trust_blocks
FROM amora_response_blocks 
WHERE active = true;
```

3. **Verify embeddings computed**:
```powershell
Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/admin/blocks-status" -Method Get
```

Should show increasing numbers of blocks with embeddings.

### Final Verification

After all parts are deployed:

```bash
cd backend
python scripts/report_block_coverage.py
```

**Expected output**:
```
[OK] Topic: heartbreak
  TOTAL BLOCKS: 30 / 30

[OK] Topic: breakup
  TOTAL BLOCKS: 30 / 30

[OK] Topic: cheating
  TOTAL BLOCKS: 30 / 30

... (all 18 topics should show [OK] >= 30 blocks)
```

---

## 📊 Expected Final Counts

After complete deployment:

| Topic | Current | Added | Final |
|-------|---------|-------|-------|
| heartbreak | 15 | 15 | **30** ✅ |
| breakup | 11 | 19 | **30** ✅ |
| cheating | 9 | 21 | **30** |
| divorce | 9 | 21 | **30** |
| separation | 9 | 21 | **30** |
| jealousy | 9 | 21 | **30** |
| infidelity | 8 | 22 | **30** |
| trust | 8 | 22 | **30** |
| communication | 8 | 22 | **30** |
| situationship | 8 | 22 | **30** |
| cheating_self | 7 | 23 | **30** |
| lust_vs_love | 7 | 23 | **30** |
| pretense | 7 | 23 | **30** |
| inauthenticity | 5 | 25 | **30** |
| marriage_strain | 5 | 25 | **30** |
| talking_stage | 4 | 26 | **30** |
| unclear | 4 | 26 | **30** |
| unlovable | 4 | 26 | **30** |

**Total new blocks**: ~404  
**Final total blocks**: ~1,100+ (including existing blocks)

---

## 🎯 Impact

### Before Expansion
- Most topics: 4-15 blocks
- Limited variety
- Repetition after 3-4 turns
- Shallow conversations

### After Expansion
- All core topics: 30+ blocks
- **2-7x more variety** per topic
- Much less repetition
- Deeper, more nuanced conversations
- Better emotional resonance
- More human-like responses

---

## 🚀 Deployment Strategy

### Option A: Deploy All at Once
- Run all 8 SQL files sequentially
- Compute embeddings once at the end
- **Pros**: Fastest, complete coverage immediately
- **Cons**: Large batch, harder to debug if issues

### Option B: Phased Deployment (Recommended)
- Deploy Part 2 first (critical topics)
- Test and verify
- Deploy Part 3 second (remaining topics)
- **Pros**: Easier to verify, can test impact incrementally
- **Cons**: Takes longer

---

## 📝 Notes

- All blocks follow Amora's non-directive, validating style
- Balanced distribution: reflection, normalization, exploration, reframe
- Proper stage distribution (1 & 2)
- Topic-specific and emotionally intelligent
- Ready for immediate use after embeddings are computed

---

## ⚠️ Important Reminders

1. **Run SQL files in order** - Each file builds on the previous
2. **Compute embeddings after each part** - Blocks won't work without embeddings
3. **Verify with coverage report** - Confirm all topics reach 30+ blocks
4. **Test in production** - Try varied queries to see improved variety

---

## 🎉 After Deployment

Once all parts are deployed and embeddings computed:

1. **Test variety**: Run same question 5 times, should see 5 different responses
2. **Check coverage**: All 18 topics should show 30+ blocks
3. **Monitor user feedback**: See how improved variety affects engagement
4. **Celebrate**: You now have a comprehensive, varied block library! 🚀

---

**Status**: ✅ All SQL files ready  
**Next Step**: Deploy Part 2 in Supabase  
**Estimated Time**: 30-45 minutes for full deployment
