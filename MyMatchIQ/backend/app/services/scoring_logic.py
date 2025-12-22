"""
Core scoring logic and formulas
"""
from typing import Dict, List, Optional
from dataclasses import dataclass
import math


# Rating to numeric mapping
RATING_SCORES = {
    'strong-match': 100,
    'good': 75,
    'neutral': 50,
    'yellow-flag': 25,
    'red-flag': 0
}


@dataclass
class ScanAnswer:
    question_id: str
    category: str
    rating: str
    question_text: str


@dataclass
class BlueprintAnswer:
    question_id: str
    category: str
    response: str
    importance: str  # 'low', 'medium', 'high'
    is_deal_breaker: bool


@dataclass
class BlueprintProfile:
    category_weights: Dict[str, float]
    deal_breakers: List[Dict[str, any]]
    top_priorities: List[str]


@dataclass
class UserProfile:
    name: str
    age: int
    dating_goal: str
    email: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None


@dataclass
class ReflectionNotes:
    good_moments: Optional[str] = None
    worst_moments: Optional[str] = None
    sad_moments: Optional[str] = None
    vulnerable_moments: Optional[str] = None
    additional_notes: Optional[str] = None


def calculate_blueprint_profile(blueprint_answers: List[BlueprintAnswer]) -> BlueprintProfile:
    """
    Process self-assessment to create user's compatibility profile.
    """
    category_weights = {}
    deal_breakers = []
    top_priorities = []
    
    # Group answers by category
    category_answers = {}
    for answer in blueprint_answers:
        cat = answer.category
        if cat not in category_answers:
            category_answers[cat] = []
        category_answers[cat].append(answer)
    
    # Calculate category importance weights
    for category, answers in category_answers.items():
        total_weight = 0.0
        count = 0
        
        for answer in answers:
            # Importance mapping: low=0.33, medium=0.67, high=1.0
            importance_map = {
                'low': 0.33,
                'medium': 0.67,
                'high': 1.0
            }
            weight = importance_map.get(answer.importance, 0.5)
            
            # Deal-breakers get 2x weight
            if answer.is_deal_breaker:
                weight *= 2.0
                deal_breakers.append({
                    'category': category,
                    'question_id': answer.question_id,
                    'response': answer.response
                })
            
            total_weight += weight
            count += 1
        
        # Average weight for category
        avg_weight = total_weight / count if count > 0 else 0.5
        category_weights[category] = avg_weight
    
    # Normalize weights to sum to 1.0
    total_weight_sum = sum(category_weights.values())
    if total_weight_sum > 0:
        category_weights = {
            k: v / total_weight_sum 
            for k, v in category_weights.items()
        }
    
    # Identify top 3 priorities
    sorted_categories = sorted(
        category_weights.items(), 
        key=lambda x: x[1], 
        reverse=True
    )
    top_priorities = [cat for cat, _ in sorted_categories[:3]]
    
    return BlueprintProfile(
        category_weights=category_weights,
        deal_breakers=deal_breakers,
        top_priorities=top_priorities
    )


def calculate_category_score(
    category_answers: List[ScanAnswer],
    blueprint_weights: Dict[str, float]
) -> float:
    """
    Calculate score for a single category.
    """
    if not category_answers:
        return 0.0
    
    total_weighted_score = 0.0
    total_weight = 0.0
    
    category = category_answers[0].category
    category_weight = blueprint_weights.get(category, 1.0)
    
    for answer in category_answers:
        answer_score = RATING_SCORES.get(answer.rating, 50)
        question_weight = category_weight
        
        total_weighted_score += answer_score * question_weight
        total_weight += question_weight
    
    if total_weight == 0:
        return 0.0
    
    return round(total_weighted_score / total_weight, 2)


