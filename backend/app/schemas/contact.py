from pydantic import BaseModel, EmailStr
from datetime import datetime


class ContactCreate(BaseModel):
    name: str
    email: str
    phone: str = ""
    company: str = ""
    message: str


class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    company: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
