# Expanding Amora's Block Library

## 🎯 What We're Doing

Adding **150 new blocks** across **10 additional relationship topics** to make Amora even more responsive and varied.

## 📊 New Topics (10)

1. **Mismatched Expectations** - Different futures, marriage, kids, timelines
2. **Feeling Unappreciated** - Giving more than receiving, being taken for granted
3. **Constant Fighting** - Repeated conflicts, communication breakdown
4. **Long Distance** - Physical separation, loneliness, doubt
5. **One-Sided Effort** - Imbalanced care, emotional labor
6. **Friend vs Romantic Confusion** - Unclear boundaries between friendship and romance
7. **Stuck on Ex** - Difficulty moving on, lingering attachment
8. **Comparison to Others** - Jealousy, insecurity about partner's past
9. **Low Self-Worth in Love** - Feeling unlovable, not enough
10. **Online Dating Burnout** - Exhaustion from apps, repeated disappointment

## 🔧 The Fix

### ❌ Original Problem
The SQL files had string IDs like `'mismatched_expectations_reflection_01'` but your database table uses UUID type for the `id` column.

### ✅ Solution
Removed the `id` column from INSERT statements - PostgreSQL will auto-generate UUIDs.

**Before:**
```sql
INSERT INTO amora_response_blocks (id, block_type, text, ...) VALUES
('mismatched_expectations_reflection_01', 'reflection', '...', ...);
```

**After:**
```sql
INSERT INTO amora_response_blocks (block_type, text, ...) VALUES
('reflection', '...', ...);
```

## 📝 How to Deploy

### Step 1: Run the SQL in Supabase

1. Open your Supabase SQL Editor
2. Run **Part 1** first:
   ```sql
   -- Copy contents of 006_expand_blocks_library_FIXED.sql
   -- This adds 45 blocks (topics 1-3)
   ```

3. Run **Part 2** second:
   ```sql
   -- Copy contents of 006_expand_blocks_library_part2_FIXED.sql
   -- This adds 105 blocks (topics 4-10)
   ```

### Step 2: Compute Embeddings

After inserting the blocks, compute embeddings using the admin API:

```powershell
# From your local machine
.\compute_embeddings_remote.ps1
```

Or manually:
```powershell
$response = Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/admin/compute-embeddings" -Method Post
```

### Step 3: Verify

Check the blocks status:
```powershell
$status = Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/admin/blocks-status"
$status | ConvertTo-Json
```

You should see:
```json
{
  "total_active_blocks": 244,  // 94 existing + 150 new
  "blocks_with_embeddings": 244,
  "blocks_without_embeddings": 0
}
```

## 📈 Expected Results

### Before Expansion
- 94 blocks
- 7 core topics (heartbreak, divorce, cheating, etc.)

### After Expansion
- **244 blocks total**
- **17 topics** covering a much wider range of relationship situations
- More variety in responses
- Better coverage of common relationship struggles

## 🧪 Test After Deployment

Try these questions to test the new topics:

1. **Mismatched Expectations:**
   > "My boyfriend doesn't want kids but I do. I don't know what to do."

2. **Feeling Unappreciated:**
   > "I do everything for my partner but they never say thank you or notice."

3. **Constant Fighting:**
   > "We fight about everything. Even small things turn into huge arguments."

4. **Long Distance:**
   > "My girlfriend moved to another state for work. I miss her so much and I'm scared we won't make it."

5. **One-Sided Effort:**
   > "I'm always the one who texts first, plans dates, and apologizes. He never puts in effort."

6. **Online Dating Burnout:**
   > "I'm so tired of dating apps. Everyone ghosts or just wants hookups. I'm about to give up."

## ✅ Success Criteria

- [ ] Both SQL files run without errors
- [ ] 150 new blocks inserted (verify count in Supabase)
- [ ] Embeddings computed for all new blocks
- [ ] Test queries return relevant, varied responses
- [ ] `engine: "blocks"` in API responses
- [ ] No repeated generic fallback messages

## 🚀 Ready?

1. Copy `006_expand_blocks_library_FIXED.sql` → Run in Supabase
2. Copy `006_expand_blocks_library_part2_FIXED.sql` → Run in Supabase
3. Run `.\compute_embeddings_remote.ps1`
4. Test with the questions above
5. Celebrate! 🎉

---

**Note:** The fixed SQL files are ready to use. The original files (`006_expand_blocks_library.sql` and `006_expand_blocks_library_part2.sql`) had UUID errors and should not be used.
