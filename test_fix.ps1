$backendUrl = "https://macthiq-ai-backend.onrender.com"
$testEndpoint = "/api/v1/coach/"

Write-Host "Testing Amora after embedding fix..." -ForegroundColor Cyan

$testPayload = @{
    specific_question = "My girlfriend broke up with me, she cheated on me with my best friend... I'm very hurt right now..."
    mode = "LEARN"
    context = @{}
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$backendUrl$testEndpoint" -Method Post -Body $testPayload -ContentType "application/json" -TimeoutSec 15
    
    Write-Host "Engine: $($response.engine)"
    Write-Host "Message Length: $($response.message.Length) chars"
    Write-Host "Message: $($response.message)"
    
    if ($response.engine -eq "blocks" -and $response.message.Length -gt 50) {
        Write-Host "SUCCESS - Fix is working!" -ForegroundColor Green
    } elseif ($response.message.Length -eq 0) {
        Write-Host "STILL BROKEN - Empty message" -ForegroundColor Red
    } else {
        Write-Host "PARTIAL - Check details above" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
