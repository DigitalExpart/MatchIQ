# Amora Conversation Design Improvements

## === DIAGNOSIS_AND_RULES ===

### Main Failure Modes Identified

1. **Weak Session Continuity**
   - **Problem**: Amora treats each message as isolated, doesn't reference previous topics or statements
   - **Root Cause**: Block selection doesn't check for "linking" opportunities when previous topics exist in state
   - **Fix**: Add session-aware block selection that prioritizes blocks referencing previous topics when context_topics are present

2. **Over-Assuming Context**
   - **Problem**: "heartbroken" → assumes breakup; "I miss our sex life" → assumes ex (even without breakup signal)
   - **Root Cause**: Topic detection triggers on single keywords without requiring dual signals for ambiguous cases
   - **Fix**: 
     - Require explicit breakup/ex signals for `breakup_grief` (not just "heartbroken")
     - Create separate topic `relationship_intimacy_concerns` for "miss sex life" WITHOUT breakup signals
     - Add negative guardrails: "If no 'ex'/'breakup'/'broke up' in text, NEVER use 'ex'/'breakup' language in blocks"

3. **Over-Labeling Emotions**
   - **Problem**: Telling users they feel "anxious" when they didn't say it
   - **Root Cause**: Emotion detection is too aggressive, blocks assume emotions from topic keywords
   - **Fix**: Only use emotion labels that user explicitly stated OR that are strongly implied by their exact words

4. **Generic/Mismatched Responses**
   - **Problem**: Blocks are too generic, don't mirror specific situations (e.g., "left on read for days")
   - **Root Cause**: Blocks are topic-level, not situation-specific; missing granular topics like `partner_withdrawing`
   - **Fix**: Add more specific topics and blocks that mirror exact user situations

### Concrete Rules/Heuristics

**Session Continuity Rules:**
- If `state.active_topics` contains `unlovable` AND current message detects `partner_withdrawing` → prioritize blocks tagged with BOTH topics
- If `state.active_topics` contains `breakup_grief` AND current message detects `breakup_intimacy_loss` → use linking blocks that reference "earlier you mentioned grieving..."
- If user previously mentioned a specific person/relationship detail → prefer blocks that can reference it (use `{partner_label}` template)

**Assumption Prevention Rules:**
- **Rule 1**: `breakup_grief` requires BOTH "heartbroken"/"heartbreak" AND explicit breakup signal ("breakup", "broke up", "ex", "ended things", "dumped")
- **Rule 2**: `breakup_intimacy_loss` requires BOTH breakup/ex signal AND intimacy signal (already implemented ✓)
- **Rule 3**: "I miss our sex life" WITHOUT breakup/ex signal → map to `relationship_intimacy_concerns` (current relationship), NOT `breakup_intimacy_loss`
- **Rule 4**: Block text validation: If block contains "ex" or "breakup" but user message has NO breakup/ex signals → filter out that block

**Emotion Labeling Rules:**
- Only detect `anxiety` if user explicitly says "anxious", "anxiety", "worried", "nervous", "panic", OR describes physical symptoms ("heart races", "can't stop thinking")
- Never assume "anxiety" from topic keywords alone (e.g., "communication problems" ≠ "anxiety")
- Use softer language: "It sounds like this might feel..." instead of "your anxiety is constantly running"

**Specificity Rules:**
- When user describes specific behavior (e.g., "leaves messages unread for days"), blocks should mirror that exact detail
- Prefer blocks with specific language ("being left on read", "messages going unanswered") over generic ("communication problems")

---

## === TOPIC_MODEL ===

### Recommended Topics (Expanded)

1. **`unlovable`** - User explicitly states feeling unlovable, worthless, or that no one will love them
   - Keywords: "unlovable", "not lovable", "no one will love me", "worthless", "i am unlovable"
   - Requires explicit mention (already gated ✓)

2. **`breakup_grief`** - Explicit grief about a romantic breakup
   - Keywords: "heartbroken" + "breakup"/"broke up"/"ex"/"ended things"
   - Requires DUAL signal: heartbreak word + breakup signal

