# Amora AI Coach - How It Works & What Questions She Understands

## Overview

**Amora** (formerly "Ella") is a **rule-based, template-driven** AI coach. She does **NOT** use an LLM (Large Language Model) like ChatGPT. Instead, she uses:

1. **Keyword Pattern Matching** - Recognizes specific words and phrases
2. **Template-Based Responses** - Pre-written, thoughtful responses
3. **Mode Routing** - 4 different modes for different types of questions
4. **Response Validation** - Ensures responses follow ethical guidelines

## Architecture

```
User Question
    ↓
Mode Detection (LEARN mode for chat)
    ↓
Keyword Pattern Matching
    ↓
Template Selection
    ↓
Response Generation
    ↓
Validation
    ↓
Return to User
```

## 4 Operating Modes

### 1. **LEARN Mode** (Used in Chat)
**Purpose**: Educational responses about relationships

**Questions it handles**:
- General relationship questions
- Questions about concepts (love, trust, communication, etc.)
- Learning about compatibility, boundaries, safety

**Current Implementation**: Uses keyword matching to select appropriate template

### 2. **EXPLAIN Mode**
**Purpose**: Explain specific scan/assessment results

**Questions it handles**:
- "What does my score mean?"
- "Why did I get this category?"
- "Explain my results"

**Requires**: `scan_result_id` or `scan_id`

### 3. **REFLECT Mode**
**Purpose**: Guide self-reflection with questions

**Questions it handles**:
- "Help me reflect on this"
- "What should I think about?"
- Pattern reflection questions

### 4. **SAFETY Mode**
**Purpose**: Explain red flags and safety concerns

**Questions it handles**:
- "Are there any red flags?"
- "Is this safe?"
- Safety-related questions

## Question Patterns Amora Understands (LEARN Mode)

### ✅ Love & Feelings Questions

**Keywords Detected**:
- `"in love"`, `"love them"`, `"love him"`, `"love her"`, `"falling in love"`
- `"know if i love"`, `"if im in love"`, `"if i'm in love"`

**Example Questions**:
- "Am I in love?"
- "I'm confused I don't know if I'm in love"
- "How do I know if I love them?"
- "Am I falling in love?"

**Response**: Provides guidance on understanding feelings, signs of love, and reflection questions

---

### ✅ Confusion & Uncertainty Questions

**Keywords Detected**:
- `"confused"`, `"don't know"`, `"dont know"`, `"unsure"`, `"not sure"`, `"uncertain"`

**Example Questions**:
- "I'm confused about my feelings"
- "I don't know what to do"
- "I'm unsure about this relationship"
- "I'm not sure if I'm ready"

**Response**: Acknowledges confusion, provides reflection guidance, suggests patterns to explore

---

### ✅ Relationship Readiness Questions

**Keywords Detected**:
- `"ready for"`, `"prepared for"`, `"ready to commit"`, `"should i commit"`

**Example Questions**:
- "Am I ready for a committed relationship?"
- "Am I ready to commit?"
- "Should I commit to this relationship?"

**Response**: Explores readiness factors: self-security, communication skills, emotional availability

---

### ✅ Communication Questions

**Keywords Detected**:
- `"communication"`, `"communicate"`, `"talk"`, `"conversation"`, `"express"`

**Example Questions**:
- "How do I communicate better?"
- "How to talk to my partner?"
- "How do I express my feelings?"

**Response**: Guidance on active listening, "I" statements, validation, safe dialogue

---

### ✅ Trust & Honesty Questions

**Keywords Detected**:
- `"trust"`, `"honesty"`, `"lie"`, `"lying"`

**Example Questions**:
- "How do I build trust?"
- "What if they lied to me?"
- "How do I know if I can trust them?"

**Response**: Explains trust development through consistent actions, transparency, mutual respect

---

### ✅ Conflict Resolution Questions

**Keywords Detected**:
- `"conflict"`, `"argument"`, `"fight"`, `"disagree"`

**Example Questions**:
- "How do I handle arguments?"
- "What do I do when we disagree?"
- "How to resolve conflicts?"

**Response**: Healthy conflict resolution strategies: staying calm, active listening, solution-focused approach

---

### ✅ Emotional Connection Questions

**Keywords Detected**:
- `"emotional"`, `"emotion"`, `"feeling"`, `"vulnerability"`, `"feel"`, `"feelings"`

**Example Questions**:
- "How do I connect emotionally?"
- "What does vulnerability mean?"
- "How do I understand my feelings?"

**Response**: Explains emotional connection, vulnerability, emotional safety, validation

---

### ✅ Boundaries Questions

**Keywords Detected**:
- `"boundary"`, `"boundaries"`, `"limit"`, `"respect"`

**Example Questions**:
- "How do I set boundaries?"
- "What are healthy boundaries?"
- "How do I respect their boundaries?"

**Response**: Guidance on healthy boundaries, communication of needs, respecting limits

---

### ✅ Red Flags & Safety Questions

**Keywords Detected**:
- `"red flag"`, `"warning sign"`, `"safety"`, `"concern"`

**Example Questions**:
- "What are red flags?"
- "How do I know if there are warning signs?"
- "Is this relationship safe?"

**Response**: Explains red flags, trust instincts, patterns that suggest concerns

---

### ✅ Compatibility Questions

**Keywords Detected**:
- `"compatibility"`, `"score"`, `"match"`, `"compatible"`

