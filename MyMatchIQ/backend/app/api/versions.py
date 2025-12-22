"""
Version Information API endpoints
"""
from fastapi import APIRouter
from app.services.version_registry import get_version_registry
from app.services.scoring_config import get_scoring_config
from app.config import settings

router = APIRouter()


@router.get("/")
async def get_versions():
    """
    Get all version information.
    """
    registry = get_version_registry()
    config = get_scoring_config()
    
    active_version = registry.get_active_version()
    
    return {
        "api_version": "1.0.0",
        "logic_version": config.logic_version,
        "ai_version": settings.AI_VERSION,
        "active_version": {
            "version": active_version.version if active_version else config.logic_version,
            "description": active_version.description if active_version else "Current active version",
            "created_at": active_version.created_at if active_version else "",
        },
        "all_versions": [
            {
                "version": v.version,
                "description": v.description,
                "created_at": v.created_at,
                "is_active": v.is_active,
                "is_deprecated": v.is_deprecated,
            }
            for v in registry.get_all_versions()
        ]
    }

