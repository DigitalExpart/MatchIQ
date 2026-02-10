"""
Crisis Detection and Response for Amora.

Handles detection of self-harm/suicidal ideation with highest priority,
and provides safe, crisis-appropriate responses that direct users to
real-world emergency support.
"""
import logging
import random
from typing import Optional
import numpy as np

logger = logging.getLogger(__name__)


class CrisisDetector:
    """Detect crisis/self-harm/suicidal ideation intent with highest priority."""
    
    # Strong keyword patterns for crisis detection
    CRISIS_KEYWORDS = [
        # Direct statements
        'i want to die',
        'i want to kill myself',
        'i want to end my life',
        'i want to end it all',
        'im going to kill myself',
        'im going to end my life',
        'going to end it all',
        'dont want to live anymore',
        'dont want to be alive',
        'wish i was dead',
        'wish i could die',
        'wish i would die',
        'should just kill myself',
        'should just die',
        'better off without me',
        'everyone would be better off without me',
        # Self-harm
        'want to hurt myself',
        'going to hurt myself',
        'going to cut myself',
        'want to cut myself',
        'thinking of hurting myself',
        # Planning/preparation
        'have a plan to',
        'figured out how to',
        'know how i would',
        # Additional patterns
        'ending it all',
        'not worth living',
        'life is not worth',
        'no reason to live',
        'nothing to live for',
        'suicide',
        'kill myself',
        'end myself',
        'take my own life',
        'end my life',
    ]
    
    @classmethod
    def detect_crisis_intent(cls, text: str, embedding: Optional[np.ndarray] = None) -> Optional[str]:
        """
        Detect crisis/self-harm/suicidal ideation intent.
        Returns 'CRISIS_SELF_HARM' if detected, None otherwise.
        
        This has HIGHEST priority - should be checked before normal topic detection.
        """
        text_lower = text.lower().strip()
        
        # Check for direct keyword matches (highest confidence)
        for keyword in cls.CRISIS_KEYWORDS:
            if keyword in text_lower:
                logger.warning(f"CRISIS detected via keyword: {keyword[:30]}...")
                return 'CRISIS_SELF_HARM'
        
        # Additional semantic checks using embeddings if available
        # (Could add embedding similarity to crisis-related phrases)
        # For now, keyword matching is sufficient and more reliable
        
        return None


# ============================================
# CRISIS RESPONSE TEMPLATES
# ============================================

CRISIS_RESPONSES = [
    """I'm really glad you told me this. It sounds like you're in an enormous amount of pain right now.

I want you to know that I'm not able to keep you safe in an emergency or make urgent decisions for you. If you're in immediate danger or have thoughts of hurting yourself, please reach out for help right away:

• Call your local emergency services (911 in the US, 999 in the UK)
• Contact a crisis helpline in your country
• Reach out to a trusted friend, family member, or therapist

You don't have to go through this alone. There are people trained to help during these moments.""",

    """Thank you for sharing this with me. I can hear how much pain you're in.

I'm a relationship coach, not a crisis counselor, and I can't provide the urgent support you need right now. If you're having thoughts of hurting yourself or ending your life, please connect with someone who can help immediately:

• Call emergency services or a crisis hotline
• Reach out to someone you trust—a friend, family member, or mental health professional
• Go to your nearest emergency room if you're in immediate danger

These feelings can feel overwhelming, but they can pass. Please don't go through this alone.""",

    """I hear how much pain you're in, and I'm really glad you reached out.

I need to be clear: I'm not equipped to handle a mental health crisis or keep you safe in an emergency. If you're having thoughts of harming yourself or ending your life, please get immediate support:

• Contact emergency services if you're in immediate danger
• Call a crisis helpline (available 24/7 in most countries)
• Reach out to someone you trust—a family member, friend, or mental health professional

You deserve support from people trained to help in these moments. Please reach out.""",

    """Thank you for telling me this. I can sense the depth of what you're feeling right now.

I'm a relationship coach focused on helping with relationship questions, and I'm not able to provide crisis support or make urgent safety decisions. If you're experiencing thoughts of self-harm or suicide, please connect with:

• Your local emergency services (immediate danger)
• A crisis helpline (available 24/7)
• A trusted person in your life—friend, family, therapist, or counselor

These feelings, as overwhelming as they can be, don't have to last forever. Please reach out for the support you deserve right now.""",

    """I'm glad you shared this with me. What you're describing sounds incredibly painful.

I want to be transparent: I'm not able to keep you safe in an emergency situation or provide the kind of immediate support that crisis situations require. If you're having thoughts of hurting yourself or ending your life, please get help immediately:

• Call emergency services if you're in immediate danger
• Contact a crisis hotline or mental health crisis service
• Reach out to someone you trust—a friend, family member, or mental health professional

You don't have to handle this alone. There are people specifically trained to help during these times.""",
]


def get_crisis_response() -> str:
    """Get a random crisis response template."""
    return random.choice(CRISIS_RESPONSES)
