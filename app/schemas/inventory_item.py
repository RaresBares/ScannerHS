from uuid import UUID
from pydantic import BaseModel

class InventoryCreate(BaseModel):
    barcode: str
    quantity: int

class InventoryOut(BaseModel):
    id: int
    user_id: UUID  # ← hier geändert
    barcode: str
    upper_bound: int
    lower_bound: int
    quantity: int

    class Config:
        orm_mode = True
