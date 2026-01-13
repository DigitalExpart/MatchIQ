"""
Amora V2 - Semantic AI Coach Service
Production-grade LLM-powered relationship coach with emotional intelligence.
"""
from typing import Dict, Any, Optional, List
from uuid import UUID
import logging
import json
from datetime import datetime
from openai import OpenAI
from pydantic import BaseModel

from app.models.pydantic_models import CoachMode, CoachRequest, CoachResponse
from app.database import get_supabase_client

logger = logging.getLogger(__name__)

# Initialize OpenAI client (configure in environment)
# Set OPENAI_API_KEY in environment variables
openai_client = None  # Will be initialized in __init__


class EmotionalSignals(BaseModel):
    """Detected emotional signals with confidence scores."""
    confusion: float = 0.0
    sadness: float = 0.0
    anxiety: float = 0.0
    frustration: float = 0.0
    hope: float = 0.0
    emotional_distance: float = 0.0
    overwhelm: float = 0.0


class IntentSignals(BaseModel):
    """Intent classification with probabilities."""
    greeting_testing: float = 0.0
    venting: float = 0.0
    reflection: float = 0.0
    advice_seeking: float = 0.0
    reassurance_seeking: float = 0.0
    decision_making: float = 0.0
    curiosity_learning: float = 0.0
    confidence_level: str = "MEDIUM"  # LOW | MEDIUM | HIGH


