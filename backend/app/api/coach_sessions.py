"""
Coaching Session Management API endpoints.
Handles CRUD operations for Amora coaching sessions.
"""
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from typing import List, Optional
import logging
from datetime import datetime

from app.models.pydantic_models import (
    CreateSessionRequest,
    UpdateSessionRequest,
    SessionResponse,
    FollowUpResponse,
    FeedbackRequest
)
from app.models.db_models import AmoraSession
from app.database import get_supabase_client
from app.api.coach_enhanced import get_user_id_from_auth

router = APIRouter(prefix="/coach/sessions", tags=["coach-sessions"])
logger = logging.getLogger(__name__)


@router.get("", response_model=List[SessionResponse])
async def list_sessions(
    user_id: UUID = Depends(get_user_id_from_auth)
):
    """List all coaching sessions for the current user."""
    try:
        supabase = get_supabase_client()
        response = supabase.table("amora_sessions") \
            .select("*") \
            .eq("user_id", str(user_id)) \
            .order("updated_at", desc=True) \
            .execute()
        
        sessions = []
        for row in response.data:
            session = AmoraSession.from_dict(row)
            sessions.append(SessionResponse(
                id=session.id,
                title=session.title,
                primary_topic=session.primary_topic,
                status=session.status,
                created_at=session.created_at or datetime.now(),
                updated_at=session.updated_at or datetime.now(),
                last_message_at=session.last_message_at,
                follow_up_enabled=session.follow_up_enabled,
                follow_up_time=session.follow_up_time,
                summary_text=session.summary_text,
                next_plan_text=session.next_plan_text
            ))
        
        return sessions
    except Exception as e:
        logger.error(f"Error listing sessions: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", response_model=SessionResponse)
async def create_session(
    request: CreateSessionRequest,
    user_id: UUID = Depends(get_user_id_from_auth)
):
    """Create a new coaching session."""
    try:
        supabase = get_supabase_client()
        
        session_data = {
            "user_id": str(user_id),
            "title": request.title,
            "status": "ACTIVE",
            "follow_up_enabled": request.follow_up_enabled,
        }
        
        if request.primary_topic:
            session_data["primary_topic"] = request.primary_topic
        if request.follow_up_time:
            session_data["follow_up_time"] = request.follow_up_time
        
        response = supabase.table("amora_sessions") \
            .insert(session_data) \
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create session")
        
        session = AmoraSession.from_dict(response.data[0])
        return SessionResponse(
            id=session.id,
            title=session.title,
            primary_topic=session.primary_topic,
            status=session.status,
            created_at=session.created_at or datetime.now(),
            updated_at=session.updated_at or datetime.now(),
            last_message_at=session.last_message_at,
            follow_up_enabled=session.follow_up_enabled,
            follow_up_time=session.follow_up_time,
            summary_text=session.summary_text,
            next_plan_text=session.next_plan_text
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating session: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(
    session_id: UUID,
    user_id: UUID = Depends(get_user_id_from_auth)
):
    """Get a specific coaching session by ID."""
    try:
        supabase = get_supabase_client()
        response = supabase.table("amora_sessions") \
            .select("*") \
            .eq("id", str(session_id)) \
            .eq("user_id", str(user_id)) \
            .single() \
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = AmoraSession.from_dict(response.data)
        return SessionResponse(
            id=session.id,
            title=session.title,
            primary_topic=session.primary_topic,
            status=session.status,
            created_at=session.created_at or datetime.now(),
            updated_at=session.updated_at or datetime.now(),
            last_message_at=session.last_message_at,
            follow_up_enabled=session.follow_up_enabled,
            follow_up_time=session.follow_up_time,
            summary_text=session.summary_text,
            next_plan_text=session.next_plan_text
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting session: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{session_id}", response_model=SessionResponse)
async def update_session(
    session_id: UUID,
    request: UpdateSessionRequest,
    user_id: UUID = Depends(get_user_id_from_auth)
):
    """Update a coaching session (title, status, follow-up settings)."""
    try:
        supabase = get_supabase_client()
        
        # First verify the session belongs to the user
        check_response = supabase.table("amora_sessions") \
            .select("id") \
            .eq("id", str(session_id)) \
            .eq("user_id", str(user_id)) \
            .single() \
            .execute()
        
        if not check_response.data:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Build update data
        update_data = {"updated_at": datetime.now().isoformat()}
        if request.title is not None:
            update_data["title"] = request.title
        if request.status is not None:
            update_data["status"] = request.status.value
        if request.follow_up_enabled is not None:
            update_data["follow_up_enabled"] = request.follow_up_enabled
        if request.follow_up_time is not None:
            update_data["follow_up_time"] = request.follow_up_time
        
        response = supabase.table("amora_sessions") \
            .update(update_data) \
            .eq("id", str(session_id)) \
            .eq("user_id", str(user_id)) \
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to update session")
        
        session = AmoraSession.from_dict(response.data[0])
        return SessionResponse(
            id=session.id,
            title=session.title,
            primary_topic=session.primary_topic,
            status=session.status,
            created_at=session.created_at or datetime.now(),
            updated_at=session.updated_at or datetime.now(),
            last_message_at=session.last_message_at,
            follow_up_enabled=session.follow_up_enabled,
            follow_up_time=session.follow_up_time,
            summary_text=session.summary_text,
            next_plan_text=session.next_plan_text
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating session: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/followups/due", response_model=List[FollowUpResponse])
async def get_due_followups(
    user_id: UUID = Depends(get_user_id_from_auth)
):
    """Get sessions that are due for a daily follow-up check-in."""
    try:
        from app.services.amora_session_service import AmoraSessionService
        
        service = AmoraSessionService()
        followups = service.get_due_followups(user_id)
        
        return followups
    except Exception as e:
        logger.error(f"Error getting due followups: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/feedback")
async def submit_feedback(
    request: FeedbackRequest,
    user_id: UUID = Depends(get_user_id_from_auth)
):
    """
    Submit feedback for an Amora response (like, dislike, or regenerate).
    
    Feedback types:
    - "like": User liked the response
    - "dislike": User disliked the response
    - "regenerate": User wants to regenerate the response
    """
    
    try:
        supabase = get_supabase_client()
        
        # Verify message belongs to user's session
        message_response = supabase.table("amora_session_messages") \
            .select("session_id, sender") \
            .eq("id", str(request.message_id)) \
            .single() \
            .execute()
        
        if not message_response.data:
            raise HTTPException(status_code=404, detail="Message not found")
        
        session_id = message_response.data["session_id"]
        
        # Verify session belongs to user
        session_response = supabase.table("amora_sessions") \
            .select("id") \
            .eq("id", session_id) \
            .eq("user_id", str(user_id)) \
            .single() \
            .execute()
        
        if not session_response.data:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Save feedback
        feedback_data = {
            "session_id": session_id,
            "message_id": str(request.message_id),
            "user_id": str(user_id),
            "feedback_type": request.feedback_type
        }
        
        response = supabase.table("amora_session_feedback") \
            .insert(feedback_data) \
            .execute()
        
        # If regenerate, we could trigger a new response generation here
        # For now, just save the feedback
        
        return {
            "success": True,
            "feedback_id": response.data[0]["id"] if response.data else None,
            "message": f"Feedback ({request.feedback_type}) recorded"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting feedback: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
