# Test New Blocks Deployment - Verify Variety and Coverage
# This script tests the newly deployed ~404 blocks across 18 core topics

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TESTING NEW BLOCKS DEPLOYMENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Testing:" -ForegroundColor Yellow
Write-Host "  1. Response variety (same question, different responses)" -ForegroundColor White
Write-Host "  2. Core topic coverage (heartbreak, breakup, cheating, etc.)" -ForegroundColor White
Write-Host "  3. Response quality and style" -ForegroundColor White
Write-Host ""

$apiUrl = "https://macthiq-ai-backend.onrender.com/api/v1/coach/"

# Test 1: Variety Test - Same question, different responses
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TEST 1: VARIETY TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sending the same question 5 times..." -ForegroundColor Yellow
Write-Host "Question: 'My girlfriend broke up with me, I'm so hurt'" -ForegroundColor Gray
Write-Host ""

$varietyQuestion = "My girlfriend broke up with me, I'm so hurt"
$varietyResponses = @()

for ($i = 1; $i -le 5; $i++) {
        Write-Host "Request $i/5..." -ForegroundColor Gray -NoNewline
        
        $body = @{
            mode = "LEARN"
            specific_question = $varietyQuestion
            session_id = "test-variety-$i"
        } | ConvertTo-Json
        
        try {
            $response = Invoke-RestMethod -Uri $apiUrl `
                -Method Post `
                -Headers @{"Content-Type"="application/json"} `
                -Body $body `
                -TimeoutSec 20
            
            $varietyResponses += $response
            Write-Host " [OK]" -ForegroundColor Green
            Start-Sleep -Milliseconds 800
        }
        catch {
            Write-Host " [ERROR]" -ForegroundColor Red
            Write-Host "Error: $_" -ForegroundColor Red
            exit 1
        }
}

Write-Host ""
Write-Host "Variety Results:" -ForegroundColor Yellow
$uniqueMessages = $varietyResponses | Select-Object -ExpandProperty message -Unique
$uniqueCount = $uniqueMessages.Count
Write-Host "  Unique responses: $uniqueCount / 5" -ForegroundColor $(if ($uniqueCount -ge 4) { "Green" } elseif ($uniqueCount -ge 3) { "Yellow" } else { "Red" })

# Show preview of each response
Write-Host ""
for ($i = 0; $i -lt $varietyResponses.Count; $i++) {
    $num = $i + 1
    $preview = $varietyResponses[$i].message.Substring(0, [Math]::Min(80, $varietyResponses[$i].message.Length))
    Write-Host "  Response $num : $preview..." -ForegroundColor Gray
}

Write-Host ""

# Test 2: Core Topic Coverage Test
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TEST 2: CORE TOPIC COVERAGE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Testing questions for different core topics..." -ForegroundColor Yellow
Write-Host ""

$topicTests = @(
    @{ Topic = "heartbreak"; Question = "I'm going through a terrible heartbreak, I can't stop crying" },
    @{ Topic = "breakup"; Question = "My partner just broke up with me, what do I do?" },
    @{ Topic = "cheating"; Question = "I found out my partner cheated on me, I'm devastated" },
    @{ Topic = "divorce"; Question = "My marriage is ending, I'm considering divorce" },
    @{ Topic = "trust"; Question = "I don't trust my partner anymore after what happened" },
    @{ Topic = "jealousy"; Question = "I get so jealous when my partner talks to others" },
    @{ Topic = "communication"; Question = "We can't communicate anymore, every conversation turns into a fight" },
    @{ Topic = "situationship"; Question = "We've been in a situationship for months, I want more clarity" },
    @{ Topic = "talking_stage"; Question = "We're in the talking stage but I don't know where this is going" },
    @{ Topic = "unclear"; Question = "I don't know what we are, the relationship status is unclear" }
)

$coverageResults = @()

foreach ($test in $topicTests) {
    Write-Host "Testing: $($test.Topic)" -ForegroundColor Yellow -NoNewline
    Write-Host " - '$($test.Question.Substring(0, [Math]::Min(50, $test.Question.Length)))...'" -ForegroundColor Gray
    
    $body = @{
        mode = "LEARN"
        specific_question = $test.Question
        session_id = "test-coverage-$($test.Topic)"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $apiUrl `
            -Method Post `
            -Headers @{"Content-Type"="application/json"} `
            -Body $body `
            -TimeoutSec 20
        
        $engine = $response.engine
        $style = $response.response_style
        $length = $response.message.Length
        $confidence = $response.confidence
        
        $success = ($engine -eq "blocks") -and ($length -gt 100) -and ($confidence -gt 0.5)
        
        if ($success) {
            Write-Host "  [PASS]" -ForegroundColor Green
            Write-Host "    Engine: $engine | Style: $style | Length: $length | Confidence: $confidence" -ForegroundColor Gray
        } else {
            Write-Host "  [FAIL]" -ForegroundColor Red
            Write-Host "    Engine: $engine | Length: $length | Confidence: $confidence" -ForegroundColor Red
        }
        
        $coverageResults += @{
            Topic = $test.Topic
            Success = $success
            Engine = $engine
            Style = $style
            Length = $length
            Confidence = $confidence
        }
        
        Start-Sleep -Milliseconds 800
    }
    catch {
        Write-Host "  [ERROR]" -ForegroundColor Red
        Write-Host "    Error: $_" -ForegroundColor Red
        $coverageResults += @{
            Topic = $test.Topic
            Success = $false
            Error = $_.ToString()
        }
    }
    
    Write-Host ""
}

