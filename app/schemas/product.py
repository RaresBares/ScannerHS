from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    barcode: str
    name: Optional[str]
    image_url: Optional[str]

class ProductOut(BaseModel):
    barcode: str
    name: Optional[str]
    image_url: Optional[str]

    class Config:
        orm_mode = True