def calculate_overall_score(
    category_scores: Dict[str, float],
    blueprint_weights: Dict[str, float],
    user_profile: UserProfile,
    reflection_notes: Optional[ReflectionNotes] = None
) -> int:
    """
    Calculate weighted overall compatibility score.
    """
    if not category_scores:
        return 0
    
    # Weighted average of category scores
    total_weighted_score = 0.0
    total_weight = 0.0
    
    for category, score in category_scores.items():
        # Use blueprint weight if available, else equal weight
        weight = blueprint_weights.get(category, 1.0 / len(category_scores))
        
        total_weighted_score += score * weight
        total_weight += weight
    
    base_score = total_weighted_score / total_weight if total_weight > 0 else 0
    
    # Apply profile-based adjustments
    adjusted_score = apply_profile_adjustments(
        base_score, 
        category_scores, 
        user_profile,
        reflection_notes
    )
    
    # Ensure score is in valid range [0, 100]
    final_score = max(0, min(100, round(adjusted_score)))
    
    return final_score


def apply_profile_adjustments(
    base_score: float,
    category_scores: Dict[str, float],
    user_profile: UserProfile,
    reflection_notes: Optional[ReflectionNotes] = None
) -> float:
    """
    Apply adjustments based on user profile characteristics.
    """
    adjustment = 0.0
    
    # 1. Dating goal alignment
    if user_profile.dating_goal in ['marriage', 'long-term']:
        values_score = category_scores.get('values_match', 50)
        future_score = category_scores.get('future_goals', 50)
        
        if values_score < 60 or future_score < 60:
            adjustment -= 10
        elif values_score >= 80 and future_score >= 80:
            adjustment += 5
    
    # 2. Age-based maturity expectations
    if user_profile.age >= 30:
        maturity_indicators = [
            category_scores.get('emotional_alignment', 50),
            category_scores.get('communication_fit', 50)
        ]
        avg_maturity = sum(maturity_indicators) / len(maturity_indicators)
        
        if avg_maturity < 50:
            adjustment -= 8
        elif avg_maturity >= 80:
            adjustment += 3
    
    # 3. Reflection notes sentiment
    if reflection_notes:
        sentiment_score = analyze_reflection_sentiment(reflection_notes)
        adjustment += sentiment_score
    
    return base_score + adjustment


def analyze_reflection_sentiment(notes: ReflectionNotes) -> float:
    """
    Analyze sentiment of reflection notes.
    Returns adjustment value from -10 to +10.
    """
    sentiment_score = 0.0
    
    positive_keywords = [
        'good', 'great', 'happy', 'enjoy', 'love', 'excited',
        'comfortable', 'safe', 'respected', 'valued', 'understood'
    ]
    
    negative_keywords = [
        'worst', 'sad', 'difficult', 'concern', 'red flag', 'uncomfortable',
        'worried', 'scared', 'disappointed', 'hurt', 'disrespected'
    ]
    
    # Analyze each note field
    notes_dict = {
        'good_moments': notes.good_moments or '',
        'worst_moments': notes.worst_moments or '',
        'sad_moments': notes.sad_moments or '',
        'vulnerable_moments': notes.vulnerable_moments or '',
        'additional_notes': notes.additional_notes or ''
    }
    
    for field, text in notes_dict.items():
        if not text or len(text) < 10:
            continue
        
        text_lower = text.lower()
        
        positive_count = sum(1 for kw in positive_keywords if kw in text_lower)
        negative_count = sum(1 for kw in negative_keywords if kw in text_lower)
        
        field_weights = {
            'good_moments': 1.5,
            'worst_moments': -1.5,
            'sad_moments': -1.0,
            'vulnerable_moments': 0.5,
            'additional_notes': 1.0
        }
        
        weight = field_weights.get(field, 1.0)
        field_sentiment = (positive_count - negative_count) * weight
        sentiment_score += field_sentiment
    
    return max(-10, min(10, round(sentiment_score, 2)))


