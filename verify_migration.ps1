# Verify migration was run - check if new blocks exist
Write-Host "Checking if migration blocks exist in Supabase..." -ForegroundColor Cyan
Write-Host ""

# This is a manual check - you'll need to run this SQL in Supabase:
$sql = @"
-- Check breakup_intimacy_loss blocks
SELECT COUNT(*) as breakup_intimacy_loss_count
FROM amora_response_blocks
WHERE 'breakup_intimacy_loss' = ANY(topics) AND active = true;

-- Check breakup_grief blocks  
SELECT COUNT(*) as breakup_grief_count
FROM amora_response_blocks
WHERE 'breakup_grief' = ANY(topics) AND active = true;

-- Check if blocks have embeddings
SELECT 
    COUNT(*) as total_blocks,
    COUNT(embedding) as blocks_with_embeddings,
    COUNT(*) FILTER (WHERE 'breakup_intimacy_loss' = ANY(topics)) as intimacy_loss_blocks,
    COUNT(*) FILTER (WHERE 'breakup_grief' = ANY(topics)) as grief_blocks
FROM amora_response_blocks
WHERE active = true;
"@

Write-Host "Run this SQL in Supabase SQL Editor:" -ForegroundColor Yellow
Write-Host $sql -ForegroundColor Cyan
Write-Host ""
Write-Host "Expected results:" -ForegroundColor Yellow
Write-Host "  - breakup_intimacy_loss_count: ~14 blocks" -ForegroundColor Green
Write-Host "  - breakup_grief_count: ~14 blocks" -ForegroundColor Green
Write-Host "  - All should have embeddings" -ForegroundColor Green
