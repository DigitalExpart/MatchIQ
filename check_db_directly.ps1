# Check database blocks directly via admin endpoint

$backendUrl = "https://macthiq-ai-backend.onrender.com"
$statusEndpoint = "/api/v1/admin/blocks-status"

Write-Host "Checking blocks status..." -ForegroundColor Cyan

try {
    $status = Invoke-RestMethod -Uri "$backendUrl$statusEndpoint" -Method Get -TimeoutSec 10
    
    Write-Host "`nBlocks Status:" -ForegroundColor Green
    Write-Host "  Total blocks: $($status.total_blocks)"
    Write-Host "  With embeddings: $($status.with_embeddings)"
    Write-Host "  Without embeddings: $($status.without_embeddings)"
    Write-Host "  Percentage complete: $($status.percentage_complete)%"
    Write-Host "  Ready: $($status.ready)"
    
    if ($status.ready) {
        Write-Host "`n[OK] Blocks are ready!" -ForegroundColor Green
    } else {
        Write-Host "`n[WARNING] Blocks not ready" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================`n"
Write-Host "The issue is that blocks are loaded but responses are empty."
Write-Host "This means the block TEXT field might be empty in the database."
Write-Host "`nPlease run this query in Supabase SQL Editor:"
Write-Host "============================================" -ForegroundColor Yellow
Write-Host @"
SELECT 
    id,
    block_type,
    LEFT(text, 100) as text_preview,
    LENGTH(text) as text_length,
    topics,
    emotions,
    stage
FROM amora_response_blocks
WHERE active = true
  AND block_type = 'reflection'
  AND 'heartbreak' = ANY(topics)
LIMIT 5;
"@
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "`nIf text_length is 0, the blocks have no text content!"
Write-Host "That would explain why responses are empty.`n"
