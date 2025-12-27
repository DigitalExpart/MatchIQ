# Dual Scan Mutual Alignment Logic

## Core Philosophy

Dual scans compare two users' assessments **without exposing raw answers**. The system calculates mutual alignment while preserving privacy.

## Key Principles

1. **Privacy-First**: Never expose one user's answers to the other
2. **Mutual Perspective**: Calculate alignment from both directions
3. **Complementary Analysis**: Identify where strengths align
4. **Deal-Breaker Detection**: Find mutual non-negotiables
5. **Transparent Math**: Both users see the same mutual score

## Data Structure

### Dual Scan Session

```python
@dataclass
class DualScanSession:
    session_id: UUID
    user_a_id: UUID
    user_b_id: UUID
    scan_a_id: UUID
    scan_b_id: UUID
    created_at: datetime
    status: str  # 'pending', 'active', 'completed'
    is_unified: bool  # Whether categories were unified
```

## Mutual Alignment Calculation

### 1. Directional Alignment Scores

```python
def calculate_directional_alignment(
    my_scan: Scan,
    my_blueprint: Blueprint,
    their_blueprint: Blueprint
) -> float:
    """
    Calculate how well their responses align with my blueprint.
    Does NOT expose their raw answers.
    
    Formula:
    alignment = Σ(category_score × my_importance_weight) / Σ(my_importance_weight)
    
    Where category_score is calculated from my scan answers about them,
    weighted by my blueprint importance.
    """
    # Group my answers by category
    category_answers = {}
    for answer in my_scan.answers:
        cat = answer.category
        if cat not in category_answers:
            category_answers[cat] = []
        category_answers[cat].append(answer)
    
    total_weighted_score = 0.0
    total_weight = 0.0
    
    for category, answers in category_answers.items():
        # Calculate category score from my answers
        cat_score = calculate_category_score(answers, my_blueprint.category_weights)
        
        # Weight by my blueprint importance
        my_importance = my_blueprint.category_weights.get(category, 1.0)
        
        total_weighted_score += cat_score * my_importance
        total_weight += my_importance
    
    return total_weighted_score / total_weight if total_weight > 0 else 0.0
```

### 2. Mutual Score (Geometric Mean)

```python
def calculate_mutual_score(
    alignment_a_to_b: float,
    alignment_b_to_a: float
) -> float:
    """
    Calculate mutual compatibility score.
    
    Uses geometric mean to ensure both directions must be high.
    
    Formula:
    mutual_score = √(alignment_a_to_b × alignment_b_to_a)
    
    Why geometric mean?
    - If one direction is 0, mutual score is 0 (no compatibility)
    - If both are 50, mutual score is 50 (balanced)
    - If one is 100 and one is 25, mutual score is 50 (not 62.5)
    - Ensures mutual compatibility, not one-sided attraction
    """
    if alignment_a_to_b <= 0 or alignment_b_to_a <= 0:
        return 0.0
    
    mutual_score = math.sqrt(alignment_a_to_b * alignment_b_to_a)
    return round(mutual_score, 2)
```

### 3. Mutual Deal-Breaker Detection

```python
def find_mutual_deal_breakers(
    scan_a: Scan,
    scan_b: Scan,
    blueprint_a: Blueprint,
    blueprint_b: Blueprint
) -> List[MutualDealBreaker]:
    """
    Find categories where both users have deal-breakers that conflict.
    
    Does NOT expose which user has which deal-breaker.
    """
    mutual_deal_breakers = []
    
    # Get deal-breakers for each user
    deal_breakers_a = {
        db['category']: db 
        for db in blueprint_a.deal_breakers
    }
    deal_breakers_b = {
        db['category']: db 
        for db in blueprint_b.deal_breakers
    }
    
    # Find overlapping categories with deal-breakers
    common_categories = set(deal_breakers_a.keys()) & set(deal_breakers_b.keys())
    
    for category in common_categories:
        # Check if responses conflict with deal-breakers
        answers_a = [a for a in scan_a.answers if a.category == category]
        answers_b = [a for a in scan_b.answers if a.category == category]
        
        # Check if either scan shows red flags in this category
        has_red_flag_a = any(a.rating == 'red-flag' for a in answers_a)
        has_red_flag_b = any(a.rating == 'red-flag' for a in answers_b)
        
        if has_red_flag_a or has_red_flag_b:
            mutual_deal_breakers.append(MutualDealBreaker(
                category=category,
                description=f"Both users have deal-breakers in {category}, and responses indicate potential conflict",
                severity='HIGH',
                # Don't expose which user flagged what
                evidence_category=category
            ))
    
    return mutual_deal_breakers
```

