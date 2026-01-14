"""
Diagnostic script to check Amora Enhanced Service configuration.
Run this to understand why Amora might be giving generic responses.

Usage:
    python backend/scripts/diagnose_amora.py
"""
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

def main():
    print("=" * 70)
    print(" AMORA ENHANCED SERVICE DIAGNOSTIC")
    print("=" * 70)
    
    # Check environment variables
    print("\n[1] ENVIRONMENT VARIABLES")
    print("-" * 70)
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if supabase_url:
        print(f"✅ SUPABASE_URL: {supabase_url}")
    else:
        print("❌ SUPABASE_URL: NOT SET")
        print("   Please add to .env file")
        return
    
    if supabase_key:
        print(f"✅ SUPABASE_SERVICE_KEY: {'*' * 20}...{supabase_key[-4:]}")
    else:
        print("❌ SUPABASE_SERVICE_KEY: NOT SET")
        print("   Please add to .env file")
        return
    
    # Connect to database
    print("\n[2] DATABASE CONNECTION")
    print("-" * 70)
    try:
        supabase = create_client(supabase_url, supabase_key)
        print("✅ Connected to Supabase")
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        return
    
    # Check if amora_templates table exists
    print("\n[3] AMORA_TEMPLATES TABLE")
    print("-" * 70)
    try:
        response = supabase.table("amora_templates").select("*").limit(1).execute()
        print("✅ Table exists")
    except Exception as e:
        print(f"❌ Table doesn't exist or can't be accessed: {e}")
        print("\n   SOLUTION: Run this SQL in Supabase SQL Editor:")
        print("   backend/migrations/002_amora_templates.sql")
        print("   OR: RUN_THIS_IN_SUPABASE.sql")
        return
    
    # Check template count
    print("\n[4] TEMPLATE COUNT")
    print("-" * 70)
    try:
        response = supabase.table("amora_templates").select("*", count="exact").execute()
        total_count = response.count
        
        if total_count == 0:
            print("❌ No templates found in database")
            print("\n   SOLUTION: Run this SQL in Supabase SQL Editor:")
            print("   backend/migrations/002_amora_templates.sql")
            print("   This will insert 8 initial templates")
            return
        else:
            print(f"✅ Found {total_count} template(s)")
    except Exception as e:
        print(f"❌ Error counting templates: {e}")
        return
    
    # Check templates by confidence level
    print("\n[5] TEMPLATES BY CONFIDENCE LEVEL")
    print("-" * 70)
    for level in ["LOW", "MEDIUM", "HIGH"]:
        try:
            response = supabase.table("amora_templates") \
                .select("category", count="exact") \
                .eq("confidence_level", level) \
                .eq("active", True) \
                .execute()
            print(f"   {level:8s}: {response.count:2d} templates")
        except Exception as e:
            print(f"   {level:8s}: Error - {e}")
    
    # Check embeddings status
    print("\n[6] EMBEDDINGS STATUS")
    print("-" * 70)
    try:
        # Templates with embeddings
        with_embeddings = supabase.table("amora_templates") \
            .select("id", count="exact") \
            .not_.is_("embedding", "null") \
            .execute()
        
        # Templates without embeddings
        without_embeddings = supabase.table("amora_templates") \
            .select("category, confidence_level") \
            .is_("embedding", "null") \
            .execute()
        
        print(f"   With embeddings:    {with_embeddings.count}")
        print(f"   Without embeddings: {len(without_embeddings.data)}")
        
        if len(without_embeddings.data) > 0:
            print("\n   ⚠️  WARNING: Some templates are missing embeddings!")
            print("   Templates without embeddings:")
            for t in without_embeddings.data:
                print(f"      - {t['category']} ({t['confidence_level']})")
            print("\n   SOLUTION: Run this command:")
            print("   python backend/scripts/add_template_embeddings.py")
        else:
            print("   ✅ All templates have embeddings")
    except Exception as e:
        print(f"   ❌ Error checking embeddings: {e}")
    
    # Check vector extension
    print("\n[7] POSTGRESQL VECTOR EXTENSION")
    print("-" * 70)
    try:
        # Try to query using vector similarity (this will fail if extension not installed)
        response = supabase.rpc("check_vector_extension").execute()
        print("✅ Vector extension is installed")
    except Exception as e:
        # This is expected - RPC doesn't exist, but we can check another way
        try:
            # Check if we can query embeddings (if vector extension works)
            response = supabase.table("amora_templates") \
                .select("embedding") \
                .not_.is_("embedding", "null") \
                .limit(1) \
                .execute()
            
            if response.data and response.data[0].get("embedding"):
                print("✅ Vector extension appears to be working")
                print(f"   Sample embedding dimension: {len(response.data[0]['embedding'])}")
            else:
                print("⚠️  Cannot verify vector extension (no embeddings to test)")
        except Exception as e2:
            print(f"❌ Vector extension may not be installed: {e2}")
            print("\n   SOLUTION: Run this SQL in Supabase SQL Editor:")
            print("   CREATE EXTENSION IF NOT EXISTS vector;")
    
    # List all templates
    print("\n[8] TEMPLATE DETAILS")
    print("-" * 70)
    try:
        response = supabase.table("amora_templates") \
            .select("category, confidence_level, priority, active, embedding") \
            .order("priority", desc=True) \
            .execute()
        
        print(f"{'Category':<25} {'Level':<10} {'Priority':>8} {'Active':>7} {'Embedding':>10}")
        print("-" * 70)
        
        for t in response.data:
            has_embedding = "✅ Yes" if t.get("embedding") else "❌ No"
            active_status = "✅" if t["active"] else "❌"
            print(f"{t['category']:<25} {t['confidence_level']:<10} {t['priority']:>8} {active_status:>7} {has_embedding:>10}")
    except Exception as e:
        print(f"❌ Error listing templates: {e}")
    
    # Test the embedding model
    print("\n[9] SENTENCE-TRANSFORMERS MODEL")
    print("-" * 70)
    try:
        from sentence_transformers import SentenceTransformer
        print("✅ sentence-transformers library is installed")
        
        try:
            model = SentenceTransformer('all-MiniLM-L6-v2')
            print("✅ Model 'all-MiniLM-L6-v2' loaded successfully")
            
            # Test embedding generation
            test_text = "How do I know if I'm in love?"
            embedding = model.encode(test_text)
            print(f"✅ Generated test embedding (dimension: {len(embedding)})")
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            print("\n   SOLUTION: Install sentence-transformers:")
            print("   pip install sentence-transformers")
    except ImportError:
        print("❌ sentence-transformers library not installed")
        print("\n   SOLUTION: Install sentence-transformers:")
        print("   pip install sentence-transformers")
    
    # Final summary
    print("\n" + "=" * 70)
    print(" SUMMARY & RECOMMENDATIONS")
    print("=" * 70)
    
    # Determine overall status
    has_table = True
    has_templates = total_count > 0
    has_embeddings = with_embeddings.count == total_count
    
    if has_table and has_templates and has_embeddings:
        print("\n✅ EVERYTHING LOOKS GOOD!")
        print("   Your Amora Enhanced Service should be working correctly.")
        print("\n   If you're still getting generic responses, check:")
        print("   1. Is the correct endpoint being called? (/api/v1/coach/)")
        print("   2. Are you using coach_enhanced router in main.py?")
        print("   3. Check backend logs for errors")
    else:
        print("\n⚠️  ISSUES DETECTED - Action Required:")
        
        if not has_table:
            print("\n   1. Create amora_templates table:")
            print("      Run: backend/migrations/002_amora_templates.sql")
        
        if not has_templates:
            print("\n   2. Insert initial templates:")
            print("      Run: backend/migrations/002_amora_templates.sql")
            print("      OR:  RUN_THIS_IN_SUPABASE.sql")
        
        if not has_embeddings:
            print("\n   3. Compute embeddings:")
            print("      Run: python backend/scripts/add_template_embeddings.py")
    
    print("\n" + "=" * 70)

if __name__ == "__main__":
    main()
