import os

base_backend = r"c:\Users\mitul\Desktop\dns\cyberguard-dns-verification\backend"
file_path = os.path.join(base_backend, "app/api/websites.py")

with open(file_path, "r", encoding="utf-8") as f:
    api = f.read()

target_code = """    result = await db.execute(select(Website).where(Website.user_id == user_id, Website.normalized_hostname == hostname))
    if result.scalars().first():
        raise HTTPException(status_code=409, detail="This domain is already in your account.")"""

replacement_code = """    result = await db.execute(select(Website).where(Website.user_id == user_id, Website.normalized_hostname == hostname))
    existing_website = result.scalars().first()
    if existing_website:
        # Instead of throwing a 409 Conflict, simply return the existing website.
        # This improves UX by auto-redirecting them to the existing domain's status page.
        return WebsiteResponse(
            website_id=existing_website.id,
            original_url=existing_website.original_url,
            normalized_hostname=existing_website.normalized_hostname,
            registrable_domain=existing_website.registrable_domain,
            status=existing_website.verification_status,
            verification_method=existing_website.verification_method,
            recommended_method=recommend_method(existing_website.normalized_hostname),
            available_methods=["dns_txt", "http_file", "meta_tag", "http_header", "dns_cname"],
            verification=build_instructions(existing_website, "<hidden>"),
            expires_at=existing_website.verification_expires_at
        )"""

if target_code in api:
    api = api.replace(target_code, replacement_code)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(api)
    print("Fixed 409 Conflict logic successfully.")
else:
    print("Could not find the target code. Maybe it was already changed?")
