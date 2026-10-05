import tldextract
import re
from urllib.parse import urlparse

def parse_url(url: str):
    url = url.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url
    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    hostname = hostname.lower().rstrip('.')
    return hostname

def normalize_domain(url: str) -> dict:
    hostname = parse_url(url)
    ext = tldextract.extract(hostname)
    registrable_domain = f"{ext.domain}.{ext.suffix}"
    return {
        "hostname": hostname,
        "registrable": registrable_domain
    }

def validate_domain(hostname: str) -> bool:
    if not hostname or hostname.startswith('.') or hostname.endswith('.'):
        return False
    if not re.match(r"^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$", hostname):
        return False
    # SSRF Protection: Reject common internal IPs/localhost
    if hostname in ["localhost", "127.0.0.1"] or re.match(r"^10\.|^192\.168\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.", hostname):
        return False
    return True

def recommend_method(hostname: str) -> str:
    # Very simple recommendation engine
    if "vercel.app" in hostname or "netlify.app" in hostname or "infinityfree" in hostname:
        return "http_file"
    return "dns_txt"
