#!/usr/bin/env python3
"""
Fix pydantic_models.py encoding from UTF-16 to UTF-8.
This script is run during Render deployment to fix encoding issues.
"""
import sys
import os

FILE_PATH = 'app/models/pydantic_models.py'

def fix_encoding():
    if not os.path.exists(FILE_PATH):
        print(f"Warning: {FILE_PATH} not found")
        return True
    
    # Read file as binary
    with open(FILE_PATH, 'rb') as f:
        content = f.read()
    
    size = len(content)
    print(f"File size: {size} bytes")
    
    # If file is larger than 6000 bytes, it's likely UTF-16
    if size > 6000:
        print(f"Detected UTF-16 encoding (size: {size} bytes), converting to UTF-8...")
        
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
                    text = content.decode('utf-16-be')
            
            # Write as UTF-8
            with open(FILE_PATH, 'w', encoding='utf-8') as f:
                f.write(text)
            
            # Verify
            with open(FILE_PATH, 'rb') as f:
                new_content = f.read()
            new_size = len(new_content)
            print(f"Successfully converted to UTF-8 (new size: {new_size} bytes)")
            return True
            
        except Exception as e:
            print(f"Error converting file: {e}")
            return False
    else:
        # Check if it's valid UTF-8
        try:
            content.decode('utf-8')
            print(f"File is already UTF-8 (size: {size} bytes)")
            return True
        except UnicodeDecodeError:
            print(f"File is not valid UTF-8, attempting conversion...")
            # Try to convert anyway
            try:
                text = content.decode('utf-16-le')
                with open(FILE_PATH, 'w', encoding='utf-8') as f:
                    f.write(text)
                print("Successfully converted to UTF-8")
                return True
            except Exception as e:
                print(f"Error: {e}")
                return False

if __name__ == '__main__':
    success = fix_encoding()
    sys.exit(0 if success else 1)
