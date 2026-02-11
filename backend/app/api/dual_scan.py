"""
Dual Scan API endpoints.
Handles dual scan session management: create, join, submit answers, calculate results.
Privacy-preserving: raw answers are never exposed between users.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
import logging
import math

from app.database import get_supabase_client
from app.models.pydantic_models import (
    CreateDualScanRequest,
    JoinDualScanRequest,
    SubmitDualScanAnswersRequest,
    DualScanSessionResponse,
    DualScanResultResponse,
    DualScanMutualDealBreaker,
)
from app.models.db_models import DualScanSession

router = APIRouter(prefix="/dual-scan", tags=["dual-scan"])
logger = logging.getLogger(__name__)

# Rating to numeric score mapping
RATING_SCORES = {
    "strong-match": 100,
    "good": 75,
    "neutral": 50,
    "yellow-flag": 25,
    "red-flag": 0,
}


def _session_to_response(session: DualScanSession) -> DualScanSessionResponse:
    """Convert DualScanSession to response model."""
    return DualScanSessionResponse(
        id=session.id,
        user_a_name=session.user_a_name,
        user_b_name=session.user_b_name,
        status=session.status,
        user_a_completed=session.user_a_completed,
        user_b_completed=session.user_b_completed,
        user_a_score=session.user_a_score,
        user_b_score=session.user_b_score,
        mutual_score=session.mutual_score,
        interaction_type=session.interaction_type,
        selected_categories=session.selected_categories,
        revealed=session.revealed,
        invite_link=session.invite_link,
        created_at=session.created_at,
        updated_at=session.updated_at,
    )


# =====================
# Session CRUD
# =====================

@router.post("/sessions", response_model=DualScanSessionResponse)
async def create_dual_scan_session(request: CreateDualScanRequest):
    """Create a new dual scan session and return invite info."""
    try:
        supabase = get_supabase_client()

        # Generate session ID matching frontend format
        import time
        import random
        import string
        session_id = f"ds_{int(time.time() * 1000)}_{(''.join(random.choices(string.ascii_lowercase + string.digits, k=9)))}"

        session_data = {
            "id": session_id,
            "user_a_name": "",  # Will be set by frontend or auth
            "user_b_name": request.partner_name,
            "status": "pending",
            "user_a_completed": False,
            "user_b_completed": False,
            "user_a_answers": [],
            "user_b_answers": [],
            "interaction_type": request.interaction_type,
            "selected_categories": request.selected_categories,
            "revealed": False,
        }

        response = supabase.table("dual_scan_sessions").insert(session_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create dual scan session")

        session = DualScanSession.from_dict(response.data[0])
        return _session_to_response(session)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating dual scan session: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sessions", response_model=List[DualScanSessionResponse])
async def list_dual_scan_sessions():
    """List all dual scan sessions."""
    try:
        supabase = get_supabase_client()
        response = supabase.table("dual_scan_sessions") \
            .select("*") \
            .order("created_at", desc=True) \
            .execute()

        sessions = []
        for row in (response.data or []):
            session = DualScanSession.from_dict(row)
            sessions.append(_session_to_response(session))

        return sessions

    except Exception as e:
        logger.error(f"Error listing dual scan sessions: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sessions/{session_id}", response_model=DualScanSessionResponse)
async def get_dual_scan_session(session_id: str):
    """Get a specific dual scan session by ID (used for invite link join)."""
    try:
        supabase = get_supabase_client()
        response = supabase.table("dual_scan_sessions") \
            .select("*") \
            .eq("id", session_id) \
            .single() \
            .execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Dual scan session not found")

        session = DualScanSession.from_dict(response.data)
        return _session_to_response(session)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting dual scan session: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sessions/{session_id}/join", response_model=DualScanSessionResponse)
async def join_dual_scan_session(session_id: str, request: JoinDualScanRequest):
    """Partner joins a dual scan session via invite link."""
    try:
        supabase = get_supabase_client()

        # Fetch session
        get_response = supabase.table("dual_scan_sessions") \
            .select("*") \
            .eq("id", session_id) \
            .single() \
            .execute()

        if not get_response.data:
            raise HTTPException(status_code=404, detail="Dual scan session not found")

        session = DualScanSession.from_dict(get_response.data)

        # Update with partner info if not already set
        update_data = {
            "updated_at": datetime.now().isoformat(),
        }

        # If user_a_name isn't set, this might be the creator updating their name
        if not session.user_a_name and request.user_name:
            update_data["user_a_name"] = request.user_name

        response = supabase.table("dual_scan_sessions") \
            .update(update_data) \
            .eq("id", session_id) \
            .execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to join session")

        updated_session = DualScanSession.from_dict(response.data[0])
        return _session_to_response(updated_session)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error joining dual scan session: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# =====================
# Answer Submission
# =====================

@router.post("/sessions/{session_id}/submit", response_model=DualScanSessionResponse)
async def submit_dual_scan_answers(session_id: str, request: SubmitDualScanAnswersRequest):
    """Submit answers for one side of the dual scan (role A or B)."""
    try:
        supabase = get_supabase_client()

        # Fetch current session
        get_response = supabase.table("dual_scan_sessions") \
            .select("*") \
            .eq("id", session_id) \
            .single() \
            .execute()

        if not get_response.data:
            raise HTTPException(status_code=404, detail="Dual scan session not found")

        session = DualScanSession.from_dict(get_response.data)
        role = request.role.upper()

        if role not in ("A", "B"):
            raise HTTPException(status_code=400, detail="Role must be 'A' or 'B'")

        # Convert answers to dicts
        answers_data = [
            {
                "question": a.question,
                "category": a.category,
                "rating": a.rating.value if hasattr(a.rating, 'value') else str(a.rating),
                "notes": a.notes,
            }
            for a in request.answers
        ]

        # Calculate score from answers
        score = request.score
        if score is None:
            total = 0
            count = 0
            for a in answers_data:
                rating_val = RATING_SCORES.get(a["rating"], 50)
                total += rating_val
                count += 1
            score = int(total / count) if count > 0 else 0

        # Build update
        update_data = {
            "updated_at": datetime.now().isoformat(),
        }

        if role == "A":
            if session.user_a_completed:
                raise HTTPException(status_code=400, detail="User A has already submitted answers")
            update_data["user_a_answers"] = answers_data
            update_data["user_a_completed"] = True
            update_data["user_a_score"] = score
        else:
            if session.user_b_completed:
                raise HTTPException(status_code=400, detail="User B has already submitted answers")
            update_data["user_b_answers"] = answers_data
            update_data["user_b_completed"] = True
            update_data["user_b_score"] = score

        # Determine new status
        a_done = update_data.get("user_a_completed", session.user_a_completed)
        b_done = update_data.get("user_b_completed", session.user_b_completed)

        if a_done and b_done:
            update_data["status"] = "both_completed"
            # Calculate mutual score (geometric mean)
            score_a = update_data.get("user_a_score", session.user_a_score) or 0
            score_b = update_data.get("user_b_score", session.user_b_score) or 0
            if score_a > 0 and score_b > 0:
                update_data["mutual_score"] = int(math.sqrt(score_a * score_b))
            else:
                update_data["mutual_score"] = 0
        elif a_done:
            update_data["status"] = "user_a_completed"
        elif b_done:
            update_data["status"] = "user_b_completed"

        response = supabase.table("dual_scan_sessions") \
            .update(update_data) \
            .eq("id", session_id) \
            .execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to submit answers")

        updated_session = DualScanSession.from_dict(response.data[0])
        return _session_to_response(updated_session)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting dual scan answers: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# =====================
# Results & Reveal
# =====================

@router.get("/sessions/{session_id}/results", response_model=DualScanResultResponse)
async def get_dual_scan_results(session_id: str):
    """Get mutual alignment results for a completed dual scan."""
    try:
        supabase = get_supabase_client()
        response = supabase.table("dual_scan_sessions") \
            .select("*") \
            .eq("id", session_id) \
            .single() \
            .execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Dual scan session not found")

        session = DualScanSession.from_dict(response.data)

        if not session.user_a_completed or not session.user_b_completed:
            raise HTTPException(
                status_code=400,
                detail="Both users must complete their scans before viewing results"
            )

        # Calculate category alignment
        category_alignment = _calculate_category_alignment(
            session.user_a_answers, session.user_b_answers
        )

        # Detect mutual deal-breakers
        mutual_deal_breakers = _detect_mutual_deal_breakers(
            session.user_a_answers, session.user_b_answers
        )

        # Find complementary areas
        complementary_areas = _find_complementary_areas(
            session.user_a_answers, session.user_b_answers
        )

        # Detect asymmetry
        score_a = session.user_a_score or 0
        score_b = session.user_b_score or 0
        difference = abs(score_a - score_b)
        asymmetry_detected = difference >= 20

        return DualScanResultResponse(
            session_id=session.id,
            mutual_score=session.mutual_score or 0,
            user_a_score=session.user_a_score,
            user_b_score=session.user_b_score,
            category_alignment=category_alignment,
            mutual_deal_breakers=mutual_deal_breakers,
            complementary_areas=complementary_areas,
            asymmetry_detected=asymmetry_detected,
            asymmetry_difference=float(difference) if asymmetry_detected else None,
            user_a_name=session.user_a_name,
            user_b_name=session.user_b_name,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting dual scan results: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sessions/{session_id}/reveal", response_model=DualScanSessionResponse)
async def reveal_dual_scan_results(session_id: str):
    """Mark results as revealed (consent gate)."""
    try:
        supabase = get_supabase_client()

        # Verify session exists and is completed
        get_response = supabase.table("dual_scan_sessions") \
            .select("*") \
            .eq("id", session_id) \
            .single() \
            .execute()

        if not get_response.data:
            raise HTTPException(status_code=404, detail="Dual scan session not found")

        session = DualScanSession.from_dict(get_response.data)

        if not session.user_a_completed or not session.user_b_completed:
            raise HTTPException(
                status_code=400,
                detail="Both users must complete their scans before revealing results"
            )

        response = supabase.table("dual_scan_sessions") \
            .update({
                "revealed": True,
                "status": "revealed",
                "updated_at": datetime.now().isoformat(),
            }) \
            .eq("id", session_id) \
            .execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to reveal results")

        updated_session = DualScanSession.from_dict(response.data[0])
        return _session_to_response(updated_session)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error revealing dual scan results: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/sessions/{session_id}")
async def delete_dual_scan_session(session_id: str):
    """Delete a dual scan session."""
    try:
        supabase = get_supabase_client()

        # Verify it exists
        get_response = supabase.table("dual_scan_sessions") \
            .select("id") \
            .eq("id", session_id) \
            .single() \
            .execute()

        if not get_response.data:
            raise HTTPException(status_code=404, detail="Dual scan session not found")

        supabase.table("dual_scan_sessions") \
            .delete() \
            .eq("id", session_id) \
            .execute()

        return {"success": True, "message": "Dual scan session deleted"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting dual scan session: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# =====================
# Calculation Helpers
# =====================

def _calculate_category_alignment(
    answers_a: List[dict],
    answers_b: List[dict],
) -> dict:
    """Calculate alignment score for each category using geometric mean."""
    # Group answers by category
    cat_scores_a = {}
    cat_counts_a = {}
    for a in answers_a:
        cat = a.get("category", "unknown")
        score = RATING_SCORES.get(a.get("rating", "neutral"), 50)
        cat_scores_a[cat] = cat_scores_a.get(cat, 0) + score
        cat_counts_a[cat] = cat_counts_a.get(cat, 0) + 1

    cat_scores_b = {}
    cat_counts_b = {}
    for a in answers_b:
        cat = a.get("category", "unknown")
        score = RATING_SCORES.get(a.get("rating", "neutral"), 50)
        cat_scores_b[cat] = cat_scores_b.get(cat, 0) + score
        cat_counts_b[cat] = cat_counts_b.get(cat, 0) + 1

    # Calculate alignment per category
    alignment = {}
    all_cats = set(list(cat_scores_a.keys()) + list(cat_scores_b.keys()))

    for cat in all_cats:
        avg_a = (cat_scores_a.get(cat, 0) / cat_counts_a.get(cat, 1)) if cat in cat_scores_a else 0
        avg_b = (cat_scores_b.get(cat, 0) / cat_counts_b.get(cat, 1)) if cat in cat_scores_b else 0

        if avg_a > 0 and avg_b > 0:
            alignment[cat] = round(math.sqrt(avg_a * avg_b), 1)
        else:
            alignment[cat] = 0.0

    return alignment


def _detect_mutual_deal_breakers(
    answers_a: List[dict],
    answers_b: List[dict],
) -> List[DualScanMutualDealBreaker]:
    """Detect categories where both users flagged red flags."""
    # Find categories with red flags from each user
    red_cats_a = set()
    for a in answers_a:
        if a.get("rating") == "red-flag":
            red_cats_a.add(a.get("category", "unknown"))

    red_cats_b = set()
    for a in answers_b:
        if a.get("rating") == "red-flag":
            red_cats_b.add(a.get("category", "unknown"))

    # Find overlapping red flag categories
    mutual = red_cats_a & red_cats_b
    return [
        DualScanMutualDealBreaker(
            category=cat,
            severity="high",
            description=f"Both users flagged concerns in {cat}",
        )
        for cat in mutual
    ]


def _find_complementary_areas(
    answers_a: List[dict],
    answers_b: List[dict],
) -> List[str]:
    """Find categories where one user is strong and the other needs support."""
    # Calculate average scores per category
    def _avg_by_cat(answers):
        totals = {}
        counts = {}
        for a in answers:
            cat = a.get("category", "unknown")
            score = RATING_SCORES.get(a.get("rating", "neutral"), 50)
            totals[cat] = totals.get(cat, 0) + score
            counts[cat] = counts.get(cat, 0) + 1
        return {cat: totals[cat] / counts[cat] for cat in totals}

    avgs_a = _avg_by_cat(answers_a)
    avgs_b = _avg_by_cat(answers_b)

    complementary = []
    all_cats = set(list(avgs_a.keys()) + list(avgs_b.keys()))

    for cat in all_cats:
        score_a = avgs_a.get(cat, 0)
        score_b = avgs_b.get(cat, 0)
        # One strong (>=70) and other moderate (<70)
        if (score_a >= 70 and score_b < 70) or (score_b >= 70 and score_a < 70):
            complementary.append(cat)

    return complementary