3. **`breakup_intimacy_loss`** - Missing physical intimacy/sex with an ex (already implemented ✓)
   - Requires DUAL signal: breakup/ex + intimacy signal

4. **`relationship_intimacy_concerns`** - Missing physical intimacy/sex in CURRENT relationship (NEW)
   - Keywords: "miss our sex life", "miss the sex", "miss intimacy" WITHOUT breakup/ex signals
   - Use when: intimacy loss mentioned but NO breakup/ex context

5. **`partner_withdrawing`** - Partner pulling away, ignoring messages, less attention (NEW)
   - Keywords: "no longer gives attention", "ignores messages", "leaves unread", "doesn't pick calls", "used to call/text but now opposite", "pulling away", "distant"
   - Specific situation: shift from early-stage attention to current distance

6. **`heartbreak_general`** - Heartbreak NOT explicitly about breakup (NEW)
   - Keywords: "heartbroken", "heartbreak", "broken heart" WITHOUT breakup/ex signals
   - Use when: user says "heartbroken" but context unclear (could be death, job loss, family, etc.)

7. **`relationship_anxiety`** - User explicitly states anxiety about current relationship (NEW, separate from `user_anxiety_distress`)
   - Keywords: "anxious about relationship", "anxious they will leave", "relationship anxiety"
   - Only if user explicitly says "anxious" + relationship context

---

## === BLOCK_REWRITES ===

### User input: "I feel unlovable"

**topic: `unlovable`**  
**block_type: reflection**  
**text:** "It sounds like you're carrying a deep sense that you might not be lovable, and that pain is really hard to sit with."  
**safety_notes:** Validates without dismissing; avoids "story we tell ourselves" language that can feel invalidating

**topic: `unlovable`**  
**block_type: reflection**  
**text:** "I hear that you're struggling with feeling unlovable, and that belief feels heavy and real right now."  
**safety_notes:** Acknowledges the belief as real to them, not dismissing it

**topic: `unlovable`**  
**block_type: normalization**  
**text:** "Feeling unlovable often comes from old wounds or messages we received, not from current truth about who you are."  
**safety_notes:** Normalizes without promising outcome; connects to past without diagnosing

**topic: `unlovable`**  
**block_type: normalization**  
**text:** "Many people struggle with feeling unlovable at some point, especially when relationships feel uncertain or when past hurts resurface."  
**safety_notes:** Normalizes without minimizing; acknowledges it's common

**topic: `unlovable`**  
**block_type: exploration**  
**text:** "When did you first start feeling this way? What experiences or messages contributed to that feeling?"  
**safety_notes:** Single question (not two); invites reflection without forcing

**topic: `unlovable`**  
**block_type: exploration**  
**text:** "What would it feel like to be truly seen and accepted by someone?"  
**safety_notes:** Opens possibility without promising it will happen

**topic: `unlovable`**  
**block_type: reframe**  
**text:** "Sometimes feeling unlovable is less about whether you're actually lovable, and more about whether you've been able to receive love in ways that felt real to you."  
**safety_notes:** Soft reframe; doesn't dismiss the feeling but offers perspective

---

### User input: "I miss our sex life with my ex"

**topic: `breakup_intimacy_loss`**  
**block_type: reflection**  
**text:** "I hear that you miss the physical closeness and connection you had with your ex, and that loss feels significant to you."  
**safety_notes:** Mirrors exactly what they said; validates the loss

**topic: `breakup_intimacy_loss`**  
**block_type: reflection**  
**text:** "It sounds like the physical intimacy you shared was an important part of what made that relationship feel special, and missing that is natural."  
**safety_notes:** Acknowledges intimacy as part of relationship, not just sex

**topic: `breakup_intimacy_loss`**  
**block_type: normalization**  
**text:** "Missing the physical connection you had with an ex is very common, especially when that was a meaningful part of your relationship."  
**safety_notes:** Normalizes without minimizing; common but still valid

**topic: `breakup_intimacy_loss`**  
**block_type: normalization**  
**text:** "It's natural to grieve the loss of physical intimacy along with the emotional connection. Both were part of what made that relationship what it was."  
**safety_notes:** Connects physical and emotional loss

