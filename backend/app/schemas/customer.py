from datetime import datetime

from pydantic import BaseModel


class CustomerOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    phone: str
    address: str
    city: str
    zip_code: str
    email: str
    username: str
    role: str
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class CustomerUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    address: str | None = None
    city: str | None = None
    zip_code: str | None = None
