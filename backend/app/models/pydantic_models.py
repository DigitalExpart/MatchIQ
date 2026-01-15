from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
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


class Category(str, Enum):
    VALUES = "values"
    COMMUNICATION = "communication"
    EMOTIONAL = "emotional"
    LIFESTYLE = "lifestyle"
    FUTURE = "future"


class Importance(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


# Request Models
class ScanAnswerInput(BaseModel):
    question_id: str
    category: str
    rating: Rating
    question_text: Optional[str] = None


class BlueprintAnswerInput(BaseModel):
    question_id: str
    category: Category
    response: str
    importance: Importance
    is_deal_breaker: bool = False


class CreateScanRequest(BaseModel):
    scan_type: ScanType
    person_name: Optional[str] = None
    interaction_type: Optional[str] = None
    answers: List[ScanAnswerInput] = []
    reflection_notes: Optional[Dict[str, Any]] = None


class CreateBlueprintRequest(BaseModel):
    answers: List[BlueprintAnswerInput] = []


class UpdateBlueprintRequest(BaseModel):
    answers: List[BlueprintAnswerInput] = []


class CoachRequest(BaseModel):
    mode: CoachMode
    scan_result_id: Optional[UUID] = None
    scan_id: Optional[UUID] = None
    blueprint_id: Optional[UUID] = None
    specific_question: Optional[str] = None
    category: Optional[str] = None
    context: Optional[Dict[str, Any]] = None  # Additional context from frontend
    session_id: Optional[str] = None  # Chat session ID


# Response Models
class CategoryScore(BaseModel):
    category: str
    score: int
    max_score: int = 100


class RedFlagResponse(BaseModel):
    severity: str
    category: str
    signal: str
    evidence: List[str]


class AIAnalysisResponse(BaseModel):
    strengths: List[str]
    awareness_areas: List[str]
    confidence_score: float
    explanation: str
    recommended_action: str
    action_label: str
    action_guidance: str


class ScanResultResponse(BaseModel):
    id: UUID
    scan_id: UUID
    overall_score: int
    category: str
    category_scores: Dict[str, int]
    ai_analysis: AIAnalysisResponse
    red_flags: List[RedFlagResponse]
    inconsistencies: List[Dict[str, Any]]
    profile_mismatches: List[Dict[str, Any]]
    created_at: datetime
    ai_version: str


class BlueprintResponse(BaseModel):
    id: UUID
    user_id: UUID
    answers: List[Dict[str, Any]]
    profile_summary: Optional[Dict[str, Any]]
    completion_percentage: int
    created_at: datetime
    updated_at: datetime


class ScanResponse(BaseModel):
    id: UUID
    user_id: UUID
    scan_type: str
    person_name: Optional[str]
    status: str
    answers: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime


class CoachResponse(BaseModel):
    message: str
    mode: CoachMode
    confidence: float
    referenced_data: Dict[str, Any]
    engine: Optional[str] = "unknown"  # Debug field: "blocks", "legacy_templates", "pattern_matching"


class HealthResponse(BaseModel):
    status: str
    version: str
    database: str = "connected"


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None

