# Wait for the correct fix to deploy and test

$backendUrl = "https://macthiq-ai-backend.onrender.com"
$healthEndpoint = "/api/v1/coach/health"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " WAITING FOR CORRECT FIX TO DEPLOY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Commit: 36c440e"
Write-Host "Fix: .is_('embedding', 'not_null') with UNDERSCORE"
Write-Host ""

$attempt = 0
$maxAttempts = 50

while ($attempt -lt $maxAttempts) {
    $attempt++
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    try {
        $health = Invoke-RestMethod -Uri "$backendUrl$healthEndpoint" -Method Get -TimeoutSec 5 -ErrorAction Stop
        
        Write-Host "[$timestamp] Attempt $attempt - Blocks loaded: $($health.blocks_loaded)" -NoNewline
        
        if ($health.blocks_loaded -eq 94) {
            Write-Host " [SUCCESS]" -ForegroundColor Green
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host " BLOCKS ARE LOADED! TESTING NOW..." -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Start-Sleep -Seconds 2
            & ".\test_amora_detailed.ps1"
            exit 0
        } elseif ($health.blocks_loaded -eq 0) {
            Write-Host " [Still deploying...]" -ForegroundColor Yellow
        } else {
            Write-Host " [Unexpected count]" -ForegroundColor Red
        }
    } catch {
        Write-Host "[$timestamp] Attempt $attempt - Service unavailable (deploying...)" -ForegroundColor Yellow
    }
    
    Start-Sleep -Seconds 10
}

Write-Host ""
Write-Host "[TIMEOUT] Still not deployed after $maxAttempts attempts" -ForegroundColor Red
Write-Host "Check Render: https://dashboard.render.com/"
