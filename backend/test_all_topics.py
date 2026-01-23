"""
Comprehensive test suite for all Amora topics.
Tests topic detection and identifies out-of-context responses.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.amora_blocks_service import TopicEmotionDetector
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Test cases for each topic
TEST_CASES = {
    'heartbreak': [
        "I'm heartbroken",
        "My heart is broken",
        "I feel so heartbroken after what happened",
    ],
    'breakup': [
        "We broke up",
        "We're breaking up",
        "The relationship ended",
        "We split up",
    ],
    'breakup_grief': [
        "I'm heartbroken and we broke up",
        "I'm still grieving the breakup",
        "I'm grieving the loss",
    ],
    'breakup_intimacy_loss': [
        "I miss our sex life with my ex",
        "I miss the way we had sex",
        "I miss the intimacy we had",
    ],
    'cheating': [
        "They cheated on me",
        "I caught them having an affair",
        "They were unfaithful",
    ],
    'cheating_self': [
        "I cheated on my partner",
        "I had an affair",
        "I was unfaithful",
    ],
    'divorce': [
        "We're getting divorced",
        "I'm filing for divorce",
        "We're separated legally",
    ],
    'marriage': [
        "I'm married",
        "My husband and I",
        "My wife and I",
    ],
    'marriage_strain': [
        "My marriage is hard",
        "We're having marriage problems",
        "I feel distant from my spouse",
    ],
    'talking_stage': [
        "We're in the talking stage",
        "We're just talking",
        "We're getting to know each other",
        "We're texting but not official",
    ],
    'situationship': [
        "We're in a situationship",
        "It's undefined",
        "What are we?",
        "No label, it's complicated",
    ],
    'lust_vs_love': [
        "Is this lust or love?",
        "I'm confused about attraction or love",
        "Is it just physical chemistry?",
    ],
    'pretense': [
        "I can't be myself",
        "I'm pretending to be someone else",
        "I'm hiding who I am",
    ],
    'jealousy': [
        "I'm so jealous",
        "I feel jealous all the time",
        "I'm insecure about our relationship",
    ],
    'trust': [
        "I don't trust them",
        "I have trust issues",
        "I can't trust my partner",
    ],
    'loneliness': [
        "I feel so lonely",
        "I'm alone all the time",
        "I feel isolated",
    ],
    'unlovable': [
        "I feel unlovable",
        "Nobody loves me",
        "I'm not worthy of love",
    ],
    'fights': [
        "We fight all the time",
        "We're always arguing",
        "We have constant conflict",
    ],
    'communication': [
        "We can't communicate",
        "They don't listen to me",
        "We have communication problems",
    ],
    'dating': [
        "I'm dating someone",
        "I need dating advice",
        "How do I date better?",
        "What should I do on a date?",
        "I'm new to dating",
    ],
    'user_anxiety_distress': [
        "I have so much anxiety about my relationship",
        "I'm constantly anxious",
        "I'm having panic attacks",
    ],
    'user_depression_distress': [
        "I feel so depressed since the breakup",
        "I don't want to get out of bed",
        "I feel empty and numb",
    ],
}

def test_topic_detection():
    """Test topic detection for all test cases."""
    print("\n" + "="*80)
    print("TESTING TOPIC DETECTION FOR ALL TOPICS")
    print("="*80 + "\n")
    
    results = {}
    issues = []
    
    for expected_topic, test_inputs in TEST_CASES.items():
        print(f"\n{'='*80}")
        print(f"Testing topic: {expected_topic}")
        print(f"{'='*80}")
        
        topic_results = []
        for test_input in test_inputs:
            detected_topics = TopicEmotionDetector.detect_topics(test_input)
            primary_topic = detected_topics[0] if detected_topics else 'none'
            is_correct = expected_topic in detected_topics or primary_topic == expected_topic
            
            result = {
                'input': test_input,
                'detected': detected_topics,
                'primary': primary_topic,
                'correct': is_correct
            }
            topic_results.append(result)
            
            status = "✅" if is_correct else "❌"
            print(f"{status} Input: '{test_input}'")
            print(f"   Detected: {detected_topics}")
            print(f"   Primary: {primary_topic}")
            if not is_correct:
                print(f"   ⚠️  EXPECTED: {expected_topic}")
                issues.append({
                    'topic': expected_topic,
                    'input': test_input,
                    'detected': detected_topics,
                    'expected': expected_topic
                })
        
        results[expected_topic] = topic_results
    
    # Summary
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)
    
    total_tests = sum(len(cases) for cases in TEST_CASES.values())
    total_issues = len(issues)
    success_rate = ((total_tests - total_issues) / total_tests * 100) if total_tests > 0 else 0
    
    print(f"\nTotal tests: {total_tests}")
    print(f"Successful: {total_tests - total_issues}")
    print(f"Issues found: {total_issues}")
    print(f"Success rate: {success_rate:.1f}%")
    
    if issues:
        print("\n" + "="*80)
        print("ISSUES FOUND:")
        print("="*80)
        for issue in issues:
            print(f"\n❌ Topic: {issue['topic']}")
            print(f"   Input: '{issue['input']}'")
            print(f"   Expected: {issue['expected']}")
            print(f"   Detected: {issue['detected']}")
    
    return results, issues

if __name__ == "__main__":
    results, issues = test_topic_detection()
    
    # Exit with error code if issues found
    if issues:
        print(f"\n⚠️  Found {len(issues)} topic detection issues that need fixing.")
        sys.exit(1)
    else:
        print("\n✅ All topic detection tests passed!")
        sys.exit(0)
