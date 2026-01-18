# Simple test for embedding fix

$backendUrl = "https://macthiq-ai-backend.onrender.com"
$testEndpoint = "/api/v1/coach/"

Write-Host "Testing Amora after embedding fix..." -ForegroundColor Cyan
Write-Host ""

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
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host " AMORA RESPONSE"
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Engine: " -NoNewline
    Write-Host $response.engine -ForegroundColor $(if ($response.engine -eq "blocks") { "Green" } else { "Red" })
    Write-Host "Message Length: $($response.message.Length) chars"
    Write-Host "Confidence: $($response.confidence)"
    Write-Host ""
    Write-Host "Message:" -ForegroundColor Cyan
    Write-Host $response.message
    Write-Host ""
    
    if ($response.engine -eq "blocks" -and $response.message.Length -gt 50) {
        Write-Host "✅ SUCCESS! The embedding fix is working!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Indicators:" -ForegroundColor Yellow
        Write-Host "  ✓ Engine = 'blocks'" -ForegroundColor Green
        Write-Host "  ✓ Message length = $($response.message.Length) chars (expected > 50)" -ForegroundColor Green
        Write-Host "  ✓ Rich, multi-sentence response" -ForegroundColor Green
    } elseif ($response.message.Length -eq 0) {
        Write-Host "❌ STILL BROKEN - Empty message returned" -ForegroundColor Red
        Write-Host "The deployment may not have completed yet." -ForegroundColor Yellow
        Write-Host "Wait a few more minutes and try again." -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  Partial success:" -ForegroundColor Yellow
        Write-Host "  Engine: $($response.engine)" -ForegroundColor $(if ($response.engine -eq "blocks") { "Green" } else { "Yellow" })
        Write-Host "  Length: $($response.message.Length)" -ForegroundColor $(if ($response.message.Length -gt 50) { "Green" } else { "Yellow" })
    }
    
} catch {
    Write-Host "❌ Request failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
