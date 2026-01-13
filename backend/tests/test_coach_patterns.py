"""
Tests for Amora coach pattern matching.
Run with: pytest backend/tests/test_coach_patterns.py -v
"""
import pytest
from app.services.coach_service import CoachService
from app.models.pydantic_models import CoachMode, CoachRequest
from uuid import UUID


@pytest.fixture
def coach_service():
    return CoachService()


@pytest.fixture
def test_user_id():
    return UUID("00000000-0000-0000-0000-000000000001")


def test_readiness_question_basic(coach_service, test_user_id):
    """Test: 'Am I ready for a committed relationship?'"""
    request = CoachRequest(
        mode=CoachMode.LEARN,
        specific_question="Am I ready for a committed relationship?"
    )
    response = coach_service.get_response(request, test_user_id)
    
    assert response.mode == CoachMode.LEARN
    assert "readiness" in response.message.lower() or "ready" in response.message.lower()
    assert "committed relationship" in response.message.lower() or "commit" in response.message.lower()
    assert len(response.message) > 50  # Should be substantial response


def test_readiness_question_variation(coach_service, test_user_id):
    """Test: 'ready to commit'"""
    request = CoachRequest(
        mode=CoachMode.LEARN,
        specific_question="ready to commit"
    )
    response = coach_service.get_response(request, test_user_id)
    
    assert response.mode == CoachMode.LEARN
    assert "readiness" in response.message.lower() or "ready" in response.message.lower()


def test_love_confusion_question_basic(coach_service, test_user_id):
    """Test: 'Im confused I dont know if im in love'"""
    request = CoachRequest(
        mode=CoachMode.LEARN,
        specific_question="Im confused I dont know if im in love"
    )
    response = coach_service.get_response(request, test_user_id)
    
    assert response.mode == CoachMode.LEARN
    assert "confused" in response.message.lower() or "confusion" in response.message.lower()
    assert "love" in response.message.lower() or "feelings" in response.message.lower()
    assert len(response.message) > 100  # Should be substantial response


def test_love_confusion_question_with_apostrophes(coach_service, test_user_id):
    """Test: 'I'm confused—don't know if I'm in love.'"""
    request = CoachRequest(
        mode=CoachMode.LEARN,
        specific_question="I'm confused—don't know if I'm in love."
    )
    response = coach_service.get_response(request, test_user_id)
    
    assert response.mode == CoachMode.LEARN
    assert "confused" in response.message.lower() or "confusion" in response.message.lower()
    assert "love" in response.message.lower() or "feelings" in response.message.lower()


def test_love_question_without_confusion(coach_service, test_user_id):
    """Test: 'Am I in love?'"""
    request = CoachRequest(
        mode=CoachMode.LEARN,
        specific_question="Am I in love?"
    )
    response = coach_service.get_response(request, test_user_id)
    
    assert response.mode == CoachMode.LEARN
    assert "love" in response.message.lower() or "feelings" in response.message.lower()
    assert len(response.message) > 50


def test_confusion_question_alone(coach_service, test_user_id):
    """Test: 'I'm confused'"""
    request = CoachRequest(
        mode=CoachMode.LEARN,
        specific_question="I'm confused"
    )
    response = coach_service.get_response(request, test_user_id)
    
    assert response.mode == CoachMode.LEARN
    assert "confused" in response.message.lower() or "confusion" in response.message.lower()
    assert len(response.message) > 50


def test_normalization_im_vs_i_m(coach_service):
    """Test that 'im' and 'i'm' both match"""
    # Test normalization function directly
    norm1 = coach_service._normalize_question("I'm confused")
    norm2 = coach_service._normalize_question("Im confused")
    
    assert "im" in norm1
    assert "im" in norm2
    assert norm1 == norm2


def test_normalization_dont_vs_don_t(coach_service):
    """Test that 'dont' and 'don't' both match"""
    norm1 = coach_service._normalize_question("I don't know")
    norm2 = coach_service._normalize_question("I dont know")
    
    assert "dont" in norm1
    assert "dont" in norm2
    assert "dont" in norm1 and "dont" in norm2


def test_normalization_punctuation(coach_service):
    """Test that punctuation is removed"""
    norm = coach_service._normalize_question("Am I ready? Yes, I think so!")
    
    assert "?" not in norm
    assert "!" not in norm
    assert "," not in norm


# Test table from requirements
TEST_CASES = [
    ("Am I ready for a committed relationship?", "readiness"),
    ("Im confused I dont know if im in love", "love_confusion"),
    ("I'm confused—don't know if I'm in love.", "love_confusion"),
    ("ready to commit", "readiness"),
    ("Am I in love?", "love"),
    ("I'm confused", "confusion"),
    ("How do I build trust?", "trust"),
    ("What are healthy boundaries?", "boundaries"),
]


@pytest.mark.parametrize("question,expected_pattern", TEST_CASES)
def test_pattern_matching_table(coach_service, test_user_id, question, expected_pattern):
    """Test table of inputs → expected patterns"""
    request = CoachRequest(
        mode=CoachMode.LEARN,
        specific_question=question
    )
    response = coach_service.get_response(request, test_user_id)
    
    assert response.mode == CoachMode.LEARN
    assert len(response.message) > 30  # Should have substantial response
    assert response.confidence > 0  # Should have some confidence
    
    # Check that response is NOT the generic fallback
    generic_fallback = "i'm here to help you explore relationship topics"
    assert generic_fallback not in response.message.lower()[:100]
