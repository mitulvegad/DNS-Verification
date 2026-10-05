import os

base_backend = r"c:\Users\mitul\Desktop\dns\cyberguard-dns-verification\backend"
base_frontend = r"c:\Users\mitul\Desktop\dns\cyberguard-dns-verification\frontend"

# 1. Update backend/app/schemas/website.py
with open(os.path.join(base_backend, "app/schemas/website.py"), "r", encoding="utf-8") as f:
    schema = f.read()
if "cname_target: Optional[str] = None" not in schema:
    schema = schema.replace(
        "header_name: Optional[str] = None",
        "header_name: Optional[str] = None\n    cname_target: Optional[str] = None"
    )
    with open(os.path.join(base_backend, "app/schemas/website.py"), "w", encoding="utf-8") as f:
        f.write(schema)

# 2. Update backend/app/services/verification_service.py
with open(os.path.join(base_backend, "app/services/verification_service.py"), "r", encoding="utf-8") as f:
    ver_svc = f.read()

cname_code = """
async def verify_dns_cname(record_name: str, expected_hash: str) -> tuple[bool, str]:
    resolver = dns.asyncresolver.Resolver()
    try:
        answer = await resolver.resolve(record_name, "CNAME", lifetime=5.0)
    except Exception:
        return False, "We couldn't find the CNAME verification record yet."
        
    expected_target = f"{expected_hash[:16]}.verify.cyberguard.example"
    
    for record in answer:
        target = record.target.to_text().lower().rstrip('.')
        if target == expected_target:
            return True, "Website verification successful."
            
    return False, "We found a CNAME record, but its target does not match the CyberGuard verification target."
"""
if "verify_dns_cname" not in ver_svc:
    ver_svc = ver_svc.replace(
        "async def perform_verification",
        cname_code + "\nasync def perform_verification"
    )
    ver_svc = ver_svc.replace(
        'return await verify_http_header(website.normalized_hostname, expected_hash)',
        'return await verify_http_header(website.normalized_hostname, expected_hash)\n    elif method == "dns_cname":\n        return await verify_dns_cname(website.verification_record_name, expected_hash)'
    )
    with open(os.path.join(base_backend, "app/services/verification_service.py"), "w", encoding="utf-8") as f:
        f.write(ver_svc)

# 3. Update backend/app/api/websites.py
with open(os.path.join(base_backend, "app/api/websites.py"), "r", encoding="utf-8") as f:
    api = f.read()

if "dns_cname" not in api:
    api = api.replace(
        'header_name="X-CyberGuard-Verification" if website.verification_method == "http_header" else None',
        'header_name="X-CyberGuard-Verification" if website.verification_method == "http_header" else None,\n        cname_target=f"{website.verification_token_hash[:16]}.verify.cyberguard.example" if website.verification_method == "dns_cname" else None'
    )
    api = api.replace(
        'type="TXT" if website.verification_method == "dns_txt" else website.verification_method',
        'type="CNAME" if website.verification_method == "dns_cname" else ("TXT" if website.verification_method == "dns_txt" else website.verification_method)'
    )
    api = api.replace(
        'available_methods=["dns_txt", "http_file", "meta_tag", "http_header"]',
        'available_methods=["dns_txt", "http_file", "meta_tag", "http_header", "dns_cname"]'
    )
    api = api.replace(
        'req.method not in ["dns_txt", "http_file", "meta_tag", "http_header"]',
        'req.method not in ["dns_txt", "http_file", "meta_tag", "http_header", "dns_cname"]'
    )
    api = api.replace(
        'website.verification_scope = "registrable_domain" if req.method == "dns_txt" else "hostname"',
        'website.verification_scope = "registrable_domain" if req.method in ["dns_txt", "dns_cname"] else "hostname"'
    )
    api = api.replace(
        'website.verification_record_name = f"_cyberguard.{website.registrable_domain}" if req.method == "dns_txt" else website.normalized_hostname',
        'website.verification_record_name = f"_cyberguard.{website.registrable_domain}" if req.method in ["dns_txt", "dns_cname"] else website.normalized_hostname'
    )
    with open(os.path.join(base_backend, "app/api/websites.py"), "w", encoding="utf-8") as f:
        f.write(api)

# 4. Update frontend/types/website.ts
with open(os.path.join(base_frontend, "types/website.ts"), "r", encoding="utf-8") as f:
    ts = f.read()
if "cname_target" not in ts:
    ts = ts.replace(
        "header_name?: string;",
        "header_name?: string;\n    cname_target?: string;"
    )
    with open(os.path.join(base_frontend, "types/website.ts"), "w", encoding="utf-8") as f:
        f.write(ts)

# 5. Update frontend/app/websites/[id]/verify/page.tsx
with open(os.path.join(base_frontend, "app/websites/[id]/verify/page.tsx"), "r", encoding="utf-8") as f:
    ui = f.read()

if "dns_cname" not in ui:
    ui = ui.replace(
        '<Button variant={website.verification_method === "dns_txt" ? "default" : "outline"} onClick={() => handleMethodChange("dns_txt")}>',
        '<Button variant={website.verification_method === "dns_cname" ? "default" : "outline"} onClick={() => handleMethodChange("dns_cname")}>\n                                            🌐 DNS CNAME\n                                        </Button>\n                                        <Button variant={website.verification_method === "dns_txt" ? "default" : "outline"} onClick={() => handleMethodChange("dns_txt")}>'
    )
    cname_ui = """
                                        {website.verification_method === "dns_cname" && (
                                            <>
                                                <p className="text-sm font-semibold">Add this CNAME record to your DNS provider:</p>
                                                <div><span className="font-semibold text-xs">Type:</span> <span className="font-mono bg-card px-2 py-1 rounded">CNAME</span></div>
                                                <div><span className="font-semibold text-xs">Name:</span> <span className="font-mono bg-card px-2 py-1 rounded">{website.verification.name}</span> <Button variant="ghost" size="sm" onClick={() => copyText(website.verification.name)}>Copy</Button></div>
                                                <div><span className="font-semibold text-xs">Target:</span> <span className="font-mono bg-card px-2 py-1 rounded">{website.verification.cname_target}</span> <Button variant="ghost" size="sm" onClick={() => copyText(website.verification.cname_target || "")}>Copy</Button></div>
                                                <p className="text-xs mt-2 text-muted-foreground">CyberGuard will check your domain's DNS and look for this exact CNAME target.</p>
                                            </>
                                        )}"""
    ui = ui.replace(
        '{website.verification_method === "dns_txt" && (',
        cname_ui.strip() + '\n                                        {website.verification_method === "dns_txt" && ('
    )
    with open(os.path.join(base_frontend, "app/websites/[id]/verify/page.tsx"), "w", encoding="utf-8") as f:
        f.write(ui)

print("V2 Method 5: DNS CNAME implemented successfully.")
