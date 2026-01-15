# Compute Embeddings Remotely via API
# Run this after Render finishes deploying

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " COMPUTING EMBEDDINGS REMOTELY" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$API_URL = "https://macthiq-ai-backend.onrender.com/api/v1"

# Step 1: Check current status
Write-Host "[1/3] Checking current blocks status..." -ForegroundColor Yellow
try {
    $status = Invoke-RestMethod -Uri "$API_URL/admin/blocks-status" -Method Get -TimeoutSec 30
    Write-Host "Total blocks: $($status.total_blocks)" -ForegroundColor Green
    Write-Host "With embeddings: $($status.with_embeddings)" -ForegroundColor Green
    Write-Host "Without embeddings: $($status.without_embeddings)" -ForegroundColor Yellow
    Write-Host "Completion: $($status.percentage_complete)" -ForegroundColor Green
    
    if ($status.ready) {
        Write-Host "`n All blocks already have embeddings!" -ForegroundColor Green
        exit 0
    }
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    Write-Host "`nMake sure Render has finished deploying the new code." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n----------------------------------------`n" -ForegroundColor Cyan

# Step 2: Compute embeddings
Write-Host "[2/3] Computing embeddings (this may take 2-3 minutes)..." -ForegroundColor Yellow
Write-Host "Please wait..." -ForegroundColor Gray

try {
    $result = Invoke-RestMethod -Uri "$API_URL/admin/compute-embeddings" -Method Post -TimeoutSec 300
    
    Write-Host "`nStatus: $($result.status)" -ForegroundColor Green
    Write-Host "Message: $($result.message)" -ForegroundColor Green
    Write-Host "Processed: $($result.processed) / $($result.total)" -ForegroundColor Green
    Write-Host "Success Rate: $($result.success_rate)" -ForegroundColor Green
    
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    Write-Host "`nThis might mean:" -ForegroundColor Yellow
    Write-Host "1. The operation timed out (it's still running, check Render logs)" -ForegroundColor Gray
    Write-Host "2. Network issue" -ForegroundColor Gray
    Write-Host "3. Server error (check Render logs)" -ForegroundColor Gray
    exit 1
}

Write-Host "`n----------------------------------------`n" -ForegroundColor Cyan

# Step 3: Verify
Write-Host "[3/3] Verifying embeddings were computed..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

try {
    $final_status = Invoke-RestMethod -Uri "$API_URL/admin/blocks-status" -Method Get -TimeoutSec 30
    
    Write-Host "Total blocks: $($final_status.total_blocks)" -ForegroundColor Green
    Write-Host "With embeddings: $($final_status.with_embeddings)" -ForegroundColor Green
    Write-Host "Completion: $($final_status.percentage_complete)" -ForegroundColor Green
    
    if ($final_status.ready) {
        Write-Host "`n SUCCESS! All embeddings computed!" -ForegroundColor Green
        Write-Host " Blocks engine is now READY!" -ForegroundColor Green
    } else {
        Write-Host "`n WARNING: Some blocks still missing embeddings" -ForegroundColor Yellow
        Write-Host "Try running this script again" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "ERROR checking final status: $_" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " DONE!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next step: Test the blocks engine" -ForegroundColor Cyan
Write-Host "Run: powershell -ExecutionPolicy Bypass -File test_blocks_deployed.ps1`n" -ForegroundColor White
