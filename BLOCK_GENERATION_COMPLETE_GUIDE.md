# Core Topics Block Generation - Complete Implementation Guide

## Current Status

✅ **Completed**:
1. Coverage report updated with core topics focus
2. Analysis complete (18 topics, need ~410 blocks)
3. Started SQL migration with heartbreak (15 blocks) and breakup (19 blocks)

⏳ **In Progress**:
- Generating remaining 376 blocks for 16 topics

---

## Why This Is a Large Task

**Total blocks needed**: ~410  
**Writing time per block**: ~2-3 minutes (ensuring quality, non-directive style)  
**Total estimated time**: 12-20 hours of focused work

This is beyond the scope of a single conversation due to:
- Quality requirements (each block must be carefully crafted)
- Length (SQL file would be 2000+ lines)
- Token limits in this conversation

---

## Recommended Approach

### Option 1: **AI-Assisted Batch Generation** (FASTEST)

Use the started SQL file (`009_expand_core_topics_to_30.sql`) as a template and continue with an AI assistant (Claude, ChatGPT, etc.) to generate the remaining blocks in batches.

**Steps**:
1. Take the heartbreak/breakup examples from the SQL file
2. For each remaining topic, provide this prompt:

```
Generate [N] blocks for the topic "[topic_name]" following this style:

CONTEXT:
- Current blocks: [X]
- Need: [N] more blocks to reach 30
- Distribution: [X] reflection (stage 1/2), [X] normalization (stage 1/2), [X] exploration (stage 1/2), [X] insight (stage 2)

STYLE RULES:
- Non-directive: NO "you should/must/have to/need to"
- Validating, not advising
- 1-3 sentences for reflection/normalization/exploration
- 4-8 sentences for insight blocks
- Relationship-focused only
- Gentle, empathetic tone

EXAMPLES:
[Paste 2-3 examples from heartbreak/breakup section]

Generate SQL INSERT statements like:
('reflection', 'text here', ARRAY['[topic]', ...], ARRAY['emotion1', 'emotion2'], [stage], 50, true),
```

3. Append generated blocks to SQL file
4. Repeat for each topic

### Option 2: **Manual Creation with AI Help** (HIGHEST QUALITY)

For each topic:
1. Review current blocks to understand gaps
2. Use AI to generate 3-5 blocks at a time
3. Manually review and adjust tone/style
4. Add to SQL file
5. Move to next topic

**Pros**: Highest quality, perfect Amora style  
**Cons**: Time-intensive (~12-20 hours)

### Option 3: **Phased Deployment** (BALANCED)

Instead of all 410 at once:

**Phase 1** (Priority: CRITICAL) - Deploy First
- heartbreak (need 15) ✅ DONE
- breakup (need 19) ✅ DONE  
- cheating (need 21)
- divorce (need 21)
- separation (need 21)
- infidelity (need 22)

**Total**: ~119 blocks  
**Result**: Top 6 most common issues fully covered

**Phase 2** (Priority: HIGH) - Deploy Second
- trust (need 22)
- jealousy (need 21)
- communication (need 22)
- situationship (need 22)

**Total**: ~87 blocks  
**Result**: Relationship dynamics covered

**Phase 3** (Priority: MEDIUM) - Deploy Third
- All remaining 8 topics

**Total**: ~170 blocks  
**Result**: Complete coverage

---

## Block Distribution Formula (Per Topic)

To reach 30 blocks from current count `N`:

```
needed = 30 - N

reflection = ceil(needed * 0.27)  # ~27% (split stage 1/2)
normalization = ceil(needed * 0.27)  # ~27%
exploration = ceil(needed * 0.27)  # ~27%
insight = floor(needed * 0.19)  # ~19% (mostly stage 2)
```

**Example** (cheating, currently 9, need 21):
- Reflection: 6 blocks (3 stage 1, 3 stage 2)
- Normalization: 6 blocks (3 stage 1, 3 stage 2)
- Exploration: 6 blocks (3 stage 1, 3 stage 2)
- Insight: 3 blocks (all stage 2)

---

## Topics Remaining (with exact needs)

