from typing import Optional
from uuid import UUID
from pydantic import BaseModel, field_serializer
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.product import ProductCreate
from app.schemas.product         import ProductCreate


class InventoryCreate(BaseModel):
    barcode: str
    quantity: int
    model_config = {"from_attributes": True}


class InventoryOut(BaseModel):
    id: int
    user_uuid: UUID
    barcode: str
    upper_bound: int
    lower_bound: int
    quantity: int
    model_config = {"from_attributes": True}

    @field_serializer("user_uuid")
    def serialize_user_uuid(self, v: UUID) -> str:
        return str(v)


class InventorySet(BaseModel):
    """
    DTO für den Endpunkt `set_amount`.

    Attributes:
        barcode (str): Eindeutiger Barcode des Produkts.
        quantity (int): Gewünschte Menge im Inventar.
        create_product_if_missing (bool): Gibt an, ob bei fehlendem Produkt automatisch ein neues angelegt werden soll. Standard: False.
        created_product (Optional[ProductCreate]): Produktdaten zur Neuanlage; erforderlich, wenn `create_product_if_missing=True`.
    """
    barcode: str = Field(
        ..., description="Eindeutiger Barcode des Produkts."
    )
    quantity: int = Field(
        ..., description="Menge, die im Inventar gesetzt werden soll."
    )
    create_product_if_missing: bool = Field(
        False,
        description="True, wenn bei fehlendem Produkt automatisch ein neues angelegt werden soll."
    )
    created_product: Optional[ProductCreate] = Field(
        None,
        description="Daten für die Neuanlage des Produkts (erforderlich, wenn create_product_if_missing=True)."
    )
