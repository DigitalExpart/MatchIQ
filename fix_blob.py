import subprocess
import sys
import os

file_path = 'backend/app/models/pydantic_models.py'

# Read file as binary
with open(file_path, 'rb') as f:
    content = f.read()

print(f"File size: {len(content)} bytes")
print(f"First 20 bytes: {content[:20]}")

# Verify UTF-8
try:
    text = content.decode('utf-8')
    print("File is valid UTF-8")
except UnicodeDecodeError:
    print("ERROR: File is not UTF-8!")
    sys.exit(1)

# Write blob directly using git hash-object with stdin
process = subprocess.Popen(
    ['git', 'hash-object', '-w', '--stdin'],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    cwd=os.getcwd()
)

stdout, stderr = process.communicate(input=content)

if process.returncode != 0:
    print(f"Error: {stderr.decode()}")
    sys.exit(1)

blob_hash = stdout.decode().strip()
print(f"Created blob: {blob_hash}")

# Update index
result = subprocess.run(
    ['git', 'update-index', '--cacheinfo', '100644', blob_hash, file_path],
    cwd=os.getcwd(),
    capture_output=True,
    text=True
)

if result.returncode != 0:
    print(f"Error updating index: {result.stderr}")
    sys.exit(1)

print("Index updated successfully")
print(f"Verify: git ls-tree HEAD {file_path}")
