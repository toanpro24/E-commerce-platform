from pydantic import BaseModel


class ProductOut(BaseModel):
    id: int
    name: str
    name_en: str = ""
    name_zh: str = ""
    price: float
    quantity: int
    category_id: int | None
    is_active: bool
    image: str
    origin: str

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str
    name_en: str = ""
    name_zh: str = ""
    price: float
    quantity: int = 0
    category_id: int | None = None
    image: str = ""
    origin: str = ""


class ProductUpdate(BaseModel):
    name: str | None = None
    name_en: str | None = None
    name_zh: str | None = None
    price: float | None = None
    quantity: int | None = None
    category_id: int | None = None
    is_active: bool | None = None
    image: str | None = None
    origin: str | None = None
