"""
Confidence & Data Sufficiency Gating

Implements explicit data completeness checks and confidence gating to prevent
overconfident classifications when data is thin or contradictory.

Rules:
- Reduce confidence score when data is insufficient
- Prevent "High Risk" or "High Potential" classifications under low confidence
- Force AI Coach to acknowledge limited data when applicable
- Return confidence_reason metadata explaining confidence level
"""
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from app.services.scoring_logic import ScanAnswer
from app.services.scoring_config import get_scoring_config


@dataclass
class DataSufficiencyCheck:
    """Result of data sufficiency check"""
    is_sufficient: bool
    reason: str
    missing_signals: List[str]
    confidence_penalty: float  # 0.0 to 1.0


@dataclass
class ConflictDensityCheck:
    """Result of conflict density analysis"""
    has_conflicts: bool
    conflict_score: float  # 0.0 to 1.0, higher = more conflicts
    conflicting_categories: List[str]
    confidence_penalty: float


@dataclass
class ConfidenceGateResult:
    """Final confidence gating result"""
    adjusted_confidence: float
    confidence_reason: str
    data_sufficiency: DataSufficiencyCheck
    conflict_density: ConflictDensityCheck
    can_classify_high_potential: bool
    can_classify_high_risk: bool
    gating_recommendations: List[str]


