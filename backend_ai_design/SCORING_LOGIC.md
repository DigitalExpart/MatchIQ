# Scoring Logic & Formulas

## Core Philosophy

All scoring is:
- **Deterministic**: Same inputs = same outputs
- **Transparent**: Every score has a clear calculation path
- **Weighted**: User importance preferences affect scores
- **Explainable**: Can show exactly why a score was calculated

## 1. Blueprint Scoring (Self-Assessment)

### Purpose
Establish user's baseline values, priorities, and deal-breakers.

### Calculation

```python
def calculate_blueprint_profile(blueprint_answers: List[BlueprintAnswer]) -> BlueprintProfile:
    """
    Processes self-assessment to create user's compatibility profile.
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
```

## 2. Scan Response Scoring

### Rating to Numeric Mapping

```python
RATING_SCORES = {
    'strong-match': 100,
    'good': 75,
    'neutral': 50,
    'yellow-flag': 25,
    'red-flag': 0
}
```

### Base Category Score Calculation

```python
def calculate_category_score(
    category_answers: List[ScanAnswer],
    blueprint_weights: Dict[str, float]
) -> float:
    """
    Calculate score for a single category.
    
    Formula:
    category_score = Σ(answer_score × question_weight) / Σ(question_weight)
    
    Where:
    - answer_score = RATING_SCORES[answer.rating]
    - question_weight = blueprint_weights[category] (if available) or 1.0
    """
    if not category_answers:
        return 0.0
    
    total_weighted_score = 0.0
    total_weight = 0.0
    
    category = category_answers[0].category
    category_weight = blueprint_weights.get(category, 1.0)
    
    for answer in category_answers:
        answer_score = RATING_SCORES.get(answer.rating, 50)
        question_weight = category_weight  # Can be enhanced with per-question weights
        
        total_weighted_score += answer_score * question_weight
        total_weight += question_weight
    
    if total_weight == 0:
        return 0.0
    
    return round(total_weighted_score / total_weight, 2)
```

### Overall Score Calculation

```python
def calculate_overall_score(
    category_scores: Dict[str, float],
    blueprint_weights: Dict[str, float],
    user_profile: UserProfile
) -> int:
    """
    Calculate weighted overall compatibility score.
    
    Formula:
    overall_score = Σ(category_score × category_weight) / Σ(category_weight)
    
    Then apply profile-based adjustments:
    - Dating goal alignment
    - Age-based maturity expectations
    - Reflection notes sentiment
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
        user_profile
    )
    
    # Ensure score is in valid range [0, 100]
    final_score = max(0, min(100, round(adjusted_score)))
    
    return final_score
```

### Profile-Based Adjustments

```python
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
    adjustment_reasons = []
    
    # 1. Dating goal alignment
    if user_profile.dating_goal in ['marriage', 'long-term']:
        # Weight values and future goals more heavily
        values_score = category_scores.get('values_match', 50)
        future_score = category_scores.get('future_goals', 50)
        
        if values_score < 60 or future_score < 60:
            adjustment -= 10
            adjustment_reasons.append("Goal misalignment")
        elif values_score >= 80 and future_score >= 80:
            adjustment += 5
            adjustment_reasons.append("Strong goal alignment")
    
    # 2. Age-based maturity expectations
    if user_profile.age >= 30:
        # Older users: penalize immaturity more
        maturity_indicators = [
            category_scores.get('emotional_alignment', 50),
            category_scores.get('communication_fit', 50)
        ]
        avg_maturity = sum(maturity_indicators) / len(maturity_indicators)
        
        if avg_maturity < 50:
            adjustment -= 8
            adjustment_reasons.append("Maturity concerns")
        elif avg_maturity >= 80:
            adjustment += 3
            adjustment_reasons.append("Strong maturity alignment")
    
    # 3. Reflection notes sentiment analysis
    if reflection_notes:
        sentiment_score = analyze_reflection_sentiment(reflection_notes)
        # Sentiment score ranges from -10 to +10
        adjustment += sentiment_score
        if sentiment_score > 5:
            adjustment_reasons.append("Positive reflections")
        elif sentiment_score < -5:
            adjustment_reasons.append("Concerning reflections")
    
    return base_score + adjustment
```

