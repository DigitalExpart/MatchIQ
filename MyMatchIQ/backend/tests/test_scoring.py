"""
Tests for scoring engine
"""
import pytest
from app.services.scoring_engine import ScoringEngine
from app.services.scoring_logic import (
    ScanAnswer,
    BlueprintAnswer,
    BlueprintProfile,
    UserProfile,
    calculate_blueprint_profile
)


def create_test_scan_answers() -> list[ScanAnswer]:
    """Create test scan answers."""
    return [
        ScanAnswer(
            question_id="q1",
            category="values",
            rating="strong-match",
            question_text="Do your values align?"
        ),
        ScanAnswer(
            question_id="q2",
            category="values",
            rating="good",
            question_text="Are priorities similar?"
        ),
        ScanAnswer(
            question_id="q3",
            category="communication",
            rating="neutral",
            question_text="How is communication?"
        ),
    ]


def create_test_blueprint() -> BlueprintProfile:
    """Create test blueprint."""
    answers = [
        BlueprintAnswer(
            question_id="bq1",
            category="values",
            response="Family is important",
            importance="high",
            is_deal_breaker=True
        ),
        BlueprintAnswer(
            question_id="bq2",
            category="communication",
            response="Open communication",
            importance="medium",
            is_deal_breaker=False
        ),
    ]
    return calculate_blueprint_profile(answers)


def create_test_user_profile() -> UserProfile:
    """Create test user profile."""
    return UserProfile(
        name="Test User",
        age=30,
        dating_goal="serious",
        email="test@example.com"
    )


def test_scoring_engine():
    """Test scoring engine processes scan correctly."""
    engine = ScoringEngine()
    
    answers = create_test_scan_answers()
    blueprint = create_test_blueprint()
    user_profile = create_test_user_profile()
    
    result = engine.process_scan(answers, blueprint, user_profile)
    
    assert result['overall_score'] >= 0
    assert result['overall_score'] <= 100
    assert result['category'] in ['high-potential', 'worth-exploring', 'mixed-signals', 'caution', 'high-risk']
    assert len(result['category_scores']) > 0
    assert 'confidence_score' in result
    assert result['confidence_score'] >= 0.0
    assert result['confidence_score'] <= 1.0


def test_category_classification():
    """Test category classification."""
    from app.services.scoring_logic import classify_category
    
    assert classify_category(90) == 'high-potential'
    assert classify_category(70) == 'worth-exploring'
    assert classify_category(50) == 'mixed-signals'
    assert classify_category(30) == 'caution'
    assert classify_category(10) == 'high-risk'

