"""
Custom AI Service for Amora - 100% Self-Hosted
No third-party AI APIs. Uses sentence-transformers + custom classifiers.
"""
from typing import Dict, Any, Optional, List
from uuid import UUID
import logging
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os

from app.models.pydantic_models import CoachMode, CoachRequest, CoachResponse
from app.database import get_supabase_client

logger = logging.getLogger(__name__)

# Lazy import to avoid loading models at module import time
_embedding_model = None
_emotional_detector = None
_intent_classifier = None


def get_embedding_model():
    """Lazy load sentence-transformers model."""
    global _embedding_model
    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer
        # Load lightweight model (80MB, runs on CPU)
        _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info("Loaded sentence-transformers model")
    return _embedding_model


def get_emotional_detector():
    """Lazy load emotional detection model."""
    global _emotional_detector
    if _emotional_detector is None:
        model_path = 'models/emotional_detector.pkl'
        if os.path.exists(model_path):
            _emotional_detector = joblib.load(model_path)
            logger.info("Loaded emotional detector model")
        else:
            logger.warning(f"Emotional detector model not found at {model_path}")
            _emotional_detector = None
    return _emotional_detector


def get_intent_classifier():
    """Lazy load intent classification model."""
    global _intent_classifier
    if _intent_classifier is None:
        model_path = 'models/intent_classifier.pkl'
        if os.path.exists(model_path):
            _intent_classifier = joblib.load(model_path)
            logger.info("Loaded intent classifier model")
        else:
            logger.warning(f"Intent classifier model not found at {model_path}")
            _intent_classifier = None
    return _intent_classifier


