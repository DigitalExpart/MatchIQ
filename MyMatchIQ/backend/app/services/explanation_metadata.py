"""
Explanation Traceability Metadata

For every assessment result, attach internal metadata that links:
- category score → input signals → weight → contribution

Rules:
- Metadata must be machine-readable
- Not all metadata needs to be exposed to frontend
- Used by AI Coach for accurate explanations
"""
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from app.services.scoring_logic import ScanAnswer, BlueprintProfile, UserProfile, ReflectionNotes, RATING_SCORES
from app.services.scoring_config import get_scoring_config


@dataclass
class SignalContribution:
    """Contribution of a single answer/signal to a category score"""
    question_id: str
    question_text: str
    rating: str
    rating_score: int  # Numeric score (0-100)
    weight: float  # Applied weight for this signal
    weighted_score: float  # rating_score * weight
    contribution_percentage: float  # Percentage of total category score


@dataclass
class CategoryExplanation:
    """Explanation metadata for a single category"""
    category: str
    final_score: float
    signal_count: int
    signals: List[SignalContribution]
    category_weight: float  # Weight from blueprint or config
    total_weighted_score: float
    total_weight: float
    adjustments: List[Dict[str, Any]]  # Any adjustments applied (reflection, profile, etc.)


@dataclass
class OverallExplanation:
    """Explanation metadata for overall score"""
    overall_score: int
    category_scores: Dict[str, float]
    category_weights: Dict[str, float]  # Weights used for overall calculation
    category_contributions: Dict[str, float]  # Contribution of each category to overall
    adjustments: List[Dict[str, Any]]  # Profile-based adjustments
    reflection_adjustments: Optional[Dict[str, Any]] = None


@dataclass
class ExplanationMetadata:
    """Complete explanation metadata for an assessment"""
    category_explanations: Dict[str, CategoryExplanation]
    overall_explanation: OverallExplanation
    logic_version: str
    calculation_trace: List[str]  # Step-by-step calculation trace


