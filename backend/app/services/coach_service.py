"""
AI Coach Service - Generates explanations and insights.
Template-based, rule-driven responses (no LLM).
"""
from typing import Dict, Any, Optional
from uuid import UUID

from app.models.pydantic_models import CoachMode, CoachRequest, CoachResponse
from app.database import get_supabase_client
from app.models.db_models import ScanResult, Scan, Blueprint


class CoachService:
    """AI Coach service for generating explanations."""
    
    def get_response(
        self,
        request: CoachRequest,
        user_id: UUID
    ) -> CoachResponse:
        """Get coach response based on mode."""
        supabase = get_supabase_client()
        
        if request.mode == CoachMode.EXPLAIN:
            return self._explain_mode(request, supabase, user_id)
        elif request.mode == CoachMode.REFLECT:
            return self._reflect_mode(request, supabase, user_id)
        elif request.mode == CoachMode.LEARN:
            return self._learn_mode(request, supabase, user_id)
        elif request.mode == CoachMode.SAFETY:
            return self._safety_mode(request, supabase, user_id)
        else:
            raise ValueError(f"Unknown mode: {request.mode}")
    
    def _explain_mode(
        self,
        request: CoachRequest,
        supabase,
        user_id: UUID
    ) -> CoachResponse:
        """Explain scan results."""
        if not request.scan_result_id:
            raise ValueError("scan_result_id required for EXPLAIN mode")
        
        # Load scan result
        result = supabase.table("scan_results").select("*").eq(
            "id", str(request.scan_result_id)
        ).execute()
        
        if not result.data:
            raise ValueError("Scan result not found")
        
        scan_result = ScanResult.from_dict(result.data[0])
        
        # Generate explanation
        explanation = self._generate_explanation(scan_result, request.category)
        
        return CoachResponse(
            message=explanation,
            mode=CoachMode.EXPLAIN,
            confidence=scan_result.ai_analysis.get("confidence_score", 0.8),
            referenced_data={
                "overall_score": scan_result.overall_score,
                "category": scan_result.category,
                "category_scores": scan_result.category_scores
            }
        )
    
    def _reflect_mode(
        self,
        request: CoachRequest,
        supabase,
        user_id: UUID
    ) -> CoachResponse:
        """Generate reflection insights."""
        message = "Reflection mode helps you understand patterns in your relationships. "
        message += "Consider what patterns you notice across your assessments."
        
        return CoachResponse(
            message=message,
            mode=CoachMode.REFLECT,
            confidence=0.7,
            referenced_data={}
        )
    
    def _learn_mode(
        self,
        request: CoachRequest,
        supabase,
        user_id: UUID
    ) -> CoachResponse:
        """Answer learning questions."""
        if not request.specific_question:
            message = "I'm here to help you explore various relationship topics. I could provide insights on compatibility, communication, trust, boundaries, or any patterns you're curious about. What might you like to learn more about?"
        else:
            message = self._answer_question(request.specific_question, request.context)
        
        return CoachResponse(
            message=message,
            mode=CoachMode.LEARN,
            confidence=0.8,
            referenced_data={
                "question": request.specific_question,
                "context": request.context or {}
            }
        )
    
    def _safety_mode(
        self,
        request: CoachRequest,
        supabase,
        user_id: UUID
    ) -> CoachResponse:
        """Provide safety guidance."""
        if request.scan_result_id:
            result = supabase.table("scan_results").select("*").eq(
                "id", str(request.scan_result_id)
            ).execute()
            
            if result.data:
                scan_result = ScanResult.from_dict(result.data[0])
                red_flags = scan_result.red_flags
                
                if red_flags:
                    critical_flags = [f for f in red_flags if f.get("severity") == "critical"]
                    if critical_flags:
                        message = "⚠️ Critical safety concerns detected. Please prioritize your safety and consider seeking support."
                    else:
                        message = "Some concerns were identified. Take time to reflect and consider your boundaries."
                else:
                    message = "No major safety concerns detected in this assessment."
            else:
                message = "Safety check: Trust your instincts. If something feels off, it's important to listen to that feeling."
        else:
            message = "Safety check: Trust your instincts. If something feels off, it's important to listen to that feeling."
        
        return CoachResponse(
            message=message,
            mode=CoachMode.SAFETY,
            confidence=0.9,
            referenced_data={}
        )
    
    def _generate_explanation(
        self,
        scan_result: ScanResult,
        category: Optional[str]
    ) -> str:
        """Generate explanation for scan results."""
        if category:
            # Explain specific category
            score = scan_result.category_scores.get(category, 0)
            message = f"The {category} category scored {score}/100. "
            
            if score >= 70:
                message += "This indicates strong alignment in this area."
            elif score >= 50:
                message += "This area shows moderate compatibility with room for growth."
            else:
                message += "This area may need attention and open communication."
        else:
            # Explain overall results
            message = f"Your compatibility score is {scan_result.overall_score}/100, "
            message += f"which places this relationship in the '{scan_result.category}' category. "
            
            strengths = scan_result.ai_analysis.get("strengths", [])
            if strengths:
                message += f"Strong areas include: {', '.join(strengths)}. "
            
            awareness = scan_result.ai_analysis.get("awareness_areas", [])
            if awareness:
                message += f"Areas to be aware of: {', '.join(awareness)}."
        
        return message
    
    def _answer_question(self, question: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Answer a learning question (template-based)."""
        question_lower = question.lower()
        
        # Love and emotional confusion questions (prioritize these)
        if any(phrase in question_lower for phrase in ["in love", "love them", "love him", "love her", "falling in love", "know if i love", "if im in love", "if i'm in love"]):
            if any(word in question_lower for word in ["confused", "don't know", "dont know", "unsure", "not sure"]):
                return "It sounds like you're feeling confused about your feelings, which is completely understandable. Love can be complex and doesn't always arrive with a clear label. You might consider: Do you think about them when they're not around? Do you feel happy and energized when you're together? Are you genuinely interested in their well-being, even when it doesn't directly benefit you? Confusion often comes when feelings are developing—give yourself time and space to notice what your gut tells you when you're with them versus when you're apart."
            else:
                return "Understanding your feelings about someone can be complex. Love might feel different for everyone, but some signs could include: thinking about them frequently, feeling genuinely happy when you're together, caring about their well-being, wanting to share experiences with them, and feeling comfortable being yourself around them. Take time to reflect on how you feel when you're with them versus apart, and trust what your heart and intuition are telling you."
        
        # Confusion and uncertainty questions
        if any(word in question_lower for word in ["confused", "don't know", "dont know", "unsure", "not sure", "uncertain"]):
            return "Feeling confused or uncertain in a relationship is normal and often indicates you're taking things seriously. It might help to ask yourself: What specifically feels confusing? Are there patterns from past relationships affecting how you see things now? Sometimes confusion comes from trying to fit feelings into labels too quickly. Give yourself permission to explore your emotions without rushing to define them. Paying attention to your physical responses, your thoughts when you're alone, and how you feel after spending time together could provide clarity over time."
        
        # Check for relationship readiness questions
        if any(phrase in question_lower for phrase in ["ready for", "prepared for", "ready to commit", "should i commit"]):
            return "Readiness for a committed relationship often involves feeling secure in yourself, having clear communication skills, and being open to vulnerability. It might help to consider: Are you able to express your needs? Can you handle conflict constructively? Do you feel ready to invest time and energy into building something meaningful? There's no perfect time, but feeling emotionally available and having realistic expectations could be important indicators."
        
        # Communication and relationships
        if any(word in question_lower for word in ["communication", "communicate", "talk", "conversation", "express"]):
            return "Effective communication might include active listening, expressing feelings clearly, and creating safe space for dialogue. It could help to focus on 'I' statements and validate your partner's perspective."
        
        if any(word in question_lower for word in ["trust", "honesty", "lie", "lying"]):
            return "Trust may develop through consistent actions, open communication, and mutual respect. Building trust could involve being reliable, transparent, and creating opportunities for vulnerability in safe ways."
        
        if any(word in question_lower for word in ["conflict", "argument", "fight", "disagree"]):
            return "Healthy conflict resolution might involve staying calm, listening actively, and focusing on solutions rather than blame. It could be helpful to take breaks when needed and approach disagreements as a team working on a shared problem."
        
        if any(word in question_lower for word in ["emotional", "emotion", "feeling", "vulnerability"]):
            return "Emotional connection may deepen through sharing feelings authentically and responding with empathy. Creating emotional safety could involve being non-judgmental, showing genuine interest, and validating each other's experiences."
        
        if any(word in question_lower for word in ["boundary", "boundaries", "limit", "respect"]):
            return "Healthy boundaries might help define what's acceptable in a relationship. Setting boundaries could involve communicating your needs clearly, respecting your partner's limits, and recognizing that boundaries may evolve over time."
        
        # Red flags and safety
        if any(word in question_lower for word in ["red flag", "warning sign", "safety", "concern"]):
            return "Red flags are patterns that might suggest potential concerns. They could range from minor caution signs to critical safety issues. Trust your instincts—if something feels off, it's likely worth exploring those feelings."
        
        # Compatibility
        if any(word in question_lower for word in ["compatibility", "score", "match", "compatible"]):
            return "Compatibility scores may indicate how responses align with your blueprint. Higher scores could suggest stronger alignment in values, communication, and goals. Remember that compatibility is just one factor in relationship success."
        
        # Values and goals
        if any(word in question_lower for word in ["value", "goal", "future", "priority"]):
            return "Shared values and goals might provide a foundation for long-term compatibility. It could be helpful to discuss life priorities, relationship expectations, and future plans openly to see where you align."
        
        # Blueprint/Assessment
        if any(word in question_lower for word in ["blueprint", "self-assessment", "assessment"]):
            return "Your blueprint may reflect what matters most to you in relationships. It could help the AI understand your priorities and values when evaluating potential matches or current relationships."
        
        # Feelings and emotions questions
        if any(word in question_lower for word in ["feel", "feeling", "feelings", "emotion", "emotional"]):
            return "Understanding and navigating emotions in relationships can be challenging. Feelings often provide valuable information about what matters to us and how we're experiencing our connections. It might help to reflect on: What physical sensations do you notice when you think about this person or situation? What thoughts come up most often? Are these feelings comfortable or uncomfortable, and what might that tell you? Remember that all feelings are valid and can guide you toward understanding what you truly need and want in a relationship."
        
        # Default fallback with personalized touch if context available
        # Try to extract keywords and provide a helpful response
        base_message = "I hear you're asking about relationships, and I want to help you explore this thoughtfully. "
        
        # Extract any relationship-related keywords from the question
        relationship_keywords = ["relationship", "dating", "partner", "boyfriend", "girlfriend", "person", "someone", "them"]
        found_keywords = [kw for kw in relationship_keywords if kw in question_lower]
        
        if found_keywords:
            base_message += f"You're wondering about {found_keywords[0]}, which suggests you're taking time to reflect—that's a good sign. "
            base_message += "Every relationship and feeling is unique. It might help to consider what specifically you're curious or concerned about. "
            base_message += "Sometimes writing down your thoughts or talking through your feelings with a trusted friend can bring clarity. "
            base_message += "What aspect of this feels most important to you right now?"
        else:
            base_message += "I'm here to help you explore relationship topics. I might be able to provide insights on communication, trust, compatibility, boundaries, feelings, or any relationship questions you're curious about. "
            base_message += "What specific area would you like to explore together?"
        
        if context:
            topics = context.get("topics", [])
            if topics:
                base_message += f" Based on our conversation, you've been exploring: {', '.join(topics[:3])}."
        
        return base_message
    
    def validate_response(self, response: CoachResponse) -> bool:
        """Validate coach response meets requirements."""
        # Basic validation: response should have content
        if not response.message or len(response.message.strip()) < 10:
            return False
        
        # Check response is non-directive (avoid overly prescriptive language)
        directive_words = ["you must", "you need to", "you have to"]
        if any(word in response.message.lower() for word in directive_words):
            return False
        
        # For LEARN mode, prefer probability language but don't strictly require it
        probability_words = ["may", "might", "could", "suggests", "indicates", "likely", "can", "help", "consider"]
        if response.mode == CoachMode.LEARN:
            # Just log a warning if no probability language, but don't fail
            if not any(word in response.message.lower() for word in probability_words):
                print(f"Warning: LEARN response lacks probability language: {response.message[:50]}...")
        
        return True

