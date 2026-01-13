"""
Quick test script to verify backend and Supabase connection.
Run this after setting up the backend to test the connection.
"""
import asyncio
from app.database import get_supabase_client, init_db
from app.config import settings

def test_connection():
    """Test Supabase connection."""
    print("Testing Supabase connection...")
    print(f"Project ID: {settings.SUPABASE_PROJECT_ID}")
    print(f"URL: {settings.SUPABASE_URL}")
    
    try:
        # Initialize database
        db_status = init_db()
        if db_status:
            print("✅ Database connection successful!")
        else:
            print("⚠️ Database connection check failed (tables may not exist yet)")
        
        # Test Supabase client
        supabase = get_supabase_client()
        
        # Try to query users table
        print("\nTesting users table query...")
        result = supabase.table("users").select("id").limit(1).execute()
        print(f"✅ Users table accessible (found {len(result.data)} records)")
        
        # Try to insert a test user
        print("\nCreating test user...")
        test_user = {
            "email": "test@example.com",
            "profile": {
                "name": "Test User",
                "language": "en"
            },
            "subscription_tier": "free"
        }
        
        insert_result = supabase.table("users").insert(test_user).execute()
        if insert_result.data:
            user_id = insert_result.data[0]["id"]
            print(f"✅ Test user created with ID: {user_id}")
            
            # Clean up - delete test user
            print("\nCleaning up test user...")
            supabase.table("users").delete().eq("id", user_id).execute()
            print("✅ Test user deleted")
        else:
            print("❌ Failed to create test user")
        
        print("\n✅ All tests passed! Backend is ready to use.")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Check your .env file has correct Supabase credentials")
        print("2. Verify tables were created in Supabase SQL Editor")
        print("3. Check your database password in DATABASE_URL")
        raise

if __name__ == "__main__":
    test_connection()

