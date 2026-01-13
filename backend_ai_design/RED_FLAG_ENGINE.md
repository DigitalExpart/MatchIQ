# Red Flag & Risk Detection Engine

## Core Philosophy

Red flags are **safety signals**, not judgments. They indicate patterns that conflict with user-defined boundaries or established safety criteria.

## Detection Principles

1. **Boundary-Based**: Flags trigger when responses conflict with user's stated deal-breakers
2. **Severity-Graded**: Not all flags are equal - severity matters
3. **Evidence-Linked**: Every flag must reference specific responses
4. **Pattern-Aware**: Repeated patterns increase severity
5. **Transparent**: Users can see exactly why a flag was raised

## Severity Levels

### CRITICAL
- Immediate safety concerns
- Clear boundary violations
- Patterns indicating potential harm
- **Action**: Immediate alert, cannot be dismissed without review

### HIGH
- Significant misalignment with core values
- Repeated concerning patterns
- Deal-breaker violations
- **Action**: Prominent display, requires acknowledgment

### MEDIUM
- Moderate concerns
- Single instances of concerning behavior
- Partial boundary conflicts
- **Action**: Visible but not blocking

### LOW
- Minor inconsistencies
- Potential areas to watch
- Early-stage patterns
- **Action**: Informational only

## Detection Logic

### 1. Deal-Breaker Violations

```python
def detect_deal_breaker_violations(
    scan_answers: List[ScanAnswer],
    blueprint: Blueprint
) -> List[RedFlag]:
    """
    Detect when scan responses violate user's stated deal-breakers.
    """
    flags = []
    
    for deal_breaker in blueprint.deal_breakers:
        category = deal_breaker['category']
        question_id = deal_breaker.get('question_id')
        expected_response = deal_breaker.get('response')
        
        # Find relevant answers
        relevant_answers = [
            a for a in scan_answers 
            if a.category == category
        ]
        
        if question_id:
            relevant_answers = [
                a for a in relevant_answers 
                if a.question_id == question_id
            ]
        
        # Check for violations
        for answer in relevant_answers:
            # Red flag rating = violation
            if answer.rating == 'red-flag':
                flags.append(RedFlag(
                    severity='CRITICAL',
                    category=category,
                    signal=f"Response conflicts with your deal-breaker: {deal_breaker.get('description', category)}",
                    evidence=[answer.question_id],
                    type='deal_breaker_violation'
                ))
            # Yellow flag = potential violation
            elif answer.rating == 'yellow-flag' and question_id:
                flags.append(RedFlag(
                    severity='HIGH',
                    category=category,
                    signal=f"Potential conflict with your deal-breaker: {deal_breaker.get('description', category)}",
                    evidence=[answer.question_id],
                    type='deal_breaker_potential'
                ))
    
    return flags
```

### 2. Safety Pattern Detection

```python
SAFETY_PATTERNS = {
    'controlling_behavior': {
        'keywords': ['control', 'permission', 'allow', 'forbid', 'must ask'],
        'questions': ['communication', 'boundaries', 'independence'],
        'severity': 'CRITICAL',
        'description': 'Patterns suggesting controlling behavior'
    },
    'inconsistency': {
        'keywords': ['different story', 'changed', 'contradict'],
        'questions': ['honesty', 'reliability', 'consistency'],
        'severity': 'HIGH',
        'description': 'Inconsistent information or behavior'
    },
    'boundary_disrespect': {
        'keywords': ['ignored', 'pushed', 'insisted', 'wouldn\'t accept'],
        'questions': ['boundaries', 'respect', 'consent'],
        'severity': 'CRITICAL',
        'description': 'Disrespect for stated boundaries'
    },
    'emotional_manipulation': {
        'keywords': ['guilt', 'blame', 'made me feel', 'manipulate'],
        'questions': ['communication', 'emotional', 'respect'],
        'severity': 'HIGH',
        'description': 'Patterns suggesting emotional manipulation'
    },
    'isolation_attempts': {
        'keywords': ['friends', 'family', 'isolate', 'separate'],
        'questions': ['relationships', 'support', 'independence'],
        'severity': 'CRITICAL',
        'description': 'Attempts to isolate from support systems'
    },
    'intensity_rushing': {
        'keywords': ['too fast', 'rushed', 'pressure', 'commitment'],
        'questions': ['pace', 'timing', 'boundaries'],
        'severity': 'MEDIUM',
        'description': 'Rushing intimacy or commitment'
    }
}

def detect_safety_patterns(
    scan_answers: List[ScanAnswer],
    reflection_notes: Optional[ReflectionNotes] = None
) -> List[RedFlag]:
    """
    Detect safety-related patterns in responses and reflection notes.
    """
    flags = []
    
    # Check answers for safety patterns
    for answer in scan_answers:
        answer_lower = answer.question_text.lower() + ' ' + str(answer.rating).lower()
        
        for pattern_name, pattern_config in SAFETY_PATTERNS.items():
            # Check if question category matches
            if answer.category in pattern_config['questions']:
                # Check for keywords in question context
                if any(kw in answer_lower for kw in pattern_config['keywords']):
                    # Red flag rating increases severity
                    if answer.rating == 'red-flag':
                        severity = pattern_config['severity']
                    elif answer.rating == 'yellow-flag':
                        # Downgrade severity by one level
                        severity_map = {
                            'CRITICAL': 'HIGH',
                            'HIGH': 'MEDIUM',
                            'MEDIUM': 'LOW'
                        }
                        severity = severity_map.get(pattern_config['severity'], 'MEDIUM')
                    else:
                        continue  # Only flag if rating indicates concern
                    
                    flags.append(RedFlag(
                        severity=severity,
                        category=answer.category,
                        signal=pattern_config['description'],
                        evidence=[answer.question_id],
                        type=f'safety_pattern_{pattern_name}'
                    ))
    
    # Check reflection notes for safety patterns
    if reflection_notes:
        notes_text = ' '.join([
            notes for notes in reflection_notes.dict().values() 
            if notes
        ]).lower()
        
        for pattern_name, pattern_config in SAFETY_PATTERNS.items():
            if any(kw in notes_text for kw in pattern_config['keywords']):
                flags.append(RedFlag(
                    severity=pattern_config['severity'],
                    category='general',
                    signal=f"{pattern_config['description']} (mentioned in your reflections)",
                    evidence=['reflection_notes'],
                    type=f'safety_pattern_{pattern_name}_reflection'
                ))
    
    return flags
```

