# AI Coach Implementation Guide

## Overview

The AI Coach (Ella) is implemented as a rule-based explanation generator with mode-specific templates. It does NOT use an LLM for generation - all responses are constructed from templates and data.

## Architecture

```
AI Coach Service
├── Mode Router (EXPLAIN, REFLECT, LEARN, SAFETY)
├── Context Builder (extracts relevant data)
├── Template Engine (constructs responses)
└── Response Validator (ensures compliance)
```

## Core Implementation

### 1. Mode Router

```python
from enum import Enum
from typing import Dict, Any, Optional
from pydantic import BaseModel

class CoachMode(str, Enum):
    EXPLAIN = "EXPLAIN"
    REFLECT = "REFLECT"
    LEARN = "LEARN"
    SAFETY = "SAFETY"

class CoachRequest(BaseModel):
    mode: CoachMode
    scan_result_id: Optional[UUID] = None
    scan_id: Optional[UUID] = None
    blueprint_id: Optional[UUID] = None
    user_id: UUID
    specific_question: Optional[str] = None
    category: Optional[str] = None

class CoachResponse(BaseModel):
    message: str
    mode: CoachMode
    confidence: float
    referenced_data: Dict[str, Any]

def route_coach_request(request: CoachRequest) -> CoachResponse:
    """Route request to appropriate mode handler."""
    context = build_context(request)
    
    if request.mode == CoachMode.EXPLAIN:
        return explain_mode(context)
    elif request.mode == CoachMode.REFLECT:
        return reflect_mode(context)
    elif request.mode == CoachMode.LEARN:
        return learn_mode(context, request.specific_question)
    elif request.mode == CoachMode.SAFETY:
        return safety_mode(context)
    else:
        raise ValueError(f"Unknown mode: {request.mode}")
```

### 2. Context Builder

```python
@dataclass
class CoachContext:
    scan_result: Optional[ScanResult]
    blueprint: Optional[Blueprint]
    user_profile: UserProfile
    category_scores: Dict[str, float]
    red_flags: List[RedFlag]
    confidence_score: float
    reflection_notes: Optional[ReflectionNotes]

def build_context(request: CoachRequest) -> CoachContext:
    """Build context from database queries."""
    # Load scan result
    scan_result = None
    if request.scan_result_id:
        scan_result = db.get_scan_result(request.scan_result_id)
    elif request.scan_id:
        scan = db.get_scan(request.scan_id)
        scan_result = db.get_latest_scan_result(scan.id)
    
    # Load blueprint
    blueprint = None
    if request.blueprint_id:
        blueprint = db.get_blueprint(request.blueprint_id)
    else:
        blueprint = db.get_active_blueprint(request.user_id)
    
    # Load user profile
    user_profile = db.get_user_profile(request.user_id)
    
    # Extract data
    category_scores = scan_result.category_scores if scan_result else {}
    red_flags = scan_result.red_flags if scan_result else []
    confidence_score = scan_result.ai_analysis.get('confidence_score', 0.5) if scan_result else 0.5
    
    # Load reflection notes
    reflection_notes = None
    if scan_result and scan_result.scan_id:
        scan = db.get_scan(scan_result.scan_id)
        reflection_notes = scan.reflection_notes
    
    return CoachContext(
        scan_result=scan_result,
        blueprint=blueprint,
        user_profile=user_profile,
        category_scores=category_scores,
        red_flags=red_flags,
        confidence_score=confidence_score,
        reflection_notes=reflection_notes
    )
```

### 3. EXPLAIN Mode

```python
def explain_mode(context: CoachContext) -> CoachResponse:
    """Explain scan results."""
    if not context.scan_result:
        return CoachResponse(
            message="I don't have assessment results to explain. Please complete an assessment first.",
            mode=CoachMode.EXPLAIN,
            confidence=0.0,
            referenced_data={}
        )
    
    parts = []
    
    # 1. What was evaluated
    parts.append("Based on your assessment, I evaluated compatibility across several areas.")
    
    # 2. Overall score explanation
    overall_score = context.scan_result.overall_score
    category = context.scan_result.category
    parts.append(f"Your overall compatibility score is {overall_score}, which suggests {category.replace('-', ' ')}.")
    
    # 3. Category breakdown
    if context.category_scores:
        parts.append("Here's how different areas aligned:")
        
        # Sort by score
        sorted_categories = sorted(
            context.category_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        # Top areas
        top_areas = sorted_categories[:2]
        for cat, score in top_areas:
            cat_name = cat.replace('_', ' ').title()
            parts.append(f"- {cat_name}: {score}%")
        
        # Areas of concern
        concern_areas = [cat for cat, score in sorted_categories if score < 60]
        if concern_areas:
            parts.append(f"Areas with lower alignment include: {', '.join([c.replace('_', ' ').title() for c in concern_areas[:2]])}.")
    
    # 4. Blueprint reference
    if context.blueprint:
        top_priority = context.blueprint.top_priorities[0] if context.blueprint.top_priorities else None
        if top_priority:
            priority_score = context.category_scores.get(top_priority, 0)
            parts.append(f"Since {top_priority.replace('_', ' ')} is something you ranked as highly important, the {priority_score}% alignment there may feel more significant to you than it would to someone with different priorities.")
    
    # 5. Confidence note
    if context.confidence_score < 0.7:
        parts.append("Note: This assessment has lower confidence due to limited responses. More questions would provide a clearer picture.")
    
    message = " ".join(parts)
    
    return CoachResponse(
        message=message,
        mode=CoachMode.EXPLAIN,
        confidence=context.confidence_score,
        referenced_data={
            'overall_score': overall_score,
            'category': category,
            'category_scores': context.category_scores
        }
    )
```

