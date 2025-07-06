from sqlalchemy.orm import Session
from app.models.inventory_item import InventoryItem
from app.crud.product import get_product, create_product

def get_inventory_item(db: Session, user_id: str, barcode: str):
    return (
        db.query(InventoryItem)
          .filter(InventoryItem.user_id == user_id,
                  InventoryItem.barcode == barcode)
          .first()
    )

def add_inventory(db: Session, user_id: str, barcode: str, quantity: int):
    item = get_inventory_item(db, user_id, barcode)
    if not item:
        item = InventoryItem(user_id=user_id, barcode=barcode, quantity=quantity)
        db.add(item)
    else:
        item.quantity += quantity
    db.commit()
    db.refresh(item)
    return item

def remove_inventory(db: Session, user_id: str, barcode: str, quantity: int):
    item = get_inventory_item(db, user_id, barcode)
    if not item:
        return None
    item.quantity = max(item.quantity - quantity, 0)
    db.commit()
    db.refresh(item)
    return item

def list_inventory(db: Session, user_id: str):
    return db.query(InventoryItem).filter(InventoryItem.user_id == user_id).all()
