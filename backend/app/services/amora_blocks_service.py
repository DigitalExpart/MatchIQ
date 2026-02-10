"""
Amora Blocks Service - LLM-like responses using block-based architecture.
Rich, varied, non-repetitive responses focused exclusively on relationships.

No external AI APIs. 100% local semantic matching + templates.
"""
import logging
import random
import re
from typing import Dict, Any, List, Optional, Set
from uuid import UUID
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.models.pydantic_models import CoachMode, CoachRequest, CoachResponse
from app.database import get_supabase_client

# Import embedding model function from enhanced service
from app.services.amora_enhanced_service import get_embedding_model
# Import crisis detection
from app.services.crisis_detection import CrisisDetector, get_crisis_response

logger = logging.getLogger(__name__)

# ============================================
# CONFIGURATION
# ============================================

# Top-K for weighted random selection
# Higher = more variation, but may reduce quality if set too high
TOP_K_CANDIDATES = 5  # Choose randomly among top 5 scored blocks


# ============================================
# RESPONSE STYLE SYSTEM
# ============================================

class ResponseStyle(str, Enum):
    """Dynamic response styles based on conversation context."""
    LIGHT_TOUCH = "LIGHT_TOUCH"              # Brief reflection + 1 question
    GROUNDING = "GROUNDING"                  # 1-2 paragraphs, grounding response
    DEEPENING = "DEEPENING"                  # 2-3 paragraphs, building depth
    GUIDANCE_SESSION = "GUIDANCE_SESSION"    # Long micro-session with insights


# Response style configuration: maps style to block counts
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
    ResponseStyle.DEEPENING: {
        'reflection': 2,
        'normalization': 2,
        'insight': 1,
        'exploration': 1,
        'max_questions': 2
    },
    ResponseStyle.GUIDANCE_SESSION: {
        'reflection': 2,
        'normalization': 2,
        'insight': 2,
        'exploration': 2,
        'max_questions': 2
    }
}

# Advice/guidance request keywords
ADVICE_REQUEST_KEYWORDS = [
    'can you give me advice',
    'give me advice',
    'what should i do',
    'how can i deal',
    'how do i handle',
    'how do i cope',
    'please help me',
    'help me',
    'what do i do',
    'how to deal with',
    'how to handle',
    'need advice',
    'need help',
    'tell me what to do'
]

# Heavy/intense topics that warrant GROUNDING on first turn
HEAVY_TOPICS = [
    'heartbreak',
    'breakup_grief',
    'breakup_intimacy_loss',
    'cheating',
    'toxic_or_abusive_dynamic',
    'partner_mental_health_or_addiction',
    'low_self_worth_in_love',
    'lgbtq_identity_and_family_pressure',
    'non_monogamy_open_or_poly',
    'divorce',
    'separation',
    'user_anxiety_distress',  # User-side anxiety feelings
    'user_depression_distress'  # User-side depression feelings
]


def choose_response_style(
    user_message: str,
    topics: List[str],
    emotions: List[str],
    topic_stage: int,
    turn_index_for_topic: int,
    previous_style: Optional[ResponseStyle] = None
) -> ResponseStyle:
    """
    Choose appropriate response style based on conversation context.
    
    Heuristics:
    1. Explicit advice requests → GUIDANCE_SESSION
    2. First turn on heavy topic → GROUNDING
    3. Second-fourth turns on same topic → DEEPENING
    4. Very short messages → LIGHT_TOUCH
    5. Later turns (5+) → alternate DEEPENING/GROUNDING
    """
    message_lower = user_message.lower()
    message_length = len(user_message)
    
    # 1. Check for explicit advice/guidance requests
    if any(keyword in message_lower for keyword in ADVICE_REQUEST_KEYWORDS):
        logger.info(f"Style: GUIDANCE_SESSION (advice request detected)")
        return ResponseStyle.GUIDANCE_SESSION
    
    # 2. First turn on heavy topic → GROUNDING
    if turn_index_for_topic == 1 and topic_stage == 1:
        if any(topic in HEAVY_TOPICS for topic in topics):
            logger.info(f"Style: GROUNDING (first turn on heavy topic: {topics})")
            return ResponseStyle.GROUNDING
    
    # 3. Very short messages (clarifications) → LIGHT_TOUCH
    if message_length < 50 and turn_index_for_topic > 1:
        # But not if it's an advice request
        if not any(keyword in message_lower for keyword in ['help', 'advice', 'what', 'how']):
            logger.info(f"Style: LIGHT_TOUCH (short message: {message_length} chars)")
            return ResponseStyle.LIGHT_TOUCH
    
    # 4. Turns 2-4 on same topic with emotional sharing → DEEPENING
    if 2 <= turn_index_for_topic <= 4 and topic_stage <= 2:
        # Check if user is sharing feelings/details (not just asking questions)
        sharing_indicators = ['i feel', 'i dont', 'i cant', 'i keep', 'i miss', 'i want', 'i need', 'im']
        if any(indicator in message_lower for indicator in sharing_indicators):
            logger.info(f"Style: DEEPENING (turn {turn_index_for_topic}, emotional sharing)")
            return ResponseStyle.DEEPENING
    
    # 5. Later turns (5+) → alternate or adapt
    if turn_index_for_topic >= 5:
        # If user brings new emotional angle, deepen
        if any(emotion in ['confused', 'torn', 'conflicted', 'stuck'] for emotion in emotions):
            logger.info(f"Style: DEEPENING (later turn with new emotional angle)")
            return ResponseStyle.DEEPENING
        # Otherwise, stay grounded but shorter
        logger.info(f"Style: GROUNDING (later turn, keeping grounded)")
        return ResponseStyle.GROUNDING
    
    # Default: DEEPENING for most middle-conversation turns
    logger.info(f"Style: DEEPENING (default for turn {turn_index_for_topic})")
    return ResponseStyle.DEEPENING


# ============================================
# DATA STRUCTURES
# ============================================

@dataclass
class ConversationState:
    """Track conversation state for anti-repetition and progressive depth."""
    session_id: str
    user_id: UUID
    
    # Anti-repetition tracking
    recent_block_ids: List[str] = field(default_factory=list)  # Last N block IDs used
    max_recent_blocks: int = 15  # How many to track
    
    # Progressive depth per topic
    topic_stages: Dict[str, int] = field(default_factory=dict)  # topic -> stage (1-4)
    active_topics: List[str] = field(default_factory=list)  # Topics discussed this session
    topic_turn_counts: Dict[str, int] = field(default_factory=dict)  # topic -> turn count
    
    # Response style tracking
    last_response_style: Optional[ResponseStyle] = None
    current_dominant_topic: Optional[str] = None
    
    # Context personalization
    partner_label: Optional[str] = None  # "partner", "boyfriend", "girlfriend", etc.
    relationship_status: Optional[str] = None  # "single", "dating", "married", etc.
    user_name: Optional[str] = None
    
    # Session metadata
    turn_count: int = 0
    last_user_phrase: Optional[str] = None  # For injection into exploration blocks
    
    # Timestamps
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)


@dataclass
class ResponseBlock:
    """A single response block from the database."""
    id: str
    block_type: str  # reflection, normalization, exploration, reframe
    text: str
    topics: List[str]
    emotions: List[str]
    stage: int
    priority: int
    embedding: np.ndarray


# ============================================
# TOPIC & EMOTION DETECTION
# ============================================