### Category Classification

```python
def classify_category(score: int) -> str:
    """
    Classify overall compatibility category based on score.
    
    Categories:
    - high-potential: 85-100
    - worth-exploring: 65-84
    - mixed-signals: 45-64
    - caution: 25-44
    - high-risk: 0-24
    """
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
```

## 3. Confidence Scoring

```python
def calculate_confidence_score(
    scan: Scan,
    category_scores: Dict[str, float],
    answer_count: int
) -> float:
    """
    Calculate confidence in the assessment (0.0 to 1.0).
    
    Factors:
    1. Number of questions answered (more = higher confidence)
    2. Consistency of responses (consistent = higher confidence)
    3. Coverage of categories (all categories = higher confidence)
    4. Reflection notes presence (adds context = higher confidence)
    """
    confidence = 0.0
    
    # 1. Answer count factor (0-0.4)
    # Optimal: 30+ questions
    if answer_count >= 30:
        confidence += 0.4
    elif answer_count >= 20:
        confidence += 0.3
    elif answer_count >= 15:
        confidence += 0.2
    elif answer_count >= 10:
        confidence += 0.1
    
    # 2. Consistency factor (0-0.3)
    # Check for response consistency
    consistency = calculate_response_consistency(scan.answers)
    confidence += consistency * 0.3
    
    # 3. Category coverage (0-0.2)
    # All 6 categories assessed
    expected_categories = 6
    categories_covered = len(set(a.category for a in scan.answers))
    coverage_ratio = min(categories_covered / expected_categories, 1.0)
    confidence += coverage_ratio * 0.2
    
    # 4. Reflection notes (0-0.1)
    if scan.reflection_notes:
        has_substantial_notes = any(
            len(note) > 30 
            for note in scan.reflection_notes.values() 
            if note
        )
        if has_substantial_notes:
            confidence += 0.1
    
    return min(confidence, 1.0)

def calculate_response_consistency(answers: List[ScanAnswer]) -> float:
    """
    Measure consistency of responses within categories.
    Returns 0.0 to 1.0.
    """
    if not answers:
        return 0.0
    
    # Group by category
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
        
        # Calculate variance in ratings
        ratings = [RATING_SCORES.get(a.rating, 50) for a in cat_answers]
        mean_rating = sum(ratings) / len(ratings)
        variance = sum((r - mean_rating) ** 2 for r in ratings) / len(ratings)
        
        # Lower variance = higher consistency
        # Normalize: variance of 0 = 1.0, variance of 2500 (max) = 0.0
        max_variance = 2500  # (100-0)^2
        consistency = 1.0 - min(variance / max_variance, 1.0)
        consistency_scores.append(consistency)
    
    if not consistency_scores:
        return 0.5  # Default if can't calculate
    
    return sum(consistency_scores) / len(consistency_scores)
```

## 4. Dual Scan Mutual Alignment

