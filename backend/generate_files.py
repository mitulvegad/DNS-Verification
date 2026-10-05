import os

base = r"c:\Users\mitul\Desktop\dns\cyberguard-dns-verification\backend"

files = {
    "app/db/base.py": """from sqlalchemy.orm import declarative_base

Base = declarative_base()
""",
    "app/db/session.py": """from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession
import os

# Using sqlite for ease of use in the mini project demo, though PostgreSQL was suggested. 
# SQLite is simpler to setup immediately without requiring Docker running, but we can stick to PostgreSQL.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./cyberguard.db")

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
""",
    "app/models/user.py": """from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from datetime import datetime
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now())
""",
    "app/models/website.py": """from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from sqlalchemy.sql import func
from app.db.base import Base

class Website(Base):
    __tablename__ = "websites"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    domain: Mapped[str] = mapped_column(String(253), index=True)
    verification_record_name: Mapped[str] = mapped_column(String(253))
    verification_token_hash: Mapped[str] = mapped_column(String(64))
    verification_status: Mapped[str] = mapped_column(
        String(20),
        default="pending",
        nullable=False,
    )
    verification_expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    verified_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False,
    )
""",
    "app/schemas/website.py": """from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class WebsiteCreate(BaseModel):
    url: str

class VerificationInstructions(BaseModel):
    type: str = "TXT"
    name: str
    value: str

class WebsiteResponse(BaseModel):
    website_id: int
    domain: str
    verification: VerificationInstructions
    status: str
    expires_at: datetime

class VerifyResponse(BaseModel):
    verified: bool
    status: str
    domain: str
    message: Optional[str] = None
""",
    "app/services/domain_service.py": """import tldextract
import re

def normalize_domain(url: str) -> str:
    # Use tldextract to get the registered domain
    ext = tldextract.extract(url)
    domain = f"{ext.domain}.{ext.suffix}"
    return domain.lower()

def validate_domain(domain: str) -> bool:
    if not domain or domain.startswith('.') or domain.endswith('.'):
        return False
    if not re.match(r"^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$", domain):
        return False
    # Reject common internal IPs or localhost (simplistic check for project)
    if domain in ["localhost", "127.0.0.1"] or re.match(r"^10\.|^192\.168\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.", domain):
        return False
    return True
""",
    "app/services/verification_service.py": """import secrets
import hashlib
import hmac
import dns.asyncresolver
import dns.exception
import dns.resolver

def generate_verification_token() -> str:
    return f"cg_verify_{secrets.token_urlsafe(32)}"

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def verify_token(token: str, expected_hash: str) -> bool:
    token_hash = hash_token(token)
    return hmac.compare_digest(token_hash, expected_hash)

async def get_txt_records(record_name: str) -> list[str]:
    resolver = dns.asyncresolver.Resolver()
    try:
        answer = await resolver.resolve(record_name, "TXT", lifetime=5.0)
    except (
        dns.resolver.NXDOMAIN,
        dns.resolver.NoAnswer,
        dns.resolver.NoNameservers,
        dns.exception.Timeout,
    ):
        return []

    values: list[str] = []
    for record in answer:
        value = b"".join(record.strings).decode("utf-8", errors="replace")
        values.append(value)

    return values
""",
    "app/api/auth.py": """from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.user import User
from passlib.hash import argon2

router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int

@router.post("/register", response_model=Token)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = argon2.hash(user.password)
    new_user = User(email=user.email, password_hash=hashed_password)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return {"access_token": f"{new_user.id}", "token_type": "bearer", "user_id": new_user.id}

@router.post("/login", response_model=Token)
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    db_user = result.scalars().first()
    
    if not db_user or not argon2.verify(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    return {"access_token": f"{db_user.id}", "token_type": "bearer", "user_id": db_user.id}
""",
    "app/api/websites.py": """from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta, timezone
from app.db.session import get_db
from app.models.website import Website
from app.schemas.website import WebsiteCreate, WebsiteResponse, VerifyResponse, VerificationInstructions
from app.services.domain_service import normalize_domain, validate_domain
from app.services.verification_service import generate_verification_token, hash_token, get_txt_records, verify_token

router = APIRouter()

# Dummy dependency to get user from token for this mini-project
async def get_current_user_id(authorization: str = Header(None)) -> int:
    if not authorization:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        user_id = int(authorization.replace("Bearer ", "").strip())
        return user_id
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/", response_model=WebsiteResponse)
async def add_website(
    website_in: WebsiteCreate, 
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    domain = normalize_domain(website_in.url)
    if not domain or not validate_domain(domain):
        raise HTTPException(status_code=400, detail="Please enter a valid public domain.")
        
    # Check duplicate
    result = await db.execute(select(Website).where(Website.user_id == user_id, Website.domain == domain))
    if result.scalars().first():
        raise HTTPException(status_code=409, detail="This domain is already in your account.")
        
    token = generate_verification_token()
    token_hash = hash_token(token)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
    record_name = f"_cyberguard" # Frontend usually only needs this
    full_record_name = f"_cyberguard.{domain}"
    
    new_website = Website(
        user_id=user_id,
        domain=domain,
        verification_record_name=full_record_name,
        verification_token_hash=token_hash,
        verification_status="pending",
        verification_expires_at=expires_at
    )
    db.add(new_website)
    await db.commit()
    await db.refresh(new_website)
    
    # Store token in memory for now so we can return it. (Only shown once!)
    
    return WebsiteResponse(
        website_id=new_website.id,
        domain=domain,
        verification=VerificationInstructions(
            type="TXT",
            name="_cyberguard",
            value=token
        ),
        status="pending",
        expires_at=expires_at
    )

@router.post("/{website_id}/verify", response_model=VerifyResponse)
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
        raise HTTPException(status_code=400, detail="Verification token has expired.")
        
    txt_records = await get_txt_records(website.verification_record_name)
    if not txt_records:
        return VerifyResponse(
            verified=False,
            status="pending",
            domain=website.domain,
            message="TXT record not found yet."
        )
        
    for record in txt_records:
        clean_record = record.strip('"')
        if verify_token(clean_record, website.verification_token_hash):
            website.verification_status = "verified"
            website.verified_at = datetime.now(timezone.utc)
            await db.commit()
            return VerifyResponse(
                verified=True,
                status="verified",
                domain=website.domain,
                message="Domain ownership verified successfully."
            )
            
    return VerifyResponse(
        verified=False,
        status="pending",
        domain=website.domain,
        message="The TXT record was found, but its value does not match."
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
        domain=website.domain,
        verification=VerificationInstructions(
            type="TXT",
            name="_cyberguard",
            value="<hidden>"
        ),
        status=website.verification_status,
        expires_at=website.verification_expires_at
    )
""",
    "app/main.py": """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, websites
from app.db.base import Base
from app.db.session import engine

app = FastAPI(title="CyberGuard DNS Verification")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(websites.router, prefix="/websites", tags=["websites"])

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
def read_root():
    return {"message": "CyberGuard API"}
"""
}

for path, content in files.items():
    with open(os.path.join(base, path), "w", encoding="utf-8") as f:
        f.write(content)

print("Backend files generated successfully!")
