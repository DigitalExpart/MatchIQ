# How Amora's Response Structure Works

## Overview

Amora is a **rule-based, template-driven** AI coach (NOT an LLM). She uses keyword pattern matching to select pre-written, thoughtful responses.

## Response Flow

```
User Question: "I want you to advice me"
    ↓
Frontend sends to: POST /api/v1/coach/
    ↓
Backend receives: CoachRequest {
    mode: "LEARN",
    specific_question: "I want you to advice me",
    context: {...}
}
    ↓
CoachService.get_response() routes to _learn_mode()
    ↓
_learn_mode() calls _answer_question()
    ↓
_answer_question() does:
    1. Normalize question (lowercase, remove punctuation, handle contractions)
    2. Check patterns in priority order:
       - Love + Confusion patterns (highest priority)
       - Love patterns
       - Confusion patterns
       - Readiness patterns
       - Marriage patterns
       - Dating decision patterns
       - Choice between partners
       - Communication
       - Trust
       - Conflict
       - Emotional
       - Boundaries
       - Red flags
       - Compatibility
    3. If pattern matches → Return specific template
    4. If NO pattern matches → Return generic fallback
    ↓
Return CoachResponse {
    message: "...",
    mode: "LEARN",
    confidence: 0.8,
    referenced_data: {...}
}
```

## Why "I want you to advice me" Gets Generic Response

**The question doesn't match any patterns because:**
- ❌ No "love" keywords
- ❌ No "confusion" keywords  
- ❌ No "ready" keywords
- ❌ No "marry" keywords
- ❌ No "communication" keywords
- ❌ No specific relationship topic keywords

**Result:** Falls through to generic fallback

## Pattern Matching Priority

Patterns are checked in this order (first match wins):

1. **Love + Confusion** (highest priority)
   - Keywords: `"in love"` + `"confused"` or `"dont know"`
   - Example: "Im confused I dont know if im in love"

2. **Love** (alone)
   - Keywords: `"in love"`, `"love them"`, `"falling in love"`
   - Example: "Am I in love?"

3. **Confusion** (alone)
   - Keywords: `"confused"`, `"dont know"`, `"unsure"`
   - Example: "I'm confused about my feelings"

4. **Readiness**
   - Keywords: `"ready for"`, `"ready to commit"`, `"should i commit"`
   - Example: "Am I ready for a committed relationship?"

5. **Marriage**
   - Keywords: `"should i marry"`, `"marry my"`, `"get married"`
   - Example: "Should I marry my girlfriend?"

6. **Dating Decisions**
   - Keywords: `"date or marry"`, `"date or commit"`, `"take next step"`
   - Example: "date or marry my girlfriend"

7. **Choice Between Partners**
   - Keywords: `"which one"`, `"choose between"`, `"two ladies"`, `"have 2"`
   - Example: "I have 2 ladies and dont know which one to go for"

8. **Communication**
   - Keywords: `"communication"`, `"communicate"`, `"talk"`
   - Example: "How can I improve communication?"

9. **Trust**
   - Keywords: `"trust"`, `"honesty"`, `"lie"`
   - Example: "How do I build trust?"

10. **Conflict**
    - Keywords: `"conflict"`, `"argument"`, `"fight"`
    - Example: "How do we handle conflict?"

11. **Emotional**
    - Keywords: `"emotional"`, `"feeling"`, `"vulnerability"`
    - Example: "How do I express my emotions?"

12. **Boundaries**
    - Keywords: `"boundary"`, `"boundaries"`, `"limit"`
    - Example: "How do I set boundaries?"

13. **Red Flags**
    - Keywords: `"red flag"`, `"warning sign"`, `"safety"`
    - Example: "What are red flags?"

14. **Compatibility**
    - Keywords: `"compatibility"`, `"score"`, `"match"`
    - Example: "What does compatibility mean?"

15. **Generic Fallback** (if nothing matches)
    - Returns: "I'm here to help you explore relationship topics..."

## Normalization Process

Before pattern matching, questions are normalized:

1. **Lowercase**: "I Want Advice" → "i want advice"
2. **Handle apostrophes**: "don't" → "dont", "I'm" → "im"
3. **Remove punctuation**: "What's up?" → "whats up"
4. **Collapse spaces**: "multiple   spaces" → "multiple spaces"

**Example:**
- Original: "I'm confused—don't know if I'm in love."
- Normalized: "im confused dont know if im in love"
- Matches: ✅ Love + Confusion pattern

## Current Patterns in Code

See `backend/app/services/coach_service.py` → `_answer_question()` method (lines ~210-280)

## How to Add New Patterns

1. **Add pattern check** in `_answer_question()` method
2. **Add keywords/phrases** to match
3. **Add template response** (ethical, non-directive)
4. **Test with normalization** to ensure it works

**Example:**
```python
# Advice/guidance questions
advice_phrases = ["give me advice", "i want advice", "need advice", "advise me"]
if any(phrase in question_lower for phrase in advice_phrases):
    logger.info("Matched ADVICE pattern")
    return "I'm here to help you explore relationship topics thoughtfully. It might help to consider: What specific area are you curious about? Are there particular concerns or questions you'd like to explore? Sometimes focusing on one aspect at a time—like communication, trust, boundaries, or understanding your feelings—can bring clarity."
```

## Why Generic Fallback Exists

The generic fallback is **intentional** for questions that:
- Don't match any specific patterns
- Are too vague to provide specific guidance
- Need clarification from the user

**Generic fallback message:**
> "I'm here to help you explore relationship topics. I might be able to provide insights on communication, trust, compatibility, boundaries, or any relationship questions you're curious about. What specific area interests you?"

This encourages users to ask more specific questions.

## Improving Pattern Matching

To reduce generic fallbacks:

1. **Add more patterns** for common questions
2. **Improve keyword matching** (synonyms, variations)
3. **Add context awareness** (use `request.context` to personalize)
4. **Handle vague questions** with follow-up prompts

## Testing Patterns

Use the test file: `backend/tests/test_coach_patterns.py`

Run tests:
```bash
cd backend
python -m pytest tests/test_coach_patterns.py -v
```
