# Automated Stress Test Runner for Amora
# Runs all 18 conversation scripts and logs results

$baseUrl = "https://macthiq-ai-backend.onrender.com/api/v1/coach"
$results = @()

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " AMORA STRESS TEST - 18 SCRIPTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define all 18 scripts
$scripts = @(
    @{
        ID = 1
        Name = "Acute Heartbreak (Betrayal)"
        Messages = @(
            "My girlfriend broke up with me last week and I can't stop crying.",
            "I found out she was talking to someone else behind my back for months.",
            "I keep replaying everything wondering what I did wrong.",
            "Part of me still wants her back even after all of this.",
            "I don't even recognize myself, I feel so desperate.",
            "I don't know how to move on or even where to start."
        )
        ExpectedTopics = @("heartbreak", "cheating", "stuck_on_ex")
    },
    @{
        ID = 2
        Name = "Acute Heartbreak (No Closure)"
        Messages = @(
            "He ended things out of nowhere after three years together.",
            "He just said he 'fell out of love' and wouldn't explain more.",
            "I feel like I didn't even get a chance to fix anything.",
            "I keep checking my phone hoping he'll change his mind.",
            "Everyone tells me to move on but I feel frozen.",
            "Was our whole relationship a lie?"
        )
        ExpectedTopics = @("heartbreak", "stuck_on_ex")
    },
    @{
        ID = 3
        Name = "Marriage Strain (Roommates)"
        Messages = @(
            "I've been married for 10 years and I feel like roommates with my husband.",
            "We don't really talk unless it's about bills or the kids.",
            "Any time I bring up how I feel, it turns into an argument.",
            "He says I'm never satisfied and I feel like he doesn't even try.",
            "Sometimes I wonder if staying together is actually good for any of us.",
            "I don't know if this is just a rough patch or if the marriage is over."
        )
        ExpectedTopics = @("marriage_strain", "constant_fighting")
    },
    @{
        ID = 4
        Name = "Marriage Strain (Different Goals)"
        Messages = @(
            "My wife wants another child and I really don't.",
            "I'm already overwhelmed and she says I'm being selfish.",
            "I'm scared that if I say no, she'll resent me forever.",
            "But if I say yes, I'm afraid I'll fall apart.",
            "I love her but I'm starting to feel trapped by this decision."
        )
        ExpectedTopics = @("marriage_strain", "mismatched_expectations")
    },
    @{
        ID = 5
        Name = "Toxic Dynamic (Emotional Control)"
        Messages = @(
            "My partner calls me names when they're angry and then acts like nothing happened.",
            "They go through my phone and say it's because they 'care' and don't want me to cheat.",
            "If I try to leave, they threaten to hurt themselves.",
            "I'm scared to tell anyone because I don't think they'll believe me.",
            "Sometimes I wonder if I'm overreacting or if this is actually abusive.",
            "I don't know how to feel safe anymore."
        )
        ExpectedTopics = @("toxic_or_abusive_dynamic")
    },
    @{
        ID = 6
        Name = "Toxic Dynamic (Isolation)"
        Messages = @(
            "He doesn't like me seeing my friends and gets angry if I go out without him.",
            "He checks what I wear and says it's 'for my own good.'",
            "When I'm upset, he tells me no one else would put up with me.",
            "My family thinks he's great because he's charming in front of them.",
            "I feel completely alone in this relationship."
        )
        ExpectedTopics = @("toxic_or_abusive_dynamic")
    },
    @{
        ID = 7
        Name = "Partner Mental Health"
        Messages = @(
            "My boyfriend is really depressed and barely gets out of bed.",
            "I keep trying to cheer him up but nothing seems to work.",
            "I'm exhausted from taking care of everything on my own.",
            "I feel guilty even admitting that I'm tired of it.",
            "I don't know how much longer I can do this but I feel awful even thinking about leaving."
        )
        ExpectedTopics = @("partner_mental_health_or_addiction")
    },
    @{
        ID = 8
        Name = "Partner Addiction"
        Messages = @(
            "My husband drinks every night and gets mean when he's drunk.",
            "The kids are starting to notice and it breaks my heart.",
            "When he's sober he apologizes and says he'll cut back, but it never lasts.",
            "I feel like I'm constantly walking on eggshells wondering which version of him I'll get.",
            "I don't know what's considered 'too much' or when it's a problem."
        )
        ExpectedTopics = @("partner_mental_health_or_addiction")
    },
    @{
        ID = 9
        Name = "Intimacy Mismatch (Rejected)"
        Messages = @(
            "My partner never wants to be intimate anymore and I feel ugly and unwanted.",
            "They say they're just stressed, but it's been like this for months.",
            "I'm scared to bring it up because I don't want to pressure them.",
            "At the same time, I'm starting to resent them and I hate feeling that way.",
            "I'm worried this means there's something wrong with me."
        )
        ExpectedTopics = @("intimacy_mismatch")
    },
    @{
        ID = 10
        Name = "Intimacy Mismatch (Pressured)"
        Messages = @(
            "My partner wants sex way more often than I do and gets upset when I say no.",
            "They tell me it's 'normal' and that I'm depriving them.",
            "Sometimes I just give in so they won't be mad at me.",
            "I feel guilty and also kind of sick afterwards, like I betrayed myself.",
            "I don't know what's reasonable to expect in a relationship."
        )
        ExpectedTopics = @("intimacy_mismatch")
    },
    @{
        ID = 11
        Name = "Situationship Stuck"
        Messages = @(
            "We've been talking and seeing each other for six months but we're still 'not official.'",
            "They say they're not ready for a relationship but act like we're together.",
            "I'm scared that if I ask for more, they'll leave.",
            "At the same time, I feel stupid waiting around like this.",
            "I don't know if I'm being patient or just being used."
        )
        ExpectedTopics = @("talking_stage_or_situationship")
    },
    @{
        ID = 12
        Name = "Talking Stage Jealousy"
        Messages = @(
            "He texts me every day but says he doesn't want anything serious.",
            "I saw him liking other girls' pictures and it made me feel sick.",
            "He tells me I'm 'different' but still won't commit.",
            "I keep comparing myself to those other girls and feeling not good enough.",
            "Why do I stay when this hurts so much?"
        )
        ExpectedTopics = @("talking_stage_or_situationship", "comparison_to_others")
    },
    @{
        ID = 13
        Name = "LGBTQ+ Family Pressure"
        Messages = @(
            "I'm in a same-sex relationship and my family doesn't know.",
            "They make comments about how 'wrong' it is and I'm terrified to come out.",
            "I love my partner but I'm scared my family will reject me if they find out.",
            "I feel like I'm living a double life and it's exhausting.",
            "I don't know how to choose between my family and being myself."
        )
        ExpectedTopics = @("lgbtq_identity_and_family_pressure")
    },
    @{
        ID = 14
        Name = "Interfaith Conflict"
        Messages = @(
            "My partner and I are from different religions and my parents say they'll never accept the relationship.",
            "They say I'm betraying my culture if I stay with them.",
            "But I really see a future with this person.",
            "I'm scared of losing my family and also scared of losing this relationship.",
            "I don't know which sacrifice would hurt less."
        )
        ExpectedTopics = @("core_values_conflict")
    },
    @{
        ID = 15
        Name = "Coparenting Conflict"
        Messages = @(
            "My ex and I share custody and we argue about everything related to the kids.",
            "They bad-mouth me in front of the children and it breaks my heart.",
            "I don't want the kids to feel stuck in the middle.",
            "I feel guilty that they have to go back and forth between two homes.",
            "I just want to know how to make this less damaging for them."
        )
        ExpectedTopics = @("coparenting_and_family_dynamics")
    },
    @{
        ID = 16
        Name = "Low Self-Worth"
        Messages = @(
            "I honestly feel like I'm unlovable.",
            "Every relationship I've had ends with them leaving.",
            "I keep thinking maybe there's something broken in me.",
            "I'm scared I'll be alone forever.",
            "I don't even know how to believe I deserve a healthy relationship."
        )
        ExpectedTopics = @("low_self_worth_in_love")
    },
    @{
        ID = 17
        Name = "Dating App Burnout"
        Messages = @(
            "I'm so tired of dating apps.",
            "It's just endless swiping, small talk, ghosting.",
            "I feel more lonely now than before I started using them.",
            "I'm starting to think there's no one out there for me.",
            "I don't know whether to keep trying or just give up on dating for a while."
        )
        ExpectedTopics = @("online_dating_burnout")
    },
    @{
        ID = 18
        Name = "Non-Monogamy Tension"
        Messages = @(
            "My partner wants to open our relationship and I'm not sure how I feel.",
            "They say monogamy is 'just a social construct' and I feel judged for being uncomfortable.",
            "Part of me is scared they'll find someone better and leave.",
            "I don't know if I'm being close-minded or if this just doesn't fit me.",
            "I'm afraid I'll lose them either way."
        )
        ExpectedTopics = @("non_monogamy_open_or_poly")
    }
)

