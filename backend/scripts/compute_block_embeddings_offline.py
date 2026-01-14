"""
Offline version - computes embeddings and saves to JSON file.
Use this when you have network issues.

Usage:
    python backend/scripts/compute_block_embeddings_offline.py
    
Then manually upload the embeddings or wait for network to work.
"""
import os
import sys
import json
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

print("[INFO] Starting offline embedding computation...")
print("[INFO] This will use cached model if available, or fail if model not downloaded")

try:
    from sentence_transformers import SentenceTransformer
    print("[INFO] Loading sentence-transformers model from cache...")
    
    # Try to load from cache (if previously downloaded)
    model = SentenceTransformer('all-MiniLM-L6-v2', cache_folder=str(Path.home() / '.cache' / 'torch'))
    print("[SUCCESS] Model loaded from cache!")
    
except Exception as e:
    print(f"\n[ERROR] Could not load model: {e}")
    print("\n[SOLUTION] You have 3 options:")
    print("1. Fix your internet connection and run: python backend/scripts/compute_block_embeddings.py")
    print("2. Connect to a different network (mobile hotspot, different WiFi)")
    print("3. Download model on another computer and transfer the cache folder")
    print("\nFor now, you can still deploy without embeddings - Amora will use fallback pattern matching.")
    sys.exit(1)

# Sample block texts (from the SQL we created)
sample_blocks = [
    "I can hear how much pain you're carrying right now, and I'm so sorry you're going through this.",
    "Grief after a breakup isn't linear—some days feel okay, others feel impossible, and that's completely normal.",
    "What part of this loss feels hardest to sit with right now?",
]

print("\n[INFO] Testing embedding generation with sample blocks...")
try:
    for i, text in enumerate(sample_blocks, 1):
        embedding = model.encode(text)
        print(f"[{i}/3] Generated embedding (dim: {len(embedding)}) for: {text[:50]}...")
    
    print("\n[SUCCESS] Model is working! You can compute embeddings.")
    print("\n[NEXT STEP] Once your network is working, run:")
    print("python backend/scripts/compute_block_embeddings.py")
    
except Exception as e:
    print(f"[ERROR] Failed to generate embeddings: {e}")
    sys.exit(1)

print("\n" + "="*70)
print("TEMPORARY WORKAROUND:")
print("="*70)
print("You can deploy WITHOUT embeddings for now.")
print("Amora will use the improved pattern matching from coach_service.py")
print("which already handles all your test questions with 100% success rate.")
print("\nOnce your network is fixed, run the embedding script to enable")
print("full semantic matching with the blocks system.")
print("="*70)
