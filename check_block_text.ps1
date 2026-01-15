# Check if blocks in database have text content

Write-Host "Checking block text content in Supabase..." -ForegroundColor Cyan

Write-Host "`nPlease run this query in Supabase SQL Editor:"
Write-Host "============================================" -ForegroundColor Yellow
Write-Host @"
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
LIMIT 10;
"@
Write-Host "============================================" -ForegroundColor Yellow

Write-Host "`nThis will show:"
Write-Host "  - First 100 characters of each block's text"
Write-Host "  - Total length of the text"
Write-Host "  - Whether embeddings exist"
Write-Host ""
Write-Host "If text_length is 0 or text_preview is empty, that's the problem!"
