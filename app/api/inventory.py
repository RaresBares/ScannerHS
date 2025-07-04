from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.inventory_item import InventoryCreate, InventoryOut
from app.utils.auth import get_current_user
from app.crud.inventory import add_inventory, remove_inventory, list_inventory
from app.crud.product import get_product, create_product
from app.services.openfoodfacts import fetch_product_data

router = APIRouter()

@router.get("/", response_model=list[InventoryOut])
def get_inventory(current_user = Depends(get_current_user),
                  db: Session = Depends(SessionLocal)):
    return list_inventory(db, current_user.id)

@router.post("/scan", response_model=InventoryOut)
def scan_item(item: InventoryCreate,
              current_user = Depends(get_current_user),
              db: Session = Depends(SessionLocal)):

    prod = get_product(db, item.barcode)
    if not prod:
        meta = fetch_product_data(item.barcode)
        prod = create_product(db, item.barcode,
                              meta.name if meta else None,
                              meta.image_url if meta else None)

    return add_inventory(db, current_user.id, item.barcode, item.quantity)

@router.post("/consume", response_model=InventoryOut)
def consume_item(item: InventoryCreate,
                 current_user = Depends(get_current_user),
                 db: Session = Depends(SessionLocal)):

    res = remove_inventory(db, current_user.id, item.barcode, item.quantity)
    if not res:
        raise HTTPException(404, "Nothing to consume")
    return res