**Example Questions**:
- "What does my compatibility score mean?"
- "What makes two people compatible?"
- "How important is compatibility?"

**Response**: Explains compatibility scores, alignment with blueprint, factors in relationship success

---

### ✅ Values & Goals Questions

**Keywords Detected**:
- `"value"`, `"goal"`, `"future"`, `"priority"`

**Example Questions**:
- "How important are shared values?"
- "What if our goals don't align?"
- "Should we have the same priorities?"

**Response**: Explains shared values, goals as foundation, discussing priorities openly

---

### ✅ Blueprint/Assessment Questions

**Keywords Detected**:
- `"blueprint"`, `"self-assessment"`, `"assessment"`

**Example Questions**:
- "What is a blueprint?"
- "How does the self-assessment work?"
- "What does my assessment mean?"

**Response**: Explains blueprint concept, how it helps AI understand priorities

---

### ✅ General Relationship Questions

**Keywords Detected**:
- `"relationship"`, `"dating"`, `"partner"`, `"boyfriend"`, `"girlfriend"`, `"person"`, `"someone"`, `"them"`

**Example Questions**:
- "How do I know if a relationship is right for me?"
- "What should I look for in a partner?"
- "How do I know if I'm ready to date?"

**Response**: General relationship guidance, reflection questions, exploration of what matters

---

## Default Fallback

If a question doesn't match any specific pattern, Amora provides:

1. **Acknowledgment** - "I hear you're asking about relationships..."
2. **Keyword Extraction** - Tries to find relationship-related terms
3. **Helpful Guidance** - Offers to explore specific areas
4. **Context Integration** - Uses conversation context if available

---

## How Responses Are Generated

### Step 1: Mode Detection
The frontend sends questions in **LEARN mode** for chat.

### Step 2: Keyword Matching
Amora checks the question (lowercased) for specific keywords/phrases:
```python
question_lower = question.lower()

# Check patterns in priority order
if "in love" in question_lower:
    return love_response
elif "confused" in question_lower:
    return confusion_response
# ... continues through all patterns
```

### Step 3: Template Selection
Each pattern has a pre-written response template that:
- Uses conditional language ("might", "may", "could")
- Avoids directives ("you should", "you must")
- Provides thoughtful guidance
- Encourages self-reflection

### Step 4: Response Validation
Before returning, Amora validates:
- Response has content (min 10 characters)
- No forbidden phrases ("you must", "you should")
- Uses probability language appropriately
- Follows ethical guidelines

---

## Response Principles

### ✅ What Amora Does:
- Uses **conditional language**: "might", "may", "could", "suggests"
- Encourages **self-reflection**: Asks questions to help user think
- Provides **educational content**: Explains concepts
- References **user's data**: When available (blueprint, scan results)

### ❌ What Amora Never Does:
- **Never prescriptive**: No "you should", "you must", "you need to"
- **Never judgmental**: No "this is toxic", "they are bad"
- **Never directive**: No "leave them", "stay", "break up"
- **Never predictive**: No "this will work/fail"
- **Never replaces therapy**: No psychological diagnosis

---

## Adding New Question Patterns

To add support for new questions, edit `backend/app/services/coach_service.py`:

1. Add keyword detection in `_answer_question()`:
```python
# New pattern example
if any(word in question_lower for word in ["new_keyword", "another_keyword"]):
    return "Your thoughtful response here..."
```

2. Follow response principles:
- Use conditional language
- Be non-directive
- Encourage reflection
- Provide helpful guidance

3. Test the pattern:
- Try various phrasings
- Ensure it catches intended questions
- Verify response quality

---

## Current Limitations

1. **Keyword-Based Only**: Doesn't understand context deeply
2. **Pre-Written Responses**: Cannot generate truly novel responses
3. **No Memory**: Doesn't remember previous conversation context beyond what's passed
4. **Pattern Matching**: May miss questions with unusual phrasing

---

## Future Improvements

Potential enhancements:
- Expand keyword patterns
- Add synonym detection
- Improve context understanding
- Add conversation memory
- More nuanced response selection

---

## Examples of Working Questions

✅ **These work well**:
- "Am I in love?"
- "How do I build trust?"
- "What are healthy boundaries?"
- "I'm confused about my feelings"
- "Am I ready for a relationship?"
- "How do I communicate better?"

⚠️ **These might get generic responses**:
- "What color should my profile be?" (not relationship-related)
- "Tell me a joke" (not educational)
- "What's the weather?" (off-topic)

---

## Testing Questions

Try these to test Amora:

1. **Love**: "I'm confused I don't know if I'm in love"
2. **Communication**: "How do I communicate better?"
3. **Trust**: "How do I build trust?"
4. **Confusion**: "I'm unsure about this relationship"
5. **Readiness**: "Am I ready for a committed relationship?"
6. **Feelings**: "How do I understand my feelings?"
7. **Boundaries**: "What are healthy boundaries?"
8. **Safety**: "What are red flags?"

---

## Summary

Amora uses **simple but effective** keyword matching to provide **thoughtful, ethical, non-directive** relationship guidance. She's designed to:

- **Help** users understand their feelings
- **Educate** about relationship concepts
- **Encourage** self-reflection
- **Never** tell users what to do

The system is **deterministic** - same questions always get same responses, making it **transparent** and **explainable**.
