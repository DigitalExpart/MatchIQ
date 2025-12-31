from fastapi import APIRouter, HTTPException, Depends
from uuid import UUID
from typing import List
from datetime import datetime
import logging

from app.database import get_supabase_client
from app.models.pydantic_models import (
    CreateBlueprintRequest,
    UpdateBlueprintRequest,
    BlueprintResponse
)
from app.models.db_models import Blueprint
from app.services.scoring_engine import ScoringEngine

router = APIRouter()
logger = logging.getLogger(__name__)


def get_user_id_from_auth() -> UUID:
    """Placeholder for authentication."""
    return UUID("00000000-0000-0000-0000-000000000001")


@router.post("/", response_model=BlueprintResponse)
async def create_blueprint(
    request: CreateBlueprintRequest,
    user_id: UUID = Depends(get_user_id_from_auth)
):
    """Create a new blueprint (self-assessment)."""
    try:
        supabase = get_supabase_client()
        
        # Calculate profile summary
        profile_summary = _calculate_profile_summary(request.answers)
        
        # Calculate completion percentage
        total_questions = 50  # Adjust based on your question set
        completion_percentage = int((len(request.answers) / total_questions) * 100)
        
        blueprint_data = {
            "user_id": str(user_id),
            "answers": [answer.dict() for answer in request.answers],
            "profile_summary": profile_summary,
            "completion_percentage": completion_percentage,
            "is_active": True,
            "version": 1
        }
        
        result = supabase.table("blueprints").insert(blueprint_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create blueprint")
        
        blueprint = Blueprint.from_dict(result.data[0])
        
        return BlueprintResponse(
            id=blueprint.id,
            user_id=blueprint.user_id,
            answers=blueprint.answers,
            profile_summary=blueprint.profile_summary,
            completion_percentage=blueprint.completion_percentage,
            created_at=blueprint.created_at or datetime.now(),
            updated_at=blueprint.updated_at or datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating blueprint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=BlueprintResponse)
async def get_blueprint(
    user_id: UUID = Depends(get_user_id_from_auth)
):
    """Get user's active blueprint."""
    try:
        supabase = get_supabase_client()
        result = supabase.table("blueprints").select("*").eq(
            "user_id", str(user_id)
        ).eq("is_active", True).limit(1).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="No active blueprint found")
        
        blueprint = Blueprint.from_dict(result.data[0])
        
        return BlueprintResponse(
            id=blueprint.id,
            user_id=blueprint.user_id,
            answers=blueprint.answers,
            profile_summary=blueprint.profile_summary,
            completion_percentage=blueprint.completion_percentage,
            created_at=blueprint.created_at or datetime.now(),
            updated_at=blueprint.updated_at or datetime.now()
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting blueprint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{blueprint_id}", response_model=BlueprintResponse)
async def update_blueprint(
    blueprint_id: UUID,
    request: UpdateBlueprintRequest,
    user_id: UUID = Depends(get_user_id_from_auth)
):
    """Update an existing blueprint."""
    try:
        supabase = get_supabase_client()
        
        # Verify ownership
        existing = supabase.table("blueprints").select("*").eq(
            "id", str(blueprint_id)
        ).eq("user_id", str(user_id)).execute()
        
        if not existing.data:
            raise HTTPException(status_code=404, detail="Blueprint not found")
        
        # Calculate updated profile summary
        profile_summary = _calculate_profile_summary(request.answers)
        completion_percentage = int((len(request.answers) / 50) * 100)
        
        update_data = {
            "answers": [answer.dict() for answer in request.answers],
            "profile_summary": profile_summary,
            "completion_percentage": completion_percentage,
            "updated_at": datetime.now().isoformat()
        }
        
        result = supabase.table("blueprints").update(update_data).eq(
            "id", str(blueprint_id)
        ).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update blueprint")
        
        blueprint = Blueprint.from_dict(result.data[0])
        
        return BlueprintResponse(
            id=blueprint.id,
            user_id=blueprint.user_id,
            answers=blueprint.answers,
            profile_summary=blueprint.profile_summary,
            completion_percentage=blueprint.completion_percentage,
            created_at=blueprint.created_at or datetime.now(),
            updated_at=blueprint.updated_at or datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating blueprint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def _calculate_profile_summary(answers):
    """Calculate blueprint profile summary from answers."""
    category_weights = {}
    deal_breakers = []
    
    # Group by category
    category_answers = {}
    for answer in answers:
        cat = answer.category.value
        if cat not in category_answers:
            category_answers[cat] = []
        category_answers[cat].append(answer)
    
    # Calculate weights
    importance_map = {"low": 0.33, "medium": 0.67, "high": 1.0}
    
    for category, cat_answers in category_answers.items():
        total_weight = 0.0
        for answer in cat_answers:
            weight = importance_map.get(answer.importance.value, 0.5)
            if answer.is_deal_breaker:
                weight *= 2.0
                deal_breakers.append({
                    "category": category,
                    "question_id": answer.question_id,
                    "response": answer.response
                })
            total_weight += weight
        
        avg_weight = total_weight / len(cat_answers) if cat_answers else 0.5
        category_weights[category] = avg_weight
    
    # Normalize weights
    total = sum(category_weights.values())
    if total > 0:
        category_weights = {k: v / total for k, v in category_weights.items()}
    
    # Top priorities
    sorted_cats = sorted(category_weights.items(), key=lambda x: x[1], reverse=True)
    top_priorities = [cat for cat, _ in sorted_cats[:3]]
    
    return {
        "category_weights": category_weights,
        "deal_breakers": deal_breakers,
        "top_priorities": top_priorities
    }

