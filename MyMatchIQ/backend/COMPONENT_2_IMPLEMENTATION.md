# Component 2: Confidence & Data Sufficiency Gating - Implementation

## Overview
Implemented explicit data completeness checks and confidence gating to prevent overconfident classifications when data is thin or contradictory.

## Design

### Architecture
- **ConfidenceGatingEngine**: Central engine for all confidence gating logic
- **Data Sufficiency Checks**: Validates minimum questions, category coverage
- **Conflict Density Detection**: Identifies contradictory signals
- **Classification Gates**: Prevents high-confidence classifications with low data
- **AI Coach Integration**: Forces acknowledgment of limited data

### Key Features
1. **Data Sufficiency Validation**: Checks minimum questions per category, total questions, category coverage
2. **Conflict Density Analysis**: Detects intra-category and inter-category conflicts
3. **Confidence Adjustment**: Reduces confidence based on data limitations and conflicts
4. **Classification Gating**: Prevents "High Potential" or "High Risk" with insufficient confidence
5. **Metadata Return**: Returns `confidence_reason`, `data_sufficiency`, `conflict_density` in results

## Files Created

### 1. `backend/app/services/confidence_gating.py`
**Purpose**: Core confidence gating engine.

**Key Classes**:
- `DataSufficiencyCheck`: Result of data sufficiency validation
- `ConflictDensityCheck`: Result of conflict density analysis
- `ConfidenceGateResult`: Final gating result with all metadata
- `ConfidenceGatingEngine`: Main engine class

**Key Methods**:
- `check_data_sufficiency()`: Validates minimum data requirements
- `check_conflict_density()`: Detects contradictory signals
- `gate_confidence()`: Applies all gating rules and returns adjusted confidence
- `should_force_limited_data_acknowledgment()`: Determines if coach should mention limitations

**Logic**:
```python
# Data sufficiency checks:
- Minimum total questions: 10
- Minimum questions per category: 2
- Minimum categories covered: 3

# Conflict detection:
- Intra-category: High variance in ratings within category
- Inter-category: Large spread between category scores

# Confidence penalties:
- Data insufficiency: Up to 0.8 penalty
- Conflict density: Up to 0.5 penalty

# Classification gates:
- High Potential: Requires confidence >= 0.7
- High Risk: Requires confidence >= 0.5
```

## Files Modified

### 1. `backend/app/services/scoring_engine.py`
**Changes**:
- Added `ConfidenceGatingEngine` initialization
- Integrated confidence gating into `process_scan()`
- Applies gating after initial classification
- Overrides classification if gating prevents it
- Returns confidence metadata in results

**Code Flow**:
1. Calculate base confidence
2. Check data sufficiency
3. Check conflict density
4. Apply penalties to confidence
5. Classify category
6. Re-gate with target category
7. Override classification if gating prevents it
8. Return all metadata

### 2. `backend/app/services/coach_service.py`
**Changes**:
- Added `confidence_reason` and `data_sufficiency` to `CoachContext`
- Updated `_explain_mode()` to acknowledge limited data when appropriate
- Uses `should_force_limited_data_acknowledgment()` to determine when to mention limitations

**Code Snippet**:
```python
should_acknowledge = gating_engine.should_force_limited_data_acknowledgment(
    context.confidence_score,
    context.data_sufficiency
)

if should_acknowledge:
    if context.confidence_reason:
        parts.append(f"Note: {context.confidence_reason}")
```

### 3. `backend/app/models/pydantic_models.py`
**Changes**:
- Added `confidence_reason: Optional[str]` to `ScanResultResponse`
- Added `data_sufficiency: Optional[Dict[str, Any]]`
- Added `conflict_density: Optional[Dict[str, Any]]`
- Added `gating_recommendations: Optional[List[str]]`

### 4. `backend/app/models/db_models.py`
**Changes**:
- Added `confidence_reason = Column(Text)`
- Added `data_sufficiency = Column(JSONB)`
- Added `conflict_density = Column(JSONB)`
- Added `gating_recommendations = Column(JSONB)`

### 5. `backend/app/api/assessments.py`
**Changes**:
- Stores confidence metadata in `ScanResult`
- Returns confidence metadata in responses
- Includes metadata in `ai_analysis` JSONB field

### 6. `backend/app/api/coach.py`
**Changes**:
- Extracts `confidence_reason` and `data_sufficiency` from scan results
- Passes to `CoachContext` for coach service use

## Integration Points

### Scoring Engine Integration
1. Base confidence calculated first
2. Confidence gating applied
3. Classification uses gated confidence
4. Re-gating after classification to check if allowed
5. Classification overridden if gating prevents it

### AI Coach Integration
1. Coach receives `confidence_reason` and `data_sufficiency`
2. Coach checks if should acknowledge limitations
3. Coach includes note in EXPLAIN mode when appropriate

### API Integration
1. All confidence metadata stored in database
2. All metadata returned in API responses
3. Frontend can display confidence reasons

## Behavior Examples

### Example 1: Insufficient Data
**Input**: 5 answers, 1 category
**Result**:
- `confidence_score`: 0.2 (reduced from base)
- `confidence_reason`: "Data limitations detected: Insufficient total questions (5/10), Category 'values' has only 5 answer(s)"
- `data_sufficiency.is_sufficient`: false
- `category`: Downgraded from 'high-potential' to 'worth-exploring' if needed

### Example 2: High Conflict Density
**Input**: Answers with high variance within categories
**Result**:
- `conflict_density.has_conflicts`: true
- `conflict_density.conflict_score`: 0.6
- `conflict_density.conflicting_categories`: ['values', 'communication']
- `confidence_score`: Reduced by conflict penalty
- `confidence_reason`: Includes conflict information

### Example 3: Sufficient Data
**Input**: 25 answers, 5 categories, consistent signals
**Result**:
- `confidence_score`: 0.85 (high)
- `confidence_reason`: "High confidence - sufficient data with consistent signals"
- `data_sufficiency.is_sufficient`: true
- Classification proceeds normally

## Gating Rules

### High Potential Classification
- **Requires**: `confidence >= 0.7`
- **If blocked**: Downgrades to 'worth-exploring'
- **Reason**: "Cannot classify as 'High Potential' due to low confidence"

### High Risk Classification
- **Requires**: `confidence >= 0.5`
- **If blocked**: Upgrades to 'caution'
- **Reason**: "Cannot classify as 'High Risk' with current confidence level"

## Testing Scenarios

1. **Thin Data Test**: 5 answers → Should reduce confidence significantly
2. **Conflict Test**: Contradictory answers → Should detect conflicts
3. **High Potential Gate**: Score 90, confidence 0.6 → Should downgrade category
4. **High Risk Gate**: Score 10, confidence 0.4 → Should upgrade category
5. **Sufficient Data**: 25+ answers, consistent → Should allow all classifications

## Benefits

1. **Prevents Overconfidence**: Low data doesn't lead to high-confidence classifications
2. **Transparency**: Users see why confidence is low
3. **Safety**: Prevents false positives/negatives from thin data
4. **Coach Awareness**: AI Coach acknowledges limitations
5. **Auditability**: All gating decisions are logged in metadata

## Next Steps

Ready for Component 3: Cumulative Risk Escalation Logic

