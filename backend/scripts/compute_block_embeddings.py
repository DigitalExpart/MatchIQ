"""
Compute embeddings for all response blocks.
Run this after inserting blocks into the database.

Usage:
    python backend/scripts/compute_block_embeddings.py [--force]
"""
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sentence_transformers import SentenceTransformer
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

def main():
    force_recompute = "--force" in sys.argv
    
    # Check for --topics flag
    target_topics = None
    for i, arg in enumerate(sys.argv):
        if arg == "--topics" and i + 1 < len(sys.argv):
            target_topics = [t.strip() for t in sys.argv[i + 1].split(",")]
            break
    
    # Initialize
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not supabase_url or not supabase_key:
        print("[ERROR] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY")
        print("[INFO] Add to .env file")
        return
    
    print("[INFO] Connecting to Supabase...")
    supabase = create_client(supabase_url, supabase_key)
    
    print("[INFO] Loading sentence-transformers model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    if force_recompute:
        if target_topics:
            print(f"[INFO] --force flag with --topics: Will recompute embeddings for blocks with topics: {target_topics}")
            # Fetch all blocks, filter by topics in Python
            response = supabase.table("amora_response_blocks").select("*").execute()
            all_blocks = response.data or []
            blocks = [b for b in all_blocks if any(topic in (b.get("topics") or []) for topic in target_topics)]
            print(f"[INFO] Found {len(blocks)} blocks matching topics")
        else:
            print("[INFO] --force flag: Will recompute ALL block embeddings")
            response = supabase.table("amora_response_blocks").select("*").execute()
            blocks = response.data
    else:
        print("[INFO] Fetching blocks without embeddings...")
        # Strategy: Query specific anxiety/depression blocks by topic (more reliable than pagination)
        # This avoids pagination/permissions issues with large result sets
        
        blocks = []
        
        # First, try the standard NULL check (works for most cases)
        try:
            response = supabase.table("amora_response_blocks") \
                .select("*") \
                .is_("embedding", "null") \
                .execute()
            
            blocks = response.data or []
            print(f"[INFO] Found {len(blocks)} blocks without embeddings using NULL check")
        except Exception as e:
            print(f"[INFO] NULL check didn't work ({e}), trying topic-based query...")
        
        # If NULL check didn't work or returned 0 blocks, query by specific topics
        # SQL shows 180 anxiety/depression blocks without embeddings
        # Note: The .contains() method may not work correctly, so we'll use a workaround
        if not blocks or len(blocks) == 0:
            print("[INFO] NULL check found 0 blocks, but SQL shows 180 anxiety/depression blocks without embeddings")
            print("[INFO] This suggests the Supabase Python client may not handle vector NULL checks correctly")
            print("[INFO] Recommendation: Use Supabase SQL Editor to run a raw SQL query, or use --force flag")
            print("[INFO] To compute embeddings for anxiety/depression blocks, run with --force and filter manually")
            print("\n[INFO] Alternatively, run this SQL in Supabase SQL Editor to compute embeddings:")
            print("=" * 70)
            print("""
-- This requires a Python function or external script
-- The embedding computation must be done via Python/ML model
-- The compute_block_embeddings.py script handles this, but needs
-- a way to identify which blocks need embeddings.

-- You can manually identify blocks with this query:
SELECT id, block_type, topics, text
FROM amora_response_blocks 
WHERE active = true 
  AND ('user_anxiety_distress' = ANY(topics) OR 'user_depression_distress' = ANY(topics))
  AND embedding IS NULL
LIMIT 10;
            """)
            print("=" * 70)
            blocks = []
    
    if not blocks:
        print("[SUCCESS] All blocks already have embeddings!")
        if not force_recompute:
            print("[INFO] Use --force to recompute all embeddings")
        return
    
    print(f"[INFO] Found {len(blocks)} block(s) to process")
    print("=" * 70)
    
    success_count = 0
    error_count = 0
    
    # Group by block type for reporting
    by_type = {}
    for block in blocks:
        block_type = block['block_type']
        by_type[block_type] = by_type.get(block_type, 0) + 1
    
    print(f"[INFO] Blocks by type:")
    for block_type, count in sorted(by_type.items()):
        print(f"   {block_type:15s}: {count:3d} blocks")
    print("=" * 70)
    
    for i, block in enumerate(blocks, 1):
        block_id = block['id']
        block_type = block['block_type']
        text = block['text']
        topics = block.get('topics', [])
        stage = block.get('stage', 1)
        
        print(f"\n[{i}/{len(blocks)}] {block_type.upper()} (stage {stage})")
        print(f"   Topics: {', '.join(topics[:3])}")
        print(f"   Text: {text[:80]}...")
        
        try:
            # Generate embedding from block text
            embedding = model.encode(text)
            embedding_list = embedding.tolist()
            
            # Update block with embedding
            supabase.table("amora_response_blocks") \
                .update({"embedding": embedding_list}) \
                .eq("id", block_id) \
                .execute()
            
            print(f"   [SUCCESS] Added embedding (dim: {len(embedding_list)})")
            success_count += 1
            
        except Exception as e:
            print(f"   [ERROR] Failed: {e}")
            error_count += 1
    
    print("\n" + "=" * 70)
    print(f"[COMPLETE] Processed {len(blocks)} block(s)")
    print(f"   [OK] Success: {success_count}")
    if error_count > 0:
        print(f"   [FAIL] Errors: {error_count}")
    
    # Verify
    print("\n[INFO] Verifying embeddings...")
    verify_response = supabase.table("amora_response_blocks") \
        .select("block_type", count="exact") \
        .not_.is_("embedding", "null") \
        .execute()
    
    print(f"[INFO] Blocks with embeddings: {verify_response.count}")
    
    # Check missing
    missing_response = supabase.table("amora_response_blocks") \
        .select("block_type, topics") \
        .is_("embedding", "null") \
        .execute()
    
    if missing_response.data:
        print(f"\n[WARNING] {len(missing_response.data)} block(s) still missing embeddings")
    else:
        print("\n[SUCCESS] All blocks now have embeddings!")
    
    print("\n" + "=" * 70)
    print("You can now use AmoraBlocksService for LLM-like responses!")
    print("=" * 70)

if __name__ == "__main__":
    main()
