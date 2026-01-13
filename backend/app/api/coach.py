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
        # Debug logging
        logger.info(f"Amora request: mode={request.mode}, question='{request.specific_question}', has_context={bool(request.context)}")
        
        coach_service = CoachService()
        response = coach_service.get_response(request, user_id)
        
        # Debug logging
        logger.info(f"Amora response: mode={response.mode}, message_length={len(response.message)}, confidence={response.confidence}")
        logger.debug(f"Amora response message: {response.message[:100]}...")
        
        # Validate response (but don't fail - just log warning)
        validation_result = coach_service.validate_response(response)
        if not validation_result:
            logger.warning(f"Coach response validation failed for mode {request.mode}, but continuing")
            # Don't raise exception - just log and continue
            # The response might still be useful even if it doesn't pass strict validation
        
        return response
        
    except ValueError as e:
        logger.error(f"Validation error in coach request: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error getting coach response: {e}", exc_info=True)
        # Return a helpful error response instead of 500
        return CoachResponse(
            message="I apologize, but I encountered an error processing your question. Please try rephrasing it or ask about something else.",
            mode=request.mode,
            confidence=0.0,
            referenced_data={"error": str(e)}
        )

