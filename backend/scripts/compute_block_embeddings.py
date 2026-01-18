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
        print("[INFO] --force flag: Will recompute ALL block embeddings")
        response = supabase.table("amora_response_blocks").select("*").execute()
        blocks = response.data
    else:
        print("[INFO] Fetching all blocks to check for missing embeddings...")
        # Fetch all active blocks with pagination (Supabase returns max 1000 per page)
        all_blocks = []
        page_size = 1000
        offset = 0
        
        while True:
            response = supabase.table("amora_response_blocks") \
                .select("*") \
                .range(offset, offset + page_size - 1) \
                .execute()
            
            page_blocks = response.data or []
            if not page_blocks:
                break
            
            all_blocks.extend(page_blocks)
            print(f"[INFO] Fetched {len(page_blocks)} blocks (total so far: {len(all_blocks)})")
            
            if len(page_blocks) < page_size:
                break  # Last page
            
            offset += page_size
        
        # Filter for blocks without embeddings (None, empty list, or not a list)
        blocks = []
        for b in all_blocks:
            embedding = b.get("embedding")
            # Check if embedding is None, empty list, or not properly set
            if embedding is None or (isinstance(embedding, list) and len(embedding) == 0):
                blocks.append(b)
        
        print(f"[INFO] Found {len(blocks)} blocks without embeddings out of {len(all_blocks)} total blocks")
    
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
