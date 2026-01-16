# 🎨 Dynamic Response Style System - Implementation Complete

**Date:** January 16, 2026  
**Status:** ✅ Implemented and Ready for Testing

---

## 🎯 **What Was Implemented**

Amora now dynamically adjusts her response length and depth based on:
- **User's message type** (advice request vs. sharing feelings)
- **Conversation turn** (first turn vs. later turns)
- **Topic intensity** (heartbreak vs. general question)
- **Message length** (short clarification vs. detailed sharing)

This makes Amora feel more natural and responsive, like a real coach who knows when to ground, when to deepen, and when to provide guidance.

---

## 📊 **Four Response Styles**

### 1. LIGHT_TOUCH
**When:** Short clarifications, brief follow-ups  
**Structure:** 1 reflection + 1 question  
**Length:** ~150-250 characters  
**Example:**
> "That makes sense. When those memories come up, what do they stir most for you?"

### 2. GROUNDING
**When:** First turn on heavy topics, grounding needed  
**Structure:** 1 reflection + 1 normalization + 1 question  
**Length:** ~300-500 characters  
**Example:**
> "I'm really sorry you're going through this. Breakups can shake a lot at once — not just the relationship, but your sense of routine, identity, and emotional safety. It makes sense if things feel heavy or confusing right now.
>
> Before jumping into anything practical, it can help to slow this moment down a little. When you think about the breakup, what feels most present for you right now?"

### 3. DEEPENING
**When:** Turns 2-4, user sharing feelings/details  
**Structure:** 2 reflections + 2 normalizations + 1 insight + 1 question  
**Length:** ~400-700 characters  
**Example:**
> "That makes a lot of sense. Those memories can be especially painful because they weren't just physical — they were moments where you felt close, chosen, connected. When a relationship ends, it's often the intimacy that echoes the loudest.
>
> It's very human to miss the way you were together — the warmth, the affection, the shared dinners, the feeling of being wanted. Losing that kind of closeness can feel like losing a safe place, not just a person.
>
> When those memories come up for you, what do they stir most — is it longing for the connection, comfort, or the version of yourself you were in those moments?"

### 4. GUIDANCE_SESSION
**When:** Explicit advice requests ("can you give me advice")  
**Structure:** 2 reflections + 2 normalizations + 2 insights + 2 questions  
**Length:** ~600-1000+ characters  
**Example:**
> "I can share some gentle guidance — not instructions — and we can keep it flexible, so you take only what fits you.
>
> When things feel this blurred, it can help to lower the pressure to label it right now. You don't actually have to decide whether it was lust or love yet. Sometimes clarity comes after the emotions settle, not before.
>
> A few things that often help people in this space:
>
> – Let the confusion exist without fixing it. Confusion isn't a failure — it's often a sign that something mattered and hasn't fully settled yet.
> – Notice what hurts most in the quiet moments. Is it the absence of touch and closeness, or the absence of emotional safety and being known?
> – Create small pockets of grounding. Simple routines, familiar music, movement, or being around someone safe can help your nervous system calm.
> – Be kind to the version of you that misses them. Missing intimacy doesn't mean you made a mistake — it just means you're human.
>
> We don't have to rush toward conclusions. If you'd like, we can gently explore this together — for example, what feels hardest at night versus during the day?"

---

## 🧠 **How Style is Chosen (Heuristics)**

### 1. Advice/Guidance Requests → GUIDANCE_SESSION
**Triggers:**
- "can you give me advice"
- "what should i do"
- "how can i deal with"
- "please help me"
- "how do i handle"

**Result:** Long, structured response with gentle guidance points

### 2. First Turn on Heavy Topic → GROUNDING
**Triggers:**
- Turn index for topic = 1
- Topic stage = 1
- Topic is in: heartbreak, cheating, toxic_dynamic, mental_health, LGBTQ+ pressure, etc.

**Result:** 1-2 paragraph grounding response with one main question

### 3. Turns 2-4 with Emotional Sharing → DEEPENING
**Triggers:**
- Turn index 2-4 for current topic
- User message contains: "i feel", "i don't", "i can't", "i miss", "i want"
- Topic stage 1-2

