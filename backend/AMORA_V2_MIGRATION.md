# Amora V2 Migration Guide

## Overview

This guide explains how to migrate from the current template-based Amora (V1) to the semantic LLM-powered Amora (V2).

## Prerequisites

1. **OpenAI API Access**
   - Sign up at https://platform.openai.com/
   - Generate API key
   - Add payment method (usage-based billing)

2. **Redis Setup** (for session storage & caching)
   - Local: `brew install redis` (Mac) or `apt-get install redis` (Linux)
   - Production: Use Render Redis or Upstash
   - Alternative: Skip Redis, use in-memory (not recommended for production)

3. **Cost Budget**
   - Estimate: $0.05-0.10 per conversation
   - With 1000 conversations/day: ~$50-100/month
   - Use caching to reduce costs by 60-70%

## Installation Steps

### 1. Update Dependencies

```bash
cd backend
pip install -r requirements.txt
```

New packages:
- `openai`: LLM client
- `redis`: Session & caching
- `tiktoken`: Token counting for cost control

### 2. Set Environment Variables

Create `.env` file:

```bash
# Copy example
cp .env.example .env

# Edit and add:
OPENAI_API_KEY=sk-your-actual-key-here
REDIS_URL=redis://localhost:6379/0
AMORA_V2_ENABLED=true
AMORA_V2_ROLLOUT_PERCENTAGE=10
```

### 3. Start Redis (Local Development)

```bash
redis-server
```

Or use Docker:
```bash
docker run -d -p 6379:6379 redis:latest
```

### 4. Test V2 Service

```bash
python -c "from app.services.amora_v2_service import AmoraV2Service; svc = AmoraV2Service(); print('Amora V2 ready!')"
```

## Migration Strategy

### Phase 1: Parallel Systems (Week 1-2)

**Goal**: Run V1 and V2 side-by-side

**Steps**:
1. Deploy V2 code
2. Set `AMORA_V2_ROLLOUT_PERCENTAGE=10`
3. Route 10% of traffic to V2
4. Monitor quality, costs, errors

**Implementation**:

```python
# In app/api/coach.py
import os
import random
from app.services.coach_service import CoachService  # V1
from app.services.amora_v2_service import AmoraV2Service  # V2

@router.post("/", response_model=CoachResponse)
async def get_coach_response(
    request: CoachRequest,
    user_id: UUID = Depends(get_user_id_from_auth)
):
    # Feature flag check
    v2_enabled = os.getenv("AMORA_V2_ENABLED", "false").lower() == "true"
    rollout_percentage = int(os.getenv("AMORA_V2_ROLLOUT_PERCENTAGE", "0"))
    
    # Determine which version to use
    use_v2 = v2_enabled and (random.randint(1, 100) <= rollout_percentage)
    
    if use_v2:
        logger.info("Using Amora V2")
        is_paid_user = check_subscription_status(user_id)  # Implement this
        service = AmoraV2Service()
        response = service.get_response(request, user_id, is_paid_user)
    else:
        logger.info("Using Amora V1")
        service = CoachService()
        response = service.get_response(request, user_id)
    
    return response
```

**Monitoring**:
- Track V1 vs V2 response times
- Track V1 vs V2 user satisfaction (thumbs up/down)
- Track OpenAI costs
- Track error rates

### Phase 2: Gradual Rollout (Week 3-4)

**Goal**: Increase V2 traffic to 50%

**Steps**:
1. Analyze Phase 1 metrics
2. Fix any issues
3. Increase `AMORA_V2_ROLLOUT_PERCENTAGE=50`
4. Continue monitoring

**Quality Checks**:
- Response quality: 80%+ positive feedback
- Response time: <3 seconds
- Cost per conversation: <$0.10
- Error rate: <1%

### Phase 3: Full Migration (Week 5)

**Goal**: 100% traffic on V2, deprecate V1

**Steps**:
1. Set `AMORA_V2_ROLLOUT_PERCENTAGE=100`
2. Monitor for 3-5 days
3. If stable, remove V1 code
4. Update documentation

## Cost Management

### Token Usage Optimization