### 4. Complementary Areas Detection

```python
def find_complementary_areas(
    scan_a: Scan,
    scan_b: Scan,
    blueprint_a: Blueprint,
    blueprint_b: Blueprint
) -> List[ComplementaryArea]:
    """
    Identify areas where users complement each other's strengths.
    
    Example: User A values communication highly, User B shows strong communication.
    """
    complementary_areas = []
    
    # For each category
    categories = set(a.category for a in scan_a.answers) | set(a.category for a in scan_b.answers)
    
    for category in categories:
        # Get my importance weight
        my_importance = blueprint_a.category_weights.get(category, 0.5)
        
        # Get their responses (from my scan about them)
        their_responses = [a for a in scan_a.answers if a.category == category]
        
        if not their_responses:
            continue
        
        # Calculate their score in this category
        their_score = calculate_category_score(their_responses, blueprint_a.category_weights)
        
        # If I value it highly AND they score well
        if my_importance >= 0.7 and their_score >= 75:
            complementary_areas.append(ComplementaryArea(
                category=category,
                description=f"Strong alignment in {category}, which you value highly",
                strength_score=their_score,
                my_importance=my_importance
            ))
    
    return complementary_areas
```

### 5. Asymmetry Detection

```python
def detect_asymmetry(
    alignment_a_to_b: float,
    alignment_b_to_a: float
) -> Optional[Asymmetry]:
    """
    Detect when alignment is significantly one-sided.
    
    Asymmetry suggests:
    - One person may be more invested
    - Different expectations
    - Potential power imbalance
    """
    difference = abs(alignment_a_to_b - alignment_b_to_a)
    
    if difference >= 20:  # Significant gap
        return Asymmetry(
            detected=True,
            difference=round(difference, 2),
            description=f"Alignment scores differ by {difference} points, suggesting different perspectives on compatibility",
            severity='MEDIUM' if difference < 30 else 'HIGH'
        )
    
    return None
```

## Complete Dual Scan Result

```python
@dataclass
class DualScanResult:
    session_id: UUID
    mutual_score: float  # 0-100
    alignment_a_to_b: float  # How B aligns with A's blueprint
    alignment_b_to_a: float  # How A aligns with B's blueprint
    asymmetry: Optional[Asymmetry]
    mutual_deal_breakers: List[MutualDealBreaker]
    complementary_areas: List[ComplementaryArea]
    category_breakdown: Dict[str, Dict[str, float]]  # Category scores from both perspectives
    confidence_score: float
    created_at: datetime
```

## Privacy Preservation

### What Users See

**User A sees:**
- Mutual score (same for both)
- Their own alignment score (how B aligns with A's blueprint)
- Mutual deal-breakers (category only, not which user)
- Complementary areas (from A's perspective)
- Asymmetry warning (if detected)

**User B sees:**
- Mutual score (same for both)
- Their own alignment score (how A aligns with B's blueprint)
- Mutual deal-breakers (category only, not which user)
- Complementary areas (from B's perspective)
- Asymmetry warning (if detected)

### What Users DON'T See

- Other user's raw answers
- Other user's blueprint details
- Other user's individual category scores
- Which user triggered a mutual deal-breaker

## Example Calculation

```
User A's Blueprint:
- Values: 0.4 (high importance)
- Communication: 0.3
- Emotional: 0.2
- Lifestyle: 0.1

User A's Scan about User B:
- Values: strong-match (100)
- Communication: good (75)
- Emotional: neutral (50)
- Lifestyle: good (75)

Alignment A→B = (100×0.4 + 75×0.3 + 50×0.2 + 75×0.1) / 1.0 = 82.5

User B's Blueprint:
- Values: 0.3
- Communication: 0.4 (high importance)
- Emotional: 0.2
- Lifestyle: 0.1

User B's Scan about User A:
- Values: good (75)
- Communication: strong-match (100)
- Emotional: good (75)
- Lifestyle: neutral (50)

Alignment B→A = (75×0.3 + 100×0.4 + 75×0.2 + 50×0.1) / 1.0 = 82.5

Mutual Score = √(82.5 × 82.5) = 82.5
```

## Summary

Dual scan logic:
1. **Calculates** alignment from both perspectives
2. **Preserves** privacy by not exposing raw answers
3. **Identifies** mutual deal-breakers and complementary areas
4. **Detects** asymmetry in alignment
5. **Provides** transparent mutual score using geometric mean

