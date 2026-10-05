from pydantic import BaseModel, HttpUrl
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
    cname_target: Optional[str] = None

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
