# MyMatchIQ AI System Design Documentation

## Overview

This directory contains the complete design documentation for MyMatchIQ's custom AI decision intelligence engine. The AI is **NOT** a chatbot or generic LLM wrapper - it is a rule-based, deterministic system for evaluating relationship compatibility.

## Documentation Structure

### 1. [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)
High-level system design, module responsibilities, and technology stack.

### 2. [DATA_MODELS.md](./DATA_MODELS.md)
Complete database schema definitions (PostgreSQL) and Pydantic models.

### 3. [SCORING_LOGIC.md](./SCORING_LOGIC.md)
Detailed scoring formulas, calculations, and algorithms for:
- Blueprint scoring
- Scan response scoring
- Category breakdowns
- Confidence scoring
- Dual scan mutual alignment

### 4. [RED_FLAG_ENGINE.md](./RED_FLAG_ENGINE.md)
Red flag detection logic:
- Deal-breaker violations
- Safety pattern detection
- Inconsistency detection
- Profile alignment checks
- Severity grading

### 5. [DUAL_SCAN_LOGIC.md](./DUAL_SCAN_LOGIC.md)
Mutual alignment calculation for dual scans:
- Privacy-preserving algorithms
- Geometric mean for mutual scores
- Deal-breaker detection
- Complementary area identification

### 6. [AI_COACH_SPECIFICATION.md](./AI_COACH_SPECIFICATION.md)
Complete specification for Ella (AI Coach):
- Core principles and constraints
- Four operating modes (EXPLAIN, REFLECT, LEARN, SAFETY)
- Language rules and examples
- What Ella can and cannot do

### 7. [AI_COACH_IMPLEMENTATION.md](./AI_COACH_IMPLEMENTATION.md)
Implementation guide for AI Coach:
- Mode routing
- Context building
- Template-based response generation
- Response validation

### 8. [LEARNING_STRATEGY.md](./LEARNING_STRATEGY.md)
Learning and improvement approach:
- Pattern knowledge base
- Human-reviewed updates
- Versioning system
- Testing and validation

### 9. [FASTAPI_IMPLEMENTATION.md](./FASTAPI_IMPLEMENTATION.md)
Example FastAPI implementation:
- Project structure
- API endpoints
- Service layer
- Database models
- Testing examples

## Core Principles

1. **Deterministic**: Same inputs always produce same outputs
2. **Transparent**: Every score has an explainable calculation path
3. **Safety-First**: Red flags trigger immediate protocols
4. **Non-Directive**: AI explains patterns, never prescribes actions
5. **Versioned**: All logic changes are tracked and auditable

## Technology Stack

- **Backend**: Python 3.11+
- **Framework**: FastAPI
- **Validation**: Pydantic v2
- **Database**: PostgreSQL 14+ with JSONB
- **Pattern Analysis**: NumPy, Pandas
- **Testing**: pytest

## Implementation Order

1. ✅ System Architecture
2. ✅ Data Models
3. ✅ Scoring Logic
4. ✅ Red Flag Engine
5. ✅ Dual Scan Logic
6. ✅ AI Coach Specification
7. ✅ AI Coach Implementation
8. ✅ Learning Strategy
9. ✅ FastAPI Implementation

## Next Steps

1. **Implement Core Services**
   - Start with scoring engine
   - Add red flag detection
   - Implement dual scan logic

2. **Build API Layer**
   - Create FastAPI endpoints
   - Add authentication
   - Implement request validation

3. **Database Setup**
   - Create PostgreSQL schema
   - Set up migrations
   - Seed initial data

4. **Testing**
   - Unit tests for scoring logic
   - Integration tests for API
   - End-to-end tests

5. **Deployment**
   - Docker containerization
   - CI/CD pipeline
   - Monitoring and logging

## Important Notes

- **No LLM Usage**: All responses are template-based and rule-driven
- **No Self-Modification**: All logic changes require human review
- **Privacy-First**: Dual scans preserve user privacy
- **Audit Trail**: All AI decisions are logged and versioned

## Questions or Issues?

Refer to the specific documentation file for detailed information about each component.

