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

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.models.pydantic_models import CoachMode, CoachRequest, CoachResponse
from app.database import get_supabase_client

# Import embedding model function from enhanced service
from app.services.amora_enhanced_service import get_embedding_model

logger = logging.getLogger(__name__)


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
    
    # Comprehensive topic keywords
    TOPIC_KEYWORDS = {
        'heartbreak': ['heartbreak', 'heartbroken', 'broken heart', 'breakup', 'broke up', 'ended things', 'dumped', 'left me'],
        'breakup': ['breakup', 'broke up', 'breaking up', 'ended', 'split up', 'separated'],
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
        """Detect topics from user message."""
        text_lower = text.lower()
        detected = set()
        
        for topic, keywords in cls.TOPIC_KEYWORDS.items():
            if any(keyword in text_lower for keyword in keywords):
                detected.add(topic)
        
        # Add context topics if they're still relevant
        if context_topics:
            for topic in context_topics:
                if topic in cls.TOPIC_KEYWORDS:
                    # Check if topic is still being discussed
                    keywords = cls.TOPIC_KEYWORDS[topic]
                    if any(keyword in text_lower for keyword in keywords[:3]):  # Loose check
                        detected.add(topic)
        
        return list(detected) if detected else ['general']
    
    @classmethod
    def detect_emotions(cls, text: str, embedding: Optional[np.ndarray] = None) -> List[str]:
        """Detect emotions from user message."""
        text_lower = text.lower()
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
        min_similarity: float = 0.3
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
            query = self.supabase.table("amora_response_blocks") \
                .select("*") \
                .eq("block_type", block_type) \
                .eq("stage", stage) \
                .eq("active", True) \
                .is_("embedding", "not.null")
            
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
                            .is_("embedding", "not.null") \
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
                if block_data.get('embedding'):
                    candidates.append(ResponseBlock(
                        id=block_data['id'],
                        block_type=block_data['block_type'],
                        text=block_data['text'],
                        topics=block_data.get('topics', []),
                        emotions=block_data.get('emotions', []),
                        stage=block_data['stage'],
                        priority=block_data.get('priority', 50),
                        embedding=np.array(block_data['embedding'])
                    ))
            
            if not candidates:
                logger.warning(f"No blocks with embeddings for type={block_type}")
                return None
            
            # Score each candidate
            scored_blocks = []
            for block in candidates:
                score = self._score_block(
                    block,
                    question_embedding,
                    topics,
                    emotions,
                    recent_block_ids
                )
                scored_blocks.append((block, score))
            
            # Sort by score descending
            scored_blocks.sort(key=lambda x: x[1], reverse=True)
            
            # Return best block above threshold
            best_block, best_score = scored_blocks[0]
            
            if best_score >= min_similarity:
                logger.info(f"Selected {block_type} block: score={best_score:.3f}, topics={best_block.topics[:2]}")
                return best_block
            
            # If no block above threshold, return best anyway (safety)
            logger.warning(f"Best {block_type} block below threshold: {best_score:.3f}")
            return best_block
        
        except Exception as e:
            logger.error(f"Error selecting block: {e}", exc_info=True)
            return None
    
    def _score_block(
        self,
        block: ResponseBlock,
        question_embedding: np.ndarray,
        topics: List[str],
        emotions: List[str],
        recent_block_ids: List[str]
    ) -> float:
        """
        Score a block based on multiple factors.
        
        Factors:
        - Semantic similarity (0-1)
        - Topic overlap (0-0.3 bonus)
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
        self.embedding_model = get_embedding_model()
        self.block_selector = BlockSelector(self.supabase, self.embedding_model)
        self.detector = TopicEmotionDetector()
        
        # In-memory session storage (use Redis in production)
        self._sessions: Dict[str, ConversationState] = {}
    
    def get_blocks_count(self) -> int:
        """Get count of blocks with embeddings for health check."""
        try:
            response = self.supabase.table('amora_response_blocks') \
                .select('id', count='exact') \
                .is_('embedding', 'not.null') \
                .eq('active', True) \
                .execute()
            
            return response.count if hasattr(response, 'count') else 0
        except Exception as e:
            logger.error(f"Error counting blocks: {e}")
            return 0
    
    def get_response(
        self,
        request: CoachRequest,
        user_id: UUID
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
            # Load conversation state
            state = self._load_state(user_id, request.session_id, request.context)
            
            question = (request.specific_question or "").strip()
            
            # Handle empty input
            if not question or len(question) < 3:
                return self._handle_empty_input(state)
            
            # Generate embedding
            question_embedding = self.embedding_model.encode(question)
            
            # Detect topics and emotions
            context_topics = request.context.get('topics', []) if request.context else []
            topics = self.detector.detect_topics(question, context_topics)
            emotions = self.detector.detect_emotions(question, question_embedding)
            
            logger.info(f"Detected topics: {topics[:3]}, emotions: {emotions[:2]}")
            
            # Update active topics
            for topic in topics:
                if topic not in state.active_topics:
                    state.active_topics.append(topic)
                    state.topic_stages[topic] = 1
            
            # Determine stage for primary topic
            primary_topic = topics[0] if topics else 'general'
            stage = state.topic_stages.get(primary_topic, 1)
            
            # Extract short user phrase for exploration blocks
            state.last_user_phrase = self._extract_key_phrase(question)
            
            # Select blocks
            reflection = self.block_selector.select_block(
                block_type='reflection',
                question_embedding=question_embedding,
                topics=topics,
                emotions=emotions,
                stage=stage,
                recent_block_ids=state.recent_block_ids
            )
            
            normalization = self.block_selector.select_block(
                block_type='normalization',
                question_embedding=question_embedding,
                topics=topics,
                emotions=emotions,
                stage=stage,
                recent_block_ids=state.recent_block_ids
            )
            
            exploration = self.block_selector.select_block(
                block_type='exploration',
                question_embedding=question_embedding,
                topics=topics,
                emotions=emotions,
                stage=stage,
                recent_block_ids=state.recent_block_ids
            )
            
            # Optionally select reframe for stage 2+
            reframe = None
            if stage >= 2 and random.random() < 0.3:
                reframe = self.block_selector.select_block(
                    block_type='reframe',
                    question_embedding=question_embedding,
                    topics=topics,
                    emotions=emotions,
                    stage=stage,
                    recent_block_ids=state.recent_block_ids
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
            self._update_state(
                state=state,
                blocks_used=[reflection, normalization, exploration, reframe],
                topics=topics,
                primary_topic=primary_topic
            )
            
            # Save state
            self._save_state(state)
            
            return CoachResponse(
                message=message,
                mode=CoachMode.LEARN,
                confidence=0.85,
                referenced_data={
                    'topics': topics[:3],
                    'emotions': emotions[:2],
                    'stage': stage,
                    'turn_count': state.turn_count,
                    'engine': 'blocks'  # Set engine here
                }
            )
        
        except Exception as e:
            logger.error(f"Error in blocks service: {e}", exc_info=True)
            return self._safe_fallback()
    
    def _load_state(
        self,
        user_id: UUID,
        session_id: Optional[str],
        context: Optional[Dict[str, Any]]
    ) -> ConversationState:
        """Load or create conversation state."""
        key = session_id if session_id else str(user_id)
        
        if key in self._sessions:
            state = self._sessions[key]
            state.updated_at = datetime.now()
            return state
        
        # Create new state
        state = ConversationState(
            session_id=key,
            user_id=user_id
        )
        
        # Extract context if available
        if context:
            state.relationship_status = context.get('relationship_status')
            state.partner_label = self._infer_partner_label(context)
        
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
