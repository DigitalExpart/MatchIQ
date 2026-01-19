# PowerShell script to test backend authentication with X-User-Id header
# Usage: .\test_backend_auth.ps1 YOUR_USER_ID_HERE

param(
    [string]$UserId = "00000000-0000-0000-0000-000000000001"
)

Write-Host "Testing backend authentication with X-User-Id header..." -ForegroundColor Cyan
Write-Host "User ID: $UserId" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== Testing GET /api/v1/coach/sessions ===" -ForegroundColor Green
$headers = @{
    "X-User-Id" = $UserId
    "Content-Type" = "application/json"
}
try {
    $response = Invoke-WebRequest -Uri "https://macthiq-ai-backend.onrender.com/api/v1/coach/sessions" `
        -Method GET `
        -Headers $headers `
        -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Testing POST /api/v1/coach/sessions ===" -ForegroundColor Green
$body = @{
    title = "Test Session"
    primary_topic = "heartbreak"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "https://macthiq-ai-backend.onrender.com/api/v1/coach/sessions" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Testing GET /api/v1/coach/sessions/followups/due ===" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "https://macthiq-ai-backend.onrender.com/api/v1/coach/sessions/followups/due" `
        -Method GET `
        -Headers $headers `
        -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
