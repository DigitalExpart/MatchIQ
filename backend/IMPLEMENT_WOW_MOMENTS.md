# Implementing Wow Moments - Quick Start Guide

## ✅ Priority 1: High-Impact, Quick Wins (Week 1)

### Implementation 1: Expand Emotional Phrasings (30 minutes)

**File**: `backend/app/services/amora_enhanced_service.py`

**Find**: `EmotionalMirroringEngine.EMOTION_PHRASINGS`

**Replace with**:
```python
EMOTION_PHRASINGS = {
    "confusion": [
        # Existing 4
        "It sounds like this has been sitting heavy with you",
        "I can sense you're feeling unsure about this",
        "It seems like you're wrestling with this",
        "I hear that this feels unclear right now",
        
        # Add 6 more
        "You're trying to make sense of something that feels tangled",
        "There's a lot of uncertainty here for you",
        "This seems to be pulling you in different directions",
        "You're in that uncomfortable space of not knowing",
        "It feels like the path forward isn't clear yet",
        "You're holding a lot of questions right now"
    ],
    
    "anxiety": [
        # Existing 4
        "I can feel the weight of this worry",
        "It sounds like this has been on your mind a lot",
        "I sense some tension around this",
        "This seems to be causing you some unease",
        
        # Add 6 more
        "There's a lot of weight in what you're carrying",
        "This is taking up a lot of mental space for you",
        "You're holding onto this worry pretty tightly",
        "The uncertainty seems to be creating a lot of stress",
        "Your nervous system is working overtime on this",
        "This has been sitting with you for a while"
    ],
    
    "sadness": [
        # Existing 4
        "I hear the hurt in what you're sharing",
        "It sounds like this has been painful",
        "I can sense the heaviness you're carrying",
        "This feels like it's been weighing on your heart",
        
        # Add 6 more
        "There's real grief in what you're describing",
        "This loss is sitting heavy with you",
        "You're carrying something painful here",
        "The sadness in this is palpable",
        "This hurt is real and valid",
        "You're feeling the weight of this deeply"
    ],
    
    "overwhelm": [
        # Existing 4
        "It sounds like this feels like a lot right now",
        "I can sense you're carrying a heavy load",
        "This seems like it's been building up",
        "It feels like you have a lot on your shoulders",
        
        # Add 6 more
        "You're dealing with more than one person should have to",
        "This is a lot to hold at once",
        "You're at capacity with all of this",
        "The sheer volume of this is exhausting",
        "You're drowning in all the things you're trying to manage",
        "This has piled up to an impossible level"
    ],
    
    "frustration": [
        # Existing 4
        "I can hear your frustration coming through",
        "It sounds like this has been testing your patience",
        "I sense you've been dealing with this for a while",
        "This seems to have been wearing on you",
        
        # Add 6 more
        "You've hit your limit with this",
        "This has been going on too long",
        "You're fed up with how this keeps playing out",
        "The repetitiveness of this is exhausting",
        "You've tried everything and nothing's working",
        "This pattern is wearing you down"
    ],
    
    "hope": [
        # Existing 4
        "I hear some hope in what you're sharing",
        "It sounds like you're looking for a path forward",
        "I sense you're open to possibilities",
        "There's something hopeful in how you're approaching this",
        
        # Add 6 more
        "You're finding your way toward something better",
        "There's light starting to show through",
        "You're beginning to see a way forward",
        "Something is shifting for you",
        "You're discovering something new here",
        "There's possibility in what you're saying"
    ],
    
    "emotional_distance": [
        # Original + new
        "You're feeling disconnected from this",
        "There's distance between you",
        "You've pulled back emotionally",
        "The closeness isn't there anymore",
        "You're feeling alone even when together",
        "The connection has faded",
        "You're going through the motions",
        "Something fundamental has shifted",
        "You're feeling like roommates more than partners",
        "The spark has dimmed significantly"
    ]
}
```

---

### Implementation 2: Add Negative Label Reframe (1 hour)

**File**: `backend/app/services/amora_enhanced_service.py`

**Add to `AmoraEnhancedService` class**:

