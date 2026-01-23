"""
Test topic detection only (no service initialization needed).
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.amora_blocks_service import TopicEmotionDetector

# Test cases for all topics
TEST_CASES = {
    'heartbreak': [
        "I'm heartbroken",
        "My heart is broken",
    ],
    'breakup': [
        "We broke up",
        "We're breaking up",
    ],
    'breakup_grief': [
        "I'm heartbroken and still grieving",
    ],
    'breakup_intimacy_loss': [
        "I miss our sex life with my ex",
    ],
    'cheating': [
        "They cheated on me",
    ],
    'cheating_self': [
        "I cheated on my partner",
    ],
    'divorce': [
        "We're getting divorced",
    ],
    'separation': [
        "We're separated",
    ],
    'marriage': [
        "I'm married",
    ],
    'marriage_strain': [
        "My marriage is hard",
    ],
    'talking_stage': [
        "We're in the talking stage",
    ],
    'situationship': [
        "We're in a situationship",
    ],
    'lust_vs_love': [
        "Is this lust or love?",
    ],
    'pretense': [
        "I can't be myself",
    ],
    'jealousy': [
        "I'm so jealous",
    ],
    'trust': [
        "I don't trust them",
    ],
    'loneliness': [
        "I feel so lonely",
    ],
    'unlovable': [
        "I feel unlovable",
    ],
    'fights': [
        "We fight all the time",
    ],
    'communication': [
        "We can't communicate",
    ],
    'past': [
        "My past relationship affects me",
    ],
    'patterns': [
        "I keep making the same mistakes",
    ],
    'moving_on': [
        "I can't move on",
    ],
    'confused': [
        "I'm confused about us",
    ],
    'doubt': [
        "I doubt this relationship",
    ],
    'user_anxiety_distress': [
        "I have so much anxiety about my relationship",
    ],
    'user_depression_distress': [
        "I feel so depressed since the breakup",
    ],
    # Dating topic - MISSING from TOPIC_KEYWORDS
    'dating': [
        "I'm dating someone new",
        "I need dating advice",
        "How do I date better?",
        "What should I do on a date?",
        "I'm new to dating",
        "I'm going on dates",
        "Dating is hard",
        "I'm trying to date",
    ],
}

def test_all_topics():
    """Test topic detection for all topics."""
    print("\n" + "="*80)
    print("TESTING TOPIC DETECTION FOR ALL TOPICS")
    print("="*80 + "\n")
    
    issues = []
    missing_topics = []
    
    for expected_topic, test_inputs in TEST_CASES.items():
        print(f"\nTesting: {expected_topic}")
        
        for test_input in test_inputs:
            detected_topics = TopicEmotionDetector.detect_topics(test_input)
            is_correct = expected_topic in detected_topics
            
            status = "✅" if is_correct else "❌"
            print(f"  {status} '{test_input}' -> {detected_topics}")
            
            if not is_correct:
                issues.append({
                    'topic': expected_topic,
                    'input': test_input,
                    'detected': detected_topics,
                    'expected': expected_topic
                })
                if expected_topic not in missing_topics:
                    missing_topics.append(expected_topic)
    
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)
    print(f"\nTotal issues: {len(issues)}")
    print(f"Topics with issues: {missing_topics}")
    
    if issues:
        print("\nISSUES:")
        for issue in issues:
            print(f"  ❌ {issue['topic']}: '{issue['input']}'")
            print(f"     Expected: {issue['expected']}, Got: {issue['detected']}")
    
    return issues, missing_topics

if __name__ == "__main__":
    issues, missing_topics = test_all_topics()
    
    if issues:
        print(f"\n⚠️  Found {len(issues)} issues. Missing topics: {missing_topics}")
        sys.exit(1)
    else:
        print("\n✅ All topic detection tests passed!")
        sys.exit(0)