class TopicEmotionDetector:
    """Detect topics and emotions from user messages."""
    
    @staticmethod
    def normalize_text(text: str) -> str:
        """
        Normalize text for better keyword matching.
        - Lowercase
        - Remove punctuation (keep spaces)
        - Normalize contractions (im -> i'm, dont -> don't)
        - Collapse whitespace
        """
        import re
        # Lowercase
        text = text.lower()
        
        # Normalize common contractions and typos
        contractions = {
            r'\bim\b': 'i am',
            r'\bdont\b': 'do not',
            r'\bwont\b': 'will not',
            r'\bcant\b': 'cannot',
            r'\bwouldnt\b': 'would not',
            r'\bshouldnt\b': 'should not',
            r'\bcouldnt\b': 'could not',
            r'\bisnt\b': 'is not',
            r'\baren\'t\b': 'are not',
            r'\bwasnt\b': 'was not',
            r'\bwerent\b': 'were not',
            r'\bhavent\b': 'have not',
            r'\bhasnt\b': 'has not',
            r'\bhadnt\b': 'had not',
            r'\bive\b': 'i have',
            r'\byouve\b': 'you have',
            r'\bweve\b': 'we have',
            r'\btheyve\b': 'they have',
            r'\bid\b': 'i would',
            r'\byoud\b': 'you would',
            r'\bhed\b': 'he would',
            r'\bshed\b': 'she would',
            r'\bwed\b': 'we would',
            r'\btheyd\b': 'they would',
        }
        
        for pattern, replacement in contractions.items():
            text = re.sub(pattern, replacement, text)
        
        # Remove punctuation but keep spaces
        text = re.sub(r'[^\w\s]', ' ', text)
        
        # Collapse multiple spaces
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()
    
    # Topic conflict policies: define allowed/denied topics per forced intent
    TOPIC_POLICIES = {
        'breakup_intimacy_loss': {
            'allow': {'breakup_intimacy_loss', 'breakup_grief', 'breakup', 'heartbreak'},
            'deny': {'unlovable', 'lust_vs_love', 'future_mismatch', 'different_futures', 'relationship_intimacy_concerns'},
        },
        'breakup_grief': {
            'allow': {'breakup_grief', 'heartbreak', 'breakup'},
            'deny': {'unlovable', 'relationship_intimacy_concerns'},
        },
        'relationship_intimacy_concerns': {
            'allow': {'relationship_intimacy_concerns', 'marriage_strain', 'communication'},
            'deny': {'breakup_intimacy_loss', 'breakup_grief', 'breakup'},
        },
        'heartbreak_general': {
            'allow': {'heartbreak_general'},
            'deny': {'breakup_grief', 'breakup_intimacy_loss', 'breakup'},
        },
    }
    
    # Explicit mention gates: topics that require explicit user statements
    EXPLICIT_MENTION_GATES = {
        'unlovable': ['unlovable', 'not lovable', 'no one will love me', 'worthless', 'feel unlovable', 'i am unlovable', 'im unlovable'],
        'lust_vs_love': ['lust or love', 'attraction or love', 'just lust', 'sexual chemistry'],
    }
    
    # Comprehensive topic keywords
    # HIGH PRIORITY topics (checked first, override others)
    HIGH_PRIORITY_TOPICS = {
        'breakup_intimacy_loss': [
            # Missing sex/intimacy with ex
            'miss our sex', 'miss our sex life', 'miss the sex', 'miss having sex',
            'miss the way we', 'miss how we', 'miss the way i and my ex',
            'miss the way me and my ex', 'miss the way my ex and i',
            'miss our intimacy', 'miss the intimacy', 'miss the physical',
            'miss the physical connection', 'miss the chemistry',
            'miss our chemistry', 'miss the way we connected',
            'miss our connection', 'miss the closeness',
            'missing sex with my ex', 'missing intimacy with ex',
            'missing the way we had sex', 'missing how we had sex',
            'i miss our sex', 'i miss the sex', 'i miss having sex',
            'i miss the way we did', 'i miss how we did',
            'missing the sex life', 'missing our sex life',
            'miss the physical intimacy', 'miss our physical intimacy',
        ],
        'breakup_grief': [
            'heartbroken', 'heartbreak', 'broken heart',
            'grieving the breakup', 'grieving the loss',
            'still grieving', 'grieving our breakup',
        ],
    }
    
    TOPIC_KEYWORDS = {
        'heartbreak': ['heartbreak', 'heartbroken', 'broken heart', 'breakup', 'broke up', 'ended things', 'dumped', 'left me'],
        'breakup': ['breakup', 'broke up', 'breaking up', 'ended', 'split up', 'separated'],
        'breakup_grief': ['heartbroken', 'heartbreak', 'broken heart', 'grieving', 'grieving the breakup', 'grieving the loss', 'still grieving'],
        'breakup_intimacy_loss': [
            'miss our sex', 'miss our sex life', 'miss the sex', 'miss having sex',
            'miss the way we', 'miss how we', 'miss the way i and my ex',
            'miss our intimacy', 'miss the intimacy', 'miss the physical',
            'miss the physical connection', 'miss the chemistry',
            'missing sex with my ex', 'missing intimacy with ex',
        ],
        # NEW: Heartbreak NOT explicitly about breakup
        'heartbreak_general': ['heartbroken', 'heartbreak', 'broken heart'],
        # NEW: Intimacy concerns in CURRENT relationship (no breakup/ex signal)
        'relationship_intimacy_concerns': [
            'miss our sex life', 'miss our sex', 'miss the sex', 'miss having sex',
            'miss our intimacy', 'miss the intimacy', 'miss the physical',
            'miss the physical connection', 'missing sex life', 'missing our sex',
        ],
        # NEW: Partner withdrawing/pulling away
        'partner_withdrawing': [
            'no longer gives attention', 'ignores messages', 'leaves unread', 'doesn\'t pick calls',
            'used to call', 'used to text', 'now opposite', 'pulling away', 'distant',
            'leaves my messages unread', 'doesn\'t pick my calls', 'ignoring me',
            'not responding', 'not calling back', 'stopped calling', 'stopped texting',
        ],
        'cheating': ['cheating', 'cheated', 'affair', 'infidelity', 'unfaithful', 'seeing someone else', 'caught them'],
        'cheating_self': ['i cheated', 'i had an affair', 'i was unfaithful', 'i kissed someone', 'i slept with'],
        'divorce': ['divorce', 'divorcing', 'getting divorced', 'filing for divorce', 'separated legally'],
        'separation': ['separated', 'separating', 'living apart', 'trial separation'],
        'marriage': ['marriage', 'married', 'husband', 'wife', 'spouse'],
        'marriage_strain': ['marriage is hard', 'marriage problems', 'marriage struggling', 'distant from spouse'],
        'talking_stage': ['talking stage', 'just talking', 'getting to know', 'texting', 'not official'],
        'situationship': ['situationship', 'undefined', 'unclear', 'what are we', 'no label', 'complicated'],
        'lust_vs_love': ['lust or love', 'attraction or love', 'physical chemistry', 'just lust', 'sexual chemistry'],
        'pretense': ['not myself', 'pretending', 'fake', 'putting on act', 'hiding who i am', 'cant be authentic'],
        'jealousy': ['jealous', 'jealousy', 'envious', 'insecure about', 'comparing myself'],
        'trust': ['trust', 'dont trust', 'trust issues', 'cant trust', 'trusting'],
        'loneliness': ['lonely', 'alone', 'isolated', 'no one', 'by myself', 'feel alone'],
        'unlovable': ['unlovable', 'nobody loves me', 'nobody wants me', 'something wrong with me', 'not worthy'],
        'fights': ['fight', 'fighting', 'argue', 'arguing', 'argument', 'conflict'],
        'communication': ['communication', 'talk', 'talking', 'communicate', 'not listening', 'dont listen'],
        'past': ['past relationship', 'my past', 'my ex', 'previous relationship', 'keeps happening'],
        'patterns': ['same mistakes', 'same type', 'pattern', 'always', 'keep choosing', 'repeating'],
        'moving_on': ['move on', 'moving on', 'get over', 'let go', 'moving forward'],
        'confused': ['confused', 'dont know', 'unsure', 'uncertain', 'mixed feelings'],
        'doubt': ['doubt', 'doubting', 'second guessing', 'questioning', 'not sure if'],
        # User-side anxiety and depression (feeling states, not diagnoses)
        'user_anxiety_distress': [
            'i have so much anxiety', 'i feel so anxious', 'constantly anxious', 'always anxious',
            'panic attacks', 'im having a panic attack', 'anxiety attacks', 'having panic',
            'anxious about my relationship', 'anxious he will leave', 'anxious she will leave',
            'anxious they will leave', 'anxiety about my partner', 'relationship anxiety',
            'im always worried', 'constant worry', 'can never relax', 'never stop worrying',
            'my heart races', 'cant stop thinking', 'overthinking everything', 'overthinking',
            'anxiety is killing me', 'anxiety is overwhelming', 'drowning in anxiety',
            'anxiety is ruining', 'anxiety controls me', 'cant control my anxiety',
            'on edge all the time', 'always on edge', 'constantly on edge',
            'anxious when we fight', 'anxious when they dont text', 'anxious about commitment',
            'fear of abandonment', 'afraid they will leave', 'scared they will leave',
            'nervous about relationships', 'relationship makes me anxious', 'dating anxiety'
        ],
        'user_depression_distress': [
            'i feel so depressed', 'i feel depressed since', 'depressed all the time', 'always depressed',
            'dont want to get out of bed', 'cant get out of bed', 'cant function', 'barely functioning',
            'feel empty and numb', 'numb all the time', 'dont feel anything', 'cant feel anything',
            'life feels pointless', 'nothing matters anymore', 'whats the point', 'no point to anything',
            'dont see the point', 'no motivation', 'lost all motivation', 'zero motivation',
            'dont enjoy anything', 'nothing brings me joy', 'cant feel happy', 'nothing makes me happy',
            'heavy and empty', 'feeling heavy', 'everything feels heavy', 'constant heaviness',
            'depressed since the breakup', 'depressed after breakup', 'breakup depression',
            'dont want to do anything', 'cant do anything', 'no energy for anything',
            'feel hopeless about love', 'hopeless about relationships', 'no hope for love',
            'relationship depression', 'depressed about my relationship', 'marriage depression'
        ],
    }
    
    # Emotion keywords
    EMOTION_KEYWORDS = {
        'sad': ['sad', 'depressed', 'down', 'miserable', 'unhappy', 'crying'],
        'hurt': ['hurt', 'hurting', 'wounded', 'pain', 'painful'],
        'angry': ['angry', 'mad', 'furious', 'rage', 'pissed', 'hate'],
        'anxious': ['anxious', 'anxiety', 'worried', 'nervous', 'stress', 'panic'],
        'confused': ['confused', 'dont understand', 'makes no sense', 'lost', 'unclear'],
        'lonely': ['lonely', 'alone', 'isolated', 'abandoned', 'empty'],
        'jealous': ['jealous', 'envious', 'insecure'],
        'guilty': ['guilty', 'guilt', 'ashamed', 'shame', 'regret'],
        'betrayed': ['betrayed', 'betrayal', 'lied to', 'deceived'],
        'overwhelmed': ['overwhelmed', 'too much', 'cant handle', 'drowning'],
        'frustrated': ['frustrated', 'frustrating', 'annoyed', 'fed up'],
        'hopeless': ['hopeless', 'no hope', 'pointless', 'never', 'impossible'],
        'scared': ['scared', 'afraid', 'fear', 'terrified', 'frightened'],
        'tired': ['tired', 'exhausted', 'drained', 'worn out', 'burnt out'],
        'stuck': ['stuck', 'trapped', 'cant move', 'frozen'],
        'unworthy': ['not good enough', 'not worthy', 'dont deserve', 'inadequate'],
    }
    
    @classmethod
    def detect_topics(cls, text: str, context_topics: Optional[List[str]] = None) -> List[str]:
        """
        Detect topics from user message with priority-based routing and deterministic ordering.
        
        Process:
        1. Normalize text (lowercase, contractions, punctuation)
        2. Check HIGH_PRIORITY topics with dual-signal detection
        3. Check regular TOPIC_KEYWORDS
        4. Apply topic whitelist guardrails
        5. Return topics in deterministic order (high-priority first)
        """
        # Normalize text for better matching
        normalized_text = cls.normalize_text(text)
        text_lower = normalized_text.lower()
        
        detected = set()
        high_priority_detected = []
        
        # Step 1: Check HIGH_PRIORITY topics with dual-signal requirements
        # Expanded breakup signals to catch more variations
        breakup_signals = [
            'ex', 'my ex', 'your ex', 'the ex', 'with ex', 'with my ex', 'with your ex',
            'breakup', 'broke up', 'breaking up', 'ended things', 'dumped', 'left me',
            'after we broke up', 'since the breakup', 'since we broke up', 'after breakup',
            'previous relationship', 'past relationship', 'former partner'
        ]
        # Expanded intimacy signals to catch more variations (including grammatically unusual but clear messages)
        intimacy_signals = [
            'sex life', 'miss sex', 'miss our sex', 'miss the sex', 'miss having sex',
            'intimacy', 'physical connection', 'chemistry', 'miss the way we', 'miss how we',
            'miss the way i and', 'miss the way me and', 'miss how me and', 'miss how i and',
            'miss the way we do', 'miss how we do', 'miss the way we did', 'miss how we did',
            'miss the way we have', 'miss how we have', 'miss the way we had', 'miss how we had',
            'miss our intimacy', 'miss the intimacy', 'miss the physical', 'miss our physical',
            'miss the physical connection', 'miss the chemistry', 'miss our chemistry',
            'miss the way we connected', 'miss our connection', 'miss the closeness',
            'missing sex', 'missing intimacy', 'missing the sex', 'missing our sex',
            'nice time', 'our nice time', 'the nice time',  # Catch "miss our nice time our sex life"
            'do have sex', 'we do have sex', 'how we do have sex', 'the way we do have sex',
            'time to time', 'have time to time', 'sex we have time to time'  # Catch "the sex we have time to time"
        ]
        heartbreak_words = ['heartbroken', 'heartbreak', 'broken heart', 'my heart is broken', 'heart is broken']
        
        is_breakup = any(signal in text_lower for signal in breakup_signals)
        is_intimacy = any(signal in text_lower for signal in intimacy_signals)
        is_heartbreak = any(kw in text_lower for kw in heartbreak_words)
        
        # Also check context_topics for breakup signals (if previous messages mentioned breakup/ex)
        # This allows us to detect breakup_intimacy_loss even if current message doesn't say "ex"
        if context_topics:
            context_lower = ' '.join(context_topics).lower()
            # Check if any context topic is breakup-related
            breakup_context_topics = ['breakup', 'breakup_grief', 'breakup_intimacy_loss', 'ex']
            if any(ct in context_topics for ct in breakup_context_topics):
                is_breakup = True  # Use context to infer breakup if not explicitly stated
                logger.info(f"[TopicDetection] Using context to infer breakup signal from context_topics: {context_topics}")
        
        # breakup_intimacy_loss requires BOTH breakup/ex signal AND intimacy signal
        if is_breakup and is_intimacy:
            high_priority_detected.append('breakup_intimacy_loss')
            detected.add('breakup_intimacy_loss')
            logger.info(f"[TopicDetection] HIGH PRIORITY topic detected: breakup_intimacy_loss (dual-signal: breakup={is_breakup}, intimacy={is_intimacy}, normalized text: {normalized_text[:100]})")
        
        # breakup_grief requires BOTH heartbreak word AND breakup signal
        if is_heartbreak and is_breakup:
            high_priority_detected.append('breakup_grief')
            detected.add('breakup_grief')
            logger.info(f"[TopicDetection] HIGH PRIORITY topic detected: breakup_grief (dual-signal: heartbreak={is_heartbreak}, breakup={is_breakup}, normalized text: {normalized_text[:100]})")
        
        # heartbreak_general: heartbreak WITHOUT breakup signal
        if is_heartbreak and not is_breakup:
            high_priority_detected.append('heartbreak_general')
            detected.add('heartbreak_general')
            logger.info(f"[TopicDetection] HIGH PRIORITY topic detected: heartbreak_general (heartbreak without breakup signal, normalized text: {normalized_text[:100]})")
        
        # relationship_intimacy_concerns: intimacy signal WITHOUT breakup/ex signal
        if is_intimacy and not is_breakup:
            high_priority_detected.append('relationship_intimacy_concerns')
            detected.add('relationship_intimacy_concerns')
            logger.info(f"[TopicDetection] HIGH PRIORITY topic detected: relationship_intimacy_concerns (intimacy without breakup signal, normalized text: {normalized_text[:100]})")
        
        # Step 2: Check regular topics (always check, but high-priority takes precedence)
        for topic, keywords in cls.TOPIC_KEYWORDS.items():
            # Skip if already detected as high-priority (avoid duplicates)
            if topic not in high_priority_detected:
                # Skip topics that require dual-signal detection (handled in Step 1)
                if topic in ['breakup_intimacy_loss', 'breakup_grief', 'heartbreak_general', 'relationship_intimacy_concerns']:
                    continue
                if any(keyword in text_lower for keyword in keywords):
                    detected.add(topic)
        
        # Step 3: Add context topics if still relevant (and not conflicting)
        if context_topics:
            for topic in context_topics:
                if topic in cls.TOPIC_KEYWORDS:
                    keywords = cls.TOPIC_KEYWORDS[topic]
                    if any(keyword in text_lower for keyword in keywords[:3]):
                        detected.add(topic)
        
        # Step 4: Apply guardrails - prevent wrong topics when specific intent detected
        detected = cls._apply_topic_guardrails(detected, text_lower, high_priority_detected)
        
        # Step 5: Return in deterministic order (high-priority first, then sorted rest)
        result = []
        for t in high_priority_detected:
            result.append(t)
        for t in sorted(detected - set(high_priority_detected)):
            result.append(t)
        
        if not result:
            result = ['general']
        
        logger.info(f"[TopicDetection] Final topics (ordered): {result} (from normalized: {normalized_text[:100]})")
        return result
    
    @classmethod
    def _apply_topic_guardrails(cls, detected: set, text_lower: str, high_priority: List[str]) -> set:
        """
        Apply guardrails to prevent wrong topic blocks.
        
        Rules:
        - If breakup_intimacy_loss detected, remove unrelated topics like 'unlovable', 'lust_vs_love' (unless explicitly stated)
        - If breakup_grief detected, remove 'unlovable' unless user explicitly says they feel unlovable
        - If breakup context, prioritize breakup-related topics
        """
        filtered = detected.copy()
        
        # If breakup_intimacy_loss is detected, remove conflicting topics
        if 'breakup_intimacy_loss' in detected or 'breakup_intimacy_loss' in high_priority:
            # Remove 'unlovable' unless explicitly stated
            if 'unlovable' in filtered:
                explicit_mentions = cls.EXPLICIT_MENTION_GATES.get('unlovable', [])
                if not any(mention in text_lower for mention in explicit_mentions):
                    filtered.discard('unlovable')
                    logger.info("[TopicGuardrail] Removed 'unlovable' - not explicitly stated, breakup_intimacy_loss context")
            
            # Remove 'lust_vs_love' - not relevant when missing ex
            if 'lust_vs_love' in filtered:
                filtered.discard('lust_vs_love')
                logger.info("[TopicGuardrail] Removed 'lust_vs_love' - not relevant for breakup_intimacy_loss")
        
        # If breakup_grief detected, remove 'unlovable' unless explicitly stated
        if 'breakup_grief' in detected or 'heartbreak' in detected or 'breakup' in detected:
            if 'unlovable' in filtered:
                explicit_mentions = cls.EXPLICIT_MENTION_GATES.get('unlovable', [])
                if not any(mention in text_lower for mention in explicit_mentions):
                    filtered.discard('unlovable')
                    logger.info("[TopicGuardrail] Removed 'unlovable' - not explicitly stated, breakup context")
        
        return filtered
    
    @classmethod
    def detect_emotions(cls, text: str, embedding: Optional[np.ndarray] = None) -> List[str]:
        """Detect emotions from user message using normalized text."""
        normalized_text = cls.normalize_text(text)
        text_lower = normalized_text.lower()
        detected = {}
        
        for emotion, keywords in cls.EMOTION_KEYWORDS.items():
            # Count keyword matches
            matches = sum(1 for keyword in keywords if keyword in text_lower)
            if matches > 0:
                detected[emotion] = matches
        
        # Return top 3 emotions by match count
        if detected:
            sorted_emotions = sorted(detected.items(), key=lambda x: x[1], reverse=True)
            return [emotion for emotion, _ in sorted_emotions[:3]]
        
        return ['neutral']


