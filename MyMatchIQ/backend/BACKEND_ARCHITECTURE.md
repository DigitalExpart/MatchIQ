# MyMatchIQ Backend Architecture - Complete Breakdown

## 🏗️ Architecture Overview

The MyMatchIQ backend is a **FastAPI-based REST API** that provides decision intelligence for relationship compatibility assessment. It uses **Supabase (PostgreSQL)** as the database and follows a modular, service-oriented architecture.

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Configuration & settings
│   ├── database.py             # Database connection & session management
│   │
│   ├── models/                 # Data Models
│   │   ├── db_models.py        # SQLAlchemy ORM models
│   │   └── pydantic_models.py  # Request/Response validation models
│   │
│   ├── api/                    # API Endpoints (REST Routes)
│   │   ├── assessments.py      # Assessment creation & retrieval
│   │   ├── coach.py            # AI Coach endpoints
│   │   ├── audit_review.py     # Audit & review endpoints
│   │   └── versions.py          # Version information endpoints
│   │
│   ├── services/               # Business Logic Layer
│   │   ├── scoring_logic.py    # Core scoring formulas & calculations
│   │   ├── scoring_engine.py  # Main scoring orchestration
│   │   ├── scoring_config.py  # Configuration management
│   │   ├── red_flag_engine.py  # Safety pattern detection
│   │   ├── dual_scan_engine.py # Mutual alignment calculations
│   │   ├── coach_service.py    # AI Coach (Ella) logic
│   │   ├── pattern_kb.py       # Pattern knowledge base
│   │   ├── confidence_gating.py # Data sufficiency checks
│   │   ├── risk_escalation.py  # Risk escalation logic
│   │   ├── tier_capabilities.py # Subscription tier features
│   │   ├── version_registry.py # Logic versioning system
│   │   ├── explanation_metadata.py # Explanation generation
│   │   └── coach_audit.py      # Coach response auditing
│   │
│   ├── analytics/              # Offline Learning & Calibration
│   │   ├── aggregate_metrics.py    # Metrics collection
│   │   └── calibration_analyzer.py # Calibration issue detection
│   │
│   ├── governance/             # Configuration Governance
│   │   └── config_proposal.py      # Config change proposals
│   │
│   └── utils/                  # Utilities
│       ├── auth.py             # Authentication helpers
│       └── validators.py       # Input validation
│
├── requirements.txt            # Python dependencies
└── .env                        # Environment variables (not in git)
```

---

## 🔧 Core Components Breakdown

### 1. **API Layer** (`app/api/`)

#### `assessments.py`
- **Purpose**: Handle assessment creation and retrieval
- **Endpoints**:
  - `POST /api/v1/assessments/` - Create new assessment
  - `GET /api/v1/assessments/{scan_id}/result` - Get assessment result
- **Key Functions**:
  - `create_assessment()` - Process scan answers, calculate scores
  - `get_scan_result()` - Retrieve stored assessment results

#### `coach.py`
- **Purpose**: AI Coach (Ella) interactions
- **Endpoints**:
  - `POST /api/v1/coach/` - Get AI Coach response
- **Key Functions**:
  - `get_coach_response()` - Generate coach explanations

#### `audit_review.py`
- **Purpose**: Audit trail and review endpoints
- **Endpoints**: Review and audit functionality

#### `versions.py`
- **Purpose**: Version information and compatibility
- **Endpoints**:
  - `GET /api/v1/versions` - Get all logic versions
  - `GET /api/v1/versions/{version}` - Get specific version details

---

### 2. **Services Layer** (`app/services/`)

#### `scoring_logic.py` - Core Scoring Formulas
- **Purpose**: Pure calculation functions (no side effects)
- **Key Functions**:
  - `calculate_blueprint_profile()` - Calculate user's ideal profile
  - `calculate_category_score()` - Score individual categories
  - `calculate_overall_score()` - Aggregate overall compatibility score
  - `classify_category()` - Classify into categories (high-potential, worth-exploring, etc.)
  - `calculate_confidence_score()` - Calculate confidence level
  - `calculate_response_consistency()` - Check answer consistency

#### `scoring_engine.py` - Main Scoring Orchestration
- **Purpose**: Orchestrates the entire scoring process
- **Key Responsibilities**:
  - Coordinates all scoring components
  - Generates insights and recommendations
  - Determines recommended actions
  - Applies confidence gating
  - Integrates with red flag engine

#### `scoring_config.py` - Configuration Management
- **Purpose**: Manages scoring configuration versions
- **Key Features**:
  - Loads versioned scoring configs
  - Manages compatibility thresholds
  - Handles config versioning
  - Provides config validation

#### `red_flag_engine.py` - Safety Pattern Detection
- **Purpose**: Detect safety concerns and deal-breakers
- **Key Functions**:
  - `detect_red_flags()` - Scan for safety patterns
  - `detect_deal_breakers()` - Identify deal-breaker violations
  - `detect_inconsistencies()` - Find contradictory answers
  - `detect_profile_mismatches()` - Check against user profile

#### `dual_scan_engine.py` - Mutual Alignment
- **Purpose**: Calculate mutual compatibility for dual scans
- **Key Functions**:
  - `calculate_mutual_alignment()` - Calculate mutual scores
  - `detect_mutual_deal_breakers()` - Find mutual concerns
  - `identify_complementary_areas()` - Find complementary strengths

#### `coach_service.py` - AI Coach (Ella)
- **Purpose**: Generate non-directive explanations
- **Modes**:
  - `EXPLAIN` - Explain patterns and scores
  - `REFLECT` - Help user reflect on answers
  - `LEARN` - Educational content
  - `SAFETY` - Safety-focused guidance
- **Key Features**:
  - Template-based responses (no LLM)
  - Non-directive (explains, never prescribes)
  - Safety phrase detection

#### `confidence_gating.py` - Data Sufficiency
- **Purpose**: Ensure sufficient data before making classifications
- **Key Checks**:
  - Minimum answer count
  - Category coverage
  - Conflict density
  - Blocks high-potential/high-risk with low confidence

#### `risk_escalation.py` - Risk Escalation Logic
- **Purpose**: Track and escalate cumulative risk
- **Key Features**:
  - Tracks risk over time
  - Escalates based on patterns
  - Provides escalation reasons

#### `pattern_kb.py` - Pattern Knowledge Base
- **Purpose**: Store anonymized patterns for learning
- **Key Features**:
  - Pattern hashing (no raw data)
  - Pattern statistics
  - Anonymized storage

#### `version_registry.py` - Logic Versioning
- **Purpose**: Manage AI logic versions
- **Key Features**:
  - Version registration
  - Approval workflow
  - Activation control
  - Change tracking

---

### 3. **Analytics Layer** (`app/analytics/`)

#### `aggregate_metrics.py` - Metrics Collection
- **Purpose**: Collect anonymized aggregate metrics
- **Metrics Collected**:
  - Score distributions
  - Confidence vs classification matrix
  - Red flag frequencies
  - Escalation frequencies
  - Tier usage counts
- **Rules**: No raw user data, aggregate only

#### `calibration_analyzer.py` - Calibration Detection
- **Purpose**: Detect calibration issues
- **Detects**:
  - Boundary crowding
  - Over/under-triggered flags
  - Confidence misalignment
  - Escalation spikes

---

### 4. **Governance Layer** (`app/governance/`)

#### `config_proposal.py` - Config Proposals
- **Purpose**: Generate proposed config changes
- **Features**:
  - Takes calibration report as input
  - Proposes threshold adjustments
  - Includes rationale
  - Requires human approval

---

### 5. **Models Layer** (`app/models/`)

#### `db_models.py` - SQLAlchemy ORM Models
- **Tables**:
  - `User` - User accounts
  - `Blueprint` - User's ideal partner profile
  - `Scan` - Assessment sessions
  - `ScanResult` - Assessment results
  - `RedFlag` - Detected red flags
  - `PatternKnowledgeBase` - Anonymized patterns
  - `AILogicVersion` - Logic version tracking
  - `UserFeedback` - User feedback

#### `pydantic_models.py` - Request/Response Models
- **Request Models**: Input validation
- **Response Models**: Output formatting
- **Enums**: Rating, ScanType, CoachMode, Severity

---

### 6. **Database Layer** (`app/database.py`)

- **Purpose**: Database connection management
- **Features**:
  - SQLAlchemy engine setup
  - Session management
  - Connection pooling
  - Graceful error handling (works without DB)

---

### 7. **Configuration** (`app/config.py`)

- **Purpose**: Centralized configuration
- **Settings**:
  - Database URL (Supabase)
  - CORS origins
  - Security keys
  - AI version
  - Debug mode

---

## 🔄 Request Flow

### Assessment Creation Flow:
```
1. Frontend → POST /api/v1/assessments/
2. API validates request (Pydantic)
3. Extract user_id from auth token
4. ScoringEngine.process_assessment():
   a. Calculate blueprint profile
   b. Calculate category scores
   c. Calculate overall score
   d. Detect red flags
   e. Apply confidence gating
   f. Classify category
   g. Generate insights
