import secrets
import hashlib
import hmac
import dns.asyncresolver
import httpx
from bs4 import BeautifulSoup
import ipaddress
import socket
from urllib.parse import urlparse

def generate_verification_token() -> str:
    return f"cg_verify_{secrets.token_urlsafe(32)}"

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def verify_token(token: str, expected_hash: str) -> bool:
    token_hash = hash_token(token)
    return hmac.compare_digest(token_hash, expected_hash)

async def check_ssrf(hostname: str) -> bool:
    try:
        ip = socket.gethostbyname(hostname)
        ip_obj = ipaddress.ip_address(ip)
        if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_link_local or ip_obj.is_multicast or ip_obj.is_reserved:
            return False
        return True
    except socket.gaierror:
        return False

async def verify_dns_txt(record_name: str, expected_hash: str) -> tuple[bool, str]:
    resolver = dns.asyncresolver.Resolver()
    try:
        answer = await resolver.resolve(record_name, "TXT", lifetime=5.0)
    except Exception as e:
        return False, "We couldn't find the verification TXT record yet."

    for record in answer:
        val = b"".join(record.strings).decode("utf-8", errors="replace").strip('"')
        if verify_token(val, expected_hash):
            return True, "Website verification successful."
    return False, "The verification token was found, but it does not match."

async def verify_http_file(hostname: str, expected_hash: str) -> tuple[bool, str]:
    if not await check_ssrf(hostname):
        return False, "Target resolves to an unsupported private/internal IP."
        
    url = f"https://{hostname}/.well-known/cyberguard-verification.txt"
    try:
        async with httpx.AsyncClient(timeout=5.0, follow_redirects=False) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                val = resp.text.strip()
                if verify_token(val, expected_hash):
                    return True, "Website verification successful."
                return False, "The verification token was found, but it does not match."
            return False, "The verification file could not be found."
    except Exception:
        return False, "Website unreachable."

async def verify_meta_tag(hostname: str, expected_hash: str) -> tuple[bool, str]:
    if not await check_ssrf(hostname):
        return False, "Target resolves to an unsupported private/internal IP."

    url = f"https://{hostname}/"
    try:
        async with httpx.AsyncClient(timeout=5.0, follow_redirects=True, max_redirects=2) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, 'html.parser')
                meta = soup.find('meta', attrs={'name': 'cyberguard-verification'})
                if meta and meta.get('content'):
                    val = meta['content'].strip()
                    if verify_token(val, expected_hash):
                        return True, "Website verification successful."
                    return False, "The verification token was found, but it does not match."
            return False, "Meta tag not found."
    except Exception:
        return False, "Website unreachable."

async def verify_http_header(hostname: str, expected_hash: str) -> tuple[bool, str]:
    if not await check_ssrf(hostname):
        return False, "Target resolves to an unsupported private/internal IP."

    url = f"https://{hostname}/"
    try:
        async with httpx.AsyncClient(timeout=5.0, follow_redirects=False) as client:
            resp = await client.get(url)
            val = resp.headers.get('X-CyberGuard-Verification')
            if val:
                val = val.strip()
                if verify_token(val, expected_hash):
                    return True, "Website verification successful."
                return False, "The verification token was found, but it does not match."
            return False, "Verification header missing."
    except Exception:
        return False, "Website unreachable."


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

async def perform_verification(method: str, website, expected_hash: str) -> tuple[bool, str]:
    if method == "dns_txt":
        return await verify_dns_txt(website.verification_record_name, expected_hash)
    elif method == "http_file":
        return await verify_http_file(website.normalized_hostname, expected_hash)
    elif method == "meta_tag":
        return await verify_meta_tag(website.normalized_hostname, expected_hash)
    elif method == "http_header":
        return await verify_http_header(website.normalized_hostname, expected_hash)
    elif method == "dns_cname":
        return await verify_dns_cname(website.verification_record_name, expected_hash)
    return False, "Unsupported method."
