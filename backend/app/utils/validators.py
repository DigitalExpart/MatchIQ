"""Validation utilities."""
from typing import List, Dict, Any
from app.models.pydantic_models import Rating, ScanType


def validate_rating(rating: str) -> bool:
    """Validate rating value."""
    return rating in [r.value for r in Rating]


def validate_scan_type(scan_type: str) -> bool:
    """Validate scan type."""
    return scan_type in [s.value for s in ScanType]


def validate_answers(answers: List[Dict[str, Any]]) -> bool:
    """Validate scan answers structure."""
    if not answers:
        return False
    
    required_fields = ["question_id", "category", "rating"]
    for answer in answers:
        if not all(field in answer for field in required_fields):
            return False
        if not validate_rating(answer["rating"]):
            return False
    
    return True