### 4. REFLECT Mode

```python
def reflect_mode(context: CoachContext) -> CoachResponse:
    """Generate reflection questions."""
    questions = []
    
    if not context.scan_result:
        questions = [
            "What patterns do you notice in your past relationships?",
            "What values matter most to you in a connection?",
            "What boundaries are non-negotiable for you?"
        ]
    else:
        # Questions based on results
        
        # If there's a score gap
        if context.category_scores:
            sorted_scores = sorted(context.category_scores.items(), key=lambda x: x[1])
            lowest = sorted_scores[0]
            highest = sorted_scores[-1]
            
            if highest[1] - lowest[1] > 30:
                questions.append(
                    f"You showed strong alignment in {highest[0].replace('_', ' ')} "
                    f"but lower alignment in {lowest[0].replace('_', ' ')}. "
                    f"What does that difference mean to you?"
                )
        
        # If there are deal-breakers
        if context.blueprint and context.blueprint.deal_breakers:
            questions.append(
                "You identified some deal-breakers in your blueprint. "
                "How do those boundaries feel in practice?"
            )
        
        # If there are red flags
        if context.red_flags:
            high_severity = [f for f in context.red_flags if f.severity in ['HIGH', 'CRITICAL']]
            if high_severity:
                questions.append(
                    "Some patterns were flagged as higher risk based on your boundaries. "
                    "What do those patterns mean to you?"
                )
        
        # General reflection
        questions.append("What patterns do you notice in how you assess connections?")
    
    # Ensure we have 2-4 questions
    if len(questions) < 2:
        questions.extend([
            "What matters most to you in a connection?",
            "What boundaries are important to you?"
        ])
    
    questions = questions[:4]  # Max 4
    
    message = "Based on what you shared, here are a few questions you may want to sit with:\n\n"
    message += "\n".join([f"• {q}" for q in questions])
    
    return CoachResponse(
        message=message,
        mode=CoachMode.REFLECT,
        confidence=0.8,
        referenced_data={'question_count': len(questions)}
    )
```

### 5. LEARN Mode

```python
LEARN_TOPICS = {
    'value_alignment': {
        'definition': 'Value alignment means your core beliefs and priorities are compatible.',
        'why_matters': 'When values align, decisions and life directions tend to be easier to navigate together.',
        'misunderstandings': 'Value alignment doesn\'t mean identical values - it means compatible values that can coexist.'
    },
    'boundary_consistency': {
        'definition': 'Boundary consistency means your stated boundaries are respected and maintained over time.',
        'why_matters': 'Consistent boundaries create safety and predictability in relationships.',
        'misunderstandings': 'Boundaries aren\'t walls - they\'re the framework that allows intimacy to grow safely.'
    },
    'communication_reliability': {
        'definition': 'Communication reliability means words and actions align consistently.',
        'why_matters': 'Reliable communication builds trust and reduces uncertainty.',
        'misunderstandings': 'Reliability doesn\'t mean perfect communication - it means patterns you can depend on.'
    },
    'emotional_safety': {
        'definition': 'Emotional safety means feeling able to be vulnerable without fear of harm or judgment.',
        'why_matters': 'Safety allows deeper connection and authentic expression.',
        'misunderstandings': 'Safety isn\'t the absence of conflict - it\'s the presence of respect during conflict.'
    }
}

def learn_mode(context: CoachContext, topic: Optional[str] = None) -> CoachResponse:
    """Provide educational content."""
    
    # Determine topic
    if not topic:
        # Default to first topic or most relevant
        topic = 'value_alignment'
    
    # Extract topic from question if provided
    topic_lower = topic.lower() if topic else ''
    if 'boundary' in topic_lower:
        selected_topic = 'boundary_consistency'
    elif 'communication' in topic_lower:
        selected_topic = 'communication_reliability'
    elif 'safety' in topic_lower or 'safe' in topic_lower:
        selected_topic = 'emotional_safety'
    else:
        selected_topic = 'value_alignment'
    
    topic_data = LEARN_TOPICS.get(selected_topic, LEARN_TOPICS['value_alignment'])
    
    message_parts = [
        topic_data['definition'],
        topic_data['why_matters'],
        topic_data['misunderstandings']
    ]
    
    message = " ".join(message_parts)
    
    return CoachResponse(
        message=message,
        mode=CoachMode.LEARN,
        confidence=1.0,
        referenced_data={'topic': selected_topic}
    )
```