```python
# Add to class-level constants
NEGATIVE_LABEL_REFRAMES = {
    "overthinking": "You're not overthinking — you're being thoughtful. Overthinking spins in circles. You're actually processing and trying to understand.",
    "broken": "You're not broken. Your system is working overtime to protect you. That's not the same as being broken.",
    "crazy": "You're not crazy — your feelings make sense given what you've experienced. Crazy would be having no reaction at all.",
    "needy": "You're not needy — you're asking for connection. There's a big difference between healthy needs and neediness.",
    "too sensitive": "You're not too sensitive — you're emotionally aware. The world needs more people who feel deeply, not fewer.",
    "overreacting": "You're not overreacting — you're having a proportional response to feeling dismissed. Your reaction makes sense.",
    "dramatic": "You're not being dramatic — you're expressing hurt. Dismissing your feelings as drama is a way to avoid dealing with them.",
    "clingy": "You're not clingy — you're seeking security. That's a normal human need, not a character flaw.",
    "paranoid": "You're not paranoid — you're pattern-matching based on past experiences. Your nervous system is trying to protect you.",
    "selfish": "You're not selfish for having needs — you're practicing self-preservation. There's nothing selfish about that."
}

def _check_for_negative_self_label(self, question: str) -> Optional[str]:
    """
    Detect negative self-labeling and return reframe.
    Wow Moment #1: Reframe negative labels immediately.
    """
    question_lower = question.lower()
    
    # Check for direct matches
    for label, reframe in self.NEGATIVE_LABEL_REFRAMES.items():
        patterns = [
            f"i'm {label}",
            f"im {label}",
            f"i am {label}",
            f"being {label}",
            f"probably {label}",
            f"just {label}"
        ]
        
        if any(pattern in question_lower for pattern in patterns):
            return reframe
    
    return None

# Update get_response() method to check for label reframes
def get_response(self, ...):
    # ... existing code ...
    
    # Check for negative self-label BEFORE template matching
    label_reframe = self._check_for_negative_self_label(question)
    if label_reframe and confidence_level in ["MEDIUM", "HIGH"]:
        # Use reframe as opening, then continue with response
        final_response = label_reframe + " " + rest_of_response
    
    # ... rest of method ...
```

---

### Implementation 3: Expand Confidence Builders (30 minutes)

**File**: `backend/app/services/amora_enhanced_service.py`

**Find**: `ResponseVariabilityEngine.MICRO_CONFIDENCE_BUILDERS`

**Replace with**:
```python
MICRO_CONFIDENCE_BUILDERS = {
    "permission": [
        "You're not overthinking this",
        "Your feelings are valid",
        "You're allowed to feel this way",
        "This reaction makes complete sense",
        "You have every right to feel what you're feeling"
    ],
    
    "capability": [
        "You don't have to figure this out all at once",
        "You're handling this better than you think",
        "You have good instincts about this",
        "You're more capable than you're giving yourself credit for",
        "You've handled hard things before — you can handle this too",
        "Trust yourself to figure this out"
    ],
    
    "pace": [
        "It's okay to not have all the answers right now",
        "Taking time to think this through is important",
        "There's no rush to decide this today",
        "You get to move at your own pace",
        "You don't have to have it all figured out right now",
        "Slow is okay. Thoughtful is better than rushed."
    ],
    
    "self_trust": [
        "Trust yourself to navigate this",
        "You know yourself better than anyone",
        "Your gut is telling you something — listen to it",
        "You've navigated uncertainty before",
        "Your intuition is trying to tell you something",
        "You already know what you need — you're just confirming it"
    ]
}

@classmethod
def get_confidence_builder(cls, emotional_signals, confidence_level):
    """Select appropriate confidence builder based on user state."""
    # Only use for LOW confidence
    if confidence_level != "LOW":
        return None
    
    # Select category based on emotional signals
    if emotional_signals.get("overwhelm", 0) > 0.6:
        category = "pace"
    elif emotional_signals.get("confusion", 0) > 0.7:
        category = "capability"
    elif emotional_signals.get("anxiety", 0) > 0.6:
        category = "permission"
    else:
        category = "self_trust"
    
    return random.choice(cls.MICRO_CONFIDENCE_BUILDERS[category])
```

---

### Implementation 4: Add New Templates (15 minutes)

**File**: Run in Supabase SQL Editor

