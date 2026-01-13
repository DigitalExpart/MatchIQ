"""
Compute and store embeddings for all templates in database.
Run this script whenever you add new templates or update existing ones.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sentence_transformers import SentenceTransformer
import numpy as np
from app.database import get_supabase_client

def compute_embeddings():
    """Compute embeddings for all templates and store in database."""
    print("Loading sentence-transformers model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("Connecting to database...")
    supabase = get_supabase_client()
    
    print("Fetching templates...")
    response = supabase.table("amora_templates").select("*").execute()
    templates = response.data
    
    print(f"Found {len(templates)} templates")
    
    for i, template in enumerate(templates, 1):
        template_id = template['id']
        example_questions = template['example_questions']
        
        if not example_questions:
            print(f"  [{i}/{len(templates)}] Skipping template {template_id} - no example questions")
            continue
        
        # Compute embeddings for all example questions
        embeddings = [model.encode(q) for q in example_questions]
        
        # Average embeddings to get single representative embedding
        avg_embedding = np.mean(embeddings, axis=0)
        
        # Store in database
        supabase.table("amora_templates") \
            .update({"embedding": avg_embedding.tolist()}) \
            .eq("id", template_id) \
            .execute()
        
        print(f"  [{i}/{len(templates)}] Updated embedding for template {template_id} ({template['category']})")
    
    print("\n✅ All embeddings computed and stored!")

if __name__ == "__main__":
    compute_embeddings()