class ExplanationMetadataGenerator:
    """
    Generates traceability metadata for assessment results.
    """
    
    def __init__(self):
        self.config = get_scoring_config()
    
    def generate_metadata(
        self,
        answers: List[ScanAnswer],
        category_scores: Dict[str, float],
        overall_score: int,
        blueprint_profile: BlueprintProfile,
        user_profile: UserProfile,
        reflection_notes: Optional[ReflectionNotes] = None
    ) -> ExplanationMetadata:
        """
        Generate complete explanation metadata.
        
        Returns:
            ExplanationMetadata with all traceability information
        """
        # Group answers by category
        category_answers = {}
        for answer in answers:
            cat = answer.category
            if cat not in category_answers:
                category_answers[cat] = []
            category_answers[cat].append(answer)
        
        # Generate category explanations
        category_explanations = {}
        for category, cat_answers in category_answers.items():
            explanation = self._explain_category(
                category=category,
                answers=cat_answers,
                final_score=category_scores.get(category, 0.0),
                blueprint_profile=blueprint_profile
            )
            category_explanations[category] = explanation
        
        # Generate overall explanation
        overall_explanation = self._explain_overall(
            category_scores=category_scores,
            overall_score=overall_score,
            blueprint_profile=blueprint_profile,
            user_profile=user_profile,
            reflection_notes=reflection_notes
        )
        
        # Generate calculation trace
        calculation_trace = self._generate_calculation_trace(
            category_explanations,
            overall_explanation
        )
        
        return ExplanationMetadata(
            category_explanations=category_explanations,
            overall_explanation=overall_explanation,
            logic_version=self.config.logic_version,
            calculation_trace=calculation_trace
        )
    
    def _explain_category(
        self,
        category: str,
        answers: List[ScanAnswer],
        final_score: float,
        blueprint_profile: BlueprintProfile
    ) -> CategoryExplanation:
        """
        Explain how a category score was calculated.
        """
        if not answers:
            return CategoryExplanation(
                category=category,
                final_score=0.0,
                signal_count=0,
                signals=[],
                category_weight=1.0,
                total_weighted_score=0.0,
                total_weight=0.0,
                adjustments=[]
            )
        
        # Get category weight from blueprint or config
        category_weight = blueprint_profile.category_weights.get(
            category,
            self.config.category_weights.get(category, 1.0)
        )
        
        # Calculate signal contributions
        signals = []
        total_weighted_score = 0.0
        total_weight = 0.0
        
        for answer in answers:
            rating_score = RATING_SCORES.get(answer.rating, 50)
            weight = category_weight  # Base weight from category
            
            # Apply question-level weights if available
            # (In future, could check for question-specific weights)
            
            weighted_score = rating_score * weight
            total_weighted_score += weighted_score
            total_weight += weight
            
            signals.append(SignalContribution(
                question_id=answer.question_id,
                question_text=answer.question_text,
                rating=answer.rating,
                rating_score=rating_score,
                weight=weight,
                weighted_score=weighted_score,
                contribution_percentage=0.0  # Will calculate after total
            ))
        
        # Calculate contribution percentages
        if total_weighted_score > 0:
            for signal in signals:
                signal.contribution_percentage = (signal.weighted_score / total_weighted_score) * 100
        
        # Calculate final score
        calculated_score = total_weighted_score / total_weight if total_weight > 0 else 0.0
        
        # Track any adjustments
        adjustments = []
        if abs(calculated_score - final_score) > 0.1:  # If there's a difference
            adjustments.append({
                'type': 'score_adjustment',
                'calculated': calculated_score,
                'final': final_score,
                'difference': final_score - calculated_score,
                'reason': 'Applied additional adjustments'
            })
        
        return CategoryExplanation(
            category=category,
            final_score=final_score,
            signal_count=len(answers),
            signals=signals,
            category_weight=category_weight,
            total_weighted_score=total_weighted_score,
            total_weight=total_weight,
            adjustments=adjustments
        )
    
    def _explain_overall(
        self,
        category_scores: Dict[str, float],
        overall_score: int,
        blueprint_profile: BlueprintProfile,
        user_profile: UserProfile,
        reflection_notes: Optional[ReflectionNotes] = None
    ) -> OverallExplanation:
        """
        Explain how overall score was calculated.
        """
        # Get category weights
        category_weights = {}
        category_contributions = {}
        
        total_weighted_score = 0.0
        total_weight = 0.0
        
        for category, score in category_scores.items():
            weight = blueprint_profile.category_weights.get(
                category,
                self.config.category_weights.get(category, 1.0)
            )
            category_weights[category] = weight
            
            weighted_score = score * weight
            category_contributions[category] = weighted_score
            total_weighted_score += weighted_score
            total_weight += weight
        
        # Calculate base overall score
        base_score = total_weighted_score / total_weight if total_weight > 0 else 0.0
        
        # Track adjustments
        adjustments = []
        
        # Profile-based adjustments
        if user_profile.dating_goal in ['marriage', 'long-term']:
            values_score = category_scores.get('values_match', 50)
            future_score = category_scores.get('future_goals', 50)
            
            if values_score < 60 or future_score < 60:
                adjustments.append({
                    'type': 'profile_adjustment',
                    'reason': 'Dating goal alignment',
                    'adjustment': -10,
                    'category': 'dating_goal'
                })
            elif values_score >= 80 and future_score >= 80:
                adjustments.append({
                    'type': 'profile_adjustment',
                    'reason': 'Strong goal alignment',
                    'adjustment': 5,
                    'category': 'dating_goal'
                })
        
        # Age-based adjustments
        if user_profile.age >= 30:
            maturity_indicators = [
                category_scores.get('emotional_alignment', 50),
                category_scores.get('communication_fit', 50)
            ]
            avg_maturity = sum(maturity_indicators) / len(maturity_indicators)
            
            if avg_maturity < 50:
                adjustments.append({
                    'type': 'profile_adjustment',
                    'reason': 'Age-based maturity expectations',
                    'adjustment': -8,
                    'category': 'age'
                })
        
        # Reflection notes adjustments
        reflection_adjustments = None
        if reflection_notes:
            reflection_adjustments = {
                'good_moments': bool(reflection_notes.good_moments and len(reflection_notes.good_moments) > 30),
                'worst_moments': bool(reflection_notes.worst_moments and len(reflection_notes.worst_moments) > 30),
                'vulnerable_moments': bool(reflection_notes.vulnerable_moments and len(reflection_notes.vulnerable_moments) > 30),
                'adjustments': []
            }
            
            if reflection_adjustments['good_moments'] and not reflection_adjustments['worst_moments']:
                reflection_adjustments['adjustments'].append({
                    'type': 'reflection_sentiment',
                    'adjustment': 5,
                    'reason': 'Strong positive reflections'
                })
            
            if reflection_adjustments['worst_moments'] and not reflection_adjustments['good_moments']:
                reflection_adjustments['adjustments'].append({
                    'type': 'reflection_sentiment',
                    'adjustment': -8,
                    'reason': 'Concerning reflections'
                })
        
        return OverallExplanation(
            overall_score=overall_score,
            category_scores=category_scores,
            category_weights=category_weights,
            category_contributions=category_contributions,
            adjustments=adjustments,
            reflection_adjustments=reflection_adjustments
        )
    
    def _generate_calculation_trace(
        self,
        category_explanations: Dict[str, CategoryExplanation],
        overall_explanation: OverallExplanation
    ) -> List[str]:
        """
        Generate step-by-step calculation trace.
        """
        trace = []
        
        trace.append("Step 1: Calculate category scores from individual answers")
        for category, explanation in category_explanations.items():
            trace.append(f"  - {category}: {explanation.signal_count} signals, weighted average = {explanation.final_score:.2f}")
        
        trace.append("Step 2: Apply category weights for overall score")
        for category, weight in overall_explanation.category_weights.items():
            contribution = overall_explanation.category_contributions.get(category, 0)
            trace.append(f"  - {category}: weight={weight:.2f}, contribution={contribution:.2f}")
        
        if overall_explanation.adjustments:
            trace.append("Step 3: Apply profile-based adjustments")
            for adj in overall_explanation.adjustments:
                trace.append(f"  - {adj['reason']}: {adj['adjustment']:+d} points")
        
        if overall_explanation.reflection_adjustments and overall_explanation.reflection_adjustments.get('adjustments'):
            trace.append("Step 4: Apply reflection-based adjustments")
            for adj in overall_explanation.reflection_adjustments['adjustments']:
                trace.append(f"  - {adj['reason']}: {adj['adjustment']:+d} points")
        
        trace.append(f"Step 5: Final overall score = {overall_explanation.overall_score}")
        
        return trace
    
    def get_category_explanation_for_coach(
        self,
        metadata: ExplanationMetadata,
        category: str
    ) -> Optional[Dict[str, Any]]:
        """
        Get simplified category explanation for AI Coach.
        
        Returns machine-readable data that coach can use for explanations.
        """
        if category not in metadata.category_explanations:
            return None
        
        explanation = metadata.category_explanations[category]
        
        # Get top contributing signals
        sorted_signals = sorted(
            explanation.signals,
            key=lambda s: s.contribution_percentage,
            reverse=True
        )
        
        top_signals = sorted_signals[:3]  # Top 3 contributors
        
        return {
            'category': category,
            'score': explanation.final_score,
            'signal_count': explanation.signal_count,
            'top_contributors': [
                {
                    'question': signal.question_text,
                    'rating': signal.rating,
                    'contribution': round(signal.contribution_percentage, 1)
                }
                for signal in top_signals
            ],
            'category_weight': explanation.category_weight,
            'adjustments': explanation.adjustments
        }
    
    def get_overall_explanation_for_coach(
        self,
        metadata: ExplanationMetadata
    ) -> Dict[str, Any]:
        """
        Get simplified overall explanation for AI Coach.
        """
        return {
            'overall_score': metadata.overall_explanation.overall_score,
            'category_contributions': {
                cat: round(contrib, 2)
                for cat, contrib in metadata.overall_explanation.category_contributions.items()
            },
            'category_weights': metadata.overall_explanation.category_weights,
            'adjustments': metadata.overall_explanation.adjustments,
            'reflection_adjustments': metadata.overall_explanation.reflection_adjustments
        }

