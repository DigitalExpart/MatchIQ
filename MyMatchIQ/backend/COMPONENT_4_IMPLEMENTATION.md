# Component 4: AI Coach Response Audit Logging - Implementation

## Overview
Implemented full audit logging for AI Coach responses with immutable logs that do not block response delivery. Includes sampling review utilities.

## Design

### Architecture
- **CoachAuditLog Table**: Immutable audit log table in database
- **CoachAuditLogger Service**: Non-blocking logging service
- **Audit Review API**: Endpoints for sampling and review
- **Privacy-Preserving**: User IDs are hashed before logging

### Key Features
1. **Immutable Logs**: All logs are write-once, never modified
2. **Non-Blocking**: Logging failures don't prevent response delivery
3. **Privacy-Preserving**: User IDs are hashed (SHA-256)
4. **Context Hashing**: Input context is hashed for deduplication
5. **Validation Tracking**: Logs validation status (pass/fail)
6. **Forbidden Phrase Detection**: Tracks if response contained forbidden phrases
7. **Sampling Utilities**: Review endpoints for quality assurance

## Files Created

### 1. `backend/app/services/coach_audit.py`
**Purpose**: Core audit logging service.

**Key Classes**:
- `CoachAuditLog`: SQLAlchemy model for audit log table
- `CoachAuditLogger`: Service for logging and querying logs

**Key Methods**:
- `hash_user_id()`: Hashes user ID for privacy
- `hash_context()`: Creates deterministic hash of input context
- `hash_output()`: Hashes output text for deduplication
- `log_response()`: Logs response (non-blocking)
- `get_recent_logs()`: Gets logs for review (summary)
- `get_log_by_id()`: Gets full log with output text
- `get_sampling_stats()`: Gets statistics for sampling

**Log Fields**:
- `timestamp`: When response was generated
- `user_id_hash`: SHA-256 hash of user ID
- `mode`: EXPLAIN, REFLECT, LEARN, SAFETY
- `input_context_hash`: Hash of input context
- `output_text`: Full response text
- `output_text_hash`: Hash of output (for deduplication)
- `validation_status`: 'pass' or 'fail'
- `logic_version`: Scoring config version
- `ai_version`: AI version
- `has_forbidden_phrases`: Boolean flag
- `response_length`: Character count

### 2. `backend/app/api/audit_review.py`
**Purpose**: API endpoints for reviewing audit logs.

**Endpoints**:
- `GET /audit/logs`: Get recent logs (summary)
- `GET /audit/logs/{log_id}`: Get full log by ID
- `GET /audit/stats`: Get statistics for sampling
- `GET /audit/sampling`: Get sampling of logs for review

## Files Modified

### 1. `backend/app/api/coach.py`
**Changes**:
- Imports `CoachAuditLogger` and `FORBIDDEN_PHRASES`
- Logs response after validation
- Checks for forbidden phrases
- Non-blocking logging (errors caught and logged)

**Code Flow**:
1. Get coach response
2. Validate response
3. Check for forbidden phrases
4. Log to audit (non-blocking)
5. Return response (even if logging failed)

### 2. `backend/app/main.py`
**Changes**:
- Added `audit_review` router import
- Included audit review router

## Integration Points

### Coach Service Integration
1. After response generation and validation
2. Checks for forbidden phrases
3. Builds input context for logging
4. Calls audit logger (non-blocking)

### Database Integration
1. `CoachAuditLog` table created via SQLAlchemy
2. Indexes on timestamp, user_id_hash, mode, validation_status
3. Immutable records (no update operations)

### API Integration
1. Audit review endpoints available at `/audit/*`
2. Sampling utilities for quality assurance
3. Statistics endpoint for monitoring

## Logging Flow

```
1. Coach generates response
2. Response validated
3. Forbidden phrases checked
4. Input context built
5. Audit logger called (non-blocking)
   - Hash user ID
   - Hash input context
   - Hash output text
   - Create log entry
   - Commit to database
6. If logging fails, error logged but response still returned
7. Response delivered to user
```

## Privacy & Security

### User ID Hashing
- User IDs are hashed with SHA-256 before logging
- Salt used (should be from environment in production)
- Cannot reverse hash to get original user ID

### Context Hashing
- Input context normalized (sorted keys)
- Non-deterministic fields excluded
- Hash used for deduplication and pattern analysis

### Output Text
- Full output text stored for review
- Also hashed for deduplication
- Can be retrieved by log ID for review

## Review Utilities

### Sampling Endpoint
- `GET /audit/sampling`: Get random sample of logs
- Configurable sample size
- Filters for mode, validation status, forbidden phrases
- Returns full log details for review

### Statistics Endpoint
- `GET /audit/stats`: Get aggregate statistics
- Total log count
- Distribution by mode
- Distribution by validation status
- Forbidden phrase rate
- Average response length

### Log Retrieval
- `GET /audit/logs`: Get recent logs (summary, no output text)
- `GET /audit/logs/{log_id}`: Get full log with output text

## Non-Blocking Design

### Error Handling
```python
try:
    audit_logger.log_response(...)
except Exception as e:
    logging.warning(f"Failed to audit log: {e}")
    # Response still returned to user
```

### Database Transactions
- Each log entry committed immediately
- Rollback on error
- No transaction blocking response delivery

## Testing Scenarios

1. **Normal Logging**: Response logged successfully
2. **Logging Failure**: Database error doesn't block response
3. **Forbidden Phrase Detection**: Flagged in log
4. **Validation Failure**: Logged with status='fail'
5. **Sampling**: Review endpoint returns sample logs
6. **Statistics**: Stats endpoint provides overview

## Benefits

1. **Full Audit Trail**: Every response is logged
2. **Quality Assurance**: Sampling utilities for review
3. **Privacy-Preserving**: User IDs hashed
4. **Non-Blocking**: Doesn't impact response delivery
5. **Immutable**: Logs cannot be modified
6. **Searchable**: Indexed for efficient queries
7. **Analyzable**: Statistics and sampling for insights

## Next Steps

Ready for **Component 5: Explanation Traceability Metadata** when instructed.

