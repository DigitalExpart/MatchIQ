#!/bin/bash
# Fix pydantic_models.py encoding from UTF-16 to UTF-8
# This script runs during Render deployment

FILE="app/models/pydantic_models.py"

if [ -f "$FILE" ]; then
    # Check if file is UTF-16 (has BOM or is ~2x expected size)
    SIZE=$(wc -c < "$FILE")
    if [ "$SIZE" -gt 10000 ]; then
        echo "Converting $FILE from UTF-16 to UTF-8 (size: $SIZE bytes)"
        # Convert UTF-16 LE to UTF-8
        python3 -c "
import sys
try:
    with open('$FILE', 'rb') as f:
        content = f.read()
    # Try UTF-16 LE first
    try:
        text = content.decode('utf-16-le')
    except:
        # Try UTF-16 BE
        try:
            text = content.decode('utf-16-be')
        except:
            # Try UTF-16 with BOM
            if content[:2] == b'\\xff\\xfe':
                text = content[2:].decode('utf-16-le')
            elif content[:2] == b'\\xfe\\xff':
                text = content[2:].decode('utf-16-be')
            else:
                raise ValueError('Not UTF-16')
    # Write as UTF-8
    with open('$FILE', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Successfully converted $FILE to UTF-8')
except Exception as e:
    print(f'Error converting $FILE: {e}')
    sys.exit(1)
"
    else
        echo "$FILE is already UTF-8 (size: $SIZE bytes)"
    fi
else
    echo "Warning: $FILE not found"
fi
