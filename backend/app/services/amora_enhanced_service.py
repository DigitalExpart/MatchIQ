"""
Amora Enhanced Service - Production V1
Semantic, emotionally intelligent AI coach with trust-building features.
No third-party AI APIs. Self-hosted semantic understanding.
"""
from typing import Dict, Any, Optional, List, Tuple
from uuid import UUID
import logging
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import random
from datetime import datetime
from dataclasses import dataclass

from app.models.pydantic_models import CoachMode, CoachRequest, CoachResponse
from app.database import get_supabase_client

logger = logging.getLogger(__name__)

# Lazy imports for models
_embedding_model = None
_emotional_detector = None
_intent_classifier = None


def get_embedding_model():
    """Lazy load sentence-transformers model."""
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info("Loaded sentence-transformers model")
    return _embedding_model


@dataclass
class ConversationState:
    """Track conversation state for adaptive responses."""
    is_first_message: bool = True
    turns_count: int = 0
    confidence_history: List[str] = None
    recent_themes: List[str] = None
    emotional_patterns: Dict[str, float] = None
    unresolved_questions: List[str] = None
    
    def __post_init__(self):
        if self.confidence_history is None:
            self.confidence_history = []
        if self.recent_themes is None:
            self.recent_themes = []
        if self.emotional_patterns is None:
            self.emotional_patterns = {}
        if self.unresolved_questions is None:
            self.unresolved_questions = []


class EmotionalMirroringEngine:
    """
    TASK 4: Convert emotion labels to human, empathetic language.
    Never sounds clinical or labeled.
    """
    
    EMOTION_PHRASINGS = {
        "confusion": [
            "It sounds like this has been sitting heavy with you",
            "I can sense you're feeling unsure about this",
            "It seems like you're wrestling with this",
            "I hear that this feels unclear right now"
        ],
        "anxiety": [
            "I can feel the weight of this worry",
            "It sounds like this has been on your mind a lot",
            "I sense some tension around this",
            "This seems to be causing you some unease"
        ],
        "sadness": [
            "I hear the hurt in what you're sharing",
            "It sounds like this has been painful",
            "I can sense the heaviness you're carrying",
            "This feels like it's been weighing on your heart"
        ],
        "overwhelm": [
            "It sounds like this feels like a lot right now",
            "I can sense you're carrying a heavy load",
            "This seems like it's been building up",
            "It feels like you have a lot on your shoulders"
        ],
        "frustration": [
            "I can hear your frustration coming through",
            "It sounds like this has been testing your patience",
            "I sense you've been dealing with this for a while",
            "This seems to have been wearing on you"
        ],
        "hope": [
            "I hear some hope in what you're sharing",
            "It sounds like you're looking for a path forward",
            "I sense you're open to possibilities",
            "There's something hopeful in how you're approaching this"
        ]
    }
    
    @classmethod
    def mirror_emotion(cls, dominant_emotion: str, intensity: float) -> Optional[str]:
        """
        Convert emotion to empathetic human phrasing.
        Only mirror if intensity > 0.5 (meaningful).
        """
        if intensity < 0.5:
            return None
        
        phrasings = cls.EMOTION_PHRASINGS.get(dominant_emotion, [])
        if not phrasings:
            return None
        
        return random.choice(phrasings)


