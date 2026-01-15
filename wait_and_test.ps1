# Wait for Render deployment and test Amora

$backendUrl = "https://macthiq-ai-backend.onrender.com"
$healthEndpoint = "/api/v1/coach/health"
$coachEndpoint = "/api/v1/coach/"

Write-Host "========================================"
Write-Host " WAITING FOR RENDER DEPLOYMENT"
Write-Host "========================================"
Write-Host ""
Write-Host "Commit: fa1d223"
Write-Host "Changes:"
Write-Host "  - Added .not_.is_('embedding', 'null') filter to block selection"
Write-Host "  - Added detailed logging for block selection and composition"
Write-Host ""

# Wait for deployment (check health endpoint)
Write-Host "Checking if new version is deployed..."
$maxAttempts = 20
$attempt = 0
$deployed = $false

while ($attempt -lt $maxAttempts -and -not $deployed) {
    $attempt++
    Write-Host "  Attempt $attempt/$maxAttempts..."
    
    try {
        $health = Invoke-RestMethod -Uri "$backendUrl$healthEndpoint" -Method Get -TimeoutSec 5
        
        if ($health.git_commit -eq "fa1d223" -or $health.version -like "*blocks*") {
            Write-Host "  [OK] New version deployed!" -ForegroundColor Green
            Write-Host "    Version: $($health.version)"
            Write-Host "    Git commit: $($health.git_commit)"
            Write-Host "    Blocks loaded: $($health.blocks_loaded)"
            $deployed = $true
        } else {
            Write-Host "    Still on old version: $($health.git_commit)" -ForegroundColor Yellow
            Start-Sleep -Seconds 15
        }
    } catch {
        Write-Host "    Service unavailable (might be redeploying)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 15
    }
}

if (-not $deployed) {
    Write-Host "`n[ERROR] Deployment did not complete in time. Check Render dashboard:" -ForegroundColor Red
    Write-Host "   https://dashboard.render.com/"
    exit 1
}

# Test Amora
Write-Host "`n========================================"
Write-Host " TESTING AMORA BLOCKS ENGINE"
Write-Host "========================================"

$testMessage = "My girlfriend broke up with me, she cheated on me with my best friend... I'm very hurt right now..."

Write-Host "`nSending test message:"
Write-Host "  '$testMessage'"
Write-Host ""

$body = @{
    specific_question = $testMessage
    mode = "LEARN"
    context = @{
        user_id = "test-user-123"
        session_id = "test-session-$(Get-Random)"
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$backendUrl$coachEndpoint" `
        -Method Post `
        -Body $body `
        -ContentType "application/json" `
        -TimeoutSec 30
    
    Write-Host "RESPONSE RECEIVED:" -ForegroundColor Cyan
    Write-Host "==================" -ForegroundColor Cyan
    Write-Host "Engine: $($response.engine)" -ForegroundColor $(if ($response.engine -eq "blocks") { "Green" } else { "Red" })
    Write-Host "Confidence: $($response.confidence)"
    Write-Host "Message length: $($response.message.Length) characters"
    Write-Host ""
    Write-Host "Message:" -ForegroundColor Cyan
    Write-Host $response.message
    Write-Host ""
    Write-Host "Topics detected: $($response.referenced_data.topics -join ', ')"
    Write-Host "Emotions detected: $($response.referenced_data.emotions -join ', ')"
    Write-Host "Stage: $($response.referenced_data.stage)"
    Write-Host ""
    
    # Evaluate result
    if ($response.engine -eq "blocks" -and $response.message.Length -gt 100) {
        Write-Host "[SUCCESS] Blocks engine is working correctly!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:"
        Write-Host "  1. Test in the actual UI to confirm"
        Write-Host "  2. Try multiple messages to verify anti-repetition"
        Write-Host "  3. Test different topics (divorce, jealousy, etc.)"
    } elseif ($response.engine -eq "blocks" -and $response.message.Length -eq 0) {
        Write-Host "[BROKEN] Engine is 'blocks' but message is empty" -ForegroundColor Red
        Write-Host ""
        Write-Host "Check Render logs for:"
        Write-Host "  - 'Query for reflection stage X: found Y blocks'"
        Write-Host "  - 'Selected blocks: reflection=True/False...'"
        Write-Host "  - 'Reflection text length: X, preview: ...'"
        Write-Host ""
        Write-Host "If 'found 0 blocks', the query filter is wrong."
        Write-Host "If 'found X blocks' but 'Selected blocks: reflection=False', selection logic is broken."
    } else {
        Write-Host "[UNEXPECTED] Engine is: $($response.engine)" -ForegroundColor Yellow
        Write-Host "Check Render logs for errors in AmoraBlocksService"
    }
    
} catch {
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================"
Write-Host "To check Render logs:"
Write-Host "  https://dashboard.render.com/"
Write-Host "  -> macthiq-ai-backend -> Logs"
Write-Host "========================================"