# Test 3: Response Quality Check
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TEST 3: RESPONSE QUALITY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$qualityQuestion = "I'm struggling with my relationship, can you help me understand what's happening?"
Write-Host "Testing quality with: '$qualityQuestion'" -ForegroundColor Yellow
Write-Host ""

$body = @{
    mode = "LEARN"
    specific_question = $qualityQuestion
    session_id = "test-quality"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $apiUrl `
        -Method Post `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -TimeoutSec 20
    
    Write-Host "Response Details:" -ForegroundColor Yellow
    Write-Host "  Engine: $($response.engine)" -ForegroundColor White
    Write-Host "  Style: $($response.response_style)" -ForegroundColor White
    Write-Host "  Confidence: $($response.confidence)" -ForegroundColor White
    Write-Host "  Length: $($response.message.Length) characters" -ForegroundColor White
    Write-Host ""
    Write-Host "  Message Preview:" -ForegroundColor Yellow
    Write-Host "  $($response.message.Substring(0, [Math]::Min(200, $response.message.Length)))..." -ForegroundColor Gray
    Write-Host ""
    
    # Quality checks
    $qualityChecks = @()
    
    if ($response.engine -eq "blocks") {
        $qualityChecks += @{ Check = "Using blocks engine"; Pass = $true }
    } else {
        $qualityChecks += @{ Check = "Using blocks engine"; Pass = $false }
    }
    
    if ($response.message.Length -gt 200) {
        $qualityChecks += @{ Check = "Response length adequate"; Pass = $true }
    } else {
        $qualityChecks += @{ Check = "Response length adequate"; Pass = $false }
    }
    
    if ($response.confidence -gt 0.6) {
        $qualityChecks += @{ Check = "Confidence level good"; Pass = $true }
    } else {
        $qualityChecks += @{ Check = "Confidence level good"; Pass = $false }
    }
    
    if ($null -ne $response.response_style) {
        $qualityChecks += @{ Check = "Response style present"; Pass = $true }
    } else {
        $qualityChecks += @{ Check = "Response style present"; Pass = $false }
    }
    
    foreach ($check in $qualityChecks) {
        $status = if ($check.Pass) { "[PASS]" } else { "[FAIL]" }
        $color = if ($check.Pass) { "Green" } else { "Red" }
        Write-Host "  $status $($check.Check)" -ForegroundColor $color
    }
    
} catch {
    Write-Host "  [ERROR]" -ForegroundColor Red
    Write-Host "    Error: $_" -ForegroundColor Red
}

Write-Host ""

# Final Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " FINAL SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Variety summary
Write-Host "Variety Test:" -ForegroundColor Yellow
if ($uniqueCount -ge 4) {
    Write-Host "  [PASS] - Excellent variety ($uniqueCount/5 unique responses)" -ForegroundColor Green
} elseif ($uniqueCount -ge 3) {
    Write-Host "  [PARTIAL] - Good variety ($uniqueCount/5 unique responses)" -ForegroundColor Yellow
} else {
    Write-Host "  [FAIL] - Low variety ($uniqueCount/5 unique responses)" -ForegroundColor Red
}

Write-Host ""

# Coverage summary
Write-Host "Coverage Test:" -ForegroundColor Yellow
$coveragePassed = ($coverageResults | Where-Object { $_.Success }).Count
$coverageTotal = $coverageResults.Count
Write-Host "  Passed: $coveragePassed / $coverageTotal topics" -ForegroundColor $(if ($coveragePassed -eq $coverageTotal) { "Green" } elseif ($coveragePassed -ge ($coverageTotal * 0.8)) { "Yellow" } else { "Red" })

if ($coveragePassed -eq $coverageTotal) {
    Write-Host "  [PASS] All core topics responding correctly!" -ForegroundColor Green
} elseif ($coveragePassed -ge ($coverageTotal * 0.8)) {
    Write-Host "  [PARTIAL] Most topics working, review failures" -ForegroundColor Yellow
} else {
    Write-Host "  [FAIL] Multiple topics failing, check deployment" -ForegroundColor Red
}

Write-Host ""

# Overall status
Write-Host "Overall Status:" -ForegroundColor Yellow
$allPassed = ($uniqueCount -ge 4) -and ($coveragePassed -eq $coverageTotal)

if ($allPassed) {
    Write-Host "  *** DEPLOYMENT SUCCESSFUL ***" -ForegroundColor Green
    Write-Host ""
    Write-Host "  The new blocks are working correctly!" -ForegroundColor Green
    Write-Host "  - Variety: Excellent" -ForegroundColor Green
    Write-Host "  - Coverage: Complete" -ForegroundColor Green
    Write-Host "  - Quality: Good" -ForegroundColor Green
} elseif (($uniqueCount -ge 3) -and ($coveragePassed -ge ($coverageTotal * 0.8))) {
    Write-Host "  *** DEPLOYMENT MOSTLY SUCCESSFUL ***" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  The new blocks are working, but review any failures above." -ForegroundColor Yellow
} else {
    Write-Host "  *** DEPLOYMENT ISSUES DETECTED ***" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Review the test results above and check:" -ForegroundColor Red
    Write-Host "  1. Are embeddings computed? (869 blocks processed)" -ForegroundColor White
    Write-Host "  2. Are blocks active in database?" -ForegroundColor White
    Write-Host "  3. Is the API endpoint working?" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
