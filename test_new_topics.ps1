# Quick test for expanded topics
$baseUrl = "https://macthiq-ai-backend.onrender.com/api/v1/coach"

Write-Host "Testing Amora's Expanded Topics..." -ForegroundColor Cyan
Write-Host ""

$tests = @(
    "My boyfriend doesn't want kids but I do",
    "I do everything but my partner never appreciates me",
    "We fight about everything constantly",
    "My girlfriend is in another state and I miss her",
    "I'm always the one putting in all the effort",
    "I have feelings for my best friend",
    "I can't stop thinking about my ex",
    "I keep comparing myself to my boyfriend's ex",
    "I feel like I'm not lovable",
    "I'm exhausted from dating apps"
)

$success = 0
$total = $tests.Count

foreach ($question in $tests) {
    Write-Host "Testing: $($question.Substring(0, [Math]::Min(50, $question.Length)))..." -ForegroundColor Yellow
    
    try {
        $body = @{
            specific_question = $question
            mode = "LEARN"
            context = @{ recent_messages = @() }
        } | ConvertTo-Json -Depth 10
        
        $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $body -ContentType "application/json"
        
        if ($response.engine -eq "blocks" -and $response.message.Length -gt 100) {
            Write-Host "  PASS - Engine: blocks, Length: $($response.message.Length)" -ForegroundColor Green
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
    Start-Sleep -Milliseconds 300
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Results: $success / $total passed" -ForegroundColor $(if ($success -eq $total) { "Green" } else { "Yellow" })
Write-Host "========================================" -ForegroundColor Cyan