**topic: `breakup_intimacy_loss`**  
**block_type: exploration**  
**text:** "What was it about the physical connection you had that feels hardest to let go of?"  
**safety_notes:** Focused question; invites deeper reflection

**topic: `breakup_intimacy_loss`**  
**block_type: exploration**  
**text:** "When you think about missing that intimacy, what comes up for you—is it more about the physical closeness, or what it represented in your relationship?"  
**safety_notes:** Helps distinguish physical vs. emotional layers

**topic: `breakup_intimacy_loss`**  
**block_type: reframe**  
**text:** "Physical intimacy in a relationship often represents more than just physical connection—it can be about feeling desired, safe, understood, or fully yourself with someone. Missing that can feel like missing a whole dimension of how you related to each other."  
**safety_notes:** Non-explicit; focuses on emotional/relational meaning

---

### User input: "I'm heartbroken"

**topic: `heartbreak_general`** (if NO breakup signal) OR `breakup_grief` (if breakup signal present)  
**block_type: reflection**  
**text:** "I hear that you're heartbroken, and that pain feels deep and real right now."  
**safety_notes:** Validates without assuming cause; doesn't force "breakup" narrative

**topic: `heartbreak_general`**  
**block_type: reflection**  
**text:** "It sounds like you're carrying a lot of grief, and the weight of whatever happened feels heavy."  
**safety_notes:** Acknowledges grief without specifying source

**topic: `heartbreak_general`**  
**block_type: normalization**  
**text:** "Heartbreak can come from many kinds of loss—relationships, dreams, connections—and all of it is valid and real."  
**safety_notes:** Broadens beyond romantic breakup; validates all forms of heartbreak

**topic: `breakup_grief`** (only if breakup signal present)  
**block_type: normalization**  
**text:** "Grief after a breakup isn't linear—some days feel okay, others feel impossible, and that's completely normal."  
**safety_notes:** Only use if breakup explicitly mentioned

**topic: `heartbreak_general`**  
**block_type: exploration**  
**text:** "What part of this heartbreak feels hardest to sit with right now?"  
**safety_notes:** Open question; doesn't assume cause

**topic: `breakup_grief`** (only if breakup signal present)  
**block_type: exploration**  
**text:** "What part of this loss feels hardest to sit with right now?"  
**safety_notes:** More specific if breakup context confirmed

**topic: `heartbreak_general`**  
**block_type: reframe**  
**text:** "Heartbreak often comes in waves—moments where you feel okay, followed by moments where the pain hits you all over again. This isn't a sign that you're not healing; it's how grief works."  
**safety_notes:** Applies to any heartbreak, not just breakups

---

### User input: "I miss our sex life" (NO ex/breakup signal)

**topic: `relationship_intimacy_concerns`**  
**block_type: reflection**  
**text:** "I hear that you're missing the physical closeness and connection you used to have, and that shift feels significant to you."  
**safety_notes:** Uses "used to have" (implies current relationship), NOT "ex"; mirrors their language

**topic: `relationship_intimacy_concerns`**  
**block_type: reflection**  
**text:** "It sounds like the physical intimacy you shared was an important part of what made your relationship feel special, and noticing that it's changed is natural."  
**safety_notes:** Focuses on change in current relationship, not loss from breakup

**topic: `relationship_intimacy_concerns`**  
**block_type: normalization**  
**text:** "It's common for physical intimacy to shift over time in relationships, and missing what it used to be doesn't mean something is wrong with you or your relationship."  
**safety_notes:** Normalizes change without minimizing concern

**topic: `relationship_intimacy_concerns`**  
**block_type: normalization**  
**text:** "Physical intimacy often represents safety, closeness, and being seen in a particular way. Missing that doesn't mean you're just missing sex—it's often about missing that sense of connection."  
**safety_notes:** Connects physical to emotional without being explicit

**topic: `relationship_intimacy_concerns`**  
**block_type: exploration**  
**text:** "What was it about the physical connection you used to have that feels hardest to let go of or understand?"  
**safety_notes:** Focuses on understanding the change, not just missing it