class ConfidenceGatingEngine:
    """
    Engine for data sufficiency checks and confidence gating.
    """
    
    def __init__(self):
        self.config = get_scoring_config()
        # Get thresholds from config or use defaults
        self.min_questions_per_category = 2
        self.min_total_questions = 10
        self.min_categories_covered = 3
        self.max_conflict_density = 0.4  # 40% conflict threshold
    
    def check_data_sufficiency(
        self,
        answers: List[ScanAnswer],
        category_coverage: Dict[str, int]
    ) -> DataSufficiencyCheck:
        """
        Check if there's sufficient data for reliable assessment.
        
        Returns:
            DataSufficiencyCheck with sufficiency status and reasons
        """
        missing_signals = []
        penalty = 0.0
        
        # Check minimum total questions
        if len(answers) < self.min_total_questions:
            missing_signals.append(f"Insufficient total questions ({len(answers)}/{self.min_total_questions})")
            penalty += 0.3
        
        # Check minimum questions per category
        thin_categories = []
        for category, count in category_coverage.items():
            if count < self.min_questions_per_category:
                thin_categories.append(category)
                missing_signals.append(f"Category '{category}' has only {count} answer(s)")
        
        if thin_categories:
            penalty += 0.2 * (len(thin_categories) / max(len(category_coverage), 1))
        
        # Check minimum category coverage
        if len(category_coverage) < self.min_categories_covered:
            missing_signals.append(
                f"Insufficient category coverage ({len(category_coverage)}/{self.min_categories_covered} categories)"
            )
            penalty += 0.25
        
        # Determine if sufficient
        is_sufficient = len(missing_signals) == 0
        
        reason = "Data is sufficient for reliable assessment"
        if not is_sufficient:
            reason = f"Data limitations detected: {', '.join(missing_signals[:3])}"
            if len(missing_signals) > 3:
                reason += f" and {len(missing_signals) - 3} more"
        
        return DataSufficiencyCheck(
            is_sufficient=is_sufficient,
            reason=reason,
            missing_signals=missing_signals,
            confidence_penalty=min(penalty, 0.8)  # Cap penalty at 80%
        )
    
    def check_conflict_density(
        self,
        answers: List[ScanAnswer],
        category_scores: Dict[str, float]
    ) -> ConflictDensityCheck:
        """
        Detect conflict density - contradictory signals within and across categories.
        
        Returns:
            ConflictDensityCheck with conflict analysis
        """
        conflicting_categories = []
        conflict_indicators = 0
        total_indicators = 0
        
        # Group answers by category
        category_answers = {}
        for answer in answers:
            cat = answer.category
            if cat not in category_answers:
                category_answers[cat] = []
            category_answers[cat].append(answer)
        
        # Check for intra-category conflicts (high variance within category)
        for category, cat_answers in category_answers.items():
            if len(cat_answers) < 2:
                continue
            
            ratings = [a.rating for a in cat_answers]
            rating_values = {
                'strong-match': 100,
                'good': 75,
                'neutral': 50,
                'yellow-flag': 25,
                'red-flag': 0
            }
            scores = [rating_values.get(r, 50) for r in ratings]
            
            # Calculate variance
            if len(scores) > 1:
                mean_score = sum(scores) / len(scores)
                variance = sum((s - mean_score) ** 2 for s in scores) / len(scores)
                
                # High variance indicates conflict
                if variance > 2500:  # Variance threshold (50 point spread)
                    conflicting_categories.append(category)
                    conflict_indicators += 1
                total_indicators += 1
        
        # Check for inter-category conflicts (very different category scores)
        if len(category_scores) >= 2:
            score_values = list(category_scores.values())
            max_score = max(score_values)
            min_score = min(score_values)
            
            # Large spread indicates potential conflict
            if max_score - min_score > 60:
                conflict_indicators += 1
            total_indicators += 1
        
        # Calculate conflict score
        conflict_score = conflict_indicators / max(total_indicators, 1)
        has_conflicts = conflict_score > self.max_conflict_density
        
        # Calculate penalty (0.0 to 0.5 max)
        confidence_penalty = min(conflict_score * 0.5, 0.5) if has_conflicts else 0.0
        
        return ConflictDensityCheck(
            has_conflicts=has_conflicts,
            conflict_score=conflict_score,
            conflicting_categories=conflicting_categories,
            confidence_penalty=confidence_penalty
        )
    
    def gate_confidence(
        self,
        base_confidence: float,
        answers: List[ScanAnswer],
        category_scores: Dict[str, float],
        category_coverage: Dict[str, int],
        target_category: Optional[str] = None
    ) -> ConfidenceGateResult:
        """
        Apply confidence gating based on data sufficiency and conflict density.
        
        Args:
            base_confidence: Initial confidence score (0.0-1.0)
            answers: List of scan answers
            category_scores: Dictionary of category scores
            category_coverage: Dictionary of answer counts per category
            target_category: Optional target category for classification gating
        
        Returns:
            ConfidenceGateResult with adjusted confidence and gating decisions
        """
        # Check data sufficiency
        sufficiency = self.check_data_sufficiency(answers, category_coverage)
        
        # Check conflict density
        conflict = self.check_conflict_density(answers, category_scores)
        
        # Calculate adjusted confidence
        adjusted_confidence = base_confidence
        
        # Apply sufficiency penalty
        adjusted_confidence -= sufficiency.confidence_penalty
        
        # Apply conflict penalty
        adjusted_confidence -= conflict.confidence_penalty
        
        # Ensure confidence stays in valid range
        adjusted_confidence = max(0.0, min(1.0, adjusted_confidence))
        
        # Build confidence reason
        reasons = []
        if sufficiency.confidence_penalty > 0:
            reasons.append(sufficiency.reason)
        if conflict.confidence_penalty > 0:
            reasons.append(f"Conflicting signals detected in {len(conflict.conflicting_categories)} category(ies)")
        
        if not reasons:
            confidence_reason = "High confidence - sufficient data with consistent signals"
        else:
            confidence_reason = "Lower confidence: " + "; ".join(reasons)
        
        # Determine classification gates
        can_classify_high_potential = adjusted_confidence >= 0.7
        can_classify_high_risk = adjusted_confidence >= 0.5  # Lower threshold for high-risk
        
        # Generate gating recommendations
        gating_recommendations = []
        if not can_classify_high_potential and target_category == 'high-potential':
            gating_recommendations.append(
                "Cannot classify as 'High Potential' due to low confidence. "
                "More data needed for reliable assessment."
            )
        if not can_classify_high_risk and target_category == 'high-risk':
            gating_recommendations.append(
                "Cannot classify as 'High Risk' with current confidence level. "
                "Additional assessment recommended."
            )
        if adjusted_confidence < 0.5:
            gating_recommendations.append(
                "Overall confidence is low. Consider collecting more assessment data."
            )
        
        return ConfidenceGateResult(
            adjusted_confidence=adjusted_confidence,
            confidence_reason=confidence_reason,
            data_sufficiency=sufficiency,
            conflict_density=conflict,
            can_classify_high_potential=can_classify_high_potential,
            can_classify_high_risk=can_classify_high_risk,
            gating_recommendations=gating_recommendations
        )
    
    def should_force_limited_data_acknowledgment(
        self,
        confidence: float,
        data_sufficiency: DataSufficiencyCheck
    ) -> bool:
        """
        Determine if AI Coach should acknowledge limited data.
        
        Returns:
            True if coach should explicitly mention data limitations
        """
        return confidence < 0.6 or not data_sufficiency.is_sufficient

