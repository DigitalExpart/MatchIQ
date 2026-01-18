# 🚀 Amora Quick Reference Guide

**One-page reference for everything you need to know.**

---

## 📊 **Current Status**

✅ **529 blocks** | ✅ **26 topics** | ✅ **100% embeddings** | ✅ **Production ready**

---

## 🎯 **What Amora Covers**

| Category | Topics | Blocks |
|----------|--------|--------|
| **Heartbreak** | Breakup, divorce, cheating, stuck on ex | 94 |
| **Dynamics** | Fighting, distance, effort, appreciation | 150 |
| **Sensitive** | Abuse, mental health, intimacy, values | 90 |
| **Identity** | LGBTQ+, non-monogamy, asexuality | 45 |
| **Dating** | Apps, situationships, self-worth | 150 |

---

## 🔧 **Common Tasks**

### Add New Blocks
```sql
-- 1. Create SQL
INSERT INTO amora_response_blocks (block_type, text, topics, emotions, stage, priority, active) 
VALUES ('reflection', 'Text here...', ARRAY['topic'], ARRAY['emotion'], 1, 50, true);

-- 2. Run in Supabase
-- 3. Compute embeddings
```
```powershell
.\compute_embeddings_remote.ps1
```

### Check Status
```powershell
# Quick test
.\test_identity_topics.ps1

# Full test
.\test_critical_topics.ps1
```

### Monitor Health
- **API:** `GET /api/v1/coach/health`
- **Blocks:** `GET /api/v1/admin/blocks-status`
- **Logs:** Render dashboard

---

## 📁 **Key Files**

| File | Purpose |
|------|---------|
| `AMORA_FINAL_CAPABILITIES.md` | Complete documentation |
| `STRESS_TEST_SCRIPTS.md` | 18 conversation tests |
| `stress_test_tracker.csv` | Testing tracker |
| `amora_blocks_service.py` | Core engine |
| `coach_enhanced.py` | API endpoint |

---

## 🧪 **Testing**

### Quick Test (3 topics):
```powershell
.\test_identity_topics.ps1
```

### Full Test (18 conversations):
1. Open `STRESS_TEST_SCRIPTS.md`
2. Open `stress_test_tracker.csv`
3. Run each script in UI
4. Log results

**Target:** 95%+ success rate

---

## 🚨 **Troubleshooting**

| Problem | Solution |
|---------|----------|
| Generic responses | Check `engine` field (should be "blocks") |
| Empty responses | Check embeddings computed |
| Wrong topics | Add more blocks for that topic |
| Repetition | Check `recent_block_ids` tracking |
| Slow responses | Check Render logs for errors |

---

## 📈 **Metrics to Track**

- **Engine:** Should always be "blocks"
- **Response time:** <500ms
- **Topics detected:** Should match user message
- **Confidence:** >0.7 is good
- **User engagement:** Sessions >3 turns

---

## 🔮 **Next Steps**

1. ✅ Deploy 3 identity topics (DONE)
2. 🧪 Run stress tests (18 scripts)
3. 📊 Analyze results
4. 🔧 Add missing blocks
5. 🚀 Launch to users

---

## 💡 **Quick Tips**

- **Always compute embeddings** after adding blocks
- **Test immediately** after changes
- **Check console** for `engine` field
- **Track patterns** in user questions
- **Iterate based on feedback**

---

## 📞 **Resources**

- **Backend:** https://macthiq-ai-backend.onrender.com
- **Database:** Supabase (xvicydrqtddctywkvyge)
- **Docs:** `AMORA_FINAL_CAPABILITIES.md`
- **Tests:** `STRESS_TEST_SCRIPTS.md`

---

## ✅ **Deployment Checklist**

- [x] 529 blocks deployed
- [x] All embeddings computed
- [x] Block engine active
- [x] All topics tested
- [ ] Stress tests complete
- [ ] Frontend deployed
- [ ] User feedback collected
- [ ] Public launch

---

**Amora is ready. Time to launch! 🚀**
