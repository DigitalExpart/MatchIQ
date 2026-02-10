from fastapi import APIRouter, HTTPException, Depends
from uuid import UUID
from typing import List
from datetime import datetime
import logging

from app.database import get_supabase_client
from app.models.pydantic_models import (
    CreateScanRequest,
    ScanResponse,
    ScanResultResponse,
    RedFlagResponse
)
from app.models.db_models import Scan
from app.services.scoring_engine import ScoringEngine
from app.services.red_flag_engine import RedFlagEngine
from app.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


def get_user_id_from_auth() -> UUID:
    """Placeholder for authentication - replace with actual auth."""
    # TODO: Implement JWT token validation
    # For now, return a test user ID
    return UUID("00000000-0000-0000-0000-000000000001")


@router.post("/", response_model=ScanResultResponse)
async def create_assessment(
    request: CreateScanRequest,
    user_id: UUID = Depends(get_user_id_from_auth)
):
    """
    Process a new assessment and return results.
    """
    try:
        supabase = get_supabase_client()
        
        # Create scan record
        scan_data = {
            "user_id": str(user_id),
            "scan_type": request.scan_type.value,
            "person_name": request.person_name,
            "interaction_type": request.interaction_type,
            "answers": [answer.dict() for answer in request.answers],
            "reflection_notes": request.reflection_notes,
            "status": "completed",
            "categories_completed": list(set([a.category for a in request.answers]))
        }
        
        result = supabase.table("scans").insert(scan_data).execute()
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create scan")
        
        scan = Scan.from_dict(result.data[0])
        
        # Load user blueprint
        blueprint_result = supabase.table("blueprints").select("*").eq(
            "user_id", str(user_id)
        ).eq("is_active", True).limit(1).execute()
        
        if not blueprint_result.data:
            raise HTTPException(
                status_code=400,
                detail="No active blueprint found. Please complete self-assessment first."
            )
        
        from app.models.db_models import Blueprint, User, ScanResult
        blueprint = Blueprint.from_dict(blueprint_result.data[0])
        
        # Load user profile
        user_result = supabase.table("users").select("*").eq("id", str(user_id)).execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_profile = User.from_dict(user_result.data[0])
        
        # Process with AI engine
        scoring_engine = ScoringEngine(ai_version=settings.AI_VERSION)
        scan_result = scoring_engine.process_scan(scan, blueprint, user_profile)
        
        # Detect red flags
        flag_engine = RedFlagEngine()
        red_flags = flag_engine.detect_all(scan, blueprint, user_profile)
        scan_result.red_flags = red_flags
        
        # Save result to database
        result_data = scan_result.to_dict()
        result_insert = supabase.table("scan_results").insert(result_data).execute()
        
        if not result_insert.data:
            raise HTTPException(status_code=500, detail="Failed to save scan result")
        
        saved_result = ScanResult.from_dict(result_insert.data[0])
        
        # Convert to response model
        return ScanResultResponse(
            id=saved_result.id,
            scan_id=saved_result.scan_id,
            overall_score=saved_result.overall_score,
            category=saved_result.category,
            category_scores=saved_result.category_scores,
            ai_analysis=saved_result.ai_analysis,
            red_flags=[RedFlagResponse(**flag) for flag in saved_result.red_flags],
            inconsistencies=saved_result.inconsistencies,
            profile_mismatches=saved_result.profile_mismatches,
            created_at=saved_result.created_at or datetime.now(),
            ai_version=saved_result.ai_version
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating assessment: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{scan_id}", response_model=ScanResponse)
async def get_assessment(scan_id: UUID):
    """Get assessment by ID."""
    try:
        supabase = get_supabase_client()
        result = supabase.table("scans").select("*").eq("id", str(scan_id)).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Scan not found")
        
        scan = Scan.from_dict(result.data[0])
        return ScanResponse(
            id=scan.id,
            user_id=scan.user_id,
            scan_type=scan.scan_type,
            person_name=scan.person_name,
            status=scan.status,
            answers=scan.answers,
            created_at=scan.created_at or datetime.now(),
            updated_at=scan.updated_at or datetime.now()
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting assessment: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[ScanResponse])
async def list_assessments(
    user_id: UUID = Depends(get_user_id_from_auth),
    limit: int = 20,
    offset: int = 0
):
    """List user's assessments."""
    try:
        supabase = get_supabase_client()
        result = supabase.table("scans").select("*").eq(
            "user_id", str(user_id)
        ).order("created_at", desc=True).limit(limit).offset(offset).execute()
        
        scans = [Scan.from_dict(data) for data in result.data]
        return [
            ScanResponse(
                id=scan.id,
                user_id=scan.user_id,
                scan_type=scan.scan_type,
                person_name=scan.person_name,
                status=scan.status,
                answers=scan.answers,
                created_at=scan.created_at or datetime.now(),
                updated_at=scan.updated_at or datetime.now()
            )
            for scan in scans
        ]
    except Exception as e:
        logger.error(f"Error listing assessments: {e}")
        raise HTTPException(status_code=500, detail=str(e))

