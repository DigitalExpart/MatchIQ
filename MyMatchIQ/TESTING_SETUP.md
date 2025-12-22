# Testing Setup Guide

## Quick Start for Testing AI Coach

### Option 1: Use Existing User (Recommended)

If you already have a user account in the app:

1. **Start the backend:**
   ```bash
   cd MyMatchIQ/backend
   python -m uvicorn app.main:app --reload
   ```

2. **Start the frontend:**
   ```bash
   cd MyMatchIQ
   npm run dev
   ```

3. **Sign in to the app** - This will set `myMatchIQ_currentUserId` in localStorage

4. **Navigate to a scan result** - The AI Coach will automatically load

5. **Test messaging** - Type a question in the AI Coach input and press Enter

### Option 2: Create Test User in Database

If you need to create a test user:

1. **Start the backend** (as above)

2. **Create a test user** using Python:
   ```python
   from app.database import SessionLocal
   from app.models.db_models import User
   import uuid

   db = SessionLocal()
   test_user = User(
       id=uuid.uuid4(),
       email="test@example.com",
       subscription_tier="free"
   )
   db.add(test_user)
   db.commit()
   user_id = str(test_user.id)
   print(f"Test user ID: {user_id}")
   db.close()
   ```

3. **Set the user ID in browser console:**
   ```javascript
   localStorage.setItem('myMatchIQ_currentUserId', 'YOUR_USER_ID_HERE');
   ```

4. **Refresh the page** and test the AI Coach

### Option 3: Use X-User-Id Header (Development Only)

The backend supports `X-User-Id` header for development. The API client will automatically use your `myMatchIQ_currentUserId` from localStorage when in local mode.

## Testing Checklist

- [ ] Backend is running on http://localhost:8000
- [ ] Frontend is running on http://localhost:3000 (or configured port)
- [ ] User ID is set in localStorage (`myMatchIQ_currentUserId`)
- [ ] You have a scan/assessment to test with
- [ ] Navigate to Results Screen
- [ ] AI Coach panel should load automatically
- [ ] Try asking a question in the AI Coach

## Troubleshooting

### "Authentication required" error
- Make sure `myMatchIQ_currentUserId` is set in localStorage
- Check browser console for the user ID value
- Verify the user exists in the database

### "Failed to load AI coach" error
- Check backend is running: http://localhost:8000/health
- Check browser console for detailed error
- Verify CORS is configured correctly in backend

### Coach not responding
- Check backend logs for errors
- Verify the scan has a valid scan_id
- Check that the scan result exists in database

## API Testing

You can also test directly via API:

```bash
# Get version info (no auth required)
curl http://localhost:8000/api/v1/versions

# Test coach endpoint (requires user_id)
curl -X POST http://localhost:8000/api/v1/coach/ \
  -H "Content-Type: application/json" \
  -H "X-User-Id: YOUR_USER_ID" \
  -d '{
    "mode": "EXPLAIN",
    "scan_id": "YOUR_SCAN_ID",
    "category": "general"
  }'
```

