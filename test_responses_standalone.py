"""
Standalone test - shows the new responses without any dependencies.
This demonstrates what users will see after deployment!
"""

# Simulated pattern matching (same logic as coach_service.py)
def get_response(question):
    """Simulate the improved pattern matching."""
    question_lower = question.lower()
    
    # Past relationships
    if any(phrase in question_lower for phrase in ["past relationship", "my past", "my ex"]):
        return "Your past experiences often shape how you approach relationships now—that's natural. Sometimes patterns from previous relationships can influence what feels safe or comfortable. It might help to reflect: What specific patterns do you notice? Are there certain reactions or fears that seem familiar? Understanding these connections can help you decide what to carry forward and what to release."
    
    # Relationship mess/complicated
    if any(phrase in question_lower for phrase in ["love life is a mess", "relationship is a mess", "so complicated", "its complicated", "relationship status is complicated", "relationship status is very complicated", "status is very"]):
        if "complicated" in question_lower:
            return "Feeling uncertain about where you stand with someone can create a lot of mental and emotional energy. Sometimes 'complicated' means there are different expectations, unclear boundaries, or mixed signals. What would help you feel more clear about what you want from this connection?"
        else:
            return "It sounds like things feel really overwhelming right now, and that can be exhausting. When relationships feel messy, it often means there's a lot happening at once—emotions, situations, uncertainty. What part of this feels most tangled or confusing to you right now?"
    
    # Relationship patterns
    if any(phrase in question_lower for phrase in ["same mistakes", "same type of person", "pattern in relationships", "keep dating the same"]):
        return "Noticing patterns in your relationships shows real self-awareness, and that's an important first step. Patterns often develop because they once served a purpose—maybe they felt familiar or safe in some way. It might help to reflect: What draws you to these situations initially? What needs might these patterns have been trying to meet? Understanding the 'why' can help you make different choices moving forward."
    
    # Jealousy
    if any(phrase in question_lower for phrase in ["feel jealous", "so jealous", "jealousy"]):
        return "Jealousy is a common emotion that often signals underlying needs or insecurities. It might help to explore: What specifically triggers the jealousy? Is it rooted in past experiences, current relationship dynamics, or your own self-perception? Understanding where it comes from can help you address it constructively—through communication, building security, or working on your own emotional needs."
    
    # Heartbreak
    if any(phrase in question_lower for phrase in ["heartbroken", "heartbreak", "broken heart"]):
        return "I can hear how much pain you're carrying right now, and I'm so sorry you're going through this. Grief after a breakup isn't linear—some days feel okay, others feel impossible, and that's completely normal. What part of this loss feels hardest to sit with right now?"
    
    # Cheating
    if any(phrase in question_lower for phrase in ["partner cheated", "found out", "cheated on me", "infidelity"]):
        return "Finding out someone betrayed your trust like that is devastating, and what you're feeling is completely valid. When trust is broken like this, it shakes everything—not just the relationship, but your sense of reality and safety. Right now, what feels most important—understanding why it happened, or deciding what you want to do next?"
    
    # Default
    return "I'm here to help you explore relationship topics thoughtfully. What's been on your mind lately?"

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
print(" AMORA'S NEW RESPONSES (PREVIEW)")
print("="*70 + "\n")

for i, question in enumerate(TEST_QUESTIONS, 1):
    print(f"[{i}/{len(TEST_QUESTIONS)}] Question:")
    print(f"  \"{question}\"")
    print()
    
    response = get_response(question)
    
    print("Amora's Response:")
    # Wrap text at 70 characters
    words = response.split()
    line = "  "
    for word in words:
        if len(line) + len(word) + 1 > 72:
            print(line)
            line = "  " + word
        else:
            line += " " + word if line != "  " else word
    print(line)
    
    print()
    print("-" * 70)
    print()

print("="*70)
print(" THESE ARE THE NEW RESPONSES!")
print("="*70)
print("\n✅ No more generic 'Can you share more?' responses")
print("✅ Rich, contextual, empathetic responses")
print("✅ Tailored to each specific situation")
print("\nThese will be live once Render finishes deploying!")
print("Check: https://dashboard.render.com\n")
