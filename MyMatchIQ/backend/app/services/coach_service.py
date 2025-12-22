"""
AI Coach Service (Ella) - Template-based explanation generator
"""
from typing import Dict, Optional, List
from uuid import UUID
from dataclasses import dataclass
from app.models.pydantic_models import CoachMode, CoachResponse
from app.services.scoring_logic import BlueprintProfile, UserProfile


@dataclass
class CoachContext:
    """Context data for coach responses"""
    category_scores: Dict[str, float]
    overall_score: Optional[int] = None
    category: Optional[str] = None
    blueprint: Optional[BlueprintProfile] = None
    user_profile: Optional[UserProfile] = None
    red_flags: Optional[List[Dict]] = None
    confidence_score: float = 0.5
    confidence_reason: Optional[str] = None
    data_sufficiency: Optional[Dict] = None
    reflection_notes: Optional[Dict] = None
    explanation_metadata: Optional[Dict] = None  # Explanation traceability metadata
    user_name: Optional[str] = None  # User's name if known
    chat_history: Optional[List[Dict]] = None  # Previous chat messages


# Forbidden phrases that must not appear in responses
FORBIDDEN_PHRASES = [
    'you should',
    'you must',
    'you need to',
    'this is toxic',
    'they are manipulating',
    'leave immediately',
    'you deserve better',
    "this relationship won't work",
    'you have to',
    "you can't"
]


# Learn mode topics
LEARN_TOPICS = {
    'value_alignment': {
        'keywords': ['value', 'values', 'belief', 'beliefs', 'priority', 'priorities', 'important', 'matter', 'matters'],
        'definition': 'Value alignment means your core beliefs and priorities are compatible.',
        'why_matters': 'When values align, decisions and life directions tend to be easier to navigate together.',
        'misunderstandings': 'Value alignment doesn\'t mean identical values - it means compatible values that can coexist.'
    },
    'boundary_consistency': {
        'keywords': ['boundary', 'boundaries', 'limit', 'limits', 'respect', 'respects', 'deal breaker', 'deal-breaker'],
        'definition': 'Boundary consistency means your stated boundaries are respected and maintained over time.',
        'why_matters': 'Consistent boundaries create safety and predictability in relationships.',
        'misunderstandings': 'Boundaries aren\'t walls - they\'re the framework that allows intimacy to grow safely.'
    },
    'communication_reliability': {
        'keywords': ['communication', 'communicate', 'talk', 'talking', 'say', 'says', 'promise', 'promises', 'word', 'words', 'action', 'actions'],
        'definition': 'Communication reliability means words and actions align consistently.',
        'why_matters': 'Reliable communication builds trust and reduces uncertainty.',
        'misunderstandings': 'Reliability doesn\'t mean perfect communication - it means patterns you can depend on.'
    },
    'emotional_safety': {
        'keywords': ['emotional', 'emotion', 'feel', 'feeling', 'feelings', 'safe', 'safety', 'vulnerable', 'vulnerability', 'trust', 'trusts'],
        'definition': 'Emotional safety means feeling able to be vulnerable without fear of harm or judgment.',
        'why_matters': 'Safety allows deeper connection and authentic expression.',
        'misunderstandings': 'Safety isn\'t the absence of conflict - it\'s the presence of respect during conflict.'
    },
    'red_flags': {
        'keywords': ['red flag', 'red flags', 'warning', 'warnings', 'concern', 'concerns', 'danger', 'dangerous', 'toxic', 'abuse', 'abusive'],
        'definition': 'Red flags are patterns or behaviors that indicate potential risk or incompatibility.',
        'why_matters': 'Recognizing red flags early can help you make informed decisions about relationships.',
        'misunderstandings': 'Red flags don\'t predict the future - they indicate patterns based on your own boundaries and values.'
    },
    'first_dates': {
        'keywords': ['first date', 'first dates', 'date', 'dating', 'meet', 'meeting', 'meet up', 'coffee', 'dinner'],
        'definition': 'First dates are initial opportunities to assess compatibility and connection.',
        'why_matters': 'Early interactions can reveal important information about communication style, values, and emotional availability.',
        'misunderstandings': 'One date doesn\'t tell the whole story - it\'s one data point in a larger assessment.'
    },
    'emotional_availability': {
        'keywords': ['emotional availability', 'available', 'unavailable', 'commitment', 'commit', 'ready', 'not ready'],
        'definition': 'Emotional availability means being open and ready to form a meaningful connection.',
        'why_matters': 'Compatibility requires both people to be emotionally available for connection.',
        'misunderstandings': 'Emotional availability isn\'t about being perfect - it\'s about being present and willing to connect.'
    }
}


