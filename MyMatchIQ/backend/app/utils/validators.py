"""
Validation utilities
"""
from typing import List, Dict, Any


def validate_scan_answers(answers: List[Dict[str, Any]]) -> bool:
    """
    Validate scan answers structure.
    """
    required_fields = ['question_id', 'category', 'rating', 'question_text']
    
    for answer in answers:
        if not all(field in answer for field in required_fields):
            return False
        
        # Validate rating
        valid_ratings = ['strong-match', 'good', 'neutral', 'yellow-flag', 'red-flag']
        if answer['rating'] not in valid_ratings:
            return False
    
    return True


def validate_blueprint_answers(answers: List[Dict[str, Any]]) -> bool:
    """
    Validate blueprint answers structure.
    """
    required_fields = ['question_id', 'category', 'response', 'importance']
    
    for answer in answers:
        if not all(field in answer for field in required_fields):
            return False
        
        # Validate importance
        valid_importance = ['low', 'medium', 'high']
        if answer['importance'] not in valid_importance:
            return False
    
    return True

