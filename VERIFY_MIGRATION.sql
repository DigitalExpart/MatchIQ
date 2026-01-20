-- Verification queries for migration 009_breakup_intimacy_blocks.sql
-- Run these in Supabase SQL Editor to confirm the migration worked

-- 1. Count total blocks for the new topics
SELECT COUNT(*) as total_blocks
FROM amora_response_blocks 
WHERE 'breakup_intimacy_loss' = ANY(topics)
   OR 'breakup_grief' = ANY(topics);

-- Expected result: 28 blocks

-- 2. Count by topic
SELECT 
    CASE 
        WHEN 'breakup_intimacy_loss' = ANY(topics) THEN 'breakup_intimacy_loss'
        WHEN 'breakup_grief' = ANY(topics) THEN 'breakup_grief'
    END as topic,
    COUNT(*) as count
FROM amora_response_blocks 
WHERE 'breakup_intimacy_loss' = ANY(topics)
   OR 'breakup_grief' = ANY(topics)
GROUP BY topic;

-- Expected: ~14 blocks for each topic

-- 3. Count by block type
SELECT 
    block_type,
    COUNT(*) as count
FROM amora_response_blocks 
WHERE 'breakup_intimacy_loss' = ANY(topics)
   OR 'breakup_grief' = ANY(topics)
GROUP BY block_type
ORDER BY block_type;

-- Expected distribution:
-- exploration: ~8 blocks
-- normalization: ~8 blocks
-- reflection: ~8 blocks
-- reframe: ~4 blocks

-- 4. Sample a few blocks to verify content
SELECT 
    block_type,
    topics,
    stage,
    priority,
    LEFT(text, 100) as text_preview
FROM amora_response_blocks
WHERE 'breakup_intimacy_loss' = ANY(topics)
   OR 'breakup_grief' = ANY(topics)
ORDER BY priority DESC, block_type
LIMIT 10;

-- 5. Check if any blocks are missing embeddings (should be all NULL initially)
SELECT 
    COUNT(*) as blocks_without_embeddings
FROM amora_response_blocks 
WHERE ('breakup_intimacy_loss' = ANY(topics) OR 'breakup_grief' = ANY(topics))
  AND embedding IS NULL;

-- Expected: 28 (all new blocks need embeddings computed)