**topic: `relationship_intimacy_concerns`**  
**block_type: exploration**  
**text:** "When you think about what's changed, what comes up for you—is it more about the physical closeness itself, or what it represented in your relationship?"  
**safety_notes:** Helps distinguish layers of meaning

**topic: `relationship_intimacy_concerns`**  
**block_type: reframe**  
**text:** "Sometimes what we miss most about physical intimacy isn't just the act itself, but the way it made us feel—seen, wanted, connected, or at ease. That emotional layer might be what you're really missing."  
**safety_notes:** Non-explicit; focuses on emotional meaning

---

### User input: "I noticed my boyfriend no longer give me attention when i send him a message he ignore me leave my messages unread for days doesnt pick my calls unlike when we first started he is the one calling and sending me text but now it the opposite"

**topic: `partner_withdrawing`**  
**block_type: reflection**  
**text:** "I hear that you've noticed a real shift—from him being the one reaching out and calling to now leaving your messages unread for days and not picking up your calls. That change must feel really hard."  
**safety_notes:** Mirrors exact details (unread messages, days, calls); validates the shift

**topic: `partner_withdrawing`**  
**block_type: reflection**  
**text:** "It sounds like you're experiencing a significant change in how he responds to you—from early attention and responsiveness to now being left on read and ignored. That shift is real and it hurts."  
**safety_notes:** Uses their exact language ("left on read"); acknowledges the hurt

**topic: `partner_withdrawing`**  
**block_type: normalization**  
**text:** "It's natural to feel confused and hurt when someone's communication patterns shift like this, especially when it feels like a complete reversal from how things started."  
**safety_notes:** Normalizes the confusion/hurt without minimizing the situation

**topic: `partner_withdrawing`**  
**block_type: normalization**  
**text:** "When someone goes from being responsive and initiating contact to leaving messages unanswered, it often signals something deeper is happening—and that uncertainty can be really hard to sit with."  
**safety_notes:** Acknowledges it might signal something deeper without diagnosing

**topic: `partner_withdrawing`**  
**block_type: exploration**  
**text:** "What does it feel like when you send a message and it goes unread for days?"  
**safety_notes:** Single focused question; invites them to explore the feeling

**topic: `partner_withdrawing`**  
**block_type: exploration**  
**text:** "When you think about this shift from how things started to how they are now, what comes up for you?"  
**safety_notes:** Opens reflection on the change itself

**topic: `partner_withdrawing`**  
**block_type: reframe**  
**text:** "Sometimes when someone's communication patterns change this dramatically, it's less about you and more about what's happening for them—though that doesn't make it any easier to experience."  
**safety_notes:** Soft reframe; doesn't blame them but also doesn't excuse his behavior

---

## === LINKING_BLOCKS ===

### Linking Scenario 1: User previously said "I feel unlovable", now describes partner withdrawing

**Context**: `state.active_topics` contains `unlovable`, current message detects `partner_withdrawing`

**topic: `unlovable`, `partner_withdrawing`**  
**block_type: reflection**  
**text:** "Earlier you shared that you feel unlovable, and now you're describing your boyfriend leaving your messages unread and not picking up your calls. I imagine this shift might be reinforcing that feeling of being unlovable."  
**safety_notes:** Explicitly links the two; acknowledges how one reinforces the other

**topic: `unlovable`, `partner_withdrawing`**  
**block_type: reflection**  
**text:** "It sounds like this change in how he responds—from calling and texting to leaving you on read—might be touching on that core belief you mentioned earlier about feeling unlovable."  
**safety_notes:** Connects current event to previous core belief

**topic: `unlovable`, `partner_withdrawing`**  
**block_type: exploration**  
**text:** "How does his pulling away connect to that feeling of being unlovable you shared earlier?"  
**safety_notes:** Single question that explicitly links the two

**topic: `unlovable`, `partner_withdrawing`**  
**block_type: exploration**  
**text:** "When you notice him leaving your messages unread, what happens to that belief you mentioned about not being lovable?"  
**safety_notes:** Helps them see the connection between event and belief

