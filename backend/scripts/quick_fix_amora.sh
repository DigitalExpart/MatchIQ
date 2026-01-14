#!/bin/bash

# Quick fix script for Amora generic responses issue
# This runs all diagnostic and fix steps in order

echo "=========================================="
echo " AMORA QUICK FIX SCRIPT"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "backend/scripts/diagnose_amora.py" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Step 1: Run diagnostic
echo "[Step 1/3] Running diagnostic..."
echo ""
python backend/scripts/diagnose_amora.py

echo ""
echo "------------------------------------------"
echo ""

# Step 2: Check if templates exist
echo "[Step 2/3] Checking template status..."
echo ""

# This will be determined by the diagnostic output
# For now, we'll prompt the user

read -p "Did the diagnostic show 'No templates found'? (y/n): " no_templates

if [ "$no_templates" = "y" ]; then
    echo ""
    echo "⚠️  You need to run SQL migrations in Supabase first:"
    echo "   1. Open Supabase SQL Editor"
    echo "   2. Run: backend/migrations/002_amora_templates.sql"
    echo "   3. Run: backend/migrations/004_add_common_question_templates.sql"
    echo ""
    read -p "Have you run the SQL migrations? (y/n): " ran_migrations
    
    if [ "$ran_migrations" != "y" ]; then
        echo "❌ Please run the SQL migrations first, then run this script again"
        exit 1
    fi
fi

# Step 3: Compute embeddings
echo "[Step 3/3] Computing embeddings..."
echo ""

read -p "Do templates need embeddings computed? (y/n): " need_embeddings

if [ "$need_embeddings" = "y" ]; then
    echo ""
    python backend/scripts/add_template_embeddings.py
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Embeddings computed successfully!"
    else
        echo ""
        echo "❌ Error computing embeddings"
        exit 1
    fi
fi

# Final verification
echo ""
echo "=========================================="
echo " FINAL VERIFICATION"
echo "=========================================="
echo ""

python backend/scripts/diagnose_amora.py

echo ""
echo "=========================================="
echo " DONE!"
echo "=========================================="
echo ""
echo "If all checks passed above, your Amora Enhanced Service"
echo "should now be working correctly."
echo ""
echo "Test it with:"
echo "  - Visit your frontend and ask: 'How does my past affect my present relationships?'"
echo "  - Or use curl:"
echo "    curl -X POST http://localhost:8000/api/v1/coach/ \\"
echo "      -H 'Content-Type: application/json' \\"
echo "      -d '{\"mode\": \"LEARN\", \"specific_question\": \"My love life is a mess\"}'"
echo ""
