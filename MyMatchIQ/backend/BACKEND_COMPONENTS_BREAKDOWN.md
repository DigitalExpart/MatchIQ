# Backend Components - Complete Breakdown

## 📋 Table of Contents

1. [API Endpoints](#api-endpoints)
2. [Services Layer](#services-layer)
3. [Database Models](#database-models)
4. [Configuration](#configuration)
5. [Authentication](#authentication)
6. [Utilities](#utilities)

---

## 🔌 API Endpoints

### `app/api/assessments.py`

**Purpose**: Handle assessment creation and retrieval

**Endpoints**:
- `POST /api/v1/assessments/` - Create new assessment
- `GET /api/v1/assessments/{scan_id}/result` - Get assessment result

**Key Functions**:
- `create_assessment()` - Process scan answers, calculate scores, store results
- `get_scan_result()` - Retrieve stored assessment results

**Dependencies**:
- `ScoringEngine` - Main scoring orchestration
- `TierEnforcement` - Apply subscription tier limits
- `require_auth` - Extract user_id from token
- `get_locale_from_header` - Extract user locale

**Request Flow**:
```
1. Validate request (Pydantic)
2. Extract user_id from auth token
3. Get user tier from database
4. Process assessment (scoring engine)
5. Apply tier enforcement
6. Store result in database
7. Return response with scores, insights, flags
```

---

### `app/api/coach.py`

**Purpose**: AI Coach (Ella) interactions

**Endpoints**:
- `POST /api/v1/coach/` - Get AI Coach response

**Key Functions**:
- `get_coach_response()` - Generate coach explanations

**Dependencies**:
- `CoachService` - AI Coach logic
- `TierEnforcement` - Apply subscription tier limits
- `require_auth` - Extract user_id from token
- `get_locale_from_header` - Extract user locale

**Request Flow**:
```
1. Validate request (Pydantic)
2. Extract user_id from auth token
3. Get user tier from database
4. Load scan result from database
5. Generate coach response (template-based)
6. Apply tier enforcement
7. Return coach response
```

---

### `app/api/audit_review.py`

**Purpose**: Audit trail and review endpoints

**Endpoints**: Review and audit functionality

**Key Functions**: Audit logging and review processes

---

### `app/api/versions.py`

**Purpose**: Version information and compatibility

**Endpoints**:
- `GET /api/v1/versions` - Get all logic versions
- `GET /api/v1/versions/{version}` - Get specific version details
- `GET /api/v1/versions/changelog` - Get version changelog
- `GET /api/v1/versions/compatibility` - Check compatibility

**Dependencies**:
- `VersionRegistry` - Version management system

---

## ⚙️ Services Layer

### `app/services/scoring_logic.py`

**Purpose**: Core scoring formulas (pure functions, no side effects)

**Key Functions**:
- `calculate_blueprint_profile(answers)` - Calculate user's ideal partner profile
- `calculate_category_score(answers, blueprint, category)` - Score individual categories
- `calculate_overall_score(category_scores)` - Aggregate overall compatibility score
- `classify_category(score, thresholds)` - Classify into categories (high-potential, worth-exploring, etc.)
- `calculate_confidence_score(answers, category_scores)` - Calculate confidence level
- `calculate_response_consistency(answers)` - Check answer consistency

**Characteristics**:
- Pure functions (no database access)
- Deterministic (same inputs = same outputs)
- No side effects

---

### `app/services/scoring_engine.py`

**Purpose**: Main scoring orchestration

**Key Functions**:
- `process_assessment(payload)` - Orchestrates entire scoring process

**Responsibilities**:
1. Calculate blueprint profile
2. Calculate category scores
3. Calculate overall score
4. Detect red flags
5. Apply confidence gating
6. Classify category
7. Generate insights
8. Determine recommended actions

**Dependencies**:
- `scoring_logic.py` - Core formulas
- `red_flag_engine.py` - Safety detection
- `confidence_gating.py` - Data sufficiency checks
- `scoring_config.py` - Configuration management

---

### `app/services/scoring_config.py`

**Purpose**: Configuration management and versioning

**Key Functions**:
- `get_scoring_config()` - Get active scoring configuration
- `get_logic_version()` - Get current logic version
- `can_classify_as(score, category)` - Validate classification thresholds

**Features**:
- Loads versioned JSON configs
- Manages compatibility thresholds
- Handles config versioning
- Provides config validation

**Config Structure**:
```json
{
  "version": "1.0.0",
  "thresholds": {
    "high_potential": 80,
    "worth_exploring": 60,
    "proceed_cautiously": 40
  },
  "weights": { ... },
  "red_flag_rules": { ... }
}
```

---

### `app/services/red_flag_engine.py`

**Purpose**: Safety pattern detection

**Key Functions**:
- `detect_red_flags(answers, blueprint)` - Scan for safety patterns
- `detect_deal_breakers(answers, blueprint)` - Identify deal-breaker violations
- `detect_inconsistencies(answers)` - Find contradictory answers
- `detect_profile_mismatches(answers, blueprint)` - Check against user profile

**Flag Types**:
- **Deal-breakers**: Violations of user's non-negotiables
- **Safety patterns**: Concerning behavior patterns
- **Inconsistencies**: Contradictory answers
- **Profile mismatches**: Significant deviations from blueprint

**Severity Levels**:
- `CRITICAL` - Immediate safety concern
- `HIGH` - Significant concern
- `MEDIUM` - Moderate concern
- `LOW` - Minor concern

---

### `app/services/dual_scan_engine.py`

**Purpose**: Mutual alignment calculations for dual scans

**Key Functions**:
- `calculate_mutual_alignment(scan1, scan2)` - Calculate mutual scores
- `detect_mutual_deal_breakers(scan1, scan2)` - Find mutual concerns
- `identify_complementary_areas(scan1, scan2)` - Find complementary strengths
- `detect_asymmetries(scan1, scan2)` - Identify one-sided issues

**Features**:
- Directional alignment calculation
- Mutual score (geometric mean)
- Complementary area identification
- Asymmetry detection

---

### `app/services/coach_service.py`

**Purpose**: AI Coach (Ella) - Generate non-directive explanations

**Modes**:
- `EXPLAIN` - Explain patterns and scores
- `REFLECT` - Help user reflect on answers
- `LEARN` - Educational content
- `SAFETY` - Safety-focused guidance

**Key Functions**:
- `get_response(mode, scan_result, question, locale)` - Generate coach response

**Characteristics**:
- Template-based responses (no LLM)
- Non-directive (explains, never prescribes)
- Safety phrase detection
- Locale-aware responses

**Response Structure**:
```python
{
  "text": "Your compatibility score reflects...",
  "mode": "EXPLAIN",
  "safety_acknowledged": False,
  "logic_version": "1.0.0"
}
```

---

### `app/services/confidence_gating.py`

**Purpose**: Ensure sufficient data before making classifications

**Key Checks**:
- Minimum answer count
- Category coverage
- Conflict density
- Blocks high-potential/high-risk with low confidence

**Key Functions**:
- `check_data_sufficiency(answers)` - Validate minimum data requirements
- `calculate_confidence(answers, category_scores)` - Calculate confidence score
- `should_block_classification(score, confidence)` - Determine if classification should be blocked

**Rules**:
- Requires minimum 10 answers
- Requires coverage in at least 5 categories
- Blocks high-potential/high-risk if confidence < 0.7

---

### `app/services/risk_escalation.py`

**Purpose**: Track and escalate cumulative risk

**Key Functions**:
- `track_risk(user_id, risk_level)` - Track risk over time
- `check_escalation(user_id)` - Check if escalation needed
- `get_escalation_reason(user_id)` - Get escalation reason

**Features**:
- Tracks risk over time
- Escalates based on patterns
- Provides escalation reasons
- Stores escalation history

---

### `app/services/pattern_kb.py`

**Purpose**: Store anonymized patterns for learning

**Key Functions**:
- `hash_pattern(answers)` - Generate pattern hash (no raw data)
- `store_pattern(pattern_hash, metadata)` - Store anonymized pattern
- `get_pattern_stats(pattern_hash)` - Get pattern statistics
- `update_pattern(pattern_hash, metadata)` - Update pattern data

**Features**:
- Pattern hashing (no raw data stored)
- Anonymized storage
- Pattern statistics
- Learning from aggregate patterns

---

### `app/services/version_registry.py`

**Purpose**: Manage AI logic versions

**Key Functions**:
- `register_version(version, config)` - Register new version
- `get_active_version()` - Get currently active version
- `activate_version(version)` - Activate a version
- `get_version_history()` - Get version history

**Features**:
- Version registration
- Approval workflow
- Activation control
- Change tracking

---

### `app/services/tier_capabilities.py`

**Purpose**: Subscription tier feature limits

**Tiers**:
- `FREE` - Limited features
- `BASIC` - Standard features
- `PREMIUM` - Full features

**Key Functions**:
- `get_tier_capabilities(tier)` - Get tier feature limits
- `can_access_feature(tier, feature)` - Check feature access
- `get_tier_limits(tier)` - Get tier limits

**Limits**:
- Free: 1 assessment/month, basic insights
- Basic: 5 assessments/month, detailed insights
- Premium: Unlimited assessments, full features

---

### `app/services/explanation_metadata.py`

**Purpose**: Generate explanation metadata

**Key Functions**:
- `generate_explanation(score, category, flags)` - Generate explanation text
- `get_explanation_factors(score, category)` - Get contributing factors

---

### `app/services/coach_audit.py`

**Purpose**: Audit coach responses

**Key Functions**:
- `audit_response(response)` - Validate coach response
- `check_non_directive(response)` - Ensure non-directive language
- `log_coach_interaction(user_id, response)` - Log interactions

---

## 🗄️ Database Models

### `app/models/db_models.py`

**SQLAlchemy ORM Models**:

#### `User`
- `id` (UUID, primary key)
- `email` (String)
- `subscription_tier` (Enum: FREE, BASIC, PREMIUM)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### `Blueprint`
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `profile_data` (JSON)
- `created_at` (DateTime)

#### `Scan`
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `scan_type` (Enum: SINGLE, DUAL)
- `status` (Enum: IN_PROGRESS, COMPLETED)
- `created_at` (DateTime)

#### `ScanResult`
- `id` (UUID, primary key)
- `scan_id` (UUID, foreign key)
- `overall_score` (Float)
- `category` (String)
- `insights` (JSON)
- `red_flags` (JSON)
- `logic_version` (String)
- `created_at` (DateTime)

#### `RedFlag`
- `id` (UUID, primary key)
- `scan_result_id` (UUID, foreign key)
- `flag_type` (String)
- `severity` (Enum: CRITICAL, HIGH, MEDIUM, LOW)
- `description` (String)
- `created_at` (DateTime)

#### `PatternKnowledgeBase`
- `id` (UUID, primary key)
- `pattern_hash` (String, unique)
- `statistics` (JSON)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### `AILogicVersion`
- `id` (UUID, primary key)
- `version` (String, unique)
- `config` (JSON)
- `is_active` (Boolean)
- `created_at` (DateTime)

#### `UserFeedback`
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `scan_result_id` (UUID, foreign key)
- `feedback_type` (Enum: HELPFUL, NOT_HELPFUL)
- `comment` (Text)
- `created_at` (DateTime)

---

### `app/models/pydantic_models.py`

**Request/Response Validation Models**:

#### Request Models
- `AssessmentRequest` - Assessment creation payload
- `CoachRequest` - Coach question payload
- `VersionRequest` - Version query payload

#### Response Models
- `AssessmentResponse` - Assessment result response
- `CoachResponse` - Coach response
- `VersionResponse` - Version information response

#### Enums
- `Rating` - Answer rating (1-5)
- `ScanType` - SINGLE, DUAL
- `CoachMode` - EXPLAIN, REFLECT, LEARN, SAFETY
- `Severity` - CRITICAL, HIGH, MEDIUM, LOW
- `SubscriptionTier` - FREE, BASIC, PREMIUM

---

## ⚙️ Configuration

### `app/config.py`

**Settings**:
- `DATABASE_URL` - Supabase connection string
- `AI_VERSION` - AI logic version
- `CORS_ORIGINS` - Allowed frontend URLs
- `SECRET_KEY` - JWT secret key
- `ALGORITHM` - JWT algorithm (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration
- `DEBUG` - Debug mode
- `LOG_LEVEL` - Logging level

**Environment Variables**:
Loaded from `.env` file via `pydantic-settings`

---

## 🔐 Authentication

### `app/utils/auth.py`

**Key Functions**:
- `get_user_id_from_token(request)` - Extract user_id from JWT or X-User-Id header
- `get_locale_from_header(request)` - Extract locale from Accept-Language header
- `get_current_user(user_id)` - Fetch user from database
- `require_auth(request)` - FastAPI dependency for authentication

**Flow**:
```
1. Check Authorization header for Bearer token
2. If no token, check X-User-Id header (dev mode)
3. Validate token or user_id
4. Fetch user from database
5. Return user_id and user tier
```

---

## 🛠️ Utilities

### `app/utils/validators.py`

**Validation Functions**:
- `validate_answers(answers)` - Validate answer format
- `validate_blueprint(blueprint)` - Validate blueprint format
- `validate_score_range(score)` - Validate score range

---

## 📊 Analytics

### `app/analytics/aggregate_metrics.py`

**Purpose**: Collect anonymized aggregate metrics

**Metrics Collected**:
- Score distributions
- Confidence vs classification matrix
- Red flag frequencies
- Escalation frequencies
- Tier usage counts

**Rules**: No raw user data, aggregate only

---

### `app/analytics/calibration_analyzer.py`

**Purpose**: Detect calibration issues

**Detects**:
- Boundary crowding
- Over/under-triggered flags
- Confidence misalignment
- Escalation spikes

---

## 🏛️ Governance

### `app/governance/config_proposal.py`

**Purpose**: Generate proposed config changes

**Features**:
- Takes calibration report as input
- Proposes threshold adjustments
- Includes rationale
- Requires human approval

---

## 🔄 Request Lifecycle

### Complete Flow Example: Assessment Creation

```
1. HTTP Request
   POST /api/v1/assessments/
   Headers: Authorization, X-Client-Version, Accept-Language
   Body: { scan_id, answers[], blueprint_id }

2. FastAPI Router (assessments.py)
   - Validate request (Pydantic)
   - Extract user_id (require_auth)
   - Extract locale (get_locale_from_header)

3. Authentication (auth.py)
   - Validate token or X-User-Id
   - Fetch user from database
   - Get user tier

4. Scoring Engine (scoring_engine.py)
   - Calculate blueprint profile (scoring_logic.py)
   - Calculate category scores (scoring_logic.py)
   - Calculate overall score (scoring_logic.py)
   - Detect red flags (red_flag_engine.py)
   - Apply confidence gating (confidence_gating.py)
   - Classify category (scoring_config.py)
   - Generate insights (scoring_engine.py)

5. Tier Enforcement (tier_capabilities.py)
   - Apply tier limits
   - Filter features based on tier

6. Database Storage (database.py)
   - Store scan result
   - Store red flags
   - Update pattern KB (pattern_kb.py)

7. HTTP Response
   Status: 200 OK
   Body: { scan_id, overall_score, category, insights[], red_flags[], logic_version }
```

---

## ✅ Component Checklist

### API Layer
- [x] `assessments.py` - Assessment endpoints
- [x] `coach.py` - AI Coach endpoints
- [x] `audit_review.py` - Audit endpoints
- [x] `versions.py` - Version endpoints

### Services Layer
- [x] `scoring_logic.py` - Core formulas
- [x] `scoring_engine.py` - Main orchestration
- [x] `scoring_config.py` - Configuration
- [x] `red_flag_engine.py` - Safety detection
- [x] `dual_scan_engine.py` - Mutual alignment
- [x] `coach_service.py` - AI Coach
- [x] `confidence_gating.py` - Data sufficiency
- [x] `risk_escalation.py` - Risk tracking
- [x] `pattern_kb.py` - Pattern learning
- [x] `version_registry.py` - Versioning
- [x] `tier_capabilities.py` - Tier limits
- [x] `explanation_metadata.py` - Explanations
- [x] `coach_audit.py` - Coach auditing

### Models Layer
- [x] `db_models.py` - SQLAlchemy models
- [x] `pydantic_models.py` - Request/Response models

### Configuration
- [x] `config.py` - Settings management
- [x] `.env.example` - Environment template

### Authentication
- [x] `auth.py` - Auth utilities

### Database
- [x] `database.py` - Connection management

### Utilities
- [x] `validators.py` - Input validation

### Analytics
- [x] `aggregate_metrics.py` - Metrics collection
- [x] `calibration_analyzer.py` - Calibration detection

### Governance
- [x] `config_proposal.py` - Config proposals

---

## 📝 Summary

The backend is organized into clear layers:

1. **API Layer** - HTTP endpoints and request handling
2. **Services Layer** - Business logic and AI processing
3. **Models Layer** - Data structures and validation
4. **Database Layer** - Connection and session management
5. **Utilities** - Helper functions and authentication
6. **Analytics** - Metrics and calibration
7. **Governance** - Configuration management

All components work together to provide a complete AI-powered compatibility assessment system.