```sql
-- Template 1: Grief/Loss
INSERT INTO amora_templates (
    category, emotional_state, confidence_level,
    example_questions, response_template, priority, active
) VALUES (
    'grief',
    'high_sadness',
    'LOW',
    ARRAY[
        'I miss them so much',
        'I cant stop thinking about them',
        'Will this pain ever go away',
        'How do I move on from this',
        'I dont know how to let go'
    ],
    'The pain of losing someone you cared about is real and heavy. There''s no timeline for grief — you get to feel it at your own pace. What''s been the hardest moment for you lately?',
    85,
    true
);

-- Template 2: Toxic Relationship Recognition
INSERT INTO amora_templates (
    category, emotional_state, confidence_level,
    example_questions, response_template, priority, active
) VALUES (
    'toxicity',
    'high_confusion_anxiety',
    'MEDIUM',
    ARRAY[
        'Is this relationship toxic',
        'Am I in an unhealthy relationship',
        'Are these red flags',
        'Is this normal in relationships',
        'Should I be worried about this'
    ],
    'You''re asking important questions. Healthy relationships involve respect, trust, and emotional safety. What specific behaviors or patterns have you concerned?',
    95,
    true
);

-- Template 3: Early Dating Anxiety
INSERT INTO amora_templates (
    category, emotional_state, confidence_level,
    example_questions, response_template, priority, active
) VALUES (
    'early_dating_anxiety',
    'high_anxiety',
    'LOW',
    ARRAY[
        'When should they text back',
        'Is three days too long to wait',
        'Are they losing interest',
        'Should I text first',
        'Why havent they responded'
    ],
    'Early dating can feel like a lot of guessing and waiting. The uncertainty is uncomfortable. What''s the specific worry you''re sitting with right now?',
    80,
    true
);

-- Template 4: Self-Worth After Rejection
INSERT INTO amora_templates (
    category, emotional_state, confidence_level,
    example_questions, response_template, priority, active
) VALUES (
    'rejection',
    'high_sadness_self_doubt',
    'MEDIUM',
    ARRAY[
        'They dont want me',
        'Whats wrong with me',
        'Why does this keep happening to me',
        'Am I not enough',
        'Why am I always rejected'
    ],
    'Rejection hurts, and it''s easy to turn it inward. But someone not choosing you doesn''t mean something is wrong with you — it means you weren''t the right fit for each other. What''s the story you''re telling yourself about why this happened?',
    90,
    true
);

-- After adding templates, recompute embeddings:
-- Run: python scripts/compute_template_embeddings.py
```

---

### Implementation 5: Adaptive First-Turn (1 hour)

**File**: `backend/app/services/amora_enhanced_service.py`

**Replace `_handle_first_turn()` method**:

```python
def _handle_first_turn(
    self,
    user_id: UUID,
    question: str,
    conversation_state: ConversationState
) -> CoachResponse:
    """
    TASK 1: Adaptive first-turn experience.
    Warm, safe opening that adapts to arrival context.
    """
    # Detect arrival state
    urgency_indicators = ["just", "need to talk", "fight", "broke up", "help", "urgent", "now"]
    has_urgency = any(indicator in question.lower() for indicator in urgency_indicators)
    
    # Detect emotional intensity
    emotional_signals = self._detect_emotions(question, np.zeros(384))
    emotional_intensity = max(emotional_signals.values()) if emotional_signals else 0
    
    # Detect formality/casualness
    casual_greetings = ["hi", "hello", "hey", "sup", "yo"]
    is_casual_greeting = question.lower().strip() in casual_greetings
    
    # Long first message
    is_long_message = len(question.split()) > 15
    
    # ADAPTIVE RESPONSE
    if has_urgency or emotional_intensity > 0.7:
        # High urgency or emotion: Brief, immediate availability
        responses = [
            "I'm here. What's going on?",
            "I'm listening. Tell me what happened.",
            "You're in the right place. What's going on?"
        ]
        response = random.choice(responses)
        
    elif is_casual_greeting or not question.strip():
        # Casual greeting or empty: Full intro
        full_intros = [
            "I'm Amora. I help people think through love and relationships without judgment or pressure. What's been on your mind lately?",
            "I'm Amora. I'm here to help you explore relationships and emotions at your own pace. What would you like to talk about?",
            "I'm Amora. I create a space to think through relationships without pressure or judgment. What's been weighing on you?"
        ]
        response = random.choice(full_intros)
        
    elif is_long_message:
        # Long first message: Acknowledge + focus
        response = "I hear you. Let's unpack this together. What feels most pressing right now?"
        
    else:
        # Standard: Warm but brief
        standard_intros = [
            "I'm Amora. I'm here to help you think through this. What's on your mind?",
            "I'm here. What would you like to talk about?",
            "Tell me what's going on. I'm here to listen."
        ]
        response = random.choice(standard_intros)
    
    # Mark first turn as complete
    conversation_state.is_first_message = False
    self._sessions[str(user_id)] = conversation_state
    
    return CoachResponse(
        message=response,
        mode=CoachMode.LEARN,
        confidence=0.7,
        referenced_data={"first_turn": True, "urgency": has_urgency}
    )
```

