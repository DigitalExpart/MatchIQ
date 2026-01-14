"""
Test script to verify Amora responses are working correctly.
This tests both the pattern matching fallback and the template system.

Usage:
    python backend/scripts/test_amora_responses.py
"""
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from uuid import UUID
from app.models.pydantic_models import CoachRequest, CoachMode
from app.services.coach_service import CoachService

# Test questions from the console logs
TEST_QUESTIONS = [
    "How does my past affect my present relationships?",
    "im thinking about my past relationships",
    "My love life is a mess",
    "My relationship status is very complicated",
    "I'm confused about my feelings",
    "Do I love them?",
    "Am I in love?",
    "I keep dating the same type of person",
    "Is my relationship toxic?",
    "I feel jealous",
]

def test_coach_service():
    """Test the basic CoachService pattern matching."""
    print("=" * 70)
    print(" TESTING COACH SERVICE (Pattern Matching Fallback)")
    print("=" * 70)
    print()
    
    coach_service = CoachService()
    user_id = UUID("00000000-0000-0000-0000-000000000001")
    
    success_count = 0
    generic_count = 0
    
    for i, question in enumerate(TEST_QUESTIONS, 1):
        print(f"[{i}/{len(TEST_QUESTIONS)}] Testing: \"{question}\"")
        print("-" * 70)
        
        request = CoachRequest(
            mode=CoachMode.LEARN,
            specific_question=question
        )
        
        try:
            response = coach_service.get_response(request, user_id)
            
            # Check if it's a generic fallback response
            generic_responses = [
                "I'm here to help. Can you share a bit more about what you're thinking?",
                "I want to make sure I understand you properly. Can you tell me a little more about what's going on?",
                "I'm listening. What feels most important for you to talk about right now?"
            ]
            
            is_generic = any(generic in response.message for generic in generic_responses)
            
            if is_generic:
                print("⚠️  GENERIC FALLBACK RESPONSE")
                generic_count += 1
            else:
                print("✅ SUBSTANTIVE RESPONSE")
                success_count += 1
            
            # Show preview of response
            preview = response.message[:150] + "..." if len(response.message) > 150 else response.message
            print(f"Response: {preview}")
            print(f"Confidence: {response.confidence}")
            
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        print()
    
    # Summary
    print("=" * 70)
    print(" SUMMARY")
    print("=" * 70)
    print(f"Total questions tested: {len(TEST_QUESTIONS)}")
    print(f"✅ Substantive responses: {success_count}")
    print(f"⚠️  Generic fallback: {generic_count}")
    print(f"Success rate: {(success_count/len(TEST_QUESTIONS)*100):.1f}%")
    print()
    
    if generic_count > 0:
        print("⚠️  Some questions are still falling back to generic responses.")
        print("   This is expected if:")
        print("   - Templates don't exist in database yet")
        print("   - Templates don't have embeddings")
        print("   - Pattern matching doesn't cover these questions")
        print()
        print("   The improved pattern matching should handle these now.")
    else:
        print("✅ All questions received substantive responses!")
    
    return success_count == len(TEST_QUESTIONS)

def test_enhanced_service():
    """Test the AmoraEnhancedService (requires database)."""
    print()
    print("=" * 70)
    print(" TESTING AMORA ENHANCED SERVICE (Template + Embeddings)")
    print("=" * 70)
    print()
    
    try:
        from app.services.amora_enhanced_service import AmoraEnhancedService
        from dotenv import load_dotenv
        
        load_dotenv()
        
        if not os.getenv("SUPABASE_URL") or not os.getenv("SUPABASE_SERVICE_KEY"):
            print("⚠️  SKIPPED: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY")
            print("   Set these in .env to test the enhanced service")
            return False
        
        service = AmoraEnhancedService()
        user_id = UUID("00000000-0000-0000-0000-000000000001")
        
        success_count = 0
        generic_count = 0
        
        for i, question in enumerate(TEST_QUESTIONS[:3], 1):  # Test first 3 questions
            print(f"[{i}/3] Testing: \"{question}\"")
            print("-" * 70)
            
            request = CoachRequest(
                mode=CoachMode.LEARN,
                specific_question=question,
                session_id=f"test_session_{i}"
            )
            
            try:
                response = service.get_response(request, user_id, is_paid_user=False)
                
                # Check if it's a fallback
                is_fallback = response.referenced_data.get("fallback", False)
                
                if is_fallback:
                    print("⚠️  FALLBACK RESPONSE")
                    generic_count += 1
                else:
                    print("✅ MATCHED TEMPLATE")
                    success_count += 1
                
                # Show preview
                preview = response.message[:150] + "..." if len(response.message) > 150 else response.message
                print(f"Response: {preview}")
                print(f"Confidence: {response.confidence}")
                
                # Show referenced data
                if response.referenced_data:
                    confidence_level = response.referenced_data.get("confidence_level")
                    if confidence_level:
                        print(f"Confidence Level: {confidence_level}")
                
            except Exception as e:
                print(f"❌ ERROR: {e}")
            
            print()
        
        # Summary
        print("=" * 70)
        print(" ENHANCED SERVICE SUMMARY")
        print("=" * 70)
        print(f"Questions tested: 3")
        print(f"✅ Matched templates: {success_count}")
        print(f"⚠️  Fallback responses: {generic_count}")
        print()
        
        if generic_count > 0:
            print("⚠️  Some questions fell back to generic responses.")
            print("   This usually means:")
            print("   - Templates don't have embeddings")
            print("   - No template matched with sufficient similarity")
            print()
            print("   Run: python backend/scripts/diagnose_amora.py")
        else:
            print("✅ Enhanced service is working correctly!")
        
        return success_count == 3
        
    except ImportError as e:
        print(f"⚠️  SKIPPED: Could not import enhanced service: {e}")
        print("   This is expected if dependencies aren't installed")
        return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def main():
    print("\n")
    print("╔" + "=" * 68 + "╗")
    print("║" + " " * 20 + "AMORA RESPONSE TEST" + " " * 29 + "║")
    print("╚" + "=" * 68 + "╝")
    print()
    
    # Test basic service
    basic_success = test_coach_service()
    
    # Test enhanced service
    enhanced_success = test_enhanced_service()
    
    # Final summary
    print()
    print("╔" + "=" * 68 + "╗")
    print("║" + " " * 23 + "FINAL RESULTS" + " " * 32 + "║")
    print("╚" + "=" * 68 + "╝")
    print()
    
    if basic_success:
        print("✅ Pattern matching fallback: WORKING")
    else:
        print("⚠️  Pattern matching fallback: NEEDS IMPROVEMENT")
    
    if enhanced_success:
        print("✅ Enhanced template service: WORKING")
    elif enhanced_success is False:
        print("⚠️  Enhanced template service: NOT WORKING")
    else:
        print("⚠️  Enhanced template service: NOT TESTED (missing config)")
    
    print()
    
    if basic_success or enhanced_success:
        print("🎉 At least one system is working! Your Amora should provide")
        print("   substantive responses now.")
    else:
        print("⚠️  Both systems need attention. See FIX_GENERIC_RESPONSES.md")
        print("   for troubleshooting steps.")
    
    print()

if __name__ == "__main__":
    main()
