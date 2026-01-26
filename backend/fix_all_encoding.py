#!/usr/bin/env python3
"""
Fix encoding for all Python files from UTF-16 to UTF-8.
This script runs during Render deployment to fix encoding issues caused by Git on Windows.
"""
import sys
import os
import glob

def fix_file_encoding(file_path):
    """Fix a single file's encoding from UTF-16 to UTF-8 if needed."""
    if not os.path.exists(file_path):
        print(f"Warning: {file_path} not found")
        return True
    
    # Read file as binary
    with open(file_path, 'rb') as f:
        content = f.read()
    
    original_size = len(content)
    
    # Check if file is likely UTF-16 (typically ~2x the UTF-8 size)
    # Also check for null bytes which indicate UTF-16
    has_null_bytes = b'\x00' in content
    
    # If file has null bytes or is suspiciously large, it's likely UTF-16
    if has_null_bytes or original_size > 5000:
        print(f"Detected encoding issue in {file_path} (size: {original_size} bytes, has null bytes: {has_null_bytes})")
        
        try:
            # Try UTF-16 LE (most common on Windows)
            if content[:2] == b'\xff\xfe':
                # UTF-16 LE with BOM
                text = content[2:].decode('utf-16-le')
            elif content[:2] == b'\xfe\xff':
                # UTF-16 BE with BOM
                text = content[2:].decode('utf-16-be')
            else:
                # Try UTF-16 LE without BOM
                try:
                    text = content.decode('utf-16-le')
                except UnicodeDecodeError:
                    # Try UTF-16 BE
                    try:
                        text = content.decode('utf-16-be')
                    except UnicodeDecodeError:
                        # If it's not UTF-16, check if it's valid UTF-8
                        try:
                            content.decode('utf-8')
                            print(f"  File is already UTF-8, skipping")
                            return True
                        except UnicodeDecodeError:
                            raise ValueError("File is neither UTF-8 nor UTF-16")
            
            # Write as UTF-8
            with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
                f.write(text)
            
            # Verify
            with open(file_path, 'rb') as f:
                new_content = f.read()
            new_size = len(new_content)
            print(f"  [OK] Successfully converted to UTF-8 (new size: {new_size} bytes)")
            return True
            
        except Exception as e:
            print(f"  [ERROR] Error converting {file_path}: {e}")
            return False
    else:
        # Check if it's valid UTF-8
        try:
            content.decode('utf-8')
            # File is already UTF-8 and reasonable size
            return True
        except UnicodeDecodeError:
            print(f"File {file_path} is not valid UTF-8, attempting conversion...")
            # Try to convert anyway
            try:
                if content[:2] == b'\xff\xfe':
                    text = content[2:].decode('utf-16-le')
                elif content[:2] == b'\xfe\xff':
                    text = content[2:].decode('utf-16-be')
                else:
                    text = content.decode('utf-16-le')
                with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
                    f.write(text)
                print(f"  ✓ Successfully converted to UTF-8")
                return True
            except Exception as e:
                print(f"  ✗ Error: {e}")
                return False


def fix_all_python_files():
    """Fix encoding for all Python files in the app directory."""
    print("Checking Python files for encoding issues...")
    
    # Find all Python files
    python_files = []
    for root, dirs, files in os.walk('app'):
        for file in files:
            if file.endswith('.py'):
                python_files.append(os.path.join(root, file))
    
    if not python_files:
        print("No Python files found in app directory")
        return False
    
    print(f"Found {len(python_files)} Python files to check")
    
    success_count = 0
    failed_files = []
    
    for file_path in python_files:
        if fix_file_encoding(file_path):
            success_count += 1
        else:
            failed_files.append(file_path)
    
    print(f"\nSummary: {success_count}/{len(python_files)} files processed successfully")
    
    if failed_files:
        print(f"Failed files: {', '.join(failed_files)}")
        return False
    
    return True


if __name__ == '__main__':
    # Change to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    success = fix_all_python_files()
    sys.exit(0 if success else 1)
