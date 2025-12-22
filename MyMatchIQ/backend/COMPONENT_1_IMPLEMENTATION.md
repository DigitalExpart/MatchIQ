# Component 1: Scoring Weight & Threshold Governance - Implementation

## Overview
Implemented a centralized, versioned configuration system for scoring weights, thresholds, and penalties. This enables safe future updates without code rewrites while maintaining full auditability.

## Design

### Architecture
- **Configuration Storage**: JSON files in `backend/scoring_configs/` directory
- **Versioning**: Each config file named `scoring_config_v{VERSION}.json`
- **Singleton Manager**: `ScoringConfigManager` loads and caches active configuration
- **Integration**: Config referenced by `ScoringEngine` and `RedFlagEngine`

### Key Features
1. **Versioned Configuration**: Each config has `logic_version` identifier
2. **Threshold-Based Classification**: Category classification uses config thresholds
3. **Red Flag Severity Rules**: Config-driven severity determination
4. **Deal-Breaker Penalties**: Centralized penalty values
5. **Backward Compatibility**: Falls back to simple classification if config unavailable

## Files Created

### 1. `backend/scoring_configs/scoring_config_v1.0.0.json`
**Purpose**: Versioned configuration file containing all scoring parameters.

**Contents**:
- `logic_version`: "1.0.0"
- `category_weights`: Default and category-specific weights
- `deal_breaker_penalties`: Penalty scores by severity
- `compatibility_thresholds`: Min scores, confidence, red flag limits per category
- `red_flag_severity_thresholds`: Rules for severity determination
- `scoring_adjustments`: Limits for reflection sentiment, profile alignment
- `metadata`: Author, review info, change log

### 2. `backend/app/services/scoring_config.py`
**Purpose**: Configuration loader and manager.

**Key Classes/Functions**:
- `ScoringConfig`: Dataclass container for config data
- `ScoringConfigManager`: Singleton manager with methods:
  - `get_config()`: Returns active configuration
  - `get_logic_version()`: Returns version identifier
  - `get_category_weight(category)`: Gets weight for category
  - `get_deal_breaker_penalty(severity)`: Gets penalty value
  - `get_compatibility_threshold(category)`: Gets threshold config
  - `can_classify_as()`: Validates if assessment can be classified as category

**Loading Logic**:
1. Checks `SCORING_CONFIG_VERSION` environment variable
2. Falls back to `settings.AI_VERSION`
3. Falls back to latest version in directory
4. Raises error if no config found

## Files Modified

### 1. `backend/app/services/scoring_logic.py`
**Changes**:
- Updated `classify_category()` function to accept `confidence`, `red_flags`, and `use_thresholds` parameters
- When `use_thresholds=True`, uses `config_manager.can_classify_as()` for threshold-based classification
- Maintains backward compatibility with simple score-based classification

**Code Snippet**:
```python
def classify_category(
    score: int,
    confidence: float = 0.5,
    red_flags: Optional[List[Dict]] = None,
    use_thresholds: bool = True
) -> str:
    if not use_thresholds:
        # Simple score-based (backward compatibility)
        ...
    
    # Threshold-based using config
    from app.services.scoring_config import config_manager
    categories = ['high-potential', 'worth-exploring', 'mixed-signals', 'caution', 'high-risk']
    for category in categories:
        can_classify, reason = config_manager.can_classify_as(
            category, score, confidence, red_flags
        )
        if can_classify:
            return category
    return 'high-risk'
```

### 2. `backend/app/services/scoring_engine.py`
**Changes**:
- Added `logic_version` and `scoring_config` to `__init__`
- Updated `process_scan()` to use threshold-based classification
- Added `logic_version` to return dictionary

**Code Snippet**:
```python
def __init__(self, ai_version: Optional[str] = None):
    self.ai_version = ai_version or settings.AI_VERSION
    self.logic_version = get_logic_version()
    self.scoring_config = get_scoring_config()

# In process_scan():
category = classify_category(
    overall_score,
    confidence=confidence,
    red_flags=[],
    use_thresholds=True
)

return {
    ...
    'logic_version': self.logic_version
}
```

### 3. `backend/app/services/red_flag_engine.py`
**Changes**:
- Added `__init__()` to load scoring config
- Updated `_detect_deal_breaker_violations()` to use config for severity determination

**Code Snippet**:
```python
def __init__(self):
    self.scoring_config = get_scoring_config()

# In _detect_deal_breaker_violations():
threshold = self.scoring_config.red_flag_severity_thresholds.get('critical', {})
severity = 'critical' if threshold.get('auto_escalate', True) else 'high'
```

### 4. `backend/app/api/assessments.py`
**Changes**:
- Re-classifies category after red flag detection using thresholds
- Includes `logic_version` in response

**Code Snippet**:
```python
# Re-classify with red flags
final_category = classify_category(
    result_data['overall_score'],
    confidence=result_data['confidence_score'],
    red_flags=[...],
    use_thresholds=True
)
result_data['category'] = final_category
```

### 5. `backend/app/models/pydantic_models.py`
**Changes**:
- Added `logic_version: str` field to `ScanResultResponse`

### 6. `backend/app/models/db_models.py`
**Changes**:
- Added `logic_version` column to `ScanResult` table

## Integration Points

### Scoring Engine Integration
1. Config loaded on `ScoringEngine` initialization
2. `classify_category()` uses thresholds from config
3. `logic_version` included in all results

### Red Flag Engine Integration
1. Config loaded on `RedFlagEngine` initialization
2. Deal-breaker violations use config for severity
3. Future: Can use config for pattern detection thresholds

### API Integration
1. `logic_version` returned in all assessment responses
2. Category re-classified after red flag detection
3. Database stores `logic_version` for auditability

## Usage Example

```python
from app.services.scoring_config import get_logic_version, get_scoring_config

# Get current version
version = get_logic_version()  # "1.0.0"

# Get config
config = get_scoring_config()

# Get category weight
weight = config.category_weights.get('values_match', 1.0)

# Check if can classify
from app.services.scoring_config import config_manager
can_classify, reason = config_manager.can_classify_as(
    'high-potential', score=90, confidence=0.8, red_flags=[]
)
```

## Benefits

1. **Versioned Logic**: All results include `logic_version` for reproducibility
2. **Safe Updates**: Change config file without code changes
3. **Auditability**: Every result links to specific config version
4. **Threshold Enforcement**: Classification respects confidence and red flag limits
5. **Backward Compatible**: Falls back gracefully if config unavailable

## Testing

To test configuration loading:
```python
from app.services.scoring_config import get_logic_version, config_manager

# Should load v1.0.0
assert get_logic_version() == "1.0.0"

# Should get default weight
weight = config_manager.get_category_weight('unknown_category')
assert weight == 1.0  # default

# Should validate thresholds
can_classify, reason = config_manager.can_classify_as(
    'high-potential', score=90, confidence=0.8, red_flags=[]
)
assert can_classify == True
```

## Next Steps

1. Create additional config versions as needed (v1.1.0, v2.0.0, etc.)
2. Add config validation on load
3. Add config diff tool for comparing versions
4. Add config migration utilities

## Notes

- Config files are JSON for human readability
- Could migrate to database table for dynamic updates (future)
- Environment variable `SCORING_CONFIG_VERSION` can override default
- All thresholds are explicit and auditable

