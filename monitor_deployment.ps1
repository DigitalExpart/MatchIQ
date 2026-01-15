# Monitor Render deployment progress

$backendUrl = "https://macthiq-ai-backend.onrender.com"
$healthEndpoint = "/api/v1/coach/health"
$targetCommit = "966b453"

Write-Host "========================================"
Write-Host " MONITORING RENDER DEPLOYMENT"
Write-Host "========================================"
Write-Host ""
Write-Host "Target commit: $targetCommit"
Write-Host "Fix: Use .neq(field, None) for NOT NULL filter"
Write-Host ""

$maxAttempts = 40
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $attempt++
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    try {
        $health = Invoke-RestMethod -Uri "$backendUrl$healthEndpoint" -Method Get -TimeoutSec 5 -ErrorAction Stop
        
        Write-Host "[$timestamp] Attempt $attempt/$maxAttempts" -NoNewline
        
        if ($health.blocks_loaded -gt 0) {
            Write-Host " - [DEPLOYED]" -ForegroundColor Green
            Write-Host ""
            Write-Host "  Version: $($health.version)"
            Write-Host "  Blocks loaded: $($health.blocks_loaded)"
            Write-Host ""
            Write-Host "[SUCCESS] Blocks are loading! Testing now..." -ForegroundColor Green
            Write-Host ""
            Start-Sleep -Seconds 2
            & ".\test_amora_detailed.ps1"
            exit 0
        } else {
            Write-Host " - Blocks: $($health.blocks_loaded) (waiting...)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[$timestamp] Attempt $attempt/$maxAttempts - Service unavailable (deploying...)" -ForegroundColor Yellow
    }
    
    Start-Sleep -Seconds 10
}

Write-Host ""
Write-Host "[TIMEOUT] Deployment took longer than expected." -ForegroundColor Red
Write-Host "Check Render dashboard: https://dashboard.render.com/"
