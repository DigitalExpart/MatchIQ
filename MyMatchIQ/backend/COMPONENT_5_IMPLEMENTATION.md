# Component 5: Explanation Traceability Metadata - Implementation

## Overview
Implemented internal metadata that links category scores to input signals, weights, and contributions. Used by AI Coach for accurate explanations.

## Design

### Architecture
- **ExplanationMetadataGenerator**: Generates traceability metadata
- **SignalContribution**: Tracks individual answer contributions
- **CategoryExplanation**: Explains category score calculation
- **OverallExplanation**: Explains overall score calculation
- **Machine-Readable**: All metadata in structured format

### Key Features
1. **Signal-Level Tracking**: Each answer's contribution to category score
2. **Weight Tracking**: Category weights and their impact
3. **Contribution Percentages**: How much each signal contributes
4. **Adjustment Tracking**: Profile and reflection-based adjustments
5. **Calculation Trace**: Step-by-step calculation explanation
6. **Coach Integration**: Simplified metadata for AI Coach use

## Files Created

### 1. `backend/app/services/explanation_metadata.py`
**Purpose**: Core explanation metadata generator.

**Key Classes**:
- `SignalContribution`: Contribution of single answer
- `CategoryExplanation`: Category score explanation
- `OverallExplanation`: Overall score explanation
- `ExplanationMetadata`: Complete metadata container
- `ExplanationMetadataGenerator`: Main generator class

**Key Methods**:
- `generate_metadata()`: Main method to generate all metadata
- `_explain_category()`: Explains category score calculation
- `_explain_overall()`: Explains overall score calculation
- `_generate_calculation_trace()`: Creates step-by-step trace
- `get_category_explanation_for_coach()`: Simplified for coach
- `get_overall_explanation_for_coach()`: Simplified for coach

**Metadata Structure**:
```python
{
    'category_explanations': {
        'category_name': {
            'final_score': 75.0,
            'signal_count': 5,
            'category_weight': 1.2,
            'top_signals': [
                {
                    'question_id': 'q1',
                    'question_text': '...',
                    'rating': 'good',
                    'contribution_percentage': 25.5
                }
            ]
        }
    },
    'overall_explanation': {
        'overall_score': 72,
        'category_weights': {...},
        'category_contributions': {...},
        'adjustments': [...],
        'reflection_adjustments': {...}
    },
    'calculation_trace': ['Step 1: ...', 'Step 2: ...']
}
```

## Files Modified

### 1. `backend/app/services/scoring_engine.py`
**Changes**:
- Added `ExplanationMetadataGenerator` initialization
- Generates explanation metadata after scoring
- Includes metadata in return dictionary
- Simplified format for storage (top 5 signals per category)

### 2. `backend/app/api/assessments.py`
**Changes**:
- Stores `explanation_metadata` in `ScanResult`
- Includes metadata in `ai_analysis` JSONB field

### 3. `backend/app/services/coach_service.py`
**Changes**:
- Added `explanation_metadata` to `CoachContext`
- Uses metadata in `_explain_mode()` for detailed explanations
- Shows top contributing signals
- Shows category weights when relevant

### 4. `backend/app/api/coach.py`
**Changes**:
- Extracts `explanation_metadata` from scan result
- Passes to `CoachContext`

## Integration Points

### Scoring Engine Integration
1. After all scores calculated
2. Generates complete explanation metadata
3. Includes in result dictionary
4. Stores in database

### AI Coach Integration
1. Coach receives explanation metadata in context
2. Uses metadata to explain category scores
3. Shows top contributing signals
4. Explains weight impact on priorities

### Database Integration
1. Metadata stored in `explanation_metadata` JSONB column
2. Included in `ai_analysis` for frontend access
3. Machine-readable format for programmatic use

## Metadata Structure

### Category Explanation
- `category`: Category name
- `final_score`: Final calculated score
- `signal_count`: Number of answers
- `signals`: List of signal contributions
- `category_weight`: Weight applied to category
- `top_signals`: Top 5 contributing signals (for storage)

### Signal Contribution
- `question_id`: Question identifier
- `question_text`: Question text
- `rating`: User's rating
- `rating_score`: Numeric score (0-100)
- `weight`: Applied weight
- `weighted_score`: rating_score * weight
- `contribution_percentage`: % of category score

### Overall Explanation
- `overall_score`: Final overall score
- `category_scores`: All category scores
- `category_weights`: Weights used
- `category_contributions`: Contribution of each category
- `adjustments`: Profile-based adjustments
- `reflection_adjustments`: Reflection-based adjustments

## Coach Usage Examples

### Example 1: Category Explanation
**Input**: Explanation metadata for "values_match" category
**Coach Output**: 
"Values Match scored 75%. The strongest signal here was: 'Do your values align?' (good answer), which contributed 25% to this category's score."

### Example 2: Weight Impact
**Input**: User has "values_match" as top priority with weight 1.3
**Coach Output**:
"Since Values Match is something you ranked as highly important, the 75% alignment there (weighted 1.3x due to your priorities) may feel more significant to you than other areas."

### Example 3: Adjustment Explanation
**Input**: Reflection notes show concerning patterns
**Coach Output**: Uses reflection_adjustments to explain score adjustments

## Benefits

1. **Traceability**: Every score can be traced to input signals
2. **Transparency**: Users see what contributed to scores
3. **Coach Accuracy**: AI Coach uses actual data, not estimates
4. **Debugging**: Easy to understand how scores were calculated
5. **Machine-Readable**: Can be used for analysis and reporting

## Privacy & Exposure

- **Full Metadata**: Stored in database, not exposed to frontend by default
- **Simplified Metadata**: Top signals and summaries exposed
- **Coach Access**: Full metadata available to coach service
- **API Access**: Can be included in responses when needed

## Next Steps

Ready for **Component 6: Subscription-Aware Feature Enforcement** when instructed.