1. **Limit context window**:
   ```python
   # Only send last 5 messages
   recent_messages = context.get('recent_messages', [])[-5:]
   ```

2. **Cache identical questions**:
   ```python
   # Use Redis to cache responses
   cache_key = f"amora:response:{hash(question)}"
   cached = redis.get(cache_key)
   if cached:
       return json.loads(cached)
   ```

3. **Use cheaper models when possible**:
   - Emotional detection: `gpt-4o-mini` (10x cheaper)
   - Response generation: `gpt-4-turbo` (better quality)

4. **Compress system prompts**:
   - Remove unnecessary words
   - Use abbreviations
   - Cache prompt embeddings

### Rate Limiting

Implement per-user rate limits:

```python
from redis import Redis
redis = Redis.from_url(os.getenv("REDIS_URL"))

def check_rate_limit(user_id: str, is_paid: bool) -> bool:
    key = f"ratelimit:{user_id}:{datetime.utcnow().strftime('%Y%m%d')}"
    count = redis.incr(key)
    redis.expire(key, 86400)  # 24 hours
    
    limit = 100 if is_paid else 10
    return count <= limit
```

### Monthly Cost Estimate

**Assumptions**:
- 1000 active users
- 5 messages/user/day average
- $0.08/conversation with caching

**Calculation**:
- 1000 users × 5 messages = 5000 conversations/day
- 5000 × $0.08 = $400/day
- $400 × 30 = $12,000/month

**Optimization**:
- With 70% cache hit rate: $3,600/month
- With 80% cache hit rate: $2,400/month

## Monitoring Dashboard

Track these metrics:

### User Experience
- Average conversation length
- Positive feedback ratio
- Free-to-paid conversion rate
- User retention (7-day, 30-day)

### Technical
- Response time (p50, p95, p99)
- Error rate
- Cache hit rate
- OpenAI API latency

### Business
- Cost per conversation
- Cost per active user
- Revenue per paid user
- LTV / CAC ratio

## Rollback Plan

If V2 has critical issues:

1. **Immediate**: Set `AMORA_V2_ENABLED=false`
2. **All traffic** routes to V1
3. **Investigate** logs and errors
4. **Fix** issues
5. **Redeploy** with fixes
6. **Gradually** re-enable V2

## Testing Checklist

Before full rollout, verify:

- [ ] Empty input handled gracefully
- [ ] One-word responses handled
- [ ] Emoji-only input handled
- [ ] Venting (high emotion) triggers reflection
- [ ] Advice-seeking (low emotion) gives guidance
- [ ] Identity questions answered correctly
- [ ] Rate limiting works
- [ ] Caching reduces costs
- [ ] Paid user memory persists
- [ ] Free user memory resets
- [ ] Response time <3s
- [ ] No generic "I don't understand" messages
- [ ] No directive language ("you must")
- [ ] Safety validation catches harmful content

## Troubleshooting

### OpenAI API Errors

**Error**: `RateLimitError`
**Solution**: Implement exponential backoff, queue requests

**Error**: `InvalidRequestError`
**Solution**: Check token limits, validate input

**Error**: `AuthenticationError`
**Solution**: Verify `OPENAI_API_KEY` is correct

### Redis Connection Errors

**Error**: `ConnectionError: Error 111 connecting to localhost:6379`
**Solution**: Start Redis server, check `REDIS_URL`

### High Costs

**Problem**: OpenAI bill exceeds budget
**Solutions**:
1. Increase cache hit rate
2. Use cheaper models (gpt-4o-mini)
3. Reduce max_tokens
4. Implement stricter rate limits
5. Compress prompts

### Low Quality Responses

**Problem**: Responses feel generic or robotic
**Solutions**:
1. Improve system prompts
2. Add more examples
3. Increase temperature (0.7 → 0.8)
4. Use better models (gpt-4-turbo vs gpt-3.5)
5. Add personality guidelines

## Support

For questions or issues:
- Check logs: `backend/logs/amora_v2.log`
- Review metrics dashboard
- Contact engineering team

---

**Status**: Ready for Phase 1 deployment
**Last Updated**: 2026-01-13
