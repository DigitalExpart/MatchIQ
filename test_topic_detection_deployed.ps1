# Test topic detection on deployed backend
Write-Host "Testing topic detection on deployed backend..." -ForegroundColor Cyan
Write-Host ""

$apiUrl = "https://macthiq-ai-backend.onrender.com/api/v1"
$userId = "413d84e9-4189-4199-809e-92f583d88169"

$testCases = @(
    @{
        message = "Im heartbroken"
        expectedTopics = @("breakup_grief", "heartbreak")
        description = "Heartbreak detection"
    },
    @{
        message = "I miss our sex life"
        expectedTopics = @("breakup_intimacy_loss")
        description = "Missing sex life - should detect breakup_intimacy_loss"
    },
    @{
        message = "i miss the way i and my ex do have sex"
        expectedTopics = @("breakup_intimacy_loss")
        description = "Missing way we had sex - should detect breakup_intimacy_loss"
    },
    @{
        message = "I miss our sex"
        expectedTopics = @("breakup_intimacy_loss")
        shouldNotHave = @("unlovable")
        description = "Missing sex - should NOT have unlovable (guardrail)"
    }
)

foreach ($test in $testCases) {
    Write-Host "Test: $($test.description)" -ForegroundColor Yellow
    Write-Host "  Message: '$($test.message)'" -ForegroundColor Gray
    
    $body = @{
        mode = "LEARN"
        specific_question = $test.message
        context = @{
            topics = @()
            mentioned_issues = @()
            relationship_status = "single"
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-WebRequest -Uri "$apiUrl/coach/" `
            -Method POST `
            -Headers @{
                "Content-Type" = "application/json"
                "X-User-Id" = $userId
            } `
            -Body $body `
            -TimeoutSec 30
        
        $data = $response.Content | ConvertFrom-Json
        
        Write-Host "  ✅ Response received" -ForegroundColor Green
        Write-Host "  Response preview: $($data.message.Substring(0, [Math]::Min(100, $data.message.Length)))..." -ForegroundColor Gray
        
        # Check if topics are in response (if available)
        if ($data.topics) {
            Write-Host "  Detected topics: $($data.topics -join ', ')" -ForegroundColor Cyan
        }
        
    } catch {
        Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "  Response: $responseBody" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Start-Sleep -Seconds 1
}

Write-Host "Testing complete!" -ForegroundColor Green
