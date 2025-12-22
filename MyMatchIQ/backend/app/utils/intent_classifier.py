"""
Intent Classification for AI Coach
Classifies user inputs into IDENTITY, META_CAPABILITY, COACHING, or FALLBACK
"""
import re
from typing import Optional, Tuple
from enum import Enum


class IntentType(str, Enum):
    """Intent classification types"""
    IDENTITY = "IDENTITY"
    META_CAPABILITY = "META_CAPABILITY"
    COACHING = "COACHING"
    FALLBACK = "FALLBACK"


# Identity question patterns
IDENTITY_PATTERNS = [
    r'\b(what|who)\s+(is|are)\s+(your|you|ella)\s+name',
    r'\bwhat\s+(your|you|is|are)\s+name',  # Catches "what your name", "what you name", etc.
    r'\b(what|who)\s+(is|are)\s+you',
    r'\bwho\s+(are|is)\s+(you|ella)',
    r'\b(what|who)\s+(is|are)\s+(this|that)\s+ai',
    r'\bare\s+you\s+human',
    r'\bare\s+you\s+(a|an)\s+(ai|bot|robot|machine)',
    r'\bwhat\s+(is|are)\s+(ella|you)',
    r'\bintroduce\s+(yourself|you)',
    r'\btell\s+me\s+(about|who)\s+(you|yourself|ella)',
    r'\bname\s+(is|are)',  # Catches "name is", "name are"
]

# Meta capability question patterns
META_CAPABILITY_PATTERNS = [
    r'\bwhat\s+(can|do)\s+(you|ella)\s+(do|help|assist)',
    r'\bwhat\s+(are|is)\s+(your|you)\s+(capabilities|abilities|functions|features)',
    r'\bhow\s+(can|do)\s+(you|ella)\s+(help|assist)',
    r'\bwhat\s+(do|does)\s+(you|ella|this)\s+(do|help)',
    r'\bwhat\s+is\s+(this|that|the)\s+(ai|coach|system)',
    r'\bexplain\s+(what|how)\s+(you|ella|this)\s+(works|does)',
    r'\bwhat\s+(are|is)\s+(you|ella|this)\s+(for|used\s+for)',
]

# Prompt injection patterns (malicious)
PROMPT_INJECTION_PATTERNS = [
    r'ignore\s+(previous|all)\s+(instructions|rules)',
    r'forget\s+(everything|all|previous)',
    r'you\s+are\s+now\s+(a|an)',
    r'pretend\s+(you|to)',
    r'act\s+as\s+(if|though)',
    r'system\s*:\s*',
    r'\[INST\]',
    r'<\|.*?\|>',
]


def classify_intent(user_message: Optional[str]) -> Tuple[IntentType, float]:
    """
    Classify user message intent.
    
    Returns:
        Tuple of (IntentType, confidence_score)
        confidence_score: 0.0 to 1.0
    """
    if not user_message or not isinstance(user_message, str):
        return IntentType.FALLBACK, 0.0
    
    user_message_lower = user_message.lower().strip()
    
    if not user_message_lower:
        return IntentType.FALLBACK, 0.0
    
    # Check for prompt injection (malicious)
    for pattern in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, user_message_lower, re.IGNORECASE):
            return IntentType.FALLBACK, 1.0
    
    # Check identity patterns
    identity_matches = 0
    for pattern in IDENTITY_PATTERNS:
        if re.search(pattern, user_message_lower, re.IGNORECASE):
            identity_matches += 1
    
    if identity_matches > 0:
        confidence = min(identity_matches * 0.5, 1.0)
        return IntentType.IDENTITY, confidence
    
    # Check meta capability patterns
    meta_matches = 0
    for pattern in META_CAPABILITY_PATTERNS:
        if re.search(pattern, user_message_lower, re.IGNORECASE):
            meta_matches += 1
    
    if meta_matches > 0:
        confidence = min(meta_matches * 0.5, 1.0)
        return IntentType.META_CAPABILITY, confidence
    
    # Check for coaching-related keywords (broad but valid)
    coaching_keywords = [
        'relationship', 'dating', 'compatibility', 'boundary', 'boundaries',
        'communication', 'red flag', 'safety', 'emotional', 'value', 'values',
        'assessment', 'score', 'match', 'connection', 'partner', 'date',
        'explain', 'help', 'understand', 'learn', 'tell me about',
        'what is', 'how does', 'why', 'question'
    ]
    
    coaching_score = 0
    for keyword in coaching_keywords:
        if keyword in user_message_lower:
            coaching_score += 1
    
    # If has coaching keywords, classify as coaching
    if coaching_score > 0:
        confidence = min(coaching_score * 0.2, 1.0)
        return IntentType.COACHING, confidence
    
    # Very short or single-word inputs that aren't questions
    words = user_message_lower.split()
    if len(words) <= 2:
        # Check if it's a greeting or acknowledgment
        greetings = ['hi', 'hello', 'hey', 'thanks', 'thank you', 'ok', 'okay', 'yes', 'no']
        if user_message_lower in greetings:
            return IntentType.COACHING, 0.3  # Treat as valid but low confidence
    
    # Default: fallback for completely unrelated content
    return IntentType.FALLBACK, 0.5


def is_identity_question(user_message: Optional[str]) -> bool:
    """Quick check if message is an identity question."""
    intent, confidence = classify_intent(user_message)
    return intent == IntentType.IDENTITY and confidence > 0.5


def is_meta_capability_question(user_message: Optional[str]) -> bool:
    """Quick check if message is a meta capability question."""
    intent, confidence = classify_intent(user_message)
    return intent == IntentType.META_CAPABILITY and confidence > 0.5


def is_coaching_intent(user_message: Optional[str]) -> bool:
    """Check if message is a valid coaching intent."""
    intent, confidence = classify_intent(user_message)
    return intent == IntentType.COACHING and confidence > 0.3

