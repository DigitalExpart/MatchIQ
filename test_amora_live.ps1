# Test Amora in production
# Run this after deployment completes

$body = @{
    mode = "LEARN"
    specific_question = "My love life is a mess"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/coach/" -Method Post -Body $body -ContentType "application/json"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "AMORA RESPONSE:" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host $response.message -ForegroundColor Green
Write-Host "`nConfidence: $($response.confidence)" -ForegroundColor Yellow
Write-Host "Mode: $($response.mode)" -ForegroundColor Yellow
Write-Host "`n========================================`n" -ForegroundColor Cyan
