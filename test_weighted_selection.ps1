# Test Weighted Random Selection - Verify Response Variation
# Run this after deployment to verify top-K weighted selection is working

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TESTING WEIGHTED RANDOM SELECTION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This test sends the SAME question 5 times" -ForegroundColor Yellow
Write-Host "Expected: 5 DIFFERENT responses (all high quality)" -ForegroundColor Yellow
Write-Host ""

$apiUrl = "https://macthiq-ai-backend.onrender.com/api/v1/coach/"
$question = "My girlfriend broke up with me, I'm so hurt"

$responses = @()

for ($i = 1; $i -le 5; $i++) {
    Write-Host "Request $i/5..." -ForegroundColor Gray
    
    $body = @{
        mode = "LEARN"
        specific_question = $question
        user_id = "test-weighted-$i"
        session_id = "test-session-$i"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $apiUrl `
            -Method Post `
            -Headers @{"Content-Type"="application/json"} `
            -Body $body `
            -TimeoutSec 15
        
        $responses += $response
        Start-Sleep -Milliseconds 500
    }
    catch {
        Write-Host "  Error: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Display all responses
for ($i = 0; $i -lt 5; $i++) {
    $num = $i + 1
    Write-Host "Response $num:" -ForegroundColor Green
    Write-Host "  Engine: $($responses[$i].engine)" -ForegroundColor White
    Write-Host "  Style: $($responses[$i].response_style)" -ForegroundColor White
    Write-Host "  Length: $($responses[$i].message.Length) chars" -ForegroundColor White
    Write-Host "  Preview: $($responses[$i].message.Substring(0, [Math]::Min(100, $responses[$i].message.Length)))..." -ForegroundColor Gray
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " VARIATION ANALYSIS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for uniqueness
$uniqueMessages = $responses | Select-Object -ExpandProperty message -Unique
$uniqueCount = $uniqueMessages.Count

Write-Host "Unique responses: $uniqueCount / 5" -ForegroundColor $(if ($uniqueCount -ge 4) { "Green" } elseif ($uniqueCount -ge 3) { "Yellow" } else { "Red" })
Write-Host ""

if ($uniqueCount -ge 4) {
    Write-Host "PASS - Excellent variation!" -ForegroundColor Green
    Write-Host "Top-K weighted selection is working correctly." -ForegroundColor Green
}
elseif ($uniqueCount -ge 3) {
    Write-Host "PARTIAL PASS - Good variation" -ForegroundColor Yellow
    Write-Host "Some repetition detected, but within acceptable range." -ForegroundColor Yellow
}
else {
    Write-Host "FAIL - Too much repetition" -ForegroundColor Red
    Write-Host "Weighted selection may not be working properly." -ForegroundColor Red
}

Write-Host ""

# Check quality (all should be blocks engine)
$allBlocks = $true
foreach ($r in $responses) {
    if ($r.engine -ne "blocks") {
        $allBlocks = $false
        break
    }
}

if ($allBlocks) {
    Write-Host "Quality check: PASS - All responses from blocks engine" -ForegroundColor Green
}
else {
    Write-Host "Quality check: FAIL - Some responses not from blocks engine" -ForegroundColor Red
}

Write-Host ""

# Check length variation
$lengths = $responses | ForEach-Object { $_.message.Length }
$minLength = ($lengths | Measure-Object -Minimum).Minimum
$maxLength = ($lengths | Measure-Object -Maximum).Maximum
$lengthVariation = $maxLength - $minLength

Write-Host "Length variation: $lengthVariation chars (min: $minLength, max: $maxLength)" -ForegroundColor White
if ($lengthVariation -gt 50) {
    Write-Host "  Good length variation" -ForegroundColor Green
}
else {
    Write-Host "  Low length variation (may indicate repetition)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
