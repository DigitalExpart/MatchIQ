"""
Scoring Engine - Calculates compatibility scores based on scan responses.
Deterministic, transparent, and explainable scoring logic.
"""
from typing import Dict, List, Any
from uuid import uuid4
from datetime import datetime

from app.models.db_models import Scan, Blueprint, User, ScanResult


# Rating to numeric score mapping
RATING_SCORES = {
    'strong-match': 100,
    'good': 75,
    'neutral': 50,
    'yellow-flag': 25,
    'red-flag': 0
}


class ScoringEngine:
    """Deterministic scoring engine for compatibility assessments."""
    
    def __init__(self, ai_version: str = "1.0.0"):
        self.ai_version = ai_version
    
    def process_scan(
        self,
        scan: Scan,
        blueprint: Blueprint,
        user_profile: User
    ) -> ScanResult:
        """
        Process a scan and calculate compatibility scores.
        
        Returns:
            ScanResult with calculated scores and analysis
        """
        # Calculate category scores
        category_scores = self._calculate_category_scores(scan, blueprint)
        
        # Calculate overall score (weighted average)
        overall_score = self._calculate_overall_score(category_scores, blueprint)
        
        # Determine category classification
        category = self._classify_category(overall_score, category_scores)
        
        # Generate AI analysis
        ai_analysis = self._generate_ai_analysis(
            overall_score,
            category_scores,
            category,
            scan,
            blueprint
        )
        
        # Create scan result
        return ScanResult(
            id=uuid4(),
            scan_id=scan.id,
            overall_score=int(overall_score),
            category=category,
            category_scores=category_scores,
            ai_analysis=ai_analysis,
            red_flags=[],  # Will be populated by RedFlagEngine
            inconsistencies=[],
            profile_mismatches=[],
            explanation_metadata={
                "reasoning_steps": [
                    f"Calculated {len(category_scores)} category scores",
                    f"Applied blueprint weights",
                    f"Determined category: {category}"
                ],
                "weight_applications": blueprint.profile_summary.get("category_weights", {}) if blueprint.profile_summary else {}
            },
            ai_version=self.ai_version,
            created_at=datetime.now()
        )
    
    def _calculate_category_scores(
        self,
        scan: Scan,
        blueprint: Blueprint
    ) -> Dict[str, int]:
        """Calculate score for each category."""
        category_scores = {}
        
        # Group scan answers by category
        category_answers = {}
        for answer in scan.answers:
            cat = answer.get("category", "unknown")
            if cat not in category_answers:
                category_answers[cat] = []
            category_answers[cat].append(answer)
        
        # Calculate score for each category
        for category, answers in category_answers.items():
            if not answers:
                category_scores[category] = 0
                continue
            
            total_score = 0
            count = 0
            
            for answer in answers:
                rating = answer.get("rating", "neutral")
                score = RATING_SCORES.get(rating, 50)
                total_score += score
                count += 1
            
            # Average score for category
            avg_score = total_score / count if count > 0 else 0
            category_scores[category] = int(avg_score)
        
        return category_scores
    
    def _calculate_overall_score(
        self,
        category_scores: Dict[str, int],
        blueprint: Blueprint
    ) -> float:
        """Calculate weighted overall score based on blueprint priorities."""
        if not blueprint.profile_summary:
            # No blueprint weights, use simple average
            if not category_scores:
                return 0.0
            return sum(category_scores.values()) / len(category_scores)
        
        category_weights = blueprint.profile_summary.get("category_weights", {})
        
        # If no weights, use equal weighting
        if not category_weights:
            if not category_scores:
                return 0.0
            return sum(category_scores.values()) / len(category_scores)
        
        # Calculate weighted average
        weighted_sum = 0.0
        total_weight = 0.0
        
        for category, score in category_scores.items():
            weight = category_weights.get(category, 1.0 / len(category_scores))
            weighted_sum += score * weight
            total_weight += weight
        
        if total_weight == 0:
            return 0.0
        
        return weighted_sum / total_weight
    
    def _classify_category(
        self,
        overall_score: float,
        category_scores: Dict[str, int]
    ) -> str:
        """Classify the relationship category based on scores."""
        if overall_score >= 80:
            return "high-potential"
        elif overall_score >= 65:
            return "worth-exploring"
        elif overall_score >= 50:
            return "mixed-signals"
        elif overall_score >= 35:
            return "caution"
        else:
            return "high-risk"
    
    def _generate_ai_analysis(
        self,
        overall_score: float,
        category_scores: Dict[str, int],
        category: str,
        scan: Scan,
        blueprint: Blueprint
    ) -> Dict[str, Any]:
        """Generate AI analysis and insights."""
        # Identify strengths (categories with score >= 70)
        strengths = [
            cat for cat, score in category_scores.items()
            if score >= 70
        ]
        
        # Identify awareness areas (categories with score < 50)
        awareness_areas = [
            cat for cat, score in category_scores.items()
            if score < 50
        ]
        
        # Calculate confidence (based on number of answers)
        answer_count = len(scan.answers)
        confidence_score = min(0.95, 0.5 + (answer_count / 50) * 0.45)
        
        # Generate explanation
        explanation = self._generate_explanation(
            overall_score,
            category,
            strengths,
            awareness_areas
        )
        
        # Determine recommended action
        if overall_score >= 70:
            recommended_action = "proceed"
            action_label = "Strong Compatibility"
            action_guidance = "This relationship shows strong potential. Continue building connection while staying aware of growth areas."
        elif overall_score >= 50:
            recommended_action = "proceed-with-awareness"
            action_label = "Moderate Compatibility"
            action_guidance = "There's potential here, but pay attention to the areas that need work. Open communication is key."
        else:
            recommended_action = "pause-and-reflect"
            action_label = "Significant Concerns"
            action_guidance = "Take time to reflect on whether this relationship aligns with your values and goals."
        
        return {
            "strengths": strengths,
            "awareness_areas": awareness_areas,
            "confidence_score": confidence_score,
            "explanation": explanation,
            "recommended_action": recommended_action,
            "action_label": action_label,
            "action_guidance": action_guidance
        }
    
    def _generate_explanation(
        self,
        overall_score: float,
        category: str,
        strengths: List[str],
        awareness_areas: List[str]
    ) -> str:
        """Generate human-readable explanation."""
        score_desc = f"Overall compatibility score of {int(overall_score)}/100"
        
        if strengths:
            strengths_text = ", ".join(strengths)
            score_desc += f" indicates strong alignment in {strengths_text}"
        
        if awareness_areas:
            areas_text = ", ".join(awareness_areas)
            score_desc += f". Areas to be aware of include {areas_text}"
        
        score_desc += f". This relationship falls into the '{category}' category."
        
        return score_desc

