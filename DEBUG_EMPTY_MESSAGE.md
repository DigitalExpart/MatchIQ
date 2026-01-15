# Debugging Empty Message Issue

## Current Status

✅ **Blocks engine is active** - API returns `engine: "blocks"`
✅ **Topic detection works** - Correctly identifies `["heartbreak", "cheating", "breakup"]`
✅ **Emotion detection works** - Correctly identifies `["hurt"]`
✅ **All 94 blocks have embeddings** - Verified via `/api/v1/admin/blocks-status`
❌ **Message is empty** - Response contains `message: ""`

## Problem

The `AmoraBlocksService` is:
1. Successfully detecting topics and emotions
2. Selecting blocks (presumably)
3. Composing a response
4. But returning an empty `message` field

## Possible Causes

1. **Block selection returning None**
   - All three block types (reflection, normalization, exploration) might be returning `None`
   - This would result in `ResponseComposer.compose()` joining empty parts

2. **Block text field is empty in database**
   - The migration inserts blocks with text, but maybe they didn't persist correctly
   - Or there's an encoding issue

3. **Response composition logic has a bug**
   - The `ResponseComposer.compose()` method might not be joining the parts correctly
   - Or the personalization is stripping all content

4. **Async/sync mismatch**
   - The `get_blocks_count()` method is async, but `get_response()` is not
   - This might indicate a broader async issue with database queries

## Next Steps

### 1. Check Render Logs (After Deployment)

After the latest push deploys, check Render logs for:

```
Selected blocks: reflection=True/False, normalization=True/False, exploration=True/False
Reflection text length: X, preview: ...
Normalization text length: X, preview: ...
Exploration text length: X, preview: ...
Composed message length: X, preview: ...
```

This will tell us:
- Are blocks being selected?
- Do the selected blocks have text content?
- Is the composition step producing text?

### 2. Verify Block Text in Supabase

Run this query in Supabase SQL Editor:

```sql
-- Check if blocks have text content
SELECT 
    id,
    block_type,
    LEFT(text, 100) as text_preview,
    LENGTH(text) as text_length,
    topics,
    emotions,
    stage,
    CASE WHEN embedding IS NOT NULL THEN 'YES' ELSE 'NO' END as has_embedding
FROM amora_response_blocks
WHERE active = true
  AND block_type = 'reflection'
  AND 'heartbreak' = ANY(topics)
LIMIT 5;
```

Expected result:
- `text_length` should be > 50 for each block
- `text_preview` should show actual content like "I can hear how much pain..."
- `has_embedding` should be 'YES'

If `text_length` is 0, the problem is in the database.

### 3. Check for Async Issues

The `AmoraBlocksService.get_response()` method is **not async**, but it calls:
- `self.supabase.table(...).execute()` - which might need to be awaited

Check if the Supabase client methods need `await`:
- If yes, make `get_response()` async
- Update the API endpoint to await it

### 4. Test Block Selection Directly

Create a minimal test script that:
1. Initializes `AmoraBlocksService`
2. Calls `block_selector.select_block()` directly
3. Prints the returned block's text

This will isolate whether the issue is in selection or composition.

## Quick Fix Ideas

### If blocks are being selected but text is empty:

The issue is likely in how we're reading the `text` field from Supabase. Check:
- Is the field name correct? (`text` vs `content` vs `message`)
- Is there a character encoding issue?
- Is the Supabase client truncating the response?

### If blocks are NOT being selected (all None):

The issue is in the query or filtering logic. Check:
- Are embeddings actually being used in the similarity search?
- Is the `stage` filter too restrictive?
- Are the topic/emotion filters excluding all blocks?

### If composition is failing:

The `ResponseComposer.compose()` method might have a bug. Check:
- Are the parts being joined correctly?
- Is the personalization step removing content?
- Is there a string encoding issue?

## Expected Behavior After Fix

When testing with:
```
"My girlfriend broke up with me, she cheated on me with my best friend... I'm very hurt right now..."
```

Expected response structure:
```
[Reflection] I can hear how much pain you're carrying right now, and I'm so sorry you're going through this.
[Normalization] Betrayal from both your girlfriend and your best friend is a double wound, and it makes sense that you're feeling devastated.
[Exploration] When you think about what happened, what part feels hardest to process right now?
```

Full response should be 150-300 characters, emotionally specific, and contextual.

## Deployment Timeline

1. **Code pushed**: bb74a68
2. **Render deployment**: ~5-10 minutes
3. **Check logs**: Look for the new logging statements
4. **Test again**: Run `test_amora_detailed.ps1`
5. **Analyze**: Based on logs, determine next fix

---

**Next Action**: Wait for Render to deploy, then check logs at:
https://dashboard.render.com/ → macthiq-ai-backend → Logs
