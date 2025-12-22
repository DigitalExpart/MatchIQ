"""
Identity and Meta Capability Handler
Static template responses for identity and capability questions
"""
from typing import Optional, List
from app.utils.intent_classifier import IntentType, classify_intent
from app.models.pydantic_models import CoachResponse, CoachMode


# Approved identity response templates
IDENTITY_RESPONSES = {
    'name': "I'm Ella, the AI Coach inside MyMatchIQ.",
    'role': "My role is to help explain compatibility patterns, communication signals, and relationship safety based on assessment data.",
    'scope': "I don't give advice or make decisions. I help you understand patterns so you can reflect clearly."
}

# Approved meta capability response templates
META_CAPABILITY_RESPONSES = {
    'capabilities': "I can help explain compatibility patterns, communication signals, and relationship safety based on assessment data.",
    'scope': "I don't give advice or make decisions. I help you understand patterns so you can reflect clearly.",
    'boundary': "I work only with data from your assessments and blueprints."
}


def handle_identity_intent(user_message: Optional[str]) -> Optional[CoachResponse]:
    """
    Handle identity questions with static templates.
    
    Returns CoachResponse if handled, None if not an identity question.
    """
    intent, confidence = classify_intent(user_message)
    
    if intent != IntentType.IDENTITY or confidence < 0.5:
        return None
    
    if not user_message:
        return None
    
    user_message_lower = user_message.lower()
    
    # Detect which identity aspects are asked about
    # More flexible matching for name questions
    asks_name = any(pattern in user_message_lower for pattern in [
        'name', 'who are you', 'who is ella', 'what is your name', 
        'what your name', 'what you name', 'what name', 'your name'
    ]) or 'name' in user_message_lower and ('what' in user_message_lower or 'who' in user_message_lower)
    asks_role = any(pattern in user_message_lower for pattern in [
        'role', 'what do you do', 'what are you', 'what is this'
    ])
    asks_scope = any(pattern in user_message_lower for pattern in [
        'human', 'ai', 'bot', 'robot', 'advice', 'decisions'
    ])
    
    # Build combined response
    parts = []
    
    if asks_name:
        parts.append(IDENTITY_RESPONSES['name'])
    
    if asks_role:
        parts.append(IDENTITY_RESPONSES['role'])
    
    if asks_scope:
        parts.append(IDENTITY_RESPONSES['scope'])
    
    # If no specific aspect detected, provide name and role
    if not parts:
        parts.append(IDENTITY_RESPONSES['name'])
        parts.append(IDENTITY_RESPONSES['role'])
    
    message = " ".join(parts)
    
    return CoachResponse(
        message=message,
        mode=CoachMode.LEARN,  # Use LEARN mode for consistency
        confidence=1.0,
        referenced_data={'intent': 'identity', 'handled': True}
    )


def handle_meta_capability_intent(user_message: Optional[str]) -> Optional[CoachResponse]:
    """
    Handle meta capability questions with static templates.
    
    Returns CoachResponse if handled, None if not a meta capability question.
    """
    intent, confidence = classify_intent(user_message)
    
    if intent != IntentType.META_CAPABILITY or confidence < 0.5:
        return None
    
    if not user_message:
        return None
    
    # Build response
    parts = [
        META_CAPABILITY_RESPONSES['capabilities'],
        META_CAPABILITY_RESPONSES['scope']
    ]
    
    message = " ".join(parts)
    
    return CoachResponse(
        message=message,
        mode=CoachMode.LEARN,
        confidence=1.0,
        referenced_data={'intent': 'meta_capability', 'handled': True}
    )


def handle_pre_intent(user_message: Optional[str]) -> Optional[CoachResponse]:
    """
    Pre-intent interception layer.
    Handles identity and meta capability questions BEFORE coach mode routing.
    
    Returns CoachResponse if handled, None if should proceed to normal routing.
    """
    # Try identity first
    identity_response = handle_identity_intent(user_message)
    if identity_response:
        return identity_response
    
    # Try meta capability
    meta_response = handle_meta_capability_intent(user_message)
    if meta_response:
        return meta_response
    
    # Not handled, proceed to normal routing
    return None

