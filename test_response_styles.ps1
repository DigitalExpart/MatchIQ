# Test Dynamic Response Styles
$baseUrl = "https://macthiq-ai-backend.onrender.com/api/v1/coach"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TESTING DYNAMIC RESPONSE STYLES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test cases designed to trigger different styles
$tests = @(
    @{
        Name = "GROUNDING (first turn, heavy topic)"
        Message = "How can i deal with my break up"
        ExpectedStyle = "GROUNDING"
        ExpectedLength = @(300, 500)
    },
    @{
        Name = "DEEPENING (emotional sharing)"
        Message = "the way we had romantic moments dinner"
        ExpectedStyle = "DEEPENING"
        ExpectedLength = @(400, 700)
    },
    @{
        Name = "DEEPENING (confusion)"
        Message = "i dont no im confused if it lust or love"
        ExpectedStyle = "DEEPENING"
        ExpectedLength = @(400, 700)
    },
    @{
        Name = "GUIDANCE_SESSION (advice request)"
        Message = "i cant say can you give me advice"
        ExpectedStyle = "GUIDANCE_SESSION"
        ExpectedLength = @(600, 1000)
    },
    @{
        Name = "GROUNDING (toxic dynamic, first turn)"
        Message = "My partner calls me names when they're angry"
        ExpectedStyle = "GROUNDING"
        ExpectedLength = @(300, 500)
    },
    @{
        Name = "GUIDANCE_SESSION (explicit help request)"
        Message = "What should I do about my relationship"
        ExpectedStyle = "GUIDANCE_SESSION"
        ExpectedLength = @(600, 1000)
    }
)

$results = @()

foreach ($test in $tests) {
    Write-Host "Testing: $($test.Name)" -ForegroundColor Yellow
    Write-Host "Message: $($test.Message)" -ForegroundColor Gray
    Write-Host "Expected Style: $($test.ExpectedStyle)" -ForegroundColor Gray
    Write-Host ""
    
    try {
        $body = @{
            specific_question = $test.Message
            mode = "LEARN"
            context = @{ recent_messages = @() }
        } | ConvertTo-Json -Depth 10
        
        $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $body -ContentType "application/json"
        
        $actualStyle = $response.referenced_data.response_style
        $actualLength = $response.message.Length
        $minLength = $test.ExpectedLength[0]
        $maxLength = $test.ExpectedLength[1]
        
        # Check if style matches
        $styleMatch = $actualStyle -eq $test.ExpectedStyle
        
        # Check if length is in expected range (with 20% tolerance)
        $lengthOk = $actualLength -ge ($minLength * 0.8) -and $actualLength -le ($maxLength * 1.2)
        
        if ($styleMatch -and $lengthOk) {
            Write-Host "  PASS" -ForegroundColor Green
            Write-Host "    Style: $actualStyle (expected: $($test.ExpectedStyle))" -ForegroundColor Green
            Write-Host "    Length: $actualLength chars (expected: $minLength-$maxLength)" -ForegroundColor Green
            Write-Host "    Preview: $($response.message.Substring(0, [Math]::Min(100, $response.message.Length)))..." -ForegroundColor Gray
            $results += @{ Name = $test.Name; Success = $true }
        }
        elseif ($styleMatch) {
            Write-Host "  PARTIAL" -ForegroundColor Yellow
            Write-Host "    Style: $actualStyle (CORRECT)" -ForegroundColor Green
            Write-Host "    Length: $actualLength chars (expected: $minLength-$maxLength)" -ForegroundColor Yellow
            Write-Host "    Preview: $($response.message.Substring(0, [Math]::Min(100, $response.message.Length)))..." -ForegroundColor Gray
            $results += @{ Name = $test.Name; Success = $true }
        }
        else {
            Write-Host "  FAIL" -ForegroundColor Red
            Write-Host "    Style: $actualStyle (expected: $($test.ExpectedStyle))" -ForegroundColor Red
            Write-Host "    Length: $actualLength chars (expected: $minLength-$maxLength)" -ForegroundColor $(if ($lengthOk) { "Green" } else { "Red" })
            Write-Host "    Preview: $($response.message.Substring(0, [Math]::Min(100, $response.message.Length)))..." -ForegroundColor Gray
            $results += @{ Name = $test.Name; Success = $false }
        }
    }
    catch {
        Write-Host "  ERROR: $_" -ForegroundColor Red
        $results += @{ Name = $test.Name; Success = $false }
    }
    
    Write-Host ""
    Start-Sleep -Milliseconds 500
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$successCount = ($results | Where-Object { $_.Success }).Count
$totalCount = $results.Count

Write-Host "Success Rate: $successCount / $totalCount" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })
Write-Host ""

foreach ($result in $results) {
    $status = if ($result.Success) { "PASS" } else { "FAIL" }
    $color = if ($result.Success) { "Green" } else { "Red" }
    Write-Host "$status - $($result.Name)" -ForegroundColor $color
}

Write-Host ""

if ($successCount -eq $totalCount) {
    Write-Host "All response styles working correctly!" -ForegroundColor Green
    Write-Host "Amora now dynamically adapts her response depth!" -ForegroundColor Cyan
}
elseif ($successCount -gt 0) {
    Write-Host "Some styles working. Review failures and adjust heuristics." -ForegroundColor Yellow
}
else {
    Write-Host "Styles not working. Check if code was deployed." -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
