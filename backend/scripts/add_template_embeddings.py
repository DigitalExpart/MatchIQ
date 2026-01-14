"""
Add embeddings to new templates that don't have them yet.
Run this after adding new templates to the database.

Usage:
    python backend/scripts/add_template_embeddings.py [--force]
    
    --force: Recompute embeddings for ALL templates (even those that already have them)
"""
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sentence_transformers import SentenceTransformer
from supabase import create_client
from dotenv import load_dotenv
import numpy as np

load_dotenv()

def main():
    # Check for --force flag
    force_recompute = "--force" in sys.argv
    
    # Initialize
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not supabase_url or not supabase_key:
        print("[ERROR] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY")
        print("[INFO] Make sure you have a .env file with these variables:")
        print("   SUPABASE_URL=https://your-project.supabase.co")
        print("   SUPABASE_SERVICE_KEY=your-service-key")
        return
    
    print("[INFO] Connecting to Supabase...")
    supabase = create_client(supabase_url, supabase_key)
    
    print("[INFO] Loading sentence-transformers model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    if force_recompute:
        print("[INFO] --force flag detected: Will recompute ALL template embeddings")
        # Get ALL templates
        response = supabase.table("amora_templates") \
            .select("*") \
            .execute()
    else:
        print("[INFO] Fetching templates without embeddings...")
        # Get templates that don't have embeddings
        response = supabase.table("amora_templates") \
            .select("*") \
            .is_("embedding", "null") \
            .execute()
    
    templates = response.data
    
    if not templates:
        print("[SUCCESS] All templates already have embeddings!")
        print("[INFO] Use --force flag to recompute existing embeddings")
        return
    
    print(f"[INFO] Found {len(templates)} template(s) to process")
    print("=" * 60)
    
    success_count = 0
    error_count = 0
    
    for i, template in enumerate(templates, 1):
        template_id = template["id"]
        category = template["category"]
        confidence_level = template["confidence_level"]
        priority = template["priority"]
        example_questions = template["example_questions"]
        
        print(f"\n[{i}/{len(templates)}] Processing: {category} ({confidence_level}, priority={priority})")
        print(f"   ID: {template_id}")
        
        if not example_questions or len(example_questions) == 0:
            print(f"   [WARNING] No example questions found, skipping...")
            error_count += 1
            continue
        
        print(f"   Examples ({len(example_questions)}): {example_questions[:2]}...")
        
        try:
            # Combine example questions for embedding
            combined_text = " ".join(example_questions)
            
            # Generate embedding
            embedding = model.encode(combined_text)
            embedding_list = embedding.tolist()
            
            # Update template with embedding
            supabase.table("amora_templates") \
                .update({"embedding": embedding_list}) \
                .eq("id", template_id) \
                .execute()
            
            print(f"   [SUCCESS] Added embedding (dim: {len(embedding_list)})")
            success_count += 1
            
        except Exception as e:
            print(f"   [ERROR] Failed to process template: {e}")
            error_count += 1
    
    print("\n" + "=" * 60)
    print(f"[COMPLETE] Processed {len(templates)} template(s)")
    print(f"   ✅ Success: {success_count}")
    if error_count > 0:
        print(f"   ❌ Errors: {error_count}")
    
    # Verify embeddings were added
    print("\n[INFO] Verifying embeddings in database...")
    verify_response = supabase.table("amora_templates") \
        .select("category, confidence_level, priority") \
        .not_.is_("embedding", "null") \
        .execute()
    
    print(f"[INFO] Templates with embeddings: {len(verify_response.data)}")
    
    # Check for any templates still missing embeddings
    missing_response = supabase.table("amora_templates") \
        .select("category, confidence_level") \
        .is_("embedding", "null") \
        .execute()
    
    if missing_response.data:
        print(f"[WARNING] {len(missing_response.data)} template(s) still missing embeddings:")
        for t in missing_response.data:
            print(f"   - {t['category']} ({t['confidence_level']})")
    else:
        print("[SUCCESS] ✅ All templates now have embeddings!")

if __name__ == "__main__":
    main()
