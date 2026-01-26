#!/bin/bash
# Fix encoding for all Python files from UTF-16 to UTF-8
# This script runs during Render deployment to fix encoding issues

set -e  # Exit on error

echo "Checking Python files for encoding issues..."

# Run the Python script
python3 fix_all_encoding.py

echo "Encoding fix completed"
