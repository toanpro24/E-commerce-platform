from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_en = Column(String(100), default="")
    name_zh = Column(String(100), default="")
    sort_order = Column(Integer, default=0)

    products = relationship("Product", back_populates="category")