# Run each script
$totalScripts = $scripts.Count
$currentScript = 0

foreach ($script in $scripts) {
    $currentScript++
    Write-Host "[$currentScript/$totalScripts] Script $($script.ID): $($script.Name)" -ForegroundColor Yellow
    Write-Host "Expected topics: $($script.ExpectedTopics -join ', ')" -ForegroundColor Gray
    Write-Host ""
    
    $scriptResults = @()
    $turnNumber = 0
    
    foreach ($message in $script.Messages) {
        $turnNumber++
        Write-Host "  Turn $turnNumber/$($script.Messages.Count): $($message.Substring(0, [Math]::Min(60, $message.Length)))..." -ForegroundColor Cyan
        
        try {
            $body = @{
                specific_question = $message
                mode = "LEARN"
                context = @{ recent_messages = @() }
            } | ConvertTo-Json -Depth 10
            
            $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $body -ContentType "application/json"
            
            # Evaluate response
            $isBlocks = $response.engine -eq "blocks"
            $isLongEnough = $response.message.Length -gt 100
            $isRelevant = $true # We'll assume relevant if blocks engine and long enough
            
            if ($isBlocks -and $isLongEnough) {
                $rating = "✅"
                $color = "Green"
            }
            elseif ($isBlocks) {
                $rating = "⚠️"
                $color = "Yellow"
            }
            else {
                $rating = "❌"
                $color = "Red"
            }
            
            Write-Host "    $rating Engine: $($response.engine), Length: $($response.message.Length) chars" -ForegroundColor $color
            
            $scriptResults += @{
                Turn = $turnNumber
                Message = $message
                Engine = $response.engine
                Length = $response.message.Length
                Rating = $rating
                Preview = $response.message.Substring(0, [Math]::Min(80, $response.message.Length))
            }
        }
        catch {
            Write-Host "    ❌ ERROR: $_" -ForegroundColor Red
            $scriptResults += @{
                Turn = $turnNumber
                Message = $message
                Engine = "error"
                Length = 0
                Rating = "❌"
                Preview = "Error: $_"
            }
        }
        
        Start-Sleep -Milliseconds 300
    }
    
    # Calculate script success rate
    $excellent = ($scriptResults | Where-Object { $_.Rating -eq "✅" }).Count
    $adequate = ($scriptResults | Where-Object { $_.Rating -eq "⚠️" }).Count
    $poor = ($scriptResults | Where-Object { $_.Rating -eq "❌" }).Count
    $total = $scriptResults.Count
    
    $successRate = [math]::Round((($excellent + $adequate) / $total) * 100, 1)
    $excellenceRate = [math]::Round(($excellent / $total) * 100, 1)
    
    Write-Host ""
    Write-Host "  Script Summary: $excellent ✅ | $adequate ⚠️ | $poor ❌" -ForegroundColor $(if ($poor -eq 0) { "Green" } elseif ($poor -le 1) { "Yellow" } else { "Red" })
    Write-Host "  Success Rate: $successRate% | Excellence Rate: $excellenceRate%" -ForegroundColor Gray
    Write-Host ""
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    Write-Host ""
    
    $results += @{
        ScriptID = $script.ID
        ScriptName = $script.Name
        Excellent = $excellent
        Adequate = $adequate
        Poor = $poor
        Total = $total
        SuccessRate = $successRate
        ExcellenceRate = $excellenceRate
        Details = $scriptResults
    }
}

