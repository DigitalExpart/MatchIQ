# Test Amora Blocks Engine in Production
# This script tests the /api/v1/coach/ endpoint to verify it's using the new blocks engine

$backendUrl = "https://macthiq-ai-backend.onrender.com"
$coachEndpoint = "/api/v1/coach/"

Write-Host "========================================"
Write-Host " TESTING AMORA BLOCKS ENGINE"
Write-Host "========================================"

# Test cases with different emotional contexts
$testCases = @(
    @{
        message = "My girlfriend broke up with me, she cheated on me with my best friend... I'm very hurt right now..."
        mode = "LEARN"
        description = "Heartbreak + Cheating (High Emotion)"
    },
    @{
        message = "How does my past affect my present relationships?"
        mode = "LEARN"
        description = "Reflection on Past"
    },
    @{
        message = "I'm reflecting about my life, the mistakes I have done in the past"
        mode = "LEARN"
        description = "General Reflection"
    },
    @{
        message = "I think my partner is jealous and doesn't trust me"
        mode = "LEARN"
        description = "Trust Issues"
    }
)

foreach ($testCase in $testCases) {
    Write-Host "`n----------------------------------------"
    Write-Host "TEST: $($testCase.description)"
    Write-Host "----------------------------------------"
    Write-Host "User message: $($testCase.message)"
    Write-Host ""
    
    $body = @{
        specific_question = $testCase.message
        mode = $testCase.mode
        context = @{
            user_id = "test-user-123"
            session_id = "test-session-456"
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "$backendUrl$coachEndpoint" `
            -Method Post `
            -Body $body `
            -ContentType "application/json" `
            -TimeoutSec 30
        
        Write-Host "ENGINE: $($response.engine)" -ForegroundColor $(if ($response.engine -eq "blocks") { "Green" } else { "Red" })
        Write-Host "CONFIDENCE: $($response.confidence)"
        Write-Host "MODE: $($response.mode)"
        Write-Host ""
        Write-Host "RESPONSE:" -ForegroundColor Cyan
        Write-Host $response.message
        Write-Host ""
        
        # Check if response is generic
        $genericPhrases = @(
            "I want to make sure I understand you properly",
            "I'm here to help. Can you share a bit more",
            "Can you tell me a little more about what's going on"
        )
        
        $isGeneric = $false
        foreach ($phrase in $genericPhrases) {
            if ($response.message -like "*$phrase*") {
                $isGeneric = $true
                break
            }
        }
        
        if ($isGeneric) {
            Write-Host "[WARNING] Response appears to be generic/legacy template" -ForegroundColor Yellow
        } else {
            Write-Host "[OK] Response appears to be specific/contextual" -ForegroundColor Green
        }
        
        # Check response length
        if ($response.message.Length -lt 100) {
            Write-Host "[WARNING] Response is quite short (< 100 chars)" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host $_.Exception
    }
    
    Start-Sleep -Seconds 2
}

Write-Host "`n========================================"
Write-Host " TEST COMPLETE"
Write-Host "========================================"
Write-Host ""
Write-Host "Expected results:"
Write-Host "  - ENGINE should be 'blocks' (not 'legacy_templates')"
Write-Host "  - Responses should be multi-sentence and emotionally specific"
Write-Host "  - No repeated generic phrases across multiple tests"
Write-Host "  - Each response should feel tailored to the specific situation"
