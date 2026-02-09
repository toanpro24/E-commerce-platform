from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=0)
    category_id = Column(Integer, ForeignKey("categories.id"))
    is_active = Column(Boolean, default=True)
    image = Column(String(255), default="")
    origin = Column(String(100), default="")

    category = relationship("Category", back_populates="products")
    order_details = relationship("OrderDetail", back_populates="product")
    cart_items = relationship("CartItem", back_populates="product")