# ============================================
# BLOCK SELECTOR
# ============================================

class BlockSelector:
    """Select response blocks with semantic matching + anti-repetition."""
    
    def __init__(self, supabase, embedding_model):
        self.supabase = supabase
        self.embedding_model = embedding_model
    
    def select_block(
        self,
        block_type: str,
        question_embedding: np.ndarray,
        topics: List[str],
        emotions: List[str],
        stage: int,
        recent_block_ids: List[str],
        min_similarity: float = 0.3,
        normalized_text: str = ""
    ) -> Optional[ResponseBlock]:
        """
        Select best matching block with anti-repetition.
        
        Process:
        1. Fetch candidate blocks matching block_type and stage
        2. Filter by topic overlap (prefer matching topics)
        3. Compute semantic similarity
        4. Penalize recently used blocks
        5. Return highest scoring block above threshold
        """
        try:
            # Fetch candidate blocks (only those with embeddings)
            # Use .is_() with 'not_null' value (embedding IS NOT NULL)
            query = self.supabase.table("amora_response_blocks") \
                .select("*") \
                .eq("block_type", block_type) \
                .eq("stage", stage) \
                .eq("active", True) \
                .is_("embedding", "not_null")
            
            response = query.execute()
            
            logger.info(f"Query for {block_type} stage {stage}: found {len(response.data) if response.data else 0} blocks")
            
            if not response.data:
                # Try adjacent stages if exact stage has no blocks
                for adjacent_stage in [stage - 1, stage + 1]:
                    if 1 <= adjacent_stage <= 4:
                        response = self.supabase.table("amora_response_blocks") \
                            .select("*") \
                            .eq("block_type", block_type) \
                            .eq("stage", adjacent_stage) \
                            .eq("active", True) \
                            .is_("embedding", "not_null") \
                            .execute()
                        logger.info(f"Trying adjacent stage {adjacent_stage}: found {len(response.data) if response.data else 0} blocks")
                        if response.data:
                            break
            
            if not response.data:
                logger.warning(f"No blocks found for type={block_type}, stage={stage}")
                return None
            
            # Convert to ResponseBlock objects
            candidates = []
            for block_data in response.data:
                # Debug: Check what we got
                has_embedding = block_data.get('embedding') is not None
                has_text = bool(block_data.get('text'))
                text_length = len(block_data.get('text', ''))
                
                logger.info(f"Block {block_data.get('id', 'unknown')[:8]}: has_embedding={has_embedding}, has_text={has_text}, text_length={text_length}")
                
                if block_data.get('embedding'):
                    # Parse embedding (may be string or list)
                    embedding_data = block_data['embedding']
                    if isinstance(embedding_data, str):
                        import json
                        embedding_data = json.loads(embedding_data)
                    
                    candidates.append(ResponseBlock(
                        id=block_data['id'],
                        block_type=block_data['block_type'],
                        text=block_data['text'],
                        topics=block_data.get('topics', []),
                        emotions=block_data.get('emotions', []),
                        stage=block_data['stage'],
                        priority=block_data.get('priority', 50),
                        embedding=np.array(embedding_data)
                    ))
                else:
                    logger.warning(f"Block {block_data.get('id', 'unknown')[:8]} filtered out: no embedding")
            
            if not candidates:
                logger.warning(f"No blocks with embeddings for type={block_type}")
                return None
            
            # Score each candidate
            # Extract context topics from state if available (for linking bonus)
            context_topics = getattr(self, '_context_topics', None)
            
            scored_blocks = []
            for block in candidates:
                score = self._score_block(
                    block,
                    question_embedding,
                    topics,
                    emotions,
                    recent_block_ids,
                    context_topics=context_topics
                )
                scored_blocks.append((block, score))
            
            # Sort by score descending
            scored_blocks.sort(key=lambda x: x[1], reverse=True)
            
            # Apply topic policy filtering at block selection time
            scored_blocks = self._apply_block_selection_filtering(
                scored_blocks,
                topics,
                normalized_text=normalized_text
            )
            
            # Use weighted random selection from top-K candidates
            selected_block = self._weighted_random_choice(scored_blocks, min_similarity)
            
            if selected_block:
                # Find the score for logging
                selected_score = next((score for block, score in scored_blocks if block.id == selected_block.id), 0.0)
                # Enhanced debug logging
                forced_topic = topics[0] if topics else 'none'
                logger.info(f"[BlockSelection] normalized_text={normalized_text[:100] if normalized_text else 'N/A'}")
                logger.info(f"[BlockSelection] forced_topic={forced_topic}")
                logger.info(f"[BlockSelection] selected_block_id={selected_block.id[:8]}")
                logger.info(f"[BlockSelection] selected_block_topic={selected_block.topics}")
                logger.info(f"[BlockSelection] similarity_score={selected_score:.3f}")
                logger.info(f"[BlockSelection] Selected {block_type} block: id={selected_block.id[:8]}, score={selected_score:.3f}, topics={selected_block.topics}, text_preview={selected_block.text[:80]}...")
                return selected_block
            
            # Fallback: return best block if weighted selection failed
            best_block, best_score = scored_blocks[0]
            logger.warning(f"Fallback to best {block_type} block: score={best_score:.3f}")
            return best_block
        
        except Exception as e:
            logger.error(f"Error selecting block: {e}", exc_info=True)
            return None
    
    def _apply_block_selection_filtering(
        self,
        scored_blocks: List[tuple[ResponseBlock, float]],
        topics: List[str],
        normalized_text: str = ""
    ) -> List[tuple[ResponseBlock, float]]:
        """
        Apply topic policy filtering at block selection time.
        
        When a high-priority topic is detected, restrict eligible blocks to allowed topics
        and block denied topics unless explicitly mentioned.
        """
        if not topics:
            return scored_blocks
        
        forced_topic = topics[0]  # First topic is the forced/high-priority one
        policy = TopicEmotionDetector.TOPIC_POLICIES.get(forced_topic)
        
        if not policy:
            # No policy for this topic, allow all blocks
            return scored_blocks
        
        allowed_topics = policy.get('allow', set())
        denied_topics = policy.get('deny', set())
        text_lower = normalized_text.lower() if normalized_text else ""
        
        # Check if detected topics include breakup-related topics
        breakup_related_topics = {'breakup_grief', 'breakup_intimacy_loss', 'breakup'}
        has_breakup_topic = bool(set(topics) & breakup_related_topics)
        
        filtered_blocks = []
        for block, score in scored_blocks:
            # Defensive: handle None or empty topics
            block_topics = set(block.topics or [])
            
            # BLOCK TEXT VALIDATION: Filter out blocks with "ex"/"breakup" if user hasn't mentioned them
            # Check for breakup/ex language in block text (more specific patterns)
            breakup_phrases_in_block = [
                'with an ex', 'with your ex', 'with my ex', 'with the ex',
                'your ex', 'my ex', 'the ex',
                'breakup', 'broke up', 'ended things', 'after the breakup',
                'since the breakup', 'since we broke up'
            ]
            breakup_keywords_in_block = any(phrase in block.text.lower() for phrase in breakup_phrases_in_block)
            
            # Check if user mentioned breakup/ex in current message
            breakup_keywords_in_user = any(kw in text_lower for kw in [
                'ex', 'my ex', 'your ex', 'the ex',
                'breakup', 'broke up', 'breaking up', 'ended things', 
                'dumped', 'left me', 'after we broke up', 'since the breakup'
            ])
            
            # CRITICAL: Filter out blocks with breakup/ex language if:
            # 1. Block text contains breakup/ex phrases AND
            # 2. User didn't mention breakup/ex in current message AND
            # 3. Detected topics don't include breakup-related topics
            if breakup_keywords_in_block and not breakup_keywords_in_user and not has_breakup_topic:
                logger.warning(f"[BlockFilter] FILTERED OUT block {block.id[:8]} - contains breakup/ex language but user didn't mention breakup and no breakup topic detected. Block text: '{block.text[:100]}...' User text: '{normalized_text[:100]}...' Detected topics: {topics}")
                continue
            
            # Check if block has any denied topics
            has_denied = bool(block_topics & denied_topics)
            if has_denied:
                # Check explicit mention gates for denied topics
                should_allow = False
                for denied_topic in (block_topics & denied_topics):
                    explicit_mentions = TopicEmotionDetector.EXPLICIT_MENTION_GATES.get(denied_topic, [])
                    if any(mention in text_lower for mention in explicit_mentions):
                        should_allow = True
                        logger.info(f"[BlockFilter] Allowing block with denied topic '{denied_topic}' - explicit mention detected")
                        break
                
                if not should_allow:
                    logger.info(f"[BlockFilter] Filtered out block {block.id[:8]} - contains denied topics: {list(block_topics & denied_topics)}")
                    continue
            
            # Check if block has any allowed topics (if allowlist exists)
            if allowed_topics:
                has_allowed = bool(block_topics & allowed_topics)
                if not has_allowed:
                    logger.info(f"[BlockFilter] Filtered out block {block.id[:8]} - no allowed topics, has: {list(block_topics)}")
                    continue
            
            # Block passes filtering
            filtered_blocks.append((block, score))
        
        if not filtered_blocks:
            # Fallback: if filtering removed all blocks, return original (safety)
            logger.warning(f"[BlockFilter] All blocks filtered out for forced_topic={forced_topic}, using original list")
            return scored_blocks
        
        logger.info(f"[BlockFilter] Filtered {len(scored_blocks)} -> {len(filtered_blocks)} blocks for forced_topic={forced_topic}")
        return filtered_blocks
    
    def _weighted_random_choice(
        self,
        scored_blocks: List[tuple[ResponseBlock, float]],
        min_similarity: float
    ) -> Optional[ResponseBlock]:
        """
        Choose a block randomly from top-K candidates, weighted by score.
        
        Higher scores = higher probability of selection.
        This adds variation while maintaining quality.
        
        Args:
            scored_blocks: List of (block, score) tuples, sorted descending by score
            min_similarity: Minimum score threshold
            
        Returns:
            Selected block, or None if no valid candidates
        """
        if not scored_blocks:
            return None
        
        # Get top-K candidates
        top_k = scored_blocks[:TOP_K_CANDIDATES]
        
        # Filter by minimum similarity
        valid_candidates = [(block, score) for block, score in top_k if score >= min_similarity]
        
        # If no candidates above threshold, use all top-K (safety fallback)
        if not valid_candidates:
            valid_candidates = top_k
        
        # If only one candidate, return it
        if len(valid_candidates) == 1:
            return valid_candidates[0][0]
        
        # Extract blocks and scores
        blocks = [block for block, score in valid_candidates]
        scores = [score for block, score in valid_candidates]
        
        # Normalize scores to positive weights
        min_score = min(scores)
        if min_score < 0:
            # Shift all scores to be positive
            scores = [s - min_score + 0.01 for s in scores]
        
        # Handle case where all scores are identical or very close
        if max(scores) - min(scores) < 0.001:
            # Uniform random choice
            return random.choice(blocks)
        
        # Weighted random choice
        # Use exponential weighting to emphasize higher scores
        # but still give lower-scored blocks a chance
        weights = [s ** 1.5 for s in scores]  # Moderate exponential weighting
        
        try:
            selected = random.choices(blocks, weights=weights, k=1)[0]
            return selected
        except (ValueError, IndexError) as e:
            logger.warning(f"Weighted random choice failed: {e}, falling back to uniform choice")
            return random.choice(blocks)
    
    def _score_block(
        self,
        block: ResponseBlock,
        question_embedding: np.ndarray,
        topics: List[str],
        emotions: List[str],
        recent_block_ids: List[str],
        context_topics: Optional[List[str]] = None
    ) -> float:
        """
        Score a block based on multiple factors.
        
        Factors:
        - Semantic similarity (0-1)
        - Topic overlap (0-0.3 bonus)
        - Linking bonus: if block has multiple topics matching current + context (0-0.4 bonus)
        - Emotion overlap (0-0.2 bonus)
        - Priority (normalized 0-0.1 bonus)
        - Repetition penalty (-0.5 if recently used)
        """
        # Semantic similarity
        similarity = cosine_similarity(
            [question_embedding],
            [block.embedding]
        )[0][0]
        
        score = similarity
        
        # Topic overlap bonus
        topic_overlap = len(set(topics) & set(block.topics))
        if topic_overlap > 0:
            score += min(topic_overlap * 0.15, 0.3)
        
        # LINKING BONUS: If block has multiple topics matching current + context topics
        # This prioritizes linking blocks when session continuity is present
        if context_topics and len(block.topics) > 1:
            current_topics_set = set(topics)
            context_topics_set = set(context_topics)
            block_topics_set = set(block.topics)
            
            # Check if block has topics from BOTH current and context
            has_current_topic = bool(block_topics_set & current_topics_set)
            has_context_topic = bool(block_topics_set & context_topics_set)
            
            if has_current_topic and has_context_topic:
                # Strong bonus for linking blocks (0.3-0.4)
                linking_bonus = 0.3 + (len(block_topics_set & (current_topics_set | context_topics_set)) * 0.05)
                score += min(linking_bonus, 0.4)
                logger.info(f"[BlockScoring] Linking bonus applied: +{min(linking_bonus, 0.4):.3f} (block topics: {block.topics}, current: {topics}, context: {context_topics})")
        
        # Emotion overlap bonus
        emotion_overlap = len(set(emotions) & set(block.emotions))
        if emotion_overlap > 0:
            score += min(emotion_overlap * 0.1, 0.2)
        
        # Priority bonus (normalize 0-100 to 0-0.1)
        score += (block.priority / 100) * 0.1
        
        # Repetition penalty
        if block.id in recent_block_ids:
            # Stronger penalty for more recent usage
            recency_index = recent_block_ids.index(block.id)
            penalty = 0.5 * (1 - recency_index / len(recent_block_ids))
            score -= penalty
        
        return score


