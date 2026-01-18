# Crisis & Distress Handling Documentation

## Overview

Amora now includes explicit handling for:
1. **User-side anxiety and depression distress** (feeling states, not clinical diagnoses)
2. **Crisis/self-harm/suicidal ideation** detection with safe, directive responses

This ensures Amora can appropriately support users experiencing these states while maintaining safety boundaries.

---

## 1. User-Side Anxiety & Depression Topics

### 1.1. Topics Added

- **`user_anxiety_distress`**: Persistent worry, panic, tension connected to relationships/dating/marriage
- **`user_depression_distress`**: Persistent low mood, hopelessness, heaviness connected to relationships/breakups/marriage

**Important**: These are **feeling states**, not clinical diagnoses. Amora never labels users as "having anxiety" or "having depression." Instead, she reflects their emotional experience in relationship context.

### 1.2. Topic Detection

Detection uses keyword matching in `TopicEmotionDetector`:

**Anxiety keywords include:**
- "i have so much anxiety", "constantly anxious", "panic attacks"
- "anxious about my relationship", "anxious he will leave"
- "can never relax", "overthinking everything"
- "on edge all the time", "fear of abandonment"

**Depression keywords include:**
- "i feel so depressed", "depressed all the time"
- "dont want to get out of bed", "cant function"
- "feel empty and numb", "life feels pointless"
- "no motivation", "nothing brings me joy"
- "depressed since the breakup", "relationship depression"

### 1.3. Response Blocks

**For `user_anxiety_distress`:**
- 8 Reflection blocks (stages 1-2)
- 8 Normalization blocks
- 6 Insight/Reframe blocks (stage 2)
- 8 Exploration blocks

**For `user_depression_distress`:**
- 8 Reflection blocks (stages 1-2)
- 8 Normalization blocks
- 6 Insight/Reframe blocks (stage 2)
- 8 Exploration blocks

**Key principles in blocks:**
- No diagnosis language
- No medical advice
- No promises like "this will cure your depression"
- Always tied to relationship context
- Validates feeling states without pathologizing
- Gentle exploration of what's underneath

### 1.4. Example Block Patterns

**Reflection:**
- "It sounds like your anxiety around this relationship is constantly running in the background and leaving you on edge."
- "It sounds like this breakup has taken a lot of color out of your days and left things feeling heavy and empty."

**Normalization:**
- "Many people find that past hurts or unstable relationships make their nervous system stay on high alert in new situations."
- "Feeling low, numb, or unmotivated after big relationship losses is very common, even if it's also really hard to live with."

**Insight:**
- "Anxiety can cling to uncertainty, fear of abandonment, or inconsistent partners because your nervous system learned that unpredictability means danger."
- "Grief loops and rumination can keep you stuck in low mood because your mind keeps returning to what was lost instead of what's possible."

**Exploration:**
- "When does your anxiety spike the most—before messages, after fights, at night, or when things feel uncertain?"
- "What small things still feel even a little grounding or real to you, even if they're small?"

---

## 2. Crisis Detection & Response

### 2.1. Crisis Intent Detection

**Intent Label**: `CRISIS_SELF_HARM`

**Detection Method**: Keyword matching with highest priority (checked BEFORE normal topic detection)

**Keywords Detected:**
- Direct statements: "i want to die", "i want to kill myself", "i want to end my life"
- Self-harm: "want to hurt myself", "going to cut myself"
- Planning: "have a plan to", "figured out how to"
- Additional patterns: "ending it all", "not worth living", "no reason to live", "suicide"

**Priority**: Crisis detection runs **before** any normal coaching logic. If detected, normal pipeline is short-circuited.

### 2.2. Crisis Response Templates

**Number**: 5 variations (all follow same safety rules)

**Structure** (all templates include):
1. **Acknowledge and validate** the pain
2. **State Amora's limits clearly** (not a crisis counselor, can't keep them safe)
3. **Direct toward immediate, real-world help**:
   - Local emergency services (911 in US, 999 in UK)
   - Crisis helplines
   - Trusted person (friend, family, therapist)
4. **Avoid**:
   - Detailed discussion of self-harm methods
   - Advice on how to hurt themselves
   - Arguments about whether they "should" live or die
   - Long explorations or guidance sessions

**Example Template:**
```
I'm really glad you told me this. It sounds like you're in an enormous amount of pain right now.

I want you to know that I'm not able to keep you safe in an emergency or make urgent decisions for you. If you're in immediate danger or have thoughts of hurting yourself, please reach out for help right away:

• Call your local emergency services (911 in the US, 999 in the UK)
• Contact a crisis helpline in your country
• Reach out to a trusted friend, family member, or therapist

You don't have to go through this alone. There are people trained to help during these moments.
```

### 2.3. Integration with `/coach` Endpoint

**Flow:**
1. User message received
2. **Crisis detection runs FIRST** (before topic detection)
3. If crisis detected:
   - Log warning with user_id and session_id
   - Generate crisis response (bypasses block engine)
   - Save crisis message to database with `is_crisis: true` metadata
   - Return response with `is_crisis: true` and `crisis_intent: "CRISIS_SELF_HARM"`
4. If no crisis:
   - Continue with normal topic detection and block selection

