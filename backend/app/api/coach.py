from fastapi import APIRouter, HTTPException, Depends
from uuid import UUID
import logging

from app.database import get_supabase_client
from app.models.pydantic_models import CoachRequest, CoachResponse
from app.services.coach_service import CoachService

router = APIRouter()
logger = logging.getLogger(__name__)


def get_user_id_from_auth() -> UUID:
    """Placeholder for authentication."""
    return UUID("00000000-0000-0000-0000-000000000001")


@router.post("/", response_model=CoachResponse)
async def get_coach_response(
    request: CoachRequest,
    user_id: UUID = Depends(get_user_id_from_auth)
):
    """Get AI Coach response in specified mode."""
    try:
        coach_service = CoachService()
        response = coach_service.get_response(request, user_id)
        
        # Validate response
        if not coach_service.validate_response(response):
            raise HTTPException(
                status_code=500,
                detail="Generated response failed validation"
            )
        
        return response
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error getting coach response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

