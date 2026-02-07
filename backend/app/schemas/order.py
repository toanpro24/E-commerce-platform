from pydantic import BaseModel
from datetime import datetime


class OrderDetailOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product_name: str = ""

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    customer_id: int
    order_date: datetime
    status: str
    details: list[OrderDetailOut] = []
    customer_name: str = ""

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: str