**Result:** 2-3 paragraphs building depth with reflections and normalizations

### 4. Very Short Messages → LIGHT_TOUCH
**Triggers:**
- Message length < 50 characters
- Turn index > 1
- Not an advice/help request

**Result:** Brief reflection + one question to keep flow light

### 5. Later Turns (5+) → Adaptive
**Triggers:**
- Turn index ≥ 5
- If new emotional angle → DEEPENING
- If circling/looping → GROUNDING (shorter)

**Result:** Adapts to prevent overwhelming user with long responses every time

---

## 🔧 **Technical Implementation**

### New Code Components:

#### 1. ResponseStyle Enum
```python
class ResponseStyle(str, Enum):
    LIGHT_TOUCH = "LIGHT_TOUCH"
    GROUNDING = "GROUNDING"
    DEEPENING = "DEEPENING"
    GUIDANCE_SESSION = "GUIDANCE_SESSION"
```

#### 2. Style Block Configuration
```python
STYLE_BLOCK_CONFIG = {
    ResponseStyle.LIGHT_TOUCH: {
        'reflection': 1,
        'normalization': 0,
        'insight': 0,
        'exploration': 1,
        'max_questions': 1
    },
    ResponseStyle.GROUNDING: {
        'reflection': 1,
        'normalization': 1,
        'insight': 0,
        'exploration': 1,
        'max_questions': 1
    },
    # ... etc
}
```

#### 3. choose_response_style() Function
Implements all heuristics to select appropriate style based on:
- User message content and length
- Topics and emotions detected
- Topic stage (1-4)
- Turn index for current topic
- Previous response style

#### 4. Updated ConversationState
Added tracking for:
- `topic_turn_counts`: Dict[str, int] - turns per topic
- `last_response_style`: Optional[ResponseStyle]
- `current_dominant_topic`: Optional[str]

#### 5. Updated get_response() Method
Now:
- Tracks turn counts per topic
- Calls `choose_response_style()` dynamically
- Selects blocks based on style configuration
- Saves style to state for next turn
- Includes `response_style` in API response

---

## 📊 **Block Selection by Style**

| Style | Reflection | Normalization | Insight | Exploration | Questions |
|-------|------------|---------------|---------|-------------|-----------|
| LIGHT_TOUCH | 1 | 0 | 0 | 1 | 1 |
| GROUNDING | 1 | 1 | 0 | 1 | 1 |
| DEEPENING | 2 | 2 | 1 | 1 | 2 |
| GUIDANCE_SESSION | 2 | 2 | 2 | 2 | 2 |

**Note:** "Insight" blocks currently use "reframe" blocks as a placeholder. Future enhancement: create dedicated "insight" block type for structured guidance.

---

## 🧪 **Testing the Implementation**

### Test Conversation 1: Heartbreak with Advice Request

**Turn 1:**
```
User: "How can i deal with my break up"
Expected Style: GROUNDING (first turn, heavy topic)
Expected Length: 300-500 chars
Expected Structure: Reflection + Normalization + 1 question
```

**Turn 2:**
```
User: "the way we had romantic moments dinner"
Expected Style: DEEPENING (turn 2, emotional sharing)
Expected Length: 400-700 chars
Expected Structure: 2 reflections + 2 normalizations + 1 question
```

**Turn 3:**
```
User: "i dont no im confused if it lust or love"
Expected Style: DEEPENING (turn 3, emotional confusion)
Expected Length: 400-700 chars
Expected Structure: Multiple paragraphs exploring the confusion
```

**Turn 4:**
```
User: "i cant say can you give me advice"
Expected Style: GUIDANCE_SESSION (explicit advice request)
Expected Length: 600-1000+ chars
Expected Structure: Multiple paragraphs + bullet points + questions
```

### Test Conversation 2: Short Clarifications

**Turn 1:**
```
User: "My boyfriend and I fight all the time"
Expected Style: GROUNDING
```

**Turn 2:**
```
User: "yeah"
Expected Style: LIGHT_TOUCH (very short)
Expected Length: 150-250 chars
```

