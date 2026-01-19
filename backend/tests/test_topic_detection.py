"""
Test suite for topic detection improvements.
Tests that breakup grief and breakup intimacy loss are correctly detected.
"""
import pytest
from app.services.amora_blocks_service import TopicEmotionDetector


class TestTopicDetection:
    """Test topic detection with normalization and priority routing."""
    
    def test_heartbreak_detection(self):
        """Test that 'Im heartbroken' detects breakup_grief/heartbreak."""
        topics = TopicEmotionDetector.detect_topics("Im heartbroken")
        assert 'heartbreak' in topics or 'breakup_grief' in topics
        assert topics != ['general']
    
    def test_missing_ex_detection(self):
        """Test that 'I miss my ex' detects breakup_grief."""
        topics = TopicEmotionDetector.detect_topics("I miss my ex")
        assert 'breakup' in topics or 'breakup_grief' in topics or 'heartbreak' in topics
        assert topics != ['general']
    
    def test_missing_sex_life_detection(self):
        """Test that 'I miss our sex life' detects breakup_intimacy_loss."""
        topics = TopicEmotionDetector.detect_topics("I miss our sex life")
        assert 'breakup_intimacy_loss' in topics
        assert topics != ['general']
    
    def test_missing_way_we_had_sex_detection(self):
        """Test that 'i miss the way i and my ex do have sex' detects breakup_intimacy_loss."""
        topics = TopicEmotionDetector.detect_topics("i miss the way i and my ex do have sex")
        assert 'breakup_intimacy_loss' in topics
        assert topics != ['general']
    
    def test_missing_sex_with_explicit_unlovable(self):
        """Test that 'I miss our sex and I feel unlovable' keeps both topics."""
        topics = TopicEmotionDetector.detect_topics("I miss our sex and I feel unlovable")
        assert 'breakup_intimacy_loss' in topics
        assert 'unlovable' in topics  # Should keep it because explicitly stated
    
    def test_missing_sex_without_unlovable(self):
        """Test that 'I miss our sex life' does NOT detect unlovable."""
        topics = TopicEmotionDetector.detect_topics("I miss our sex life")
        assert 'breakup_intimacy_loss' in topics
        assert 'unlovable' not in topics  # Should NOT have unlovable
    
    def test_text_normalization(self):
        """Test that text normalization handles contractions and typos."""
        normalized = TopicEmotionDetector.normalize_text("Im heartbroken and I dont know what to do")
        assert "i am" in normalized or "im" not in normalized.lower()
        assert "do not" in normalized or "dont" not in normalized.lower()
    
    def test_contractions_handling(self):
        """Test that 'Im' is normalized to 'i am' for better matching."""
        topics1 = TopicEmotionDetector.detect_topics("Im heartbroken")
        topics2 = TopicEmotionDetector.detect_topics("I am heartbroken")
        # Both should detect heartbreak
        assert (('heartbreak' in topics1 or 'breakup_grief' in topics1) and
                ('heartbreak' in topics2 or 'breakup_grief' in topics2))
    
    def test_priority_routing(self):
        """Test that breakup_intimacy_loss has priority over generic topics."""
        topics = TopicEmotionDetector.detect_topics("i miss the way me and my ex do have sex")
        assert 'breakup_intimacy_loss' in topics
        # Should NOT have unrelated topics
        assert 'lust_vs_love' not in topics
    
    def test_breakup_context_removes_unlovable(self):
        """Test that breakup context removes unlovable unless explicitly stated."""
        topics = TopicEmotionDetector.detect_topics("Im heartbroken and everything feels wrong")
        assert 'heartbreak' in topics or 'breakup_grief' in topics
        # Should NOT have unlovable unless explicitly stated
        assert 'unlovable' not in topics


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
