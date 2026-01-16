# Block Coverage Report

## Overview

The **Block Coverage Report** provides visibility into Amora's content library, showing how many response blocks exist for each topic, broken down by block type and stage.

Use this report to:
- ✅ Identify content gaps (topics with few blocks)
- ✅ Plan content expansion priorities
- ✅ Ensure balanced coverage across topics
- ✅ Track library growth over time

## Quick Start

### Run the Report

```bash
cd backend
python scripts/report_block_coverage.py
```

### Requirements
- Python 3.8+
- Environment variables set (SUPABASE_URL, SUPABASE_ANON_KEY)
- `.env` file in `backend/` directory

## Sample Output

```
================================================================================
 AMORA BLOCK COVERAGE REPORT
================================================================================

Total Topics: 83
Total Block Assignments: 279
(Note: Blocks with multiple topics are counted once per topic)

================================================================================

Topic: heartbreak
  REFLECTION:
    stage 1: 3
    stage 2: 2
  NORMALIZATION:
    stage 1: 2
  EXPLORATION:
    stage 1: 3
  REFRAME:
    stage 2: 1
  TOTAL: 11

Topic: cheating
  REFLECTION:
    stage 1: 3
  NORMALIZATION:
    stage 1: 2
  EXPLORATION:
    stage 1: 3
  REFRAME:
    stage 2: 1
  TOTAL: 9

Topic: divorce
  REFLECTION:
    stage 1: 3
    stage 2: 2
  NORMALIZATION:
    stage 1: 2
  EXPLORATION:
    stage 1: 3
  REFRAME:
    stage 2: 1
  TOTAL: 11

...

================================================================================

SUMMARY BY BLOCK TYPE (across all topics):

  REFLECTION: 94
  NORMALIZATION: 87
  EXPLORATION: 91
  REFRAME: 7

================================================================================

COVERAGE GAPS (topics with < 10 total blocks):

  action: 1 blocks
  alone: 1 blocks
  ambiguity: 2 blocks
  attraction: 2 blocks
  authenticity: 3 blocks
  avoidance: 1 blocks
  ...

================================================================================
```

## Understanding the Report

### Section 1: Summary Statistics
```
Total Topics: 83
Total Block Assignments: 279
```

- **Total Topics**: Unique topics across all blocks
- **Total Block Assignments**: Sum of all topic tags (blocks can have multiple topics)
- A block tagged with 3 topics counts as 3 assignments

### Section 2: Detailed Coverage by Topic
```
Topic: heartbreak
  REFLECTION:
    stage 1: 3
    stage 2: 2
  NORMALIZATION:
    stage 1: 2
  EXPLORATION:
    stage 1: 3
  REFRAME:
    stage 2: 1
  TOTAL: 11
```

For each topic:
- **Block types**: REFLECTION, NORMALIZATION, INSIGHT, EXPLORATION, REFRAME
- **Stages**: 1 (orienting), 2 (feeling/pattern), 3 (needs/boundaries), 4 (meaning)
- **Count**: Number of blocks for that type/stage combination
- **TOTAL**: Total blocks for this topic (across all types/stages)

### Section 3: Summary by Block Type
```
REFLECTION: 94
NORMALIZATION: 87
EXPLORATION: 91
REFRAME: 7
```

Total blocks per type across **all topics**.

Use this to see if any block type is under-represented globally.

### Section 4: Coverage Gaps
```
COVERAGE GAPS (topics with < 10 total blocks):

  action: 1 blocks
  alone: 1 blocks
  authenticity: 3 blocks
```

Topics with fewer than 10 total blocks.

**Why 10?** A well-covered topic typically needs:
- 2-3 reflection blocks per stage
- 2-3 normalization blocks per stage
- 2-3 exploration blocks per stage
- 1-2 reframe blocks for stage 2+

For 2 stages: ~10-15 blocks minimum.

## Interpreting Results

### Healthy Coverage Example
```
Topic: heartbreak
  REFLECTION:
    stage 1: 3
    stage 2: 2
  NORMALIZATION:
    stage 1: 2
    stage 2: 2
  EXPLORATION:
    stage 1: 3
    stage 2: 2
  REFRAME:
    stage 2: 1
  TOTAL: 15
```

✅ Multiple blocks per type/stage  
✅ Covers stages 1 and 2  
✅ Includes reframe for depth  
✅ Total > 10

### Gap Example
```
Topic: action
  EXPLORATION:
    stage 1: 1
  TOTAL: 1
```

❌ Only 1 block  
❌ Only exploration type  
❌ No reflection or normalization  
❌ Needs more content

### Imbalanced Example
```
Topic: trust
  REFLECTION:
    stage 1: 5
  EXPLORATION:
    stage 1: 2
  TOTAL: 7
```

⚠️ Heavy on reflection  
⚠️ Light on normalization (missing)  
⚠️ Light on exploration  
⚠️ Needs more balance

## Using the Report for Content Planning

### Step 1: Identify Critical Gaps
Look for topics with **0-3 blocks** that are:
- Common user topics (heartbreak, cheating, divorce)
- Sensitive topics (abuse, mental health)
- Identity topics (LGBTQ+, non-monogamy)

**Priority:** Add 10-15 blocks per critical topic.

