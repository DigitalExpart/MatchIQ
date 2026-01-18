# 🚨 Deploying Critical Topics to Amora

## 📋 What's Being Added

**6 sensitive but essential relationship topics** (90 new blocks):

1. **Toxic / Controlling / Abusive Dynamics** 🚨
   - Topic key: `toxic_or_abusive_dynamic`
   - Handles: emotional abuse, control, manipulation, safety concerns

2. **Core Values / Religion / Culture Conflicts** ⚖️
   - Topic key: `core_values_conflict`
   - Handles: interfaith relationships, cultural differences, family pressure

3. **Sexual / Physical Intimacy Mismatch** 💔
   - Topic key: `intimacy_mismatch`
   - Handles: mismatched libido, rejection, pressure, desire differences

4. **Partner's Mental Health / Addiction Strain** 🧠
   - Topic key: `partner_mental_health_or_addiction`
   - Handles: depression, anxiety, substance abuse, caretaker burnout

5. **Parenting / Co-Parenting / Blended Families** 👨‍👩‍👧‍👦
   - Topic key: `coparenting_and_family_dynamics`
   - Handles: custody, step-parenting, parenting conflicts

6. **Sexual Compatibility / Preferences / Styles** 🔥
   - Topic key: `sexual_compatibility`
   - Handles: different preferences, kinks, comfort levels, communication

---

## 🎯 Why These Topics Matter

These are **real, common relationship struggles** that users need support with:

- **Toxic dynamics**: Safety-critical; Amora should recognize warning signs
- **Values conflicts**: Major source of relationship stress
- **Intimacy issues**: Affects 40%+ of long-term relationships
- **Mental health**: Growing concern in modern relationships
- **Coparenting**: Huge pain point for divorced/blended families
- **Sexual compatibility**: Often goes unaddressed due to shame

---

## 🚀 Deployment Steps

### Step 1: Run SQL in Supabase

1. Open Supabase SQL Editor
2. Copy contents of `007_critical_topics_expansion.sql`
3. Click "Run"
4. Should see: **"Success. No rows returned"**

### Step 2: Compute Embeddings

```powershell
.\compute_embeddings_remote.ps1
```

Expected result:
```
Total blocks: 484 (394 existing + 90 new)
With embeddings: 484
Completion: 100.0%
```

### Step 3: Test

```powershell
.\test_critical_topics.ps1
```

---

## ⚠️ Important Notes

### Amora's Approach to Sensitive Topics

**What Amora DOES:**
- ✅ Validates feelings without judgment
- ✅ Normalizes difficult emotions
- ✅ Asks gentle, exploratory questions
- ✅ Acknowledges complexity and pain
- ✅ Subtly encourages seeking professional help when appropriate

**What Amora DOES NOT:**
- ❌ Give direct advice or tell users what to do
- ❌ Diagnose mental health conditions
- ❌ Make safety decisions for users
- ❌ Judge or shame sexual preferences
- ❌ Take sides in conflicts

### Safety Considerations

For **toxic/abusive dynamics**, Amora's responses:
- Validate the user's experience
- Normalize confusion and self-doubt
- Gently explore safety concerns
- Subtly point toward support resources
- Never pressure immediate action (which can be dangerous)

**Note:** Amora is NOT a crisis hotline or safety planning tool. For users in immediate danger, they should contact:
- National Domestic Violence Hotline: 1-800-799-7233
- Crisis Text Line: Text HOME to 741741

---

## 🧪 Test Questions

Try these after deployment:

1. **Toxic Dynamics:**
   > "My boyfriend gets really angry when I talk to other guys. He checks my phone and tells me what to wear. Is this normal?"

2. **Values Conflict:**
   > "I'm Christian and my girlfriend is Muslim. Our families are pressuring us to break up. I love her but I'm scared."

3. **Intimacy Mismatch:**
   > "My wife never wants to have sex anymore. It's been 6 months. I feel rejected and unwanted."

4. **Partner Mental Health:**
   > "My boyfriend is depressed and won't get help. I'm exhausted from trying to keep him afloat. I feel guilty for wanting to leave."

5. **Coparenting:**
   > "My ex undermines my parenting decisions and talks badly about me to our kids. I don't know what to do."

6. **Sexual Compatibility:**
   > "I want to explore different things sexually but my partner thinks it's weird. I feel ashamed for even wanting it."

---

## 📊 Expected Results

### Before This Expansion
- 394 blocks
- 17 topics
- Good coverage of common issues

### After This Expansion
- **484 blocks** (23% increase)
- **23 topics** (35% increase)
- **Comprehensive coverage** including sensitive/taboo topics

---

## ✅ Success Criteria

- [ ] SQL runs without errors
- [ ] 90 new blocks inserted
- [ ] All blocks have embeddings
- [ ] Test queries return `engine: "blocks"`
- [ ] Responses are empathetic, non-judgmental, and specific to the topic
- [ ] No generic fallback messages

---

## 🚀 Ready to Deploy?

1. Run `007_critical_topics_expansion.sql` in Supabase
2. Run `.\compute_embeddings_remote.ps1`
3. Run `.\test_critical_topics.ps1`
4. Celebrate! 🎉

---

**Total Amora Coverage After This:**
- **484 blocks**
- **23 relationship topics**
- **Handles everything from heartbreak to abuse to sexual compatibility**
- **Production-ready for real users with real problems**
