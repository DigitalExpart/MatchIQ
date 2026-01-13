# Test Amora Pattern Matching

## ✅ Questions That SHOULD Match Patterns

Test these to verify pattern matching is working:

### 1. Readiness Questions (Should match "READINESS" pattern)
- "Am I ready for a committed relationship?"
- "Am I ready to commit?"
- "Should I commit to this relationship?"
- "Am I prepared for a relationship?"

**Expected Response:** "Readiness for a committed relationship often involves feeling secure in yourself..."

### 2. Love Questions (Should match "LOVE" pattern)
- "Am I in love?"
- "How do I know if I love them?"
- "I think I'm falling in love"
- "Do I love him?"

**Expected Response:** "Understanding your feelings about someone can be complex. Love might feel different..."

### 3. Love + Confusion (Should match "LOVE + CONFUSION" pattern)
- "Im confused I dont know if im in love"
- "I'm confused—don't know if I'm in love"
- "I dont know if I love them"
- "Am I in love? I'm not sure"

**Expected Response:** "It sounds like you're feeling confused about your feelings, which is completely understandable..."

### 4. Communication Questions (Should match "COMMUNICATION" pattern)
- "How can I improve communication?"
- "How do I communicate better?"
- "We need to talk more"
- "How to express my feelings?"

**Expected Response:** "Effective communication might include active listening, expressing feelings clearly..."

### 5. Confusion Questions (Should match "CONFUSION" pattern)
- "I'm confused about our relationship"
- "I dont know what to do"
- "I'm not sure about this"
- "I'm unsure about us"

**Expected Response:** "Feeling uncertain or confused in a relationship is common..."

## ❌ Questions That WON'T Match (Will get generic fallback)

These are valid questions but don't match any patterns:

- "I dont have a love partner how will i do it" ❌ (No pattern for single people asking about communication)
- "How does my past affect my present relationships?" ❌ (No pattern for past relationships)
- "What are red flags?" ❌ (No pattern for red flags)
- "How do I know if we're compatible?" ❌ (No pattern for compatibility)

**Expected Response:** Generic fallback: "I'm here to help you explore relationship topics..."

## How to Test

1. **In Browser:**
   - Open DevTools → Console
   - Ask each question
   - Check for `✅ Amora API Success:` log
   - Verify the response matches expected pattern

2. **Check Render Logs:**
   - Go to Render dashboard → Logs
   - Look for:
     - `INFO: Matched READINESS pattern`
     - `INFO: Matched LOVE pattern`
     - `INFO: Matched COMMUNICATION pattern`
     - `INFO: Matched CONFUSION pattern`

3. **Test Backend Directly:**
   ```powershell
   $body = @{
     mode = "LEARN"
     specific_question = "Am I ready for a committed relationship?"
   } | ConvertTo-Json
   
   Invoke-RestMethod -Uri "https://macthiq-ai-backend.onrender.com/api/v1/coach/" -Method POST -ContentType "application/json" -Body $body
   ```

## Current Status

✅ **Working:**
- API calls successful (status 200)
- Pattern matching for communication questions
- Normalization working
- Error handling working

❓ **To Verify:**
- Readiness pattern matching
- Love pattern matching
- Confusion pattern matching
- Latest code deployed to Render

## Next Steps

1. Test "Am I ready for a committed relationship?" - should match READINESS
2. Test "Im confused I dont know if im in love" - should match LOVE + CONFUSION
3. Check Render logs for "Matched" messages
4. If patterns don't match, verify latest code is deployed