class CoachService:
    """
    AI Coach service - generates explanations in different modes.
    All responses are template-based, not LLM-generated.
    """
    
    def get_response(
        self,
        mode: CoachMode,
        context: CoachContext,
        user_message: Optional[str] = None
    ) -> CoachResponse:
        """
        Route request to appropriate mode handler.
        Includes pre-intent interception for identity/meta questions.
        """
        # TASK 1: Pre-intent interception layer
        # Handle identity and meta capability questions BEFORE routing
        if user_message:
            from app.utils.identity_handler import handle_pre_intent
            pre_intent_response = handle_pre_intent(user_message)
            if pre_intent_response:
                return pre_intent_response
        
        # Personalize greeting if first message and name is known
        if context.user_name and (not context.chat_history or len(context.chat_history) == 0):
            # This is handled in the API layer now, but we can still personalize responses
            pass
        
        # Route to appropriate mode handler
        if mode == CoachMode.EXPLAIN:
            response = self._explain_mode(context)
        elif mode == CoachMode.REFLECT:
            response = self._reflect_mode(context)
        elif mode == CoachMode.LEARN:
            response = self._learn_mode(context, user_message)
        elif mode == CoachMode.SAFETY:
            response = self._safety_mode(context)
        else:
            raise ValueError(f"Unknown mode: {mode}")
        
        # TASK 2: Add confidence-boosting micro-response framing
        response = self._add_micro_response_framing(response, context, user_message)
        
        return response
    
    def _add_micro_response_framing(
        self,
        response: CoachResponse,
        context: CoachContext,
        user_message: Optional[str] = None
    ) -> CoachResponse:
        """
        TASK 2: Add neutral, informational micro-response framing.
        Never softens red flags or overrides confidence gating.
        """
        # Don't add if response already contains safety warning or confidence note
        message_lower = response.message.lower()
        if any(phrase in message_lower for phrase in [
            'note:', 'warning', 'low confidence', 'limited data', 'safety flag'
        ]):
            return response
        
        # Don't add to identity/meta responses (already handled)
        if response.referenced_data.get('intent') in ['identity', 'meta_capability']:
            return response
        
        # Don't add to initial responses (no user message) - these are already complete
        if not user_message:
            return response
        
        # Don't add if this is an initial response marker
        if response.referenced_data.get('is_initial') or response.referenced_data.get('no_assessment_data'):
            return response
        
        # Select appropriate micro-response based on context
        micro_response = None
        
        # Check if we have assessment data
        if context.overall_score is not None:
            if context.confidence_score < 0.6:
                micro_response = "This result is marked as low confidence due to limited data."
            else:
                micro_response = "Based on the information you've shared so far..."
        elif context.category_scores:
            micro_response = "Based on the information you've shared so far..."
        elif context.red_flags:
            # For red flags, reference boundary importance
            micro_response = "This signal appears because it crosses a boundary you marked as important."
        else:
            micro_response = "Here's how this is being evaluated."
        
        # Prepend micro-response if selected
        if micro_response:
            # Check that message doesn't already start with similar framing
            if not response.message.lower().startswith(micro_response.lower()[:20]):
                response.message = f"{micro_response} {response.message}"
        
        return response
    
    def _explain_mode(self, context: CoachContext) -> CoachResponse:
        """Explain scan results."""
        if not context.overall_score:
            # No assessment data - provide simple, helpful message
            greeting = f"{context.user_name}, " if context.user_name else ""
            message = f"{greeting}I don't have assessment results to explain yet. Please complete an assessment first. Once you have results, I can help explain compatibility patterns, communication signals, and relationship safety."
            return CoachResponse(
                message=message,
                mode=CoachMode.EXPLAIN,
                confidence=0.0,
                referenced_data={'no_assessment_data': True}
            )
        
        parts = []
        
        # Personalize with user name if available
        if context.user_name:
            parts.append(f"{context.user_name}, based on your assessment, I evaluated compatibility across several areas.")
        else:
            parts.append("Based on your assessment, I evaluated compatibility across several areas.")
        
        # 2. Overall score explanation
        category_label = context.category.replace('-', ' ') if context.category else 'compatibility'
        parts.append(f"Your overall compatibility score is {context.overall_score}, which suggests {category_label}.")
        
        # 3. Category breakdown
        if context.category_scores:
            parts.append("Here's how different areas aligned:")
            
            sorted_categories = sorted(
                context.category_scores.items(),
                key=lambda x: x[1],
                reverse=True
            )
            
            # Top areas
            top_areas = sorted_categories[:2]
            for cat, score in top_areas:
                cat_name = cat.replace('_', ' ').title()
                parts.append(f"- {cat_name}: {score}%")
            
            # Use explanation metadata for more detailed explanations
            if context.explanation_metadata and 'category_explanations' in context.explanation_metadata:
                category_explanations = context.explanation_metadata['category_explanations']
                
                # Top areas with explanation
                top_areas = sorted_categories[:2]
                for cat, score in top_areas:
                    cat_name = cat.replace('_', ' ').title()
                    parts.append(f"- {cat_name}: {score}%")
                    
                    # Add top contributing signal if available
                    if cat in category_explanations:
                        exp = category_explanations[cat]
                        if exp.get('top_signals') and len(exp['top_signals']) > 0:
                            top_signal = exp['top_signals'][0]
                            parts.append(f"  The strongest signal here was: {top_signal['question_text']} ({top_signal['rating']})")
                
                # Areas of concern
                concern_areas = [cat for cat, score in sorted_categories if score < 60]
                if concern_areas:
                    concern_names = [c.replace('_', ' ').title() for c in concern_areas[:2]]
                    parts.append(f"Areas with lower alignment include: {', '.join(concern_names)}.")
            else:
                # Fallback to simple breakdown
                top_areas = sorted_categories[:2]
                for cat, score in top_areas:
                    cat_name = cat.replace('_', ' ').title()
                    parts.append(f"- {cat_name}: {score}%")
                
                # Areas of concern
                concern_areas = [cat for cat, score in sorted_categories if score < 60]
                if concern_areas:
                    concern_names = [c.replace('_', ' ').title() for c in concern_areas[:2]]
                    parts.append(f"Areas with lower alignment include: {', '.join(concern_names)}.")
        
        # 4. Blueprint reference (enhanced with explanation metadata)
        if context.blueprint and context.blueprint.top_priorities:
            top_priority = context.blueprint.top_priorities[0]
            priority_score = context.category_scores.get(top_priority, 0)
            priority_name = top_priority.replace('_', ' ').title()
            
            # Use explanation metadata to show weight impact
            weight_info = ""
            if context.explanation_metadata and 'category_explanations' in context.explanation_metadata:
                if top_priority in context.explanation_metadata['category_explanations']:
                    exp = context.explanation_metadata['category_explanations'][top_priority]
                    weight = exp.get('category_weight', 1.0)
                    if weight > 1.0:
                        weight_info = f" (weighted {weight:.1f}x due to your priorities)"
            
            parts.append(
                f"Since {priority_name} is something you ranked as highly important, "
                f"the {priority_score}% alignment there{weight_info} may feel more significant to you "
                f"than other areas."
            )
        
        # 5. Confidence note with data sufficiency acknowledgment
        from app.services.confidence_gating import ConfidenceGatingEngine
        gating_engine = ConfidenceGatingEngine()
        
        should_acknowledge = False
        if context.data_sufficiency:
            should_acknowledge = gating_engine.should_force_limited_data_acknowledgment(
                context.confidence_score,
                type('DataSufficiencyCheck', (), context.data_sufficiency)()
            )
        elif context.confidence_score < 0.6:
            should_acknowledge = True
        
        if should_acknowledge:
            if context.confidence_reason:
                parts.append(f"Note: {context.confidence_reason}")
            else:
                parts.append(
                    "Note: This assessment has lower confidence due to limited responses. "
                    "More questions would provide a clearer picture."
                )
        
        message = " ".join(parts)
        
        return CoachResponse(
            message=message,
            mode=CoachMode.EXPLAIN,
            confidence=context.confidence_score,
            referenced_data={
                'overall_score': context.overall_score,
                'category': context.category,
                'category_scores': context.category_scores
            }
        )
    
    def _reflect_mode(self, context: CoachContext) -> CoachResponse:
        """Generate reflection questions."""
        questions = []
        
        if not context.category_scores:
            questions = [
                "What patterns do you notice in your past relationships?",
                "What values matter most to you in a connection?",
                "What boundaries are non-negotiable for you?"
            ]
        else:
            # Questions based on results
            sorted_scores = sorted(context.category_scores.items(), key=lambda x: x[1])
            if len(sorted_scores) >= 2:
                lowest = sorted_scores[0]
                highest = sorted_scores[-1]
                
                if highest[1] - lowest[1] > 30:
                    questions.append(
                        f"You showed strong alignment in {highest[0].replace('_', ' ')} "
                        f"but lower alignment in {lowest[0].replace('_', ' ')}. "
                        f"What does that difference mean to you?"
                    )
            
            # Deal-breakers
            if context.blueprint and context.blueprint.deal_breakers:
                questions.append(
                    "You identified some deal-breakers in your blueprint. "
                    "How do those boundaries feel in practice?"
                )
            
            # Red flags
            if context.red_flags:
                high_severity = [f for f in context.red_flags if f.get('severity') in ['high', 'critical']]
                if high_severity:
                    questions.append(
                        "Some patterns were flagged as higher risk based on your boundaries. "
                        "What do those patterns mean to you?"
                    )
            
            # General reflection
            questions.append("What patterns do you notice in how you assess connections?")
        
        # Ensure we have 2-4 questions
        if len(questions) < 2:
            questions.extend([
                "What matters most to you in a connection?",
                "What boundaries are important to you?"
            ])
        
        questions = questions[:4]  # Max 4
        
        message = "Based on what you shared, here are a few questions you may want to sit with:\n\n"
        message += "\n".join([f"• {q}" for q in questions])
        
        return CoachResponse(
            message=message,
            mode=CoachMode.REFLECT,
            confidence=0.8,
            referenced_data={'question_count': len(questions)}
        )
    
    def _learn_mode(self, context: CoachContext, user_message: Optional[str] = None) -> CoachResponse:
        """Provide educational content based on user's question."""
        from app.utils.chat_utils import is_question
        
        # Personalize with user name if available
        greeting = ""
        if context.user_name:
            greeting = f"{context.user_name}, "
        
        # Detect topic from user message
        selected_topic = 'value_alignment'  # Default
        user_asked_question = False
        
        if user_message:
            user_message_lower = user_message.lower()
            user_asked_question = is_question(user_message)
            topic_scores = {}
            
            # Score each topic based on keyword matches
            for topic_key, topic_data in LEARN_TOPICS.items():
                score = 0
                keywords = topic_data.get('keywords', [])
                for keyword in keywords:
                    if keyword in user_message_lower:
                        score += 1
                if score > 0:
                    topic_scores[topic_key] = score
            
            # Select topic with highest score
            if topic_scores:
                selected_topic = max(topic_scores.items(), key=lambda x: x[1])[0]
        else:
            # No user message - this is initial/default response
            # Don't show "That's a great question!" or the list
            # Just provide a simple greeting
            if greeting:
                message = f"{greeting}I can help you understand compatibility patterns, communication signals, and relationship safety. What would you like to learn about?"
            else:
                message = "I can help you understand compatibility patterns, communication signals, and relationship safety. What would you like to learn about?"
            
            return CoachResponse(
                message=message,
                mode=CoachMode.LEARN,
                confidence=1.0,
                referenced_data={'topic': 'default', 'is_initial': True}
            )
        
        # Get topic data
        topic_data = LEARN_TOPICS.get(selected_topic, LEARN_TOPICS['value_alignment'])
        
        # Build response
        message_parts = []
        if greeting:
            message_parts.append(greeting)
        
        # Only acknowledge if user actually asked a question (not just any message)
        if user_asked_question:
            message_parts.append("That's a great question!")
        
        message_parts.extend([
            topic_data['definition'],
            topic_data['why_matters'],
            topic_data['misunderstandings']
        ])
        
        # Add follow-up only if user asked a question
        if user_asked_question:
            message_parts.append("What specific aspect would you like to explore?")
        
        message = " ".join(message_parts)
        
        return CoachResponse(
            message=message,
            mode=CoachMode.LEARN,
            confidence=1.0,
            referenced_data={'topic': selected_topic}
        )
    
    def _safety_mode(self, context: CoachContext) -> CoachResponse:
        """Explain red flags and safety concerns."""
        if not context.red_flags:
            return CoachResponse(
                message="No safety flags were detected in this assessment.",
                mode=CoachMode.SAFETY,
                confidence=1.0,
                referenced_data={}
            )
        
        # Group by severity
        by_severity = {
            'critical': [],
            'high': [],
            'medium': [],
            'low': []
        }
        
        for flag in context.red_flags:
            severity = flag.get('severity', 'medium').lower()
            if severity in by_severity:
                by_severity[severity].append(flag)
        
        parts = []
        
        # Critical flags first
        if by_severity['critical']:
            parts.append("This assessment detected patterns marked as critical risk signals.")
            for flag in by_severity['critical'][:2]:  # Max 2
                signal = flag.get('signal', 'Concerning pattern')
                parts.append(
                    f"- {signal}. "
                    f"This pattern conflicts with boundaries you defined as non-negotiable."
                )
            parts.append(
                "These patterns don't predict outcomes, but they do indicate higher risk "
                "based on your own criteria."
            )
        # High severity
        elif by_severity['high']:
            parts.append("This assessment detected patterns marked as higher-risk signals.")
            for flag in by_severity['high'][:2]:
                signal = flag.get('signal', 'Concerning pattern')
                parts.append(
                    f"- {signal}. "
                    f"This pattern may conflict with what you've indicated matters to you."
                )
            parts.append(
                "These patterns suggest increased risk relative to your stated boundaries."
            )
        # Medium/Low
        else:
            parts.append("Some patterns were flagged for awareness.")
            for flag in (by_severity['medium'] + by_severity['low'])[:2]:
                signal = flag.get('signal', 'Pattern to observe')
                parts.append(f"- {signal}")
            parts.append("These are areas to observe, not necessarily deal-breakers.")
        
        # Reference boundaries
        if context.blueprint and context.blueprint.deal_breakers:
            parts.append(
                "These flags are based on boundaries and priorities you defined in your blueprint."
            )
        
        message = " ".join(parts)
        
        return CoachResponse(
            message=message,
            mode=CoachMode.SAFETY,
            confidence=context.confidence_score,
            referenced_data={
                'flag_count': len(context.red_flags),
                'severity_breakdown': {k: len(v) for k, v in by_severity.items()}
            }
        )
    
    def validate_response(self, response: CoachResponse) -> bool:
        """
        Validate response doesn't violate constraints.
        """
        message_lower = response.message.lower()
        
        for phrase in FORBIDDEN_PHRASES:
            if phrase in message_lower:
                return False
        
        # Check for directive language (except in REFLECT mode)
        if response.mode != CoachMode.REFLECT:
            if 'you should' in message_lower or 'you must' in message_lower:
                return False
        
        return True

