from sqlalchemy import Integer, String, DateTime, ForeignKey, Enum
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