**topic: `unlovable`, `partner_withdrawing`**  
**block_type: reframe**  
**text:** "Sometimes when someone pulls away, it can feel like proof that we're unlovable—but his behavior might be about what's happening for him, not about your worth or lovability."  
**safety_notes:** Soft reframe that doesn't dismiss their feeling but offers perspective

---

### Linking Scenario 2: User previously talked about breakup grief, now mentions missing intimacy with ex

**Context**: `state.active_topics` contains `breakup_grief`, current message detects `breakup_intimacy_loss`

**topic: `breakup_grief`, `breakup_intimacy_loss`**  
**block_type: reflection**  
**text:** "Earlier you mentioned grieving this breakup, and now you're sharing that you miss the physical intimacy you had together. It sounds like missing that closeness is part of what you're grieving."  
**safety_notes:** Explicitly links grief to missing intimacy; validates both

**topic: `breakup_grief`, `breakup_intimacy_loss`**  
**block_type: reflection**  
**text:** "It makes sense that after sharing how heartbroken you've been, missing the physical connection you had would come up. That intimacy was part of what you're processing in this loss."  
**safety_notes:** Normalizes the connection between grief and missing intimacy

**topic: `breakup_grief`, `breakup_intimacy_loss`**  
**block_type: exploration**  
**text:** "How does missing that physical intimacy connect to the grief you've been feeling about the breakup?"  
**safety_notes:** Single question linking the two experiences

**topic: `breakup_grief`, `breakup_intimacy_loss`**  
**block_type: exploration**  
**text:** "When you think about what you're grieving—both the relationship and the physical closeness—what feels most present for you right now?"  
**safety_notes:** Helps them explore both layers of loss

**topic: `breakup_grief`, `breakup_intimacy_loss`**  
**block_type: reframe**  
**text:** "Grieving a breakup often includes grieving multiple layers—the person, the future you imagined, the routines, and yes, the physical intimacy. Missing that closeness is part of processing the whole loss."  
**safety_notes:** Normalizes missing intimacy as part of broader grief

---

### Linking Scenario 3: User previously mentioned relationship anxiety, now describes partner withdrawing

**Context**: `state.active_topics` contains `relationship_anxiety`, current message detects `partner_withdrawing`

**topic: `relationship_anxiety`, `partner_withdrawing`**  
**block_type: reflection**  
**text:** "Earlier you mentioned feeling anxious about your relationship, and now you're describing him leaving your messages unread and not calling back. I imagine this shift might be amplifying that anxiety."  
**safety_notes:** Links anxiety to current event; only uses "anxious" if user explicitly said it earlier

**topic: `relationship_anxiety`, `partner_withdrawing`**  
**block_type: exploration**  
**text:** "How does noticing him pull away connect to the anxiety you've been feeling about the relationship?"  
**safety_notes:** Explicitly links the two; helps them see the connection

---

## Implementation Notes

1. **Topic Detection Updates Needed:**
   - Add `relationship_intimacy_concerns` topic (intimacy loss WITHOUT breakup signal)
   - Add `partner_withdrawing` topic (specific withdrawal behaviors)
   - Add `heartbreak_general` topic (heartbreak WITHOUT breakup signal)
   - Modify `breakup_grief` detection to require DUAL signal (heartbreak + breakup)

2. **Block Selection Logic Updates:**
   - When `state.active_topics` contains a previous topic AND current message detects a related topic → prioritize blocks tagged with BOTH topics
   - Add block text validation: filter out blocks containing "ex"/"breakup" if user message has NO breakup/ex signals

3. **Emotion Detection Updates:**
   - Only detect `anxiety` if user explicitly states it OR describes clear physical symptoms
   - Don't assume emotions from topic keywords alone

4. **Block Database Updates:**
   - Insert all new blocks from this document
   - Tag linking blocks with multiple topics (e.g., `['unlovable', 'partner_withdrawing']`)
   - Ensure blocks for `relationship_intimacy_concerns` NEVER contain "ex" or "breakup" language
