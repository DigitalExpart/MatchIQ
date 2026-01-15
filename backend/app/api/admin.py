"""
Admin endpoints for maintenance tasks.
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import logging
import sys
from pathlib import Path

# Add backend to path for script imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

router = APIRouter(prefix="/admin", tags=["admin"])
logger = logging.getLogger(__name__)


@router.post("/compute-embeddings")
async def compute_embeddings() -> Dict[str, Any]:
    """
    Compute embeddings for all blocks without embeddings.
    
    This is a one-time operation to populate embeddings after migration.
    Safe to call multiple times - only processes blocks without embeddings.
    """
    try:
        from app.database import get_supabase_client
        from app.services.amora_enhanced_service import get_embedding_model
        import numpy as np
        
        logger.info("Starting embedding computation...")
        
        # Initialize
        supabase = get_supabase_client()
        model = get_embedding_model()
        
        # Fetch blocks without embeddings
        response = supabase.table('amora_response_blocks') \
            .select('id, text') \
            .is_('embedding', 'null') \
            .eq('active', True) \
            .execute()
        
        blocks = response.data
        total = len(blocks)
        
        if total == 0:
            return {
                "status": "success",
                "message": "All blocks already have embeddings!",
                "processed": 0,
                "total": 0
            }
        
        logger.info(f"Found {total} blocks to process")
        
        # Process in batches
        batch_size = 10
        processed = 0
        
        for i in range(0, total, batch_size):
            batch = blocks[i:i+batch_size]
            logger.info(f"Processing batch {i//batch_size + 1}/{(total + batch_size - 1)//batch_size}")
            
            for block in batch:
                try:
                    # Compute embedding
                    embedding = model.encode(block['text'])
                    embedding_list = embedding.tolist()
                    
                    # Update database
                    supabase.table('amora_response_blocks') \
                        .update({'embedding': embedding_list}) \
                        .eq('id', block['id']) \
                        .execute()
                    
                    processed += 1
                    
                except Exception as e:
                    logger.error(f"Error processing block {block['id']}: {e}")
                    continue
        
        logger.info(f"Successfully computed embeddings for {processed}/{total} blocks")
        
        return {
            "status": "success",
            "message": f"Computed embeddings for {processed} blocks",
            "processed": processed,
            "total": total,
            "success_rate": f"{(processed/total*100):.1f}%"
        }
        
    except Exception as e:
        logger.error(f"Error in compute_embeddings: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to compute embeddings: {str(e)}"
        )


@router.get("/blocks-status")
async def blocks_status() -> Dict[str, Any]:
    """Check status of blocks and embeddings."""
    try:
        from app.database import get_supabase_client
        
        supabase = get_supabase_client()
        
        # Count total blocks
        total_response = supabase.table('amora_response_blocks') \
            .select('id', count='exact') \
            .eq('active', True) \
            .execute()
        
        # Count blocks with embeddings
        with_embeddings_response = supabase.table('amora_response_blocks') \
            .select('id', count='exact') \
            .not_.is_('embedding', 'null') \
            .eq('active', True) \
            .execute()
        
        total = total_response.count if hasattr(total_response, 'count') else 0
        with_embeddings = with_embeddings_response.count if hasattr(with_embeddings_response, 'count') else 0
        without_embeddings = total - with_embeddings
        
        return {
            "total_blocks": total,
            "with_embeddings": with_embeddings,
            "without_embeddings": without_embeddings,
            "percentage_complete": f"{(with_embeddings/total*100):.1f}%" if total > 0 else "0%",
            "ready": without_embeddings == 0
        }
        
    except Exception as e:
        logger.error(f"Error in blocks_status: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to check blocks status: {str(e)}"
        )
