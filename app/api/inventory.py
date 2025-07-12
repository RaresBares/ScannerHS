from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
import csv
import io

from app.api.auth import get_current_user
from app.database import get_db
from app.models.inventory_item import InventoryItem
from app.models.product import Product
from app.schemas.inventory_item import InventoryOut, InventorySet, InventoryMetaUpdate
from app.schemas.product import ProductCreate
from app.crud.product import get_product, create_product
from app.crud.inventory import remove_inventory, list_inventory
from app.services.openfoodfacts import fetch_product_data
from app.utils.logging import log_action

router = APIRouter()

# ───────────────────────────────────────────────────────────────
# GET Endpunkte – Inventar abrufen
# ───────────────────────────────────────────────────────────────

@router.get("/", response_model=list[InventoryOut])
def get_inventory(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return list_inventory(db, current_user.uuid)


@router.get("/by_shelf/{shelf_id}", response_model=list[InventoryOut])
def get_inventory_by_shelf(shelf_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(InventoryItem).filter_by(user_uuid=current_user.uuid, shelf_id=shelf_id).all()


@router.get("/search_by_barcode", response_model=list[InventoryOut])
def search_by_barcode(fragment: str = Query(..., min_length=1), current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(InventoryItem).filter(
        InventoryItem.user_uuid == current_user.uuid,
        InventoryItem.barcode.contains(fragment)
    ).all()


@router.get("/search_by_name", response_model=list[InventoryOut])
def search_by_name(name: str = Query(..., min_length=1), current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(InventoryItem).filter(
        InventoryItem.user_uuid == current_user.uuid,
        func.lower(InventoryItem.name).contains(name.lower())
    ).order_by(func.lower(InventoryItem.name).asc()).all()


@router.get("/get_item_info/{barcode}", response_model=InventoryOut)
def get_item_info(barcode: str, user=Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(InventoryItem).filter_by(user_uuid=user.uuid, barcode=barcode).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item nicht gefunden")
    return item


@router.get("/clear_inventory", response_model=list[InventoryOut])
def clear_inventory(user=Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(InventoryItem).filter_by(user_uuid=user.uuid).delete()
    db.commit()
    log_action(user.uuid, action="clear_inventory")
    return list_inventory(db, user.uuid)


@router.get("/expiring_soon", response_model=list[InventoryOut])
def get_expiring_items(days: int = Query(7, ge=1), user=Depends(get_current_user), db: Session = Depends(get_db)):
    limit = datetime.utcnow() + timedelta(days=days)
    return db.query(InventoryItem).filter(
        InventoryItem.user_uuid == user.uuid,
        InventoryItem.exp_date != None,
        InventoryItem.exp_date <= limit
    ).order_by(InventoryItem.exp_date.asc()).all()


@router.get("/statistics", response_model=dict)
def get_statistics(user=Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(InventoryItem).filter_by(user_uuid=user.uuid).all()
    total = sum(i.quantity for i in items)
    count = len(items)
    avg = total / count if count else 0
    return {
        "total_quantity": total,
        "item_count": count,
        "average_quantity_per_item": round(avg, 2)
    }


@router.get("/duplicates", response_model=list[str])
def find_duplicates(user=Depends(get_current_user), db: Session = Depends(get_db)):
    duplicates = db.query(InventoryItem.barcode).filter(
        InventoryItem.user_uuid == user.uuid
    ).group_by(InventoryItem.barcode).having(func.count(InventoryItem.id) > 1).all()
    return [barcode for (barcode,) in duplicates]


@router.get("/export_inventory")
def export_inventory(format: str = Query("json", regex="^(json|csv)$"), user=Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(InventoryItem).filter_by(user_uuid=user.uuid).all()

    if format == "json":
        return JSONResponse(content=jsonable_encoder([InventoryOut.from_orm(item) for item in items]))

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["barcode", "name", "quantity", "shelf_id", "exp_date"])
    for item in items:
        writer.writerow([
            item.barcode,
            item.name,
            item.quantity,
            item.shelf_id,
            item.exp_date.isoformat() if item.exp_date else ""
        ])
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={
        "Content-Disposition": "attachment; filename=inventory_export.csv"
    })


# ───────────────────────────────────────────────────────────────
# POST Endpunkte – Inventar manipulieren
# ───────────────────────────────────────────────────────────────

@router.post("/quick/scan", response_model=InventoryOut)
def scan_item(barcode: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    product = get_product(db, barcode)
    if not product:
        meta = fetch_product_data(barcode)
        name = meta.name if meta and meta.name else f"Unbekanntes Produkt ({barcode})"
        image_url = meta.image_url if meta and meta.image_url else None
        product = create_product(db, barcode, name, image_url)

    if not product.name:
        product.name = f"Unbekanntes Produkt ({barcode})"

    item = db.query(InventoryItem).filter_by(user_uuid=current_user.uuid, barcode=barcode).first()
    if item:
        item.quantity += 1
        item.created_at = datetime.utcnow()
    else:
        item = InventoryItem(
            user_uuid=current_user.uuid,
            barcode=product.barcode,
            name=product.name,
            quantity=1,
            created_at=datetime.utcnow()
        )
        db.add(item)

    db.commit()
    db.refresh(item)
    log_action(current_user.uuid, action="scan", barcode=barcode)
    return item


@router.post("/quick/consume", response_model=InventoryOut)
def consume_item(barcode: str, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    res = remove_inventory(db, current_user.uuid, barcode, quantity=1)
    if not res:
        raise HTTPException(status_code=404, detail="Nothing to consume")
    log_action(current_user.uuid, action="consume", barcode=barcode)
    return res


@router.post("/adjust_amount", response_model=InventoryOut)
def adjust_amount(barcode: str, delta: int = Query(...), user=Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(InventoryItem).filter_by(user_uuid=user.uuid, barcode=barcode).first()
    if not item:
        raise HTTPException(404, "Item nicht gefunden")
    item.quantity = max(0, item.quantity + delta)
    db.commit()
    db.refresh(item)
    log_action(user.uuid, action="adjust", barcode=barcode, details={"delta": delta})
    return item


@router.post("/set_amount", response_model=list[InventoryOut])
def set_amount(payload: InventorySet, user=Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter_by(barcode=payload.barcode).first()
    if not product:
        if not payload.create_product_if_missing:
            raise HTTPException(404, "Produkt nicht gefunden")
        if payload.created_product is None:
            raise HTTPException(400, "Produktdaten fehlen für Neuanlage")
        product = Product(**payload.created_product.dict())
        db.add(product)
        db.flush()

    item = db.query(InventoryItem).filter_by(user_uuid=user.uuid, barcode=payload.barcode).first()
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
    log_action(user.uuid, action="set_amount", barcode=payload.barcode, details={"quantity": payload.quantity})
    return db.query(InventoryItem).filter_by(user_uuid=user.uuid).all()


# ───────────────────────────────────────────────────────────────
# DELETE – Item löschen
# ───────────────────────────────────────────────────────────────

@router.delete("/delete_item/{barcode}", response_model=dict)
def delete_item(barcode: str, user=Depends(get_current_user), db: Session = Depends(get_db)):
    deleted = db.query(InventoryItem).filter_by(user_uuid=user.uuid, barcode=barcode).delete()
    db.commit()
    if deleted == 0:
        raise HTTPException(404, "Item nicht gefunden")
    log_action(user.uuid, action="delete", barcode=barcode)
    return {"status": "deleted"}


@router.delete("/clear_shelf/{shelf_id}", response_model=dict)
def clear_shelf(shelf_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    deleted = db.query(InventoryItem).filter_by(user_uuid=user.uuid, shelf_id=shelf_id).delete()
    db.commit()
    log_action(user.uuid, action="clear_shelf", shelf_id=shelf_id)
    return {"status": "deleted", "shelf_id": shelf_id}


# ───────────────────────────────────────────────────────────────
# PATCH – Metadaten aktualisieren
# ───────────────────────────────────────────────────────────────

@router.patch("/update_metadata/{barcode}", response_model=InventoryOut)
def update_metadata(barcode: str, updates: InventoryMetaUpdate = Body(...), user=Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(InventoryItem).filter_by(user_uuid=user.uuid, barcode=barcode).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item nicht gefunden")

    data = updates.dict(exclude_unset=True)
    for key, value in data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)
    log_action(user.uuid, action="update_metadata", barcode=barcode, details=data)
    return item