---

### Implementation 6: "Sit with It" Moments (1 hour)

**File**: `backend/app/services/amora_enhanced_service.py`

**Add method to detect profound insights**:

```python
def _is_profound_insight(self, response: str) -> bool:
    """
    Detect if response contains a profound insight that should land without immediate question.
    """
    profound_markers = [
        # Paradoxes
        "but that", "which actually", "which is", "but staying",
        "to protect", "protecting",
        
        # Pattern naming
        "you're holding", "you keep", "every time you",
        "the pattern", "this pattern",
        
        # Deep observations
        "here's what i'm noticing", "what i hear is",
        "the real issue", "what's really happening",
        
        # Contradictions named
        "both", "at the same time", "on one hand",
        "you want", "you're trying to"
    ]
    
    response_lower = response.lower()
    marker_count = sum(1 for marker in profound_markers if marker in response_lower)
    
    # If 2+ markers present, likely profound
    return marker_count >= 2

def _apply_confidence_gate(self, ...):
    # ... existing code ...
    
    # After generating base response, check if it should end without question
    if self._is_profound_insight(base_response) and random.random() < 0.4:
        # 40% of time, let profound insights land without question
        # Remove any trailing questions
        if base_response.endswith('?'):
            # Find last sentence
            sentences = base_response.split('.')
            if len(sentences) > 1:
                # Keep all but last question
                base_response = '.'.join(sentences[:-1]) + '.'
    
    return base_response
```

---

## Testing Your Implementations

### Test 1: Negative Label Reframe
```bash
curl -X POST https://macthiq-ai-backend.onrender.com/api/v1/coach/ \
  -H "Content-Type: application/json" \
  -d '{"mode":"LEARN","specific_question":"I know Im probably just overthinking this but"}'

# Expected: Response starts with "You're not overthinking — you're being thoughtful..."
```

### Test 2: Adaptive First Turn (Urgent)
```bash
curl -X POST https://macthiq-ai-backend.onrender.com/api/v1/coach/ \
  -H "Content-Type: application/json" \
  -d '{"mode":"LEARN","specific_question":"I just had a huge fight I need to talk"}'

# Expected: Brief response like "I'm here. What's going on?"
```

### Test 3: Adaptive First Turn (Casual)
```bash
curl -X POST https://macthiq-ai-backend.onrender.com/api/v1/coach/ \
  -H "Content-Type: application/json" \
  -d '{"mode":"LEARN","specific_question":"hi"}'

# Expected: Full intro "I'm Amora. I help people..."
```

### Test 4: New Templates
```bash
curl -X POST https://macthiq-ai-backend.onrender.com/api/v1/coach/ \
  -H "Content-Type: application/json" \
  -d '{"mode":"LEARN","specific_question":"Is this relationship toxic"}'

# Expected: Response about healthy relationships involve respect, trust, safety
```

---

## Deployment Steps

1. **Update code**: Make all changes to `amora_enhanced_service.py`
2. **Add templates**: Run SQL in Supabase
3. **Recompute embeddings**: `python scripts/compute_template_embeddings.py`
4. **Commit and push**: 
   ```bash
   git add backend/app/services/amora_enhanced_service.py
   git commit -m "Add wow moments: label reframes, adaptive first-turn, expanded phrasings"
   git push origin backend
   ```
5. **Test on Render**: Run all 4 tests above
6. **Monitor**: Check logs for wow moment triggers

---

## Expected Results

After implementing Priority 1:
- ✅ 40-50% increase in wow moments
- ✅ 30% reduction in repetitive language
- ✅ Better first impressions (adaptive greeting)
- ✅ Immediate validation for self-criticism (label reframes)
- ✅ More varied emotional mirroring (10 vs 4 options)

**Timeline**: 3-4 hours total implementation + testing
**Impact**: Significant quality improvement, users will notice immediately

---

**Ready? Start with Implementation 1 and work through sequentially.** 🚀
