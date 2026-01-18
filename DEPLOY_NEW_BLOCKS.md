# 🚀 DEPLOY NEW BLOCKS TO PRODUCTION

## Overview

You now have **150+ new blocks** across 10 additional relationship topics, ready to deploy!

**New Topics:**
1. Mismatched expectations (marriage, kids, commitment)
2. Feeling unappreciated / taken for granted
3. Constant fighting / communication breakdown
4. Long-distance strain
5. One-sided effort / emotional imbalance
6. Friend vs romantic confusion
7. Stuck on ex / can't let go
8. Comparison to ex / new partner
9. Low self-worth in love / feeling unlovable
10. Online dating burnout / app fatigue

**Total Blocks:** 150 new blocks (15 per topic)
- 50 reflection blocks
- 50 normalization blocks
- 50 exploration blocks

---

## 📁 Files Created

### SQL Migration Files
- `006_expand_blocks_library.sql` - Topics 1-3 (45 blocks)
- `006_expand_blocks_library_part2.sql` - Topics 4-10 (105 blocks)

### JSON Reference Files (for review)
- `ADDITIONAL_BLOCKS_EXPANSION.json` - Additional 10 blocks per topic
- `DEEP_STAGE_BLOCKS.json` - Stage 3-4 blocks for deeper conversations

---

## 🎯 Deployment Steps

### Step 1: Run SQL Migrations in Supabase

1. **Go to Supabase SQL Editor:**
   - https://supabase.com/dashboard
   - Select your project (xvicydrqtddctywkvyge)
   - Click "SQL Editor"

2. **Run Part 1:**
   ```sql
   -- Copy contents of 006_expand_blocks_library.sql
   -- Paste into SQL Editor
   -- Click "Run"
   ```

3. **Run Part 2:**
   ```sql
   -- Copy contents of 006_expand_blocks_library_part2.sql
   -- Paste into SQL Editor
   -- Click "Run"
   ```

4. **Verify insertion:**
   ```sql
   SELECT COUNT(*) FROM amora_response_blocks WHERE active = true;
   -- Should show: 244 blocks (94 original + 150 new)
   ```

### Step 2: Compute Embeddings

**Option A: Remote (Recommended)**
```powershell
.\compute_embeddings_remote.ps1
```

**Option B: Check Status First**
```powershell
.\check_db_directly.ps1
```

This will show:
```
Total blocks: 244
With embeddings: 94
Without embeddings: 150
```

Then run the remote computation:
```powershell
Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/admin/compute-embeddings" -Method Post
```

### Step 3: Verify Deployment

**Wait 2-3 minutes for embeddings to compute, then:**

```powershell
.\check_db_directly.ps1
```

**Expected output:**
```
Total blocks: 244
With embeddings: 244
Without embeddings: 0
Percentage complete: 100%
Ready: True
```

### Step 4: Test New Topics

```powershell
.\test_multiple_scenarios_expanded.ps1
```

Or test manually with:

```powershell
$testPayload = @{
    specific_question = "I feel so unappreciated in my relationship. I do everything and my partner doesn't even notice."
    mode = "LEARN"
    context = @{}
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/coach/" -Method Post -Body $testPayload -ContentType "application/json"
```

---

## ✅ Expected Results

### Before Expansion
- **Total blocks:** 94
- **Topics covered:** 7 (heartbreak, breakup, cheating, divorce, etc.)
- **Coverage:** Good for core breakup scenarios

### After Expansion
- **Total blocks:** 244 (2.6x increase!)
- **Topics covered:** 17 (original 7 + new 10)
- **Coverage:** Excellent across all relationship scenarios

### Response Quality
- **Variety:** 15+ blocks per topic = much less repetition
- **Depth:** Stage 1-4 blocks for progressive conversations
- **Specificity:** Each topic has tailored emotional validation

---

## 🧪 Testing Scenarios

Test each new topic to verify:

### 1. Mismatched Expectations
```
"My partner doesn't want kids but I do. I don't know what to do."
```

### 2. Feeling Unappreciated
```
"I feel so unappreciated in my relationship. I do everything and my partner doesn't even notice."
```

### 3. Constant Fighting
```
"We fight about everything. Every conversation turns into an argument."
```

### 4. Long Distance
```
"My boyfriend lives 500 miles away and I'm so lonely. I don't know if I can do this anymore."
```

### 5. One-Sided Effort
```
"I'm always the one reaching out, planning dates, and trying to fix things. He never puts in effort."
```

### 6. Friend vs Romance
```
"I have feelings for my best friend but I'm scared to tell them. What if it ruins everything?"
```

### 7. Stuck on Ex
```
"It's been a year since my ex left and I still think about them every day. I can't move on."
```

### 8. Comparison
```
"I keep comparing myself to my boyfriend's ex-girlfriend. I feel like I'm not good enough."
```

### 9. Low Self-Worth
```
"I feel like I'm unlovable. Every relationship ends and I think there's something wrong with me."
```

### 10. Dating Burnout
```
"I'm so tired of dating apps. I match with people, we chat, then they ghost. I'm exhausted."
```

---

## 📊 Monitoring

### Check Block Usage (Optional)

After a few days, you can query which blocks are being used most:

```sql
-- This would require adding usage tracking to the code
-- For now, just monitor Render logs for block selection
```

### Watch for:
- ✅ `"Selected reflection block: score=X.XXX"`
- ✅ `"Selected normalization block: score=X.XXX"`
- ✅ `"Selected exploration block: score=X.XXX"`
- ❌ Any `"No blocks found for type=..."` warnings

---

## 🎊 Success Criteria

**You'll know it's working when:**

1. ✅ All 244 blocks have embeddings
2. ✅ Test queries return rich, topic-specific responses
3. ✅ No more generic "I want to make sure I understand..." responses
4. ✅ Responses vary even when asking similar questions
5. ✅ `engine: "blocks"` in all LEARN mode responses

---

## 🔧 Troubleshooting

### "No blocks found for type=reflection"
- **Cause:** Embeddings not computed yet
- **Fix:** Run `.\compute_embeddings_remote.ps1` again

### "Blocks found but message is empty"
- **Cause:** This was the old bug (already fixed)
- **Fix:** Should not happen anymore with embedding parsing fix

### "Still getting generic responses"
- **Cause:** Blocks not matching user's topic
- **Fix:** Check if the user's question contains keywords from your new topics

---

## 📈 Next Steps (Optional)

### Add Even More Blocks

If you want to expand further:

1. **Add more variants per topic** (aim for 20-25 blocks each)
2. **Add new topics:**
   - Codependency
   - Emotional abuse / manipulation
   - Rebuilding after infidelity
   - Blended families / step-parenting
   - Sexual compatibility issues
   - Financial stress in relationships

3. **Add more stage 3-4 blocks** for deeper conversations

### Improve Block Quality

- Review user conversations
- Identify common scenarios not well-covered
- Refine block text based on user feedback
- Add more emotion tags for better matching

---

## 🎯 Summary

**Current State:** 94 blocks, 7 topics  
**After Deployment:** 244 blocks, 17 topics  
**Improvement:** 2.6x more blocks, 2.4x more topics  

**Result:** Amora will have significantly more variety, better topic coverage, and much less repetition!

---

## 🚀 Ready to Deploy?

1. Run SQL migrations in Supabase ✅
2. Compute embeddings remotely ✅
3. Test new topics ✅
4. Monitor production ✅

**Let's make Amora even better!** 💙