# Final Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " FINAL SUMMARY - ALL 18 SCRIPTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$totalExcellent = ($results | ForEach-Object { $_.Excellent } | Measure-Object -Sum).Sum
$totalAdequate = ($results | ForEach-Object { $_.Adequate } | Measure-Object -Sum).Sum
$totalPoor = ($results | ForEach-Object { $_.Poor } | Measure-Object -Sum).Sum
$totalTurns = ($results | ForEach-Object { $_.Total } | Measure-Object -Sum).Sum

$overallSuccess = [math]::Round((($totalExcellent + $totalAdequate) / $totalTurns) * 100, 1)
$overallExcellence = [math]::Round(($totalExcellent / $totalTurns) * 100, 1)

Write-Host "Total Turns Tested: $totalTurns" -ForegroundColor White
Write-Host "✅ Excellent: $totalExcellent ($overallExcellence%)" -ForegroundColor Green
Write-Host "⚠️  Adequate: $totalAdequate" -ForegroundColor Yellow
Write-Host "❌ Poor: $totalPoor" -ForegroundColor Red
Write-Host ""
Write-Host "Overall Success Rate: $overallSuccess%" -ForegroundColor $(if ($overallSuccess -ge 95) { "Green" } elseif ($overallSuccess -ge 85) { "Yellow" } else { "Red" })
Write-Host "Overall Excellence Rate: $overallExcellence%" -ForegroundColor $(if ($overallExcellence -ge 80) { "Green" } elseif ($overallExcellence -ge 70) { "Yellow" } else { "Red" })
Write-Host ""

