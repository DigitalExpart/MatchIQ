"""
Pydantic models for request/response validation
"""
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


class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# Request Models
class ScanAnswerInput(BaseModel):
    question_id: str
    category: str
    rating: Rating
    question_text: str


class ReflectionNotesInput(BaseModel):
    good_moments: Optional[str] = None
    worst_moments: Optional[str] = None
    sad_moments: Optional[str] = None
    vulnerable_moments: Optional[str] = None
    additional_notes: Optional[str] = None


class CreateScanRequest(BaseModel):
    person_name: Optional[str] = None
    interaction_type: Optional[str] = None
    scan_type: ScanType = ScanType.SINGLE
    answers: List[ScanAnswerInput]
    reflection_notes: Optional[ReflectionNotesInput] = None
    categories_completed: Optional[List[str]] = None


class BlueprintAnswerInput(BaseModel):
    question_id: str
    category: str
    response: str
    importance: str = Field(..., pattern="^(low|medium|high)$")
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
    session_id: Optional[UUID] = None  # Chat session ID for memory


# Response Models
class RedFlagResponse(BaseModel):
    severity: Severity
    category: str
    signal: str
    evidence: List[str]
    type: Optional[str] = None


class InconsistencyResponse(BaseModel):
    type: str
    description: str
    questions: List[str]
    severity: Severity


class ProfileMismatchResponse(BaseModel):
    description: str
    severity: Severity
    category: str


class CategoryScore(BaseModel):
    category: str
    score: float


class ScanResultResponse(BaseModel):
    id: UUID
    scan_id: UUID
    overall_score: int
    category: str
    category_scores: Dict[str, float]
    red_flags: List[RedFlagResponse]
    inconsistencies: List[InconsistencyResponse]
    profile_mismatches: List[ProfileMismatchResponse]
    confidence_score: float
    confidence_reason: Optional[str] = None  # Explanation of confidence level
    data_sufficiency: Optional[Dict[str, Any]] = None  # Data sufficiency check results
    conflict_density: Optional[Dict[str, Any]] = None  # Conflict density analysis
    gating_recommendations: Optional[List[str]] = None  # Recommendations from gating
    escalation_reason: Optional[str] = None  # Explanation of risk escalation if occurred
    explanation_metadata: Optional[Dict[str, Any]] = None  # Explanation traceability metadata (tier-filtered)
    ai_version: str
    logic_version: str  # Scoring configuration version
    strengths: List[str]
    awareness_areas: List[str]
    tier: Optional[str] = None  # User's subscription tier
    tier_limitations: Optional[Dict[str, Any]] = None  # Tier-based limitations info
    recommended_action: Optional[str] = None
    action_label: Optional[str] = None
    action_guidance: Optional[str] = None
    created_at: datetime


class CoachResponse(BaseModel):
    message: str
    mode: CoachMode
    confidence: float
    referenced_data: Dict[str, Any]
    session_id: Optional[UUID] = None  # Session ID for frontend to track
    user_name: Optional[str] = None  # User's name if known


class ChatMessageResponse(BaseModel):
    id: UUID
    role: str  # 'user' or 'ai'
    message: str
    is_question: bool
    created_at: datetime


class ChatSessionResponse(BaseModel):
    id: UUID
    user_id: UUID
    scan_id: Optional[UUID]
    user_name: Optional[str]
    created_at: datetime
    updated_at: datetime
    last_message_at: Optional[datetime]
    messages: List[ChatMessageResponse]


class BlueprintResponse(BaseModel):
    id: UUID
    user_id: UUID
    category_weights: Dict[str, float]
    deal_breakers: List[Dict[str, Any]]
    top_priorities: List[str]
    completion_percentage: int
    created_at: datetime


class DualScanResultResponse(BaseModel):
    session_id: UUID
    mutual_score: float
    alignment_a_to_b: float
    alignment_b_to_a: float
    asymmetry_detected: bool
    asymmetry_difference: Optional[float] = None
    mutual_deal_breakers: List[Dict[str, Any]]
    complementary_areas: List[Dict[str, Any]]
    category_breakdown: Dict[str, Dict[str, float]]
    confidence_score: float
    created_at: datetime

