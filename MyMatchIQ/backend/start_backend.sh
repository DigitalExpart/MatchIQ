#!/bin/bash
echo "Starting MyMatchIQ Backend Server..."
echo ""
cd "$(dirname "$0")"
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

