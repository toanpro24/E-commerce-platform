from pydantic import BaseModel


class CategoryOut(BaseModel):
    id: int
    name: str
    sort_order: int

    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    name: str
    sort_order: int = 0
