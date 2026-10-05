from fastapi import APIRouter, Depends, HTTPException, status, Header
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
        type="CNAME" if website.verification_method == "dns_cname" else ("TXT" if website.verification_method == "dns_txt" else website.verification_method),
        name="_cyberguard",
        value=token,
        method=website.verification_method,
        url_path=f"/.well-known/cyberguard-verification.txt" if website.verification_method == "http_file" else None,
        meta_tag=f'<meta name="cyberguard-verification" content="{token}" />' if website.verification_method == "meta_tag" else None,
        header_name="X-CyberGuard-Verification" if website.verification_method == "http_header" else None,
        cname_target=f"{website.verification_token_hash[:16]}.verify.cyberguard.example" if website.verification_method == "dns_cname" else None
    )


@router.get("/", response_model=list[WebsiteResponse])
async def list_websites(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Website).where(Website.user_id == user_id).order_by(Website.created_at.desc()))
    websites = result.scalars().all()
    
    return [
        WebsiteResponse(
            website_id=w.id,
            original_url=w.original_url,
            normalized_hostname=w.normalized_hostname,
            registrable_domain=w.registrable_domain,
            status=w.verification_status,
            verification_method=w.verification_method,
            recommended_method=recommend_method(w.normalized_hostname),
            available_methods=["dns_txt", "http_file", "meta_tag", "http_header", "dns_cname"],
            verification=build_instructions(w, w.verification_token_hash),
            expires_at=w.verification_expires_at
        )
        for w in websites
    ]

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
            verification=build_instructions(existing_website, existing_website.verification_token_hash),
            expires_at=existing_website.verification_expires_at
        )
        
    token = generate_verification_token()
    token_hash = token
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
        available_methods=["dns_txt", "http_file", "meta_tag", "http_header", "dns_cname"],
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
        available_methods=["dns_txt", "http_file", "meta_tag", "http_header", "dns_cname"],
        verification=build_instructions(website, website.verification_token_hash),
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
    
    if req.method not in ["dns_txt", "http_file", "meta_tag", "http_header", "dns_cname"]:
        raise HTTPException(status_code=400, detail="Invalid method")
        
    website.verification_method = req.method
    website.verification_scope = "registrable_domain" if req.method in ["dns_txt", "dns_cname"] else "hostname"
    website.verification_record_name = f"_cyberguard.{website.registrable_domain}" if req.method in ["dns_txt", "dns_cname"] else website.normalized_hostname
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
    website.verification_token_hash = token
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