class CustomAIService:
    """
    Custom AI service using sentence-transformers + ML classifiers.
    100% self-hosted, no third-party AI APIs.
    """
    
    def __init__(self):
        """Initialize custom AI service."""
        self.embedding_model = get_embedding_model()
        self.emotional_detector = get_emotional_detector()
        self.intent_classifier = get_intent_classifier()
        self.supabase = get_supabase_client()
    
    def get_response(
        self,
        request: CoachRequest,
        user_id: UUID,
        is_paid_user: bool = False
    ) -> CoachResponse:
        """
        Generate response using custom AI pipeline.
        
        Pipeline:
        1. Generate embeddings for semantic understanding
        2. Detect emotional signals
        3. Classify intent
        4. Select response strategy
        5. Find best matching template
        6. Personalize response
        """
        try:
            question = request.specific_question or ""
            
            if not question.strip():
                return self._handle_empty_input()
            
            # Step 1: Generate embedding
            question_embedding = self._generate_embedding(question)
            
            # Step 2: Detect emotional signals
            emotional_signals = self._detect_emotions(question, question_embedding)
            
            # Step 3: Classify intent
            intent_signals = self._classify_intent(question, question_embedding)
            
            # Step 4: Determine confidence level
            confidence_level = self._compute_confidence_level(emotional_signals, intent_signals)
            
            # Step 5: Find best matching template
            template = self._find_best_template(
                question,
                question_embedding,
                emotional_signals,
                intent_signals,
                confidence_level
            )
            
            # Step 6: Personalize response
            context = self._load_context(user_id, is_paid_user)
            message = self._personalize_response(
                template,
                emotional_signals,
                context
            )
            
            # Step 7: Update context
            self._update_context(user_id, question, message, is_paid_user)
            
            return CoachResponse(
                message=message,
                mode=CoachMode.LEARN,
                confidence=self._compute_confidence_score(confidence_level),
                referenced_data={
                    "emotional_signals": emotional_signals,
                    "intent_signals": intent_signals,
                    "confidence_level": confidence_level,
                    "template_id": template.get("id") if template else None
                }
            )
            
        except Exception as e:
            logger.error(f"Error in custom AI response: {e}", exc_info=True)
            return self._fallback_response()
    
    def _generate_embedding(self, text: str) -> np.ndarray:
        """Convert text to 384-dimensional vector."""
        try:
            embedding = self.embedding_model.encode(text, show_progress_bar=False)
            return embedding
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            return np.zeros(384)  # Fallback zero vector
    
    def _detect_emotions(self, text: str, embedding: np.ndarray) -> Dict[str, float]:
        """
        Detect emotional signals using custom ML model.
        Returns scores 0.0-1.0 for each emotion.
        """
        if self.emotional_detector is not None:
            try:
                scores = self.emotional_detector.predict([embedding])[0]
                return {
                    "confusion": float(np.clip(scores[0], 0, 1)),
                    "sadness": float(np.clip(scores[1], 0, 1)),
                    "anxiety": float(np.clip(scores[2], 0, 1)),
                    "frustration": float(np.clip(scores[3], 0, 1)),
                    "hope": float(np.clip(scores[4], 0, 1)),
                    "emotional_distance": float(np.clip(scores[5], 0, 1)),
                    "overwhelm": float(np.clip(scores[6], 0, 1))
                }
            except Exception as e:
                logger.error(f"Error in emotional detection: {e}")
        
        # Fallback: Rule-based emotional detection
        return self._rule_based_emotion_detection(text)
    
    def _rule_based_emotion_detection(self, text: str) -> Dict[str, float]:
        """Fallback rule-based emotion detection."""
        text_lower = text.lower()
        
        # Simple keyword-based detection
        emotions = {
            "confusion": 0.0,
            "sadness": 0.0,
            "anxiety": 0.0,
            "frustration": 0.0,
            "hope": 0.0,
            "emotional_distance": 0.0,
            "overwhelm": 0.0
        }
        
        # Confusion indicators
        if any(w in text_lower for w in ["confused", "dont know", "not sure", "uncertain"]):
            emotions["confusion"] = 0.8
        
        # Anxiety indicators
        if any(w in text_lower for w in ["anxious", "worried", "nervous", "scared"]):
            emotions["anxiety"] = 0.7
        
        # Sadness indicators
        if any(w in text_lower for w in ["sad", "unhappy", "depressed", "hurt"]):
            emotions["sadness"] = 0.7
        
        # Overwhelm indicators
        if any(w in text_lower for w in ["overwhelmed", "too much", "cant handle"]):
            emotions["overwhelm"] = 0.8
        
        # Hope indicators
        if any(w in text_lower for w in ["hope", "hopeful", "want to", "trying"]):
            emotions["hope"] = 0.6
        
        return emotions
    
    def _classify_intent(self, text: str, embedding: np.ndarray) -> Dict[str, float]:
        """
        Classify user intent using custom ML model.
        Returns probability scores for each intent.
        """
        if self.intent_classifier is not None:
            try:
                probs = self.intent_classifier.predict_proba([embedding])
                return {
                    "greeting_testing": float(probs[0][1] if len(probs[0]) > 1 else 0),
                    "venting": float(probs[1][1] if len(probs[1]) > 1 else 0),
                    "reflection": float(probs[2][1] if len(probs[2]) > 1 else 0),
                    "advice_seeking": float(probs[3][1] if len(probs[3]) > 1 else 0),
                    "reassurance_seeking": float(probs[4][1] if len(probs[4]) > 1 else 0),
                    "decision_making": float(probs[5][1] if len(probs[5]) > 1 else 0),
                    "curiosity_learning": float(probs[6][1] if len(probs[6]) > 1 else 0)
                }
            except Exception as e:
                logger.error(f"Error in intent classification: {e}")
        
        # Fallback: Rule-based intent classification
        return self._rule_based_intent_classification(text)
    
    def _rule_based_intent_classification(self, text: str) -> Dict[str, float]:
        """Fallback rule-based intent classification."""
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
        
        # Greeting patterns
        if any(w in text_lower for w in ["hi", "hello", "hey", "what can you do", "who are you"]):
            intents["greeting_testing"] = 0.9
        
        # Venting patterns
        if any(w in text_lower for w in ["just need to talk", "feeling", "im so", "i just"]):
            intents["venting"] = 0.7
        
        # Advice-seeking patterns
        if any(w in text_lower for w in ["what should i", "how do i", "advice", "help me"]):
            intents["advice_seeking"] = 0.8
        
        # Decision-making patterns
        if any(w in text_lower for w in ["should i", "or", "choose", "decide"]):
            intents["decision_making"] = 0.7
        
        # Reassurance-seeking patterns
        if any(w in text_lower for w in ["am i", "is it okay", "is this normal"]):
            intents["reassurance_seeking"] = 0.6
        
        return intents
    
    def _compute_confidence_level(
        self,
        emotional_signals: Dict[str, float],
        intent_signals: Dict[str, float]
    ) -> str:
        """
        Determine confidence level based on emotions and intent.
        
        Returns: "LOW" | "MEDIUM" | "HIGH"
        """
        # Calculate emotional intensity
        emotional_intensity = sum([
            emotional_signals["confusion"],
            emotional_signals["anxiety"],
            emotional_signals["overwhelm"]
        ]) / 3
        
        # Find dominant intent
        max_intent = max(intent_signals.values()) if intent_signals else 0
        
        # Determine confidence
        if emotional_intensity > 0.6 or max_intent < 0.4:
            return "LOW"  # High emotion or unclear intent
        elif max_intent > 0.7 and emotional_intensity < 0.4:
            return "HIGH"  # Clear intent, low emotion
        else:
            return "MEDIUM"  # Mixed signals
    
    def _find_best_template(
        self,
        question: str,
        question_embedding: np.ndarray,
        emotional_signals: Dict[str, float],
        intent_signals: Dict[str, float],
        confidence_level: str
    ) -> Optional[Dict[str, Any]]:
        """
        Find best matching template using semantic similarity.
        
        Uses cosine similarity between question embedding and template embeddings.
        """
        try:
            # Fetch templates from database (filter by confidence level)
            templates_response = self.supabase.table("amora_templates") \
                .select("*") \
                .eq("confidence_level", confidence_level) \
                .execute()
            
            if not templates_response.data:
                logger.warning(f"No templates found for confidence level: {confidence_level}")
                return None
            
            # Find most similar template
            best_template = None
            best_score = 0.0
            
            for template in templates_response.data:
                # Get template embedding
                template_embedding = np.array(template.get("embedding", []))
                
                if len(template_embedding) == 0:
                    continue
                
                # Compute cosine similarity
                similarity = cosine_similarity(
                    [question_embedding],
                    [template_embedding]
                )[0][0]
                
                # Boost score if emotional state matches
                if self._emotions_match(emotional_signals, template.get("emotional_state", "")):
                    similarity *= 1.2
                
                # Boost score based on priority
                priority_boost = template.get("priority", 0) * 0.05
                final_score = similarity + priority_boost
                
                if final_score > best_score:
                    best_score = final_score
                    best_template = template
            
            logger.info(f"Selected template with similarity score: {best_score:.2f}")
            return best_template
            
        except Exception as e:
            logger.error(f"Error finding template: {e}")
            return None
    
    def _emotions_match(self, signals: Dict[str, float], template_state: str) -> bool:
        """Check if emotional signals match template emotional state."""
        if not template_state:
            return False
        
        # Simple matching: check if dominant emotion is in template state
        dominant_emotion = max(signals, key=signals.get)
        return dominant_emotion in template_state.lower()
    
    def _personalize_response(
        self,
        template: Optional[Dict[str, Any]],
        emotional_signals: Dict[str, float],
        context: Dict[str, Any]
    ) -> str:
        """
        Personalize template response with emotional reflection and context.
        """
        if not template:
            return self._fallback_response().message
        
        response = template.get("response_template", "")
        
        # Add emotional reflection for high emotions
        if emotional_signals["confusion"] > 0.7:
            response = "It sounds like you're feeling really confused. " + response
        elif emotional_signals["anxiety"] > 0.7:
            response = "I can sense some anxiety in what you're sharing. " + response
        elif emotional_signals["overwhelm"] > 0.7:
            response = "It seems like you're feeling overwhelmed. " + response
        
        # Add continuity for returning users
        if context.get("previous_topics"):
            last_topic = context["previous_topics"][-1]
            if len(response) < 300:  # Only add if response isn't too long
                response += f" I remember we talked about {last_topic} before—is this connected?"
        
        return response
    
    def _load_context(self, user_id: UUID, is_paid_user: bool) -> Dict[str, Any]:
        """Load user context (session for free, persistent for paid)."""
        # TODO: Implement Redis session storage
        # For now, return empty context
        return {
            "previous_topics": [],
            "session_start": None
        }
    
    def _update_context(
        self,
        user_id: UUID,
        question: str,
        response: str,
        is_paid_user: bool
    ):
        """Update user context (session or persistent)."""
        # TODO: Implement context storage
        pass
    
    def _compute_confidence_score(self, confidence_level: str) -> float:
        """Convert confidence level to numeric score."""
        confidence_map = {
            "LOW": 0.5,
            "MEDIUM": 0.7,
            "HIGH": 0.9
        }
        return confidence_map.get(confidence_level, 0.7)
    
    def _handle_empty_input(self) -> CoachResponse:
        """Handle empty or very short input."""
        return CoachResponse(
            message="I'm here whenever you're ready to talk. What's on your mind?",
            mode=CoachMode.LEARN,
            confidence=0.6,
            referenced_data={"empty_input": True}
        )
    
    def _fallback_response(self) -> CoachResponse:
        """Fallback response when system encounters errors."""
        return CoachResponse(
            message="I'm here to help you explore relationship topics. What would you like to talk about?",
            mode=CoachMode.LEARN,
            confidence=0.5,
            referenced_data={"fallback": True}
        )
