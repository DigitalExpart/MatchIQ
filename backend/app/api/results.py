from fastapi import APIRouter, HTTPException, Depends
from uuid import UUID
from typing import List
import logging

from app.database import get_supabase_client
from app.models.pydantic_models import ScanResultResponse
from app.models.db_models import ScanResult

router = APIRouter()
logger = logging.getLogger(__name__)


def get_user_id_from_auth() -> UUID:
    """Placeholder for authentication."""
    return UUID("00000000-0000-0000-0000-000000000001")


@router.get("/{scan_id}", response_model=ScanResultResponse)
async def get_scan_result(scan_id: UUID):
    """Get scan result by scan ID."""
    try:
        supabase = get_supabase_client()
        result = supabase.table("scan_results").select("*").eq(
            "scan_id", str(scan_id)
        ).limit(1).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Scan result not found")
        
        scan_result = ScanResult.from_dict(result.data[0])
        
        from app.models.pydantic_models import RedFlagResponse, AIAnalysisResponse
        from datetime import datetime
        
        return ScanResultResponse(
            id=scan_result.id,
            scan_id=scan_result.scan_id,
            overall_score=scan_result.overall_score,
            category=scan_result.category,
            category_scores=scan_result.category_scores,
            ai_analysis=AIAnalysisResponse(**scan_result.ai_analysis),
            red_flags=[RedFlagResponse(**flag) for flag in scan_result.red_flags],
            inconsistencies=scan_result.inconsistencies,
            profile_mismatches=scan_result.profile_mismatches,
            created_at=scan_result.created_at or datetime.now(),
            ai_version=scan_result.ai_version
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting scan result: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[ScanResultResponse])
async def list_scan_results(
    user_id: UUID = Depends(get_user_id_from_auth),
    limit: int = 20,
    offset: int = 0
):
    """List user's scan results."""
    try:
        supabase = get_supabase_client()
        
        # Get user's scans first
        scans_result = supabase.table("scans").select("id").eq(
            "user_id", str(user_id)
        ).execute()
        
        scan_ids = [s["id"] for s in scans_result.data]
        
        if not scan_ids:
            return []
        
        # Get results for those scans
        result = supabase.table("scan_results").select("*").in_(
            "scan_id", scan_ids
        ).order("created_at", desc=True).limit(limit).offset(offset).execute()
        
        from app.models.pydantic_models import RedFlagResponse, AIAnalysisResponse
        from datetime import datetime
        
        return [
            ScanResultResponse(
                id=ScanResult.from_dict(data).id,
                scan_id=ScanResult.from_dict(data).scan_id,
                overall_score=ScanResult.from_dict(data).overall_score,
                category=ScanResult.from_dict(data).category,
                category_scores=ScanResult.from_dict(data).category_scores,
                ai_analysis=AIAnalysisResponse(**ScanResult.from_dict(data).ai_analysis),
                red_flags=[RedFlagResponse(**flag) for flag in ScanResult.from_dict(data).red_flags],
                inconsistencies=ScanResult.from_dict(data).inconsistencies,
                profile_mismatches=ScanResult.from_dict(data).profile_mismatches,
                created_at=ScanResult.from_dict(data).created_at or datetime.now(),
                ai_version=ScanResult.from_dict(data).ai_version
            )
            for data in result.data
        ]
    except Exception as e:
        logger.error(f"Error listing scan results: {e}")
        raise HTTPException(status_code=500, detail=str(e))