**Response Model:**
```python
CoachResponse(
    message="...",
    is_crisis=True,  # Explicit flag
    crisis_intent="CRISIS_SELF_HARM",  # Intent label
    referenced_data={
        'is_crisis': True,
        'intent': 'CRISIS_SELF_HARM',
        'topics': [],  # Empty for crisis
        'emotions': []
    },
    engine='crisis_response'
)
```

### 2.4. Logging & Privacy

**What's Logged:**
- Crisis detection event (user_id, session_id, intent)
- Crisis response sent
- Stored in `amora_session_messages` with `is_crisis: true` in metadata

**Privacy:**
- No new data sharing to third parties
- Internal monitoring only
- For safety audits and potential follow-up
- Message content stored normally (encrypted at database level if configured)

---

## 3. Frontend Integration

### 3.1. Response Flags

When `is_crisis: true` is returned:

```json
{
  "message": "...",
  "is_crisis": true,
  "crisis_intent": "CRISIS_SELF_HARM",
  "referenced_data": {
    "is_crisis": true,
    "intent": "CRISIS_SELF_HARM"
  }
}
```

### 3.2. Frontend Behavior

**Recommended UI/UX:**

1. **Show crisis response normally** (don't hide it)
2. **Display emergency resources prominently**:
   - Crisis hotline numbers
   - Emergency services contact
   - Links to crisis resources
3. **Optional**: Show a banner/disclaimer that Amora is not a crisis counselor
4. **Do NOT**:
   - Lock out further coaching (user may want to continue)
   - Show alarming animations or colors
   - Make assumptions about user's state

**Example Frontend Code:**
```typescript
if (response.is_crisis) {
  // Show crisis response
  // Display emergency resources
  // Optionally show: "Amora is not a crisis counselor. If you're in immediate danger, please contact emergency services."
}
```

---

## 4. Safety Boundaries

### 4.1. What Amora Does

✅ **Validates** feeling states (anxiety, depression-like feelings)
✅ **Reflects** emotional experience in relationship context
✅ **Normalizes** common patterns
✅ **Explores** gently what's underneath
✅ **Detects** crisis language and responds safely
✅ **Directs** to real-world help when needed

### 4.2. What Amora Does NOT Do

❌ **Diagnose** users ("you have anxiety", "you have depression")
❌ **Provide medical advice** or medication recommendations
❌ **Promise cures** ("this will fix your depression")
❌ **Act as crisis counselor** (directs to real help instead)
❌ **Argue** about whether someone should live or die
❌ **Provide detailed self-harm information**

### 4.3. Scope Limitations

Amora is a **relationship coach**, not:
- A therapist
- A crisis counselor
- A medical professional
- A suicide prevention hotline

She stays in her lane: **relationship coaching with appropriate safety boundaries**.

---

## 5. Testing

### 5.1. Test Cases

**Anxiety Detection:**
- "I have so much anxiety about my relationship"
- "I'm constantly anxious he'll leave"
- "I get panic attacks when we fight"

**Depression Detection:**
- "I feel so depressed since the breakup"
- "I don't want to get out of bed anymore"
- "Life feels pointless without them"

**Crisis Detection:**
- "I want to die"
- "I want to kill myself"
- "I don't want to live anymore"
- "Everyone would be better off without me"

### 5.2. Expected Behavior

**Anxiety/Depression:**
- Detected as topics
- Appropriate blocks selected
- Non-directive, relationship-focused responses
- No diagnosis language

**Crisis:**
- Detected immediately (before topic detection)
- Crisis response returned
- `is_crisis: true` flag set
- Normal coaching bypassed for that turn

---

## 6. Migration

**File**: `backend/migrations/007_anxiety_depression_blocks.sql`

**To Apply:**
1. Run in Supabase SQL Editor
2. Blocks will be inserted into `amora_response_blocks` table
3. Embeddings will need to be computed (run embedding script)

**Block Count:**
- ~30 blocks for `user_anxiety_distress`
- ~30 blocks for `user_depression_distress`
- Total: ~60 new blocks

---

## 7. Monitoring

### 7.1. Metrics to Track

- Crisis detections per day/week
- Anxiety/depression topic frequency
- Crisis response effectiveness (if user continues conversation)
- False positives (crisis detected when not intended)

### 7.2. Safety Audits

- Review crisis logs regularly
- Check for patterns in crisis language
- Ensure responses are appropriate
- Update keywords/templates if needed

---

## 8. Future Enhancements

**Potential Additions:**
- Embedding-based crisis detection (semantic similarity)
- Country-specific crisis hotline numbers
- Integration with crisis text lines (if partnerships available)
- More nuanced anxiety/depression block variations
- Follow-up check-ins after crisis responses

**Not Planned:**
- Clinical diagnosis
- Medical advice
- Medication recommendations
- Replacing real-world crisis support

---

## Summary

Amora now:
- ✅ Detects user-side anxiety and depression feelings (as topics)
- ✅ Has 60+ blocks for these topics (relationship-focused, non-diagnostic)
- ✅ Detects crisis/self-harm/suicidal ideation with highest priority
- ✅ Responds safely with directive guidance to real-world help
- ✅ Maintains non-directive coaching style for non-crisis situations
- ✅ Logs crisis events for safety audits
- ✅ Returns `is_crisis` flag for frontend handling

**Amora remains a relationship coach** with appropriate safety boundaries, not a therapist or crisis counselor.
