from pydantic import BaseModel


class CategoryOut(BaseModel):
    id: int
    name: str
    name_en: str = ""
    name_zh: str = ""
    sort_order: int

    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    name: str
    name_en: str = ""
    name_zh: str = ""
    sort_order: int = 0