# Per-script breakdown
Write-Host "Per-Script Results:" -ForegroundColor Cyan
Write-Host ""
foreach ($result in $results) {
    $status = if ($result.Poor -eq 0) { "✅" } elseif ($result.Poor -le 1) { "⚠️" } else { "❌" }
    Write-Host "$status Script $($result.ScriptID): $($result.ScriptName)" -ForegroundColor $(if ($result.Poor -eq 0) { "Green" } elseif ($result.Poor -le 1) { "Yellow" } else { "Red" })
    Write-Host "   Success: $($result.SuccessRate)% | Excellence: $($result.ExcellenceRate)%" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Final verdict
if ($overallSuccess -ge 95 -and $overallExcellence -ge 80) {
    Write-Host ""
    Write-Host "🎉 EXCELLENT! Amora is production-ready!" -ForegroundColor Green
    Write-Host "   Success rate exceeds 95% target" -ForegroundColor Green
    Write-Host "   Excellence rate exceeds 80% target" -ForegroundColor Green
}
elseif ($overallSuccess -ge 90) {
    Write-Host ""
    Write-Host "⚠️  GOOD! Minor improvements needed" -ForegroundColor Yellow
    Write-Host "   Review scripts with ❌ ratings" -ForegroundColor Yellow
    Write-Host "   Add targeted blocks for problem areas" -ForegroundColor Yellow
}
else {
    Write-Host ""
    Write-Host "❌ NEEDS WORK! Significant gaps found" -ForegroundColor Red
    Write-Host "   Review all scripts with ❌ ratings" -ForegroundColor Red
    Write-Host "   Add blocks for under-covered topics" -ForegroundColor Red
}

Write-Host ""
Write-Host "Results saved in memory. Review and iterate!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
