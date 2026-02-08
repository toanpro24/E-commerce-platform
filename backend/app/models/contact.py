from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime, timezone

from app.database import Base


class ContactInquiry(Base):
    __tablename__ = "contact_inquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    phone = Column(String(50), default="")
    company = Column(String(200), default="")
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