### 3. Response Inconsistency Detection

```python
def detect_inconsistencies(
    scan_answers: List[ScanAnswer]
) -> List[Inconsistency]:
    """
    Detect inconsistent responses within the same assessment.
    """
    inconsistencies = []
    
    # Group by category
    category_answers = {}
    for answer in scan_answers:
        cat = answer.category
        if cat not in category_answers:
            category_answers[cat] = []
        category_answers[cat].append(answer)
    
    # Check for contradictory responses within categories
    for category, answers in category_answers.items():
        if len(answers) < 2:
            continue
        
        # Check for extreme variance (e.g., strong-match and red-flag in same category)
        ratings = [a.rating for a in answers]
        rating_scores = [RATING_SCORES.get(r, 50) for r in ratings]
        
        if max(rating_scores) - min(rating_scores) >= 75:  # Large gap
            inconsistencies.append(Inconsistency(
                type='contradictory_responses',
                description=f'Significant variance in {category} responses',
                questions=[a.question_id for a in answers],
                severity='MEDIUM'
            ))
        
        # Check for pattern: all positive except one red flag
        if ratings.count('red-flag') == 1 and all(
            r in ['strong-match', 'good', 'neutral'] 
            for r in ratings if r != 'red-flag'
        ):
            inconsistencies.append(Inconsistency(
                type='isolated_red_flag',
                description=f'One red flag stands out in otherwise positive {category} responses',
                questions=[a.question_id for a in answers if a.rating == 'red-flag'],
                severity='HIGH'
            ))
    
    return inconsistencies
```

### 4. Profile Alignment Violations

```python
def detect_profile_mismatches(
    scan: Scan,
    blueprint: Blueprint,
    user_profile: UserProfile
) -> List[ProfileMismatch]:
    """
    Detect when scan responses don't align with user's profile expectations.
    """
    mismatches = []
    
    # Check dating goal alignment
    if user_profile.dating_goal in ['marriage', 'long-term']:
        goal_answers = [
            a for a in scan.answers
            if 'goal' in a.question_text.lower() or 
               'future' in a.question_text.lower() or
               'commitment' in a.question_text.lower()
        ]
        
        if goal_answers:
            low_goal_ratings = [
                a for a in goal_answers 
                if a.rating in ['yellow-flag', 'red-flag']
            ]
            
            if len(low_goal_ratings) > len(goal_answers) * 0.5:
                mismatches.append(ProfileMismatch(
                    description=f'Responses about relationship goals may not align with your {user_profile.dating_goal} goal',
                    severity='HIGH',
                    category='goals'
                ))
    
    # Check age-appropriate expectations
    if user_profile.age >= 30:
        maturity_answers = [
            a for a in scan.answers
            if 'mature' in a.question_text.lower() or
               'responsibility' in a.question_text.lower()
        ]
        
        if maturity_answers:
            immaturity_flags = [
                a for a in maturity_answers
                if a.rating in ['yellow-flag', 'red-flag']
            ]
            
            if len(immaturity_flags) > len(maturity_answers) * 0.4:
                mismatches.append(ProfileMismatch(
                    description=f'At {user_profile.age}, maturity levels may not align with your expectations',
                    severity='MEDIUM',
                    category='maturity'
                ))
    
    return mismatches
```

