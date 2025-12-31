# Data Model Definitions

## Core Tables

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Profile data stored as JSONB for flexibility
    profile JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Profile structure:
    -- {
    --   "name": "string",
    --   "age": integer,
    --   "dating_goal": "casual" | "serious" | "long-term" | "marriage",
    --   "location": "string",
    --   "language": "en" | "es" | "fr" | "de" | "it",
    --   "bio": "string"
    -- }
    is_active BOOLEAN DEFAULT TRUE,
    subscription_tier VARCHAR(20) DEFAULT 'free'
);
```

### 2. Blueprints Table (Self-Assessment)
```sql
CREATE TABLE blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Blueprint answers stored as JSONB array
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Answer structure:
    -- [
    --   {
    --     "question_id": "string",
    --     "category": "values" | "communication" | "emotional" | "lifestyle" | "future",
    --     "response": "string",
    --     "importance": "low" | "medium" | "high",
    --     "is_deal_breaker": boolean,
    --     "weight": float (0.0-1.0, calculated)
    --   }
    -- ]
    
    -- Computed blueprint profile (cached for performance)
    profile_summary JSONB,
    -- {
    --   "category_weights": {
    --     "values": 0.35,
    --     "communication": 0.25,
    --     ...
    --   },
    --   "deal_breakers": ["category1", "category2"],
    --   "top_priorities": ["priority1", "priority2"]
    -- }
    
    completion_percentage INTEGER DEFAULT 0
);
```

### 3. Scans Table (Assessments)
```sql
CREATE TABLE scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Scan metadata
    scan_type VARCHAR(20) NOT NULL, -- 'single', 'dual', 'guided'
    person_name VARCHAR(255),
    interaction_type VARCHAR(50), -- 'text', 'phone', 'video', 'in_person'
    
    -- Scan responses stored as JSONB
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Answer structure:
    -- [
    --   {
    --     "question_id": "string",
    --     "category": "string",
    --     "rating": "strong-match" | "good" | "neutral" | "yellow-flag" | "red-flag",
    --     "question_text": "string",
    --     "answered_at": "timestamp"
    --   }
    -- ]
    
    -- Reflection notes (optional)
    reflection_notes JSONB,
    -- {
    --   "good_moments": "string",
    --   "worst_moments": "string",
    --   "sad_moments": "string",
    --   "vulnerable_moments": "string",
    --   "additional_notes": "string"
    -- }
    
    -- Categories assessed
    categories_completed TEXT[],
    
    -- Status
    status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
    
    -- For dual scans
    dual_scan_session_id UUID, -- Links two scans together
    dual_scan_role VARCHAR(1), -- 'A' or 'B' for dual scans
    partner_scan_id UUID REFERENCES scans(id), -- Link to partner's scan
    is_unified BOOLEAN DEFAULT FALSE -- If categories were unified
);
```

### 4. Scan Results Table
```sql
CREATE TABLE scan_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ai_version VARCHAR(20) NOT NULL, -- Version of AI logic used
    
    -- Overall scores
    overall_score INTEGER NOT NULL, -- 0-100
    category VARCHAR(50) NOT NULL, -- 'high-potential', 'worth-exploring', 'mixed-signals', 'caution', 'high-risk'
    
    -- Category breakdown scores
    category_scores JSONB NOT NULL,
    -- {
    --   "emotional_alignment": 75,
    --   "communication_fit": 68,
    --   "values_match": 72,
    --   "lifestyle_harmony": 65,
    --   "future_goals": 70,
    --   "safety_stability": 85
    -- }
    
    -- AI Analysis
    ai_analysis JSONB NOT NULL,
    -- {
    --   "strengths": ["string"],
    --   "awareness_areas": ["string"],
    --   "confidence_score": 0.85,
    --   "explanation": "string",
    --   "recommended_action": "proceed" | "proceed-with-awareness" | "pause-and-reflect",
    --   "action_label": "string",
    --   "action_guidance": "string"
    -- }
    
    -- Red flags detected
    red_flags JSONB DEFAULT '[]'::jsonb,
    -- [
    --   {
    --     "severity": "low" | "medium" | "high" | "critical",
    --     "category": "string",
    --     "signal": "string",
    --     "evidence": ["question_id1", "question_id2"],
    --     "detected_at": "timestamp"
    --   }
    -- ]
    
    -- Inconsistencies detected
    inconsistencies JSONB DEFAULT '[]'::jsonb,
    -- [
    --   {
    --   {
    --     "type": "string",
    --     "description": "string",
    --     "questions": ["question_id1", "question_id2"],
    --     "severity": "low" | "medium" | "high"
    --   }
    -- ]
    
    -- Profile alignment check
    profile_mismatches JSONB DEFAULT '[]'::jsonb,
    -- [
    --   {
    --     "description": "string",
    --     "severity": "low" | "medium" | "high",
    --     "category": "string"
    --   }
    -- ]
    
    -- Explanation metadata
    explanation_metadata JSONB,
    -- {
    --   "reasoning_steps": ["step1", "step2"],
    --   "weight_applications": {...},
    --   "pattern_matches": [...]
    -- }
);
```

### 5. Red Flags Table (For Pattern Tracking)
```sql
CREATE TABLE red_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    scan_result_id UUID REFERENCES scan_results(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    category VARCHAR(50) NOT NULL,
    signal TEXT NOT NULL,
    evidence JSONB, -- Question IDs and responses that triggered this
    
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- For pattern analysis (anonymized)
    pattern_hash VARCHAR(64), -- Hash of pattern (for anonymized tracking)
    
    INDEX idx_severity (severity),
    INDEX idx_user_severity (user_id, severity),
    INDEX idx_pattern_hash (pattern_hash)
);
```

### 6. Pattern Knowledge Base (Anonymized Learning)
```sql
CREATE TABLE pattern_knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_hash VARCHAR(64) UNIQUE NOT NULL,
    pattern_type VARCHAR(50) NOT NULL, -- 'response_pattern', 'score_pattern', 'flag_pattern'
    
    -- Pattern data (anonymized, no PII)
    pattern_data JSONB NOT NULL,
    -- {
    --   "response_sequence": ["rating1", "rating2", ...],
    --   "category_distribution": {...},
    --   "score_range": [min, max]
    -- }
    
    -- Aggregate statistics
    occurrence_count INTEGER DEFAULT 1,
    avg_score DECIMAL(5,2),
    score_std_dev DECIMAL(5,2),
    flag_rate DECIMAL(5,4), -- Percentage of times this pattern had flags
    avg_confidence DECIMAL(5,4),
    
    -- Outcome tracking (if available, anonymized)
    outcome_distribution JSONB,
    -- {
    --   "high_potential": 0.15,
    --   "worth_exploring": 0.35,
    --   "mixed_signals": 0.30,
    --   "caution": 0.15,
    --   "high_risk": 0.05
    -- }
    
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_pattern_type (pattern_type),
    INDEX idx_occurrence_count (occurrence_count DESC)
);
```

### 7. AI Logic Versions (For Auditing)
```sql
CREATE TABLE ai_logic_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(20) UNIQUE NOT NULL, -- e.g., "1.2.3"
    description TEXT,
    
    -- Logic configuration (JSONB for flexibility)
    scoring_config JSONB NOT NULL,
    -- {
    --   "rating_weights": {
    --     "strong-match": 100,
    --     "good": 75,
    --     "neutral": 50,
    --     "yellow-flag": 25,
    --     "red-flag": 0
    --   },
    --   "category_weights": {...},
    --   "flag_thresholds": {...}
    -- }
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255), -- Admin user who created this version
    is_active BOOLEAN DEFAULT FALSE,
    activated_at TIMESTAMP WITH TIME ZONE,
    
    -- Change log
    changes JSONB,
    -- {
    --   "previous_version": "1.2.2",
    --   "changes": ["description of changes"]
    -- }
);
```

### 8. User Feedback (For Learning)
```sql
CREATE TABLE user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_result_id UUID NOT NULL REFERENCES scan_results(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Feedback on AI accuracy
    was_accurate BOOLEAN,
    feedback_text TEXT,
    
    -- Specific feedback areas
    score_accuracy INTEGER, -- 1-5 rating
    explanation_helpfulness INTEGER, -- 1-5 rating
    flag_relevance INTEGER, -- 1-5 rating
    
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_was_accurate (was_accurate),
    INDEX idx_user_id (user_id)
);
```

## Indexes for Performance

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;

-- Blueprint lookups
CREATE INDEX idx_blueprints_user_active ON blueprints(user_id, is_active) WHERE is_active = TRUE;

-- Scan lookups
CREATE INDEX idx_scans_user_status ON scans(user_id, status);
CREATE INDEX idx_scans_dual_session ON scans(dual_scan_session_id) WHERE dual_scan_session_id IS NOT NULL;
CREATE INDEX idx_scans_created ON scans(created_at DESC);

-- Results lookups
CREATE INDEX idx_scan_results_scan ON scan_results(scan_id);
CREATE INDEX idx_scan_results_category ON scan_results(category);
CREATE INDEX idx_scan_results_score ON scan_results(overall_score);

-- JSONB indexes for common queries
CREATE INDEX idx_scans_answers_gin ON scans USING GIN(answers);
CREATE INDEX idx_blueprints_answers_gin ON blueprints USING GIN(answers);
CREATE INDEX idx_scan_results_category_scores_gin ON scan_results USING GIN(category_scores);
```

## Pydantic Models (Python)

See `models.py` for Python Pydantic model definitions that match these schemas.