5. Store result in database
6. Return response with scores, flags, insights
```

### AI Coach Flow:
```
1. Frontend → POST /api/v1/coach/
2. API validates request
3. CoachService.get_response():
   a. Determine mode (EXPLAIN, REFLECT, etc.)
   b. Load relevant scan result
   c. Generate template-based response
   d. Validate non-directive language
4. Return coach response
```

---

## 🗄️ Database Schema (Supabase)

### Key Tables:
- **users** - User accounts and profiles
- **blueprints** - User's ideal partner profiles
- **scans** - Assessment sessions
- **scan_results** - Assessment results with scores
- **red_flags** - Detected safety concerns
- **pattern_knowledge_base** - Anonymized patterns
- **ai_logic_versions** - Version tracking

---

## 🔐 Authentication

- **Current**: Token-based (Bearer token or X-User-Id header for dev)
- **Production**: JWT tokens from Supabase Auth
- **Location**: `app/utils/auth.py`

---

## 📊 Key Features

1. **Deterministic Scoring**: Same inputs = same outputs
2. **Safety-First**: Red flags trigger appropriate protocols
3. **Non-Directive AI**: Coach explains, never prescribes
4. **Versioned Logic**: All results track AI version
5. **Confidence Gating**: Blocks classifications with insufficient data
6. **Offline Learning**: Aggregate metrics for calibration
7. **Human Approval**: Config changes require approval

---

## 🚀 Deployment

- **Framework**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **Server**: Uvicorn ASGI server
- **Port**: 8000 (default)

---

## 📝 Environment Variables

See `.env.example` for required configuration.


