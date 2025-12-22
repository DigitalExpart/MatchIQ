# Component 3: Cumulative Risk Escalation Logic - Implementation

## Overview
Implemented historical red flag tracking and escalation logic that increases severity when patterns repeat across multiple scans. Escalation increases clarity, not alarmism.

## Design

### Architecture
- **RiskEscalationEngine**: Analyzes historical patterns and escalates recurring flags
- **Historical Pattern Tracking**: Groups flags by type and category across scans
- **Severity Escalation**: Increases severity by one level when patterns recur
- **Cross-Scan Detection**: Specialized detection for critical signals across scans
- **Integration**: Seamlessly integrated into RedFlagEngine

### Key Features
1. **Historical Pattern Analysis**: Tracks flags across 90-day window (180 days for critical)
2. **Escalation Thresholds**: Different thresholds per severity level
3. **Severity Progression**: Escalates low->medium->high->critical
4. **Cross-Scan Critical Detection**: Special handling for critical flags across scans
5. **Metadata Return**: Returns escalation reason and pattern data

## Files Created

### 1. `backend/app/services/risk_escalation.py`
**Purpose**: Core risk escalation engine.

**Key Classes**:
- `EscalationResult`: Result of escalation analysis
- `HistoricalPattern`: Pattern data from historical scans
- `RiskEscalationEngine`: Main escalation engine

**Key Methods**:
- `analyze_historical_patterns()`: Main escalation analysis
- `_get_historical_flags()`: Retrieves historical flags from database
- `_group_flags_by_pattern()`: Groups flags by type+category
- `_should_escalate()`: Determines if escalation criteria met
- `_create_escalated_flag()`: Creates escalated version of flag
- `detect_cross_scan_critical_signals()`: Specialized critical signal detection

**Escalation Rules**:
```python
min_occurrences_for_escalation = {
    'critical': 1,  # Escalates immediately
    'high': 2,      # Needs 2 occurrences
    'medium': 3,    # Needs 3 occurrences
    'low': 4        # Needs 4 occurrences
}
```

**Time Windows**:
- Standard patterns: 90 days
- Critical signals: 180 days (6 months)

## Files Modified

### 1. `backend/app/services/red_flag_engine.py`
**Changes**:
- Added optional `db` parameter to `__init__`
- Added optional `user_id`, `scan_id`, `apply_escalation` parameters to `detect_all()`
- Integrated `RiskEscalationEngine` when database session available
- Replaces original flags with escalated versions when escalation occurs

**Code Flow**:
1. Detect flags using existing logic
2. If escalation enabled and DB available, analyze historical patterns
3. Replace escalated flags with escalated versions
4. Re-prioritize flags

### 2. `backend/app/api/assessments.py`
**Changes**:
- Passes `db`, `user_id`, `scan_id` to `RedFlagEngine.detect_all()`
- Enables escalation for all assessments

### 3. `backend/app/models/db_models.py`
**Changes**:
- Added `escalation_reason = Column(Text)` to `ScanResult`

### 4. `backend/app/models/pydantic_models.py`
**Changes**:
- Added `escalation_reason: Optional[str]` to `ScanResultResponse`

## Integration Points

### Red Flag Engine Integration
1. `RedFlagEngine` accepts optional database session
2. After initial flag detection, calls escalation engine
3. Escalation engine analyzes historical patterns
4. Escalated flags replace original flags
5. Flags re-prioritized with escalated severities

### Database Integration
1. Queries historical `RedFlag` records
2. Filters by user_id and time window
3. Groups by pattern (type + category)
4. Tracks occurrence counts and severity history

### API Integration
1. Escalation reason stored in `ScanResult`
2. Escalation reason returned in API responses
3. Frontend can display escalation information

## Behavior Examples

### Example 1: Recurring High Severity Flag
**Scenario**: User has "controlling behavior" flag in 2 scans within 90 days
**Result**:
- First occurrence: `severity='high'`
- Second occurrence: Escalated to `severity='critical'`
- Signal includes: `"[Escalated: Recurring high severity pattern detected (2 occurrence(s))]"`

### Example 2: Recurring Low Severity Flag
**Scenario**: User has "intensity rushing" flag in 4 scans
**Result**:
- First 3 occurrences: `severity='low'`
- 4th occurrence: Escalated to `severity='medium'`
- Escalation reason: `"Recurring low severity pattern (4 occurrence(s))"`

### Example 3: Cross-Scan Critical Signal
**Scenario**: Critical flag appears in multiple scans over 6 months
**Result**:
- Detected by `detect_cross_scan_critical_signals()`
- Message: `"Critical pattern 'controlling_behavior:communication' has appeared 3 time(s) across scans"`

## Escalation Logic

### Severity Progression
- `low` → `medium` (after 4 occurrences)
- `medium` → `high` (after 3 occurrences)
- `high` → `critical` (after 2 occurrences)
- `critical` → stays `critical` (no further escalation)

### Escalation Criteria
1. **Pattern Match**: Same type + category
2. **Occurrence Count**: Meets minimum threshold
3. **Time Window**: Within pattern window (90/180 days)
4. **Severity Check**: Current severity allows escalation

### Escalation Metadata
- `escalation_reason`: Human-readable explanation
- `original_severity`: Severity before escalation
- `occurrence_count`: Total occurrences including current
- `is_escalated`: Boolean flag

## Safety Guarantees

✅ **No Predictions**: Only escalates based on actual historical data  
✅ **No Advice**: Escalation increases clarity, not directives  
✅ **No New Types**: Only escalates existing flag types  
✅ **Deterministic**: Same history always produces same escalation  
✅ **Auditable**: All escalation decisions logged with reasons  

## Testing Scenarios

1. **First Occurrence**: Flag appears for first time → No escalation
2. **Recurring High**: High severity flag appears twice → Escalates to critical
3. **Recurring Low**: Low severity flag appears 4 times → Escalates to medium
4. **Time Window**: Flag outside 90-day window → Not considered for escalation
5. **Cross-Scan Critical**: Critical flag across scans → Detected separately

## Benefits

1. **Pattern Recognition**: Identifies recurring issues across time
2. **Increased Clarity**: Escalation makes patterns more visible
3. **Historical Context**: Users see when patterns repeat
4. **Safety**: Critical patterns get appropriate attention
5. **Transparency**: Escalation reasons explain why severity increased

## Next Steps

Ready for **Component 4: AI Coach Response Audit Logging** when instructed.

