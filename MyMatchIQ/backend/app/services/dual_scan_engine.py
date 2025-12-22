"""
Dual Scan Mutual Alignment Engine
"""
from typing import Dict, List, Optional
from dataclasses import dataclass
from uuid import UUID
import math
from app.services.scoring_logic import (
    ScanAnswer,
    BlueprintProfile,
    calculate_category_score
)


@dataclass
class MutualDealBreaker:
    category: str
    description: str
    severity: str
    evidence_category: str


@dataclass
class ComplementaryArea:
    category: str
    description: str
    strength_score: float
    my_importance: float


@dataclass
class Asymmetry:
    detected: bool
    difference: float
    description: str
    severity: str


@dataclass
class DualScanResult:
    session_id: UUID
    mutual_score: float
    alignment_a_to_b: float
    alignment_b_to_a: float
    asymmetry: Optional[Asymmetry]
    mutual_deal_breakers: List[MutualDealBreaker]
    complementary_areas: List[ComplementaryArea]
    category_breakdown: Dict[str, Dict[str, float]]
    confidence_score: float


class DualScanEngine:
    """
    Engine for calculating mutual alignment in dual scans.
    """
    
    def calculate_mutual_alignment(
        self,
        scan_a_answers: List[ScanAnswer],
        scan_b_answers: List[ScanAnswer],
        blueprint_a: BlueprintProfile,
        blueprint_b: BlueprintProfile,
        session_id: UUID
    ) -> DualScanResult:
        """
        Calculate mutual compatibility without exposing raw answers.
        """
        # Calculate A's view of B
        alignment_a_to_b = self._calculate_directional_alignment(
            scan_a_answers,
            blueprint_a,
            blueprint_b
        )
        
        # Calculate B's view of A
        alignment_b_to_a = self._calculate_directional_alignment(
            scan_b_answers,
            blueprint_b,
            blueprint_a
        )
        
        # Mutual score = geometric mean
        mutual_score = math.sqrt(alignment_a_to_b * alignment_b_to_a) if alignment_a_to_b > 0 and alignment_b_to_a > 0 else 0.0
        
        # Find mutual deal-breakers
        mutual_deal_breakers = self._find_mutual_deal_breakers(
            scan_a_answers,
            scan_b_answers,
            blueprint_a,
            blueprint_b
        )
        
        # Find complementary areas
        complementary_areas_a = self._find_complementary_areas(
            scan_a_answers,
            blueprint_a
        )
        complementary_areas_b = self._find_complementary_areas(
            scan_b_answers,
            blueprint_b
        )
        complementary_areas = complementary_areas_a + complementary_areas_b
        
        # Detect asymmetry
        asymmetry = self._detect_asymmetry(alignment_a_to_b, alignment_b_to_a)
        
        # Category breakdown
        category_breakdown = self._calculate_category_breakdown(
            scan_a_answers,
            scan_b_answers,
            blueprint_a,
            blueprint_b
        )
        
        # Confidence (average of both)
        confidence = (self._calculate_confidence(scan_a_answers) + 
                     self._calculate_confidence(scan_b_answers)) / 2
        
        return DualScanResult(
            session_id=session_id,
            mutual_score=round(mutual_score, 2),
            alignment_a_to_b=round(alignment_a_to_b, 2),
            alignment_b_to_a=round(alignment_b_to_a, 2),
            asymmetry=asymmetry,
            mutual_deal_breakers=mutual_deal_breakers,
            complementary_areas=complementary_areas,
            category_breakdown=category_breakdown,
            confidence_score=round(confidence, 2)
        )
    
    def _calculate_directional_alignment(
        self,
        my_answers: List[ScanAnswer],
        my_blueprint: BlueprintProfile,
        their_blueprint: BlueprintProfile
    ) -> float:
        """
        Calculate how well their responses align with my blueprint.
        """
        # Group answers by category
        category_answers = {}
        for answer in my_answers:
            cat = answer.category
            if cat not in category_answers:
                category_answers[cat] = []
            category_answers[cat].append(answer)
        
        total_weighted_score = 0.0
        total_weight = 0.0
        
        for category, answers in category_answers.items():
            # Calculate category score
            cat_score = calculate_category_score(answers, my_blueprint.category_weights)
            
            # Weight by my blueprint importance
            my_importance = my_blueprint.category_weights.get(category, 1.0)
            
            total_weighted_score += cat_score * my_importance
            total_weight += my_importance
        
        return total_weighted_score / total_weight if total_weight > 0 else 0.0
    
    def _find_mutual_deal_breakers(
        self,
        scan_a_answers: List[ScanAnswer],
        scan_b_answers: List[ScanAnswer],
        blueprint_a: BlueprintProfile,
        blueprint_b: BlueprintProfile
    ) -> List[MutualDealBreaker]:
        """
        Find categories where both users have deal-breakers that conflict.
        """
        mutual_deal_breakers = []
        
        # Get deal-breaker categories for each user
        deal_breaker_cats_a = {db['category'] for db in blueprint_a.deal_breakers}
        deal_breaker_cats_b = {db['category'] for db in blueprint_b.deal_breakers}
        
        # Find overlapping categories
        common_categories = deal_breaker_cats_a & deal_breaker_cats_b
        
        for category in common_categories:
            # Check if either scan shows red flags in this category
            answers_a = [a for a in scan_a_answers if a.category == category]
            answers_b = [a for a in scan_b_answers if a.category == category]
            
            has_red_flag_a = any(a.rating == 'red-flag' for a in answers_a)
            has_red_flag_b = any(a.rating == 'red-flag' for a in answers_b)
            
            if has_red_flag_a or has_red_flag_b:
                mutual_deal_breakers.append(MutualDealBreaker(
                    category=category,
                    description=f"Both users have deal-breakers in {category}, and responses indicate potential conflict",
                    severity='high',
                    evidence_category=category
                ))
        
        return mutual_deal_breakers
    
    def _find_complementary_areas(
        self,
        my_answers: List[ScanAnswer],
        my_blueprint: BlueprintProfile
    ) -> List[ComplementaryArea]:
        """
        Identify areas where they complement my strengths.
        """
        complementary_areas = []
        
        # Group by category
        category_answers = {}
        for answer in my_answers:
            cat = answer.category
            if cat not in category_answers:
                category_answers[cat] = []
            category_answers[cat].append(answer)
        
        for category, answers in category_answers.items():
            # Get my importance weight
            my_importance = my_blueprint.category_weights.get(category, 0.5)
            
            # Calculate their score in this category
            their_score = calculate_category_score(answers, my_blueprint.category_weights)
            
            # If I value it highly AND they score well
            if my_importance >= 0.7 and their_score >= 75:
                complementary_areas.append(ComplementaryArea(
                    category=category,
                    description=f"Strong alignment in {category}, which you value highly",
                    strength_score=their_score,
                    my_importance=my_importance
                ))
        
        return complementary_areas
    
    def _detect_asymmetry(
        self,
        alignment_a_to_b: float,
        alignment_b_to_a: float
    ) -> Optional[Asymmetry]:
        """
        Detect when alignment is significantly one-sided.
        """
        difference = abs(alignment_a_to_b - alignment_b_to_a)
        
        if difference >= 20:
            return Asymmetry(
                detected=True,
                difference=round(difference, 2),
                description=f"Alignment scores differ by {difference} points, suggesting different perspectives on compatibility",
                severity='medium' if difference < 30 else 'high'
            )
        
        return None
    
    def _calculate_category_breakdown(
        self,
        scan_a_answers: List[ScanAnswer],
        scan_b_answers: List[ScanAnswer],
        blueprint_a: BlueprintProfile,
        blueprint_b: BlueprintProfile
    ) -> Dict[str, Dict[str, float]]:
        """
        Calculate category scores from both perspectives.
        """
        breakdown = {}
        
        # Get all categories
        all_categories = set(
            a.category for a in scan_a_answers
        ) | set(a.category for a in scan_b_answers)
        
        for category in all_categories:
            answers_a = [a for a in scan_a_answers if a.category == category]
            answers_b = [a for a in scan_b_answers if a.category == category]
            
            score_a = calculate_category_score(answers_a, blueprint_a.category_weights) if answers_a else 0
            score_b = calculate_category_score(answers_b, blueprint_b.category_weights) if answers_b else 0
            
            breakdown[category] = {
                'user_a_perspective': round(score_a, 2),
                'user_b_perspective': round(score_b, 2)
            }
        
        return breakdown
    
    def _calculate_confidence(self, answers: List[ScanAnswer]) -> float:
        """
        Calculate confidence based on answer count and coverage.
        """
        if not answers:
            return 0.0
        
        answer_count = len(answers)
        category_count = len(set(a.category for a in answers))
        
        # Simple confidence calculation
        count_factor = min(answer_count / 30, 1.0) * 0.6
        coverage_factor = min(category_count / 6, 1.0) * 0.4
        
        return count_factor + coverage_factor

