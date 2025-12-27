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
            message = "What would you like to learn about? Ask me about compatibility, red flags, or relationship patterns."
        else:
            message = self._answer_question(request.specific_question)
        
        return CoachResponse(
            message=message,
            mode=CoachMode.LEARN,
            confidence=0.8,
            referenced_data={"question": request.specific_question}
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
    
    def _answer_question(self, question: str) -> str:
        """Answer a learning question (template-based)."""
        question_lower = question.lower()
        
        if "red flag" in question_lower or "safety" in question_lower:
            return "Red flags are patterns that suggest potential concerns. They can range from minor yellow flags to critical safety issues. Always trust your instincts and prioritize your safety."
        
        if "compatibility" in question_lower or "score" in question_lower:
            return "Compatibility scores are calculated based on how responses align with your blueprint (self-assessment). Higher scores indicate stronger alignment in values, communication, and goals."
        
        if "blueprint" in question_lower or "self-assessment" in question_lower:
            return "Your blueprint is your self-assessment that defines what matters most to you. It helps the AI understand your priorities and deal-breakers when evaluating relationships."
        
        return "I can help explain compatibility scores, red flags, blueprints, and relationship patterns. What specific aspect would you like to learn more about?"
    
    def validate_response(self, response: CoachResponse) -> bool:
        """Validate coach response meets requirements."""
        # Check response is non-directive
        directive_words = ["should", "must", "need to", "have to"]
        if any(word in response.message.lower() for word in directive_words):
            return False
        
        # Check response uses probability language
        probability_words = ["may", "might", "could", "suggests", "indicates", "likely"]
        if not any(word in response.message.lower() for word in probability_words):
            # Allow for safety mode which can be more direct
            if response.mode != CoachMode.SAFETY:
                return False
        
        return True