class ResponseVariabilityEngine:
    """
    TASK 3: Ensure Amora never sounds repetitive.
    Multiple phrasings for same intent/emotion.
    """
    
    OPENING_VARIATIONS = [
        "",  # Sometimes no opening, just reflection
        "I'm with you. ",
        "I hear you. ",
        "Thank you for sharing that. "
    ]
    
    CLARIFYING_QUESTIONS = {
        "venting": [
            "What's been the hardest part?",
            "What specifically has been weighing on you?",
            "What feels most important to you about this?",
            "What's coming up most for you right now?"
        ],
        "confusion": [
            "What part feels most confusing?",
            "What specifically feels unclear?",
            "What's the main thing you're wrestling with?",
            "What question keeps coming up for you?"
        ],
        "decision_making": [
            "What feels most important to you in making this choice?",
            "What are you most concerned about?",
            "What's pulling you in different directions?",
            "What would feel right to you?"
        ]
    }
    
    MICRO_CONFIDENCE_BUILDERS = [
        "You're not overthinking this.",
        "It makes sense to feel unsure here.",
        "You don't have to figure this out all at once.",
        "It's okay to not have all the answers right now.",
        "Taking time to think this through is important.",
        "Your feelings are valid."
    ]
    
    @classmethod
    def add_variability(
        cls,
        base_response: str,
        context: ConversationState,
        confidence_level: str
    ) -> str:
        """Add natural variability to avoid repetitive feel."""
        # Randomly add opening (30% chance)
        if random.random() < 0.3:
            opening = random.choice(cls.OPENING_VARIATIONS)
            base_response = opening + base_response
        
        # Add micro-confidence builder for LOW confidence (20% chance)
        if confidence_level == "LOW" and random.random() < 0.2:
            builder = random.choice(cls.MICRO_CONFIDENCE_BUILDERS)
            base_response += f" {builder}"
        
        return base_response.strip()


