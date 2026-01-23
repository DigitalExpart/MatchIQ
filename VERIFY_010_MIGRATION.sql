-- Verification queries for migration 010_conversation_design_improvements.sql

-- 1. Count total blocks by topic
SELECT 
    topic,
    COUNT(*) as block_count
FROM (
    SELECT unnest(topics) as topic
    FROM amora_response_blocks
    WHERE topics && ARRAY['unlovable', 'breakup_intimacy_loss', 'heartbreak_general', 'relationship_intimacy_concerns', 'partner_withdrawing']
) subq
GROUP BY topic
ORDER BY block_count DESC;

-- 2. Count blocks without embeddings (should be 28 new blocks initially)
SELECT 
    COUNT(*) as blocks_without_embeddings
FROM amora_response_blocks 
WHERE (topics && ARRAY['unlovable', 'breakup_intimacy_loss', 'heartbreak_general', 'relationship_intimacy_concerns', 'partner_withdrawing'])
  AND embedding IS NULL;

-- 3. Check linking blocks (should have 2 blocks with multiple topics)
SELECT 
    id,
    block_type,
    topics,
    LEFT(text, 80) as text_preview
FROM amora_response_blocks
WHERE array_length(topics, 1) > 1
  AND topics && ARRAY['unlovable', 'partner_withdrawing', 'breakup_grief', 'breakup_intimacy_loss']
ORDER BY priority DESC;

-- 4. Count blocks by block_type for new topics
SELECT 
    block_type,
    COUNT(*) as count
FROM amora_response_blocks
WHERE topics && ARRAY['unlovable', 'breakup_intimacy_loss', 'heartbreak_general', 'relationship_intimacy_concerns', 'partner_withdrawing']
GROUP BY block_type
ORDER BY count DESC;

-- 5. Sample blocks to verify content
SELECT 
    block_type,
    topics,
    LEFT(text, 100) as text_preview
FROM amora_response_blocks
WHERE topics && ARRAY['relationship_intimacy_concerns', 'partner_withdrawing', 'heartbreak_general']
ORDER BY priority DESC
LIMIT 5;
