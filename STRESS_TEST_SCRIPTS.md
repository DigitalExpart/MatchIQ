# 🧪 Amora Stress-Test Scripts

## Purpose
Test Amora with **18 realistic multi-turn conversations** to identify:
- ✅ Where responses are excellent
- ⚠️ Where responses are adequate but could be better
- ❌ Where responses miss the mark or fall back to generic templates

---

## How to Use

### For Each Script:
1. **Start a new session** in the UI
2. **Send each user message one at a time**
3. **After each Amora response:**
   - Check browser console for `engine`, `topics`, `confidence`
   - Rate the response: ✅ (excellent), ⚠️ (adequate), ❌ (poor/generic)
   - Note any issues in the tracking sheet

### Rating Criteria:

**✅ Excellent:**
- `engine: "blocks"`
- Response is emotionally specific and relevant
- Reflects the user's situation accurately
- Topics detected are appropriate
- No generic fallback language

**⚠️ Adequate:**
- `engine: "blocks"`
- Response is relevant but could be more specific
- Topics mostly correct but missing some nuance
- Feels slightly generic but not completely off

**❌ Poor:**
- `engine: "legacy_templates"` or `"error_fallback"`
- Generic response that doesn't reflect the situation
- Wrong topics detected
- Feels like a template, not a conversation

---

## Script 1: Acute Heartbreak (Fresh Breakup + Betrayal)

**Expected Topics:** `heartbreak`, `cheating`, `stuck_on_ex`  
**Expected Emotions:** hurt, shock, confusion, abandonment

### User Messages:
1. "My girlfriend broke up with me last week and I can't stop crying."
2. "I found out she was talking to someone else behind my back for months."
3. "I keep replaying everything wondering what I did wrong."
4. "Part of me still wants her back even after all of this."
5. "I don't even recognize myself, I feel so desperate."
6. "I don't know how to move on or even where to start."

---

## Script 2: Acute Heartbreak (Dumped Suddenly, No Closure)

**Expected Topics:** `heartbreak`, `stuck_on_ex`  
**Expected Emotions:** shock, confusion, rejection

### User Messages:
1. "He ended things out of nowhere after three years together."
2. "He just said he 'fell out of love' and wouldn't explain more."
3. "I feel like I didn't even get a chance to fix anything."
4. "I keep checking my phone hoping he'll change his mind."
5. "Everyone tells me to move on but I feel frozen."
6. "Was our whole relationship a lie?"

---

## Script 3: Long, Painful Marriage Strain (No Obvious Abuse)

**Expected Topics:** `marriage_strain`, `constant_fighting`, `mismatched_expectations`  
**Expected Emotions:** exhaustion, sadness, resentment

### User Messages:
1. "I've been married for 10 years and I feel like roommates with my husband."
2. "We don't really talk unless it's about bills or the kids."
3. "Any time I bring up how I feel, it turns into an argument."
4. "He says I'm never satisfied and I feel like he doesn't even try."
5. "Sometimes I wonder if staying together is actually good for any of us."
6. "I don't know if this is just a rough patch or if the marriage is over."

---

## Script 4: Long Marriage Strain (Different Life Goals)

**Expected Topics:** `marriage_strain`, `mismatched_expectations`, `core_values_conflict`  
**Expected Emotions:** torn, fearful, guilty

### User Messages:
1. "My wife wants another child and I really don't."
2. "I'm already overwhelmed and she says I'm being selfish."
3. "I'm scared that if I say no, she'll resent me forever."
4. "But if I say yes, I'm afraid I'll fall apart."
5. "I love her but I'm starting to feel trapped by this decision."

---

## Script 5: Toxic/Abusive Dynamic (Emotional Control, Fear)

**Expected Topics:** `toxic_or_abusive_dynamic`, `constant_fighting`, `low_self_worth_in_love`  
**Expected Emotions:** fear, shame, confusion

