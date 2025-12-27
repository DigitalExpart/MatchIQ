# FastAPI Implementation Example

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app
│   ├── config.py              # Configuration
│   ├── database.py            # DB connection
│   ├── models/
│   │   ├── __init__.py
│   │   ├── pydantic_models.py # Request/Response models
│   │   └── db_models.py       # SQLAlchemy models
│   ├── api/
│   │   ├── __init__.py
│   │   ├── assessments.py     # Assessment endpoints
│   │   ├── blueprints.py      # Blueprint endpoints
│   │   ├── results.py         # Results endpoints
│   │   └── coach.py           # AI Coach endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── scoring_engine.py
│   │   ├── red_flag_engine.py
│   │   ├── dual_scan_engine.py
│   │   ├── coach_service.py
│   │   └── pattern_kb.py
│   └── utils/
│       ├── __init__.py
│       └── validators.py
├── tests/
│   ├── test_scoring.py
│   ├── test_flags.py
│   └── test_coach.py
└── requirements.txt
```

## Main Application

### app/main.py

```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.config import settings
from app.database import init_db, get_db
from app.api import assessments, blueprints, results, coach

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield
    # Shutdown
    pass

app = FastAPI(
    title="MyMatchIQ AI Backend",
    description="Decision intelligence engine for relationship compatibility",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(assessments.router, prefix="/api/v1/assessments", tags=["assessments"])
app.include_router(blueprints.router, prefix="/api/v1/blueprints", tags=["blueprints"])
app.include_router(results.router, prefix="/api/v1/results", tags=["results"])
app.include_router(coach.router, prefix="/api/v1/coach", tags=["coach"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```

## Configuration

### app/config.py

```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:pass@localhost/matchiq"
    
    # AI Version
    AI_VERSION: str = "1.0.0"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()
```

## Pydantic Models

### app/models/pydantic_models.py

```python
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from uuid import UUID
from datetime import datetime
from enum import Enum

# Enums
class Rating(str, Enum):
    STRONG_MATCH = "strong-match"
    GOOD = "good"
    NEUTRAL = "neutral"
    YELLOW_FLAG = "yellow-flag"
    RED_FLAG = "red-flag"

class ScanType(str, Enum):
    SINGLE = "single"
    DUAL = "dual"
    GUIDED = "guided"

class CoachMode(str, Enum):
    EXPLAIN = "EXPLAIN"
    REFLECT = "REFLECT"
    LEARN = "LEARN"
    SAFETY = "SAFETY"

# Request Models
class ScanAnswerInput(BaseModel):
    question_id: str
    category: str
    rating: Rating
    question_text: str

class CreateScanRequest(BaseModel):
    person_name: Optional[str] = None
    interaction_type: Optional[str] = None
    scan_type: ScanType = ScanType.SINGLE
    answers: List[ScanAnswerInput]
    reflection_notes: Optional[Dict] = None

class BlueprintAnswerInput(BaseModel):
    question_id: str
    category: str
    response: str
    importance: str  # "low", "medium", "high"
    is_deal_breaker: bool = False

class CreateBlueprintRequest(BaseModel):
    answers: List[BlueprintAnswerInput]

class CoachRequest(BaseModel):
    mode: CoachMode
    scan_result_id: Optional[UUID] = None
    scan_id: Optional[UUID] = None
    blueprint_id: Optional[UUID] = None
    specific_question: Optional[str] = None
    category: Optional[str] = None

# Response Models
class CategoryScore(BaseModel):
    category: str
    score: float

class RedFlagResponse(BaseModel):
    severity: str
    category: str
    signal: str
    evidence: List[str]

class ScanResultResponse(BaseModel):
    id: UUID
    scan_id: UUID
    overall_score: int
    category: str
    category_scores: Dict[str, float]
    red_flags: List[RedFlagResponse]
    confidence_score: float
    ai_version: str
    created_at: datetime

class CoachResponse(BaseModel):
    message: str
    mode: CoachMode
    confidence: float
    referenced_data: Dict
```

## API Endpoints

### app/api/assessments.py

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models.pydantic_models import CreateScanRequest, ScanResultResponse
from app.services.scoring_engine import ScoringEngine
from app.services.red_flag_engine import RedFlagEngine

router = APIRouter()

@router.post("/", response_model=ScanResultResponse)
async def create_assessment(
    request: CreateScanRequest,
    user_id: UUID,  # From auth token
    db: Session = Depends(get_db)
):
    """
    Process a new assessment and return results.
    """
    # Create scan record
    scan = create_scan_record(db, user_id, request)
    
    # Load user blueprint
    blueprint = get_active_blueprint(db, user_id)
    if not blueprint:
        raise HTTPException(
            status_code=400,
            detail="No active blueprint found. Please complete self-assessment first."
        )
    
    # Load user profile
    user_profile = get_user_profile(db, user_id)
    
    # Process with AI engine
    scoring_engine = ScoringEngine(ai_version=get_active_ai_version())
    result = scoring_engine.process_scan(scan, blueprint, user_profile)
    
    # Detect red flags
    flag_engine = RedFlagEngine()
    red_flags = flag_engine.detect_all(scan, blueprint, user_profile)
    result.red_flags = red_flags
    
    # Save result
    scan_result = save_scan_result(db, scan.id, result)
    
    # Store patterns (anonymized)
    pattern_kb.store_pattern(extract_pattern(scan), result.category)
    
    return ScanResultResponse.from_orm(scan_result)
```

### app/api/coach.py

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models.pydantic_models import CoachRequest, CoachResponse
from app.services.coach_service import CoachService

router = APIRouter()

@router.post("/", response_model=CoachResponse)
async def get_coach_response(
    request: CoachRequest,
    user_id: UUID,  # From auth token
    db: Session = Depends(get_db)
):
    """
    Get AI Coach response in specified mode.
    """
    # Validate request
    if not any([request.scan_result_id, request.scan_id]):
        if request.mode != CoachMode.REFLECT:
            raise HTTPException(
                status_code=400,
                detail="scan_result_id or scan_id required for this mode"
            )
    
    # Get coach response
    coach_service = CoachService(db)
    response = coach_service.get_response(request, user_id)
    
    # Validate response
    if not coach_service.validate_response(response):
        raise HTTPException(
            status_code=500,
            detail="Generated response failed validation"
        )
    
    return response
```

## Service Implementation

### app/services/scoring_engine.py

```python
from typing import Dict, List
from app.models.db_models import Scan, Blueprint, UserProfile
from app.services.scoring_logic import (
    calculate_category_scores,
    calculate_overall_score,
    classify_category,
    calculate_confidence_score
)

class ScoringEngine:
    def __init__(self, ai_version: str):
        self.ai_version = ai_version
    
    def process_scan(
        self,
        scan: Scan,
        blueprint: Blueprint,
        user_profile: UserProfile
    ) -> ScanResult:
        """
        Process scan and generate results.
        """
        # Calculate category scores
        category_scores = calculate_category_scores(
            scan.answers,
            blueprint.category_weights
        )
        
        # Calculate overall score
        overall_score = calculate_overall_score(
            category_scores,
            blueprint.category_weights,
            user_profile,
            scan.reflection_notes
        )
        
        # Classify category
        category = classify_category(overall_score)
        
        # Calculate confidence
        confidence = calculate_confidence_score(
            scan,
            category_scores,
            len(scan.answers)
        )
        
        # Generate explanation
        explanation = self._generate_explanation(
            overall_score,
            category_scores,
            blueprint
        )
        
        return ScanResult(
            overall_score=overall_score,
            category=category,
            category_scores=category_scores,
            confidence_score=confidence,
            explanation=explanation,
            ai_version=self.ai_version
        )
    
    def _generate_explanation(
        self,
        overall_score: int,
        category_scores: Dict[str, float],
        blueprint: Blueprint
    ) -> str:
        """Generate explanation of results."""
        # Implementation from SCORING_LOGIC.md
        pass
```

### app/services/red_flag_engine.py

```python
from typing import List
from app.models.db_models import Scan, Blueprint, UserProfile, RedFlag
from app.services.flag_detection import (
    detect_deal_breaker_violations,
    detect_safety_patterns,
    detect_inconsistencies,
    detect_profile_mismatches,
    aggregate_and_prioritize_flags
)

class RedFlagEngine:
    def detect_all(
        self,
        scan: Scan,
        blueprint: Blueprint,
        user_profile: UserProfile
    ) -> List[RedFlag]:
        """
        Run all flag detection methods.
        """
        all_flags = []
        
        # Deal-breaker violations
        all_flags.extend(
            detect_deal_breaker_violations(scan.answers, blueprint)
        )
        
        # Safety patterns
        all_flags.extend(
            detect_safety_patterns(scan.answers, scan.reflection_notes)
        )
        
        # Inconsistencies
        inconsistencies = detect_inconsistencies(scan.answers)
        # Convert to flags if needed
        
        # Profile mismatches
        mismatches = detect_profile_mismatches(scan, blueprint, user_profile)
        # Convert to flags if needed
        
        # Aggregate and prioritize
        prioritized = aggregate_and_prioritize_flags(all_flags)
        
        return prioritized
```

## Database Models (SQLAlchemy)

### app/models/db_models.py

```python
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, JSON, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    profile = Column(JSONB, default={})
    
    blueprints = relationship("Blueprint", back_populates="user")
    scans = relationship("Scan", back_populates="user")

class Blueprint(Base):
    __tablename__ = "blueprints"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    answers = Column(JSONB, default=[])
    profile_summary = Column(JSONB)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="blueprints")

class Scan(Base):
    __tablename__ = "scans"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    scan_type = Column(String(20), nullable=False)
    person_name = Column(String(255))
    answers = Column(JSONB, default=[])
    reflection_notes = Column(JSONB)
    status = Column(String(20), default="in_progress")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="scans")
    results = relationship("ScanResult", back_populates="scan")

class ScanResult(Base):
    __tablename__ = "scan_results"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(UUID(as_uuid=True), ForeignKey("scans.id"), nullable=False)
    ai_version = Column(String(20), nullable=False)
    overall_score = Column(Integer, nullable=False)
    category = Column(String(50), nullable=False)
    category_scores = Column(JSONB, nullable=False)
    red_flags = Column(JSONB, default=[])
    confidence_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    scan = relationship("Scan", back_populates="results")
```

## Database Connection

### app/database.py

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.config import settings
from app.models.db_models import Base

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)

def get_db() -> Session:
    """Dependency for getting database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## Testing Example

### tests/test_scoring.py

```python
import pytest
from app.services.scoring_engine import ScoringEngine
from app.models.db_models import Scan, Blueprint, UserProfile

def test_scoring_engine():
    engine = ScoringEngine(ai_version="1.0.0")
    
    # Create test data
    scan = create_test_scan()
    blueprint = create_test_blueprint()
    user_profile = create_test_user_profile()
    
    # Process
    result = engine.process_scan(scan, blueprint, user_profile)
    
    # Assertions
    assert result.overall_score >= 0
    assert result.overall_score <= 100
    assert result.category in ['high-potential', 'worth-exploring', 'mixed-signals', 'caution', 'high-risk']
    assert len(result.category_scores) > 0
```

## Deployment Considerations

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### requirements.txt

```
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

## Summary

This FastAPI implementation provides:
1. **Structured endpoints** for assessments, blueprints, results, and coach
2. **Service layer** for business logic
3. **Database models** using SQLAlchemy
4. **Pydantic validation** for requests/responses
5. **Version tracking** for AI logic
6. **Test structure** for validation

All components follow the design principles: deterministic, transparent, and explainable.

