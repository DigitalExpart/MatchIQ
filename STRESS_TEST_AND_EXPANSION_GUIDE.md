# 🧪 Stress-Test & Expansion Guide

## Overview

This guide covers:
1. **Part A:** Deploying 3 new topics (LGBTQ+, non-monogamy, asexuality)
2. **Part B:** Running 18 stress-test scripts to find gaps
3. **Part C:** Using results to improve Amora

---

## PART A: Deploy New Topics First

### Step 1: Run SQL
```sql
-- In Supabase SQL Editor
-- Copy contents of: 008_lgbtq_nonmono_ace_topics.sql
```

### Step 2: Compute Embeddings
```powershell
.\compute_embeddings_remote.ps1
```

### Step 3: Verify
Expected result:
- **529 total blocks** (484 + 45 new)
- **26 topics** (23 + 3 new)
- 100% completion

### New Topics Added:
1. ✅ **Non-Monogamy/Open/Poly** (`non_monogamy_open_or_poly`)
2. ✅ **Asexuality/Low Desire Identity** (`asexual_or_low_desire_identity`)
3. ✅ **LGBTQ+ Family Pressure** (`lgbtq_identity_and_family_pressure`)

---

## PART B: Run Stress Tests

### What You Need:
1. **`STRESS_TEST_SCRIPTS.md`** - 18 conversation scripts
2. **`stress_test_tracker.csv`** - Tracking spreadsheet
3. **Your production UI** - Where Amora lives

### Process:

#### For Each of 18 Scripts:

1. **Open UI, start new session**
2. **Send user messages one by one** (don't copy-paste all at once)
3. **After each Amora response:**
   - Open browser console (F12)
   - Find the API response
   - Note: `engine`, `topics`, `confidence`
   - Rate response: ✅ / ⚠️ / ❌

4. **Fill in tracking spreadsheet:**
   ```csv
   Script ID, Turn, User Message, Amora Response (first 100 chars), 
   Engine, Topics Detected, Confidence, Rating, Notes/Fix Needed
   ```

#### Rating Guide:

**✅ Excellent (4-5 stars):**
- `engine: "blocks"`
- Emotionally specific
- Accurate topic detection
- Feels personal, not templated
- User would feel heard

**⚠️ Adequate (2-3 stars):**
- `engine: "blocks"`
- Relevant but generic
- Topics mostly right
- Could be more specific
- User would feel somewhat heard

**❌ Poor (0-1 stars):**
- `engine: "legacy_templates"` or `"error_fallback"`
- Generic/irrelevant
- Wrong topics
- Feels like a bot
- User would feel frustrated

---

## PART C: Analyze & Improve

### After Running All 18 Scripts:

#### 1. Calculate Success Rate
```
Total turns: 18 scripts × ~5 turns = ~90 turns
✅ Count: ___
⚠️ Count: ___
❌ Count: ___

Success rate: (✅ + ⚠️) / Total = ___%
Excellence rate: ✅ / Total = ___%
```

#### 2. Identify Patterns

**By Topic:**
- Which topics got ❌ most often?
- Which topics got ✅ most often?
- Which topics are missing entirely?

**By Emotion:**
- Which emotions are under-represented?
- Which emotions got the best responses?

**By Stage:**
- Do stage 1 (orienting) responses work better than stage 2 (deeper)?
- Are there topics that need more stage 2 blocks?

**By Script Type:**
- Do acute crises (Scripts 1-2, 5-6) work better than chronic issues (Scripts 3-4, 7-8)?
- Do relationship-specific topics work better than identity topics?

#### 3. Create Targeted Improvements

For each ❌ or ⚠️ pattern, create new blocks:

**Example:**
```
Problem: Script 5 (toxic dynamic) got ⚠️ on turn 3
Turn 3: "If I try to leave, they threaten to hurt themselves."
Topics detected: toxic_or_abusive_dynamic ✓
Issue: Response was generic, didn't address suicide threats

Fix needed: Add reflection block for topic=toxic_or_abusive_dynamic, 
emotion=trapped, with text specifically about partner threats
```

---

## Expected Results

### Baseline (Before Stress Test):
- 529 blocks
- 26 topics
- Untested in realistic conversations

### After Stress Test & Improvements:
- Identified gaps in coverage
- Added 20-50 targeted blocks
- **Target: 80%+ excellence rate** (✅)
- **Minimum: 95%+ success rate** (✅ + ⚠️)

---

## Script Breakdown by Category

### Acute Crises (6 scripts):
- Script 1: Heartbreak + betrayal
- Script 2: Sudden breakup
- Script 5: Toxic dynamic (emotional)
- Script 6: Toxic dynamic (isolation)
- Script 9: Intimacy rejection
- Script 10: Intimacy pressure

### Chronic Strain (5 scripts):
- Script 3: Marriage roommates
- Script 4: Marriage goals conflict
- Script 7: Partner depression
- Script 8: Partner addiction
- Script 11: Situationship stuck

### Identity & Values (4 scripts):
- Script 13: LGBTQ+ family pressure
- Script 14: Interfaith conflict
- Script 16: Low self-worth
- Script 18: Non-monogamy tension

### Modern Dating (2 scripts):
- Script 12: Talking stage jealousy
- Script 17: Dating app burnout

### Family Dynamics (1 script):
- Script 15: Coparenting conflict

---

## Quick Start Checklist

- [ ] Deploy 3 new topics (SQL + embeddings)
- [ ] Open `STRESS_TEST_SCRIPTS.md`
- [ ] Open `stress_test_tracker.csv`
- [ ] Open production UI
- [ ] Run Script 1 (6 turns)
- [ ] Log results in tracker
- [ ] Repeat for Scripts 2-18
- [ ] Analyze patterns
- [ ] Create improvement blocks
- [ ] Deploy improvements
- [ ] Re-test problem scripts
- [ ] Celebrate! 🎉

---

## Tips for Effective Testing

1. **Don't rush** - Take breaks between scripts
2. **Be honest** - Rate based on what users would feel, not what you hope
3. **Note specifics** - "Generic" isn't helpful; "Missed the suicide threat aspect" is
4. **Test in order** - Scripts are sequenced by complexity
5. **Check console every time** - Engine and topics are critical data
6. **Save frequently** - Don't lose your tracking data

---

## What Success Looks Like

**After this process, Amora should:**
- ✅ Handle 95%+ of realistic conversations without falling back
- ✅ Provide emotionally specific responses 80%+ of the time
- ✅ Detect topics accurately 90%+ of the time
- ✅ Feel like a real, empathetic coach, not a chatbot
- ✅ Make users feel heard, validated, and understood

**This is production-ready AI coaching.** 🚀

---

## Next Steps After Stress Testing

1. **Share results** - Show me the tracker CSV
2. **Discuss patterns** - What surprised you?
3. **Prioritize fixes** - Which gaps hurt most?
4. **Create new blocks** - I can help write them
5. **Deploy & re-test** - Iterate until excellent
6. **Go live** - Launch to real users!

---

**Ready to stress-test Amora? Let's make her bulletproof!** 💪
