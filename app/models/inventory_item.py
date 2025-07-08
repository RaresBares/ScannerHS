from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class InventoryItem(Base):
    __tablename__ = "inventory_items"
    id = Column(Integer, primary_key=True, index=True) # Generiert von Postgresql oder so
    user_uuid = Column(UUID(as_uuid=True), ForeignKey("users.uuid"), nullable=False)
    barcode = Column(String, ForeignKey("products.barcode"), nullable=False)
    name = Column(String, nullable=False, default="Platzhalter")  # Optional
    quantity = Column(Integer, default=0)
    upper_bound = Column(Integer, default=0)
    lower_pound = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="inventory_items")
    product = relationship("Product")
