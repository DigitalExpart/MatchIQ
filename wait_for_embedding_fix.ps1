# Wait for Render deployment of embedding fix and test

$backendUrl = "https://macthiq-ai-backend.onrender.com"
$healthEndpoint = "/api/v1/coach/health"
$testEndpoint = "/api/v1/coach/"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " WAITING FOR EMBEDDING FIX DEPLOYMENT"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Commit: e236751 - Parse embedding strings from Supabase"
Write-Host "Expected: Embeddings will be parsed from JSON strings to arrays"
Write-Host ""

# Wait for deployment
Write-Host "[1/3] Monitoring deployment status..." -ForegroundColor Yellow
$maxAttempts = 20
$attempt = 0
$deployed = $false

while ($attempt -lt $maxAttempts) {
    $attempt++
    Write-Host "  Attempt $attempt/$maxAttempts - Checking health endpoint..."
    
    try {
        $health = Invoke-RestMethod -Uri "$backendUrl$healthEndpoint" -Method Get -TimeoutSec 5 -ErrorAction Stop
        
        if ($health.git_commit -eq "e236751") {
            Write-Host "  ✅ New deployment detected! (commit: $($health.git_commit))" -ForegroundColor Green
            $deployed = $true
            break
        } else {
            Write-Host "  Current commit: $($health.git_commit) (waiting for e236751...)"
        }
    } catch {
        Write-Host "  Service not responding yet..."
    }
    
    if ($attempt -lt $maxAttempts) {
        Write-Host "  Waiting 30 seconds before retry..."
        Start-Sleep -Seconds 30
    }
}

if (-not $deployed) {
    Write-Host ""
    Write-Host "❌ Deployment not detected after $maxAttempts attempts" -ForegroundColor Red
    Write-Host "Please check Render dashboard manually: https://dashboard.render.com"
    exit 1
}

Write-Host ""
Write-Host "[2/3] Testing Amora with heartbreak scenario..." -ForegroundColor Yellow

$testPayload = @{
    specific_question = "My girlfriend broke up with me, she cheated on me with my best friend... I'm very hurt right now..."
    mode = "LEARN"
    context = @{}
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$backendUrl$testEndpoint" `
        -Method Post `
        -Body $testPayload `
        -ContentType "application/json" `
        -TimeoutSec 15
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host " TEST RESULTS"
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Engine: $($response.engine)" -ForegroundColor $(if ($response.engine -eq "blocks") { "Green" } else { "Red" })
    Write-Host "Message Length: $($response.message.Length) chars"
    Write-Host "Confidence: $($response.confidence)"
    Write-Host ""
    Write-Host "Message:" -ForegroundColor Cyan
    Write-Host $response.message
    Write-Host ""
    
    if ($response.engine -eq "blocks" -and $response.message.Length -gt 50) {
        Write-Host "✅ SUCCESS! Amora is now using the block-based engine with rich responses!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Key indicators:" -ForegroundColor Yellow
        Write-Host "  ✓ Engine = 'blocks'" -ForegroundColor Green
        Write-Host "  ✓ Message length > 50 chars (actual: $($response.message.Length))" -ForegroundColor Green
        Write-Host "  ✓ No ValueError in logs" -ForegroundColor Green
        Write-Host "  ✓ Embeddings parsed correctly" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Response received but may not be optimal:" -ForegroundColor Yellow
        Write-Host "  Engine: $($response.engine) (expected: blocks)" -ForegroundColor $(if ($response.engine -eq "blocks") { "Green" } else { "Yellow" })
        Write-Host "  Length: $($response.message.Length) (expected: > 50)" -ForegroundColor $(if ($response.message.Length -gt 50) { "Green" } else { "Yellow" })
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ Test request failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ""
    Write-Host "Check Render logs for errors."
    exit 1
}

Write-Host ""
Write-Host "[3/3] Checking Render logs for errors..." -ForegroundColor Yellow
Write-Host "Please manually verify in Render dashboard that there are NO more:"
Write-Host "  ❌ 'ValueError: could not convert string to float'" -ForegroundColor Red
Write-Host ""
Write-Host "You should now see:" -ForegroundColor Green
Write-Host "  ✅ 'Selected reflection block: score=X.XXX'" -ForegroundColor Green
Write-Host "  ✅ 'Selected normalization block: score=X.XXX'" -ForegroundColor Green
Write-Host "  ✅ 'Selected exploration block: score=X.XXX'" -ForegroundColor Green
Write-Host "  ✅ 'Composed message length: XXX'" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " DEPLOYMENT COMPLETE"
Write-Host "========================================" -ForegroundColor Cyan
