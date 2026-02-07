from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    order_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String(20), default="Pending")  # Pending, Shipped, Delivered

    customer = relationship("Customer", back_populates="orders")
    details = relationship("OrderDetail", back_populates="order", cascade="all, delete-orphan")
