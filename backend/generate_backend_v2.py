import os

base = r"c:\Users\mitul\Desktop\dns\cyberguard-dns-verification\backend"

files = {
    "app/models/website.py": """from sqlalchemy import Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from sqlalchemy.sql import func
from app.db.base import Base

class Website(Base):
    __tablename__ = "websites"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    
    original_url: Mapped[str] = mapped_column(String(1024))
    normalized_hostname: Mapped[str] = mapped_column(String(253), index=True)
    registrable_domain: Mapped[str] = mapped_column(String(253), index=True)
    
    verification_method: Mapped[str] = mapped_column(String(50), default="dns_txt")
    verification_status: Mapped[str] = mapped_column(String(20), default="pending")
    verification_scope: Mapped[str] = mapped_column(String(50), default="hostname")
    
    verification_record_name: Mapped[str] = mapped_column(String(253))
    verification_token_hash: Mapped[str] = mapped_column(String(64))
    
    verification_expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
""",
    "app/schemas/website.py": """from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime

class WebsiteCreate(BaseModel):
    url: str

class VerificationMethodRequest(BaseModel):
    method: str

class VerificationInstructions(BaseModel):
    type: str
    name: str
    value: str
    method: str
    url_path: Optional[str] = None
    meta_tag: Optional[str] = None
    header_name: Optional[str] = None

class WebsiteResponse(BaseModel):
    website_id: int
    original_url: str
    normalized_hostname: str
    registrable_domain: str
    status: str
    verification_method: str
    recommended_method: str
    available_methods: List[str]
    verification: VerificationInstructions
    expires_at: datetime

class VerifyResponse(BaseModel):
    verified: bool
    status: str
    method: str
    message: Optional[str] = None
""",
    "app/services/domain_service.py": """import tldextract
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
""",
    "app/services/verification_service.py": """import secrets
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

async def perform_verification(method: str, website, expected_hash: str) -> tuple[bool, str]:
    if method == "dns_txt":
        return await verify_dns_txt(website.verification_record_name, expected_hash)
    elif method == "http_file":
        return await verify_http_file(website.normalized_hostname, expected_hash)
    elif method == "meta_tag":
        return await verify_meta_tag(website.normalized_hostname, expected_hash)
    elif method == "http_header":
        return await verify_http_header(website.normalized_hostname, expected_hash)
    return False, "Unsupported method."
""",
    "app/api/websites.py": """from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta, timezone
from app.db.session import get_db
from app.models.website import Website
from app.schemas.website import WebsiteCreate, WebsiteResponse, VerifyResponse, VerificationInstructions, VerificationMethodRequest
from app.services.domain_service import normalize_domain, validate_domain, recommend_method
from app.services.verification_service import generate_verification_token, hash_token, perform_verification

router = APIRouter()

async def get_current_user_id(authorization: str = Header(None)) -> int:
    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        return int(authorization.replace("Bearer ", "").strip())
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

def build_instructions(website: Website, token: str):
    return VerificationInstructions(
        type="TXT" if website.verification_method == "dns_txt" else website.verification_method,
        name="_cyberguard",
        value=token,
        method=website.verification_method,
        url_path=f"/.well-known/cyberguard-verification.txt" if website.verification_method == "http_file" else None,
        meta_tag=f'<meta name="cyberguard-verification" content="{token}" />' if website.verification_method == "meta_tag" else None,
        header_name="X-CyberGuard-Verification" if website.verification_method == "http_header" else None
    )

@router.post("/", response_model=WebsiteResponse)
async def add_website(
    website_in: WebsiteCreate, 
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    dom_info = normalize_domain(website_in.url)
    hostname = dom_info["hostname"]
    registrable = dom_info["registrable"]
    
    if not validate_domain(hostname):
        raise HTTPException(status_code=400, detail="Please enter a valid public domain.")
        
    result = await db.execute(select(Website).where(Website.user_id == user_id, Website.normalized_hostname == hostname))
    if result.scalars().first():
        raise HTTPException(status_code=409, detail="This domain is already in your account.")
        
    token = generate_verification_token()
    token_hash = hash_token(token)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
    rec_method = recommend_method(hostname)
    
    new_website = Website(
        user_id=user_id,
        original_url=website_in.url.strip(),
        normalized_hostname=hostname,
        registrable_domain=registrable,
        verification_method=rec_method,
        verification_record_name=f"_cyberguard.{registrable}" if rec_method == "dns_txt" else hostname,
        verification_token_hash=token_hash,
        verification_status="pending",
        verification_scope="hostname" if rec_method != "dns_txt" else "registrable_domain",
        verification_expires_at=expires_at
    )
    db.add(new_website)
    await db.commit()
    await db.refresh(new_website)
    
    return WebsiteResponse(
        website_id=new_website.id,
        original_url=new_website.original_url,
        normalized_hostname=new_website.normalized_hostname,
        registrable_domain=new_website.registrable_domain,
        status="pending",
        verification_method=new_website.verification_method,
        recommended_method=rec_method,
        available_methods=["dns_txt", "http_file", "meta_tag", "http_header"],
        verification=build_instructions(new_website, token),
        expires_at=expires_at
    )

@router.get("/{website_id}", response_model=WebsiteResponse)
async def get_website(
    website_id: int,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Website).where(Website.id == website_id, Website.user_id == user_id))
    website = result.scalars().first()
    if not website:
        raise HTTPException(status_code=404, detail="Website not found.")
        
    return WebsiteResponse(
        website_id=website.id,
        original_url=website.original_url,
        normalized_hostname=website.normalized_hostname,
        registrable_domain=website.registrable_domain,
        status=website.verification_status,
        verification_method=website.verification_method,
        recommended_method=recommend_method(website.normalized_hostname),
        available_methods=["dns_txt", "http_file", "meta_tag", "http_header"],
        verification=build_instructions(website, "<hidden>"),
        expires_at=website.verification_expires_at
    )

@router.post("/{website_id}/verification/method")
async def select_method(
    website_id: int,
    req: VerificationMethodRequest,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Website).where(Website.id == website_id, Website.user_id == user_id))
    website = result.scalars().first()
    if not website:
        raise HTTPException(status_code=404, detail="Website not found.")
    
    if req.method not in ["dns_txt", "http_file", "meta_tag", "http_header"]:
        raise HTTPException(status_code=400, detail="Invalid method")
        
    website.verification_method = req.method
    website.verification_scope = "registrable_domain" if req.method == "dns_txt" else "hostname"
    website.verification_record_name = f"_cyberguard.{website.registrable_domain}" if req.method == "dns_txt" else website.normalized_hostname
    await db.commit()
    return {"message": "Method updated"}

@router.post("/{website_id}/verification/rotate")
async def rotate_token(
    website_id: int,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Website).where(Website.id == website_id, Website.user_id == user_id))
    website = result.scalars().first()
    if not website:
        raise HTTPException(status_code=404, detail="Website not found.")
        
    token = generate_verification_token()
    website.verification_token_hash = hash_token(token)
    website.verification_expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
    website.verification_status = "pending"
    await db.commit()
    
    return {"message": "Token rotated", "token": token}

@router.post("/{website_id}/verification/verify", response_model=VerifyResponse)
async def verify_website(
    website_id: int,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Website).where(Website.id == website_id, Website.user_id == user_id))
    website = result.scalars().first()
    if not website:
        raise HTTPException(status_code=404, detail="Website not found.")
        
    expires_at = website.verification_expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
        
    if datetime.now(timezone.utc) > expires_at:
        return VerifyResponse(verified=False, status="expired", method=website.verification_method, message="Your verification token has expired. Generate a new token.")

    success, message = await perform_verification(website.verification_method, website, website.verification_token_hash)
    
    if success:
        website.verification_status = "verified"
        website.verified_at = datetime.now(timezone.utc)
        await db.commit()
        return VerifyResponse(verified=True, status="verified", method=website.verification_method, message=message)
        
    return VerifyResponse(verified=False, status="failed", method=website.verification_method, message=message)
"""
}

for path, content in files.items():
    with open(os.path.join(base, path), "w", encoding="utf-8") as f:
        f.write(content)

print("Backend V2 files generated successfully!")