# ============================================
# RESPONSE COMPOSER
# ============================================

class ResponseComposer:
    """Compose final responses from blocks with personalization."""
    
    @classmethod
    def compose(
        cls,
        reflection: Optional[ResponseBlock],
        normalization: Optional[ResponseBlock],
        exploration: Optional[ResponseBlock],
        reframe: Optional[ResponseBlock],
        state: ConversationState
    ) -> str:
        """
        Compose final response from blocks.
        
        Typical structure:
        - reflection + normalization + exploration
        - Sometimes: reflection + reframe + exploration
        - Rarely: reflection + normalization + reframe + exploration (stage 3+)
        """
        parts = []
        
        # Always start with reflection if available
        if reflection:
            parts.append(cls._personalize(reflection.text, state))
        
        # Add normalization or reframe (prefer normalization for stage 1-2)
        if state.turn_count <= 4 or state.topic_stages.get(state.active_topics[0] if state.active_topics else 'general', 1) <= 2:
            if normalization:
                parts.append(cls._personalize(normalization.text, state))
        else:
            # Stage 3+: occasionally use reframe
            if reframe and random.random() < 0.4:
                parts.append(cls._personalize(reframe.text, state))
            elif normalization:
                parts.append(cls._personalize(normalization.text, state))
        
        # Always end with exploration if available
        if exploration:
            exploration_text = cls._personalize(exploration.text, state)
            # Optionally inject user phrase
            if '{user_phrase}' in exploration_text and state.last_user_phrase:
                exploration_text = exploration_text.replace('{user_phrase}', state.last_user_phrase)
            parts.append(exploration_text)
        
        # Join with spaces
        return ' '.join(parts)
    
    @classmethod
    def _personalize(cls, text: str, state: ConversationState) -> str:
        """Replace template variables with personalized values."""
        # Partner label
        if '{partner_label}' in text:
            label = state.partner_label or 'partner'
            text = text.replace('{partner_label}', label)
        
        # Relationship status
        if '{relationship_status}' in text:
            status = state.relationship_status or 'relationship'
            text = text.replace('{relationship_status}', status)
        
        # User name
        if '{user_name}' in text:
            name = state.user_name or 'you'
            text = text.replace('{user_name}', name)
        
        return text


