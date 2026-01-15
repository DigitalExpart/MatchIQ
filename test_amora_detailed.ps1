# Detailed test to capture full JSON response

$backendUrl = "https://macthiq-ai-backend.onrender.com"
$coachEndpoint = "/api/v1/coach/"

Write-Host "Testing Amora with detailed output..." -ForegroundColor Cyan

$body = @{
    specific_question = "My girlfriend broke up with me, she cheated on me with my best friend... I'm very hurt right now..."
    mode = "LEARN"
    context = @{
        user_id = "test-user-123"
        session_id = "test-session-456"
    }
} | ConvertTo-Json -Depth 10

Write-Host "`nRequest body:"
Write-Host $body

try {
    $response = Invoke-RestMethod -Uri "$backendUrl$coachEndpoint" `
        -Method Post `
        -Body $body `
        -ContentType "application/json" `
        -TimeoutSec 30
    
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "FULL RESPONSE (JSON):" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "PARSED FIELDS:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Engine: $($response.engine)"
    Write-Host "Mode: $($response.mode)"
    Write-Host "Confidence: $($response.confidence)"
    Write-Host "Message length: $($response.message.Length) characters"
    Write-Host "`nMessage content:"
    Write-Host "---"
    Write-Host $response.message
    Write-Host "---"
    
    # Save to file for inspection
    $response | ConvertTo-Json -Depth 10 | Out-File "amora_test_response.json"
    Write-Host "`nFull response saved to: amora_test_response.json" -ForegroundColor Yellow
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody"
    }
}
