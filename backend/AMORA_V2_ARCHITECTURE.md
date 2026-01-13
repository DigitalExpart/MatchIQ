# Amora V2 Architecture - Semantic AI Coach

## Overview

Transform Amora from template-based keyword matching to an emotionally intelligent, semantically aware AI coach using LLM technology.

## System Architecture

```
User Input
    ↓
Frontend → Backend API
    ↓
Input Processor (sanitize, validate)
    ↓
Context Loader (session + memory for paid users)
    ↓
Emotional Signal Detector (LLM)
    ↓
Intent Classifier (soft, multi-label)
    ↓
Response Strategy Selector
    ↓
LLM Response Generator (with guardrails)
    ↓
Safety Validator
    ↓
Response Formatter
    ↓
Memory Updater (paid users only)
    ↓
Return to Frontend
```

## Core Components

### 1. Emotional Signal Detector

**Input**: User message
**Output**: Multi-label emotional signals with confidence scores

```python
{
    "confusion": 0.8,
    "sadness": 0.3,
    "anxiety": 0.6,
    "frustration": 0.2,
    "hope": 0.4,
    "emotional_distance": 0.1,
    "overwhelm": 0.7
}
```

**Implementation**: 
- Use LLM with structured output (JSON mode)
- Prompt engineered for emotional detection
- Threshold: 0.5 for signal activation

### 2. Intent Classifier (Soft)

**Input**: User message + emotional signals
**Output**: Multi-label intent probabilities

```python
{
    "greeting_testing": 0.2,
    "venting": 0.8,
    "reflection": 0.5,
    "advice_seeking": 0.3,
    "reassurance_seeking": 0.7,
    "decision_making": 0.1,
    "curiosity_learning": 0.2,
    "confidence_level": "LOW"  # LOW | MEDIUM | HIGH
}
```

**Confidence Rules**:
- HIGH: Single dominant intent (>0.7), low emotional signals
- MEDIUM: Multiple intents (0.4-0.7), moderate emotional signals
- LOW: Unclear intent, high emotional signals (venting, confusion)

### 3. Response Strategy Selector

Based on confidence and signals:

**LOW Confidence Strategy**:
- Reflect emotion (mirror language)
- Validate feelings
- Ask ONE gentle clarifying question
- NO advice

**MEDIUM Confidence Strategy**:
- Reflect emotion briefly
- Offer light insight/reframe
- Ask clarifying follow-up
- Minimal advice

**HIGH Confidence Strategy**:
- Brief emotional acknowledgment
- Structured guidance
- Non-directive language ("might", "could", "consider")
- Actionable insights

### 4. LLM Response Generator

**System Prompt Structure**:

```
You are Amora, an emotionally intelligent relationship coach.

PERSONALITY:
- Warm, calm, thoughtful
- Non-judgmental, non-directive
- Emotionally attuned
- Patient and reflective

TONE:
- Use "might", "could", "consider" instead of "should", "must"
- Reflect emotions before offering insight
- Ask gentle questions when unclear
- Keep responses concise (2-4 sentences)

CONSTRAINTS:
- Never say "I don't understand"
- No generic fallbacks
- No commands or prescriptive advice
- No mention of being an AI unless asked

CURRENT CONTEXT:
User emotional state: [signals]
Intent confidence: [level]
Response strategy: [LOW/MEDIUM/HIGH]

USER MESSAGE: [message]

RESPOND as Amora following the [strategy] approach.
```

**Guardrails**:
- Content moderation (OpenAI Moderation API)
- Safety keywords detection
- Response length limits (50-150 words)
- No personal data requests

### 5. Memory System (Paid Users Only)

**Structure**:
```python
{
    "user_id": "uuid",
    "patterns": [
        {
            "theme": "communication_struggles",
            "occurrences": 3,
            "first_seen": "2026-01-10",
            "last_seen": "2026-01-13",
            "emotional_context": ["frustration", "sadness"]
        }
    ],
    "goals": ["improve_communication", "build_trust"],
    "communication_style": "direct_analytical",
    "session_count": 15
}
```

**Storage**: 
- Vector embeddings (Pinecone/Supabase pgvector)
- Semantic search for pattern matching
- Privacy: No raw messages, only themes

**Free Users**:
- Session-only context (in-memory)
- No persistence
- Reset after 30 min inactivity

**Paid Users**:
- Persistent memory
- Pattern recognition across sessions
- Context: "Last time we talked about..."

