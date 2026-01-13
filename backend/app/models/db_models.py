"""
Database models for Supabase tables.
These are helper classes for working with Supabase data.
"""
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime
from dataclasses import dataclass, field


@dataclass
class User:
    """User model for Supabase users table."""
    id: UUID
    email: str
    profile: Dict[str, Any] = field(default_factory=dict)
    is_active: bool = True
    subscription_tier: str = "free"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "User":
        """Create User from Supabase response."""
        return cls(
            id=UUID(data["id"]),
            email=data["email"],
            profile=data.get("profile", {}),
            is_active=data.get("is_active", True),
            subscription_tier=data.get("subscription_tier", "free"),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for Supabase insert/update."""
        return {
            "id": str(self.id),
            "email": self.email,
            "profile": self.profile,
            "is_active": self.is_active,
            "subscription_tier": self.subscription_tier,
        }


@dataclass
class Blueprint:
    """Blueprint model for Supabase blueprints table."""
    id: UUID
    user_id: UUID
    answers: List[Dict[str, Any]] = field(default_factory=list)
    profile_summary: Optional[Dict[str, Any]] = None
    completion_percentage: int = 0
    version: int = 1
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Blueprint":
        """Create Blueprint from Supabase response."""
        return cls(
            id=UUID(data["id"]),
            user_id=UUID(data["user_id"]),
            answers=data.get("answers", []),
            profile_summary=data.get("profile_summary"),
            completion_percentage=data.get("completion_percentage", 0),
            version=data.get("version", 1),
            is_active=data.get("is_active", True),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for Supabase insert/update."""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "answers": self.answers,
            "profile_summary": self.profile_summary,
            "completion_percentage": self.completion_percentage,
            "version": self.version,
            "is_active": self.is_active,
        }


@dataclass
class Scan:
    """Scan model for Supabase scans table."""
    id: UUID
    user_id: UUID
    scan_type: str
    person_name: Optional[str] = None
    interaction_type: Optional[str] = None
    answers: List[Dict[str, Any]] = field(default_factory=list)
    reflection_notes: Optional[Dict[str, Any]] = None
    categories_completed: List[str] = field(default_factory=list)
    status: str = "in_progress"
    dual_scan_session_id: Optional[UUID] = None
    dual_scan_role: Optional[str] = None
    partner_scan_id: Optional[UUID] = None
    is_unified: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Scan":
        """Create Scan from Supabase response."""
        return cls(
            id=UUID(data["id"]),
            user_id=UUID(data["user_id"]),
            scan_type=data["scan_type"],
            person_name=data.get("person_name"),
            interaction_type=data.get("interaction_type"),
            answers=data.get("answers", []),
            reflection_notes=data.get("reflection_notes"),
            categories_completed=data.get("categories_completed", []),
            status=data.get("status", "in_progress"),
            dual_scan_session_id=UUID(data["dual_scan_session_id"]) if data.get("dual_scan_session_id") else None,
            dual_scan_role=data.get("dual_scan_role"),
            partner_scan_id=UUID(data["partner_scan_id"]) if data.get("partner_scan_id") else None,
            is_unified=data.get("is_unified", False),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for Supabase insert/update."""
        result = {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "scan_type": self.scan_type,
            "answers": self.answers,
            "categories_completed": self.categories_completed,
            "status": self.status,
            "is_unified": self.is_unified,
        }
        if self.person_name:
            result["person_name"] = self.person_name
        if self.interaction_type:
            result["interaction_type"] = self.interaction_type
        if self.reflection_notes:
            result["reflection_notes"] = self.reflection_notes
        if self.dual_scan_session_id:
            result["dual_scan_session_id"] = str(self.dual_scan_session_id)
        if self.dual_scan_role:
            result["dual_scan_role"] = self.dual_scan_role
        if self.partner_scan_id:
            result["partner_scan_id"] = str(self.partner_scan_id)
        return result


@dataclass
class ScanResult:
    """ScanResult model for Supabase scan_results table."""
    id: UUID
    scan_id: UUID
    overall_score: int
    category: str
    category_scores: Dict[str, int]
    ai_analysis: Dict[str, Any]
    red_flags: List[Dict[str, Any]] = field(default_factory=list)
    inconsistencies: List[Dict[str, Any]] = field(default_factory=list)
    profile_mismatches: List[Dict[str, Any]] = field(default_factory=list)
    explanation_metadata: Optional[Dict[str, Any]] = None
    ai_version: str = "1.0.0"
    created_at: Optional[datetime] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ScanResult":
        """Create ScanResult from Supabase response."""
        return cls(
            id=UUID(data["id"]),
            scan_id=UUID(data["scan_id"]),
            overall_score=data["overall_score"],
            category=data["category"],
            category_scores=data.get("category_scores", {}),
            ai_analysis=data.get("ai_analysis", {}),
            red_flags=data.get("red_flags", []),
            inconsistencies=data.get("inconsistencies", []),
            profile_mismatches=data.get("profile_mismatches", []),
            explanation_metadata=data.get("explanation_metadata"),
            ai_version=data.get("ai_version", "1.0.0"),
            created_at=data.get("created_at"),
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for Supabase insert."""
        return {
            "id": str(self.id),
            "scan_id": str(self.scan_id),
            "overall_score": self.overall_score,
            "category": self.category,
            "category_scores": self.category_scores,
            "ai_analysis": self.ai_analysis,
            "red_flags": self.red_flags,
            "inconsistencies": self.inconsistencies,
            "profile_mismatches": self.profile_mismatches,
            "explanation_metadata": self.explanation_metadata,
            "ai_version": self.ai_version,
        }

