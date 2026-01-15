# Test Amora Blocks Deployment
# Run after Render finishes deploying

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " TESTING AMORA BLOCKS DEPLOYMENT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$API_URL = "https://macthiq-ai-backend.onrender.com/api/v1/coach"

# Test 1: Health Check
Write-Host "[1/3] Checking health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$API_URL/health" -Method Get
    Write-Host "Status: $($health.status)" -ForegroundColor Green
    Write-Host "Service: $($health.service)" -ForegroundColor Green
    Write-Host "Blocks Loaded: $($health.blocks_loaded)" -ForegroundColor Green
    
    if ($health.blocks_loaded -eq 0) {
        Write-Host "`n WARNING: NO BLOCKS LOADED!" -ForegroundColor Red
        Write-Host "Run: python backend/scripts/compute_block_embeddings.py`n" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host "`n----------------------------------------`n" -ForegroundColor Cyan

# Test 2: Test with cheating scenario
Write-Host "[2/3] Testing with emotional scenario..." -ForegroundColor Yellow

$body = @{
    mode = "LEARN"
    specific_question = "My girlfriend cheated on me with my best friend and I don't know what to do"
    session_id = "test_$(Get-Date -Format 'yyyyMMddHHmmss')"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $API_URL -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "Engine: $($response.engine)" -ForegroundColor $(if ($response.engine -eq 'blocks') { 'Green' } else { 'Red' })
    Write-Host "Confidence: $($response.confidence)" -ForegroundColor Green
    Write-Host "Message Length: $($response.message.Length) chars" -ForegroundColor Green
    Write-Host "`nResponse:" -ForegroundColor Cyan
    Write-Host $response.message -ForegroundColor White
    
    if ($response.engine -ne "blocks") {
        Write-Host "`n WARNING: Not using blocks engine!" -ForegroundColor Red
        Write-Host "Expected: blocks, Got: $($response.engine)" -ForegroundColor Yellow
    }
    
    if ($response.message.Length -lt 100) {
        Write-Host "`n WARNING: Response is too short!" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}

Write-Host "`n----------------------------------------`n" -ForegroundColor Cyan

# Test 3: Test anti-repetition
Write-Host "[3/3] Testing anti-repetition..." -ForegroundColor Yellow

$session_id = "test_$(Get-Date -Format 'yyyyMMddHHmmss')"
$questions = @(
    "I'm heartbroken",
    "I feel so sad about this",
    "Everything reminds me of them"
)

$responses = @()
foreach ($q in $questions) {
    $body = @{
        mode = "LEARN"
        specific_question = $q
        session_id = $session_id
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $API_URL -Method Post -Body $body -ContentType "application/json"
        $responses += $response.message
        Start-Sleep -Seconds 1
    } catch {
        Write-Host "ERROR: $_" -ForegroundColor Red
    }
}

Write-Host "Received $($responses.Count) responses" -ForegroundColor Green

# Check for repetition
$unique = $responses | Select-Object -Unique
if ($unique.Count -eq $responses.Count) {
    Write-Host " All responses are unique!" -ForegroundColor Green
} else {
    Write-Host " WARNING: Some responses repeated!" -ForegroundColor Yellow
    Write-Host "Unique: $($unique.Count) / Total: $($responses.Count)" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " DEPLOYMENT TEST COMPLETE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. If blocks_loaded = 0, run embedding script" -ForegroundColor White
Write-Host "2. If engine != 'blocks', check Render logs" -ForegroundColor White
Write-Host "3. Test in your actual app" -ForegroundColor White
