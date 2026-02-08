from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.contact import ContactInquiry
from app.schemas.contact import ContactCreate, ContactOut

router = APIRouter(prefix="/api/contact", tags=["Contact"])


@router.post("/", response_model=ContactOut)
@router.post("", response_model=ContactOut)
def submit_inquiry(data: ContactCreate, db: Session = Depends(get_db)):
    inquiry = ContactInquiry(
        name=data.name,
        email=data.email,
        phone=data.phone,
        company=data.company,
        message=data.message,
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry
