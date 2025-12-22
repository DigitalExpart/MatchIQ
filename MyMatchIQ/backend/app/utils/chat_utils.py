"""
Chat utilities for question detection and name extraction
"""
import re
from typing import Optional, Tuple


# Question indicators
QUESTION_WORDS = [
    'what', 'when', 'where', 'who', 'why', 'how', 'which', 'whose', 'whom',
    'can', 'could', 'should', 'would', 'will', 'may', 'might', 'must',
    'is', 'are', 'was', 'were', 'do', 'does', 'did', 'have', 'has', 'had',
    'am', 'ai', 'tell', 'explain', 'describe', 'show', 'help'
]

# Common question patterns
QUESTION_PATTERNS = [
    r'^(what|when|where|who|why|how|which|whose|whom)\s+',
    r'^(can|could|should|would|will|may|might|must)\s+',
    r'^(is|are|was|were|do|does|did|have|has|had|am)\s+',
    r'\?$',  # Ends with question mark
    r'^(tell|explain|describe|show|help)\s+me',
    r'^(tell|explain|describe|show|help)\s+',
    r'^i\s+(want|need|wonder|would like)\s+to\s+know',
    r'^i\s+(want|need|wonder|would like)\s+',
]

# Name patterns (common name indicators)
NAME_PATTERNS = [
    r'(?:my|i\s+am|i\'m|call\s+me|name\s+is|name\'s)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
    r'^(?:i\s+am|i\'m|call\s+me|name\s+is|name\'s)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
    r'^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:here|speaking)',
]

# Common words that are NOT questions
NOT_QUESTIONS = [
    'hello', 'hi', 'hey', 'thanks', 'thank you', 'ok', 'okay', 'yes', 'no',
    'sure', 'alright', 'cool', 'nice', 'good', 'bad', 'great', 'awesome',
    'bye', 'goodbye', 'see you', 'later'
]


def is_question(text: str) -> bool:
    """
    Detect if a text input is a question.
    
    Returns True if the text appears to be a question, False otherwise.
    """
    if not text or not isinstance(text, str):
        return False
    
    text = text.strip()
    if not text:
        return False
    
    # Check if it's a common non-question word/phrase
    text_lower = text.lower()
    if text_lower in NOT_QUESTIONS:
        return False
    
    # Check for question mark
    if text.endswith('?'):
        return True
    
    # Check if it starts with a question word
    first_word = text_lower.split()[0] if text_lower.split() else ''
    if first_word in QUESTION_WORDS:
        return True
    
    # Check question patterns
    for pattern in QUESTION_PATTERNS:
        if re.search(pattern, text_lower, re.IGNORECASE):
            return True
    
    # Check if it's very short (likely not a question unless it's a question word)
    words = text.split()
    if len(words) <= 2:
        # Very short inputs are usually not questions unless they're question words
        if first_word not in QUESTION_WORDS:
            return False
    
    # Check for question-like structure (verb before subject, etc.)
    # Simple heuristic: if it starts with a verb-like word, might be a question
    verb_like = ['tell', 'explain', 'describe', 'show', 'help', 'give']
    if first_word in verb_like:
        return True
    
    return False


def extract_name(text: str) -> Optional[str]:
    """
    Extract a name from user input.
    
    Returns the extracted name if found, None otherwise.
    """
    if not text or not isinstance(text, str):
        return None
    
    text = text.strip()
    if not text:
        return None
    
    # Try name patterns
    for pattern in NAME_PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            name = match.group(1)
            # Clean up the name
            name = name.strip()
            # Remove common words that might have been captured
            name = re.sub(r'\b(me|is|am|call|name)\b', '', name, flags=re.IGNORECASE).strip()
            if name and len(name) > 1:
                return name.title()
    
    # If no pattern matched, check if it's a simple name (2-3 capitalized words)
    words = text.split()
    if len(words) <= 3:
        # Check if all words start with capital letters (likely a name)
        if all(word and word[0].isupper() for word in words if word):
            potential_name = ' '.join(words)
            # Exclude common words
            if potential_name.lower() not in ['i', 'me', 'you', 'he', 'she', 'it', 'we', 'they']:
                return potential_name
    
    return None


def should_ask_for_name(chat_history: list) -> bool:
    """
    Determine if the AI should ask for the user's name.
    
    Returns True if the user hasn't provided their name yet.
    """
    if not chat_history:
        return True
    
    # Check recent messages for name indicators
    recent_messages = chat_history[-5:] if len(chat_history) > 5 else chat_history
    
    for msg in recent_messages:
        if msg.get('role') == 'user':
            name = extract_name(msg.get('message', ''))
            if name:
                return False
    
    return True


def get_greeting_with_name(user_name: Optional[str]) -> str:
    """
    Get a personalized greeting if name is available.
    """
    if user_name:
        return f"Hi {user_name}! I'm Ella, your AI Coach. I'm here to help you understand your compatibility assessments."
    return "Hi! I'm Ella, your AI Coach. I'm here to help you understand your compatibility assessments."