```python
def calculate_mutual_alignment(
    scan_a: Scan,
    scan_b: Scan,
    blueprint_a: Blueprint,
    blueprint_b: Blueprint
) -> MutualAlignmentResult:
    """
    Calculate mutual compatibility without exposing raw answers.
    
    Approach:
    1. Calculate alignment scores for each direction
    2. Find mutual deal-breakers
    3. Identify complementary strengths
    4. Calculate mutual score (geometric mean)
    """
    # Calculate A's view of B
    alignment_a_to_b = calculate_alignment_score(
        scan_a.answers,
        blueprint_a,
        blueprint_b
    )
    
    # Calculate B's view of A
    alignment_b_to_a = calculate_alignment_score(
        scan_b.answers,
        blueprint_b,
        blueprint_a
    )
    
    # Mutual score = geometric mean (ensures both must be high)
    mutual_score = math.sqrt(alignment_a_to_b * alignment_b_to_a)
    
    # Find mutual deal-breakers
    mutual_deal_breakers = find_mutual_deal_breakers(
        scan_a, scan_b, blueprint_a, blueprint_b
    )
    
    # Identify complementary areas
    complementary_areas = find_complementary_areas(
        scan_a, scan_b, blueprint_a, blueprint_b
    )
    
    return MutualAlignmentResult(
        mutual_score=round(mutual_score),
        alignment_a_to_b=round(alignment_a_to_b),
        alignment_b_to_a=round(alignment_b_to_a),
        mutual_deal_breakers=mutual_deal_breakers,
        complementary_areas=complementary_areas
    )

def calculate_alignment_score(
    answers: List[ScanAnswer],
    my_blueprint: Blueprint,
    their_blueprint: Blueprint
) -> float:
    """
    Calculate how well their responses align with my blueprint.
    Does NOT expose their raw answers.
    """
    # Group answers by category
    category_answers = {}
    for answer in answers:
        cat = answer.category
        if cat not in category_answers:
            category_answers[cat] = []
        category_answers[cat].append(answer)
    
    total_weighted_score = 0.0
    total_weight = 0.0
    
    for category, cat_answers in category_answers.items():
        # Calculate category score
        cat_score = calculate_category_score(cat_answers, my_blueprint.category_weights)
        
        # Weight by my blueprint importance
        weight = my_blueprint.category_weights.get(category, 1.0)
        
        total_weighted_score += cat_score * weight
        total_weight += weight
    
    return total_weighted_score / total_weight if total_weight > 0 else 0.0
```

## 5. Reflection Notes Sentiment Analysis

```python
def analyze_reflection_sentiment(notes: ReflectionNotes) -> float:
    """
    Analyze sentiment of reflection notes.
    Returns adjustment value from -10 to +10.
    """
    if not notes:
        return 0.0
    
    sentiment_score = 0.0
    
    # Positive indicators
    positive_keywords = [
        'good', 'great', 'happy', 'enjoy', 'love', 'excited',
        'comfortable', 'safe', 'respected', 'valued', 'understood'
    ]
    
    # Negative indicators
    negative_keywords = [
        'worst', 'sad', 'difficult', 'concern', 'red flag', 'uncomfortable',
        'worried', 'scared', 'disappointed', 'hurt', 'disrespected'
    ]
    
    # Analyze each note field
    for field, text in notes.dict().items():
        if not text or len(text) < 10:
            continue
        
        text_lower = text.lower()
        
        # Count positive keywords
        positive_count = sum(1 for kw in positive_keywords if kw in text_lower)
        # Count negative keywords
        negative_count = sum(1 for kw in negative_keywords if kw in text_lower)
        
        # Weight by field type
        field_weights = {
            'good_moments': 1.5,
            'worst_moments': -1.5,
            'sad_moments': -1.0,
            'vulnerable_moments': 0.5,  # Can be positive or negative
            'additional_notes': 1.0
        }
        
        weight = field_weights.get(field, 1.0)
        field_sentiment = (positive_count - negative_count) * weight
        sentiment_score += field_sentiment
    
    # Normalize to -10 to +10 range
    # Cap at reasonable limits
    sentiment_score = max(-10, min(10, sentiment_score))
    
    return round(sentiment_score, 2)
```

## Summary

All scoring follows these principles:
1. **Transparent formulas**: Every calculation is explicit
2. **Weighted by user priorities**: Blueprint importance affects scores
3. **Profile-aware**: User characteristics influence adjustments
4. **Deterministic**: Same inputs always produce same outputs
5. **Explainable**: Can trace every score back to its components

