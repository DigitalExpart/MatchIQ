# Quick Start: Top-K Weighted Selection & Coverage Report

## 🎯 What You Got

### 1. Top-K Weighted Random Selection
**More variation in Amora's responses while maintaining quality**

- Same user message → different responses across sessions
- Still topic-aligned, emotionally appropriate
- Configurable via `TOP_K_CANDIDATES = 5`

### 2. Block Coverage Report
**See exactly what content you have and where gaps exist**

- Shows blocks per topic/type/stage
- Identifies topics with < 10 blocks
- Run anytime to check coverage

---

## 🚀 Quick Start

### Test Weighted Selection (After Deployment)

```powershell
cd "C:\Users\Shilley Pc\MatchIQ"
.\test_weighted_selection.ps1
```

**Expected:** 5 different responses to the same question, all high quality.

### Run Coverage Report

```bash
cd backend
python scripts/report_block_coverage.py
```

**Expected:** Detailed report showing block counts per topic.

---

## 📊 Sample Coverage Report Output

```
Topic: heartbreak
  REFLECTION:
    stage 1: 3
    stage 2: 2
  NORMALIZATION:
    stage 1: 2
  EXPLORATION:
    stage 1: 3
  REFRAME:
    stage 2: 1
  TOTAL: 11

COVERAGE GAPS (topics with < 10 total blocks):
  action: 1 blocks
  alone: 1 blocks
  ambiguity: 2 blocks
```

---

## ⚙️ Configuration

### Adjust Variation Level

Edit `backend/app/services/amora_blocks_service.py`:

```python
# Line ~30
TOP_K_CANDIDATES = 5  # Default

# More variation: 7-8
# Less variation: 3-4
```

### Adjust Gap Threshold

Edit `backend/scripts/report_block_coverage.py`:

```python
# Line ~150
if topic_total < 10:  # Change this threshold
```

---

## 📖 Full Documentation

- **TOP_K_WEIGHTED_SELECTION.md** - Complete guide for weighted selection
- **BLOCK_COVERAGE_REPORT.md** - Detailed coverage report docs
- **TOP_K_AND_COVERAGE_IMPLEMENTATION.md** - Implementation summary

---

## ✅ Deployment Checklist

- [x] Code implemented
- [x] Pushed to `backend` branch (commit: 2d6ea94)
- [ ] Manual deploy on Render
- [ ] Test weighted selection
- [ ] Run coverage report
- [ ] Monitor user feedback

---

## 🎯 Key Benefits

### Weighted Selection
- ✅ Feels more human
- ✅ Less repetitive
- ✅ Same quality
- ✅ Easy to configure

### Coverage Report
- ✅ Identify gaps
- ✅ Plan content expansion
- ✅ Track growth
- ✅ Ensure balance

---

## 🔧 Troubleshooting

**Issue:** Responses still identical  
**Fix:** Increase `TOP_K_CANDIDATES` to 7

**Issue:** Responses feel random/off-topic  
**Fix:** Decrease `TOP_K_CANDIDATES` to 3

**Issue:** Coverage report shows 0 blocks  
**Fix:** Check `.env` file has correct Supabase credentials

---

## 📞 Next Steps

1. **Deploy to Render** (manual trigger needed)
2. **Run test scripts** to verify
3. **Check coverage report** for gaps
4. **Plan content expansion** based on gaps

---

**Status:** ✅ Ready for deployment  
**Version:** 2.1.0  
**Date:** 2026-01-16