class AmoraV2Service:
    """
    Semantically intelligent AI coach using LLM technology.
    Replaces template-based keyword matching with emotional understanding.
    """
    
    def __init__(self):
        """Initialize Amora V2 service with LLM client."""
        try:
            self.client = OpenAI()  # Reads OPENAI_API_KEY from environment
            self.model = "gpt-4-turbo-preview"  # or "gpt-4o-mini" for cost savings
            logger.info("Amora V2 initialized with OpenAI")
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI client: {e}")
            self.client = None
    
    def get_response(
        self,
        request: CoachRequest,
        user_id: UUID,
        is_paid_user: bool = False
    ) -> CoachResponse:
        """
        Main entry point for Amora V2 responses.
        
        Args:
            request: User's question/message
            user_id: User identifier
            is_paid_user: Whether user has paid subscription
            
        Returns:
            Emotionally intelligent, context-aware response
        """
        if not self.client:
            # Fallback to V1 if LLM unavailable
            logger.warning("OpenAI client not available, using fallback")
            return self._fallback_response(request)
        
        try:
            # Step 1: Load context (session + memory for paid users)
            context = self._load_context(user_id, is_paid_user)
            
            # Step 2: Detect emotional signals
            emotional_signals = self._detect_emotional_signals(
                request.specific_question or "",
                context
            )
            
            # Step 3: Classify intent (soft, multi-label)
            intent_signals = self._classify_intent(
                request.specific_question or "",
                emotional_signals,
                context
            )
            
            # Step 4: Select response strategy
            strategy = self._select_response_strategy(
                intent_signals,
                emotional_signals
            )
            
            # Step 5: Generate LLM response with guardrails
            message = self._generate_response(
                request.specific_question or "",
                emotional_signals,
                intent_signals,
                strategy,
                context,
                is_paid_user
            )
            
            # Step 6: Validate safety
            if not self._validate_safety(message):
                logger.warning("Response failed safety check")
                message = "I want to make sure I'm being helpful. Could you tell me a bit more about what you're looking for?"
            
            # Step 7: Update memory (paid users only)
            if is_paid_user:
                self._update_memory(user_id, request.specific_question or "", emotional_signals, intent_signals)
            
            # Step 8: Update session context
            self._update_session_context(user_id, request.specific_question or "", message)
            
            return CoachResponse(
                message=message,
                mode=CoachMode.LEARN,
                confidence=self._compute_confidence(intent_signals),
                referenced_data={
                    "emotional_signals": emotional_signals.dict(),
                    "intent_signals": intent_signals.dict(),
                    "strategy": strategy,
                    "is_paid": is_paid_user
                }
            )
            
        except Exception as e:
            logger.error(f"Error in Amora V2 response generation: {e}", exc_info=True)
            return self._fallback_response(request)
    
    def _detect_emotional_signals(
        self,
        message: str,
        context: Dict[str, Any]
    ) -> EmotionalSignals:
        """
        Detect emotional signals in user message using LLM.
        
        Returns scores 0.0-1.0 for each emotion.
        """
        if not message or not message.strip():
            return EmotionalSignals()
        
        try:
            prompt = f"""Analyze the emotional signals in this user message.
Return a JSON object with scores 0.0-1.0 for each emotion:

{{
  "confusion": 0.0,
  "sadness": 0.0,
  "anxiety": 0.0,
  "frustration": 0.0,
  "hope": 0.0,
  "emotional_distance": 0.0,
  "overwhelm": 0.0
}}

User message: "{message}"

Return ONLY the JSON object, no explanation."""

            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You are an expert at detecting emotional signals in text."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=200,
                response_format={"type": "json_object"}
            )
            
            signals_data = json.loads(response.choices[0].message.content)
            return EmotionalSignals(**signals_data)
            
        except Exception as e:
            logger.error(f"Error detecting emotional signals: {e}")
            return EmotionalSignals()
    
    def _classify_intent(
        self,
        message: str,
        emotional_signals: EmotionalSignals,
        context: Dict[str, Any]
    ) -> IntentSignals:
        """
        Classify user intent with soft, multi-label probabilities.
        
        Returns probability scores for each intent type.
        """
        if not message or not message.strip():
            return IntentSignals(greeting_testing=1.0, confidence_level="LOW")
        
        try:
            # Compute confidence level based on emotional signals
            emotional_intensity = sum([
                emotional_signals.confusion,
                emotional_signals.sadness,
                emotional_signals.anxiety,
                emotional_signals.overwhelm
            ]) / 4
            
            prompt = f"""Analyze the user's intent in this message. Consider their emotional state.

Emotional signals: {emotional_signals.dict()}

User message: "{message}"

Return a JSON object with probability scores 0.0-1.0 for each intent:

{{
  "greeting_testing": 0.0,
  "venting": 0.0,
  "reflection": 0.0,
  "advice_seeking": 0.0,
  "reassurance_seeking": 0.0,
  "decision_making": 0.0,
  "curiosity_learning": 0.0
}}

Return ONLY the JSON object."""

            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You are an expert at understanding user intent in relationship conversations."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=200,
                response_format={"type": "json_object"}
            )
            
            intent_data = json.loads(response.choices[0].message.content)
            
            # Determine confidence level
            max_intent = max(intent_data.values())
            if emotional_intensity > 0.6 or max_intent < 0.4:
                confidence = "LOW"
            elif max_intent > 0.7 and emotional_intensity < 0.4:
                confidence = "HIGH"
            else:
                confidence = "MEDIUM"
            
            intent_data["confidence_level"] = confidence
            return IntentSignals(**intent_data)
            
        except Exception as e:
            logger.error(f"Error classifying intent: {e}")
            return IntentSignals(confidence_level="LOW")
    
    def _select_response_strategy(
        self,
        intent_signals: IntentSignals,
        emotional_signals: EmotionalSignals
    ) -> str:
        """
        Select response strategy based on confidence and emotional state.
        
        Returns: "LOW" | "MEDIUM" | "HIGH"
        """
        return intent_signals.confidence_level
    
    def _generate_response(
        self,
        message: str,
        emotional_signals: EmotionalSignals,
        intent_signals: IntentSignals,
        strategy: str,
        context: Dict[str, Any],
        is_paid_user: bool
    ) -> str:
        """
        Generate LLM response following the selected strategy.
        
        Strategy rules:
        - LOW: Reflect + validate + ask ONE question. NO advice.
        - MEDIUM: Reflect + light insight + follow-up question.
        - HIGH: Brief reflection + structured guidance.
        """
        # Build strategy-specific system prompt
        base_personality = """You are Amora, an emotionally intelligent relationship coach.

PERSONALITY:
- Warm, calm, thoughtful
- Non-judgmental, non-directive
- Emotionally attuned
- Patient and reflective

TONE:
- Use "might", "could", "consider" instead of "should", "must"
- Reflect emotions before offering insight
- Ask gentle questions when unclear
- Keep responses concise (2-4 sentences max)

CONSTRAINTS:
- Never say "I don't understand"
- No generic fallbacks
- No commands or prescriptive advice
- No mention of being an AI unless asked
- Never ask multiple questions at once"""

        strategy_instructions = {
            "LOW": """
RESPONSE STRATEGY (LOW CONFIDENCE):
The user is emotional, venting, or unclear. DO NOT give advice.

1. Reflect their emotion using their language
2. Validate their feeling
3. Ask ONE gentle clarifying question
4. Stop there. No advice, no solutions.""",
            
            "MEDIUM": """
RESPONSE STRATEGY (MEDIUM CONFIDENCE):
The user has mixed feelings or multiple concerns.

1. Reflect emotion briefly
2. Offer a light insight or reframe
3. Ask a clarifying follow-up
4. Minimal advice, mostly exploration.""",
            
            "HIGH": """
RESPONSE STRATEGY (HIGH CONFIDENCE):
The user wants clear guidance.

1. Brief emotional acknowledgment
2. Offer structured insight
3. Use non-directive language ("might", "could")
4. Keep actionable but not prescriptive."""
        }
        
        system_prompt = f"""{base_personality}

{strategy_instructions.get(strategy, strategy_instructions["MEDIUM"])}

CURRENT CONTEXT:
Emotional signals: {emotional_signals.dict()}
Intent classification: {intent_signals.dict()}
User type: {"Paid (can reference patterns)" if is_paid_user else "Free (session only)"}

Previous messages: {context.get('recent_messages', [])}"""

        # Handle special cases
        if intent_signals.greeting_testing > 0.7:
            return "I'm Amora. I'm here to help you think through relationships and emotions at your own pace. What's been on your mind lately?"
        
        if not message or len(message.strip()) < 3:
            return "I'm here whenever you're ready to talk. What's on your mind?"
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                temperature=0.7,
                max_tokens=150,  # Keep responses concise
                top_p=0.9
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Error generating LLM response: {e}")
            return "I'm here to listen. What would you like to talk about?"
    
    def _validate_safety(self, message: str) -> bool:
        """
        Validate response meets safety and quality standards.
        
        Returns False if response contains harmful content.
        """
        # Check for directive language
        directive_words = ["you must", "you need to", "you have to", "you should definitely"]
        if any(word in message.lower() for word in directive_words):
            return False
        
        # Check minimum quality
        if len(message.strip()) < 20:
            return False
        
        # Could add OpenAI Moderation API call here
        return True
    
    def _load_context(self, user_id: UUID, is_paid_user: bool) -> Dict[str, Any]:
        """
        Load conversation context.
        
        Free users: Session only (in-memory, 30min expiry)
        Paid users: Persistent memory + patterns
        """
        # TODO: Implement session storage (Redis)
        # TODO: Implement memory retrieval for paid users (pgvector)
        return {
            "recent_messages": [],
            "patterns": [] if not is_paid_user else [],
            "session_start": datetime.utcnow().isoformat()
        }
    
    def _update_memory(
        self,
        user_id: UUID,
        message: str,
        emotional_signals: EmotionalSignals,
        intent_signals: IntentSignals
    ):
        """
        Update long-term memory for paid users.
        
        Stores themes, patterns, not raw messages.
        """
        # TODO: Implement memory storage
        # Extract themes, update pattern counts, store in pgvector
        pass
    
    def _update_session_context(
        self,
        user_id: UUID,
        user_message: str,
        amora_response: str
    ):
        """
        Update session context (both free and paid users).
        
        Keep last 5 messages for continuity.
        """
        # TODO: Implement session storage (Redis with 30min TTL)
        pass
    
    def _compute_confidence(self, intent_signals: IntentSignals) -> float:
        """Compute overall confidence score for the response."""
        confidence_map = {
            "LOW": 0.5,
            "MEDIUM": 0.7,
            "HIGH": 0.9
        }
        return confidence_map.get(intent_signals.confidence_level, 0.7)
    
    def _fallback_response(self, request: CoachRequest) -> CoachResponse:
        """
        Fallback to V1 template system if LLM unavailable.
        """
        message = "I'm here to help you explore relationship topics. What's been on your mind?"
        
        return CoachResponse(
            message=message,
            mode=CoachMode.LEARN,
            confidence=0.6,
            referenced_data={"fallback": True}
        )
