"""
Comprehensive test suite for all Amora topics.
Tests topic detection AND actual responses to identify out-of-context issues.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.amora_blocks_service import TopicEmotionDetector, AmoraBlocksService
from app.models.pydantic_models import CoachRequest, CoachMode
from uuid import uuid4
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Comprehensive test cases for ALL topics
TEST_CASES = {
    'heartbreak': [
        "I'm heartbroken",
        "My heart is broken after the breakup",
        "I feel so heartbroken",
    ],
    'breakup': [
        "We broke up last week",
        "We're breaking up",
        "The relationship ended",
    ],
    'breakup_grief': [
        "I'm heartbroken and still grieving",
        "I'm grieving the breakup",
        "I'm still grieving the loss",
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
    'separation': [
        "We're separated",
        "We're living apart",
        "We're in a trial separation",
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
    'past': [
        "My past relationship affects me",
        "My ex keeps coming up",
        "Previous relationships keep happening",
    ],
    'patterns': [
        "I keep making the same mistakes",
        "I always choose the same type",
        "I keep repeating patterns",
    ],
    'moving_on': [
        "I can't move on",
        "I need to get over them",
        "I want to let go",
    ],
    'confused': [
        "I'm confused about us",
        "I don't know what to do",
        "I'm unsure about this relationship",
    ],
    'doubt': [
        "I doubt this relationship",
        "I'm second guessing everything",
        "I'm questioning if this is right",
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
    # Dating topic - user mentioned this is responding out of context
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
    
    return results, issues

def test_amora_responses():
    """Test actual Amora responses to check for out-of-context issues."""
    print("\n" + "="*80)
    print("TESTING AMORA RESPONSES FOR OUT-OF-CONTEXT ISSUES")
    print("="*80 + "\n")
    
    service = AmoraBlocksService()
    issues = []
    
    # Test a subset of critical cases
    critical_tests = {
        'dating': [
            "I'm dating someone new and I'm excited",
            "I need dating advice",
            "How do I date better?",
        ],
        'talking_stage': [
            "We're in the talking stage",
            "We're just talking and getting to know each other",
        ],
        'situationship': [
            "We're in a situationship",
            "It's undefined and complicated",
        ],
        'heartbreak': [
            "I'm heartbroken",
            "My heart is broken",
        ],
        'breakup_intimacy_loss': [
            "I miss our sex life with my ex",
        ],
    }
    
    for topic, test_inputs in critical_tests.items():
        print(f"\n{'='*80}")
        print(f"Testing Amora responses for: {topic}")
        print(f"{'='*80}")
        
        for test_input in test_inputs:
            try:
                # Create a test request
                request = CoachRequest(
                    mode=CoachMode.LEARN,
                    specific_question=test_input,
                    coach_session_id=str(uuid4()),
                    context={
                        'topics': [],
                        'relationship_status': 'single'
                    }
                )
                
                # Get response
                response = service.get_response(request, user_id=uuid4())
                
                # Check if response is contextually appropriate
                detected_topics = response.referenced_data.get('topics', [])
                response_text = response.message.lower()
                
                # Check for out-of-context indicators
                out_of_context_indicators = []
                
                # Check if response mentions topics not in detected topics
                if topic == 'dating' and 'dating' not in detected_topics:
                    out_of_context_indicators.append("Dating topic not detected")
                
                # Check if response mentions breakup/ex when not relevant
                if topic not in ['breakup', 'heartbreak', 'breakup_grief', 'breakup_intimacy_loss']:
                    if any(word in response_text for word in ['ex', 'breakup', 'broke up', 'ended']):
                        out_of_context_indicators.append("Mentions breakup/ex inappropriately")
                
                # Check if response mentions marriage when not relevant
                if topic not in ['marriage', 'marriage_strain', 'divorce']:
                    if any(word in response_text for word in ['marriage', 'married', 'husband', 'wife', 'spouse']):
                        out_of_context_indicators.append("Mentions marriage inappropriately")
                
                # Check if response mentions cheating when not relevant
                if topic not in ['cheating', 'cheating_self']:
                    if any(word in response_text for word in ['cheat', 'affair', 'unfaithful', 'infidelity']):
                        out_of_context_indicators.append("Mentions cheating inappropriately")
                
                status = "✅" if not out_of_context_indicators else "❌"
                print(f"{status} Input: '{test_input}'")
                print(f"   Detected topics: {detected_topics}")
                print(f"   Response preview: {response_text[:150]}...")
                
                if out_of_context_indicators:
                    print(f"   ⚠️  OUT-OF-CONTEXT: {', '.join(out_of_context_indicators)}")
                    issues.append({
                        'topic': topic,
                        'input': test_input,
                        'detected_topics': detected_topics,
                        'response_preview': response_text[:200],
                        'issues': out_of_context_indicators
                    })
                
            except Exception as e:
                print(f"❌ Error testing '{test_input}': {e}")
                logger.exception(f"Error in test: {e}")
                issues.append({
                    'topic': topic,
                    'input': test_input,
                    'error': str(e)
                })
    
    return issues

if __name__ == "__main__":
    print("\n" + "="*80)
    print("COMPREHENSIVE AMORA TOPIC TESTING")
    print("="*80)
    
    # Test 1: Topic Detection
    detection_results, detection_issues = test_topic_detection()
    
    # Test 2: Amora Responses
    response_issues = test_amora_responses()
    
    # Summary
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)
    
    total_detection_tests = sum(len(cases) for cases in TEST_CASES.values())
    total_detection_issues = len(detection_issues)
    total_response_issues = len(response_issues)
    
    print(f"\nTopic Detection:")
    print(f"  Total tests: {total_detection_tests}")
    print(f"  Issues: {total_detection_issues}")
    print(f"  Success rate: {((total_detection_tests - total_detection_issues) / total_detection_tests * 100):.1f}%")
    
    print(f"\nResponse Quality:")
    print(f"  Issues found: {total_response_issues}")
    
    if detection_issues:
        print("\n" + "="*80)
        print("TOPIC DETECTION ISSUES:")
        print("="*80)
        for issue in detection_issues:
            print(f"\n❌ Topic: {issue['topic']}")
            print(f"   Input: '{issue['input']}'")
            print(f"   Expected: {issue['expected']}")
            print(f"   Detected: {issue['detected']}")
    
    if response_issues:
        print("\n" + "="*80)
        print("OUT-OF-CONTEXT RESPONSE ISSUES:")
        print("="*80)
        for issue in response_issues:
            print(f"\n❌ Topic: {issue['topic']}")
            print(f"   Input: '{issue['input']}'")
            print(f"   Detected topics: {issue.get('detected_topics', [])}")
            if 'issues' in issue:
                print(f"   Problems: {', '.join(issue['issues'])}")
            if 'error' in issue:
                print(f"   Error: {issue['error']}")
            print(f"   Response: {issue.get('response_preview', 'N/A')[:150]}...")
    
    # Exit with error code if issues found
    if detection_issues or response_issues:
        print(f"\n⚠️  Found {total_detection_issues + total_response_issues} issues that need fixing.")
        sys.exit(1)
    else:
        print("\n✅ All tests passed!")
        sys.exit(0)
