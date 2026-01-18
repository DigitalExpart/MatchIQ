# Test Amora with multiple relationship scenarios

$backendUrl = "https://macthiq-ai-backend.onrender.com"
$testEndpoint = "/api/v1/coach/"

$scenarios = @(
    @{
        name = "Heartbreak/Breakup"
        question = "My girlfriend broke up with me, she cheated on me with my best friend... I'm very hurt right now..."
    },
    @{
        name = "Divorce"
        question = "I'm going through a divorce after 10 years of marriage. I feel like I've wasted my life."
    },
    @{
        name = "Trust Issues"
        question = "I found messages on my boyfriend's phone. I don't know if I can trust him anymore."
    },
    @{
        name = "Situationship"
        question = "We've been talking for 3 months but he won't make it official. I'm confused about where this is going."
    },
    @{
        name = "Moving On"
        question = "It's been 6 months since the breakup but I still think about her every day. How do I move on?"
    }
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TESTING AMORA - MULTIPLE SCENARIOS"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$results = @()

foreach ($scenario in $scenarios) {
    Write-Host "Testing: $($scenario.name)" -ForegroundColor Yellow
    Write-Host "Question: $($scenario.question.Substring(0, [Math]::Min(60, $scenario.question.Length)))..."
    
    $testPayload = @{
        specific_question = $scenario.question
        mode = "LEARN"
        context = @{}
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$backendUrl$testEndpoint" -Method Post -Body $testPayload -ContentType "application/json" -TimeoutSec 15
        
        $result = @{
            scenario = $scenario.name
            engine = $response.engine
            length = $response.message.Length
            confidence = $response.confidence
            message = $response.message
            success = ($response.engine -eq "blocks" -and $response.message.Length -gt 50)
        }
        
        $results += $result
        
        if ($result.success) {
            Write-Host "  Engine: $($result.engine)" -ForegroundColor Green
            Write-Host "  Length: $($result.length) chars" -ForegroundColor Green
            Write-Host "  Preview: $($result.message.Substring(0, [Math]::Min(80, $result.message.Length)))..." -ForegroundColor Gray
        } else {
            Write-Host "  FAILED - Engine: $($result.engine), Length: $($result.length)" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $results += @{
            scenario = $scenario.name
            success = $false
            error = $_.Exception.Message
        }
    }
    
    Write-Host ""
    Start-Sleep -Seconds 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " SUMMARY"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$successCount = ($results | Where-Object { $_.success -eq $true }).Count
$totalCount = $results.Count

Write-Host "Success Rate: $successCount / $totalCount" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })
Write-Host ""

foreach ($result in $results) {
    $status = if ($result.success) { "PASS" } else { "FAIL" }
    $color = if ($result.success) { "Green" } else { "Red" }
    Write-Host "$status - $($result.scenario)" -ForegroundColor $color
}

Write-Host ""

if ($successCount -eq $totalCount) {
    Write-Host "All scenarios passed! Amora is working correctly across multiple topics." -ForegroundColor Green
} else {
    Write-Host "Some scenarios failed. Review the details above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