### User Messages:
1. "My partner calls me names when they're angry and then acts like nothing happened."
2. "They go through my phone and say it's because they 'care' and don't want me to cheat."
3. "If I try to leave, they threaten to hurt themselves."
4. "I'm scared to tell anyone because I don't think they'll believe me."
5. "Sometimes I wonder if I'm overreacting or if this is actually abusive."
6. "I don't know how to feel safe anymore."

---

## Script 6: Toxic/Abusive Dynamic (Isolation, Control)

**Expected Topics:** `toxic_or_abusive_dynamic`  
**Expected Emotions:** trapped, isolated, resigned

### User Messages:
1. "He doesn't like me seeing my friends and gets angry if I go out without him."
2. "He checks what I wear and says it's 'for my own good.'"
3. "When I'm upset, he tells me no one else would put up with me."
4. "My family thinks he's great because he's charming in front of them."
5. "I feel completely alone in this relationship."

---

## Script 7: Partner Mental Health/Addiction

**Expected Topics:** `partner_mental_health_or_addiction`, `one_sided_effort`  
**Expected Emotions:** worry, burnout, guilt

### User Messages:
1. "My boyfriend is really depressed and barely gets out of bed."
2. "I keep trying to cheer him up but nothing seems to work."
3. "I'm exhausted from taking care of everything on my own."
4. "I feel guilty even admitting that I'm tired of it."
5. "I don't know how much longer I can do this but I feel awful even thinking about leaving."

---

## Script 8: Partner Addiction (Alcohol)

**Expected Topics:** `partner_mental_health_or_addiction`, `toxic_or_abusive_dynamic`  
**Expected Emotions:** fear, anxiety, hypervigilance

### User Messages:
1. "My husband drinks every night and gets mean when he's drunk."
2. "The kids are starting to notice and it breaks my heart."
3. "When he's sober he apologizes and says he'll cut back, but it never lasts."
4. "I feel like I'm constantly walking on eggshells wondering which version of him I'll get."
5. "I don't know what's considered 'too much' or when it's a problem."

---

## Script 9: Intimacy Mismatch (Feeling Rejected)

**Expected Topics:** `intimacy_mismatch`, `low_self_worth_in_love`  
**Expected Emotions:** rejection, insecurity

### User Messages:
1. "My partner never wants to be intimate anymore and I feel ugly and unwanted."
2. "They say they're just stressed, but it's been like this for months."
3. "I'm scared to bring it up because I don't want to pressure them."
4. "At the same time, I'm starting to resent them and I hate feeling that way."
5. "I'm worried this means there's something wrong with me."

---

## Script 10: Intimacy Mismatch (Feeling Pressured)

**Expected Topics:** `intimacy_mismatch`, potentially `toxic_or_abusive_dynamic`  
**Expected Emotions:** guilt, pressure, anxiety

### User Messages:
1. "My partner wants sex way more often than I do and gets upset when I say no."
2. "They tell me it's 'normal' and that I'm depriving them."
3. "Sometimes I just give in so they won't be mad at me."
4. "I feel guilty and also kind of sick afterwards, like I betrayed myself."
5. "I don't know what's reasonable to expect in a relationship."

---

## Script 11: Talking Stage / Situationship Stuckness

**Expected Topics:** `talking_stage_or_situationship`, `one_sided_effort`, `online_dating_burnout`  
**Expected Emotions:** confusion, anxiety, longing

### User Messages:
1. "We've been talking and seeing each other for six months but we're still 'not official.'"
2. "They say they're not ready for a relationship but act like we're together."
3. "I'm scared that if I ask for more, they'll leave."
4. "At the same time, I feel stupid waiting around like this."
5. "I don't know if I'm being patient or just being used."

---

## Script 12: Talking Stage with Mixed Signals

**Expected Topics:** `talking_stage_or_situationship`, `comparison_to_others`, `low_self_worth_in_love`  
**Expected Emotions:** insecurity, jealousy

