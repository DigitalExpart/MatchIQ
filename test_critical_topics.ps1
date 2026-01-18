# Test Amora's Critical Topics
$baseUrl = "https://macthiq-ai-backend.onrender.com/api/v1/coach"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TESTING CRITICAL TOPICS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$tests = @(
    @{
        Name = "Toxic/Abusive Dynamic"
        Question = "My boyfriend gets really angry when I talk to other guys. He checks my phone and tells me what to wear."
    },
    @{
        Name = "Values/Religion Conflict"
        Question = "I'm Christian and my girlfriend is Muslim. Our families are pressuring us to break up."
    },
    @{
        Name = "Intimacy Mismatch"
        Question = "My wife never wants to have sex anymore. It's been 6 months. I feel rejected."
    },
    @{
        Name = "Partner Mental Health"
        Question = "My boyfriend is depressed and won't get help. I'm exhausted from trying to keep him afloat."
    },
    @{
        Name = "Coparenting Issues"
        Question = "My ex undermines my parenting decisions and talks badly about me to our kids."
    },
    @{
        Name = "Sexual Compatibility"
        Question = "I want to explore different things sexually but my partner thinks it's weird. I feel ashamed."
    }
)

$results = @()

foreach ($test in $tests) {
    Write-Host "Testing: $($test.Name)" -ForegroundColor Yellow
    Write-Host "Question: $($test.Question.Substring(0, [Math]::Min(70, $test.Question.Length)))..." -ForegroundColor Gray
    
    try {
        $body = @{
            specific_question = $test.Question
            mode = "LEARN"
            context = @{ recent_messages = @() }
        } | ConvertTo-Json -Depth 10
        
        $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $body -ContentType "application/json"
        
        $success = $response.engine -eq "blocks" -and $response.message.Length -gt 100
        
        if ($success) {
            Write-Host "  Engine: $($response.engine)" -ForegroundColor Green
            Write-Host "  Length: $($response.message.Length) chars" -ForegroundColor Green
            Write-Host "  Preview: $($response.message.Substring(0, [Math]::Min(100, $response.message.Length)))..." -ForegroundColor Green
            $results += @{ Name = $test.Name; Success = $true }
        }
        else {
            Write-Host "  Engine: $($response.engine) (expected: blocks)" -ForegroundColor Red
            Write-Host "  Length: $($response.message.Length) chars" -ForegroundColor Red
            Write-Host "  Message: $($response.message)" -ForegroundColor Red
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
    Write-Host "All critical topics working! Amora can now handle sensitive relationship issues." -ForegroundColor Green
}
elseif ($successCount -gt 0) {
    Write-Host "Some topics working, but $($totalCount - $successCount) need attention." -ForegroundColor Yellow
}
else {
    Write-Host "Topics not working. Check if SQL was run and embeddings computed." -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
