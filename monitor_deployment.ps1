# Monitor Render deployment progress

$backendUrl = "https://macthiq-ai-backend.onrender.com"
$healthEndpoint = "/api/v1/coach/health"
$targetCommit = "4a0ac51"

Write-Host "========================================"
Write-Host " MONITORING RENDER DEPLOYMENT"
Write-Host "========================================"
Write-Host ""
Write-Host "Target commit: $targetCommit"
Write-Host "Fix: Changed .not_.is_() to .is_('embedding', 'not.null')"
Write-Host ""

$maxAttempts = 30
$attempt = 0

while ($attempt -lt $maxAttempts) {
    $attempt++
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    try {
        $health = Invoke-RestMethod -Uri "$backendUrl$healthEndpoint" -Method Get -TimeoutSec 5 -ErrorAction Stop
        
        Write-Host "[$timestamp] Attempt $attempt/$maxAttempts" -NoNewline
        
        if ($health.git_commit -like "*$targetCommit*" -or $health.git_commit -like "*4a0ac51*") {
            Write-Host " - [DEPLOYED]" -ForegroundColor Green
            Write-Host ""
            Write-Host "  Version: $($health.version)"
            Write-Host "  Git commit: $($health.git_commit)"
            Write-Host "  Blocks loaded: $($health.blocks_loaded)"
            Write-Host ""
            Write-Host "[SUCCESS] New version is live!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Running test..."
            Start-Sleep -Seconds 2
            & ".\test_amora_detailed.ps1"
            exit 0
        } else {
            Write-Host " - Old version: $($health.git_commit)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[$timestamp] Attempt $attempt/$maxAttempts - Service unavailable (deploying...)" -ForegroundColor Yellow
    }
    
    Start-Sleep -Seconds 10
}

Write-Host ""
Write-Host "[TIMEOUT] Deployment took longer than expected." -ForegroundColor Red
Write-Host "Check Render dashboard: https://dashboard.render.com/"