### 5. Pattern Repetition Detection

```python
def detect_repeated_patterns(
    current_scan: Scan,
    scan_history: List[Scan],
    user_id: UUID
) -> List[RedFlag]:
    """
    Detect patterns that repeat across multiple scans.
    Repeated patterns increase severity.
    """
    flags = []
    
    if not scan_history:
        return flags
    
    # Extract patterns from current scan
    current_patterns = extract_patterns(current_scan)
    
    # Check history for similar patterns
    pattern_counts = {}
    for historical_scan in scan_history[-5:]:  # Last 5 scans
        hist_patterns = extract_patterns(historical_scan)
        for pattern in current_patterns:
            if pattern in hist_patterns:
                pattern_counts[pattern] = pattern_counts.get(pattern, 0) + 1
    
    # Flag repeated patterns
    for pattern, count in pattern_counts.items():
        if count >= 2:  # Appeared in 2+ previous scans
            base_severity = pattern.get('severity', 'MEDIUM')
            
            # Increase severity for repetition
            if count >= 3:
                severity = 'CRITICAL' if base_severity != 'CRITICAL' else 'CRITICAL'
            elif count >= 2:
                severity_map = {
                    'LOW': 'MEDIUM',
                    'MEDIUM': 'HIGH',
                    'HIGH': 'CRITICAL',
                    'CRITICAL': 'CRITICAL'
                }
                severity = severity_map.get(base_severity, 'MEDIUM')
            else:
                severity = base_severity
            
            flags.append(RedFlag(
                severity=severity,
                category=pattern.get('category', 'general'),
                signal=f"Repeated pattern detected: {pattern.get('description')} (seen in {count} previous assessments)",
                evidence=pattern.get('evidence', []),
                type='repeated_pattern'
            ))
    
    return flags

def extract_patterns(scan: Scan) -> List[Dict]:
    """
    Extract pattern signatures from a scan.
    """
    patterns = []
    
    # Extract rating patterns by category
    category_ratings = {}
    for answer in scan.answers:
        cat = answer.category
        if cat not in category_ratings:
            category_ratings[cat] = []
        category_ratings[cat].append(answer.rating)
    
    # Create pattern signatures
    for category, ratings in category_ratings.items():
        # Pattern: mostly red flags
        if ratings.count('red-flag') >= len(ratings) * 0.5:
            patterns.append({
                'type': 'high_red_flags',
                'category': category,
                'description': f'High concentration of red flags in {category}',
                'severity': 'HIGH',
                'evidence': [a.question_id for a in scan.answers if a.category == category and a.rating == 'red-flag']
            })
        
        # Pattern: mixed signals
        unique_ratings = set(ratings)
        if len(unique_ratings) >= 4:  # Very mixed
            patterns.append({
                'type': 'mixed_signals',
                'category': category,
                'description': f'Highly mixed signals in {category}',
                'severity': 'MEDIUM',
                'evidence': [a.question_id for a in scan.answers if a.category == category]
            })
    
    return patterns
```

## Flag Aggregation & Prioritization

```python
def aggregate_and_prioritize_flags(
    all_flags: List[RedFlag]
) -> Dict[str, List[RedFlag]]:
    """
    Group flags by severity and remove duplicates.
    """
    # Group by severity
    by_severity = {
        'CRITICAL': [],
        'HIGH': [],
        'MEDIUM': [],
        'LOW': []
    }
    
    # Deduplicate by signal + evidence
    seen = set()
    
    for flag in all_flags:
        # Create unique key
        flag_key = (
            flag.signal,
            tuple(sorted(flag.evidence))
        )
        
        if flag_key not in seen:
            seen.add(flag_key)
            by_severity[flag.severity].append(flag)
    
    return by_severity
```

## Safety Protocol

```python
def apply_safety_protocol(
    flags: List[RedFlag],
    scan_result: ScanResult
) -> SafetyProtocol:
    """
    Apply safety protocols based on flag severity.
    """
    critical_flags = [f for f in flags if f.severity == 'CRITICAL']
    high_flags = [f for f in flags if f.severity == 'HIGH']
    
    protocol = SafetyProtocol(
        requires_immediate_review=len(critical_flags) > 0,
        cannot_dismiss=len(critical_flags) >= 2,
        show_safety_resources=len(critical_flags) > 0 or len(high_flags) >= 3,
        recommended_action='pause-and-reflect' if len(critical_flags) > 0 else None
    )
    
    return protocol
```

## Summary

The Red Flag Engine:
1. **Detects** boundary violations, safety patterns, inconsistencies
2. **Grades** severity based on evidence and repetition
3. **Links** every flag to specific evidence
4. **Prioritizes** critical safety concerns
5. **Transparent** - users can see exactly why flags were raised

