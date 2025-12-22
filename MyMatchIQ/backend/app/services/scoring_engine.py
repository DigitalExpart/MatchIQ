"""
Scoring Engine - Main service for processing assessments
"""
from typing import Dict, List, Optional
from uuid import UUID
from app.services.scoring_logic import (
    calculate_category_score,
    calculate_overall_score,
    classify_category,
    calculate_confidence_score,
    calculate_response_consistency,
    ScanAnswer,
    BlueprintProfile,
    UserProfile,
    ReflectionNotes,
    RATING_SCORES
)
from app.config import settings
from app.services.scoring_config import get_logic_version, get_scoring_config
from app.services.confidence_gating import ConfidenceGatingEngine
from app.services.explanation_metadata import ExplanationMetadataGenerator


class ScoringEngine:
    """
    Main scoring engine for processing compatibility assessments.
    """
    
    def __init__(self, ai_version: Optional[str] = None):
        self.ai_version = ai_version or settings.AI_VERSION
        self.logic_version = get_logic_version()
        self.scoring_config = get_scoring_config()
        self.confidence_gating = ConfidenceGatingEngine()
        self.explanation_generator = ExplanationMetadataGenerator()
    
    def process_scan(
        self,
        answers: List[ScanAnswer],
        blueprint_profile: BlueprintProfile,
        user_profile: UserProfile,
        reflection_notes: Optional[ReflectionNotes] = None
    ) -> Dict:
        """
        Process scan and generate results.
        
        Returns:
            Dictionary with all calculated scores and analysis
        """
        # Group answers by category
        category_answers = {}
        for answer in answers:
            cat = answer.category
            if cat not in category_answers:
                category_answers[cat] = []
            category_answers[cat].append(answer)
        
        # Calculate category scores
        category_scores = {}
        for category, cat_answers in category_answers.items():
            score = calculate_category_score(
                cat_answers,
                blueprint_profile.category_weights
            )
            category_scores[category] = score
        
        # Calculate overall score
        overall_score = calculate_overall_score(
            category_scores,
            blueprint_profile.category_weights,
            user_profile,
            reflection_notes
        )
        
        # Calculate consistency
        consistency = calculate_response_consistency(answers)
        
        # Calculate base confidence
        category_coverage_count = len(category_answers)
        has_reflection = reflection_notes is not None and any(
            getattr(reflection_notes, field) 
            for field in ['good_moments', 'worst_moments', 'sad_moments', 
                         'vulnerable_moments', 'additional_notes']
        )
        base_confidence = calculate_confidence_score(
            answer_count=len(answers),
            category_coverage=category_coverage_count,
            has_reflection_notes=has_reflection,
            consistency_score=consistency
        )
        
        # Build category coverage dict (count per category)
        category_coverage_dict = {
            cat: len(cat_answers) 
            for cat, cat_answers in category_answers.items()
        }
        
        # Apply confidence gating (before classification)
        gate_result = self.confidence_gating.gate_confidence(
            base_confidence=base_confidence,
            answers=answers,
            category_scores=category_scores,
            category_coverage=category_coverage_dict,
            target_category=None  # Will be set after initial classification
        )
        
        # Use gated confidence for classification
        gated_confidence = gate_result.adjusted_confidence
        
        # Classify category using threshold-based classification with gated confidence
        # Note: red_flags will be calculated later, so we use empty list here
        # The final classification will be re-checked after red flags are detected
        initial_category = classify_category(
            overall_score,
            confidence=gated_confidence,
            red_flags=[],  # Will be updated after red flag detection
            use_thresholds=True
        )
        
        # Re-gate with target category to check if classification is allowed
        gate_result_with_category = self.confidence_gating.gate_confidence(
            base_confidence=base_confidence,
            answers=answers,
            category_scores=category_scores,
            category_coverage=category_coverage_dict,
            target_category=initial_category
        )
        
        # Override classification if gating prevents it
        if initial_category == 'high-potential' and not gate_result_with_category.can_classify_high_potential:
            # Downgrade to 'worth-exploring' if can't classify as high-potential
            category = 'worth-exploring'
        elif initial_category == 'high-risk' and not gate_result_with_category.can_classify_high_risk:
            # Upgrade to 'caution' if can't classify as high-risk
            category = 'caution'
        else:
            category = initial_category
        
        # Use final gated confidence
        confidence = gate_result_with_category.adjusted_confidence
        
        # Generate strengths and awareness areas
        strengths, awareness_areas = self._generate_insights(
            category_scores,
            blueprint_profile
        )
        
        # Determine recommended action
        recommended_action, action_label, action_guidance = self._determine_action(
            overall_score,
            category
        )
        
        # Generate explanation metadata
        explanation_metadata = self.explanation_generator.generate_metadata(
            answers=answers,
            category_scores=category_scores,
            overall_score=overall_score,
            blueprint_profile=blueprint_profile,
            user_profile=user_profile,
            reflection_notes=reflection_notes
        )
        
        return {
            'overall_score': overall_score,
            'category': category,
            'category_scores': category_scores,
            'confidence_score': confidence,
            'confidence_reason': gate_result_with_category.confidence_reason,
            'data_sufficiency': {
                'is_sufficient': gate_result_with_category.data_sufficiency.is_sufficient,
                'reason': gate_result_with_category.data_sufficiency.reason,
                'missing_signals': gate_result_with_category.data_sufficiency.missing_signals
            },
            'conflict_density': {
                'has_conflicts': gate_result_with_category.conflict_density.has_conflicts,
                'conflict_score': gate_result_with_category.conflict_density.conflict_score,
                'conflicting_categories': gate_result_with_category.conflict_density.conflicting_categories
            },
            'gating_recommendations': gate_result_with_category.gating_recommendations,
            'strengths': strengths,
            'awareness_areas': awareness_areas,
            'recommended_action': recommended_action,
            'action_label': action_label,
            'action_guidance': action_guidance,
            'ai_version': self.ai_version,
            'logic_version': self.logic_version,
            'explanation_metadata': {
                'category_explanations': {
                    cat: {
                        'category': exp.category,
                        'final_score': exp.final_score,
                        'signal_count': exp.signal_count,
                        'category_weight': exp.category_weight,
                        'top_signals': [
                            {
                                'question_id': s.question_id,
                                'question_text': s.question_text,
                                'rating': s.rating,
                                'contribution_percentage': round(s.contribution_percentage, 2)
                            }
                            for s in sorted(exp.signals, key=lambda x: x.contribution_percentage, reverse=True)[:5]
                        ]
                    }
                    for cat, exp in explanation_metadata.category_explanations.items()
                },
                'overall_explanation': {
                    'overall_score': explanation_metadata.overall_explanation.overall_score,
                    'category_weights': explanation_metadata.overall_explanation.category_weights,
                    'category_contributions': {
                        k: round(v, 2) for k, v in explanation_metadata.overall_explanation.category_contributions.items()
                    },
                    'adjustments': explanation_metadata.overall_explanation.adjustments,
                    'reflection_adjustments': explanation_metadata.overall_explanation.reflection_adjustments
                },
                'calculation_trace': explanation_metadata.calculation_trace,
                'logic_version': explanation_metadata.logic_version
            }
        }
    
    def _generate_insights(
        self,
        category_scores: Dict[str, float],
        blueprint_profile: BlueprintProfile
    ) -> tuple[List[str], List[str]]:
        """
        Generate strengths and awareness areas based on scores.
        """
        strengths = []
        awareness_areas = []
        
        # Sort categories by score
        sorted_categories = sorted(
            category_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        # Top 2 categories are strengths
        for category, score in sorted_categories[:2]:
            if score >= 75:
                category_name = category.replace('_', ' ').title()
                strengths.append(f"Strong alignment in {category_name} ({score}%)")
        
        # Bottom categories are awareness areas
        for category, score in sorted_categories[-2:]:
            if score < 60:
                category_name = category.replace('_', ' ').title()
                awareness_areas.append(f"Lower alignment in {category_name} ({score}%)")
        
        # Check if top priorities align
        for priority in blueprint_profile.top_priorities[:2]:
            score = category_scores.get(priority, 0)
            if score >= 80:
                strengths.append(f"Strong alignment in {priority.replace('_', ' ').title()}, which you value highly")
            elif score < 60:
                awareness_areas.append(f"Lower alignment in {priority.replace('_', ' ').title()}, which you value highly")
        
        return strengths, awareness_areas
    
    def _determine_action(
        self,
        overall_score: int,
        category: str
    ) -> tuple[Optional[str], Optional[str], Optional[str]]:
        """
        Determine recommended action based on score and category.
        """
        if category == 'high-potential':
            return (
                'proceed',
                'Proceed with Confidence',
                'The analysis indicates strong compatibility. You can proceed with confidence.'
            )
        elif category == 'worth-exploring':
            return (
                'proceed-with-awareness',
                'Proceed with Awareness',
                'Good potential with some areas to explore further. Continue getting to know them while staying mindful.'
            )
        elif category == 'mixed-signals':
            return (
                'proceed-with-awareness',
                'Proceed with Awareness',
                'Mixed signals detected. Take time to observe patterns before deepening commitment.'
            )
        elif category == 'caution':
            return (
                'pause-and-reflect',
                'Pause and Reflect',
                'Significant concerns detected. It is recommended to pause and reflect on this connection.'
            )
        else:  # high-risk
            return (
                'pause-and-reflect',
                'Pause and Reflect',
                'Critical concerns detected. It is highly recommended to pause and reflect on this connection.'
            )