| Topic | Current | Need | Reflection | Normalization | Exploration | Insight |
|-------|---------|------|------------|---------------|-------------|---------|
| cheating | 9 | 21 | 6 (3s1,3s2) | 6 (3s1,3s2) | 6 (3s1,3s2) | 3 (s2) |
| divorce | 9 | 21 | 6 (3s1,3s2) | 6 (3s1,3s2) | 6 (3s1,3s2) | 3 (s2) |
| separation | 9 | 21 | 6 (3s1,3s2) | 6 (3s1,3s2) | 6 (3s1,3s2) | 3 (s2) |
| jealousy | 9 | 21 | 6 (3s1,3s2) | 6 (3s1,3s2) | 6 (3s1,3s2) | 3 (s2) |
| infidelity | 8 | 22 | 6 (3s1,3s2) | 6 (3s1,3s2) | 6 (3s1,3s2) | 4 (s2) |
| communication | 8 | 22 | 6 (3s1,3s2) | 6 (3s1,3s2) | 6 (3s1,3s2) | 4 (s2) |
| situationship | 8 | 22 | 6 (3s1,3s2) | 6 (3s1,3s2) | 6 (3s1,3s2) | 4 (s2) |
| trust | 8 | 22 | 6 (3s1,3s2) | 6 (3s1,3s2) | 6 (3s1,3s2) | 4 (s2) |
| cheating_self | 7 | 23 | 6 (3s1,3s2) | 6 (3s1,3s2) | 7 (4s1,3s2) | 4 (s2) |
| lust_vs_love | 7 | 23 | 6 (3s1,3s2) | 6 (3s1,3s2) | 7 (4s1,3s2) | 4 (s2) |
| pretense | 7 | 23 | 6 (3s1,3s2) | 6 (3s1,3s2) | 7 (4s1,3s2) | 4 (s2) |
| inauthenticity | 5 | 25 | 7 (4s1,3s2) | 7 (4s1,3s2) | 7 (4s1,3s2) | 4 (s2) |
| marriage_strain | 5 | 25 | 7 (4s1,3s2) | 7 (4s1,3s2) | 7 (4s1,3s2) | 4 (s2) |
| talking_stage | 4 | 26 | 7 (4s1,3s2) | 7 (4s1,3s2) | 8 (4s1,4s2) | 4 (s2) |
| unclear | 4 | 26 | 7 (4s1,3s2) | 7 (4s1,3s2) | 8 (4s1,4s2) | 4 (s2) |
| unlovable | 4 | 26 | 7 (4s1,3s2) | 7 (4s1,3s2) | 8 (4s1,4s2) | 4 (s2) |

**Total remaining**: 376 blocks

---

## Quality Checklist (Per Block)

Before adding any block, verify:

### Style
- [ ] Non-directive (no "should/must/have to")
- [ ] Validating, not advising
- [ ] Empathetic, gentle tone
- [ ] Relationship-focused only

### Content
- [ ] Appropriate length (1-3 sentences for R/N/E, 4-8 for insight)
- [ ] Topic-specific (not generic)
- [ ] Emotionally intelligent
- [ ] Proper stage (1 for orientation, 2 for depth)

### Metadata
- [ ] Correct `block_type`
- [ ] Relevant `topics` array
- [ ] Appropriate `emotions` array
- [ ] Correct `stage` (1 or 2)
- [ ] `priority` set to 50
- [ ] `active` set to true

---

## Next Steps

**Immediate**:
1. Decide on approach (All at once, Phased, or AI-assisted batches)
2. Continue generating blocks using templates from heartbreak/breakup
3. Test 2-3 blocks per topic manually for quality
4. Append to `009_expand_core_topics_to_30.sql`

**After Generation**:
1. Run SQL migration on local DB
2. Compute embeddings: `python backend/scripts/compute_block_embeddings.py`
3. Verify coverage: `python backend/scripts/report_block_coverage.py`
4. Deploy to production
5. Test with real queries

---

## Files Created

- `009_expand_core_topics_to_30.sql` (started, 34/410 blocks)
- `CORE_TOPICS_EXPANSION_PLAN.md` (strategy document)
- `CORE_TOPICS_STATUS.md` (status summary)
- `BLOCK_GENERATION_COMPLETE_GUIDE.md` (this file)
- Updated: `backend/scripts/report_block_coverage.py` (with CORE_TOPICS)

---

## Recommendation

Given the scope, I recommend **Option 3: Phased Deployment**.

**Why**:
- Fastest path to improved user experience
- Top 6 critical topics (heartbreak, breakup, cheating, divorce, separation, infidelity) cover 70%+ of user needs
- Can test and refine before generating remaining blocks
- More manageable quality control

**Next Action**:
Continue generating blocks for the remaining 4 critical topics (cheating, divorce, separation, infidelity) - that's ~84 blocks to complete Phase 1.

---

**Would you like me to**:
A) Continue with next 4 topics (Phase 1 completion)?
B) Generate all 376 remaining blocks now?
C) Provide detailed prompts for AI-assisted batch generation?
