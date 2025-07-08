from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.auth import get_current_user

from app.database import get_db
from app.models.inventory_item import InventoryItem
from app.schemas.inventory_item import InventoryOut
from app.crud.product import get_product, create_product
from app.services.openfoodfacts import fetch_product_data
from app.crud.inventory import remove_inventory, list_inventory

router = APIRouter()








@router.get("/", response_model=list[InventoryOut])
def get_inventory(current_user = Depends(get_current_user),
                  db: Session = Depends(get_db)):
    return list_inventory(db, current_user.id)




@router.post("/scan", response_model=InventoryOut)
def scan_item(barcode: str,
              db: Session = Depends(get_db),
              current_user = Depends(get_current_user)):
    product = get_product(db, barcode)

    if not product:
        meta = fetch_product_data(barcode)
        name = meta.name if meta and meta.name else f"Unbekanntes Produkt ({barcode})"
        image_url = meta.image_url if meta and meta.image_url else None
        product = create_product(db, barcode, name, image_url)

    # Zusätzlicher Schutz, falls dein DB-Produkt trotzdem None enthält
    if not product.name:
        product.name = f"Unbekanntes Produkt ({barcode})"

    item = db.query(InventoryItem).filter_by(
        user_id=current_user.uuid,
        barcode=barcode
    ).first()

    if item:
        item.quantity += 1
        item.created_at = datetime.now()
    else:
        item = InventoryItem(
            user_id=current_user.uuid,
            barcode=product.barcode,
            name=product.name or f"Unbekanntes Produkt ({barcode})",
            quantity=1,
            created_at=datetime.utcnow()
        )
        db.add(item)

    db.commit()
    db.refresh(item)
    return item


@router.post("/consume", response_model=InventoryOut)
def consume_item(barcode: str,
                 current_user = Depends(get_current_user),
                 db: Session = Depends(get_db)):

    res = remove_inventory(db, current_user.uuid, barcode, quantity=1)
    if not res:
        raise HTTPException(status_code=404, detail="Nothing to consume")
    return res
