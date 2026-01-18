# Test Amora's Expanded Block Library
# Tests the 10 new topics added

$baseUrl = "https://macthiq-ai-backend.onrender.com/api/v1/coach"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TESTING AMORA - EXPANDED TOPICS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test scenarios for the 10 new topics
$scenarios = @(
    @{
        Name = "Mismatched Expectations"
        Question = "My boyfriend doesn't want kids but I do. I don't know what to do."
    },
    @{
        Name = "Feeling Unappreciated"
        Question = "I do everything for my partner but they never say thank you or notice."
    },
    @{
        Name = "Constant Fighting"
        Question = "We fight about everything. Even small things turn into huge arguments."
    },
    @{
        Name = "Long Distance"
        Question = "My girlfriend moved to another state for work. I miss her so much and I'm scared we won't make it."
    },
    @{
        Name = "One-Sided Effort"
        Question = "I'm always the one who texts first, plans dates, and apologizes. He never puts in effort."
    },
    @{
        Name = "Friend vs Romantic"
        Question = "I have feelings for my best friend but I don't know if it's romantic or just close friendship."
    },
    @{
        Name = "Stuck on Ex"
        Question = "It's been a year since we broke up but I still think about my ex every day."
    },
    @{
        Name = "Comparison to Others"
        Question = "I keep comparing myself to my boyfriend's ex-girlfriend. She's prettier and more successful than me."
    },
    @{
        Name = "Low Self-Worth"
        Question = "I feel like I'm not lovable. Every relationship ends with them leaving me."
    },
    @{
        Name = "Dating App Burnout"
        Question = "I'm so tired of dating apps. Everyone ghosts or just wants hookups. I'm about to give up."
    }
)

$results = @()

foreach ($scenario in $scenarios) {
    Write-Host "Testing: $($scenario.Name)" -ForegroundColor Yellow
    Write-Host "Question: $($scenario.Question.Substring(0, [Math]::Min(60, $scenario.Question.Length)))..." -ForegroundColor Gray
    
    try {
        $body = @{
            specific_question = $scenario.Question
            mode = "LEARN"
            context = @{
                recent_messages = @()
            }
        } | ConvertTo-Json -Depth 10
        
        $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $body -ContentType "application/json"
        
        $success = $response.engine -eq "blocks" -and $response.message.Length -gt 100
        
        if ($success) {
            Write-Host "  ✓ Engine: $($response.engine)" -ForegroundColor Green
            Write-Host "  ✓ Length: $($response.message.Length) chars" -ForegroundColor Green
            Write-Host "  ✓ Preview: $($response.message.Substring(0, [Math]::Min(80, $response.message.Length)))..." -ForegroundColor Green
            $results += @{ Name = $scenario.Name; Success = $true }
        }
        else {
            Write-Host "  ✗ Engine: $($response.engine) (expected: blocks)" -ForegroundColor Red
            Write-Host "  ✗ Length: $($response.message.Length) chars (expected: >100)" -ForegroundColor Red
            Write-Host "  ✗ Message: $($response.message)" -ForegroundColor Red
            $results += @{ Name = $scenario.Name; Success = $false }
        }
    }
    catch {
        Write-Host "  ✗ ERROR: $_" -ForegroundColor Red
        $results += @{ Name = $scenario.Name; Success = $false }
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
    Write-Host "All new topics are working correctly! 🎉" -ForegroundColor Green
}
elseif ($successCount -gt 0) {
    Write-Host "Some topics are working, but $($totalCount - $successCount) need attention." -ForegroundColor Yellow
}
else {
    Write-Host "No topics are working. Check if the SQL was run and embeddings were computed." -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
