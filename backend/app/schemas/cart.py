from pydantic import BaseModel


class CartItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    product_name: str = ""
    product_price: float = 0.0
    product_image: str = ""

    class Config:
        from_attributes = True


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int
