import os
import re

base_backend = r"c:\Users\mitul\Desktop\dns\cyberguard-dns-verification\backend"

with open(os.path.join(base_backend, "app/api/websites.py"), "r", encoding="utf-8") as f:
    api = f.read()

# Replace <hidden> with website.verification_token_hash
api = api.replace('verification=build_instructions(w, "<hidden>")', 'verification=build_instructions(w, w.verification_token_hash)')
api = api.replace('verification=build_instructions(website, "<hidden>")', 'verification=build_instructions(website, website.verification_token_hash)')
api = api.replace('verification=build_instructions(existing_website, "<hidden>")', 'verification=build_instructions(existing_website, existing_website.verification_token_hash)')

# Ensure add_website uses raw token for the column
api = api.replace('token_hash = hash_token(token)', 'token_hash = token')

with open(os.path.join(base_backend, "app/api/websites.py"), "w", encoding="utf-8") as f:
    f.write(api)

# Also fix rotate_token
with open(os.path.join(base_backend, "app/api/websites.py"), "r", encoding="utf-8") as f:
    api = f.read()
api = api.replace('website.verification_token_hash = hash_token(token)', 'website.verification_token_hash = token')
with open(os.path.join(base_backend, "app/api/websites.py"), "w", encoding="utf-8") as f:
    f.write(api)

# Also update verification_service.py to compare raw tokens
with open(os.path.join(base_backend, "app/services/verification_service.py"), "r", encoding="utf-8") as f:
    svc = f.read()

svc = svc.replace('def hash_token(token: str) -> str:\n    return hashlib.sha256(token.encode()).hexdigest()', 'def hash_token(token: str) -> str:\n    return token')

with open(os.path.join(base_backend, "app/services/verification_service.py"), "w", encoding="utf-8") as f:
    f.write(svc)

print("Fixed hidden token bug!")