### User Messages:
1. "He texts me every day but says he doesn't want anything serious."
2. "I saw him liking other girls' pictures and it made me feel sick."
3. "He tells me I'm 'different' but still won't commit."
4. "I keep comparing myself to those other girls and feeling not good enough."
5. "Why do I stay when this hurts so much?"

---

## Script 13: Family/Religion/Value Conflicts (LGBTQ+ Relationship)

**Expected Topics:** `core_values_conflict`, `lgbtq_identity_and_family_pressure`  
**Expected Emotions:** fear, shame, loyalty conflict

### User Messages:
1. "I'm in a same‑sex relationship and my family doesn't know."
2. "They make comments about how 'wrong' it is and I'm terrified to come out."
3. "I love my partner but I'm scared my family will reject me if they find out."
4. "I feel like I'm living a double life and it's exhausting."
5. "I don't know how to choose between my family and being myself."

---

## Script 14: Family/Religion/Value Conflicts (Interfaith/Intercultural)

**Expected Topics:** `core_values_conflict`, `mismatched_expectations`  
**Expected Emotions:** fear, sadness, stuck

### User Messages:
1. "My partner and I are from different religions and my parents say they'll never accept the relationship."
2. "They say I'm betraying my culture if I stay with them."
3. "But I really see a future with this person."
4. "I'm scared of losing my family and also scared of losing this relationship."
5. "I don't know which sacrifice would hurt less."

---

## Script 15: Coparenting After Divorce

**Expected Topics:** `coparenting_and_family_dynamics`, `divorce_or_separation`, `constant_fighting`  
**Expected Emotions:** frustration, protectiveness, guilt

### User Messages:
1. "My ex and I share custody and we argue about everything related to the kids."
2. "They bad‑mouth me in front of the children and it breaks my heart."
3. "I don't want the kids to feel stuck in the middle."
4. "I feel guilty that they have to go back and forth between two homes."
5. "I just want to know how to make this less damaging for them."

---

## Script 16: Low Self-Worth in Love / "I Am Unlovable"

**Expected Topics:** `low_self_worth_in_love`, `stuck_on_ex`  
**Expected Emotions:** despair, shame

### User Messages:
1. "I honestly feel like I'm unlovable."
2. "Every relationship I've had ends with them leaving."
3. "I keep thinking maybe there's something broken in me."
4. "I'm scared I'll be alone forever."
5. "I don't even know how to believe I deserve a healthy relationship."

---

## Script 17: Online Dating Burnout

**Expected Topics:** `online_dating_burnout`, potentially `loneliness_single`  
**Expected Emotions:** exhaustion, cynicism, sadness

### User Messages:
1. "I'm so tired of dating apps."
2. "It's just endless swiping, small talk, ghosting."
3. "I feel more lonely now than before I started using them."
4. "I'm starting to think there's no one out there for me."
5. "I don't know whether to keep trying or just give up on dating for a while."

---

## Script 18: Non-Monogamy/Open Relationship Tension

**Expected Topics:** `non_monogamy_open_or_poly`, potentially `jealousy_or_insecurity`, `core_values_conflict`  
**Expected Emotions:** jealousy, confusion, fear of loss

### User Messages:
1. "My partner wants to open our relationship and I'm not sure how I feel."
2. "They say monogamy is 'just a social construct' and I feel judged for being uncomfortable."
3. "Part of me is scared they'll find someone better and leave."
4. "I don't know if I'm being close‑minded or if this just doesn't fit me."
5. "I'm afraid I'll lose them either way."

---

## Next Steps

1. **Run all 18 scripts** in the UI
2. **Log results** in the tracking spreadsheet
3. **Identify patterns:**
   - Which topics need more blocks?
   - Which emotions are under-represented?
   - Which stages (1 vs 2) need work?
4. **Create targeted block additions** based on gaps

---

**Ready to stress-test Amora? Let's find out where she shines and where she needs help!** 🧪
