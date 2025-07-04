from pydantic import BaseModel

class InventoryCreate(BaseModel):
    barcode: str
    quantity: int

class InventoryOut(BaseModel):
    id: int
    user_id: str
    barcode: str
    quantity: int

    class Config:
        orm_mode = True