### 6. SAFETY Mode

```python
def safety_mode(context: CoachContext) -> CoachResponse:
    """Explain red flags and safety concerns."""
    
    if not context.red_flags:
        return CoachResponse(
            message="No safety flags were detected in this assessment.",
            mode=CoachMode.SAFETY,
            confidence=1.0,
            referenced_data={}
        )
    
    # Group by severity
    by_severity = {
        'CRITICAL': [],
        'HIGH': [],
        'MEDIUM': [],
        'LOW': []
    }
    
    for flag in context.red_flags:
        by_severity[flag.severity].append(flag)
    
    parts = []
    
    # Critical flags first
    if by_severity['CRITICAL']:
        parts.append("This assessment detected patterns marked as critical risk signals.")
        for flag in by_severity['CRITICAL'][:2]:  # Max 2
            parts.append(
                f"- {flag.signal}. "
                f"This pattern conflicts with boundaries you defined as non-negotiable."
            )
        parts.append(
            "These patterns don't predict outcomes, but they do indicate higher risk "
            "based on your own criteria."
        )
    
    # High severity
    elif by_severity['HIGH']:
        parts.append("This assessment detected patterns marked as higher-risk signals.")
        for flag in by_severity['HIGH'][:2]:
            parts.append(
                f"- {flag.signal}. "
                f"This pattern may conflict with what you've indicated matters to you."
            )
        parts.append(
            "These patterns suggest increased risk relative to your stated boundaries."
        )
    
    # Medium/Low
    else:
        parts.append("Some patterns were flagged for awareness.")
        for flag in (by_severity['MEDIUM'] + by_severity['LOW'])[:2]:
            parts.append(f"- {flag.signal}")
        parts.append("These are areas to observe, not necessarily deal-breakers.")
    
    # Reference boundaries
    if context.blueprint and context.blueprint.deal_breakers:
        parts.append(
            "These flags are based on boundaries and priorities you defined in your blueprint."
        )
    
    message = " ".join(parts)
    
    return CoachResponse(
        message=message,
        mode=CoachMode.SAFETY,
        confidence=context.confidence_score,
        referenced_data={
            'flag_count': len(context.red_flags),
            'severity_breakdown': {k: len(v) for k, v in by_severity.items()}
        }
    )
```

### 7. Response Validator

```python
FORBIDDEN_PHRASES = [
    'you should',
    'you must',
    'you need to',
    'this is toxic',
    'they are manipulating',
    'leave immediately',
    'you deserve better',
    'this relationship won\'t work',
    'you have to',
    'you can\'t'
]

def validate_response(response: CoachResponse) -> Tuple[bool, Optional[str]]:
    """Validate response doesn't violate constraints."""
    message_lower = response.message.lower()
    
    for phrase in FORBIDDEN_PHRASES:
        if phrase in message_lower:
            return False, f"Response contains forbidden phrase: {phrase}"
    
    # Check for directive language
    if response.mode != CoachMode.REFLECT:
        if 'you should' in message_lower or 'you must' in message_lower:
            return False, "Response contains directive language"
    
    return True, None
```

## Usage Example

```python
# EXPLAIN mode
request = CoachRequest(
    mode=CoachMode.EXPLAIN,
    scan_result_id=scan_result_id,
    user_id=user_id
)
response = route_coach_request(request)

# SAFETY mode
request = CoachRequest(
    mode=CoachMode.SAFETY,
    scan_result_id=scan_result_id,
    user_id=user_id
)
response = route_coach_request(request)

# REFLECT mode
request = CoachRequest(
    mode=CoachMode.REFLECT,
    blueprint_id=blueprint_id,
    user_id=user_id
)
response = route_coach_request(request)
```

## Summary

The AI Coach:
1. **Routes** requests to mode-specific handlers
2. **Builds** context from database
3. **Generates** responses from templates and data
4. **Validates** responses for compliance
5. **Never** uses LLM generation (all rule-based)

