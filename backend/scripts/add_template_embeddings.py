"""
Add embeddings to new templates that don't have them yet.
Run this after adding new templates to the database.
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
    # Initialize
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY")
        return
    
    supabase = create_client(supabase_url, supabase_key)
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("🔍 Fetching templates without embeddings...")
    
    # Get templates that don't have embeddings
    response = supabase.table("amora_templates") \
        .select("*") \
        .is_("embedding", "null") \
        .execute()
    
    templates = response.data
    
    if not templates:
        print("✅ All templates already have embeddings!")
        return
    
    print(f"📝 Found {len(templates)} templates needing embeddings")
    
    for template in templates:
        template_id = template["id"]
        category = template["category"]
        example_questions = template["example_questions"]
        
        print(f"\n🔄 Processing: {category}")
        print(f"   Examples: {example_questions[:2]}...")
        
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
        
        print(f"   ✅ Added embedding (dim: {len(embedding_list)})")
    
    print(f"\n🎉 Successfully added embeddings to {len(templates)} templates!")

if __name__ == "__main__":
    main()
