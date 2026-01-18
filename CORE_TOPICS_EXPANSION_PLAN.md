# Core Topics Expansion Plan - 30+ Blocks Per Topic

## Current Status

**Total core topics in local DB**: 18  
**Topics at target (≥30 blocks)**: 0  
**Topics below target**: 18  
**Total new blocks needed**: ~410

---

## Topics Requiring Expansion

| Topic | Current | Need | Priority |
|-------|---------|------|----------|
| talking_stage | 4 | **26** | HIGH |
| unclear | 4 | **26** | HIGH |
| unlovable | 4 | **26** | HIGH |
| marriage_strain | 5 | **25** | HIGH |
| inauthenticity | 5 | **25** | HIGH |
| cheating_self | 7 | **23** | CRITICAL |
| lust_vs_love | 7 | **23** | HIGH |
| pretense | 7 | **23** | HIGH |
| infidelity | 8 | **22** | CRITICAL |
| communication | 8 | **22** | HIGH |
| situationship | 8 | **22** | HIGH |
| trust | 8 | **22** | HIGH |
| cheating | 9 | **21** | CRITICAL |
| divorce | 9 | **21** | CRITICAL |
| separation | 9 | **21** | CRITICAL |
| jealousy | 9 | **21** | HIGH |
| breakup | 11 | **19** | CRITICAL |
| heartbreak | 15 | **15** | CRITICAL |

---

## Block Distribution Strategy

For each topic, aim for balanced distribution:

### Target Mix (per 30 blocks)
- **REFLECTION**: 8 blocks (4 stage 1, 4 stage 2)
- **NORMALIZATION**: 8 blocks (4 stage 1, 4 stage 2)
- **EXPLORATION**: 8 blocks (4 stage 1, 4 stage 2)
- **INSIGHT**: 6 blocks (mostly stage 2)

### Adjustment Rules
1. **Fill gaps first**: If topic has 0 INSIGHT blocks, prioritize those
2. **Balance stages**: Ensure roughly equal stage 1 and stage 2 coverage
3. **Maintain quality**: All blocks must follow Amora's non-directive style

---

## Implementation Approach

### Phase 1: Critical Topics (Heartbreak, Breakup, Cheating, Divorce, Separation)
- Most common user issues
- ~100 new blocks total
- Focus on emotional depth and stage 2 content

### Phase 2: Trust & Communication Topics (Trust, Jealousy, Communication, Infidelity)
- Relationship dynamics
- ~85 new blocks total
- Balance between reflection and exploration

### Phase 3: Identity & Clarity Topics (Lust vs Love, Unclear, Situationship, Talking Stage)
- Confusion and ambiguity
- ~95 new blocks total
- Strong exploration component

### Phase 4: Self-Worth & Authenticity (Unlovable, Pretense, Inauthenticity, Cheating Self)
- Internal struggles
- ~90 new blocks total
- Deep INSIGHT blocks for stage 2

### Phase 5: Long-term Relationship Topics (Marriage Strain)
- Committed relationships
- ~25 new blocks total
- Balance across all types

---

## Block Creation Guidelines

### REFLECTION Blocks (1-3 sentences)
- Mirror emotional experience
- Topic-specific validation
- Non-judgmental tone

**Example** (heartbreak, stage 1):
> "Breakups can feel like your whole world is shifting, and that's incredibly disorienting. The pain you're feeling right now is real, and it matters."

### NORMALIZATION Blocks (1-3 sentences)
- Universal human context
- Reduce shame
- "You're not alone/broken"

**Example** (heartbreak, stage 2):
> "Most people who've loved deeply have also grieved deeply. The intensity of your pain often reflects how much that connection meant to you, and there's nothing wrong with that."

### EXPLORATION Blocks (2-3 sentences + question)
- Gentle setup
- Open-ended question
- Invites self-reflection

**Example** (heartbreak, stage 1):
> "When someone we care about leaves, it can shake our sense of who we are and what relationships mean. What part of this feels hardest for you to process right now?"

### INSIGHT Blocks (4-8 sentences)
- Common patterns
- Non-directive perspective
- Stage 2+ only

**Example** (heartbreak, stage 2):
> "After a breakup, it's common to cycle between different emotions—sometimes anger, sometimes sadness, sometimes even relief—and that can feel confusing. You might find yourself replaying conversations or wondering what you could have done differently. These are natural ways our minds try to make sense of loss. The grief isn't linear, and there's no 'right' timeline for healing. Some days will feel harder than others, and that's okay. What matters most is giving yourself permission to feel whatever comes up, without rushing the process."

---

## Safety & Style Constraints

### Absolutely NO:
- Directive language: "you should / must / have to / need to"
- Advice-giving: "leave them / stay / do this specific thing"
- Judgment: "that's wrong / bad / toxic" (except for abusive dynamics where safety is clear)
- Off-topic: anything not related to relationships/love/dating

### Always YES:
- Validating: "that sounds hard / makes sense / is understandable"
- Curious: open-ended questions
- Contextualizing: "many people feel / it's common to"
- Empathetic: "I can hear the pain in what you're sharing"

### Special Care Topics:
- **toxic_or_abusive_dynamic**: Validate concern, don't minimize, but don't diagnose
- **unlovable / low_self_worth**: Extra gentle, affirming inherent worth
- **cheating_self**: Non-judgmental, focus on internal conflict and growth

---

## SQL Migration Structure

```sql
-- 009_expand_core_topics_to_30.sql

INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) VALUES

-- HEARTBREAK (need 15 more)
('reflection', '...', ARRAY['heartbreak', 'breakup'], ARRAY['sad', 'hurt'], 2, 50, true),
...

-- BREAKUP (need 19 more)
('normalization', '...', ARRAY['breakup', 'loss'], ARRAY['sad', 'confused'], 1, 50, true),
...

-- (Continue for all 18 topics)
;
```

---

## Verification Steps

1. Run migration against local DB
2. Compute embeddings: `python backend/scripts/compute_block_embeddings.py`
3. Re-run coverage report: `python backend/scripts/report_block_coverage.py`
4. Confirm all core topics show `[OK] >= 30 blocks`
5. Deploy to production
6. Test with varied queries across topics

---

## Expected Outcome

After completing this expansion:

- **Total blocks**: ~500 (94 current + 410 new)
- **Core topics at target**: 18 / 18 (100%)
- **Response variation**: Significantly improved
- **Topic coverage**: Comprehensive across relationship issues
- **User experience**: More human, less repetitive, deeply relevant

---

**Status**: Ready to generate blocks  
**Estimated time**: ~2 hours to generate and review 410 high-quality blocks  
**Next step**: Create SQL migration file

