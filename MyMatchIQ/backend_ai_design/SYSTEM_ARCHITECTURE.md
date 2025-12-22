# MyMatchIQ AI System Architecture

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React/TS)                       │
│  - User Interface                                               │
│  - Assessment Flows                                             │
│  - Results Display                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST API
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    API Gateway Layer (FastAPI)                  │
│  - Authentication                                              │
│  - Request Routing                                             │
│  - Rate Limiting                                               │
│  - Input Validation (Pydantic)                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│  Assessment    │  │  Blueprint      │  │  Results       │
│  Service       │  │  Service       │  │  Service       │
└───────┬────────┘  └───────┬────────┘  └───────┬────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                ┌───────────▼───────────┐
                │   AI Core Engine      │
                │                       │
                │  ┌─────────────────┐ │
                │  │ Scoring Engine  │ │
                │  └─────────────────┘ │
                │  ┌─────────────────┐ │
                │  │ Red Flag Engine │ │
                │  └─────────────────┘ │
                │  ┌─────────────────┐ │
                │  │ Alignment Engine │ │
                │  └─────────────────┘ │
                │  ┌─────────────────┐ │
                │  │ Explanation     │ │
                │  │ Generator       │ │
                │  └─────────────────┘ │
                │  ┌─────────────────┐ │
                │  │ Pattern         │ │
                │  │ Analyzer        │ │
                │  └─────────────────┘ │
                └───────────┬───────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│  PostgreSQL   │  │  Pattern       │  │  Audit Log     │
│  Database     │  │  Knowledge    │  │  (Versioning)  │
│               │  │  Base         │  │                │
└───────────────┘  └────────────────┘  └────────────────┘
```

## Core Principles

1. **Deterministic First**: All scoring is rule-based and reproducible
2. **Transparent**: Every score has an explainable path
3. **Versioned**: All logic changes are tracked and auditable
4. **Safe**: Red flags trigger immediate safety protocols
5. **Non-Directive**: AI explains patterns, never prescribes actions

## Module Responsibilities

### 1. Blueprint Intelligence Engine
- Processes self-assessment data
- Calculates user's value profile
- Identifies deal-breakers and importance weights
- Creates baseline for compatibility matching

### 2. Compatibility Scoring Engine
- Computes alignment scores per category
- Weighted by user importance
- Generates category-level breakdowns
- Produces overall compatibility score (0-100)

### 3. Red Flag & Risk Detection Engine
- Scans responses for safety indicators
- Categorizes severity (low/medium/high/critical)
- Triggers immediate alerts for critical flags
- Tracks patterns across multiple scans

### 4. Mutual Alignment Engine (Dual Scan)
- Compares two users' responses
- Identifies alignment without exposing raw answers
- Calculates mutual compatibility
- Detects mutual deal-breakers

### 5. Insight & Reflection Engine
- Analyzes reflection notes for sentiment
- Identifies patterns in user's observations
- Correlates notes with assessment scores
- Generates reflective insights

### 6. AI Coach Explanation Layer
- Generates plain-language explanations
- Uses probability language ("likely", "suggests", "may indicate")
- Provides context without directives
- Links patterns to research-backed insights

## Data Flow

1. **Input**: User completes assessment → Data validated → Stored in DB
2. **Processing**: AI Engine receives data → Applies scoring rules → Generates results
3. **Safety Check**: Red Flag Engine scans → Critical flags trigger alerts
4. **Explanation**: Explanation Generator creates human-readable insights
5. **Output**: Results returned to frontend with full transparency
6. **Learning**: Patterns stored (anonymized) for aggregate analysis

## Technology Stack

- **Backend**: Python 3.11+
- **Framework**: FastAPI
- **Validation**: Pydantic v2
- **Database**: PostgreSQL 14+ with JSONB
- **Pattern Analysis**: NumPy, Pandas (for statistical analysis)
- **Optional ML**: scikit-learn (pattern detection only, not decision-making)
- **Testing**: pytest, hypothesis
- **Monitoring**: Structured logging, metrics collection

## Security & Privacy

- All data encrypted at rest
- PII anonymized for pattern analysis
- Audit logs for all AI decisions
- User consent required for data usage
- GDPR-compliant data handling

