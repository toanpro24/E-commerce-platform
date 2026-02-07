from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    phone = Column(String(20))
    address = Column(String(200))
    city = Column(String(100))
    zip_code = Column(String(10))
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(10), default="customer")  # "customer" or "admin"

    orders = relationship("Order", back_populates="customer")
    cart_items = relationship("CartItem", back_populates="customer")
