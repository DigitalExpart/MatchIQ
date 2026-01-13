"""Quick test script to check normalization"""
import re

def normalize_question(question: str) -> str:
    """Normalize question for better pattern matching."""
    # Lowercase
    normalized = question.lower()
    # Replace curly apostrophes with straight ones
    normalized = normalized.replace(''', "'").replace(''', "'")
    # Normalize contractions: "i'm" -> "im", "don't" -> "dont", etc.
    normalized = re.sub(r"i'?m\b", "im", normalized)
    normalized = re.sub(r"don'?t\b", "dont", normalized)
    normalized = re.sub(r"won'?t\b", "wont", normalized)
    normalized = re.sub(r"can'?t\b", "cant", normalized)
    normalized = re.sub(r"isn'?t\b", "isnt", normalized)
    normalized = re.sub(r"aren'?t\b", "arent", normalized)
    normalized = re.sub(r"wasn'?t\b", "wasnt", normalized)
    normalized = re.sub(r"weren'?t\b", "werent", normalized)
    normalized = re.sub(r"hasn'?t\b", "hasnt", normalized)
    normalized = re.sub(r"haven'?t\b", "havent", normalized)
    normalized = re.sub(r"wouldn'?t\b", "wouldnt", normalized)
    normalized = re.sub(r"shouldn'?t\b", "shouldnt", normalized)
    normalized = re.sub(r"couldn'?t\b", "couldnt", normalized)
    # Remove punctuation (keep spaces)
    normalized = re.sub(r'[^\w\s]', ' ', normalized)
    # Collapse multiple spaces
    normalized = re.sub(r'\s+', ' ', normalized)
    # Strip
    normalized = normalized.strip()
    return normalized

# Test cases
test_questions = [
    "Am I ready for a committed relationship?",
    "Im confused I dont know if im in love",
    "I'm confused—don't know if I'm in love.",
    "ready to commit",
    "How does my past affect my present relationships?",
]

readiness_phrases = ["ready for", "prepared for", "ready to commit", "should i commit"]

print("Testing normalization and pattern matching:\n")
for q in test_questions:
    norm = normalize_question(q)
    matches = [p for p in readiness_phrases if p in norm]
    print(f"Question: {q}")
    print(f"Normalized: {norm}")
    print(f"Matches readiness: {matches}")
    print(f"Will match: {any(p in norm for p in readiness_phrases)}")
    print()
