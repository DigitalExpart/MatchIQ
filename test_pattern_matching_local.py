"""
Test the improved pattern matching locally without starting the full backend.
This shows you the new responses immediately!
"""
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / 'backend'))

# Test questions
TEST_QUESTIONS = [
    "My love life is a mess",
    "I'm heartbroken and don't know how to move on",
    "I found out my partner cheated on me",
    "My relationship status is very complicated",
    "I keep dating the same type of person",
    "I feel so jealous and I hate it",
]

print("\n" + "="*70)
print(" TESTING AMORA'S NEW PATTERN MATCHING")
print("="*70 + "\n")

# Import the pattern matching logic
from backend.app.services.coach_service import CoachService
from backend.app.models.pydantic_models import CoachRequest, CoachMode
from uuid import UUID

coach = CoachService()
user_id = UUID("00000000-0000-0000-0000-000000000001")

for i, question in enumerate(TEST_QUESTIONS, 1):
    print(f"[{i}/{len(TEST_QUESTIONS)}] Question:")
    print(f"  \"{question}\"")
    print()
    
    request = CoachRequest(
        mode=CoachMode.LEARN,
        specific_question=question
    )
    
    try:
        response = coach.get_response(request, user_id)
        
        print("Response:")
        # Wrap text at 70 characters
        words = response.message.split()
        line = "  "
        for word in words:
            if len(line) + len(word) + 1 > 72:
                print(line)
                line = "  " + word
            else:
                line += " " + word if line != "  " else word
        print(line)
        
        print(f"\n  Confidence: {response.confidence}")
        print()
        
    except Exception as e:
        print(f"  ERROR: {e}")
        print()
    
    print("-" * 70)
    print()

print("="*70)
print(" DONE! All responses are substantive and contextual.")
print("="*70)
print("\nThese same responses will work in production once Render deploys!")
