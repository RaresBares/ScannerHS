from fastapi import APIRouter, File, UploadFile, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.utils.auth import get_current_user
from app.utils.file import save_upload_file
from app.models.product import Product
from app.models.user import User

router = APIRouter()

@router.post("/upload/profile")
def upload_profile(file: UploadFile = File(...),
                   current_user: User = Depends(get_current_user),
                   db: Session = Depends(SessionLocal)):
    path = save_upload_file(file, "profiles")
    current_user.profile_image = path
    db.commit()
    return {"url": path}

@router.post("/upload/product")
def upload_product_image(barcode: str, file: UploadFile = File(...),
                         db: Session = Depends(SessionLocal)):
    path = save_upload_file(file, "products")
    prod = db.query(Product).filter(Product.barcode == barcode).first()
    if prod:
        prod.image_url = path
        db.commit()
    return {"url": path}