### Step 2: Balance Block Types
For each topic, aim for:
- **Reflection**: 2-3 per stage (emotional mirroring)
- **Normalization**: 2-3 per stage (validation/context)
- **Exploration**: 2-3 per stage (gentle questions)
- **Reframe**: 1-2 for stage 2+ (perspective shifts)

### Step 3: Expand Stages
Most topics should cover:
- **Stage 1**: Orienting, "what's going on?"
- **Stage 2**: Feeling/pattern exploration
- **Stage 3+**: (Optional) Needs, boundaries, meaning

### Step 4: Monitor Growth
Run the report before and after adding content:

```bash
# Before
python scripts/report_block_coverage.py > coverage_before.txt

# Add new blocks (SQL inserts)

# After
python scripts/report_block_coverage.py > coverage_after.txt

# Compare
diff coverage_before.txt coverage_after.txt
```

## Content Creation Guidelines

### When Adding Blocks for a Topic

1. **Start with Core Types**
   - Add 2-3 reflection blocks (stage 1)
   - Add 2-3 normalization blocks (stage 1)
   - Add 2-3 exploration blocks (stage 1)

2. **Add Depth**
   - Add 2 reflection blocks (stage 2)
   - Add 2 normalization blocks (stage 2)
   - Add 2 exploration blocks (stage 2)
   - Add 1-2 reframe blocks (stage 2)

3. **Ensure Variety**
   - Different emotional tones (sad, angry, confused, hopeful)
   - Different relationship contexts (dating, marriage, breakup)
   - Different user situations (cheated on, cheater, unsure)

### Example: Expanding "Trust Issues" Topic

**Current State (from report):**
```
Topic: trust
  REFLECTION:
    stage 1: 5
  EXPLORATION:
    stage 1: 2
  TOTAL: 7
```

**Action Plan:**
1. Add 2-3 normalization blocks (stage 1) ← Missing entirely
2. Add 1 more exploration block (stage 1) ← Light coverage
3. Add stage 2 blocks:
   - 2 reflection
   - 2 normalization
   - 2 exploration
   - 1 reframe

**Target State:**
```
Topic: trust
  REFLECTION:
    stage 1: 5
    stage 2: 2
  NORMALIZATION:
    stage 1: 3
    stage 2: 2
  EXPLORATION:
    stage 1: 3
    stage 2: 2
  REFRAME:
    stage 2: 1
  TOTAL: 18
```

## Automation Ideas

### Scheduled Reports
Run weekly to track growth:

```bash
# cron job (Linux/Mac)
0 9 * * 1 cd /path/to/backend && python scripts/report_block_coverage.py > reports/coverage_$(date +\%Y\%m\%d).txt

# Windows Task Scheduler
# Run: python backend/scripts/report_block_coverage.py > reports/coverage_%date:~-4,4%%date:~-10,2%%date:~-7,2%.txt
```

### Integration with CI/CD
Add to deployment pipeline:

```yaml
# .github/workflows/deploy.yml
- name: Generate Coverage Report
  run: |
    cd backend
    python scripts/report_block_coverage.py > coverage_report.txt
    
- name: Upload Report
  uses: actions/upload-artifact@v2
  with:
    name: coverage-report
    path: backend/coverage_report.txt
```

### Alerting on Gaps
```python
# In report script, add:
critical_topics = ['heartbreak', 'cheating', 'divorce', 'abuse']
for topic in critical_topics:
    if topic_total < 10:
        send_alert(f"Critical topic '{topic}' has only {topic_total} blocks!")
```

## Troubleshooting

### Issue: Report shows 0 blocks
**Cause:** Database connection issue or no blocks in database  
**Solution:** 
- Check `.env` file has correct SUPABASE_URL and SUPABASE_ANON_KEY
- Verify blocks exist: `SELECT COUNT(*) FROM amora_response_blocks WHERE active = true;`

### Issue: Topics missing from report
**Cause:** Blocks for that topic are inactive or don't have the topic tag  
**Solution:**
- Check block `active` status in database
- Verify `topics` array includes the expected topic name

### Issue: Counts seem wrong
**Cause:** Blocks with multiple topics are counted once per topic  
**Solution:** This is expected behavior. A block tagged with `['heartbreak', 'breakup']` counts as 1 for heartbreak and 1 for breakup.

## Script Details

### Location
```
backend/scripts/report_block_coverage.py
```

### Dependencies
```python
from dotenv import load_dotenv
from supabase import create_client, Client
```

### Database Query
```python
supabase.table("amora_response_blocks") \
    .select("id, block_type, topics, stage, active") \
    .eq("active", True) \
    .execute()
```

### Customization
Edit the script to:
- Change gap threshold (currently < 10)
- Add more summary sections
- Export to CSV/JSON
- Filter by specific topics

## Summary

| Feature | Details |
|---------|---------|
| **Purpose** | Analyze block distribution across topics/types/stages |
| **Usage** | `python backend/scripts/report_block_coverage.py` |
| **Output** | Console text report |
| **Sections** | Summary, Detailed, By Type, Gaps |
| **Gap Threshold** | < 10 blocks per topic |
| **Dependencies** | python-dotenv, supabase-py |
| **Runtime** | ~2-5 seconds |
| **Status** | ✅ Ready to use |

---

**Last Updated:** 2026-01-16  
**Version:** 1.0.0  
**Author:** Amora AI Team