def classify_category(
    score: int,
    confidence: float = 0.5,
    red_flags: Optional[List[Dict]] = None,
    use_thresholds: bool = True
) -> str:
    """
    Classify overall compatibility category based on score.
    
    If use_thresholds=True, uses configuration thresholds for classification.
    Otherwise, uses simple score-based classification (backward compatibility).
    
    Args:
        score: Overall compatibility score (0-100)
        confidence: Confidence score (0.0-1.0)
        red_flags: List of red flag dictionaries with 'severity' field
        use_thresholds: Whether to use threshold-based classification
    
    Returns:
        Category string: 'high-potential', 'worth-exploring', 'mixed-signals', 'caution', 'high-risk'
    """
    if not use_thresholds:
        # Simple score-based classification (backward compatibility)
        if score >= 85:
            return 'high-potential'
        elif score >= 65:
            return 'worth-exploring'
        elif score >= 45:
            return 'mixed-signals'
        elif score >= 25:
            return 'caution'
        else:
            return 'high-risk'
    
    # Threshold-based classification using config
    try:
        from app.services.scoring_config import config_manager
        
        red_flags = red_flags or []
        
        # Try categories in order of preference (highest to lowest)
        categories = ['high-potential', 'worth-exploring', 'mixed-signals', 'caution', 'high-risk']
        
        for category in categories:
            can_classify, reason = config_manager.can_classify_as(
                category, score, confidence, red_flags
            )
            if can_classify:
                return category
        
        # Fallback to high-risk if nothing matches
        return 'high-risk'
    except Exception:
        # Fallback to simple classification if config system fails
        if score >= 85:
            return 'high-potential'
        elif score >= 65:
            return 'worth-exploring'
        elif score >= 45:
            return 'mixed-signals'
        elif score >= 25:
            return 'caution'
        else:
            return 'high-risk'


def calculate_confidence_score(
    answer_count: int,
    category_coverage: int,
    has_reflection_notes: bool,
    consistency_score: float = 0.5
) -> float:
    """
    Calculate base confidence in the assessment (0.0 to 1.0).
    
    Note: This is the BASE confidence. Final confidence is adjusted by
    ConfidenceGatingEngine based on data sufficiency and conflict density.
    """
    confidence = 0.0
    
    # 1. Answer count factor (0-0.4)
    if answer_count >= 30:
        confidence += 0.4
    elif answer_count >= 20:
        confidence += 0.3
    elif answer_count >= 15:
        confidence += 0.2
    elif answer_count >= 10:
        confidence += 0.1
    
    # 2. Consistency factor (0-0.3)
    confidence += consistency_score * 0.3
    
    # 3. Category coverage (0-0.2)
    expected_categories = 6
    coverage_ratio = min(category_coverage / expected_categories, 1.0)
    confidence += coverage_ratio * 0.2
    
    # 4. Reflection notes (0-0.1)
    if has_reflection_notes:
        confidence += 0.1
    
    return min(confidence, 1.0)


def calculate_response_consistency(answers: List[ScanAnswer]) -> float:
    """
    Measure consistency of responses within categories.
    Returns 0.0 to 1.0.
    """
    if not answers:
        return 0.0
    
    category_answers = {}
    for answer in answers:
        cat = answer.category
        if cat not in category_answers:
            category_answers[cat] = []
        category_answers[cat].append(answer)
    
    consistency_scores = []
    
    for category, cat_answers in category_answers.items():
        if len(cat_answers) < 2:
            continue
        
        ratings = [RATING_SCORES.get(a.rating, 50) for a in cat_answers]
        mean_rating = sum(ratings) / len(ratings)
        variance = sum((r - mean_rating) ** 2 for r in ratings) / len(ratings)
        
        max_variance = 2500  # (100-0)^2
        consistency = 1.0 - min(variance / max_variance, 1.0)
        consistency_scores.append(consistency)
    
    if not consistency_scores:
        return 0.5
    
    return sum(consistency_scores) / len(consistency_scores)

