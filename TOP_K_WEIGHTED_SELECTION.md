# Top-K Weighted Random Block Selection

## Overview

Amora now uses **top-K weighted random selection** for choosing response blocks, providing more variation in responses while maintaining quality and relevance.

## What Changed

### Before (Deterministic Selection)
- Always selected the **single highest-scoring block** for each type
- Same user message → same exact response every time
- Predictable but potentially repetitive across sessions

### After (Weighted Random Selection)
- Randomly chooses from the **top-K highest-scoring blocks** (K=5 by default)
- Higher scores = higher probability of selection
- Same user message → **different high-quality responses** across sessions
- Maintains topic/emotion alignment and anti-repetition

## How It Works

### 1. Scoring (Unchanged)
Blocks are still scored based on:
- **Semantic similarity** (0-1): How well the block matches the user's message
- **Topic overlap** (0-0.3 bonus): Shared topics with user's context
- **Emotion overlap** (0-0.2 bonus): Matching emotional states
- **Priority** (0-0.1 bonus): Block priority setting
- **Repetition penalty** (-0.5): Penalty for recently used blocks

### 2. Top-K Selection (New)
```python
TOP_K_CANDIDATES = 5  # Configurable constant
```

After scoring all candidates:
1. Sort by score (descending)
2. Take top K candidates (default: 5)
3. Filter by minimum similarity threshold
4. Apply **weighted random choice**:
   - Weights = score^1.5 (moderate exponential weighting)
   - Higher scores = higher probability
   - Lower scores still have a chance

### 3. Weighted Random Choice Algorithm

```python
def _weighted_random_choice(scored_blocks, min_similarity):
    # Get top-K candidates
    top_k = scored_blocks[:TOP_K_CANDIDATES]
    
    # Filter by threshold
    valid = [block for block, score in top_k if score >= min_similarity]
    
    # If no valid candidates, use all top-K (safety)
    if not valid:
        valid = top_k
    
    # Extract scores and normalize
    scores = [score for block, score in valid]
    
    # Apply exponential weighting (score^1.5)
    weights = [s ** 1.5 for s in scores]
    
    # Weighted random choice
    return random.choices(blocks, weights=weights, k=1)[0]
```

## Benefits

### 1. More Variation
- Two users with the same message get **different responses**
- Reduces feeling of "canned" or scripted replies
- Feels more natural and human-like

### 2. Quality Maintained
- Only chooses from **top-scoring blocks**
- Topic/emotion alignment still enforced
- Anti-repetition still active

### 3. Configurable
```python
# In amora_blocks_service.py
TOP_K_CANDIDATES = 5  # Adjust this value

# Higher K = more variation, but may reduce quality
# Lower K = more consistent, but less variation
# Recommended range: 3-7
```

## Examples

### Same User Message, Different Responses

**User:** "My girlfriend broke up with me, I'm so hurt"

**Session 1 Response:**
> "I can hear how much pain you're carrying right now, and I'm so sorry you're going through this. Breakups can feel like your whole world is shifting, and that's incredibly disorienting. What part of this feels hardest for you to process right now?"

**Session 2 Response:**
> "It sounds like you're in a lot of pain right now, and that's completely understandable. When someone we care about leaves, it can shake our sense of ourselves and what relationships mean. When you think about all of this, what comes up most strongly for you?"

**Session 3 Response:**
> "Breakups can feel like your whole world is shifting, and that's incredibly disorienting. Most long-term relationships leave a mark on who we are, and losing that connection can feel like losing a part of yourself. What's been the hardest part of this for you so far?"

All three responses:
- ✅ Address heartbreak/breakup topic
- ✅ Reflect emotional pain
- ✅ End with exploration question
- ✅ Different wording and structure
- ✅ Equally high quality

## Implementation Details

### Location
- **File:** `backend/app/services/amora_blocks_service.py`
- **Class:** `BlockSelector`
- **Method:** `_weighted_random_choice()`

### Configuration
```python
# Line ~30 in amora_blocks_service.py
TOP_K_CANDIDATES = 5
```

To change:
1. Edit the constant in `amora_blocks_service.py`
2. Redeploy to Render
3. No database changes needed

### Anti-Repetition Integration
The weighted random selection works **with** anti-repetition:
1. Blocks in `recent_block_ids` get heavy score penalty (-0.5)
2. Weighted selection naturally avoids low-scored blocks
3. Result: Recent blocks rarely selected, even if in top-K

### Safety Fallbacks
- If all top-K scores are below threshold → use them anyway (safety)
- If weighted choice fails → uniform random choice
- If no candidates at all → return None (handled upstream)

## Testing

### Variation Test
Run the same question multiple times:

```powershell
# Test script
for ($i = 1; $i -le 5; $i++) {
    Write-Host "Test $i:"
    $response = Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/coach/" `
        -Method Post `
        -Headers @{"Content-Type"="application/json"} `
        -Body '{"mode":"LEARN","specific_question":"My girlfriend broke up with me","user_id":"test-'$i'"}'
    Write-Host $response.message
    Write-Host ""
}
```

Expected: 5 different responses, all high quality, all on-topic.

### Quality Test
Verify responses still match:
- ✅ Correct topics
- ✅ Appropriate emotions
- ✅ Proper response style (GROUNDING, DEEPENING, etc.)
- ✅ No repetition within a session

## Monitoring

### Logs
Look for:
```
Selected reflection block: score=0.847, topics=['heartbreak', 'breakup']
Selected normalization block: score=0.823, topics=['breakup', 'loss']
Selected exploration block: score=0.791, topics=['heartbreak']
```

Scores should vary across requests for the same message.

### Metrics to Track
- **Response diversity**: How often same message → different response
- **User engagement**: Do users respond more to varied replies?
- **Quality maintenance**: Confidence scores should remain high

## Future Enhancements

### Possible Improvements
1. **Adaptive K**: Adjust TOP_K based on conversation stage
   - Early turns: K=3 (more consistent)
   - Later turns: K=7 (more varied)

2. **Temperature Parameter**: Control randomness
   - Low temp: More deterministic (score^3)
   - High temp: More random (score^1)

3. **User Preference**: Let users choose variation level
   - "Consistent mode": K=2
   - "Varied mode": K=8

4. **A/B Testing**: Compare user satisfaction
   - Group A: Deterministic (old way)
   - Group B: Weighted random (new way)

## Troubleshooting

### Issue: Responses feel too random/off-topic
**Solution:** Decrease TOP_K_CANDIDATES to 3

### Issue: Responses still feel repetitive
**Solution:** Increase TOP_K_CANDIDATES to 7-8

### Issue: Quality dropped
**Solution:** 
- Check block coverage (use `report_block_coverage.py`)
- Ensure enough high-quality blocks per topic
- May need to add more blocks to database

### Issue: Same response appearing too often
**Solution:**
- Check anti-repetition is working (`recent_block_ids`)
- Verify `RECENT_BLOCKS_LIMIT` is set appropriately (default: 20)
- May need more blocks for that specific topic/type/stage

## Summary

| Aspect | Value |
|--------|-------|
| **Feature** | Top-K Weighted Random Selection |
| **Default K** | 5 |
| **Weighting** | score^1.5 (moderate exponential) |
| **Maintains** | Topic alignment, emotion matching, anti-repetition |
| **Benefits** | More variation, feels more human, less scripted |
| **Trade-off** | Slight increase in response unpredictability |
| **Configurable** | Yes, via `TOP_K_CANDIDATES` constant |
| **Status** | ✅ Implemented, ready for deployment |

---

**Last Updated:** 2026-01-16  
**Version:** 2.1.0  
**Author:** Amora AI Team