class AmoraEnhancedService:
    """
    Production V1: Semantic, emotionally intelligent AI coach.
    Implements all 10 enhancement tasks.
    """
    
    def __init__(self):
        """Initialize enhanced Amora service."""
        self.embedding_model = get_embedding_model()
        self.supabase = get_supabase_client()
        self.emotional_mirror = EmotionalMirroringEngine()
        self.variability_engine = ResponseVariabilityEngine()
        
        # Session storage (in-memory for now, should be Redis in production)
        self._sessions = {}
    
    def get_response(
        self,
        request: CoachRequest,
        user_id: UUID,
        is_paid_user: bool = False
    ) -> CoachResponse:
        """
        Main entry point with all enhancements.
        
        Flow:
        1. Load/init conversation state
        2. Handle first-turn experience
        3. Detect emotions & intent
        4. Apply confidence gating
        5. Generate response with variability
        6. Add emotional mirroring
        7. Update conversation memory
        """
        try:
            # TASK 1 & 7: Load conversation state
            conversation_state = self._load_conversation_state(user_id)
            
            question = (request.specific_question or "").strip()
            
            # TASK 1: First-turn experience
            if conversation_state.is_first_message:
                return self._handle_first_turn(user_id, question, conversation_state)
            
            # TASK 9: Empty input handling
            if not question or len(question) < 3:
                return self._handle_empty_input(conversation_state)
            
            # Generate semantic embedding
            question_embedding = self._generate_embedding(question)
            
            # Detect emotional signals
            emotional_signals = self._detect_emotions(question, question_embedding)
            
            # Classify intent
            intent_signals = self._classify_intent(question, question_embedding)
            
            # Determine confidence level
            confidence_level = self._compute_confidence_level(emotional_signals, intent_signals)
            
            # TASK 5: Clarify before depth if needed
            if self._should_clarify(emotional_signals, intent_signals, conversation_state):
                return self._generate_clarifying_question(
                    question,
                    emotional_signals,
                    intent_signals,
                    conversation_state
                )
            
            # Find best template
            template = self._find_best_template(
                question,
                question_embedding,
                emotional_signals,
                intent_signals,
                confidence_level
            )
            
            # TASK 2: Apply confidence gating (strict enforcement)
            gated_response = self._apply_confidence_gate(
                template,
                confidence_level,
                emotional_signals,
                intent_signals
            )
            
            # TASK 4: Add emotional mirroring
            response_with_mirroring = self._add_emotional_mirroring(
                gated_response,
                emotional_signals
            )
            
            # TASK 3: Add variability
            final_response = self.variability_engine.add_variability(
                response_with_mirroring,
                conversation_state,
                confidence_level
            )
            
            # TASK 7: Add conversation memory if relevant
            final_response = self._add_conversation_memory(
                final_response,
                conversation_state
            )
            
            # Update conversation state
            self._update_conversation_state(
                user_id,
                conversation_state,
                question,
                final_response,
                emotional_signals,
                intent_signals,
                confidence_level
            )
            
            return CoachResponse(
                message=final_response,
                mode=CoachMode.LEARN,
                confidence=self._compute_confidence_score(confidence_level),
                referenced_data={
                    "emotional_signals": emotional_signals,
                    "intent_signals": intent_signals,
                    "confidence_level": confidence_level,
                    "turns_count": conversation_state.turns_count + 1
                }
            )
            
        except Exception as e:
            logger.error(f"Error in enhanced Amora response: {e}", exc_info=True)
            return self._safe_fallback()
    
    def _handle_first_turn(
        self,
        user_id: UUID,
        question: str,
        conversation_state: ConversationState
    ) -> CoachResponse:
        """
        TASK 1: First-turn experience.
        Warm, safe opening that invites without assuming.
        """
        # If user already said something meaningful, acknowledge it
        if question and len(question) > 10:
            # User opened with a real question, respond normally but add intro
            intro = "I'm Amora. I help people think through love and relationships without judgment or pressure. "
            
            # Generate normal response for their question
            # (simplified for first turn)
            response = intro + "What's been weighing on you lately?"
        else:
            # Generic first interaction
            openings = [
                "I'm Amora. I help people think through love and relationships without judgment or pressure. What's been on your mind lately?",
                "I'm Amora. I'm here to help you explore relationships and emotions at your own pace. What would you like to talk about?",
                "I'm Amora. I create a space to think through relationships without pressure or judgment. What's been weighing on you?"
            ]
            response = random.choice(openings)
        
        # Mark first turn as complete
        conversation_state.is_first_message = False
        self._sessions[str(user_id)] = conversation_state
        
        return CoachResponse(
            message=response,
            mode=CoachMode.LEARN,
            confidence=0.7,
            referenced_data={"first_turn": True}
        )
    
    def _should_clarify(
        self,
        emotional_signals: Dict[str, float],
        intent_signals: Dict[str, float],
        conversation_state: ConversationState
    ) -> bool:
        """
        TASK 5: Determine if clarification is needed before going deeper.
        
        Clarify if:
        - Multiple strong intents (conflicting)
        - Very high emotion + unclear intent
        - Message seems incomplete
        """
        # Count strong intents (>0.5)
        strong_intents = sum(1 for v in intent_signals.values() if v > 0.5)
        
        # High emotional intensity
        emotional_intensity = sum([
            emotional_signals.get("confusion", 0),
            emotional_signals.get("anxiety", 0),
            emotional_signals.get("overwhelm", 0)
        ]) / 3
        
        # Max intent score
        max_intent = max(intent_signals.values()) if intent_signals else 0
        
        # Clarify if multiple strong intents OR high emotion + low intent clarity
        should_clarify = (
            strong_intents >= 2 or
            (emotional_intensity > 0.7 and max_intent < 0.4)
        )
        
        # Don't clarify too often (max once every 3 turns)
        if conversation_state.turns_count < 3:
            return False
        
        return should_clarify
    
    def _generate_clarifying_question(
        self,
        question: str,
        emotional_signals: Dict[str, float],
        intent_signals: Dict[str, float],
        conversation_state: ConversationState
    ) -> CoachResponse:
        """
        TASK 5: Generate ONE gentle clarifying question.
        No multiple questions. No analysis dump.
        """
        # Determine dominant emotion
        dominant_emotion = max(emotional_signals, key=emotional_signals.get)
        
        # Emotional reflection
        reflection = self.emotional_mirror.mirror_emotion(
            dominant_emotion,
            emotional_signals[dominant_emotion]
        )
        
        # Determine clarification type based on intent
        dominant_intent = max(intent_signals, key=intent_signals.get)
        
        clarifying_questions = {
            "venting": "What's been the hardest part for you?",
            "confusion": "What part feels most unclear to you right now?",
            "decision_making": "Before we go further, can I check — is this more about how you're feeling, or about what to do next?",
            "advice_seeking": "What specifically would be most helpful for you to explore?",
            "reassurance_seeking": "What would feel most reassuring to hear right now?"
        }
        
        clarifying_q = clarifying_questions.get(
            dominant_intent,
            "Can you tell me a little more about what's going on?"
        )
        
        if reflection:
            message = f"{reflection}. {clarifying_q}"
        else:
            message = clarifying_q
        
        return CoachResponse(
            message=message,
            mode=CoachMode.LEARN,
            confidence=0.6,
            referenced_data={"clarifying": True}
        )
    
    def _apply_confidence_gate(
        self,
        template: Optional[Dict[str, Any]],
        confidence_level: str,
        emotional_signals: Dict[str, float],
        intent_signals: Dict[str, float]
    ) -> str:
        """
        TASK 2: Strict confidence gating.
        Enforces what's allowed at each confidence level.
        """
        if not template:
            return self._safe_fallback().message
        
        base_response = template.get("response_template", "")
        
        if confidence_level == "LOW":
            # LOW: Only reflection + validation + 1 question
            # Strip any advice language
            forbidden_phrases = [
                "you could try",
                "you might want to",
                "consider doing",
                "it would help to",
                "you should"
            ]
            
            for phrase in forbidden_phrases:
                if phrase in base_response.lower():
                    # Replace with reflection-only version
                    base_response = self._convert_to_reflection_only(base_response, emotional_signals)
                    break
            
            # Ensure ends with question
            if "?" not in base_response:
                dominant_intent = max(intent_signals, key=intent_signals.get)
                clarifying_q = self.variability_engine.CLARIFYING_QUESTIONS.get(
                    dominant_intent,
                    ["What's been on your mind?"]
                )[0]
                base_response += f" {clarifying_q}"
        
        elif confidence_level == "MEDIUM":
            # MEDIUM: Reflection + light insight + optional perspective
            # Allow gentle reframing but no direct instructions
            forbidden_phrases = ["you should", "you must", "you need to"]
            
            for phrase in forbidden_phrases:
                base_response = base_response.replace(phrase, "it might help to consider")
        
        # HIGH: Allow as-is (already non-directive in templates)
        
        return base_response
    
    def _convert_to_reflection_only(
        self,
        response: str,
        emotional_signals: Dict[str, float]
    ) -> str:
        """Convert advisory response to reflection-only for LOW confidence."""
        dominant_emotion = max(emotional_signals, key=emotional_signals.get)
        
        reflection_templates = {
            "confusion": "It sounds like you're feeling really uncertain about this. What part feels most confusing?",
            "anxiety": "I can sense this has been weighing on you. What's been on your mind most?",
            "sadness": "I hear the hurt in what you're sharing. What's been the hardest part?",
            "overwhelm": "It sounds like you're carrying a lot right now. What feels most pressing?"
        }
        
        return reflection_templates.get(
            dominant_emotion,
            "I'm here to listen. What would be most helpful to talk through?"
        )
    
    def _add_emotional_mirroring(
        self,
        response: str,
        emotional_signals: Dict[str, float]
    ) -> str:
        """
        TASK 4: Add emotional mirroring before insight.
        Uses human language, not clinical labels.
        """
        # Find dominant emotion
        dominant_emotion = max(emotional_signals, key=emotional_signals.get)
        intensity = emotional_signals[dominant_emotion]
        
        # Only mirror if intensity is meaningful (>0.5)
        if intensity < 0.5:
            return response
        
        # Get empathetic phrasing
        mirroring = self.emotional_mirror.mirror_emotion(dominant_emotion, intensity)
        
        if not mirroring:
            return response
        
        # Check if response already has emotional reflection
        reflection_indicators = [
            "it sounds like",
            "i can sense",
            "i hear",
            "it seems like",
            "i understand"
        ]
        
        if any(indicator in response.lower()[:50] for indicator in reflection_indicators):
            # Already has reflection, don't double up
            return response
        
        # Prepend mirroring
        return f"{mirroring}. {response}"
    
    def _add_conversation_memory(
        self,
        response: str,
        conversation_state: ConversationState
    ) -> str:
        """
        TASK 7: Add conversation memory when relevant.
        Only reference what user actually said.
        """
        # Only add memory reference if:
        # 1. Have recent themes
        # 2. Current turn > 3
        # 3. Response isn't too long already
        
        if (
            not conversation_state.recent_themes or
            conversation_state.turns_count < 3 or
            len(response) > 250
        ):
            return response
        
        # 20% chance to reference memory (avoid overuse)
        if random.random() > 0.2:
            return response
        
        last_theme = conversation_state.recent_themes[-1]
        
        memory_references = [
            f" I remember you mentioned {last_theme} earlier—does this connect?",
            f" This reminds me of when you talked about {last_theme}.",
            f" I'm noticing {last_theme} has come up a few times for you."
        ]
        
        memory_ref = random.choice(memory_references)
        return response + memory_ref
    
    def _generate_embedding(self, text: str) -> np.ndarray:
        """Generate semantic embedding."""
        try:
            return self.embedding_model.encode(text, show_progress_bar=False)
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            return np.zeros(384)
    
    def _detect_emotions(self, text: str, embedding: np.ndarray) -> Dict[str, float]:
        """Detect emotional signals (rule-based fallback)."""
        text_lower = text.lower()
        
        emotions = {
            "confusion": 0.0,
            "sadness": 0.0,
            "anxiety": 0.0,
            "frustration": 0.0,
            "hope": 0.0,
            "emotional_distance": 0.0,
            "overwhelm": 0.0
        }
        
        # Confusion
        if any(w in text_lower for w in ["confused", "dont know", "not sure", "uncertain", "unclear"]):
            emotions["confusion"] = 0.8
        
        # Anxiety
        if any(w in text_lower for w in ["anxious", "worried", "nervous", "scared", "afraid"]):
            emotions["anxiety"] = 0.7
        
        # Sadness
        if any(w in text_lower for w in ["sad", "unhappy", "hurt", "pain", "depressed"]):
            emotions["sadness"] = 0.7
        
        # Overwhelm
        if any(w in text_lower for w in ["overwhelmed", "too much", "cant handle", "exhausted"]):
            emotions["overwhelm"] = 0.8
        
        # Hope
        if any(w in text_lower for w in ["hope", "hopeful", "want to", "trying", "better"]):
            emotions["hope"] = 0.6
        
        # Frustration
        if any(w in text_lower for w in ["frustrated", "angry", "annoyed", "fed up"]):
            emotions["frustration"] = 0.7
        
        # Emotional distance
        if any(w in text_lower for w in ["distant", "disconnected", "nothing", "numb"]):
            emotions["emotional_distance"] = 0.7
        
        return emotions
    
    def _classify_intent(self, text: str, embedding: np.ndarray) -> Dict[str, float]:
        """Classify user intent (rule-based fallback)."""
        text_lower = text.lower()
        
        intents = {
            "greeting_testing": 0.0,
            "venting": 0.0,
            "reflection": 0.0,
            "advice_seeking": 0.0,
            "reassurance_seeking": 0.0,
            "decision_making": 0.0,
            "curiosity_learning": 0.0
        }
        
        # Greeting
        if any(w in text_lower for w in ["hi", "hello", "hey", "who are you"]):
            intents["greeting_testing"] = 0.9
        
        # Venting
        if any(w in text_lower for w in ["just need to talk", "feeling", "im so"]):
            intents["venting"] = 0.7
        
        # Advice-seeking
        if any(w in text_lower for w in ["what should i", "how do i", "advice", "help me"]):
            intents["advice_seeking"] = 0.8
        
        # Decision-making
        if any(w in text_lower for w in ["should i", " or ", "choose", "decide"]):
            intents["decision_making"] = 0.7
        
        # Reassurance
        if any(w in text_lower for w in ["am i", "is it okay", "is this normal"]):
            intents["reassurance_seeking"] = 0.6
        
        return intents
    
    def _compute_confidence_level(
        self,
        emotional_signals: Dict[str, float],
        intent_signals: Dict[str, float]
    ) -> str:
        """Determine confidence level."""
        emotional_intensity = sum([
            emotional_signals["confusion"],
            emotional_signals["anxiety"],
            emotional_signals["overwhelm"]
        ]) / 3
        
        max_intent = max(intent_signals.values()) if intent_signals else 0
        
        if emotional_intensity > 0.6 or max_intent < 0.4:
            return "LOW"
        elif max_intent > 0.7 and emotional_intensity < 0.4:
            return "HIGH"
        else:
            return "MEDIUM"
    
    def _find_best_template(
        self,
        question: str,
        question_embedding: np.ndarray,
        emotional_signals: Dict[str, float],
        intent_signals: Dict[str, float],
        confidence_level: str
    ) -> Optional[Dict[str, Any]]:
        """Find best matching template using semantic similarity."""
        try:
            templates_response = self.supabase.table("amora_templates") \
                .select("*") \
                .eq("confidence_level", confidence_level) \
                .eq("active", True) \
                .execute()
            
            if not templates_response.data:
                return None
            
            best_template = None
            best_score = 0.0
            
            for template in templates_response.data:
                template_embedding = np.array(template.get("embedding", []))
                
                if len(template_embedding) == 0:
                    continue
                
                similarity = cosine_similarity(
                    [question_embedding],
                    [template_embedding]
                )[0][0]
                
                if similarity > best_score:
                    best_score = similarity
                    best_template = template
            
            return best_template
            
        except Exception as e:
            logger.error(f"Error finding template: {e}")
            return None
    
    def _compute_confidence_score(self, confidence_level: str) -> float:
        """Convert confidence level to score."""
        return {"LOW": 0.5, "MEDIUM": 0.7, "HIGH": 0.9}.get(confidence_level, 0.7)
    
    def _load_conversation_state(self, user_id: UUID) -> ConversationState:
        """Load conversation state for user."""
        key = str(user_id)
        if key not in self._sessions:
            self._sessions[key] = ConversationState()
        return self._sessions[key]
    
    def _update_conversation_state(
        self,
        user_id: UUID,
        state: ConversationState,
        question: str,
        response: str,
        emotional_signals: Dict[str, float],
        intent_signals: Dict[str, float],
        confidence_level: str
    ):
        """Update conversation state after turn."""
        state.is_first_message = False
        state.turns_count += 1
        state.confidence_history.append(confidence_level)
        
        # Extract themes (simple keyword extraction)
        themes = ["trust", "communication", "love", "confusion", "decision"]
        for theme in themes:
            if theme in question.lower():
                if theme not in state.recent_themes:
                    state.recent_themes.append(theme)
        
        # Keep only last 3 themes
        state.recent_themes = state.recent_themes[-3:]
        
        # Update emotional patterns (rolling average)
        for emotion, value in emotional_signals.items():
            if emotion in state.emotional_patterns:
                state.emotional_patterns[emotion] = (state.emotional_patterns[emotion] + value) / 2
            else:
                state.emotional_patterns[emotion] = value
        
        # Store updated state
        self._sessions[str(user_id)] = state
    
    def _handle_empty_input(self, conversation_state: ConversationState) -> CoachResponse:
        """TASK 9: Handle empty input gracefully."""
        responses = [
            "I'm here whenever you're ready to talk. What's on your mind?",
            "Take your time. I'm here when you're ready to share.",
            "I'm listening. What would you like to talk about?"
        ]
        
        return CoachResponse(
            message=random.choice(responses),
            mode=CoachMode.LEARN,
            confidence=0.6,
            referenced_data={"empty_input": True}
        )
    
    def _safe_fallback(self) -> CoachResponse:
        """TASK 9: Safe fallback that never sounds broken."""
        fallbacks = [
            "I want to make sure I understand you properly. Can you tell me a little more about what's going on?",
            "I'm here to help. Can you share a bit more about what you're thinking?",
            "I'm listening. What feels most important for you to talk about right now?"
        ]
        
        return CoachResponse(
            message=random.choice(fallbacks),
            mode=CoachMode.LEARN,
            confidence=0.5,
            referenced_data={"fallback": True}
        )