### 6. Identity & Greeting Handler

**Triggers**:
- "What's your name?"
- "Who are you?"
- "Hi", "Hello" (first message)
- Random/test input

**Response Pattern**:
```
"I'm Amora. I'm here to help you think through relationships and emotions at your own pace. What's been on your mind lately?"
```

**Implementation**: Special case in intent classifier

### 7. Error Handling

**Empty/Invalid Input**:
- Don't say "I don't understand"
- Respond: "I'm here whenever you're ready to talk. What's on your mind?"

**One-word responses** ("idk", "nothing"):
- Gentle probe: "That's okay. Sometimes it's hard to put things into words. Is there anything specific that brought you here today?"

**Emoji-only**:
- Reflect emotion: "I sense you're feeling something. Want to talk about it?"

## Tech Stack

### Backend
- **LLM**: OpenAI GPT-4-turbo or Anthropic Claude 3.5 Sonnet
- **Vector DB**: Supabase pgvector (already using Supabase)
- **Caching**: Redis for session context
- **Queue**: Celery for async LLM calls (optional)

### Frontend
- **Real-time**: WebSocket for streaming responses
- **State**: Context preservation across messages
- **UI**: Typing indicators, thought pacing

## Cost Management

### Rate Limiting
- Free: 10 messages/day
- Paid: Unlimited (fair use: 100/day)

### Caching
- Cache LLM calls for identical questions (7 days)
- Cache emotional signals for similar inputs

### Token Optimization
- Use GPT-4-turbo (cheaper than GPT-4)
- Compress context (summarize old messages)
- Max context: 5 previous messages

## Free vs Paid Experience

### Free Users
- Full emotional understanding
- Reflection + clarifying questions
- Light insights
- No memory across sessions
- 10 messages/day limit

### Paid Users ($4.99/month)
- Everything in free
- Persistent memory
- Pattern analysis: "I notice you often mention..."
- Deeper insights
- Unlimited messages
- Priority response time

**Soft Gating**:
- No abrupt blocks
- Gentle: "Want deeper insights? Upgrade to remember our conversations."
- Show value before asking

## Security & Privacy

### Data Handling
- No raw message storage (paid users: themes only)
- End-to-end encryption for in-transit data
- Anonymized LLM requests (no user IDs sent to OpenAI)
- GDPR compliance: User data export/deletion

### Safety
- Content moderation before LLM
- Abuse detection (repeated harmful input)
- Crisis detection: "If you're in immediate danger, please contact..."
- Rate limiting per user

## Metrics & Monitoring

### Track:
- Response quality (thumbs up/down)
- Conversation length (free vs paid)
- Upgrade conversion rate
- Emotional signal accuracy
- Intent classification accuracy
- Average response time
- Cost per conversation

### A/B Testing:
- Response strategies
- Upgrade prompts
- Emotional reflection depth

## Migration Path

### Phase 1: Parallel Systems (Week 1-2)
- Keep current template system
- Build new LLM system alongside
- A/B test: 10% traffic to new system

### Phase 2: Gradual Rollout (Week 3-4)
- 50% traffic to new system
- Monitor quality + costs
- Iterate on prompts

### Phase 3: Full Migration (Week 5)
- 100% traffic to new system
- Deprecate template system
- Monitor conversion rates

## Success Metrics

### User Experience
- 80%+ positive feedback
- 30%+ multi-message conversations (vs single)
- 50% reduction in "generic response" complaints

### Business
- 15%+ free-to-paid conversion
- 2.5x increase in conversation depth (paid users)
- <$0.10 cost per conversation

## Example Conversation Flow

**User**: "idk if i should stay or leave"

**Step 1**: Emotional signals detected
```json
{
  "confusion": 0.9,
  "anxiety": 0.7,
  "emotional_distance": 0.4
}
```

**Step 2**: Intent classification
```json
{
  "decision_making": 0.6,
  "venting": 0.4,
  "reassurance_seeking": 0.5,
  "confidence_level": "LOW"
}
```

**Step 3**: Response strategy = LOW
- Reflect emotion
- Validate
- Ask clarifying question
- No advice

**Amora Response**:
"It sounds like you're feeling really torn right now, and that uncertainty can be exhausting. What's making this decision feel so heavy for you?"

**Result**: User feels heard, opens up more, conversation deepens.

---

This architecture transforms Amora from a keyword bot into an emotionally intelligent coach that users trust and want to engage with long-term.
