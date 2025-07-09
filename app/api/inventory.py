from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.auth import get_current_user

from app.database import get_db
from app.models.inventory_item import InventoryItem
from app.schemas.inventory_item import InventoryOut, InventoryCreate
from app.crud.product import get_product, create_product
from app.schemas.inventory_item import InventorySet
from app.schemas.product         import ProductCreate

from app.services.openfoodfacts import fetch_product_data
from app.crud.inventory import remove_inventory, list_inventory

router = APIRouter()


@router.get("/", response_model=list[InventoryOut])
def get_inventory(current_user=Depends(get_current_user),
                  db: Session = Depends(get_db)):
    return list_inventory(db, current_user.id)




##TODO: Optional FETCH of Data from API --> Should be able to also provide the metadata
@router.post("/quick/scan", response_model=InventoryOut)
def scan_item(barcode: str,
              db: Session = Depends(get_db),
              current_user=Depends(get_current_user)):
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
        user_uuid=current_user.uuid,
        barcode=barcode
    ).first()

    if item:
        item.quantity += 1
        item.created_at = datetime.now()
    else:
        item = InventoryItem(
            user_uuid=current_user.uuid,
            barcode=product.barcode,
            name=product.name or f"Unbekanntes Produkt ({barcode})",
            quantity=1,
            created_at=datetime.utcnow()
        )
        db.add(item)

    db.commit()
    db.refresh(item)
    return item


@router.get("/clear_inventory", response_model=list[InventoryOut])
def clear_inventory(user=Depends(get_current_user),
                    db: Session = Depends(get_db)):
    db.query(
        InventoryItem
    ).filter_by(user_uuid=user.uuid).delete()
    db.commit()
    return list_inventory(db, user.uuid)


from datetime import datetime


from fastapi import HTTPException
from app.models.product import Product

from typing import Optional
from fastapi import Body, Query, HTTPException, Depends


@router.post("/set_amount", response_model=list[InventoryOut])
def set_amount(
    payload: InventorySet,                        # alles aus JSON-Body
    user=Depends(get_current_user),
    db=Depends(get_db),
):
    # 1. Produkt prüfen
    product = db.query(Product).filter_by(barcode=payload.barcode).first()
    if not product:
        if not payload.create_product_if_missing:
            raise HTTPException(404, "Produkt nicht gefunden")
        if payload.created_product is None:
            raise HTTPException(400, "Produktdaten fehlen für Neuanlage")
        # Neues Produkt anlegen
        product = Product(**payload.created_product.dict())
        db.add(product)
        db.flush()

    # 2. Inventar anlegen/aktualisieren
    item = (
        db.query(InventoryItem)
          .filter_by(user_uuid=user.uuid, barcode=payload.barcode)
          .first()
    )
    if not item:
        item = InventoryItem(
            user_uuid=user.uuid,
            barcode=payload.barcode,
            quantity=payload.quantity,
            created_at=datetime.utcnow()
        )
        db.add(item)
    else:
        item.quantity = payload.quantity

    db.commit()
    return db.query(InventoryItem).filter_by(user_uuid=user.uuid).all()


@router.post("/quick/consume", response_model=InventoryOut)
def consume_item(barcode: str,
                 current_user=Depends(get_current_user),
                 db: Session = Depends(get_db)):
    res = remove_inventory(db, current_user.uuid, barcode, quantity=1)
    if not res:
        raise HTTPException(status_code=404, detail="Nothing to consume")
    return res


@router.get("/get_item_info/{barcode}", response_model=InventoryOut)
def get_item(
    barcode: str,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # 1. Suche das InventoryItem in der DB
    item = (
        db.query(InventoryItem)
          .filter_by(user_uuid=user.uuid, barcode=barcode)
          .first()
    )
    # 2. Falls nicht gefunden, 404
    if not item:
        raise HTTPException(status_code=404, detail="Item nicht gefunden")
    return item