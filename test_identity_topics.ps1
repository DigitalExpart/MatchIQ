# Quick test for 3 new identity topics
$baseUrl = "https://macthiq-ai-backend.onrender.com/api/v1/coach"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TESTING NEW IDENTITY TOPICS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$tests = @(
    @{
        Name = "LGBTQ+ Family Pressure"
        Question = "I'm in a same-sex relationship and my family doesn't know. They make comments about how wrong it is and I'm terrified to come out."
    },
    @{
        Name = "Non-Monogamy Tension"
        Question = "My partner wants to open our relationship and I'm not sure how I feel. Part of me is scared they'll find someone better and leave."
    },
    @{
        Name = "Asexuality Identity"
        Question = "I think I might be asexual. I've never really wanted sex with anyone and I feel broken because of it."
    }
)

$success = 0
$total = $tests.Count

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
        
        if ($response.engine -eq "blocks" -and $response.message.Length -gt 100) {
            Write-Host "  PASS - Engine: blocks, Length: $($response.message.Length)" -ForegroundColor Green
            Write-Host "  Preview: $($response.message.Substring(0, [Math]::Min(100, $response.message.Length)))..." -ForegroundColor Gray
            $success++
        }
        else {
            Write-Host "  FAIL - Engine: $($response.engine), Length: $($response.message.Length)" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "  ERROR: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Start-Sleep -Milliseconds 500
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Results: $success / $total passed" -ForegroundColor $(if ($success -eq $total) { "Green" } else { "Yellow" })
Write-Host "========================================" -ForegroundColor Cyan

if ($success -eq $total) {
    Write-Host ""
    Write-Host "All 3 new identity topics working!" -ForegroundColor Green
    Write-Host "Amora now has 529 blocks covering 26 topics" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Ready for stress-testing!" -ForegroundColor Yellow
}
