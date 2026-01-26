# Encoding Fix for Render Deployment

## Problem

Git on Windows sometimes stores Python files as UTF-16 instead of UTF-8, which causes errors on Render:
- "source code string cannot contain null bytes"
- Files are ~2x their expected size
- Python cannot parse UTF-16 encoded source files

## Solution

A build script (`fix_all_encoding.py`) automatically converts all Python files from UTF-16 to UTF-8 during Render deployment.

## How It Works

1. The script scans all `.py` files in the `app/` directory
2. Detects UTF-16 encoding by checking for:
   - Null bytes (`\x00`) in the file
   - File size larger than expected
3. Converts UTF-16 (LE or BE, with or without BOM) to UTF-8
4. Writes files back as UTF-8 with LF line endings

## Integration

The script is automatically run during Render builds via `render.yaml`:

```yaml
buildCommand: pip install -r requirements.txt && python fix_all_encoding.py
```

## Manual Usage

If you need to run it manually:

```bash
cd backend
python fix_all_encoding.py
```

Or using the shell script:

```bash
cd backend
chmod +x fix_all_encoding.sh
./fix_all_encoding.sh
```

## Files Affected

The script checks and fixes all Python files in:
- `app/**/*.py`

Common files that may be affected:
- `app/models/pydantic_models.py`
- `app/services/amora_enhanced_service.py`
- Any other Python files stored as UTF-16 in Git

## Verification

After deployment, check Render logs for:
- "Successfully converted to UTF-8" messages
- File size reductions (UTF-16 files are ~2x UTF-8 size)

## Prevention

The `.gitattributes` file is configured to ensure Python files are stored as text with LF endings:
```
*.py text eol=lf
backend/**/*.py text eol=lf
```

However, Git on Windows may still convert files to UTF-16 in some cases, so the build script provides a safety net.