# ============================================
# MAIN SERVICE
# ============================================

class AmoraBlocksService:
    """
    LLM-like relationship coach using block-based architecture.
    100% local, no external AI APIs.
    """
    
    def __init__(self):
        self.supabase = get_supabase_client()
        self._embedding_model = None  # Lazy load to prevent OOM on startup
        self.block_selector = BlockSelector(self.supabase, self)
        self.detector = TopicEmotionDetector()
        self.crisis_detector = CrisisDetector()
        
        # In-memory session storage (use Redis in production)
        self._sessions: Dict[str, ConversationState] = {}
    
    @property
    def embedding_model(self):
        """Lazy load embedding model."""
        if self._embedding_model is None:
            self._embedding_model = get_embedding_model()
        return self._embedding_model
    
    def get_blocks_count(self) -> int:
        """Get count of blocks with embeddings for health check."""
        try:
            response = self.supabase.table('amora_response_blocks') \
                .select('id', count='exact') \
                .is_('embedding', 'not_null') \
                .eq('active', True) \
                .execute()
            
            return response.count if hasattr(response, 'count') else 0
        except Exception as e:
            logger.error(f"Error counting blocks: {e}")
            return 0
    
    def get_response(
        self,
        request: CoachRequest,
        user_id: UUID,
        coach_session_id: Optional[UUID] = None
    ) -> CoachResponse:
        """
        Generate LLM-like response using block architecture.
        
        Process:
        1. Load/init conversation state
        2. Detect topics & emotions
        3. Determine stage for active topics
        4. Select blocks (reflection + normalization + exploration)
        5. Compose final response with personalization
        6. Update state (anti-repetition, stage progression)
        """
        try:
            # Use coach_session_id if provided, otherwise fall back to session_id (legacy)
            session_key = str(coach_session_id) if coach_session_id else request.session_id
            # Load conversation state keyed by (user_id, coach_session_id)
            state = self._load_state(user_id, session_key, request.context, coach_session_id)
            
            question = (request.specific_question or "").strip()
            
            # Handle empty input
            if not question or len(question) < 3:
                return self._handle_empty_input(state)
            
            # CRISIS DETECTION - Check BEFORE normal processing (highest priority)
            crisis_intent = self.crisis_detector.detect_crisis_intent(question)
            if crisis_intent:
                logger.warning(f"🚨 CRISIS detected - short-circuiting normal pipeline. Intent: {crisis_intent}, user_id={user_id}, session_id={coach_session_id}")
                crisis_message = get_crisis_response()
                
                # Log crisis detection for safety audit
                if coach_session_id:
                    try:
                        from app.services.amora_session_service import AmoraSessionService
                        session_service = AmoraSessionService()
                        # Save crisis message with special metadata
                        session_service.save_message(
                            session_id=coach_session_id,
                            sender="amora",
                            message_text=crisis_message,
                            metadata={
                                "is_crisis": True,
                                "crisis_intent": crisis_intent,
                                "engine": "crisis_response"
                            }
                        )
                    except Exception as e:
                        logger.error(f"Failed to save crisis message: {e}")
                
                # Return crisis response (bypasses normal block generation)
                return CoachResponse(
                    message=crisis_message,
                    mode=CoachMode.LEARN,
                    confidence=1.0,  # High confidence on crisis response
                    referenced_data={
                        'is_crisis': True,
                        'intent': crisis_intent,
                        'topics': [],  # No topic analysis for crisis
                        'emotions': [],
                    },
                    engine='crisis_response',
                    response_style=None,  # No style for crisis
                    coach_session_id=coach_session_id,
                    is_crisis=True,  # Explicit flag
                    crisis_intent=crisis_intent,  # Explicit intent
                )
            
            # Generate embedding
            question_embedding = self.embedding_model.encode(question)
            
            # Detect topics and emotions
            # Use previous topics from state as context for better continuity
            context_topics = state.active_topics[:3] if state.active_topics else []
            if request.context and request.context.get('topics'):
                # Merge request context topics with state topics
                context_topics = list(set(context_topics + request.context.get('topics', [])))
            
            normalized_question = self.detector.normalize_text(question)
            topics = self.detector.detect_topics(question, context_topics)
            emotions = self.detector.detect_emotions(question, question_embedding)
            
            logger.info(f"[AmoraBlocks] User message: '{question[:100]}'")
            logger.info(f"[AmoraBlocks] Normalized: '{normalized_question[:100]}'")
            logger.info(f"[AmoraBlocks] Detected topics: {topics}, emotions: {emotions}")
            
            # Update active topics and track turn counts
            for topic in topics:
                if topic not in state.active_topics:
                    state.active_topics.append(topic)
                    state.topic_stages[topic] = 1
                    state.topic_turn_counts[topic] = 0
                # Increment turn count for this topic
                state.topic_turn_counts[topic] = state.topic_turn_counts.get(topic, 0) + 1
            
            # Determine stage for primary topic
            primary_topic = topics[0] if topics else 'general'
            stage = state.topic_stages.get(primary_topic, 1)
            turn_index_for_topic = state.topic_turn_counts.get(primary_topic, 1)
            
            # Track dominant topic for style decisions
            state.current_dominant_topic = primary_topic
            
            # Extract short user phrase for exploration blocks
            state.last_user_phrase = self._extract_key_phrase(question)
            
            # Choose response style dynamically
            response_style = choose_response_style(
                user_message=question,
                topics=topics,
                emotions=emotions,
                topic_stage=stage,
                turn_index_for_topic=turn_index_for_topic,
                previous_style=state.last_response_style
            )
            
            # Get block configuration for this style
            block_config = STYLE_BLOCK_CONFIG[response_style]
            
            logger.info(f"Response style: {response_style}, config: {block_config}")
            
            # Select blocks based on style configuration
            reflection = None
            normalization = None
            exploration = None
            insight = None
            
            # Set context topics in block selector for linking bonus
            self.block_selector._context_topics = context_topics[:3] if context_topics else []
            
            # Select reflection blocks
            if block_config['reflection'] > 0:
                reflection = self.block_selector.select_block(
                    block_type='reflection',
                    question_embedding=question_embedding,
                    topics=topics,
                    emotions=emotions,
                    stage=stage,
                    recent_block_ids=state.recent_block_ids,
                    normalized_text=normalized_question  # Pass for filtering
                )
            
            # Select normalization blocks
            if block_config['normalization'] > 0:
                normalization = self.block_selector.select_block(
                    block_type='normalization',
                    question_embedding=question_embedding,
                    topics=topics,
                    emotions=emotions,
                    stage=stage,
                    recent_block_ids=state.recent_block_ids,
                    normalized_text=normalized_question  # Pass for filtering
                )
            
            # Select exploration blocks
            if block_config['exploration'] > 0:
                exploration = self.block_selector.select_block(
                    block_type='exploration',
                    question_embedding=question_embedding,
                    topics=topics,
                    emotions=emotions,
                    stage=stage,
                    recent_block_ids=state.recent_block_ids,
                    normalized_text=normalized_question  # Pass for filtering
                )
            
            # Select insight blocks for DEEPENING and GUIDANCE_SESSION
            # Note: We'll need to add 'insight' block_type to database
            # For now, use 'reframe' as insight placeholder
            reframe = None
            if block_config['insight'] > 0 and stage >= 2:
                reframe = self.block_selector.select_block(
                    block_type='reframe',
                    question_embedding=question_embedding,
                    topics=topics,
                    emotions=emotions,
                    stage=stage,
                    recent_block_ids=state.recent_block_ids,
                    normalized_text=normalized_question  # Pass for filtering
                )
            
            # Log selected blocks
            logger.info(f"Selected blocks: reflection={reflection is not None}, normalization={normalization is not None}, exploration={exploration is not None}, reframe={reframe is not None}")
            if reflection:
                logger.info(f"Reflection text length: {len(reflection.text)}, preview: {reflection.text[:50]}...")
            if normalization:
                logger.info(f"Normalization text length: {len(normalization.text)}, preview: {normalization.text[:50]}...")
            if exploration:
                logger.info(f"Exploration text length: {len(exploration.text)}, preview: {exploration.text[:50]}...")
            
            # Compose response
            message = ResponseComposer.compose(
                reflection=reflection,
                normalization=normalization,
                exploration=exploration,
                reframe=reframe,
                state=state
            )
            
            logger.info(f"Composed message length: {len(message)}, preview: {message[:100]}...")
            
            # Update state
            state.last_response_style = response_style
            self._update_state(
                state=state,
                blocks_used=[reflection, normalization, exploration, reframe],
                topics=topics,
                primary_topic=primary_topic
            )
            
            # Save state
            self._save_state(state)
            
            # Collect block IDs for metadata
            block_ids = []
            for block in [reflection, normalization, exploration, reframe]:
                if block and block.id:
                    block_ids.append(block.id)
            
            return CoachResponse(
                message=message,
                mode=CoachMode.LEARN,
                confidence=0.85,
                referenced_data={
                    'topics': topics[:3],
                    'emotions': emotions[:2],
                    'stage': stage,
                    'turn_count': state.turn_count,
                    'response_style': response_style.value,
                    'engine': 'blocks',  # Set engine here
                    'block_ids': block_ids  # Include block IDs for state reconstruction
                }
            )
        
        except Exception as e:
            logger.error(f"Error in blocks service: {e}", exc_info=True)
            return self._safe_fallback()
    
    def _load_state(
        self,
        user_id: UUID,
        session_id: Optional[str],
        context: Optional[Dict[str, Any]],
        coach_session_id: Optional[UUID] = None
    ) -> ConversationState:
        """
        Load or create conversation state.
        State is keyed by (user_id, coach_session_id) to ensure separation between sessions.
        
        If coach_session_id is provided, loads previous messages from database to rebuild state.
        """
        # Create composite key: (user_id, coach_session_id) or (user_id, session_id) for legacy
        if coach_session_id:
            key = f"{user_id}:{coach_session_id}"
        elif session_id:
            key = f"{user_id}:{session_id}"
        else:
            # Legacy: fallback to user_id only (single session per user)
            key = f"{user_id}:default"
        
        # Check in-memory cache first
        if key in self._sessions:
            state = self._sessions[key]
            state.updated_at = datetime.now()
            logger.info(f"[StateLoad] Loaded from memory: key={key}, turn_count={state.turn_count}, active_topics={state.active_topics}")
            return state
        
        # If coach_session_id provided, load from database
        if coach_session_id:
            try:
                from app.services.amora_session_service import AmoraSessionService
                session_service = AmoraSessionService()
                
                # Load recent messages from database
                recent_messages = session_service.get_recent_messages(coach_session_id, limit=20)
                
                # Rebuild state from messages
                state = ConversationState(
                    session_id=key,
                    user_id=user_id
                )
                
                # Extract topics and build conversation history from messages
                user_messages = [msg for msg in recent_messages if msg.sender == "user"]
                amora_messages = [msg for msg in recent_messages if msg.sender == "amora"]
                
                # Track topics from previous messages
                all_topics_seen = set()
                for msg in user_messages:
                    # Extract topics from message metadata if available
                    if msg.metadata and 'topics' in msg.metadata:
                        topics = msg.metadata.get('topics', [])
                        for topic in topics:
                            all_topics_seen.add(topic)
                            if topic not in state.active_topics:
                                state.active_topics.append(topic)
                                state.topic_stages[topic] = 1
                                state.topic_turn_counts[topic] = 0
                            state.topic_turn_counts[topic] = state.topic_turn_counts.get(topic, 0) + 1
                
                # Track block IDs from Amora's previous responses
                for msg in amora_messages:
                    if msg.metadata and 'block_ids' in msg.metadata:
                        block_ids = msg.metadata.get('block_ids', [])
                        for block_id in block_ids:
                            if block_id not in state.recent_block_ids:
                                state.recent_block_ids.insert(0, block_id)
                
                # Set turn count based on user messages
                state.turn_count = len(user_messages)
                
                # Extract context from session if available
                session = session_service.get_session(user_id, coach_session_id)
                if session:
                    state.relationship_status = session.primary_topic  # Can be used as context
                
                # Extract context if available from request
                if context:
                    state.relationship_status = context.get('relationship_status') or state.relationship_status
                    state.partner_label = self._infer_partner_label(context)
                
                logger.info(f"[StateLoad] Rebuilt from DB: key={key}, messages={len(recent_messages)}, turn_count={state.turn_count}, active_topics={state.active_topics}")
                
                # Cache in memory
                self._sessions[key] = state
                return state
                
            except Exception as e:
                logger.warning(f"[StateLoad] Failed to load from DB, creating new state: {e}")
                # Fall through to create new state
        
        # Create new state
        state = ConversationState(
            session_id=key,
            user_id=user_id
        )
        
        # Extract context if available
        if context:
            state.relationship_status = context.get('relationship_status')
            state.partner_label = self._infer_partner_label(context)
        
        logger.info(f"[StateLoad] Created NEW state: key={key}")
        self._sessions[key] = state
        return state
    
    def _infer_partner_label(self, context: Dict[str, Any]) -> str:
        """Infer partner label from context."""
        status = context.get('relationship_status', '').lower()
        partner_name = context.get('partner_name')
        
        if partner_name:
            return partner_name
        
        if status in ['married']:
            return 'spouse'
        elif status in ['dating', 'committed']:
            return 'partner'
        
        return 'partner'
    
    def _extract_key_phrase(self, text: str) -> Optional[str]:
        """Extract a short key phrase from user message for injection."""
        # Look for quoted text first
        quoted = re.findall(r'"([^"]+)"', text)
        if quoted:
            return quoted[0][:40]
        
        # Extract first clause (up to comma or "and")
        clauses = re.split(r'[,.]|\sand\s', text)
        if clauses and len(clauses[0]) > 10:
            return clauses[0].strip()[:40]
        
        return None
    
    def _update_state(
        self,
        state: ConversationState,
        blocks_used: List[Optional[ResponseBlock]],
        topics: List[str],
        primary_topic: str
    ):
        """Update conversation state after response."""
        # Add block IDs to recent list
        for block in blocks_used:
            if block and block.id not in state.recent_block_ids:
                state.recent_block_ids.insert(0, block.id)
        
        # Trim to max length
        if len(state.recent_block_ids) > state.max_recent_blocks:
            state.recent_block_ids = state.recent_block_ids[:state.max_recent_blocks]
        
        # Progress stage for primary topic (gradually, every 2-3 turns)
        if primary_topic in state.topic_stages:
            current_stage = state.topic_stages[primary_topic]
            if state.turn_count % 3 == 0 and current_stage < 4:
                state.topic_stages[primary_topic] = current_stage + 1
                logger.info(f"Advanced {primary_topic} to stage {current_stage + 1}")
        
        # Increment turn count
        state.turn_count += 1
        state.updated_at = datetime.now()
    
    def _save_state(self, state: ConversationState):
        """Save state to storage."""
        self._sessions[state.session_id] = state
    
    def _handle_empty_input(self, state: ConversationState) -> CoachResponse:
        """Handle empty or very short input."""
        greetings = [
            "I'm here to listen. What's been on your mind lately?",
            "Take your time. What would you like to talk about?",
            "I'm here for you. What's weighing on your heart?"
        ]
        return CoachResponse(
            message=random.choice(greetings),
            mode=CoachMode.LEARN,
            confidence=0.5,
            referenced_data={'empty_input': True}
        )
    
    def _safe_fallback(self) -> CoachResponse:
        """Safe fallback when something goes wrong."""
        fallbacks = [
            "I want to make sure I understand you properly. Can you tell me a little more about what's going on?",
            "I'm here to help. Can you share a bit more about what you're thinking?",
            "I'm listening. What feels most important for you to talk about right now?"
        ]
        return CoachResponse(
            message=random.choice(fallbacks),
            mode=CoachMode.LEARN,
            confidence=0.5,
            referenced_data={'fallback': True}
        )