---

## 📈 **Expected Improvements**

### Before Dynamic Styles:
- ❌ All responses were similar length
- ❌ Felt repetitive and robotic
- ❌ Didn't adapt to user's needs
- ❌ Too long for simple clarifications
- ❌ Too short for advice requests

### After Dynamic Styles:
- ✅ Responses adapt to conversation flow
- ✅ Feels more natural and human
- ✅ Appropriate depth for each turn
- ✅ Light touch for quick exchanges
- ✅ Deep guidance when explicitly requested
- ✅ Mirrors real coaching patterns

---

## 🔍 **How to Verify It's Working**

### Check API Response:
```json
{
  "message": "...",
  "mode": "LEARN",
  "confidence": 0.85,
  "referenced_data": {
    "topics": ["heartbreak", "stuck_on_ex"],
    "emotions": ["sad", "longing"],
    "stage": 1,
    "turn_count": 1,
    "response_style": "GROUNDING",  // ← NEW FIELD
    "engine": "blocks"
  }
}
```

### Check Logs:
```
2026-01-16 INFO: Style: GROUNDING (first turn on heavy topic: ['heartbreak'])
2026-01-16 INFO: Response style: GROUNDING, config: {'reflection': 1, 'normalization': 1, ...}
```

### Check Response Length:
- LIGHT_TOUCH: ~150-250 chars
- GROUNDING: ~300-500 chars
- DEEPENING: ~400-700 chars
- GUIDANCE_SESSION: ~600-1000+ chars

---

## 🚨 **Important Notes**

### 1. Still Non-Directive
All styles maintain Amora's non-directive approach:
- No "you should" or "you must"
- Everything phrased as options or reflections
- "Some people find..." not "You need to..."

### 2. Safety Maintained
For sensitive topics (abuse, mental health):
- Names safety concerns
- Encourages real-world support
- Doesn't minimize harmful behavior
- All styles respect these boundaries

### 3. Anti-Repetition Still Active
- Tracks recent block IDs across all styles
- Won't repeat same blocks within 15 turns
- Ensures variety even with dynamic styles

### 4. Progressive Depth Maintained
- Topics still advance through stages 1-4
- Style adapts to stage
- Deeper stages get more complex responses

---

## 🔮 **Future Enhancements**

### Short-Term:
1. **Add dedicated "insight" block type**
   - Currently using "reframe" as placeholder
   - Create specific blocks for gentle guidance
   - Format with bullet points where appropriate

2. **Fine-tune heuristics**
   - Adjust based on real user conversations
   - Add more trigger phrases
   - Refine length thresholds

3. **Add style override**
   - Allow manual style selection for testing
   - Useful for debugging specific styles

### Medium-Term:
1. **Learn from user feedback**
   - Track which styles get best engagement
   - Adjust heuristics based on data
   - A/B test different configurations

2. **Add more styles**
   - CRISIS_SUPPORT (for urgent situations)
   - CELEBRATION (for positive updates)
   - CLOSURE (for ending conversations)

3. **Context-aware transitions**
   - Smooth transitions between styles
   - "We've been exploring X, let me offer some thoughts..."

---

## ✅ **Deployment Checklist**

- [x] ResponseStyle enum created
- [x] Style configuration defined
- [x] choose_response_style() implemented
- [x] ConversationState updated
- [x] get_response() method updated
- [x] Logging added for debugging
- [x] API response includes style
- [x] No linter errors
- [ ] Test with sample conversations
- [ ] Verify style transitions
- [ ] Check response lengths
- [ ] Deploy to production
- [ ] Monitor user feedback

---

## 🎉 **Bottom Line**

Amora now has a sophisticated dynamic response system that makes her feel more like a real coach who knows when to:
- **Ground** someone in crisis
- **Deepen** exploration of feelings
- **Lighten** the touch for quick exchanges
- **Guide** when explicitly asked for help

**This is a major step toward truly conversational AI coaching!** 🚀

---

**Implementation Complete:** January 16, 2026  
**Ready for Testing:** Yes  
**Production Ready:** After testing and validation
