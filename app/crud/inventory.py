from fastapi import HTTPException

from sqlalchemy.orm import Session
from app.models.inventory_item import InventoryItem
from app.crud.product import get_product, create_product

def get_inventory_item(db: Session, user_uuid: str, barcode: str):
    return (
        db.query(InventoryItem)
          .filter(InventoryItem.user_uuid == user_uuid,
                  InventoryItem.barcode == barcode)
          .first()
    )

def add_inventory(db: Session, user_uuid: str, barcode: str, quantity: int):
    item = get_inventory_item(db, user_uuid, barcode)
    if not item:
        item = InventoryItem(user_uuid=user_uuid, barcode=barcode, quantity=quantity)
        db.add(item)
    else:
        item.quantity += quantity
    db.commit()
    db.refresh(item)
    return item

def delete_inventory_by_user(db: Session, user_uuid: str):
    db.query(InventoryItem).filter(user_uuid == InventoryItem.user_uuid).delete()
    db.commit()
def remove_inventory(db: Session, user_uuid: str, barcode: str, quantity: int):
    item = get_inventory_item(db, user_uuid, barcode)
    if not item:
        raise HTTPException(status_code=404, detail="Element nicht gefunden")
    if item.quantity == 0:
        raise HTTPException(status_code=409, detail="Keine Menge mehr übrig")
    item.quantity = max(item.quantity - quantity, 0)
    db.commit()
    db.refresh(item)
    return item

def list_inventory(db: Session, user_uuid: str):
    return db.query(InventoryItem).filter(InventoryItem.user_uuid == user_uuid).all()
